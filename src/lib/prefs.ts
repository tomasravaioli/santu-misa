import { create } from "zustand";
import type { ExtraEpId } from "./ep-extra";
import type { RitualPick } from "./lectionary/ritual";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "system" | "light" | "dark";
export type PenitentialForm = 1 | 2 | 3;
export type CreedForm = "nicene" | "apostles";
export type EucharisticPrayer = 1 | 2 | 3 | 4 | ExtraEpId;

export const EP_INFO: Record<
  1 | 2 | 3 | 4,
  { name: string; note: string }
> = {
  1: { name: "Bikpela Pre Tenkyu 1", note: "Bilong Rom" },
  2: { name: "Bikpela Pre Tenkyu 2", note: "Inap yusim Prefasio bilong dispela de" },
  3: { name: "Bikpela Pre Tenkyu 3", note: "Yusim Prefasio bilong dispela de" },
  4: { name: "Bikpela Pre Tenkyu 4", note: "Prefasio i pas wantaim. Pris i no ken senisim" },
};

type Prefs = {
  fontScale: number;
  showRubrics: boolean;
  showLatin: boolean;
  theme: ThemeMode;
  penitential: PenitentialForm;
  creed: CreedForm;
  ep: EucharisticPrayer;
  prefaceKey: string | null;
  intercessionKey: string | null;
  celebrate: Record<string, string>;
  commonPick: Record<string, string>;
  commonFormulary: Record<string, string>;
  ritualPick: Record<string, RitualPick>;
  setFontScale: (n: number) => void;
  setShowRubrics: (v: boolean) => void;
  setShowLatin: (v: boolean) => void;
  setTheme: (v: ThemeMode) => void;
  setPenitential: (v: PenitentialForm) => void;
  setCreed: (v: CreedForm) => void;
  setEp: (v: EucharisticPrayer) => void;
  setPrefaceKey: (v: string | null) => void;
  setIntercessionKey: (v: string | null) => void;
  setCelebrate: (iso: string, id: string) => void;
  setCommonPick: (iso: string, id: string) => void;
  setCommonFormulary: (iso: string, id: string) => void;
  setRitualPick: (massId: string, patch: Partial<RitualPick>) => void;
};

const memoryStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

/** Font size stays on tens: 80, 90, 100… 0.08 steps never landed back on 100. */
export function stepFontScale(current: number, deltaSteps: number): number {
  const pct = Math.round(current * 100);
  const snapped = Math.round(pct / 10) * 10;
  const next = Math.min(140, Math.max(80, snapped + deltaSteps * 10));
  return next / 100;
}

export const usePrefs = create<Prefs>()(
  persist(
    (set) => ({
      fontScale: 1,
      showRubrics: true,
      showLatin: false,
      theme: "light",
      penitential: 1,
      creed: "nicene",
      ep: 2,
      prefaceKey: null,
      intercessionKey: null,
      celebrate: {},
      commonPick: {},
      commonFormulary: {},
      ritualPick: {},
      setFontScale: (fontScale) => set({ fontScale: stepFontScale(fontScale, 0) }),
      setShowRubrics: (showRubrics) => set({ showRubrics }),
      setShowLatin: (showLatin) => set({ showLatin }),
      setTheme: (theme) => set({ theme }),
      setPenitential: (penitential) => set({ penitential }),
      setCreed: (creed) => set({ creed }),
      setEp: (ep) => set({ ep }),
      setPrefaceKey: (prefaceKey) => set({ prefaceKey }),
      setIntercessionKey: (intercessionKey) => set({ intercessionKey }),
      setCelebrate: (iso, id) =>
        set((s) => ({ celebrate: { ...(s.celebrate ?? {}), [iso]: id } })),
      setCommonPick: (iso, id) =>
        set((s) => ({ commonPick: { ...(s.commonPick ?? {}), [iso]: id } })),
      setCommonFormulary: (iso, id) =>
        set((s) => ({ commonFormulary: { ...(s.commonFormulary ?? {}), [iso]: id } })),
      setRitualPick: (massId, patch) =>
        set((s) => ({
          ritualPick: {
            ...(s.ritualPick ?? {}),
            [massId]: { ...(s.ritualPick?.[massId] ?? {}), ...patch },
          },
        })),
    }),
    {
      name: "buk-misa-prefs",
      version: 1,
      migrate: (persisted) => {
        const state = { ...(persisted as Partial<Prefs> & { darkMode?: boolean }) };
        if (state.theme !== "system" && state.theme !== "light" && state.theme !== "dark") {
          state.theme = state.darkMode ? "dark" : "light";
        }
        if (typeof state.fontScale === "number") state.fontScale = stepFontScale(state.fontScale, 0);
        return state as Prefs;
      },
      skipHydration: true,
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage : localStorage)),
    },
  ),
);
