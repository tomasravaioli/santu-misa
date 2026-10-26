import type { DayRecord } from "./types";
import raw from "./commons.json";

export type CommonKind =
  | "apostles"
  | "martyrs"
  | "pastors"
  | "doctors"
  | "virgins"
  | "bvm"
  | "holy"
  | "dedication";

export type CommonOption = DayRecord & { id: string; label?: string };

export type CommonReading = {
  id: string;
  n: number;
  season?: string;
  label: string;
  r: DayRecord["r"];
  p: DayRecord["p"];
};

export type CommonGospel = {
  id: string;
  n: number;
  label: string;
  g: DayRecord["g"];
  a: string;
};

export type CommonGroup = {
  id: CommonKind;
  title: string;
  readings?: CommonReading[];
  gospels?: CommonGospel[];
  options: CommonOption[];
};

export const COMMONS = raw as Record<CommonKind, CommonGroup>;

export function inferSaintKind(title: string, properId = ""): CommonKind {
  const t = `${title} ${properId}`.toLowerCase();
  if (/lateran|haus lotu|blesim haus|blesing bilong/.test(t)) return "dedication";
  if (/aposel|evangelis|raitman bilong gutnius/.test(t)) return "apostles";
  if (/martir/.test(t)) return "martyrs";
  if (
    /(maria|meri|mary-sacred|immaculate-heart)/.test(t) &&
    !/magdalen|joakim|papamama/.test(t) &&
    !(/josep/.test(t) && !/bringim/.test(t))
  ) {
    return "bvm";
  }
  if (/\btisa\b/.test(t)) return "doctors";
  if (/virgo/.test(t) && !/josep|joakim|papamama/.test(t)) return "virgins";
  if (/bisop|pris|pop|abbot|diken|dikein|wasman|high-priest/.test(t)) return "pastors";
  return "holy";
}

function completeReading(item: CommonReading | undefined): item is CommonReading {
  return Boolean(item?.r?.t && item?.p?.r);
}

function completeGospel(item: CommonGospel | undefined): item is CommonGospel {
  return Boolean(item?.g?.t);
}

export function usableReadings(group: CommonGroup): CommonReading[] {
  return (group.readings ?? []).filter(completeReading);
}

export function usableGospels(group: CommonGroup): CommonGospel[] {
  return (group.gospels ?? []).filter(completeGospel);
}

export function parseCommonPick(id: string | null | undefined): { readingId: string; gospelId: string } {
  if (!id) return { readingId: "", gospelId: "" };
  if (id.includes("||")) {
    const [readingId, gospelId] = id.split("||");
    return { readingId: readingId ?? "", gospelId: gospelId ?? "" };
  }
  if (/\.g\d+$/.test(id)) return { readingId: "", gospelId: id };
  if (/\.r\d+$/.test(id)) return { readingId: id, gospelId: "" };
  return { readingId: id, gospelId: "" };
}

export function encodeCommonPick(readingId: string, gospelId: string): string {
  if (!readingId && !gospelId) return "";
  return `${readingId}||${gospelId}`;
}

function optionById(group: CommonGroup, id: string): CommonOption | undefined {
  return group.options.find((item) => item.id === id);
}

export function assembleCommon(
  group: CommonGroup,
  readingId?: string | null,
  gospelId?: string | null,
): DayRecord | null {
  const readings = usableReadings(group);
  const gospels = usableGospels(group);
  const reading =
    (readingId ? readings.find((item) => item.id === readingId) : undefined) ?? readings[0];
  const gospel =
    (gospelId ? gospels.find((item) => item.id === gospelId) : undefined) ?? gospels[0];
  if (reading && gospel) {
    return {
      r: reading.r,
      p: reading.p,
      a: gospel.a || "",
      g: gospel.g,
    };
  }
  const opt =
    (readingId ? optionById(group, readingId) : undefined) ??
    (gospelId ? optionById(group, gospelId) : undefined) ??
    group.options[0];
  if (opt?.r?.t && opt?.g?.t && opt?.p?.r) return opt;
  return null;
}

export function lookupCommon(id: string | null | undefined): DayRecord | null {
  if (!id) return null;
  const { readingId, gospelId } = parseCommonPick(id);
  for (const group of Object.values(COMMONS)) {
    const has =
      group.options.some((item) => item.id === id || item.id === readingId || item.id === gospelId) ||
      (group.readings ?? []).some((item) => item.id === readingId || item.id === id) ||
      (group.gospels ?? []).some((item) => item.id === gospelId || item.id === id);
    if (!has) continue;
    return assembleCommon(group, readingId, gospelId);
  }
  return null;
}

export function defaultCommon(kind: CommonKind): DayRecord | null {
  const group = COMMONS[kind];
  if (!group) return null;
  return assembleCommon(group);
}

export function commonsForKind(kind: CommonKind): CommonGroup | null {
  return COMMONS[kind] ?? null;
}

export function canAssembleCommon(group: CommonGroup | null | undefined): boolean {
  if (!group) return false;
  return Boolean(assembleCommon(group));
}
