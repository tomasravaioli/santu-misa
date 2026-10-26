import type { DayRecord } from "./types";
import raw from "./saints.json";

export const SAINTS_LEC = raw as Record<string, DayRecord>;
