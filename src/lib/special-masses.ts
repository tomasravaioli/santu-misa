import type { LiturgicalDay } from "./calendar";
import raw from "./special-masses.json";
import { APPENDIX_ITEMS } from "./appendices";
import {
  borrowedCommonPage,
  commonPrefaceChoices,
  deadPrefaceChoices,
  prefaceChoicesFromRef,
  seasonalPrefaceChoices,
  maryCommon,
  splitAntiphon,
  isPriestMartyrMemorial,
  saintBringsWholeMass,
  saintCommonRef,
  type PrefaceChoice,
  type Proper,
} from "./propers";

export type SpecialAntiphon = { text: string; cite?: string; alt?: { text: string; cite?: string } };

export type SpecialOwnPreface = {
  page: number;
  title: string;
  subtitle?: string | null;
  text: string;
};

export type SpecialPreface = {
  refs?: string[];
  own?: SpecialOwnPreface[];
  season?: boolean;
};

export type SpecialMass = {
  id: string;
  title: string;
  page: number;
  entrance?: SpecialAntiphon;
  collect?: string;
  offerings?: string;
  communion?: SpecialAntiphon;
  postcommunion?: string;
  /** Only the collect is proper. Do not fill the rest from a common, and do not show empty slots. */
  collectOnly?: boolean;
  /** Shown in the index as a red heading, not as a black mass button. */
  heading?: boolean;
  /** An appendix, read on its own and not inside a Mass. */
  appendix?: boolean;
  /** This mass includes the Gloria. */
  gloria?: boolean;
  /** Use the readings of the day, not a ritual lectionary. */
  dayReadings?: boolean;
  /** Nuptial blessing, said after the Our Father and before the embolism. */
  blessing?: { voice: "rubric" | "priest" | "people"; text: string }[];
  prefaceNote?: string;
  preface?: SpecialPreface | null;
};

export type SpecialGroup = {
  title: string;
  items: SpecialMass[];
};

export type SpecialSection = {
  id: string;
  title: string;
  groups: SpecialGroup[];
};

export const SPECIAL_SECTIONS: SpecialSection[] = [
  ...(raw.sections as SpecialSection[]),
  {
    id: "apx",
    title: "OL APENDIKS BILONG BUK MISA",
    groups: [{ title: "", items: APPENDIX_ITEMS }],
  },
];

const BY_ID = new Map<string, SpecialMass>();
const SECTION_OF = new Map<string, { sectionId: string; group: string }>();
for (const section of SPECIAL_SECTIONS) {
  for (const group of section.groups) {
    for (const item of group.items) {
      BY_ID.set(item.id, item);
      SECTION_OF.set(item.id, { sectionId: section.id, group: group.title });
    }
  }
}

export function specialSectionId(id: string | null | undefined): string | null {
  if (!id) return null;
  return SECTION_OF.get(id)?.sectionId ?? null;
}

export function specialNeighbor(id: string | null | undefined, dir: -1 | 1): string | null {
  if (!id) return null;
  const sectionId = SECTION_OF.get(id)?.sectionId;
  if (!sectionId) return null;
  const section = SPECIAL_SECTIONS.find((item) => item.id === sectionId);
  if (!section) return null;
  const ids = section.groups.flatMap((group) => group.items).map((item) => item.id);
  const index = ids.indexOf(id);
  if (index < 0) return null;
  return ids[index + dir] ?? null;
}

export function specialGroupTitle(id: string | null | undefined): string {
  if (!id) return "";
  return SECTION_OF.get(id)?.group ?? "";
}

export function specialMassById(id: string | null | undefined): SpecialMass | null {
  if (!id) return null;
  return BY_ID.get(id) ?? null;
}

export function specialAsProper(
  mass: SpecialMass,
  season?: LiturgicalDay["season"],
  formulary?: Proper | null,
): Proper {
  const marian = mass.id === "m1144-121" || mass.id === "m1144-122";
  const base = marian ? maryCommon(season) : null;
  const own = mass.preface?.own?.[0];
  const proper: Proper = {
    ...(base ?? {}),
    title: mass.title,
    entrance: splitAntiphon(mass.entrance ?? base?.entrance),
    collect: mass.collect ?? base?.collect,
    offerings: mass.offerings ?? base?.offerings,
    communion: splitAntiphon(mass.communion ?? base?.communion),
    postcommunion: mass.postcommunion ?? base?.postcommunion,
    collectOnly: base ? false : mass.collectOnly,
  };
  if (marian && formulary) {
    if (formulary.entrance) proper.entrance = splitAntiphon(formulary.entrance);
    if (formulary.offerings) proper.offerings = formulary.offerings;
    if (formulary.communion) proper.communion = splitAntiphon(formulary.communion);
    if (formulary.postcommunion) proper.postcommunion = formulary.postcommunion;
  }
  if (own?.text) {
    proper.preface = `Prefasio: ${own.title}`;
    proper.prefaceText = own.text;
  } else if (marian) {
    proper.preface = base?.preface || "Prefasio 1 o 2 bilong Santu Maria Virgo, p. 520-521.";
  }
  return proper;
}

function formularyStem(title: string): string {
  return title.replace(/\s+\d+$/, "").trim();
}

/** Numbered formularies that begin at this page of a common. One item means there is nothing to choose. */
function formulariesAt(page: string): { group: string; items: { id: string; title: string }[] } | null {
  const n = Number(page);
  if (!n) return null;
  const section = SPECIAL_SECTIONS.find((item) => item.id === "s1");
  if (!section) return null;
  for (const group of section.groups) {
    const start = group.items.findIndex((item) => !item.heading && item.page === n);
    if (start < 0) continue;
    const first = group.items[start];
    const stem = formularyStem(first.title);
    const items = [{ id: first.id, title: first.title }];
    for (let i = start + 1; i < group.items.length; i++) {
      const item = group.items[i];
      if (item.heading || formularyStem(item.title) !== stem) break;
      items.push({ id: item.id, title: item.title });
    }
    return { group: group.title, items };
  }
  return null;
}

function commonHeading(groupTitle: string): string {
  const who = groupTitle.replace(/^Ol Misa bilong [Tt]ingim\s+/i, "").trim();
  return who ? `Misa komon bilong ${who}` : "Misa komon";
}

export type FormularySet = { title: string; items: { id: string; title: string }[] };

function pagesOf(pages: string[]): { id: string; title: string }[] {
  const items: { id: string; title: string }[] = [];
  const seen = new Set<string>();
  for (const page of pages) {
    const found = formulariesAt(page);
    for (const item of found?.items ?? []) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      items.push(item);
    }
  }
  return items;
}

/** Martyr and pastor commons a priest-martyr memorial may use, in this season. */
function priestMartyrFormularySet(day: LiturgicalDay): FormularySet | null {
  const ref = saintCommonRef(day);
  const title = `${day.titleTpi} ${day.subtitleTpi}`;
  const many = /planti/i.test(ref) || /lain martir|ol lain/i.test(title);
  const mission = /misinari/i.test(ref);
  const easterPage = ref.match(/Taim bilong Ista,\s*lukim p\.\s*(\d+)/i)?.[1];
  const martyrPages =
    day.season === "easter"
      ? [easterPage ?? (mission ? (many ? "883" : "884") : many ? "878" : "882")]
      : [mission ? (many ? "883" : "884") : many ? "865" : "874"];
  const pastorPrinted = ref.match(/Wasman[\s\S]{0,80}?p\.\s*(\d+)/i)?.[1];
  const pastorPages = [pastorPrinted ?? (mission ? "902" : many ? "894" : "895")];
  const items = [...pagesOf(martyrPages), ...pagesOf(pastorPages)];
  if (saintBringsWholeMass(day)) {
    items.unshift({ id: `own:${day.properId}`, title: "Misa bilong dispela santu" });
  }
  if (items.length < 2) return null;
  return { title: "Misa komon bilong ol Martir o ol Wasman", items };
}

/** Formularies the priest may use when this day borrows a common that prints more than one. */
export function commonFormularyChoices(day: LiturgicalDay, massId?: string | null): FormularySet | null {
  if (!massId && isPriestMartyrMemorial(day)) {
    const both = priestMartyrFormularySet(day);
    if (both) return both;
  }
  const id = massId ?? day.properId;
  if ((id === "m1144-121" || id === "m1144-122") && day.season === "ordinary") {
    const found = formulariesAt("851");
    if (!found || found.items.length < 2) return null;
    return { title: commonHeading(found.group), items: found.items };
  }
  if (massId) return null;
  const page = borrowedCommonPage(day);
  if (!page) return null;
  const found = formulariesAt(page);
  if (!found || found.items.length < 2) return null;
  return { title: commonHeading(found.group), items: found.items };
}

function pushChoice(out: PrefaceChoice[], seen: Set<string>, choice: PrefaceChoice | null) {
  if (!choice?.text || seen.has(choice.key)) return;
  seen.add(choice.key);
  out.push(choice);
}

function commonsFallback(group: string, title: string): PrefaceChoice[] {
  const t = `${group} ${title}`.toLowerCase();
  if (/maria/.test(t)) {
    const list = prefaceChoicesFromRef("Prefasio 1 o 2 bilong Santu Maria Virgo");
    if (/atven/.test(t)) list.push(...prefaceChoicesFromRef("Prefasio 2 bilong Atven"));
    return list;
  }
  if (/martir/.test(t)) return prefaceChoicesFromRef("Prefasio 1 o 2 bilong ol Santu Martir");
  if (/(^|[^a-z])(wasman|pop|bisop)([^a-z]|$)/.test(t)) {
    return prefaceChoicesFromRef("Prefasio bilong ol Santu Wasman");
  }
  if (/virgo|monk|abbot|sista|relijis/.test(t)) {
    return prefaceChoicesFromRef("Prefasio bilong ol Santu Virgo na Relijis");
  }
  return prefaceChoicesFromRef("Prefasio 1 o 2 bilong ol Santu");
}

function votiveFallback(title: string): PrefaceChoice[] {
  const t = title.toLowerCase();
  if (/maria/.test(t)) {
    return prefaceChoicesFromRef("Prefasio 1 o 2 bilong Santu Maria Virgo");
  }
  return commonPrefaceChoices();
}

/** Preface the Buk Misa assigns to a mass from the special index. */
export function specialPrefaceChoices(mass: SpecialMass, day: LiturgicalDay): PrefaceChoice[] {
  if (mass.appendix) return [];
  const meta = SECTION_OF.get(mass.id);
  const sectionId = meta?.sectionId ?? "";
  const group = meta?.group ?? "";
  const pref = mass.preface;
  const out: PrefaceChoice[] = [];
  const seen = new Set<string>();
  const seenText = new Set<string>();
  const marriage = /marit/i.test(mass.title) && !/relijis/i.test(mass.title);
  const ownPages = new Set((pref?.own ?? []).map((own) => own.page));

  for (const ref of pref?.refs ?? []) {
    if (/em yet/i.test(ref)) continue;
    if (marriage && /relijis laip/i.test(ref)) continue;
    const pages = [...ref.matchAll(/p\.\s*(\d+)/gi)].map((m) => Number(m[1]));
    if (pages.some((page) => ownPages.has(page))) continue;
    for (const choice of prefaceChoicesFromRef(ref)) pushChoice(out, seen, choice);
  }

  for (const own of pref?.own ?? []) {
    if (marriage && /relijis/i.test(own.title)) continue;
    if (seenText.has(own.text)) continue;
    seenText.add(own.text);
    pushChoice(out, seen, {
      key: `own-p${own.page}`,
      title: own.title,
      subtitle: own.subtitle || undefined,
      text: own.text,
    });
  }

  if (out.length) return out;
  if (pref?.season) return seasonalPrefaceChoices(day);
  if (sectionId === "s5") return deadPrefaceChoices();
  if (sectionId === "s1") return commonsFallback(group, mass.title);
  if (sectionId === "s4") return votiveFallback(mass.title);
  return commonPrefaceChoices();
}
