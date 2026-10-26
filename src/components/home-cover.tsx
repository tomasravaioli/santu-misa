import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, ChevronLeft, ChevronRight, Mail, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import lambUrl from "@/assets/lamb.png";
import {
  COLOR_CLASS,
  FERIA_CELEBRATION,
  MONTHS_TPI,
  SEASON_TPI,
  WEEKDAYS_TPI,
  formatLongTpi,
  monthTitleTpi,
  parseYmd,
  resolveDay,
  searchSaints,
  shiftMonth,
  todayYmd,
  type LiturgicalDay,
} from "@/lib/calendar";
import { usePrefs } from "@/lib/prefs";
import { SettingsDialog } from "@/components/settings-dialog";
import { SpecialIndexDialog } from "@/components/special-index-dialog";
import { DialogCloseButton } from "@/components/dialog-close-button";
import { martyrologyOn } from "@/lib/martyrology";
import { cn } from "@/lib/utils";

function temporalLine(day: LiturgicalDay): string {
  const season = SEASON_TPI[day.season];
  if (day.isSunday && day.week) return `Sande ${day.week} long ${season}`;
  if (day.week) return `Wik ${day.week} long ${season}`;
  return day.titleTpi;
}

function isGenericFeria(day: LiturgicalDay): boolean {
  const season = SEASON_TPI[day.season];
  const wd = day.isSunday ? "Sande" : WEEKDAYS_TPI[day.weekday];
  return day.titleTpi.includes(season) && day.titleTpi.startsWith(wd);
}

function seasonLine(day: LiturgicalDay): string {
  const memorialMenu = day.options.some((opt) => opt.id === FERIA_CELEBRATION);
  if (memorialMenu) return temporalLine(day);
  if (day.rank === "feria" && isGenericFeria(day)) return temporalLine(day);
  return day.titleTpi;
}

function orLines(day: LiturgicalDay): string[] {
  if (!day.options.some((opt) => opt.id === FERIA_CELEBRATION)) return [];
  return day.options
    .filter((opt) => opt.id !== FERIA_CELEBRATION)
    .map((opt) => `o ${opt.titleTpi.split(",")[0]?.trim()}`);
}

function readingsLine(day: LiturgicalDay): string {
  const bits = [`Yia ${day.sundayCycle}`];
  if (!day.isSunday) bits.push(day.weekdayCycle === "I" ? "1" : "2");
  if (day.week) bits.push(`Wikde ${day.week}`);
  return `Ol rit: ${bits.join(" · ")}`;
}

function MonthGrid({
  cursor,
  selected,
  onPick,
}: {
  cursor: string;
  selected: string;
  onPick: (iso: string) => void;
}) {
  const { y, m } = parseYmd(cursor);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const startWd = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const cells: (string | null)[] = [];
  for (let i = 0; i < startWd; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }
  const today = todayYmd();
  return (
    <div>
      <div className="grid grid-cols-7 text-center font-sans text-[11px] font-semibold uppercase tracking-wider text-muted">
        {WEEKDAYS_TPI.map((name) => (
          <span key={name}>{name.slice(0, 3)}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-0.5">
        {cells.map((iso, i) =>
          iso ? (
            <button
              key={iso}
              type="button"
              onClick={() => onPick(iso)}
              className={cn(
                "mx-auto flex h-11 w-10 flex-col items-center justify-center rounded-lg text-[15px] tabular-nums",
                iso === selected && "border-2 border-[#1c1914] bg-[#faf7f1] font-medium text-ink dark:border-white dark:bg-[#141414]",
                iso === today && iso !== selected && "ring-1 ring-[#c1272d]",
                iso !== selected && "text-ink",
              )}
            >
              {parseYmd(iso).d}
              <span
                className={cn(
                  "mt-0.5 size-2 rounded-full ring-1 ring-[#1c1914]/40",
                  COLOR_CLASS[resolveDay(iso).color],
                  resolveDay(iso).color === "white" && "bg-white ring-2 ring-[#1c1914]/70",
                )}
              />
            </button>
          ) : (
            <span key={`e-${i}`} />
          ),
        )}
      </div>
    </div>
  );
}

function MonthSheet({
  open,
  onOpenChange,
  cursor,
  selected,
  onPick,
  onShift,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cursor: string;
  selected: string;
  onPick: (iso: string) => void;
  onShift: (delta: number) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const { y, m } = parseYmd(cursor);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const today = todayYmd();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    return `${y}-${String(m).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      if (selectedRef.current) selectedRef.current.scrollIntoView({ block: "center" });
      else if (listRef.current) listRef.current.scrollTop = 0;
    }, 40);
    return () => window.clearTimeout(id);
  }, [open, cursor, selected]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-scrim" />
        <Dialog.Content className="fixed top-3 right-3 bottom-3 left-3 z-50 flex flex-col overflow-hidden rounded-xl border border-rule bg-paper text-ink shadow-[var(--shadow-border)]">
          <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3">
            <Dialog.Title className="font-serif text-2xl font-semibold">{monthTitleTpi(cursor)}</Dialog.Title>
            <DialogCloseButton />
          </div>
          <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto">
            {days.map((iso) => {
              const lit = resolveDay(iso);
              const extras = orLines(lit);
              const isSelected = iso === selected;
              const isToday = iso === today;
              const sunday = lit.isSunday;
              return (
                <button
                  key={iso}
                  ref={isSelected ? selectedRef : undefined}
                  type="button"
                  onClick={() => onPick(iso)}
                  className={cn(
                    "flex w-full items-start gap-2 border-b border-rule px-3 py-2.5 text-left font-sans",
                    sunday && "bg-[#c1272d] text-white",
                    !sunday && isSelected && "ring-2 ring-inset ring-rubric",
                    sunday && isSelected && "ring-2 ring-inset ring-white",
                  )}
                >
                  <span
                    className={cn(
                      "flex w-[4.6rem] shrink-0 items-baseline gap-1.5 pt-0.5 font-sans text-sm",
                      sunday ? "font-medium text-white" : "text-muted",
                    )}
                  >
                    <span className="w-8">{WEEKDAYS_TPI[lit.weekday].slice(0, 3)}</span>
                    <span className={cn("tabular-nums", sunday ? "text-white" : "font-medium text-ink")}>{parseYmd(iso).d}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block font-sans text-[15px] font-medium leading-snug", sunday ? "text-white" : "text-ink", isToday && "font-semibold")}>
                      {seasonLine(lit)}
                    </span>
                    {extras.map((line) => (
                      <span key={line} className={cn("block font-sans text-[13px] leading-snug", sunday ? "text-white/85" : "text-ink-soft")}>
                        {line}
                      </span>
                    ))}
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 size-2.5 shrink-0 rounded-full",
                      sunday ? "ring-1 ring-white/80" : "ring-1 ring-ink/40",
                      COLOR_CLASS[lit.color],
                      lit.color === "white" && "bg-white",
                      lit.color === "white" && !sunday && "ring-2 ring-ink/70",
                    )}
                  />
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-rule px-4 py-3">
            <button
              type="button"
              aria-label="Mun i go pas"
              onClick={() => onShift(-1)}
              className="grid size-10 place-items-center rounded-full border border-[#e6dfd4] bg-white text-ink shadow-sm dark:border-white/20 dark:bg-[#1c1c1c] dark:text-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Mun bihain"
              onClick={() => onShift(1)}
              className="grid size-10 place-items-center rounded-full border border-[#e6dfd4] bg-white text-ink shadow-sm dark:border-white/20 dark:bg-[#1c1c1c] dark:text-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function HomeCover({
  day,
  onDate,
  onOpenDayMass,
  onChooseCelebration,
  onPickSpecial,
}: {
  day: LiturgicalDay;
  onDate: (iso: string, celebrateId?: string) => void;
  onOpenDayMass: () => void;
  onChooseCelebration: (id: string) => void;
  onPickSpecial: (id: string) => void;
}) {
  const [cursor, setCursor] = useState(day.date);
  const [menuOpen, setMenuOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [saintsOpen, setSaintsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const hasChoice = day.options.length > 1;
  const hits = searchOpen ? searchSaints(query, parseYmd(cursor).y) : [];
  const saints = saintsOpen ? martyrologyOn(day.date) : null;
  const massLabel = day.date === todayYmd() ? "Misa bilong tude" : day.titleTpi;

  useEffect(() => {
    setMenuOpen(false);
    setCursor(day.date);
  }, [day.date]);

  const alts = orLines(day);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-paper px-4 pb-6 pt-5 text-ink">
      <header className="flex items-start gap-2">
        <img src={lambUrl} alt="" className="h-[6.6rem] w-auto shrink-0 object-contain sm:h-32" />
        <div className="min-w-0 flex-1 text-center">
          <h1 className="font-serif text-[1.7rem] font-semibold leading-none tracking-[0.04em] text-rubric sm:text-[2rem]">
            SANTU MISA
          </h1>
          <p className="mt-2 font-serif text-[0.95rem] font-medium leading-tight text-rubric">{formatLongTpi(day.date)}</p>
          <div className="mt-0.5 flex min-h-[5.75rem] flex-col">
            <p className="font-serif text-[1.02rem] font-semibold leading-snug text-ink">{seasonLine(day)}</p>
            {alts.map((line) => (
              <p key={line} className="font-serif text-[1.02rem] font-semibold leading-snug text-ink">
                {line}
              </p>
            ))}
            <p className="mt-0.5 font-serif text-[0.95rem] font-medium leading-tight text-rubric">{readingsLine(day)}</p>
          </div>
        </div>
      </header>

      <section className="mt-4 rounded-[1.35rem] border border-[#e4dccf] bg-[#faf7f1] px-3.5 pb-4 pt-3.5 shadow-[0_10px_28px_rgba(28,25,20,0.06)] dark:border-white/10 dark:bg-[#141414] dark:shadow-none">
        <h2 className="font-serif text-xl font-semibold text-ink">Kalenda</h2>
        <div className="mb-2 mt-3 flex items-center justify-between">
          <button
            type="button"
            aria-label="Mun i go pas"
            onClick={() => setCursor(shiftMonth(cursor, -1))}
            className="grid size-10 place-items-center rounded-full border border-[#e6dfd4] bg-white text-[#1c1914] shadow-sm dark:border-white/20 dark:bg-[#1c1c1c] dark:text-white"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setMonthOpen(true)}
            className="font-serif text-2xl font-semibold"
          >
            {monthTitleTpi(cursor)}
          </button>
          <button
            type="button"
            aria-label="Mun bihain"
            onClick={() => setCursor(shiftMonth(cursor, 1))}
            className="grid size-10 place-items-center rounded-full border border-[#e6dfd4] bg-white text-[#1c1914] shadow-sm dark:border-white/20 dark:bg-[#1c1c1c] dark:text-white"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
        <MonthGrid cursor={cursor} selected={day.date} onPick={onDate} />

        <div className="relative mt-4">
          {menuOpen && hasChoice ? (
            <>
              <button type="button" aria-label="Pasim" className="fixed inset-0 z-40 cursor-default" onClick={() => setMenuOpen(false)} />
              <div
                role="menu"
                className="absolute right-0 bottom-full left-0 z-50 mb-2 overflow-hidden rounded-xl border border-[#e6dfd4] bg-white shadow-[var(--shadow-border)] dark:border-white/15 dark:bg-[#1c1c1c]"
              >
                {day.options.map((opt) => {
                  const selected = day.celebratedId === opt.id;
                  const label = opt.id === FERIA_CELEBRATION ? `Misa bilong ${WEEKDAYS_TPI[day.weekday]}` : opt.titleTpi;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        onChooseCelebration(opt.id);
                      }}
                      className={cn(
                        "block w-full px-3 py-3 text-left font-sans text-[15px] font-normal leading-snug",
                        selected ? "bg-[#c1272d] text-white" : "text-[#1c1914] hover:bg-paper-2 dark:text-white dark:hover:bg-white/10",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}
          <div className="relative h-[3.15rem] overflow-hidden rounded-xl bg-[#c1272d] text-white">
            <button
              type="button"
              onClick={() => (hasChoice ? setMenuOpen((v) => !v) : onOpenDayMass())}
              className={cn(
                "absolute inset-0 flex items-center justify-center px-3 text-center font-sans text-[15px] font-medium leading-tight",
                hasChoice && "pr-12",
              )}
            >
              <span className="line-clamp-2">{massLabel}</span>
            </button>
            {hasChoice ? (
              <button
                type="button"
                aria-label="Skelim misa bilong de o santu"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen((v) => !v)}
                className="absolute top-0 right-0 z-10 grid h-full w-12 place-items-center"
              >
                <ChevronDown className="size-5" />
              </button>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIndexOpen(true)}
          className="relative mt-2.5 h-[3.15rem] w-full rounded-xl border border-[#e7e0d6] bg-white font-sans text-[15px] font-medium text-[#1c1914] shadow-sm dark:border-white/20 dark:bg-[#1c1c1c] dark:text-white"
        >
          Skelim narapela Misa
          <ChevronDown className="absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-[#c1272d]" />
        </button>
        <button
          type="button"
          onClick={() => setSaintsOpen(true)}
          className="mt-2.5 h-[3.15rem] w-full rounded-xl border border-[#e7e0d6] bg-white font-sans text-[15px] font-medium text-[#1c1914] shadow-sm dark:border-white/20 dark:bg-[#1c1c1c] dark:text-white"
        >
          Ol Santu bilong tude
        </button>
        <div className="relative mt-2.5">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6f675c]" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => {
              window.setTimeout(() => setSearchOpen(false), 150);
            }}
            placeholder="Painim pestode"
            className="h-11 w-full rounded-xl border border-[#e6dfd4] bg-white pr-3 pl-9 font-sans text-sm text-[#1c1914] outline-none placeholder:text-[#8a8175] dark:border-white/20 dark:bg-[#1c1c1c] dark:text-white"
          />
          {searchOpen && query.trim().length >= 2 ? (
            <div className="absolute right-0 bottom-full left-0 z-30 mb-1 max-h-64 overflow-y-auto rounded-xl border border-[#e6dfd4] bg-white shadow-[var(--shadow-border)] dark:border-white/15 dark:bg-[#1c1c1c]">
              {hits.length ? (
                hits.map((hit) => {
                  const { d, m } = parseYmd(hit.iso);
                  return (
                    <button
                      key={`${hit.id}-${hit.iso}`}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        onDate(hit.iso, hit.id);
                        setQuery("");
                        setSearchOpen(false);
                      }}
                      className="flex w-full items-baseline justify-between gap-3 px-3 py-2.5 text-left hover:bg-[#faf7f1] dark:hover:bg-white/10"
                    >
                      <span className="font-sans text-sm leading-snug text-[#1c1914] dark:text-white">{hit.name}</span>
                      <span className="shrink-0 font-sans text-xs text-[#6f675c]">
                        {d} {MONTHS_TPI[m - 1]}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="px-3 py-3 font-sans text-sm text-[#6f675c]">No gat samting</p>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Senesim ol pasin"
          onClick={() => setSettingsOpen(true)}
          className="grid size-[3.35rem] place-items-center rounded-full border border-[#d9cfc0] bg-[#f7f1e6] text-[#1c1914] dark:border-white/20 dark:bg-[#1c1c1c] dark:text-white"
        >
          <SlidersHorizontal className="size-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          aria-label="Tokim mipela"
          onClick={() => setMailOpen(true)}
          className="grid size-[3.35rem] place-items-center rounded-full border border-[#d9cfc0] bg-[#f7f1e6] text-[#1c1914] dark:border-white/20 dark:bg-[#1c1c1c] dark:text-white"
        >
          <Mail className="size-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          aria-label="Infomesen"
          onClick={() => setInfoOpen(true)}
          className="grid h-[3.35rem] place-items-center rounded-full border border-[#d9cfc0] bg-[#f7f1e6] px-4 font-sans text-[15px] font-normal lowercase leading-none text-[#1c1914] dark:border-white/20 dark:bg-[#1c1c1c] dark:text-white"
        >
          info
        </button>
      </div>

      <MonthSheet
        open={monthOpen}
        onOpenChange={setMonthOpen}
        cursor={cursor}
        selected={day.date}
        onPick={(iso) => {
          setMonthOpen(false);
          onDate(iso);
        }}
        onShift={(delta) => setCursor(shiftMonth(cursor, delta))}
      />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <SpecialIndexDialog open={indexOpen} onOpenChange={setIndexOpen} onPick={onPickSpecial} />

      <Dialog.Root open={mailOpen} onOpenChange={setMailOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-scrim" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(22rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-paper p-6 text-center text-[#1c1914] shadow-[var(--shadow-border)]">
            <Dialog.Title className="sr-only">Tok</Dialog.Title>
            <Dialog.Description className="font-serif text-lg leading-snug text-[#1c1914]">
              For suggestions or if you have found errors, write to{" "}
              <a className="text-rubric underline" href="mailto:lci.pngsi.director@gmail.com">
                lci.pngsi.director@gmail.com
              </a>
              .
            </Dialog.Description>
            <div className="mt-5 flex justify-center">
              <DialogCloseButton />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={saintsOpen} onOpenChange={setSaintsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-scrim" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[min(36rem,calc(100%-2rem))] w-[min(26rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-paper p-6 text-[#1c1914] shadow-[var(--shadow-border)] dark:text-white">
            <Dialog.Title className="sr-only">Ol Santu bilong tude</Dialog.Title>
            <Dialog.Description className="sr-only">
              Ol santu bilong {formatLongTpi(day.date)}
            </Dialog.Description>
            <div className="space-y-4">
              {saints ? (
                <p className="text-justify font-sans text-base leading-relaxed text-rubric italic">
                  From the Roman Martyrology 2004
                </p>
              ) : null}
              {saints?.length ? (
                saints.map((entry, index) => (
                  <p key={index} className="text-justify font-sans text-base leading-relaxed text-[#1c1914] dark:text-white">
                    {entry}
                  </p>
                ))
              ) : saints ? (
                <p className="text-justify font-sans text-base leading-relaxed text-[#1c1914] dark:text-white">
                  No gat samting
                </p>
              ) : null}
            </div>
            <div className="mt-5 flex justify-center">
              <DialogCloseButton />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={infoOpen} onOpenChange={setInfoOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-scrim" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[min(32rem,calc(100%-2rem))] w-[min(24rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-paper p-6 text-[#1c1914] shadow-[var(--shadow-border)]">
            <Dialog.Title className="sr-only">Infomesen</Dialog.Title>
            <Dialog.Description className="text-justify font-sans text-base leading-relaxed text-[#1c1914]">
              This application was not designed for the celebration or concelebration of Holy Mass. Priests should not
              use it to celebrate or concelebrate. For that purpose the liturgical books exist, whose dignity is
              irreplaceable. It is intended for those who, for various reasons, cannot attend Mass and wish, from their
              homes, to follow and unite themselves spiritually to the Mass of the day. The use of a telephone or tablet
              during Mass is improper and unworthy of the Mystery being celebrated.
            </Dialog.Description>
            <div className="mt-5 flex justify-center">
              <DialogCloseButton />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
