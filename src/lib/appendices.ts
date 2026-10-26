import type { MassLine, MassSection } from "./ordo";
import raw from "./appendices.json";

type Row = { v: "R" | "P" | "O" | "H"; t: string };
type Doc = { title: string; lines: Row[] };

const DOCS = raw as Record<string, Doc>;

export const APPENDIX_ITEMS = Object.entries(DOCS).map(([id, doc]) => ({
  id,
  title: doc.title,
  page: 0,
  appendix: true,
}));

export function appendixSections(id: string): MassSection[] | null {
  const doc = DOCS[id];
  if (!doc) return null;
  const lines: MassLine[] = [];
  for (const row of doc.lines) {
    if (row.v === "H") lines.push({ voice: "cite", text: row.t });
    else if (row.v === "R") {
      const prayerTitle = id === "ap7" && row.t !== "Apendiks 7";
      if (row.t === "†") lines.push({ voice: "rubric", text: "†", note: "center-mark" });
      else lines.push(prayerTitle ? { voice: "rubric", text: row.t, note: "center-title" } : { voice: "rubric", text: row.t });
    } else if (row.v === "O") lines.push({ voice: "people", text: row.t });
    else {
      const drop =
        row.t.startsWith("Lord, yu gutpela Papa") ||
        row.t.startsWith("Papa, yu holi,") ||
        row.t.startsWith("Tru, God Papa,") ||
        row.t.startsWith("God Papa, mipela i laik litimapim nem") ||
        row.t.startsWith("God, mipela i tenkim yu.") ||
        row.t.startsWith("Yu Papa bilong olgeta samting") ||
        row.t.startsWith("Lord, yu holi tru");
      lines.push(drop ? { voice: "priest", text: row.t, variant: "oration" } : { voice: "priest", text: row.t });
    }
  }
  return [{ id: "appendix", title: "", lines }];
}
