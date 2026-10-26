import { BookMarked } from "lucide-react";
import { type ReactNode, useState } from "react";
import type { MassLine, MassSection } from "@/lib/ordo";
import { cn } from "@/lib/utils";
import { usePrefs } from "@/lib/prefs";

function paintInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /\{\{([\s\S]*?)\}\}|✠|(?<![A-Za-z])N\.(?:,1|1)?|[()]/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[0] === "✠") {
      nodes.push(
        <span key={`${keyBase}-${i}`} className="text-rubric">
          ✠
        </span>,
      );
    } else if (match[0].startsWith("N.")) {
      nodes.push(
        <span key={`${keyBase}-${i}`} className="text-rubric">
          N.
        </span>,
      );
    } else if (match[0] === "(" || match[0] === ")") {
      nodes.push(
        <span key={`${keyBase}-${i}`} className="text-rubric">
          {match[0]}
        </span>,
      );
    } else if (match[1] && match[0].startsWith("{{")) {
      const inner = match[1];
      const num = /^\d+[a-z]?\.$/.test(inner);
      nodes.push(
        <span key={`${keyBase}-${i}`} className={num ? "font-bold text-rubric" : "font-normal not-italic text-rubric"}>
          {inner}
        </span>,
      );
    }
    i += 1;
    last = match.index + match[0].length;
  }
  if (last === 0) return [text];
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function withRedCross(text: string) {
  return paintInline(text, "m");
}

function paintPassion(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(^|\n)([SJWO]):/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) nodes.push(...paintInline(text.slice(last, match.index), `${keyBase}-b${i}`));
    if (match[1]) nodes.push(match[1]);
    nodes.push(
      <span key={`${keyBase}-s${i}`} className="text-rubric">
        {match[2]}:
      </span>,
    );
    last = match.index + match[0].length;
    i += 1;
  }
  if (last === 0) return paintInline(text, keyBase);
  if (last < text.length) nodes.push(...paintInline(text.slice(last), `${keyBase}-e`));
  return nodes;
}

function isPassion(text: string): boolean {
  return /\(S = Stori|Stori bilong Pen na Indai/.test(text);
}

function rubricText(text: string): string {
  return text
    .replace(/(^|\n)\s*\d{1,3}\.\s+/g, "$1")
    .replace(/\s*\n\s*/g, " ")
    .replace(/N\.(?:,1|1)/g, "N.")
    .trim();
}

function rubricBody(text: string): ReactNode[] {
  const cleaned = rubricText(text);
  return cleaned.split(/(\[\[[\s\S]*?\]\])/g).map((part, i) =>
    part.startsWith("[[") ? (
      <span key={i} className="font-bold text-ink">
        {part.slice(2, -2)}
      </span>
    ) : (
      part
    ),
  );
}

function SenseText({ text, dropCap, className }: { text: string; dropCap: boolean; className?: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const first = lines[0] ?? "";
  const letter = dropCap ? first.slice(0, 1) : "";
  const firstRest = dropCap ? first.slice(1) : first;
  return (
    <div className={cn("pl-[1.2em] font-serif leading-relaxed", className)}>
      {letter ? (
        <span className="float-left pr-[0.1em] pt-[0.06em] font-serif text-[3.1em] font-semibold leading-[0.82] text-rubric">
          {letter}
        </span>
      ) : null}
      {lines.map((line, i) => (
        <span key={i} className="block min-h-[1lh]">
          {withRedCross(i === 0 ? firstRest : line)}
        </span>
      ))}
    </div>
  );
}

function isReadingIntro(text: string): boolean {
  if (!text) return false;
  const t = text.replace(/^✠\s*/, "");
  return /^(Rit i kam long|Stori bilong Pen na Indai|Harim )/.test(t);
}

function speakerCue(line: MassLine | undefined): string | null {
  if (!line || line.voice !== "rubric") return null;
  const t = line.text.trim();
  return /^(Pris|Ol|O):$/.test(t) ? t : null;
}

function isSpoken(line: MassLine | undefined): boolean {
  return !!line && (line.voice === "priest" || line.voice === "people" || line.voice === "together");
}

function LineView({ line, cue }: { line: MassLine; cue?: string }) {
  const { showRubrics } = usePrefs();
  if (line.note === "center-title") {
    return (
      <h3 className="my-6 text-center font-serif text-xl font-bold leading-snug text-rubric whitespace-pre-wrap">
        {line.text}
      </h3>
    );
  }
  if (line.voice === "rubric" && !showRubrics) return null;

  if (line.variant === "banner") {
    if (line.note === "left") {
      return <p className="my-4 text-left font-serif text-[1em] font-bold text-rubric">{line.text}</p>;
    }
    const small = line.note === "small";
    const hap = /^Hap Namba\b/i.test(line.label ?? "");
    const route = /^Namba /i.test(line.label ?? "");
    const roman = line.label?.match(/^([IVX]+\.)\s+([\s\S]+)$/);
    return (
      <div className={cn("text-center", hap ? "mb-4 mt-1" : "my-4")}>
        {roman ? (
          <p className="font-serif text-[1.05em] font-bold leading-snug">
            <span className="text-ink">{roman[1]}</span> <span className="text-rubric">{roman[2]}</span>
          </p>
        ) : line.label ? (
          <p
            className={cn(
              "font-serif font-bold text-rubric",
              hap && "text-2xl uppercase tracking-wide",
              route && "text-xl",
              !hap && !route && "text-base font-semibold",
            )}
          >
            {line.label}
          </p>
        ) : null}
        {line.text ? (
          <p className={cn("font-serif font-bold text-ink whitespace-pre-wrap", small ? "text-lg" : "mt-1 text-xl")}>{line.text}</p>
        ) : null}
        {line.note && !small ? <p className="mt-1 font-serif text-xl font-bold text-rubric">{rubricBody(line.note)}</p> : null}
      </div>
    );
  }

  if (line.note?.startsWith("row:")) {
    return (
      <div className="my-2 pl-[1.2em] font-serif leading-snug">
        <p>
          <span className="text-rubric">{line.label}:</span> <span className="font-bold text-ink">{line.text}</span>
        </p>
        <p>
          <span className="text-rubric">Ol:</span> <span className="text-ink">{line.note.slice(4)}</span>
        </p>
      </div>
    );
  }

  if (line.voice === "slot") {
    return (
      <div className="my-5 rounded-lg bg-paper-2 px-4 py-4 shadow-[var(--shadow-border)]">
        <div className="flex items-start gap-3">
          <BookMarked className="mt-0.5 size-4 shrink-0 text-rubric" strokeWidth={1.75} />
          <p className="font-serif leading-relaxed text-rubric">{line.text}</p>
        </div>
      </div>
    );
  }

  if (line.voice === "cite") {
    const intro = Boolean(line.note && isReadingIntro(line.note));
    const besideHeading =
      !line.note &&
      Boolean(line.text) &&
      (line.label === "Sam bilong bekim" ||
        line.label === "Antipon bilong Bigin" ||
        line.label === "Antipon bilong Komunio");
    const citeMark = line.text ? (
      <span className="font-serif text-[1em] font-normal normal-case tracking-normal text-rubric"> ({line.text})</span>
    ) : null;
    const preface = line.label === "Prefasio";
    const nameLine =
      line.text && !intro && !besideHeading ? (
        <p className="mt-1 font-sans text-[0.85em] font-semibold tracking-wide text-rubric">{line.text}</p>
      ) : null;
    const noteLine = line.note ? (
      isReadingIntro(line.note) ? (
        <p className="mt-2 pl-[1.2em] font-serif font-bold leading-relaxed text-ink">
          {withRedCross(line.note)}
          {citeMark}
        </p>
      ) : (
        <p className="mt-2 text-justify font-serif text-sm leading-snug text-rubric">{line.note}</p>
      )
    ) : null;
    return (
      <div className="mt-8 mb-4">
        {line.label ? (
          <p className="font-sans text-[0.85em] font-semibold uppercase tracking-widest text-rubric">
            {line.label}
            {besideHeading ? citeMark : null}
          </p>
        ) : null}
        {preface ? nameLine : noteLine}
        {preface ? noteLine : nameLine}
      </div>
    );
  }

  if (line.voice === "response") {
    return (
      <div className="my-4">
        {line.label ? (
          <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-rubric">
            {line.label}
          </p>
        ) : null}
        <div className="ml-[1.2em] rounded-md bg-paper-2/80 px-4 py-3 shadow-[var(--shadow-border)]">
          <p className="font-serif font-bold italic leading-relaxed whitespace-pre-wrap text-ink">{withRedCross(line.text)}</p>
        </div>
      </div>
    );
  }

  if (line.voice === "reading") {
    const blocks = line.text.split(/\n\n+/);
    const passion = isPassion(line.text);
    const paint = (block: string, i: number) => (passion ? paintPassion(block, `g${i}`) : withRedCross(block));
    return (
      <div className="my-3">
        {blocks.map((block, i) => (
          <p
            key={i}
            className={cn(
              "my-3 pl-[1.2em] font-serif leading-relaxed whitespace-pre-wrap",
              line.variant === "gospel" && i === 0 && "drop-cap",
              line.variant === "oration" && i === 0 && "drop-cap",
              line.variant === "psalm" && "pl-[1.2em]",
            )}
          >
            {paint(block, i)}
          </p>
        ))}
      </div>
    );
  }

  if (line.voice === "rubric") {
    if (line.note === "center-mark") {
      return <p className="my-4 text-center font-serif text-rubric">{line.text}</p>;
    }
    if (line.text.trim() === "Blesing bilong Marit") {
      return <h3 className="my-6 text-center font-serif text-xl font-semibold text-rubric">{line.text}</h3>;
    }
    return <p className="my-4 text-justify font-serif text-[0.85em] font-normal leading-snug text-rubric">{rubricBody(line.text)}</p>;
  }

  const isPeopleOnly = line.voice === "people";
  const isWithPriest = line.voice === "priest" || line.voice === "together";
  const isInstitution = line.voice === "priest" && line.text === line.text.toUpperCase() && line.text.length > 40;
  const sense = line.variant === "oration" || line.variant === "hymn";
  const bodyClass = cn(
    isInstitution && "tracking-wide",
    isWithPriest && "font-bold text-ink",
    isPeopleOnly && "font-normal text-ink",
  );
  return (
    <div className="my-3">
      {line.label ? (
        <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-rubric">{line.label}</p>
      ) : null}
      {sense ? (
        <SenseText text={line.text} dropCap={line.dropCap !== false} className={bodyClass} />
      ) : cue && showRubrics ? (
        /^(Lord|Krais), yu marimari\.$/.test(line.text.trim()) ? (
          <div className="grid grid-cols-[4.2em_1fr] items-baseline font-serif leading-relaxed">
            <span className="font-normal text-rubric">{cue}</span>
            <span className={cn("whitespace-pre-wrap", bodyClass)}>{withRedCross(line.text)}</span>
          </div>
        ) : (
          <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-[0.4em] font-serif leading-relaxed">
            <span className="font-normal text-rubric">{cue}</span>
            <span className={cn("whitespace-pre-wrap", bodyClass)}>{withRedCross(line.text)}</span>
          </div>
        )
      ) : (
        <p className={cn("pl-[1.2em] font-serif leading-relaxed whitespace-pre-wrap", bodyClass)}>{withRedCross(line.text)}</p>
      )}
    </div>
  );
}

const JUMPS: { id: string; label: string }[] = [
  { id: "bigin", label: "Bigin" },
  { id: "tok", label: "Ol Rit" },
  { id: "yukaris", label: "Yukaris" },
  { id: "komunio", label: "Komunio" },
];

export function MassReader({ sections }: { sections: MassSection[] }) {
  const { fontScale } = usePrefs();
  const [active, setActive] = useState<string | null>(null);
  const jumps = JUMPS.filter((jump) => sections.some((section) => section.id === jump.id));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {jumps.length > 1 ? (
        <nav
          aria-label="Go long hap bilong misa"
          className="sticky top-0 z-20 border-b border-[#e6dfd4] bg-[#f7f1e6]/95 backdrop-blur dark:border-white/10 dark:bg-[#141414]/95"
        >
          <div className="mx-auto flex w-full max-w-2xl justify-center px-2 py-2">
            {jumps.map((jump) => (
              <button
                key={jump.id}
                type="button"
                onClick={() => {
                  setActive(jump.id);
                  document.getElementById(`sec-${jump.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={cn(
                  "min-w-0 flex-1 px-1 py-1 text-center font-sans text-[13px] leading-none",
                  active === jump.id ? "text-[#1c1914] dark:text-white" : "text-[#c1272d]",
                )}
              >
                {jump.label}
              </button>
            ))}
          </div>
        </nav>
      ) : null}
      <article
        style={{ fontSize: `${fontScale * 1.125}rem` }}
        className="mx-auto w-full max-w-2xl flex-1 px-5 pb-28 pt-6"
      >
        {sections.some((s) => s.lines.some((l) => l.voice === "slot" && /Leksonari/.test(l.text))) ? (
          <aside className="mb-8 rounded-lg border border-rule bg-paper-2 px-4 py-3">
            <p className="font-sans text-sm leading-snug text-rubric">
              Sampela rit i no stap yet long Leksonari bilong Taim Bilong Atven, Lent na Ista. Ol pre i kam long Buk Misa.
            </p>
          </aside>
        ) : null}
        {sections.map((s) => (
          <section key={s.id} id={`sec-${s.id}`} className={cn("scroll-mt-16", s.title ? "pb-10" : "pb-2")}>
            {s.title ? (
              <h2 className="mb-5 text-center font-serif text-xl font-bold uppercase tracking-wide text-rubric">{s.title}</h2>
            ) : null}
            {s.lines.map((line, i) => {
              if (speakerCue(line) && isSpoken(s.lines[i + 1])) return null;
              const cue = speakerCue(s.lines[i - 1]);
              return <LineView key={`${s.id}-${i}`} line={line} cue={cue && isSpoken(line) ? cue : undefined} />;
            })}
          </section>
        ))}
      </article>
    </div>
  );
}
