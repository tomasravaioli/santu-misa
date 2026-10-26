import entries from "./martyrology.json";

const table = entries as Record<string, string[]>;

/** English entries from the 2004 Roman Martyrology, bundled so the day list works offline. */
export function martyrologyOn(iso: string): string[] {
  return table[iso.slice(5)] ?? [];
}
