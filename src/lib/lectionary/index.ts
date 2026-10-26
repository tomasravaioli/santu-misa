import type { LiturgicalDay, SundayCycle, WeekdayCycle } from "@/lib/calendar";
import { baptismOfTheLord, FERIA_CELEBRATION } from "@/lib/calendar";
import { YEAR1 } from "./year1";
import { YEAR2 } from "./year2";
import { YEAR_A } from "./yearA";
import { YEAR_B } from "./yearB";
import { YEAR_C } from "./yearC";
import { SEASONS } from "./seasons";
import { SAINTS_LEC } from "./saints";
import {
  assembleCommon,
  canAssembleCommon,
  commonsForKind,
  encodeCommonPick,
  inferSaintKind,
  lookupCommon,
  parseCommonPick,
  usableGospels,
  usableReadings,
  type CommonGroup,
  type CommonKind,
} from "./commons";
import type {
  CycleTag,
  DayRecord,
  ReadingsBundle,
  Scripture,
  WeekdayReadings,
  WeekdayYear,
} from "./types";

export type { ReadingsBundle, Scripture, WeekdayReadings, WeekdayYear, CycleTag } from "./types";
export { inferSaintKind, commonsForKind, lookupCommon, parseCommonPick, encodeCommonPick, usableReadings, usableGospels, assembleCommon, canAssembleCommon } from "./commons";
export type { CommonGroup, CommonKind, CommonOption, CommonReading, CommonGospel } from "./commons";

function toScripture(node: { s: string; c: string; t: string }): Scripture {
  return { source: node.s, citation: node.c, text: node.t };
}

export function weekdayKey(week: number, weekday: number): string {
  return `${week}-${weekday}`;
}

function tableFor(year: WeekdayYear): Record<string, DayRecord> {
  return year === "II" ? YEAR2 : YEAR1;
}

function fromRecord(week: number, weekday: number, year: WeekdayYear, rec: DayRecord): WeekdayReadings {
  const readings: WeekdayReadings = {
    week,
    weekday,
    year,
    reading: toScripture(rec.r),
    psalm: { citation: rec.p.c, response: rec.p.r, stanzas: rec.p.s },
    alleluia: rec.a,
    gospel: toScripture(rec.g),
  };
  if (rec.rs) readings.shortReading = toScripture(rec.rs);
  if (rec.r2) readings.reading2 = toScripture(rec.r2);
  if (rec.gA) readings.gospelA = toScripture(rec.gA);
  if (rec.gC) readings.gospelC = toScripture(rec.gC);
  return readings;
}

function fromSunday(rec: DayRecord, cycle: "A" | "B" | "C" | "S"): WeekdayReadings {
  const readings: WeekdayReadings = {
    week: 0,
    weekday: 0,
    year: cycle,
    reading: toScripture(rec.r),
    psalm: { citation: rec.p.c, response: rec.p.r, stanzas: rec.p.s },
    alleluia: rec.a,
    gospel: toScripture(rec.g),
  };
  if (rec.rs) readings.shortReading = toScripture(rec.rs);
  if (rec.r2) readings.reading2 = toScripture(rec.r2);
  if (rec.gs) readings.shortGospel = toScripture(rec.gs);
  if (rec.gA) readings.gospelA = toScripture(rec.gA);
  if (rec.gC) readings.gospelC = toScripture(rec.gC);
  if (rec.gx) readings.extraGospel = toScripture(rec.gx);
  if (rec.v) {
    readings.vigil = rec.v
      .filter((item) => item.r && item.p)
      .map((item) => ({
        reading: toScripture(item.r),
        psalm: { citation: item.p.c, response: item.p.r, stanzas: item.p.s },
      }));
  }
  return readings;
}

const ANY_YEAR_PREFIX = ["sanctorale.", "christmas.", "png."];
const ANY_YEAR_KEYS = new Set([
  "temporale.ash",
  "temporale.chrism",
  "temporale.holy-thursday",
  "temporale.good-friday",
]);

function isAnyYearKey(key: string): boolean {
  return ANY_YEAR_KEYS.has(key) || ANY_YEAR_PREFIX.some((p) => key.startsWith(p));
}

function mappedProper(pid: string): string {
  if (pid === "sanctorale.12-25") return "christmas.day";
  if (pid === "temporale.easter-octave.sun") return "sunday.easter.2";
  if (pid === "epiphany.vigil") return "sanctorale.01-06";
  if (pid === "ascension.vigil") return "temporale.ascension";
  return pid;
}

function sundayTable(cycle: SundayCycle): Record<string, DayRecord> | null {
  if (cycle === "A") return YEAR_A;
  if (cycle === "B") return YEAR_B;
  if (cycle === "C") return YEAR_C;
  return null;
}

export function yearAKey(day: LiturgicalDay): string | null {
  return sundayLookup(day)?.key ?? null;
}

type SundayLetter = "A" | "B" | "C";

function sundayLookup(day: LiturgicalDay): { key: string; rec: DayRecord; cycle: SundayLetter } | null {
  const mapped = mappedProper(day.properId);
  const cycle: SundayLetter | null =
    day.sundayCycle === "A" || day.sundayCycle === "B" || day.sundayCycle === "C"
      ? day.sundayCycle
      : null;
  const table = cycle ? sundayTable(cycle) : null;

  if (cycle && table && table[mapped]) {
    return { key: mapped, rec: table[mapped], cycle };
  }

  if (isAnyYearKey(mapped)) {
    const rec = (table && table[mapped]) || YEAR_A[mapped] || YEAR_B[mapped] || YEAR_C[mapped];
    if (rec) return { key: mapped, rec, cycle: cycle ?? "A" };
  }

  if (table && cycle && day.isSunday && day.week && day.properId.startsWith(`temporale.${day.season}.`)) {
    const k = `sunday.${day.season}.${day.week}`;
    if (table[k]) return { key: k, rec: table[k], cycle };
  }

  return null;
}

function completeRecord(rec: DayRecord | undefined | null): rec is DayRecord {
  return Boolean(rec?.r?.t && rec?.g?.t && rec?.p?.r);
}

const SAINT_TEMPORALE = new Set([
  "temporale.christ-high-priest",
  "temporale.mary-sacred-heart",
  "temporale.immaculate-heart",
]);

export const WEEKDAY_READINGS_ID = "rit.de";
/** Saint-readings menu is open, but nothing has been chosen yet. */
export const SAINT_MENU_ID = "rit.santu";
/** The one proper in the saints' lectionary, not a common with many options. */
export const PROPER_READINGS_ID = "rit.proper";

export function isWeekdayReadingsPick(id?: string | null): boolean {
  return id === WEEKDAY_READINGS_ID;
}

function isSaintProperId(id: string): boolean {
  return id.startsWith("sanctorale.") || id === "votiv.mary-saturday" || SAINT_TEMPORALE.has(id);
}

function saintRecord(id: string, sundayCycle?: SundayCycle): DayRecord | null {
  if (id === "temporale.christ-high-priest" && sundayCycle === "B") {
    const yearB = SAINTS_LEC["temporale.christ-high-priest.B"];
    if (completeRecord(yearB)) return yearB;
  }
  const rec = SAINTS_LEC[id];
  return completeRecord(rec) ? rec : null;
}

function saintLookup(day: LiturgicalDay): DayRecord | null {
  const mapped = mappedProper(day.properId);
  return saintRecord(mapped, day.sundayCycle) ?? saintRecord(day.properId, day.sundayCycle);
}

export function celebratingSaint(day: LiturgicalDay): boolean {
  if (day.rank === "feast" || day.rank === "solemnity") return isSaintProperId(day.properId);
  if (day.rank !== "memorial" && day.rank !== "optional") return false;
  if (!isSaintProperId(day.properId)) return false;
  if (!day.options.length) return true;
  return day.celebratedId !== FERIA_CELEBRATION;
}

export function hasSaintProper(day: LiturgicalDay): boolean {
  return Boolean(saintLookup(day));
}

export function commonsPickerForDay(day: LiturgicalDay): CommonGroup | null {
  if (day.rank !== "memorial") return null;
  if (!celebratingSaint(day)) return null;
  const group = commonsForKind(inferSaintKind(day.titleTpi, day.properId));
  if (!canAssembleCommon(group)) return null;
  return group;
}

function pickSaintRecord(day: LiturgicalDay, commonId?: string | null): { rec: DayRecord; commonLabel?: string } | null {
  const mustProper = day.rank === "feast" || day.rank === "solemnity";
  const proper = saintLookup(day);
  if (mustProper) return proper ? { rec: proper } : null;

  if (!commonId || isWeekdayReadingsPick(commonId) || commonId === SAINT_MENU_ID) return null;
  if (commonId === PROPER_READINGS_ID) return proper ? { rec: proper } : null;
  if (proper && commonsPickerForDay(day)?.id === "holy") return null;

  const { readingId, gospelId } = parseCommonPick(commonId);
  if (!readingId || !gospelId) return null;

  const picked = lookupCommon(commonId);
  if (completeRecord(picked)) {
    const group = commonsPickerForDay(day);
    return { rec: picked, commonLabel: group?.title };
  }
  return null;
}

export function lookupWeekday(
  week: number,
  weekday: number,
  year: WeekdayYear,
): WeekdayReadings | null {
  if (week < 1 || week > 34 || weekday < 1 || weekday > 6) return null;
  const rec = tableFor(year)[weekdayKey(week, weekday)];
  if (!rec) return null;
  return fromRecord(week, weekday, year, rec);
}

export function lookupYear1(week: number, weekday: number): WeekdayReadings | null {
  return lookupWeekday(week, weekday, "I");
}

export function pickGospel(readings: WeekdayReadings, sundayCycle: SundayCycle): Scripture {
  if (sundayCycle === "A" && readings.gospelA) return readings.gospelA;
  if (sundayCycle === "C" && readings.gospelC) return readings.gospelC;
  return readings.gospel;
}

export function readingsBundleFromRecord(rec: DayRecord, commonLabel?: string): ReadingsBundle {
  return {
    readings: fromSunday(rec, "S"),
    calendarYear: "I",
    fallback: false,
    ferialOnFeast: false,
    commonLabel,
  };
}

export function commonReadingsBundle(kind: CommonKind, pick?: string | null): ReadingsBundle | null {
  const group = commonsForKind(kind);
  if (!group || !canAssembleCommon(group)) return null;
  const parsed = parseCommonPick(pick && !isWeekdayReadingsPick(pick) ? pick : "");
  const rec = assembleCommon(group, parsed.readingId, parsed.gospelId);
  if (!rec) return null;
  return readingsBundleFromRecord(rec, group.title);
}

export function yearLabelTpi(year: CycleTag): string {
  if (year === "A") return "Yia A";
  if (year === "B") return "Yia B";
  if (year === "C") return "Yia C";
  if (year === "S") return "Ol Santu";
  return year === "II" ? "Yia 2" : "Yia 1";
}

const WEEKDAY_NAME = ["", "mon", "tue", "wed", "thu", "fri", "sat"];

function withCycleReading(rec: DayRecord, cycle: SundayCycle): DayRecord {
  if (cycle === "A" && rec.rA) return { ...rec, r: rec.rA };
  return rec;
}

function seasonalRecord(day: LiturgicalDay): DayRecord | null {
  if (day.isSunday) return null;
  const wd = WEEKDAY_NAME[day.weekday] ?? "";
  const md = day.date.slice(5);
  const year = Number(day.date.slice(0, 4));
  const keys: string[] = [];
  // A memorial replaces properId with the saint, but the readings of the day stay those of the feria.
  if (day.season === "christmas") {
    if (day.date > `${year}-01-06` && day.date < baptismOfTheLord(year)) keys.push(`christmas.after.${wd}`);
    else if (md >= "01-02" && md <= "01-07" && day.date < `${year}-01-06`) keys.push(`christmas.${md}`);
    else if (md >= "12-26" && md <= "12-31") keys.push(`christmas.${md}`);
  } else if (day.season === "advent" && wd) {
    if (md >= "12-17" && md <= "12-24") keys.push(`temporale.advent.${md}`);
    else if (day.week) keys.push(`temporale.advent.${day.week}.${wd}`);
  } else if (day.season === "lent" && wd && day.week != null) {
    keys.push(`temporale.lent.${day.week}.${wd}`);
  } else if (day.season === "easter" && wd) {
    if (day.week === 1) keys.push(`temporale.easter-octave.${wd}`);
    else if (day.week) keys.push(`temporale.easter.${day.week}.${wd}`);
  }
  if (
    day.properId.startsWith("temporale.advent.") ||
    day.properId.startsWith("temporale.lent.") ||
    day.properId.startsWith("temporale.easter") ||
    day.properId === "temporale.ash"
  ) {
    keys.push(day.properId);
  }
  for (const key of keys) {
    const rec = SEASONS[key];
    if (completeRecord(rec)) return rec;
  }
  return null;
}

function ferialBundle(day: LiturgicalDay): ReadingsBundle | null {
  const seasonal = seasonalRecord(day);
  if (seasonal) {
    const rec = withCycleReading(seasonal, day.sundayCycle);
    return {
      readings: fromRecord(day.week ?? 0, day.weekday, day.weekdayCycle, rec),
      calendarYear: day.weekdayCycle,
      fallback: false,
      ferialOnFeast: day.rank === "feast" || day.rank === "solemnity",
    };
  }
  if (day.season !== "ordinary" || day.isSunday || !day.week) return null;
  const wanted: WeekdayCycle = day.weekdayCycle;
  const primary = lookupWeekday(day.week, day.weekday, wanted);
  const other: WeekdayYear = wanted === "I" ? "II" : "I";
  const readings = primary ?? lookupWeekday(day.week, day.weekday, other);
  if (!readings) return null;
  return {
    readings,
    calendarYear: wanted,
    fallback: !primary,
    ferialOnFeast: day.rank === "feast" || day.rank === "solemnity",
  };
}

export function hasFerialReadings(day: LiturgicalDay): boolean {
  return Boolean(ferialBundle(day));
}

export function readingsForDay(day: LiturgicalDay, commonId?: string | null): ReadingsBundle | null {
  const hit = sundayLookup(day);
  if (hit) {
    return {
      readings: fromSunday(hit.rec, hit.cycle),
      calendarYear: day.weekdayCycle,
      fallback: false,
      ferialOnFeast: false,
      sundayCycle: hit.cycle,
    };
  }

  const saint = pickSaintRecord(day, commonId);
  if (day.rank !== "optional" && saint && celebratingSaint(day)) {
    return {
      readings: fromSunday(saint.rec, "S"),
      calendarYear: day.weekdayCycle,
      fallback: false,
      ferialOnFeast: false,
      commonLabel: saint.commonLabel,
    };
  }

  return ferialBundle(day);
}

export function citationChips(day: LiturgicalDay, commonId?: string | null): string[] {
  const bundle = readingsForDay(day, commonId);
  if (!bundle) return [];
  const g = pickGospel(bundle.readings, day.sundayCycle);
  const chips = [bundle.readings.reading.citation, bundle.readings.psalm.citation];
  if (bundle.readings.reading2) chips.push(bundle.readings.reading2.citation);
  chips.push(g.citation);
  return chips.filter(Boolean);
}
