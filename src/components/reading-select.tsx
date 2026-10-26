import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown } from "lucide-react";
import { DialogCloseButton } from "@/components/dialog-close-button";
import { cn } from "@/lib/utils";

export type ReadingOption = { id: string; label: string };

function splitOption(label: string): { n: string; cite: string; blurb: string } {
  const [head, ...rest] = label.split(/\s+[—–]\s+/);
  const blurb = rest.join(" — ").trim();
  const m = (head ?? "").trim().match(/^(\d+)\.\s*(.*)$/);
  if (m) return { n: m[1], cite: m[2].trim(), blurb };
  return { n: "", cite: (head ?? label).trim(), blurb };
}

export function ReadingSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  options: ReadingOption[];
  onChange: (id: string) => void;
}) {
  const current = options.find((item) => item.id === value);
  const shown = current ? splitOption(current.label) : null;
  const closed = shown ? (shown.n ? `${shown.n}. ${shown.cite}` : shown.cite) : placeholder || "Makim…";

  return (
    <div className="block min-w-0">
      <p className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="flex min-h-11 w-full items-center justify-between gap-2 rounded-sm border border-[#e6dfd4] bg-white px-3 py-2 text-left font-sans text-xs text-[#1c1914]"
          >
            <span className="truncate">{closed}</span>
            <ChevronDown className="size-4 shrink-0 text-[#6f675c]" aria-hidden />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-scrim" />
          <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[78vh] max-w-md flex-col overflow-hidden rounded-t-xl bg-paper text-[#1c1914] shadow-[var(--shadow-border)] md:inset-auto md:top-1/2 md:left-1/2 md:bottom-auto md:w-[28rem] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl">
            <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2">
              <Dialog.Title className="font-sans text-sm font-semibold uppercase tracking-wide">{label}</Dialog.Title>
              <DialogCloseButton />
            </div>
            <Dialog.Description className="sr-only">Makim wanpela rit</Dialog.Description>
            <div className="overflow-y-auto px-3 pb-4">
              {options.map((item) => {
                const parts = splitOption(item.label);
                const selected = item.id === value;
                return (
                  <Dialog.Close asChild key={item.id || item.label}>
                    <button
                      type="button"
                      onClick={() => onChange(item.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left",
                        selected ? "bg-[#c1272d] text-white" : "text-[#1c1914]",
                      )}
                    >
                      <span className="w-5 shrink-0 text-center font-sans text-xs font-semibold tabular-nums">
                        {parts.n}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-sans text-sm leading-snug">{parts.cite || item.label}</span>
                        {parts.blurb ? (
                          <span
                            className={cn(
                              "block truncate font-sans text-xs leading-snug",
                              selected ? "text-white/80" : "text-[#6f675c]",
                            )}
                          >
                            {parts.blurb}
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={cn(
                          "size-3.5 shrink-0 rounded-full border",
                          selected ? "border-white bg-white" : "border-[#c4bdb2]",
                        )}
                        aria-hidden
                      />
                    </button>
                  </Dialog.Close>
                );
              })}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
