export type Scripture = {
  source: string;
  citation: string;
  text: string;
};

export type Psalm = {
  citation: string;
  response: string;
  stanzas: string[];
};

export type WeekdayYear = "I" | "II";
export type CycleTag = WeekdayYear | "A" | "B" | "C" | "S";

export type VigilUnit = {
  reading: Scripture;
  psalm: Psalm;
};

export type WeekdayReadings = {
  week: number;
  weekday: number;
  year: CycleTag;
  reading: Scripture;
  shortReading?: Scripture;
  reading2?: Scripture;
  psalm: Psalm;
  alleluia: string;
  gospel: Scripture;
  gospelA?: Scripture;
  gospelC?: Scripture;
  shortGospel?: Scripture;
  extraGospel?: Scripture;
  vigil?: VigilUnit[];
};

export type DayRecord = {
  r: { s: string; c: string; t: string };
  /** First reading for Sunday cycle A, when the weekday reading changes. */
  rA?: { s: string; c: string; t: string };
  rs?: { s: string; c: string; t: string };
  r2?: { s: string; c: string; t: string };
  r2s?: { s: string; c: string; t: string };
  p: { c: string; r: string; s: string[] };
  a: string;
  g: { s: string; c: string; t: string };
  gA?: { s: string; c: string; t: string };
  gC?: { s: string; c: string; t: string };
  gs?: { s: string; c: string; t: string };
  gx?: { s: string; c: string; t: string };
  v?: { r: { s: string; c: string; t: string }; p: { c: string; r: string; s: string[] } }[];
  xref?: string;
};

export type ReadingsBundle = {
  readings: WeekdayReadings;
  /** Calendar weekday cycle asked for this date. */
  calendarYear: WeekdayYear;
  /** True when the requested cycle is missing and the other year is shown. */
  fallback: boolean;
  /** Ferial texts shown on a feast / solemnity. */
  ferialOnFeast: boolean;
  /** Sunday / solemnity table (Yia A / B / C). */
  sundayCycle?: "A" | "B" | "C";
  /** Label when readings come from a Common of Saints. */
  commonLabel?: string;
};
