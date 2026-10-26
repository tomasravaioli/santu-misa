import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { SPECIAL_SECTIONS } from "@/lib/special-masses";
import { DialogCloseButton } from "@/components/dialog-close-button";
import { cn } from "@/lib/utils";

const off = "border border-[#e6dfd4] bg-white text-[#1c1914]";

export function SpecialIndexDialog({
  open,
  onOpenChange,
  onPick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPick: (id: string) => void;
}) {
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const indexSection = SPECIAL_SECTIONS.find((item) => item.id === sectionId) ?? null;

  useEffect(() => {
    if (open) {
      setSectionId(null);
      setOpenGroup(null);
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-scrim" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[88vh] max-w-md flex-col overflow-hidden rounded-t-xl bg-paper p-5 text-ink shadow-[var(--shadow-border)] md:inset-auto md:top-1/2 md:left-1/2 md:bottom-auto md:w-[28rem] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl">
          <div className="mb-3 flex items-start justify-between gap-3">
            <Dialog.Title className="font-serif text-xl font-semibold leading-tight text-ink">
              {indexSection ? indexSection.title : "Skelim narapela Misa"}
            </Dialog.Title>
            <DialogCloseButton />
          </div>
          <Dialog.Description className="sr-only">
            Makim wanpela Misa komon, sakramen, votiv, o bilong helpim ol manmeri i dai pinis
          </Dialog.Description>
          {indexSection ? (
            <button
              type="button"
              onClick={() => {
                setSectionId(null);
                setOpenGroup(null);
              }}
              className="mb-3 flex items-center gap-1 self-start font-sans text-sm font-medium text-rubric"
            >
              <ChevronLeft className="size-4" />
              Back
            </button>
          ) : null}
          <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 pb-1">
            {indexSection ? (
              <div className="space-y-1">
                {indexSection.groups.map((group, index) => {
                  const titled = Boolean(group.title);
                  const expanded = !titled || openGroup === index;
                  return (
                    <div key={`${indexSection.id}-${index}`}>
                      {titled ? (
                        <button
                          type="button"
                          aria-expanded={openGroup === index}
                          onClick={() => setOpenGroup(openGroup === index ? null : index)}
                          className="flex w-full items-center justify-between gap-3 py-3 text-left font-sans text-xs font-semibold uppercase tracking-widest text-rubric"
                        >
                          <span>{group.title}</span>
                          <ChevronDown className={cn("size-4 shrink-0 transition-transform", openGroup === index && "rotate-180")} />
                        </button>
                      ) : null}
                      {expanded ? (
                        <div className={cn("flex flex-col", titled && "pb-2")}>
                          {group.items.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                onPick(item.id);
                                onOpenChange(false);
                              }}
                              className={cn(
                                "py-3 text-left font-sans leading-snug",
                                item.heading
                                  ? "font-semibold uppercase tracking-widest text-rubric"
                                  : "border-b border-rule text-sm font-medium text-ink hover:bg-paper-2",
                                item.heading ? "text-xs" : "",
                              )}
                            >
                              {item.title}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {SPECIAL_SECTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSectionId(item.id)}
                    className={cn(
                      "min-h-11 rounded-md px-3 py-3 text-left font-sans text-sm font-semibold leading-snug",
                      off,
                    )}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
