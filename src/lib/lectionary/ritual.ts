import { SPECIAL_SECTIONS } from "@/lib/special-masses";
import raw from "./ritual.json";
import type { Scripture } from "./types";
import { YEAR_A } from "./yearA";

export type RitualReading = {
  id: string;
  n: number;
  citation: string;
  heading?: string;
  source?: string;
  text?: string;
  response?: string;
  stanzas?: string[];
};

export type RitualBank = {
  id: string;
  title: string;
  partial?: boolean;
  ot: RitualReading[];
  nt: RitualReading[];
  psalm: RitualReading[];
  alleluia: RitualReading[];
  gospel: RitualReading[];
};

export type RitualPick = {
  bank?: string;
  ot?: string;
  nt?: string;
  ps?: string;
  al?: string;
  g?: string;
};

export type ResolvedRitual = {
  note?: string;
  ot: Scripture | null;
  nt: Scripture | null;
  psalm: { citation: string; response: string; stanzas: string[] } | null;
  alleluia: string | null;
  alleluiaCitation?: string;
  gospel: Scripture | null;
};

export type RitualChooser = {
  partial: boolean;
  banks: { id: string; title: string }[];
  bankId: string;
  ot: { id: string; label: string }[];
  nt: { id: string; label: string }[];
  psalms: { id: string; label: string }[];
  alleluia: { id: string; label: string }[];
  gospels: { id: string; label: string }[];
};

const BANKS = raw as Record<string, RitualBank>;

const SHORT: Record<string, string> = {
  readers: "Rida",
  acolytes: "Akolait",
};

const FIXED: Record<string, { key: string; note: string }> = {
  "m935-34": {
    key: "sunday.lent.1",
    note: "Rit i kam long Sande namba wan bilong Lent.",
  },
  "m937-35": {
    key: "sunday.lent.3",
    note: "Ol i mas ritim Gutnius bilong Meri bilong Samaria.",
  },
  "m937-36": {
    key: "sunday.lent.3",
    note: "Ol i mas ritim Gutnius bilong Meri bilong Samaria.",
  },
  "m939-37": {
    key: "sunday.lent.4",
    note: "Ol i mas ritim Gutnius bilong Man i aipas.",
  },
  "m940-38": {
    key: "sunday.lent.5",
    note: "Ol i mas ritim Gutnius bilong Lasarus.",
  },
};

const META = new Map<string, { sectionId: string; title: string }>();
for (const section of SPECIAL_SECTIONS) {
  for (const group of section.groups) {
    for (const item of group.items) {
      META.set(item.id, { sectionId: section.id, title: item.title });
    }
  }
}

function bankIdsFor(massId: string): string[] | null {
  const meta = META.get(massId);
  if (!meta) return null;
  const t = meta.title.toLowerCase();
  if (meta.sectionId === "s5") {
    if (/no (bin )?kisim baptais/.test(t)) return ["funeral-unbaptized"];
    if (/pikinini/.test(t)) return ["funeral-baptized"];
    return ["funeral-adult"];
  }
  if (meta.sectionId !== "s2") return null;
  if (/rida|akolait/.test(t)) return ["readers", "acolytes"];
  if (/baptais/.test(t)) return ["baptism"];
  if (/konpirmasio/.test(t)) return ["confirmation"];
  if (/unsio|viatikum|laik i dai/.test(t)) return ["anointing"];
  if (/marit/.test(t) && !/relijis/.test(t)) return ["marriage"];
  if (/bisop|pris|diken/.test(t)) return ["orders"];
  return null;
}

function bankById(id: string): RitualBank | null {
  return BANKS[id] ?? null;
}

function chosenBank(massId: string, pick?: RitualPick | null): RitualBank | null {
  const ids = bankIdsFor(massId);
  if (!ids?.length) return null;
  const id = pick?.bank && ids.includes(pick.bank) ? pick.bank : ids[0];
  return id ? bankById(id) : null;
}

function optionLabel(item: RitualReading): string {
  const head = (item.heading || item.response || "").replace(/\s+/g, " ").trim();
  const short = head.length > 72 ? `${head.slice(0, 70)}…` : head;
  return short ? `${item.n}. ${item.citation} — ${short}` : `${item.n}. ${item.citation}`;
}

function pickItem(items: RitualReading[], id?: string): RitualReading | null {
  if (!items.length) return null;
  return items.find((item) => item.id === id) ?? items[0] ?? null;
}

/** Skip a citation-only incipit when a reading with the actual text is available. */
function pickScripture(items: RitualReading[], id?: string): RitualReading | null {
  if (!items.length) return null;
  if (id) return items.find((item) => item.id === id) ?? items[0] ?? null;
  return items.find((item) => (item.text || "").trim().length > 80) ?? items[0] ?? null;
}

function gospelVoice(item: RitualReading): string {
  const blob = `${item.source ?? ""} ${item.citation}`;
  let name = "N.";
  if (/matyu|\bmt\b/i.test(blob)) name = "Matyu";
  else if (/\bluk\b|\blu\b|\blk\b/i.test(blob)) name = "Luk";
  else if (/\bjon\b|\bjo\b|\bjn\b/i.test(blob)) name = "Jon";
  else if (/\bmak\b|\bmk\b/i.test(blob)) name = "Mak";
  if (item.source?.includes("Santu")) return item.source.replace(/\.$/, "");
  return `✠ Rit i kam long holi Gutnius, Santu ${name} i raitim`;
}

function asScripture(item: RitualReading | null, gospel: boolean): Scripture | null {
  if (!item) return null;
  const full = (item.text || "").trim();
  if (full.length <= 80) return null;
  return {
    source: gospel ? gospelVoice(item) : item.source || "",
    citation: item.citation,
    text: full,
  };
}

function fromYearA(key: string, note: string): ResolvedRitual | null {
  const rec = YEAR_A[key];
  if (!rec?.r?.t || !rec.g?.t || !rec.p) return null;
  return {
    note,
    ot: { source: rec.r.s, citation: rec.r.c, text: rec.r.t },
    nt: rec.r2 ? { source: rec.r2.s, citation: rec.r2.c, text: rec.r2.t } : null,
    psalm: { citation: rec.p.c, response: rec.p.r, stanzas: rec.p.s },
    alleluia: rec.a || null,
    gospel: { source: rec.g.s, citation: rec.g.c, text: rec.g.t },
  };
}

export function ritualChooser(massId: string, pick?: RitualPick | null): RitualChooser | null {
  const ids = bankIdsFor(massId);
  if (!ids?.length) return null;
  const bank = chosenBank(massId, pick);
  if (!bank) return null;
  const toOpt = (items: RitualReading[]) => items.map((item) => ({ id: item.id, label: optionLabel(item) }));
  return {
    partial: Boolean(bank.partial),
    banks: ids.map((id) => ({ id, title: SHORT[id] || BANKS[id]?.title || id })),
    bankId: bank.id,
    ot: toOpt(bank.ot),
    nt: toOpt(bank.nt),
    psalms: toOpt(bank.psalm),
    alleluia: toOpt(bank.alleluia),
    gospels: toOpt(bank.gospel),
  };
}

/** Readings for a ritual mass or a mass for the dead. Null if this mass has no lectionary. */
export function resolveRitual(massId: string, pick?: RitualPick | null): ResolvedRitual | null {
  const fixed = FIXED[massId];
  if (fixed) return fromYearA(fixed.key, fixed.note);
  const bank = chosenBank(massId, pick);
  if (!bank) return null;
  const ot = pickScripture(bank.ot, pick?.ot);
  const nt = pickScripture(bank.nt, pick?.nt);
  const ps = pickItem(bank.psalm, pick?.ps);
  const al = pickItem(bank.alleluia, pick?.al);
  const g = pickItem(bank.gospel, pick?.g);
  const note = bank.partial
    ? "Sampela rit i gat cita tasol. Sapos tok i no stap hia, ritim long Baibel."
    : undefined;
  return {
    note,
    ot: asScripture(ot, false),
    nt: asScripture(nt, false),
    psalm: ps
      ? {
          citation: ps.citation,
          response: ps.response || ps.heading || "",
          stanzas: ps.stanzas ?? [],
        }
      : null,
    alleluia: (al?.text || "").trim() || null,
    alleluiaCitation: al?.citation,
    gospel: asScripture(g, true),
  };
}
