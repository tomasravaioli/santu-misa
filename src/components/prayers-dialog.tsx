import * as Dialog from "@radix-ui/react-dialog";
import type { LiturgicalDay } from "@/lib/calendar";
import {
  defaultIntercessionId,
  EP2_OWN_KEY,
  intercessionChoices,
  prefaceChoicesFor,
  type PrefaceChoice,
} from "@/lib/propers";
import { usePrefs, type EucharisticPrayer, type PenitentialForm } from "@/lib/prefs";
import { EXTRA_EP_IDS, EXTRA_EP_TITLES, extraEpAllowed, isExtraEp } from "@/lib/ep-extra";
import { Button } from "@/components/ui/button";
import { DialogCloseButton } from "@/components/dialog-close-button";
import { cn } from "@/lib/utils";

const on = "bg-[#c1272d] text-white";
const off = "border border-[#e6dfd4] bg-white text-[#1c1914]";

export function PrayersDialog({
  open,
  onOpenChange,
  day,
  prefaceList,
  scope,
  formularies,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: LiturgicalDay;
  prefaceList?: PrefaceChoice[] | null;
  scope: "season" | "dead";
  formularies?: { title: string; items: { id: string; title: string }[] } | null;
}) {
  const prefs = usePrefs();
  const prefaceChoices = prefaceList?.length ? prefaceList : prefaceChoicesFor(day);
  const allowExtra = extraEpAllowed(day) && !prefaceList?.length;
  const usingExtra = isExtraEp(prefs.ep) && allowExtra;
  const activeNumber: 1 | 2 | 3 | 4 | null = usingExtra ? null : isExtraEp(prefs.ep) ? 2 : prefs.ep;
  const prefaceLocked = activeNumber === 4 || usingExtra;
  const activePreface =
    prefs.ep === 4
      ? null
      : !prefaceList?.length && activeNumber === 2 && prefs.prefaceKey === EP2_OWN_KEY
        ? { key: EP2_OWN_KEY, title: "Prefasio bilong Pre Tenkyu 2", text: "" }
        : (prefaceChoices.find((choice) => choice.key === prefs.prefaceKey) ?? prefaceChoices[0] ?? null);
  const prayers = intercessionChoices(day, scope);
  const activePrayer = prayers.some((item) => item.id === prefs.intercessionKey)
    ? prefs.intercessionKey
    : defaultIntercessionId(day, scope);
  const forms = formularies?.items ?? [];
  const activeForm = forms.some((item) => item.id === prefs.commonFormulary?.[day.date])
    ? prefs.commonFormulary[day.date]
    : forms[0]?.id;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-scrim" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88vh] max-w-md overflow-y-auto rounded-t-xl bg-paper p-5 text-[#1c1914] shadow-[var(--shadow-border)] md:inset-auto md:top-1/2 md:left-1/2 md:bottom-auto md:w-[28rem] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl">
          <div className="mb-4 flex items-start justify-between gap-3">
            <Dialog.Title className="font-serif text-xl font-semibold leading-tight">Makim ol pre bilong Misa</Dialog.Title>
            <DialogCloseButton />
          </div>
          <Dialog.Description className="sr-only">
            Makim Lotu Sori, Tok Bilip, Pre bilong ol Bilipmanmeri, Prefasio na Bikpela Pre Tenkyu
          </Dialog.Description>
          <div className="space-y-6 font-sans text-sm">
            {forms.length > 1 ? (
              <div>
                <p className="mb-2 font-medium uppercase tracking-wide">{formularies?.title}</p>
                <div className="space-y-2">
                  {forms.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => prefs.setCommonFormulary(day.date, item.id)}
                      className={cn(
                        "flex min-h-11 w-full items-center rounded-md px-3 py-2 text-left text-sm",
                        activeForm === item.id ? on : off,
                      )}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div>
              <p className="mb-2 font-medium uppercase tracking-wide">Lotu Sori</p>
              <div className="grid grid-cols-3 gap-2">
                {([1, 2, 3] as PenitentialForm[]).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => prefs.setPenitential(n)}
                    className={cn("h-11 rounded-md text-sm", prefs.penitential === n ? on : off)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            {day.creed ? (
            <div>
              <p className="mb-2 font-medium uppercase tracking-wide">Tok Bilip</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => prefs.setCreed("nicene")}
                  className={cn("h-11 rounded-md px-2 text-sm", prefs.creed === "nicene" ? on : off)}
                >
                  Naisia
                </button>
                <button
                  type="button"
                  onClick={() => prefs.setCreed("apostles")}
                  className={cn("h-11 rounded-md px-2 text-sm", prefs.creed === "apostles" ? on : off)}
                >
                  Ol Aposel
                </button>
              </div>
            </div>
            ) : null}
            <div>
              <p className="mb-2 font-medium uppercase tracking-wide">Pre bilong ol Bilipmanmeri</p>
              <div className="space-y-2">
                {prayers.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => prefs.setIntercessionKey(item.id)}
                    className={cn(
                      "flex min-h-11 w-full items-center rounded-md px-3 py-2 text-left text-sm",
                      activePrayer === item.id ? on : off,
                    )}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-medium uppercase tracking-wide">Prefasio</p>
              {prefaceLocked ? (
                <p className="rounded-md border border-[#e6dfd4] bg-white px-3 py-3 text-sm leading-snug text-[#3f3a33]">
                  {usingExtra
                    ? "Dispela Pre Tenkyu i gat Prefasio bilong em yet. Pris i no ken senisim."
                    : "Pre Tenkyu 4 i gat Prefasio bilong em yet. Pris i no ken senisim."}
                </p>
              ) : (
                <div className="space-y-2">
                  {prefaceChoices.map((choice) => {
                    const selected = (activePreface?.key ?? null) === choice.key;
                    return (
                      <button
                        key={choice.key}
                        type="button"
                        onClick={() => prefs.setPrefaceKey(choice.key)}
                        className={cn("flex min-h-11 w-full flex-col items-start rounded-md px-3 py-2 text-left", selected ? on : off)}
                      >
                        <span className="text-sm font-medium">{choice.title}</span>
                        {choice.subtitle ? <span className="text-sm font-normal">{choice.subtitle}</span> : null}
                      </button>
                    );
                  })}
                  {activeNumber === 2 && !prefaceList?.length ? (
                    <button
                      type="button"
                      onClick={() => prefs.setPrefaceKey(EP2_OWN_KEY)}
                      className={cn(
                        "flex min-h-11 w-full flex-col items-start rounded-md px-3 py-2 text-left",
                        prefs.prefaceKey === EP2_OWN_KEY ? on : off,
                      )}
                    >
                      <span className="text-sm font-medium">Prefasio bilong Pre Tenkyu 2</span>
                      <span className={cn("text-xs", prefs.prefaceKey === EP2_OWN_KEY ? "text-white/80" : "text-[#6f675c]")}>
                        Prefasio i stap insait long Pre Tenkyu 2 yet
                      </span>
                    </button>
                  ) : null}
                </div>
              )}
            </div>
            <div>
              <p className="mb-2 font-medium uppercase tracking-wide">Bikpela Pre Tenkyu</p>
              <div className="grid grid-cols-4 gap-2">
                {([1, 2, 3, 4] as EucharisticPrayer[]).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => prefs.setEp(n)}
                    className={cn("h-11 rounded-md text-sm", activeNumber === n ? on : off)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            {allowExtra ? (
              <div>
                <p className="mb-2 font-medium uppercase tracking-wide">Ol arapela Bikpela Pre Tenkyu</p>
                <div className="space-y-2">
                  {EXTRA_EP_IDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => prefs.setEp(id)}
                      className={cn(
                        "flex min-h-11 w-full flex-col items-start rounded-md px-3 py-2 text-left",
                        prefs.ep === id ? on : off,
                      )}
                    >
                      <span className="text-sm font-medium">{EXTRA_EP_TITLES[id]}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
