import type { DayRecord } from "./types";
import raw from "./seasons.json";

export const SEASONS = raw as Record<string, DayRecord>;
