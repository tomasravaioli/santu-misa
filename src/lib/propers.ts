import type { LiturgicalDay } from "./calendar";
import raw from "./propers.json";

export type Antiphon = {
  cite?: string;
  text: string;
  alt?: { cite?: string; text: string };
};

export type Proper = {
  title?: string;
  entrance?: Antiphon;
  collect?: string;
  collectAfter?: string;
  offerings?: string;
  preface?: string;
  prefaceText?: string;
  communion?: Antiphon;
  postcommunion?: string;
  overPeople?: string;
  commonRef?: string;
  note?: string;
  /** Votive with a collect only: leave the other orations out instead of a placeholder. */
  collectOnly?: boolean;
};

export type Preface = {
  title: string;
  subtitle?: string;
  text: string;
};

export type IntercessionSet = {
  intro: string;
  response: string;
  intentions: string[];
  conclusion: string;
};

export type SolemnBlessing = {
  title: string;
  petitions: string[];
  closing: string;
};

function tidyText(text: string): string {
  const header =
    "(?:OL\\s+MISA\\s+BILONG|OL\\s+PESTODE\\s+BILONG|LO\\s+NA\\s+PASIN\\s+BILONG\\s+MISA|GUT\\s+FONDE\\s+APINUN|LONG\\s+ANIVESERI\\s+BILONG)";
  const month =
    "(?:JANUERI|FEBRUERI|MAS|EPRIL|ME|JUN|JULAI|OGAS|SEPTEMBA|OKTOBA|NOVEMBA|DISEMBA)";
  const cut = new RegExp(`\\s+(?:\\d{2,4}\\s+)?(?:${header}|${month}(?:\\s+${month})*)\\b[\\s\\S]*$`);
  let s = text.trim();
  for (let i = 0; i < 6; i++) {
    const next = s
      .replace(cut, "")
      .replace(/\s+\d+\.\s+Misa bilong Tingim[\s\S]*$/i, "")
      .replace(/\s+Misa bilong tingim wanpela Santu Meri Martir, p\.\s*\d+\.?\s*\d*\s*$/i, "")
      .trim();
    if (next === s) break;
    s = next;
  }
  const lines = s.split("\n");
  const glued = lines.findIndex(
    (line, i) =>
      i > 0 &&
      /^(?:Lukim prefasio\b|Prefasio\b|Taim ol i no bin ritim Gutnius\b|Antipon bilong\b|Pre bihain long Komunio\b|Pre bilong (?:Bigin|Ofa)\b)/i.test(
        line.trim(),
      ),
  );
  if (glued > 0) s = lines.slice(0, glued).join("\n").trim();
  return s;
}

function tidyAntiphon(ant?: Antiphon): Antiphon | undefined {
  if (!ant?.text) return ant;
  const text = tidyText(ant.text);
  return splitAntiphon(text === ant.text ? ant : { ...ant, text });
}

/** The missal prints a second antiphon after “O:” or “O,”. Keep both. */
export function splitAntiphon(ant?: Antiphon): Antiphon | undefined {
  if (!ant?.text) return ant;
  const lines = ant.text.split("\n");
  const cut = lines.findIndex((line, i) => i > 0 && /^O[,:](?:\s|$)/.test(line.trim()));
  if (ant.alt?.text) {
    return cut > 0 ? { ...ant, text: lines.slice(0, cut).join("\n").trim() } : ant;
  }
  if (cut < 0) return ant;
  const cue = lines[cut].trim();
  const altText = lines.slice(cut + 1).join("\n").trim();
  if (!altText) return ant;
  const cite = cue.startsWith("O,") ? cue : cue.replace(/^O:\s*/, "").trim();
  return {
    ...ant,
    text: lines.slice(0, cut).join("\n").trim(),
    alt: cite ? { text: altText, cite } : { text: altText },
  };
}

function tidyProper(rec: Proper): Proper {
  return {
    ...rec,
    title: rec.title ? tidyText(rec.title) : rec.title,
    entrance: tidyAntiphon(rec.entrance),
    collect: rec.collect ? tidyText(rec.collect) : rec.collect,
    collectAfter: rec.collectAfter ? tidyText(rec.collectAfter) : rec.collectAfter,
    offerings: rec.offerings ? tidyText(rec.offerings) : rec.offerings,
    communion: tidyAntiphon(rec.communion),
    postcommunion: rec.postcommunion ? tidyText(rec.postcommunion) : rec.postcommunion,
    overPeople: rec.overPeople ? tidyText(rec.overPeople) : rec.overPeople,
  };
}

/** A common prints the next antiphon or prayer after a red “O,” / “O:” rubric. Keep the first. */
function firstOfCommon(text: string): string {
  const lines = text.split("\n");
  const cut = lines.findIndex((line, i) => i > 0 && /^(?:O[,:]|B\.)(?:\s|$)/.test(line.trim()));
  return tidyText(cut > 0 ? lines.slice(0, cut).join("\n") : text);
}

function tidyCommon(rec: Proper): Proper {
  const base = tidyProper(rec);
  const cut = (value?: string) => (value ? firstOfCommon(value) : value);
  return {
    ...base,
    collect: cut(base.collect),
    collectAfter: cut(base.collectAfter),
    offerings: cut(base.offerings),
    postcommunion: cut(base.postcommunion),
    overPeople: cut(base.overPeople),
    entrance: splitAntiphon(base.entrance),
    communion: splitAntiphon(base.communion),
  };
}
function tidyTable(table: Record<string, Proper>): Record<string, Proper> {
  const out: Record<string, Proper> = {};
  for (const [key, rec] of Object.entries(table)) out[key] = tidyProper(rec);
  return out;
}

const TABLE = tidyTable(raw.propers as Record<string, Proper>);
const PREFACES = raw.prefaces as Record<string, Preface>;
const COMMONS = Object.fromEntries(
  Object.entries((raw.commons ?? {}) as Record<string, Proper>).map(([key, rec]) => [key, tidyCommon(rec)]),
);
const INTERCESSIONS = (raw.intercessions ?? {}) as Record<string, IntercessionSet>;
const BLESSINGS = (raw.blessings ?? {}) as Record<string, SolemnBlessing>;

const WD = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function mapped(pid: string): string {
  if (pid === "sanctorale.12-25") return "christmas.day";
  if (pid === "temporale.easter-octave.sun") return "temporale.easter.2.sun";
  return pid;
}

function afterEpiphany(iso: string): boolean {
  const md = iso.slice(5);
  return md >= "01-07" && md < "02-01";
}

function pickCollect(rec: Proper, day: LiturgicalDay): Proper {
  if (rec.collectAfter && day.season === "christmas" && afterEpiphany(day.date)) {
    return { ...rec, collect: rec.collectAfter };
  }
  return rec;
}

function ferialFallback(day: LiturgicalDay): Proper | null {
  const wd = WD[day.weekday] ?? "feria";
  if (day.season === "ordinary" && day.week) {
    return TABLE[`temporale.ordinary.${day.week}.sun`] ?? null;
  }
  if (day.week != null) {
    const daily = TABLE[`temporale.${day.season}.${day.week}.${wd}`];
    if (daily) return daily;
    if (day.season === "ordinary") return TABLE[`temporale.ordinary.${day.week}.sun`] ?? null;
  }
  if (day.season === "christmas") {
    return TABLE[`temporale.christmas.0.${wd}`] ?? null;
  }
  return null;
}

function merge(base: Proper | null, over: Proper | null): Proper | null {
  if (!over && !base) return null;
  if (!over) return base;
  if (!base) return over;
  const out: Proper = { ...base };
  (Object.keys(over) as (keyof Proper)[]).forEach((k) => {
    const v = over[k];
    if (v) (out as Record<string, unknown>)[k] = v;
  });
  return out;
}

function fillSaintName(text: string, title?: string): string {
  if (!title) return text;
  const name = title.split(",")[0].trim();
  if (!name) return text;
  return text
    .replace(/ol Santu Martir N\. na N\./g, name)
    .replace(/Santu Martir N\. na N\./g, name)
    .replace(/Santu N\. na N\./g, name)
    .replace(/\(Bisop\) Santu N\./g, name)
    .replace(/Virgo Santu N\./g, name)
    .replace(/Martir Santu N\./g, name)
    .replace(/Santu N\./g, name);
}

function namedCommon(common: Proper, title?: string): Proper {
  const copy = tidyProper({ ...common });
  if (copy.collect) copy.collect = fillSaintName(copy.collect, title);
  if (copy.offerings) copy.offerings = fillSaintName(copy.offerings, title);
  if (copy.postcommunion) copy.postcommunion = fillSaintName(copy.postcommunion, title);
  if (copy.overPeople) copy.overPeople = fillSaintName(copy.overPeople, title);
  if (copy.entrance?.text) {
    copy.entrance = { ...copy.entrance, text: fillSaintName(copy.entrance.text, title) };
  }
  if (copy.communion?.text) {
    copy.communion = { ...copy.communion, text: fillSaintName(copy.communion.text, title) };
  }
  return copy;
}

function commonFor(rec: Proper | null, day?: LiturgicalDay | null): Proper | null {
  if (!rec?.commonRef) return null;
  const m = rec.commonRef.match(/p\.\s*(\d+)/i);
  if (!m) return null;
  const page = seasonalCommonPage(m[1], rec.commonRef, day?.season);
  const hit = COMMONS[page] ?? COMMONS[m[1]];
  return hit ? namedCommon(hit, rec.title) : null;
}

/**
 * A commonRef page is where that common starts, not always the formulary
 * to use. Mary has her own Advent, Christmas and Easter set. Martyrs name
 * the Easter page in the rubric (“Sapos em i Taim bilong Ista, lukim p. …”).
 * Lent keeps the Ordinary Time Mary mass: the missal allows that.
 */
function seasonalCommonPage(page: string, ref: string, season?: LiturgicalDay["season"]): string {
  if (season === "easter") {
    const printed = ref.match(/Taim bilong Ista,\s*lukim p\.\s*(\d+)/i);
    if (printed) return printed[1];
    if (page === "865") return "878";
    if (page === "874") return "882";
  }
  if ((page === "851" || /maria virgo/i.test(ref)) && !/martir/i.test(ref)) {
    if (season === "advent") return "860";
    if (season === "christmas") return "862";
    if (season === "easter") return "864";
  }
  return page;
}

/** Common of the Virgin: the seasonal formulary when the missal prints one. */
export function maryCommon(season?: LiturgicalDay["season"]): Proper | null {
  const ref = "Misa bilong Santu Maria Virgo (p. 851).";
  const page = seasonalCommonPage("851", ref, season);
  const hit = COMMONS[page] ?? COMMONS["851"];
  return hit ? { ...hit } : null;
}

const DEAD_PREFACE = "Prefasio bilong ol manmeri i dai pinis, p. 536-540.";

const OVERLAY: Record<string, Proper> = {
  "sanctorale.09-28.ruiz": {
    title: "Santu Lorens Ruis, Wantaim ol Lain Martir bilong Filipins",
    commonRef: "Misa bilong ol Martir: bilong planti Martir (p. 865).",
    collect:
      "God, yu Bikpela bilong mipela.\nMartir Santu Lorens wantaim ol lain Martir bilong em,\ni bin soim strong bilong karim hevi na pen,\nlong taim ol i mekim wok bilong yu,\nna long taim ol i mekim wok bilong helpim ol arapela.\nMipela i pre, strongim mipela\nwankain olsem yu bin strongim ol Martir bilong yu.\nLong wanem, ol manmeri i mekim stretpela pasin na i karim hevi,\nol i save amamas long Kingdom bilong yu.\nMipela i askim dispela samting long nem bilong Jisas Krais,\nem i Bikpela bilong mipela, Pikinini bilong yu.\nEm i stap laip na em i King wantaim yu na wantaim Holi Spirit,\nGod bilong oltaim.",
  },
  "votiv.mary-saturday": {
    title: "Misa bilong Santu Maria Virgo",
    commonRef: "Misa bilong Santu Maria Virgo (p. 851).",
  },
};

function resolved(rec: Proper | null, day?: LiturgicalDay, formulary?: Proper | null): Proper | null {
  if (!rec) return null;
  const common = commonBase(rec, day, formulary);
  if (rec && common) return merge(common, rec);
  return rec;
}

function commonBase(rec: Proper | null, day?: LiturgicalDay | null, formulary?: Proper | null): Proper | null {
  if (rec?.commonRef && formulary) return namedCommon(formulary, rec.title);
  return commonFor(rec, day);
}

/** Page of the common this day borrows, when the saint does not bring the whole mass. */
export function borrowedCommonPage(day: LiturgicalDay): string | null {
  if (ALL_SOULS[day.properId]) return null;
  const overlay = OVERLAY[day.properId];
  const pid = mapped(day.properId);
  const own = overlay ?? TABLE[pid] ?? TABLE[day.properId] ?? null;
  if (!own?.commonRef) return null;
  const complete = Boolean(own.entrance?.text && own.offerings && own.communion?.text && own.postcommunion);
  if (complete) return null;
  const m = own.commonRef.match(/p\.\s*(\d+)/i);
  if (!m) return null;
  return seasonalCommonPage(m[1], own.commonRef, day.season);
}

/** Memorial, obligatory or optional, of a priest who is also a martyr. */
export function isPriestMartyrMemorial(day: LiturgicalDay): boolean {
  if (day.rank !== "memorial" && day.rank !== "optional") return false;
  if (!isCelebratingSaint(day)) return false;
  const t = `${day.titleTpi} ${day.subtitleTpi}`.toLowerCase();
  return hasWord(t, "pris") && /martir/.test(t);
}

export function saintCommonRef(day: LiturgicalDay): string {
  return ownProper(day)?.commonRef ?? "";
}

/** The missal prints this saint's antiphons and prayers, not only a collect. */
export function saintBringsWholeMass(day: LiturgicalDay): boolean {
  const own = ownProper(day);
  return Boolean(own?.entrance?.text && own.offerings && own.communion?.text && own.postcommunion);
}

/**
 * Use a chosen common for the antiphons and the other prayers, and keep the
 * saint's own collect when the missal prints one.
 */
export function withChosenCommon(day: LiturgicalDay, formulary: Proper): Proper | null {
  const own = ownProper(day);
  const common = namedCommon(formulary, own?.title ?? day.titleTpi);
  const kept: Proper = { title: own?.title ?? day.titleTpi };
  if (own?.collect) kept.collect = own.collect;
  return merge(common, kept);
}

/** Martyr prefaces and the pastor preface, both open to choose. */
export function priestMartyrPrefaceChoices(): PrefaceChoice[] {
  const out: PrefaceChoice[] = [];
  const seen = new Set<string>();
  for (const choice of [
    ...prefaceChoicesFromRef("Prefasio 1 o 2 bilong ol Santu Martir"),
    ...prefaceChoicesFromRef("Prefasio bilong ol Santu Wasman"),
  ]) {
    if (!choice?.text || seen.has(choice.key)) continue;
    seen.add(choice.key);
    out.push(choice);
  }
  return out;
}

const ALL_SOULS: Record<string, Proper> = {
  "sanctorale.11-02": {
    title: "Misa 1",
    entrance: {
      cite: "1 Tes 4:14; 1 Ko 15:22",
      text: "Jisas i bin dai na i kirap bek gen. Olsem na long strong bilong Jisas, God bai i kirapim ol manmeri i slip long matmat, na bringim ol i go wantaim em. Tru, olgeta manmeri bilong lain bilong Adam i save dai. Olsem tasol olgeta manmeri bilong lain bilong Krais bai i kisim laip gen.",
    },
    collect:
      "Lord, marimari long mipela, na harim ol pre bilong mipela.\nMipela i bilip long Pikinini bilong yu i kirap long indai.\nMipela i pre, strongim hop bilong mipela,\nbai mipela i ken wet long kirap bek\nbilong ol wokmanmeri bilong yu.\nMipela i askim dispela samting long nem bilong Jisas Krais,\nem i Bikpela bilong mipela, Pikinini bilong yu.\nEm i stap laip na em i King wantaim yu na wantaim Holi Spirit,\nGod bilong oltaim.",
    offerings:
      "Lord, long dispela Sakramen,\nmipela i kamap wan wantaim Pikinini bilong yu.\nMipela i askim yu, lukdaun long ol ofa bilong mipela,\nna bringim ol wokmanmeri bilong yu i dai pinis\ni go long glori bilong Krais.\nEm i stap laip na em i King, nau na oltaim.",
    preface: DEAD_PREFACE,
    communion: {
      cite: "Jn 11:25-26",
      text: "Bikpela i tok olsem, “Kirap bek, em mi yet. Na laip, em mi yet. Na man o meri i bilip long mi, maski sapos em i dai, em bai i stap laip yet. Na olgeta manmeri i stap laip na i bilip long mi, bai ol i no i dai inap oltaim.”",
    },
    postcommunion:
      "Lord, mipela i bin selebretim dispela Sakramen\nbilong Pen na Indai na Kirap Bek bilong Krais,\nbilong helpim ol wokmanmeri bilong yu i dai pinis.\nLong marimari bilong yu,\nbringim ol i go long ples bilong lait na bilong bel isi bilong yu.\nMipela i pre long nem bilong Krais, em i Bikpela bilong mipela.",
  },
  "sanctorale.11-02.2": {
    title: "Misa 2",
    entrance: {
      cite: "4 Esra 2:34-35",
      text: "Bikpela, givim malolo bilong oltaim long ol, na lait bilong oltaim i ken lait long ol.",
    },
    collect:
      "God, yu amamas bilong ol bilipmanmeri,\nna yu laip bilong ol manmeri bilong stretpela pasin.\nLong Indai na Kirap Bek bilong Pikinini bilong yu,\nyu bin kisim bek mipela.\nMipela i pre, marimari long ol wokmanmeri bilong yu i dai pinis.\nOl i bin bilip olsem mipela bai i kirap bek.\nBringim ol i go long ples bilong amamas bilong oltaim.\nMipela i askim dispela samting long nem bilong Jisas Krais,\nem i Bikpela bilong mipela, Pikinini bilong yu.\nEm i stap laip na em i King wantaim yu na wantaim Holi Spirit,\nGod bilong oltaim.",
    offerings:
      "God, yu strong olgeta, na yu pulap long marimari.\nMipela i pre, bai dispela ofa bilong sakrifais\ni ken tekewe ol sin bilong ol wokmanmeri bilong yu i dai pinis,\nna mekim ol i kamap klin long blut bilong Krais.\nLong wanem, oltaim yu save marimari\nlong ol manmeri i bin kamap klin long wara bilong Baptais.\nMipela i pre long nem bilong Krais, em i Bikpela bilong mipela.",
    preface: DEAD_PREFACE,
    communion: {
      cite: "4 Esra 2:35, 34",
      text: "Bikpela, lait bilong oltaim i ken lait long ol inap oltaim, wantaim ol Santu bilong yu. Long wanem, yu pulap long marimari.",
    },
    postcommunion:
      "Lord, mipela i kisim pinis\ndispela Sakramen bilong Pikinini bilong yu.\nEm i bin givim laip bilong em yet\nolsem sakrifais bilong helpim mipela,\nna bihain em i kirap bek na pulap long glori.\nMipela i askim yu, helpim ol wokmanmeri bilong yu i dai pinis.\nDispela Sakramen bilong Pen na Indai na Kirap Bek bilong Krais\ni ken klinim ol sin bilong ol,\nna i ken bringim ol long glori bilong kirap bek.\nMipela i pre long nem bilong Krais, em i Bikpela bilong mipela.",
  },
  "sanctorale.11-02.3": {
    title: "Misa 3",
    entrance: {
      cite: "Ro 8:11",
      text: "God i bin kirapim bek Jisas long ol i dai pinis. Na em bai i givim laip gen long bodi bilong yumi tu, long wok bilong Spirit bilong em i stap insait long yumi.",
    },
    collect:
      "God, yu bin mekim Pikinini bilong yu\ni win long indai, na i go bek long heven.\nMipela i askim yu, helpim ol wokmanmeri bilong yu i dai pinis,\nna helpim ol long winim strong bilong indai,\nbai ol i ken lukim yu inap oltaim long heven.\nLong wanem, yu bin kamapim ol, na yu Ridima bilong ol.\nMipela i askim dispela samting long nem bilong Jisas Krais,\nem i Bikpela bilong mipela, Pikinini bilong yu.\nEm i stap laip na em i King wantaim yu na wantaim Holi Spirit,\nGod bilong oltaim.",
    offerings:
      "Lord, marimari long mipela,\nna kisim dispela ofa bilong sakrifais long han bilong mipela.\nMipela i pre bilong helpim ol wokmanmeri bilong yu i dai pinis,\nna nau ol i slip long Krais.\nDispela sakrifais i ken helpim ol long winim strong bilong indai,\nna long kisim laip bilong oltaim.\nMipela i pre long nem bilong Krais, em i Bikpela bilong mipela.",
    preface: DEAD_PREFACE,
    communion: {
      cite: "Fl 3:20-21",
      text: "Yumi wetim Sevia bilong yumi, em i Bikpela Jisas Krais. Em bai i senisim dispela bodi bilong yumi i save dai, na em bai i mekim bodi bilong yumi i pulap long glori, olsem bodi bilong em yet.",
    },
    postcommunion:
      "Lord, long strong bilong dispela sakrifais,\nkapsaitim marimari bilong yu\nlong ol wokmanmeri bilong yu i dai pinis.\nLong Baptais yu bin givim grasia long ol.\nMipela i askim yu, bringim ol i go long amamas bilong oltaim.\nMipela i pre long nem bilong Krais, em i Bikpela bilong mipela.",
  },
};

export function propersFor(day: LiturgicalDay, formulary?: Proper | null): Proper | null {
  const souls = ALL_SOULS[day.properId];
  if (souls) return souls;
  const overlay = OVERLAY[day.properId];
  if (overlay) return resolved(overlay, day, formulary);
  const pid = mapped(day.properId);
  const own = TABLE[pid] ?? TABLE[day.properId] ?? null;
  const rec = own ? pickCollect(own, day) : null;
  const feria = ferialFallback(day);
  const common = commonBase(rec, day, formulary);

  if (day.properId.startsWith("png.") && day.week) {
    return TABLE[`temporale.ordinary.${day.week}.sun`] ?? rec ?? feria;
  }

  // Own orations overlay the Common so missing antiphons still come from it.
  if (rec && common) return merge(common, rec);
  if (rec?.collect && rec.offerings && rec.postcommunion) return rec;
  if (rec && feria) return merge(feria, rec);
  if (rec) return rec;
  if (feria) return pickCollect(feria, day);
  return null;
}

export type IntercessionChoice = { id: string; title: string };

const INTERCESSION_TITLE: Record<string, string> = {
  "ordinary-any-1": "Olgeta Taim bilong Yia 1",
  "ordinary-any-2": "Olgeta Taim bilong Yia 2",
  advent: "Taim bilong Atven",
  christmas: "Taim bilong Krismas",
  "lent-1": "Taim bilong Lent 1",
  "lent-2": "Taim bilong Lent 2",
  "holy-week": "Ol Wikde bilong Holi Wik",
  easter: "Taim bilong Ista",
  "ordinary-1": "Taim bilong Yia 1",
  "ordinary-2": "Taim bilong Yia 2",
  dead: "Ol Misa bilong Helpim ol Manmeri i Dai Pinis",
};

const GENERAL_INTERCESSIONS = ["ordinary-any-1", "ordinary-any-2"];

function choice(id: string): IntercessionChoice {
  return { id, title: INTERCESSION_TITLE[id] ?? id };
}

function isHolyWeek(day: LiturgicalDay): boolean {
  return day.season === "lent" && day.week === 6;
}

/** Prayers of the faithful the priest may use for this day or funeral mass. */
export function intercessionChoices(day: LiturgicalDay, scope: "season" | "dead" = "season"): IntercessionChoice[] {
  if (scope === "dead") return [choice("dead")];
  if (isHolyWeek(day)) return [choice("holy-week")];
  const general = GENERAL_INTERCESSIONS.map(choice);
  if (day.season === "advent") return [...general, choice("advent")];
  if (day.season === "christmas") return [...general, choice("christmas")];
  if (day.season === "lent") return [...general, choice("lent-1"), choice("lent-2")];
  if (day.season === "easter") return [...general, choice("easter")];
  return [...general, choice("ordinary-1"), choice("ordinary-2")];
}

export function defaultIntercessionId(day: LiturgicalDay, scope: "season" | "dead" = "season"): string {
  const choices = intercessionChoices(day, scope);
  if (scope === "season" && day.season === "lent" && !isHolyWeek(day)) {
    const want = (day.week ?? 1) >= 4 ? "lent-2" : "lent-1";
    if (choices.some((item) => item.id === want)) return want;
  }
  const seasonal = choices.find((item) => !item.id.startsWith("ordinary-any"));
  return seasonal?.id ?? choices[0]?.id ?? "ordinary-any-1";
}

export function resolveIntercession(
  day: LiturgicalDay,
  scope: "season" | "dead" = "season",
  selectedId?: string | null,
): IntercessionSet | null {
  const choices = intercessionChoices(day, scope);
  const id = choices.some((item) => item.id === selectedId) ? selectedId : defaultIntercessionId(day, scope);
  return (id && INTERCESSIONS[id]) || null;
}

export function intercessionsFor(day: LiturgicalDay): IntercessionSet | null {
  return resolveIntercession(day, "season", null);
}

function blessingKeyFor(day: LiturgicalDay): string | undefined {
  const pid = day.properId;
  const title = `${day.titleTpi} ${day.subtitleTpi}`;
  if (pid === "temporale.pentecost" || pid === "temporale.pentecost-vigil") return "holy-spirit";
  if (pid === "temporale.ascension" || pid === "ascension.vigil") return "ascension";
  if (pid === "temporale.palm" || pid.includes("holy-thursday") || pid.includes("good-friday") || day.isTriduum) {
    return "passion";
  }
  if (pid === "sanctorale.01-01") return "mary";
  if (pid === "sanctorale.01-06" || pid === "temporale.epiphany" || pid === "epiphany.vigil") return "epiphany";
  if (pid === "sanctorale.06-29" || pid === "sanctorale.06-29.vigil") return "peter-paul";
  if (pid === "sanctorale.11-01") return "all-saints";
  if (/Maria Virgo|Mama bilong God/.test(title) && (day.rank === "solemnity" || day.rank === "feast")) return "mary";
  if (/Aposel/.test(title) && (day.rank === "solemnity" || day.rank === "feast")) return "apostles";
  if (day.season === "advent") return "advent";
  if (day.season === "christmas") return "christmas";
  if (day.season === "lent") return "passion";
  if (day.season === "easter") return "easter";
  if (day.isSunday || day.rank === "solemnity" || day.rank === "feast") {
    const n = ((((day.week ?? 1) - 1) % 6) + 6) % 6 + 1;
    return `ordinary-${n}`;
  }
  return undefined;
}

export function blessingFor(day: LiturgicalDay): SolemnBlessing | null {
  if (!(day.isSunday || day.rank === "solemnity" || day.rank === "feast" || day.isTriduum)) {
    return null;
  }
  const key = blessingKeyFor(day);
  if (!key) return null;
  return BLESSINGS[key] ?? null;
}

function norm(s: string): string {
  return s
    .toUpperCase()
    .replace(/P\.\s*[\d\-]+/g, "")
    .replace(/[^A-Z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type PrefaceChoice = {
  key: string;
  title: string;
  subtitle?: string;
  text: string;
};

export const EP2_OWN_KEY = "ep2-own";

function toChoice(key: string): PrefaceChoice | null {
  const p = PREFACES[key];
  if (!p?.text) return null;
  return { key, title: p.title, subtitle: p.subtitle, text: p.text };
}

function parseNumChunk(chunk: string): number[] {
  const dash = chunk.match(/^(\d+)\s*-\s*(\d+)$/);
  if (dash) {
    const a = Number(dash[1]);
    const b = Number(dash[2]);
    const out: number[] = [];
    for (let i = Math.min(a, b); i <= Math.max(a, b); i++) out.push(i);
    return out;
  }
  return chunk
    .split(/\s+O\s+/)
    .map((p) => Number(p.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function keysForFamily(family: string, nums: number[] | null): string[] {
  const fam = family
    .replace(/\s+LONG\s+PESTODE.*$/i, "")
    .replace(/ BILONG TAIM BILONG YIA$/, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!fam) return [];
  const keys = Object.keys(PREFACES);
  const marker = `BILONG ${fam}`;
  const exact = keys.filter((k) => k === fam || k.endsWith(marker));
  const hits = exact.length ? exact : keys.filter((k) => k.includes(marker) || k.endsWith(fam));
  const pool = hits.length ? hits : keys.filter((k) => k.includes(fam));
  if (!nums || nums.length === 0) return pool;
  return pool.filter((k) => {
    const m = k.match(/^PREFASIO (\d+) /);
    if (!m) return pool.length === 1;
    return nums.includes(Number(m[1]));
  });
}

function keysFromRef(ref?: string): string[] {
  if (!ref) return [];
  const n = norm(ref);
  const extraNums = [...n.matchAll(/O PREFASIO (\d+)/g)].map((m) => Number(m[1]));
  const body = n.replace(/^PREFASIO\s+/, "");
  let nums: number[] | null = extraNums.length ? extraNums : null;
  let rest = body;
  const numHead = rest.match(/^(\d+(?:\s*(?:O|-)\s*\d+)*)\s+BILONG\s+/);
  if (numHead) {
    const parsed = parseNumChunk(numHead[1]);
    nums = [...new Set([...(nums ?? []), ...parsed])];
    rest = rest.slice(numHead[0].length);
  } else if (rest.startsWith("BILONG ")) {
    rest = rest.slice(7);
  } else {
    const hit = matchPreface(ref);
    if (hit) {
      const key = Object.keys(PREFACES).find((k) => PREFACES[k] === hit);
      return key ? [key] : [];
    }
  }
  rest = rest.replace(/\s+O\s+PREFASIO.*$/, "").trim();
  const families = rest
    .split(/\s+O\s+BILONG\s+/)
    .map((f) => f.replace(/\s+P\s+\d.*$/, "").trim())
    .filter(Boolean);
  const keys: string[] = [];
  for (const fam of families) {
    keys.push(...keysForFamily(fam, nums));
  }
  return [...new Set(keys)];
}

function ownProper(day: LiturgicalDay): Proper | null {
  const pid = mapped(day.properId);
  return TABLE[pid] ?? TABLE[day.properId] ?? null;
}

/** Saint (or Mary) actually being celebrated, not the feria underneath. */
function isCelebratingSaint(day: LiturgicalDay): boolean {
  if (day.properId === "votiv.mary-saturday") return true;
  if (day.rank === "feria" || day.celebratedId === "feria") return false;
  const id = day.properId;
  if (id === "temporale.immaculate-heart" || id === "temporale.mary-sacred-heart") return true;
  return id.startsWith("sanctorale.");
}

function hasWord(text: string, word: string): boolean {
  return new RegExp(`(?:^|[^a-z])${word}(?:[^a-z]|$)`).test(text);
}

function keysFromDay(day: LiturgicalDay): string[] {
  const pid = day.properId;
  const t = `${day.titleTpi} ${day.subtitleTpi}`.toLowerCase();

  if (pid === "temporale.palm") return keysForFamily("PEN NA INDAI", null);
  if (pid === "temporale.easter-vigil") return ["PREFASIO 1 BILONG ISTA"];
  if (pid === "temporale.ascension") return keysForFamily("ASENSIO BILONG BIKPELA", null);
  if (pid === "temporale.corpus" || pid === "temporale.holy-thursday") return keysForFamily("HOLI YUKARIS", null);
  if (pid === "sanctorale.11-01") return keysForFamily("OL SANTU", null);
  if (pid === "sanctorale.11-02" || pid.startsWith("sanctorale.11-02.")) return keysForFamily("OL MANMERI I DAI PINIS", null);
  if (pid === "sanctorale.01-06" || pid === "temporale.epiphany") return keysForFamily("EPIFANI BILONG BIKPELA", null);

  if (isCelebratingSaint(day)) {
    if (/holi nem bilong jisas/.test(t)) return keysForFamily("KRISMAS BILONG BIKPELA", null);
    if (/aposel|evangelis|raitman bilong gutnius/.test(t)) return keysForFamily("OL APOSEL", null);
    if (
      !/magdalen/.test(t) &&
      !/joakim|papamama/.test(t) &&
      !(/josep/.test(t) && !/bringim/.test(t)) &&
      /santu maria|maria virgo|mama bilong god|bilong maria|^maria[, ]/.test(t)
    ) {
      return keysForFamily("SANTU MARIA VIRGO", null);
    }
    // The printed common wins over the office in the title. A priest who is a
    // martyr takes the martyr preface when the rubric says “Misa bilong ol Martir”.
    const cref = (ownProper(day)?.commonRef ?? "").toLowerCase();
    const martirAt = cref.search(/martir/);
    const wasmanAt = cref.search(/wasman/);
    if (martirAt >= 0 && (wasmanAt < 0 || martirAt < wasmanAt)) {
      return keysForFamily("OL SANTU MARTIR", null);
    }
    if (wasmanAt >= 0 && martirAt < 0) {
      return keysForFamily("OL SANTU WASMAN", null);
    }
    if ((day.rank === "memorial" || day.rank === "optional") && hasWord(t, "pris") && /martir/.test(t)) {
      return keysForFamily("OL SANTU MARTIR", null);
    }
    if (hasWord(t, "pop") || hasWord(t, "bisop") || hasWord(t, "pris")) {
      return keysForFamily("OL SANTU WASMAN", null);
    }
    if (/martir/.test(t)) return keysForFamily("OL SANTU MARTIR", null);
    if (/virgo|relijis|relijes|monk|abbot|ermit/.test(t)) return keysForFamily("OL SANTU VIRGO NA RELIJIS", null);
    if (/dai pinis/.test(t)) return keysForFamily("OL MANMERI I DAI PINIS", null);
    return keysForFamily("OL SANTU", null);
  }

  if (day.season === "advent") {
    const md = day.date.slice(5);
    return md >= "12-17" ? ["PREFASIO 2 BILONG ATVEN"] : ["PREFASIO 1 BILONG ATVEN"];
  }
  if (day.season === "christmas") return keysForFamily("KRISMAS BILONG BIKPELA", null);
  if (day.season === "lent") {
    if ((day.week ?? 0) >= 5) return keysForFamily("PEN NA INDAI", null);
    return keysForFamily("LENT", null);
  }
  if (day.season === "easter") return keysForFamily("ISTA", null);
  if (day.isSunday || day.rank === "solemnity") return keysForFamily("OL SANDE", null);
  return keysForFamily("OLGETA DE", null);
}

export function prefaceChoicesFromRef(ref: string): PrefaceChoice[] {
  const cleaned = ref
    .replace(/\s*\([^)]*\)/g, " ")
    .replace(/,?\s*\bp\.?\s*\d[\d\s\-]*(?:\s+o\s+\d[\d\s\-]*)*/gi, " ")
    .replace(/\s+bilong Bikpela\b/gi, "")
    .replace(/\s+bilong Taim bilong Yia\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const parts = cleaned.split(/\s+O\s+(?=Prefasio)/i).map((s) => s.trim()).filter(Boolean);
  const seen = new Set<string>();
  const out: PrefaceChoice[] = [];
  for (const part of parts.length ? parts : [cleaned]) {
    for (const key of keysFromRef(part)) {
      const choice = toChoice(key);
      if (!choice || seen.has(choice.key)) continue;
      seen.add(choice.key);
      out.push(choice);
    }
  }
  return out;
}

function choicesForKeys(keys: string[]): PrefaceChoice[] {
  const out: PrefaceChoice[] = [];
  const seen = new Set<string>();
  for (const key of keys) {
    const choice = toChoice(key);
    if (!choice || seen.has(choice.key)) continue;
    seen.add(choice.key);
    out.push(choice);
  }
  return out;
}

/** Preface of the liturgical season, not of the saint celebrated that day. */
export function seasonalPrefaceChoices(day: LiturgicalDay): PrefaceChoice[] {
  if (day.season === "advent") {
    const md = day.date.slice(5);
    return choicesForKeys(md >= "12-17" ? ["PREFASIO 2 BILONG ATVEN"] : ["PREFASIO 1 BILONG ATVEN"]);
  }
  if (day.season === "christmas") return choicesForKeys(keysForFamily("KRISMAS BILONG BIKPELA", null));
  if (day.season === "lent") {
    if ((day.week ?? 0) >= 5) return choicesForKeys(keysForFamily("PEN NA INDAI", null));
    return choicesForKeys(keysForFamily("LENT", null));
  }
  if (day.season === "easter") return choicesForKeys(keysForFamily("ISTA", null));
  if (day.isSunday) return choicesForKeys(keysForFamily("OL SANDE", null));
  return choicesForKeys(keysForFamily("OLGETA DE", null));
}

export function commonPrefaceChoices(): PrefaceChoice[] {
  return choicesForKeys(keysForFamily("OLGETA DE", null));
}

export function deadPrefaceChoices(): PrefaceChoice[] {
  return choicesForKeys(keysForFamily("OL MANMERI I DAI PINIS", null));
}

/** Thematic title printed in the missal as “Prefasio: …”, outside the common-preface section. */
const OWN_PREFACE_TITLE: Record<string, string> = {
  "temporale.baptism": "Baptais bilong Bikpela",
  "temporale.lent.1.sun": "Satan i traim Bikpela",
  "temporale.lent.2.sun": "Bikpela i kamap narakain",
  "temporale.lent.3.sun": "Meri bilong Samaria",
  "temporale.lent.4.sun": "Man aipas",
  "temporale.lent.5.sun": "Lasarus",
  "temporale.palm": "Pen na Indai bilong Bikpela",
  "temporale.lent.6.thu": "Wok Pris bilong Krais, na wok bilong ol Pris",
  "temporale.pentecost": "Misteri bilong Pentikos",
  "temporale.pentecost-vigil": "Misteri bilong Pentikos",
  "temporale.trinity": "Misteri bilong Holi Triniti",
  "temporale.sacred-heart": "Laikim pasin na marimari bilong Krais",
  "temporale.christ-the-king": "Bikpela bilong yumi Jisas Krais, King bilong Olgeta Samting",
  "sanctorale.02-02": "Maria na Josep i bringim Bikpela Jisas long Tempel",
  "sanctorale.03-19": "Wok misin bilong Santu Josep",
  "sanctorale.03-25": "Misteri bilong Tok bilong God i kamap man",
  "sanctorale.05-01": "Wok misin bilong Santu Josep",
  "sanctorale.06-24": "Wok misin bilong Jon bilong Baptais bilong i go pas long Ridima",
  "sanctorale.06-24.vigil": "Wok misin bilong Jon bilong Baptais bilong i go pas long Ridima",
  "sanctorale.06-29": "Tupela wok misin bilong Pita na Pol bilong helpim Sios",
  "sanctorale.06-29.vigil": "Tupela wok misin bilong Pita na Pol bilong helpim Sios",
  "sanctorale.07-22": "Santu Maria Magdalena em i aposel bilong ol Aposel",
  "sanctorale.08-06": "Misteri bilong Bikpela i kamap narakain",
  "sanctorale.08-15": "Glori bilong Maria long Asunsio bilong em",
  "sanctorale.08-15.vigil": "Glori bilong Maria long Asunsio bilong em",
  "sanctorale.08-29": "Wok misin bilong Jon bilong Baptais bilong i go pas long Ridima",
  "sanctorale.09-14": "Holi Diwai Kros i win",
  "sanctorale.09-29": "God i kisim glori long wok bilong ol Ensel",
  "sanctorale.10-02": "God i kisim glori long wok bilong ol Ensel",
  "sanctorale.11-01": "Glori bilong Jerusalem, em i mama bilong yumi",
  "sanctorale.11-09": "Misteri bilong Sios, em i Maritmeri bilong Krais na Tempel bilong Spirit",
  "sanctorale.12-08": "Misteri bilong Maria na Sios",
};

function ownPrefaceTitle(id: string, preface?: string): string | undefined {
  if (OWN_PREFACE_TITLE[id]) return OWN_PREFACE_TITLE[id];
  const raw = (preface ?? "").replace(/\s+/g, " ").trim();
  const named = raw.match(/^Prefasio:\s*(.+)$/i);
  if (!named) return undefined;
  return named[1]
    .replace(/\.\s*HOLI\b.*$/i, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .replace(/[.\s]+$/, "")
    .trim();
}
function dumpedPrefaceBody(preface?: string): boolean {
  if (!preface) return false;
  return /Pris\s*:/i.test(preface) || /^\s*:/.test(preface);
}

/** This mass prints its own preface, rather than pointing at a numbered common. */
function properPrefaceOfDay(rec: Proper | null | undefined): boolean {
  if (!rec?.prefaceText) return false;
  const p = rec.preface ?? "";
  if (dumpedPrefaceBody(p)) return true;
  if (/dispela (?:de|pestode|bikpela pestode)/i.test(p)) return true;
  if (/^Prefasio\s*:/i.test(p)) return true;
  return false;
}

export function prefaceChoicesFor(day: LiturgicalDay, proper?: Proper | null): PrefaceChoice[] {
  const rec = proper ?? propersFor(day);
  // A saint's category must win over the weekday preface copied in from the feria.
  const source = isCelebratingSaint(day) ? (ownProper(day) ?? rec) : rec;
  const seen = new Set<string>();
  const out: PrefaceChoice[] = [];
  const push = (c: PrefaceChoice | null) => {
    if (!c?.text || seen.has(c.key)) return;
    seen.add(c.key);
    out.push(c);
  };
  if (source && properPrefaceOfDay(source)) {
    const named = ownPrefaceTitle(day.properId, source.preface);
    push({
      key: `own:${day.properId}`,
      title: named ?? "Prefasio bilong dispela de",
      text: source.prefaceText ?? "",
    });
    const altSource = source.preface ?? "";
    if (/o\s+prefasio/i.test(altSource)) {
      const alt = altSource.replace(/^[\s\S]*?\bo\s+(?=Prefasio)/i, "");
      for (const choice of prefaceChoicesFromRef(alt)) push(choice);
    }
  } else if (!dumpedPrefaceBody(source?.preface)) {
    for (const key of keysFromRef(source?.preface)) push(toChoice(key));
  }
  if (out.length === 0) {
    for (const key of keysFromDay(day)) push(toChoice(key));
  }
  return out;
}

export function resolvePreface(
  day: LiturgicalDay,
  selectedKey?: string | null,
  proper?: Proper | null,
): PrefaceChoice | null {
  const choices = prefaceChoicesFor(day, proper);
  if (!choices.length) return null;
  return choices.find((c) => c.key === selectedKey) ?? choices[0] ?? null;
}

export function prefaceTextFor(
  proper: Proper | null,
  day?: LiturgicalDay,
  selectedKey?: string | null,
): { ref?: string; text?: string; title?: string; subtitle?: string } {
  if (day) {
    const hit = resolvePreface(day, selectedKey, proper);
    if (hit) return { ref: hit.key, text: hit.text, title: hit.title, subtitle: hit.subtitle };
  }
  if (proper?.prefaceText) {
    return { ref: proper.preface, text: proper.prefaceText, title: proper.preface };
  }
  const ref = proper?.preface;
  const fromRef = ref ? matchPreface(ref) : undefined;
  if (fromRef) {
    return { ref, text: fromRef.text, title: fromRef.title, subtitle: fromRef.subtitle };
  }
  return ref ? { ref } : {};
}

function matchPreface(ref: string): Preface | undefined {
  const n = norm(ref).replace(/\sO\s\d+/g, "");
  if (PREFACES[n]) return PREFACES[n];
  const keys = Object.keys(PREFACES);
  const numbered = n.match(/PRE FASIO (\d+) BILONG (.+)/) || n.match(/PREFASIO (\d+) BILONG (.+)/);
  if (numbered) {
    const want = `PREFASIO ${numbered[1]} BILONG ${numbered[2]}`.replace(/ BILONG TAIM BILONG YIA$/, "");
    const hit = keys.find((k) => want.startsWith(k) || k.startsWith(want) || k === want);
    if (hit) return PREFACES[hit];
  }
  const tail = n.replace(/^PREFASIO (?:\d+ )?/, "");
  const byTail = keys.find((k) => k.endsWith(tail) || (tail.length > 10 && k.includes(tail)));
  if (byTail) return PREFACES[byTail];
  const hit = keys.find((k) => n.startsWith(k) || k.startsWith(n));
  return hit ? PREFACES[hit] : undefined;
}
