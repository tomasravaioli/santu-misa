import { ChevronLeft, ChevronRight, Home, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import {
  COLOR_CLASS,
  FERIA_CELEBRATION,
  formatLongTpi,
  type LiturgicalDay,
} from "@/lib/calendar";
import { usePrefs } from "@/lib/prefs";
import { canAssembleCommon, citationChips, celebratingSaint, commonReadingsBundle, commonsForKind, commonsPickerForDay, encodeCommonPick, hasFerialReadings, hasSaintProper, inferSaintKind, isWeekdayReadingsPick, parseCommonPick, PROPER_READINGS_ID, SAINT_MENU_ID, usableGospels, usableReadings, WEEKDAY_READINGS_ID } from "@/lib/lectionary";
import { resolveRitual, ritualChooser } from "@/lib/lectionary/ritual";
import { type PrefaceChoice } from "@/lib/propers";
import { specialGroupTitle, specialSectionId, commonFormularyChoices } from "@/lib/special-masses";
import { Button } from "@/components/ui/button";
import { PrayersDialog } from "@/components/prayers-dialog";
import { SettingsDialog } from "@/components/settings-dialog";
import { SpecialIndexDialog } from "@/components/special-index-dialog";
import { cn } from "@/lib/utils";
import { ReadingSelect } from "@/components/reading-select";

const sheetOn = "bg-[#c1272d] text-white";
const sheetOff = "border border-[#e6dfd4] bg-white text-[#1c1914]";

export function DayChrome({
  day,
  onDate,
  specialTitle,
  specialId,
  onPickSpecial,
  onClearSpecial,
  prefaceList,
  onHome,
  onEarlier,
  onLater,
  earlierDisabled,
  laterDisabled,
  hideCelebrationPicker,
}: {
  day: LiturgicalDay;
  onDate: (iso: string) => void;
  specialTitle?: string | null;
  specialId?: string | null;
  onPickSpecial: (id: string) => void;
  onClearSpecial: () => void;
  onHome?: () => void;
  onEarlier?: () => void;
  onLater?: () => void;
  earlierDisabled?: boolean;
  laterDisabled?: boolean;
  /** Prefaces of a mass from the index. When set, they replace the day's preface. */
  prefaceList?: PrefaceChoice[] | null;
  /** The priest already chose the mass on the cover. Do not ask again. */
  hideCelebrationPicker?: boolean;
}) {
  const prefs = usePrefs();
  const [setOpen, setSetOpen] = useState(false);
  const [prayersOpen, setPrayersOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const sectionId = specialSectionId(specialId);
  const cites = citationChips(day, prefs.commonPick?.[day.date]);
  const canProper = hasSaintProper(day);
  const commonGroupAll = commonsPickerForDay(day);
  const properOnly = Boolean(commonGroupAll?.id === "holy" && canProper);
  const commonGroup = properOnly ? null : commonGroupAll;
  const commonId = prefs.commonPick?.[day.date] ?? "";
  const parsed = parseCommonPick(commonId.includes("||") ? commonId : "");
  const menuOpen = Boolean(commonGroup) && (commonId === SAINT_MENU_ID || commonId.includes("||"));
  const usingProper = commonId === PROPER_READINGS_ID;
  const usingSaint = menuOpen || usingProper;
  const canSaintReadings = Boolean(commonGroup) || canProper;
  const commonReadings = commonGroup ? usableReadings(commonGroup) : [];
  const commonGospels = commonGroup ? usableGospels(commonGroup) : [];
  const canWeekday = hasFerialReadings(day);
  const showReadingsChooser =
    celebratingSaint(day) && day.rank === "memorial" && (canWeekday || canSaintReadings);
  const ritualPick = specialId ? prefs.ritualPick?.[specialId] : undefined;
  const ritual = specialId ? resolveRitual(specialId, ritualPick) : null;
  const chooser = specialId ? ritualChooser(specialId, ritualPick) : null;
  const ritualCites = ritual
    ? [ritual.ot?.citation, ritual.nt?.citation, ritual.psalm?.citation, ritual.gospel?.citation].filter(Boolean)
    : [];
  const specialKind = specialId ? inferSaintKind(`${specialGroupTitle(specialId)} ${specialTitle ?? ""}`) : null;
  const specialCommon = sectionId === "s1" && specialKind ? commonsForKind(specialKind) : null;
  const showSpecialCommon = Boolean(specialCommon && canAssembleCommon(specialCommon));
  const specialPickKey = specialId ? `sp:${specialId}` : "";
  const specialPick = specialPickKey ? (prefs.commonPick?.[specialPickKey] ?? "") : "";
  const specialUsingDay = isWeekdayReadingsPick(specialPick);
  const specialParsed = parseCommonPick(specialUsingDay ? "" : specialPick);
  const specialReadings = specialCommon ? usableReadings(specialCommon) : [];
  const specialGospels = specialCommon ? usableGospels(specialCommon) : [];
  const specialReadingId = specialParsed.readingId || specialReadings[0]?.id || "";
  const specialGospelId = specialParsed.gospelId || specialGospels[0]?.id || "";
  const specialBundle =
    showSpecialCommon && specialKind && !specialUsingDay ? commonReadingsBundle(specialKind, specialPick) : null;
  const specialCites = specialBundle
    ? [
        specialBundle.readings.reading.citation,
        specialBundle.readings.psalm.citation,
        specialBundle.readings.reading2?.citation,
        specialBundle.readings.gospel.citation,
      ].filter(Boolean)
    : [];
  const showDayCites = !specialTitle || sectionId === "s3" || sectionId === "s4" || (sectionId === "s1" && specialUsingDay);

  return (
    <header className="border-b border-rule bg-transparent">
      <div className="mx-auto max-w-2xl px-3 py-3">
        <div className="flex items-start gap-2">
          <div className="flex flex-col gap-1.5">
            {onHome ? (
              <Button size="icon" aria-label="Home" className={sheetOff} onClick={onHome}>
                <Home className="size-5" />
              </Button>
            ) : null}
            <Button
              size="icon"
              aria-label="Misa bipo"
              className={sheetOff}
              disabled={earlierDisabled || !onEarlier}
              onClick={onEarlier}
            >
              <ChevronLeft className="size-5" />
            </Button>
          </div>
          <span className={cn("mt-1 h-12 w-1.5 shrink-0 rounded-full", COLOR_CLASS[day.color])} />
          <div className="min-w-0 flex-1">
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-rubric">
              {formatLongTpi(day.date)}
            </p>
            <h1 className="font-serif text-lg font-semibold leading-tight text-ink">
              {specialTitle || day.titleTpi}
            </h1>
            <p className="mt-0.5 font-sans text-xs leading-snug text-rubric">
              {sectionId === "apx"
                ? "Apendiks"
                : specialTitle
                  ? `Misa yu bin makim · ${day.metaTpi}`
                  : `${day.subtitleTpi} · ${day.metaTpi}`}
            </p>
            {ritualCites.length ? (
              <p className="mt-1.5 font-serif text-sm leading-snug text-rubric">{ritualCites.join(" · ")}</p>
            ) : specialCites.length ? (
              <p className="mt-1.5 font-serif text-sm leading-snug text-rubric">{specialCites.join(" · ")}</p>
            ) : cites.length && showDayCites ? (
              <p className="mt-1.5 font-serif text-sm leading-snug text-rubric">{cites.join(" · ")}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Button size="icon" aria-label="Senesim ol pasin" className={sheetOff} onClick={() => setSetOpen(true)}>
              <SlidersHorizontal className="size-5" strokeWidth={1.75} />
            </Button>
            <Button
              size="icon"
              aria-label="Misa bihain"
              className={sheetOff}
              disabled={laterDisabled || !onLater}
              onClick={onLater}
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>
        {day.options.length > 1 && !specialTitle && !hideCelebrationPicker ? (
          <div className="mt-3">
            <p className="mb-1.5 font-sans text-xs leading-snug text-rubric">
              {day.options.some((opt) => opt.id === FERIA_CELEBRATION)
                ? "Pris i ken skelim sapos em i laik tingim dispela de o nogat."
                : "Pris i ken skelim wanem Misa."}
            </p>
            <div className="flex flex-wrap gap-2">
              {day.options.map((opt) => {
                const selected = day.celebratedId === opt.id;
                const label = opt.id === FERIA_CELEBRATION ? "Misa bilong de" : opt.titleTpi;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      prefs.setCelebrate(day.date, opt.id);
                      prefs.setPrefaceKey(null);
                    }}
                    className={cn(
                      "min-h-11 max-w-full rounded-full px-3 py-2 text-left font-sans text-xs font-medium leading-snug",
                      selected ? sheetOn : sheetOff,
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
        {showReadingsChooser && !specialTitle ? (
          <div className="mt-3">
            <p className="mb-1.5 font-sans text-xs leading-snug text-rubric">
              {commonGroup
                ? "Rit bilong de i stap pastaim. Sapos yu laik yusim rit bilong santu, klik na makim namba wan rit na Gutnius."
                : "Rit bilong de i stap pastaim. Sapos yu laik yusim rit bilong santu, klik long em."}
            </p>
            <div className="flex flex-wrap gap-2">
              {canWeekday ? (
                <button
                  type="button"
                  aria-pressed={!usingSaint}
                  onClick={() => prefs.setCommonPick(day.date, WEEKDAY_READINGS_ID)}
                  className={cn(
                    "min-h-11 max-w-full rounded-full px-3 py-2 text-left font-sans text-xs font-medium leading-snug",
                    !usingSaint ? sheetOn : sheetOff,
                  )}
                >
                  Rit bilong de
                </button>
              ) : null}
              {canSaintReadings ? (
                <button
                  type="button"
                  aria-pressed={usingSaint}
                  onClick={() => {
                    if (commonGroup) {
                      if (!menuOpen) prefs.setCommonPick(day.date, SAINT_MENU_ID);
                      return;
                    }
                    if (canProper) prefs.setCommonPick(day.date, PROPER_READINGS_ID);
                  }}
                  className={cn(
                    "min-h-11 max-w-full rounded-full px-3 py-2 text-left font-sans text-xs font-medium leading-snug",
                    usingSaint ? sheetOn : sheetOff,
                  )}
                >
                  Rit bilong Santu
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setPrayersOpen(true)}
              className={cn(
                "mt-2 min-h-11 w-full rounded-full px-3 py-2 text-center font-sans text-xs font-medium leading-snug",
                sheetOn,
              )}
            >
              Makim ol pre bilong Misa
            </button>
            {menuOpen && commonGroup ? (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <ReadingSelect
                label={`Namba wan rit — ${commonGroup.title.replace(/^Misa Komon bilong\s+/i, "")}`}
                value={parsed.readingId}
                placeholder="Makim rit…"
                options={[
                  { id: "", label: "Makim rit…" },
                  ...commonReadings.map((item) => ({
                    id: item.id,
                    label: `${item.n}. ${item.label}${item.season === "easter" ? " (Ista)" : ""}`,
                  })),
                ]}
                onChange={(nextR) => {
                  const nextG = parsed.gospelId;
                  prefs.setCommonPick(day.date, nextR || nextG ? encodeCommonPick(nextR, nextG) : SAINT_MENU_ID);
                }}
              />
              <ReadingSelect
                label="Gutnius"
                value={parsed.gospelId}
                placeholder="Makim Gutnius…"
                options={[
                  { id: "", label: "Makim Gutnius…" },
                  ...commonGospels.map((item) => ({ id: item.id, label: `${item.n}. ${item.label}` })),
                ]}
                onChange={(nextG) => {
                  const nextR = parsed.readingId;
                  prefs.setCommonPick(day.date, nextR || nextG ? encodeCommonPick(nextR, nextG) : SAINT_MENU_ID);
                }}
              />
            </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setPrayersOpen(true)}
              className={cn(
                "min-h-11 w-full rounded-full px-3 py-2 text-center font-sans text-xs font-medium leading-snug",
                sheetOn,
              )}
            >
              Makim ol pre bilong Misa
            </button>
          </div>
        )}
        {showSpecialCommon && specialId && specialCommon ? (
          <div className="mt-3">
            <p className="mb-1.5 font-sans text-xs leading-snug text-rubric">
              Yu ken kisim rit bilong de, o rit bilong dispela Misa Komon.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={specialUsingDay}
                onClick={() => prefs.setCommonPick(specialPickKey, WEEKDAY_READINGS_ID)}
                className={cn(
                  "min-h-11 rounded-full px-3 py-2 font-sans text-xs font-medium",
                  specialUsingDay ? sheetOn : sheetOff,
                )}
              >
                Rit bilong de
              </button>
              <button
                type="button"
                aria-pressed={!specialUsingDay}
                onClick={() =>
                  prefs.setCommonPick(specialPickKey, encodeCommonPick(specialReadingId, specialGospelId))
                }
                className={cn(
                  "min-h-11 rounded-full px-3 py-2 font-sans text-xs font-medium",
                  !specialUsingDay ? sheetOn : sheetOff,
                )}
              >
                Rit bilong Misa Komon
              </button>
            </div>
            {!specialUsingDay ? (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <ReadingSelect
                  label={`Namba wan rit — ${specialCommon.title.replace(/^Misa Komon bilong\s+/i, "")}`}
                  value={specialReadingId}
                  options={specialReadings.map((item) => ({
                    id: item.id,
                    label: `${item.n}. ${item.label}${item.season === "easter" ? " (Ista)" : ""}`,
                  }))}
                  onChange={(nextR) =>
                    prefs.setCommonPick(specialPickKey, encodeCommonPick(nextR, specialGospelId))
                  }
                />
                <ReadingSelect
                  label="Gutnius"
                  value={specialGospelId}
                  options={specialGospels.map((item) => ({ id: item.id, label: `${item.n}. ${item.label}` }))}
                  onChange={(nextG) =>
                    prefs.setCommonPick(specialPickKey, encodeCommonPick(specialReadingId, nextG))
                  }
                />
              </div>
            ) : null}
          </div>
        ) : null}
        {chooser && specialId ? (
          <div className="mt-3">
            <p className="mb-1.5 font-sans text-xs leading-snug text-rubric">
              {chooser.partial
                ? "Makim rit. Sampela tok i no stap long leksonari — ritim long Baibel."
                : "Makim namba wan rit, Sam na Gutnius bilong dispela misa."}
            </p>
            {chooser.banks.length > 1 ? (
              <div className="mb-2 flex flex-wrap gap-2">
                {chooser.banks.map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    aria-pressed={chooser.bankId === bank.id}
                    onClick={() => prefs.setRitualPick(specialId, { bank: bank.id })}
                    className={cn(
                      "min-h-11 rounded-full px-3 py-2 font-sans text-xs font-medium",
                      chooser.bankId === bank.id ? sheetOn : sheetOff,
                    )}
                  >
                    {bank.title}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["ot", "Namba wan rit", chooser.ot],
                  ["nt", "Namba tu rit", chooser.nt],
                  ["ps", "Sam", chooser.psalms],
                  ["al", "Welkamim Gutnius", chooser.alleluia],
                  ["g", "Gutnius", chooser.gospels],
                ] as const
              )
                .filter(([, , items]) => items.length > 0)
                .map(([key, label, items]) => (
                  <ReadingSelect
                    key={key}
                    label={label}
                    value={items.some((item) => item.id === ritualPick?.[key]) ? ritualPick?.[key] || "" : items[0]?.id || ""}
                    options={items}
                    onChange={(id) => prefs.setRitualPick(specialId, { [key]: id })}
                  />
                ))}
            </div>
          </div>
        ) : null}
      </div>

      <SpecialIndexDialog open={indexOpen} onOpenChange={setIndexOpen} onPick={onPickSpecial} />
      <SettingsDialog open={setOpen} onOpenChange={setSetOpen} />
      <PrayersDialog
        open={prayersOpen}
        onOpenChange={setPrayersOpen}
        day={day}
        prefaceList={prefaceList}
        formularies={commonFormularyChoices(day, specialId)}
        scope={sectionId === "s5" || day.properId.startsWith("sanctorale.11-02") ? "dead" : "season"}
      />
    </header>
  );
}
