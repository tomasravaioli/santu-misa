import type { DayRecord } from "./types";

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

export type CommonGroup = {
  id: CommonKind;
  title: string;
  options: CommonOption[];
};

declare const data: Record<CommonKind, CommonGroup>;
export default data;
