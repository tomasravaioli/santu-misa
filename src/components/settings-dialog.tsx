import * as Dialog from "@radix-ui/react-dialog";
import { Minus, Moon, Plus, Smartphone, Sun } from "lucide-react";
import { stepFontScale, usePrefs, type ThemeMode } from "@/lib/prefs";
import { DialogCloseButton } from "@/components/dialog-close-button";
import { cn } from "@/lib/utils";

const on = "bg-[#c1272d] text-white";
const off = "border border-[#e6dfd4] bg-white text-[#1c1914]";

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const prefs = usePrefs();
  const percent = Math.round(stepFontScale(prefs.fontScale, 0) * 100);
  const fill = ((percent - 80) / 60) * 100;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-scrim" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-paper px-4 py-4 text-[#1c1914] shadow-[var(--shadow-border)]">
          <Dialog.Description className="sr-only">Senesim namba bilong leta, rublik na lait o tudak</Dialog.Description>
          <div className="grid grid-cols-[auto_2.75rem] items-center gap-x-2 font-sans text-sm">
            <div className="col-span-2 mb-4 flex justify-end">
              <Dialog.Title className="sr-only">Pasin bilong ritim</Dialog.Title>
              <DialogCloseButton />
            </div>
            <p className="col-span-2 mb-2 font-medium uppercase tracking-wide">Text size</p>
            <div className="col-span-2 mb-5 w-36">
              <div className="mb-1 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Liklik leta"
                  className="grid size-6 place-items-center text-[#1c1914] dark:text-white"
                  onClick={() => prefs.setFontScale(stepFontScale(prefs.fontScale, -1))}
                >
                  <Minus className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Bikpela leta"
                  className="grid size-6 place-items-center text-[#1c1914] dark:text-white"
                  onClick={() => prefs.setFontScale(stepFontScale(prefs.fontScale, 1))}
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <input
                type="range"
                min={80}
                max={140}
                step={10}
                value={percent}
                aria-label="Text size"
                aria-valuemin={80}
                aria-valuemax={140}
                aria-valuenow={percent}
                onChange={(event) => prefs.setFontScale(Number(event.target.value) / 100)}
                className="font-size-range w-full"
                style={{
                  background: `linear-gradient(to right, #c1272d ${fill}%, #d9cfc0 ${fill}%)`,
                }}
              />
              <p className="mt-2 flex h-9 items-center overflow-hidden font-serif leading-none text-[#6f675c] dark:text-[#a8a29a]">
                <span className="whitespace-nowrap" style={{ fontSize: `${(percent / 100) * 1.125}rem` }}>
                  Sample text
                </span>
              </p>
            </div>
            <span className="mb-5 font-medium uppercase tracking-wide">Show rubrics</span>
            <span className="mb-5 grid size-11 place-items-center">
              <input
                type="checkbox"
                checked={prefs.showRubrics}
                onChange={(e) => prefs.setShowRubrics(e.target.checked)}
                className="size-5 accent-[#c1272d]"
              />
            </span>
            <p className="col-span-2 mb-2 font-medium uppercase tracking-wide">Mode</p>
            <div className="col-span-2 flex justify-between">
              {(
                [
                  ["system", "Use the phone setting", Smartphone],
                  ["light", "Light mode", Sun],
                  ["dark", "Dark mode", Moon],
                ] as const
              ).map(([mode, label, Icon]) => (
                <button
                  key={mode}
                  type="button"
                  aria-label={label}
                  aria-pressed={prefs.theme === mode}
                  onClick={() => prefs.setTheme(mode as ThemeMode)}
                  className={cn("grid size-11 place-items-center rounded-md", prefs.theme === mode ? on : off)}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </button>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
