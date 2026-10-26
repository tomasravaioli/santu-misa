import type { LiturgicalDay } from "./calendar";
import { celebratingSaint, isWeekdayReadingsPick, pickGospel, readingsForDay, yearLabelTpi, type ReadingsBundle, type Scripture } from "./lectionary";
import type { ResolvedRitual } from "./lectionary/ritual";
import { blessingFor, prefaceTextFor, propersFor, resolveIntercession, EP2_OWN_KEY, type Antiphon, type PrefaceChoice, type Proper } from "./propers";
import type { CreedForm, EucharisticPrayer, PenitentialForm } from "./prefs";
import { EP1_AFTER, EP2_AFTER, EP2_BEFORE, EP3_AFTER, EP4_AFTER, EP4_BEFORE, type EpBit } from "./ep-bits";
import { EXTRA_EPS, extraEpAllowed, isExtraEp } from "./ep-extra";
import {
  VIGIL_AFTER_LITANY,
  VIGIL_BAPTISM_WATER_ONLY,
  VIGIL_BAPTISM_WITH,
  VIGIL_BLESSING,
  VIGIL_BLESSING_CLOSE,
  VIGIL_ALLELUIA_PSALM,
  VIGIL_EXSULTET_ASK,
  VIGIL_EXSULTET_OPEN,
  VIGIL_EXSULTET_REST,
  VIGIL_FIRE,
  VIGIL_FONT,
  VIGIL_FONT_CANDLE_A,
  VIGIL_FONT_CANDLE_B,
  VIGIL_LITANY_SAINTS,
  VIGIL_OT_ORATIONS,
  VIGIL_RENEWAL_CLOSE,
  VIGIL_RENEWAL_INTRO,
  VIGIL_SPRINKLE,
  VIGIL_WATER,
  VIGIL_WATER_INTRO,
  VIGIL_WELCOME,
  VIGIL_WORD_INTRO,
} from "./vigil-texts";
import { palmPassionAfter, palmPassionBefore, palmProcession } from "./palm-sunday";
import { eucharistTransfer, footWashing } from "./holy-thursday";
import { goodFridayAfterGospel, goodFridayCommunion, goodFridayCross, goodFridayOpening, goodFridayWordIntro } from "./good-friday";

export type Voice = "rubric" | "priest" | "people" | "together" | "slot" | "cite" | "reading" | "response";

export type MassLine = {
  voice: Voice;
  text: string;
  latin?: string;
  label?: string;
  note?: string;
  variant?: "gospel" | "psalm" | "oration" | "hymn" | "banner";
  dropCap?: boolean;
};

export type MassSection = {
  id: string;
  title: string;
  lines: MassLine[];
};

export type MassOptions = {
  penitential: PenitentialForm;
  creed: CreedForm;
  ep: EucharisticPrayer;
  prefaceKey?: string | null;
  commonId?: string | null;
  /** A ritual, votive, common or Mass for the dead chosen from the index. */
  ritual?: boolean;
  /** Readings from a ritual or funeral lectionary. Wins over the placeholder slots. */
  ritualReadings?: ResolvedRitual | null;
  /** Prefaces of a mass chosen from the index. Wins over the day's preface. */
  prefaceChoices?: PrefaceChoice[] | null;
  /** Readings assembled for a Common of Saints, instead of the day's lectionary. */
  readingsOverride?: ReadingsBundle | null;
  intercessionKey?: string | null;
  intercessionScope?: "season" | "dead";
  /** Marriage blessing inserted after the Our Father. */
  nuptialBlessing?: { voice: "rubric" | "priest" | "people"; text: string }[];
  /** This mass has the Gloria even when the day does not. */
  forceGloria?: boolean;
  /** A common formulary chosen in place of the first one. */
  formulary?: Proper | null;
};

const L = (text: string): MassLine => ({ voice: "rubric", text });
const P = (text: string, latin?: string): MassLine => ({ voice: "priest", text, latin });
const O = (text: string, latin?: string): MassLine => ({ voice: "people", text, latin });
const Ol = (text: string): MassLine[] => [L("Ol:"), O(text)];
const T = (text: string, latin?: string, label: string | null = "Ol"): MassLine => ({
  voice: "together",
  text,
  latin,
  ...(label ? { label } : {}),
});
const HYMN = (text: string, latin?: string): MassLine => ({ ...T(text, latin), variant: "hymn" });
const S = (text: string): MassLine => ({ voice: "slot", text });
const CITE = (label: string, citation: string, note?: string): MassLine => ({
  voice: "cite",
  text: citation,
  label,
  note,
});
const RD = (text: string, variant?: "gospel" | "psalm"): MassLine => ({ voice: "reading", text, variant });
const RESP = (text: string): MassLine => ({ voice: "response", text, label: "Bekim" });
const OR = (text: string): MassLine => ({ voice: "priest", text, variant: "oration" });

function scriptureBlock(label: string, s: Scripture, variant?: "gospel" | "psalm"): MassLine[] {
  return [CITE(label, s.citation, s.source), RD(s.text, variant)];
}

function antiphonProse(text: string): string {
  return text.replace(/[ \t]*\n[ \t]*/g, " ").replace(/ {2,}/g, " ").trim();
}

function altRubric(cite?: string): string {
  if (!cite) return "O:";
  const cue = cite.trim();
  if (/^O[,:]/.test(cue)) return cue;
  return `O: ${cue}`;
}

function antiphonLines(label: string, ant: Antiphon | undefined): MassLine[] {
  if (!ant?.text) return [];
  const lines: MassLine[] = [CITE(label, ant.cite ?? ""), P(antiphonProse(ant.text))];
  if (ant.alt?.text) {
    lines.push(L(altRubric(ant.alt.cite)), P(antiphonProse(ant.alt.text)));
  }
  return lines;
}

function orationOrSlot(text: string | undefined, slot: string): MassLine[] {
  if (text) return [OR(text)];
  return [S(slot)];
}

function greeting(): MassLine[] {
  return [
    L("Taim singsing bilong bigin i pinis, orait Pris na ol manmeri i sanap yet, na ol i\nmekim Mak bilong Kruse, taim Pris i lukluk long ol manmeri na i tok:"),
    P("Long nem bilong Papa, na bilong Pikinini, na bilong Holi Spirit."),
    ...Ol("Amen."),
    L("2. Pris i opim na litimapim han, na em i tok:"),
    P("Grasia bilong Bikpela bilong yumi Jisas Krais,\nna laikim pasin bilong God,\nna komunio bilong Holi Spirit i ken i stap wantaim yupela."),
    L("O:"),
    P("Grasia na bel isi bilong God, em i Papa bilong yumi,\nna bilong Bikpela bilong yumi Jisas Krais,\ni ken i stap wantaim yupela."),
    L("O:"),
    P("Lord i stap wantaim yupela."),
    ...Ol("Na wantaim spirit bilong yu."),
    L("Sapos Bisop i mekim Misa, em i no ken tok Lord i stap wantaim yupela. Nogat. Em i mas tok:"),
    P("Gutpela taim i stap wantaim yupela."),
    L("3. Pris, o Diken, o narapela minista, i ken givim sotpela toksave long ol\nbilipmanmeri long as tingting bilong Misa bilong dispela de."),
  ];
}

function kyrie(): MassLine[] {
  return [
    L("Nau ol i pre Lord, yu marimari. Tasol sapos pastaim Pris i bin yusim dispela pre long Lotu Sori, orait nau em i mas lusim."),
    L("Pris:"),
    P("Lord, yu marimari."),
    ...Ol("Lord, yu marimari."),
    L("Pris:"),
    P("Krais, yu marimari."),
    ...Ol("Krais, yu marimari."),
    L("Pris:"),
    P("Lord, yu marimari."),
    ...Ol("Lord, yu marimari."),
  ];
}

function penitential(form: PenitentialForm): MassLine[] {
  const open: MassLine[] = [
    L("Lotu sori i kamap nau. Pris i tokim ol bilipmanmeri olsem:"),
    P("Ol bratasusa, nau yumi autim sori long ol sin bilong yumi,\nbai yumi ken redi gut long selebretim dispela Santu Misa."),
    L("Ol i sarap liklik taim."),
  ];
  const abs: MassLine[] = [
    L("Nau Pris i pre bai God i ken lusim ol sin:"),
    P("God i strong olgeta i ken marimari long yumi,\nna i ken tekewe ol sin bilong yumi,\nna i ken bringim yumi long laip bilong oltaim."),
    ...Ol("Amen."),
  ];
  if (form === 1) {
    return [
      ...open,
      L("Bihain olgeta manmeri i pre wantaim dispela pre bilong tok sori:"),
      T("Mi tokaut long God i strong olgeta,\nna long yupela, ol bratasusa.\nMi bin mekim planti sin tumas,\nlong tingting, long toktok, long pasin nogut mi bin mekim,\nna long ol gutpela wok mi bin les long mekim.", undefined, null),
      L("Ol i paitim bros bilong ol, na ol i tok:"),
      T("Tru, i rong bilong mi, i rong bilong mi, i bikpela rong bilong mi.", undefined, null),
      T("Olsem na mi askim Santu Maria, em i Virgo oltaim,\nolgeta Ensel na Santu, na yupela ol bratasusa,\nyupela i pre bai God, em i Bikpela bilong yumi,\ni ken marimari long mi.", undefined, null),
      ...abs,
      ...kyrie(),
    ];
  }
  if (form === 2) {
    return [
      ...open,
      L("Bihain Pris i tok:"),
      P("Lord, marimari long mipela."),
      L("Ol manmeri i bekim:"),
      O("Long wanem, mipela i bin mekim sin long yu."),
      L("Pris:"),
      P("Lord, soim marimari bilong yu long mipela."),
      L("Ol manmeri i bekim:"),
      O("Na kisim bek mipela."),
      ...abs,
      ...kyrie(),
    ];
  }
  return [
    ...open,
    L("Bihain Pris, o Diken o narapela minista i helpim Pris long lotu i kolim ol pre i gat Lord, yu marimari (Kyrie, eleison)."),
    L("Pris:"),
    P("Yu bin kam bilong oraitim ol manmeri i sori long ol sin bilong ol.\nLord, yu marimari."),
    ...Ol("Lord, yu marimari."),
    L("Pris:"),
    P("Yu bin kam bilong singautim bek ol manmeri bilong sin. Krais, yu marimari."),
    ...Ol("Krais, yu marimari."),
    L("Pris:"),
    P("Yu sindaun long raithan bilong Papa, na yu pre bilong helpim mipela.\nLord, yu marimari."),
    ...Ol("Lord, yu marimari."),
    ...abs,
  ];
}

const GLORIA: MassLine[] = [
  L("8. Taim Misa bilong dispela de i tok olsem, ol i sing o pre Ona long God i stap\nantap:"),
  HYMN(
    "Ona long God i stap antap,\nna long graun gutpela taim long ol manmeri,\nGod i laikim ol tumas.\n\nMipela i tok amamas long yu,\nmipela i litimapim nem bilong yu,\nmipela i adorim yu,\nmipela i givim glori long yu,\nmipela i tenkim yu long bikpela glori bilong yu,\nLord God, yu King bilong heven, yu Papa i strong olgeta.\n\nLord Jisas Krais, yu wanpela tasol i Pikinini bilong God.\nLord God, yu Lem bilong God, yu Pikinini bilong God Papa,\nYu tekewe olgeta sin, marimari long mipela.\nYu tekewe olgeta sin, harim pre bilong mipela.\nYu sindaun long raithan bilong God Papa, marimari long mipela.\n\nLong wanem, yu tasol yu Holi.\nYu tasol yu Lord. Yu tasol yu antap tru, Jisas Krais.\nNa wantaim Holi Spirit,\nyu stap long glori bilong God Papa.\nAmen.",
    "O: Gloria in excelsis Deo\net in terra pax hominibus bonae voluntatis.\nLaudamus te.\nBenedicimus te.\nAdoramus te.\nGlorificamus te.\nGratias agimus tibi propter magnam gloriam tuam.\nDomine Deus, Rex caelestis, Deus Pater omnipotens.\nDomine Fili unigenite, Iesu Christe.\nDomine Deus, Agnus Dei, Filius Patris.\nQui tollis peccata mundi, miserere nobis.\nQui tollis peccata mundi, suscipe deprecationem nostram.\nQui sedes ad dexteram Patris, miserere nobis.\nQuoniam tu solus Sanctus.\nTu solus Dominus.\nTu solus altissimus, Iesu Christe.\nCum Sancto Spiritu, in gloria Dei Patris.\nAmen.",
  ),
];

const NICENE: MassLine[] = [
  L("18. Taim skul i pinis, orait ol i mas autim o singim Tok Bilip, sapos Buk Misa i\ntok olsem."),
  HYMN(
    "Mi bilip long wanpela God tasol,\nem i Papa i strong olgeta.\nEm i mekim kamap heven na graun,\nna olgeta samting mipela i save lukim,\nna olgeta samting mipela i no save lukim.\n\nMi bilip long wanpela Lord tasol, em i Jisas Krais,\nem wanpela tasol i Pikinini bilong God.\nLong bipo tru, taim olgeta samting i no bin kamap yet,\nem i stap pinis wantaim Papa.\nEm i God, i kamap long God.\nEm i lait, i kamap long lait.\nEm i God tru, i kamap long God tru.\nEm i kisim laip long God Papa,\nna i no gat wanpela i bin kamapim em.\nEm i wankain tru olsem Papa.\nLong em olgeta samting i bin kamap.\nEm i laik kisim bek yumi, olsem na em i kam daun long heven.",
  ),
  L("Nau na inap long tok na em i kamap man, olgeta i daunim het."),
  { ...HYMN(
    "Long strong bilong Holi Spirit, Maria Virgo i kisim bel,\nna em i kamap man.\nLong taim bilong Pontius Pailat ol i nilim em long Diwai Kros\nna em i karim pen bilong kisim bek yumi.\nEm i dai, na ol i planim em.\nLong de namba 3 em i kirap bek, olsem Baibel i tok.\nEm i go bek long heven,\nna em i sindaun long raithan bilong Papa.\nBihain bai em i kam bek gen wantaim bikpela glori,\nbilong mekim kot long ol i stap yet, na long ol i dai pinis.\nNa kingdom bilong em bai i no inap pinis.\n\nMi bilip long Holi Spirit,\nem i Lord, na em i save givim laip.\nEm i kamap long Papa wantaim Pikinini.\nNa yumi mas adorim na onarim em wankain olsem\nyumi save adorim na onarim Papa na Pikinini.\nEm i bin autim tok long maus bilong ol profet.\n\nMi bilip long Sios, em i wanpela, em i holi, em i katolik,\nna em i kam long ol Aposel.\nMi tokaut long wanpela Baptais tasol bilong pogivim ol sin.\nMi wet long kirap bek bilong ol manmeri i dai pinis,\nna long laip bai i kamap bihain. Amen.",
  ), dropCap: false },
];

const APOSTLES: MassLine[] = [
  L("Tok Bilip bilong ol Aposel. Em i gutpela long yusim long taim bilong Lent na Ista."),
  HYMN(
    "Mi bilip long God Papa i strong olgeta,\nem i mekim kamap heven na graun.\n\nMi bilip long Jisas Krais,\nem wanpela tasol i Pikinini bilong God,\nem i Bikpela bilong yumi.",
  ),
  L("Nau na inap long tok na i karim em, olgeta i daunim het."),
  { ...HYMN(
    "Long strong bilong Holi Spirit,\nMaria Virgo i kisim bel, na i karim em.\nLong taim bilong Pontius Pailat em i karim pen.\nOl i nilim em long Diwai Kros.\nEm i dai na ol i planim em.\nEm i go long ples bilong ol i dai pinis.\nLong de namba 3 em i kirap bek long ol i dai pinis.\nEm i go bek long heven.\nEm i sindaun long raithan bilong God Papa i strong olgeta.\nBihain bai em i kam bek gen\nbilong mekim kot long ol i stap yet,\nna long ol i dai pinis.\n\nMi bilip long Holi Spirit,\nlong Sios, em i holi na i katolik,\nlong ol Santu i wanfamili tasol,\nlong God i pogivim sin,\ni kirapim bodi,\nna i givim laip bilong oltaim.\nAmen.",
  ), dropCap: false },
];

const SANCTUS: MassLine = {
  voice: "people",
  label: "Ol",
  dropCap: false,
  text: "Holi, Holi, Holi Lord God, yu strong olgeta.\nHeven na graun i pulap long glori bilong yu.\nHosana long God i stap antap.\nLitimapim nem bilong em i kam long nem bilong Lord.\nHosana long God i stap antap.",
  latin:
    "O: Sanctus, Sanctus, Sanctus Dominus Deus Sabaoth.\nPleni sunt caeli et terra gloria tua.\nHosanna in excelsis.\nBenedictus qui venit in nomine Domini.\nHosanna in excelsis.",
};

function fromBits(bits: EpBit[], dropFirstPriest = false): MassLine[] {
  const out: MassLine[] = [];
  let capped = !dropFirstPriest;
  for (const bit of bits) {
    if (bit.v === "L") out.push(L(bit.t));
    else if (bit.v === "O") out.push(...Ol(bit.t));
    else if (!capped) {
      out.push(OR(bit.t));
      capped = true;
    } else out.push(P(bit.t));
  }
  return out;
}

function ep2OwnPreface(): MassLine[] {
  const out: MassLine[] = [];
  const prose: string[] = [];
  for (const bit of EP2_BEFORE) {
    if (bit.v === "L") out.push(L(bit.t));
    else if (bit.v === "P") prose.push(bit.t);
  }
  if (prose.length) out.push(OR(prose.join("\n\n")));
  return out;
}

function ep2Body(): MassLine[] {
  return [SANCTUS, ...fromBits(EP2_AFTER)];
}

function ep3(): MassLine[] {
  return [SANCTUS, ...fromBits(EP3_AFTER)];
}

function ep1(): MassLine[] {
  return [SANCTUS, ...fromBits(EP1_AFTER)];
}

function ep4(): MassLine[] {
  return [...fromBits(EP4_BEFORE, true), SANCTUS, ...fromBits(EP4_AFTER)];
}

function eucharistic(
  ep: EucharisticPrayer,
  day: LiturgicalDay,
  proper: Proper | null,
  prefaceKey?: string | null,
  choices?: PrefaceChoice[] | null,
): MassLine[] {
  const dialogue: MassLine[] = [
    L("31. Nau Pris i statim Bikpela Pre Tenkyu.\nEm i opim han, na i tok:"),
    L("Pris:"),
    P("Lord i stap wantaim yupela."),
    ...Ol("Na wantaim spirit bilong yu."),
    L("Pris:"),
    P("Litimapim hat bilong yupela."),
    ...Ol("Mipela i litimapim long Lord."),
    L("Pris:"),
    P("Yumi tenkim God, em i Lord bilong yumi."),
    ...Ol("Em i gutpela na i stret."),
  ];

  if (isExtraEp(ep) && extraEpAllowed(day) && !choices?.length) {
    const block = EXTRA_EPS[ep];
    return [
      ...dialogue,
      L("Nau Pris i pre o singim prefasio bilong dispela Pre Tenkyu. Dispela Prefasio i pas wantaim. Pris i no ken senisim."),
      ...fromBits(block.preface, true),
      SANCTUS,
      ...fromBits(block.after),
    ];
  }

  const epNum = isExtraEp(ep) ? 2 : ep;

  if (epNum === 4) {
    return [...dialogue, ...ep4()];
  }

  if (epNum === 2 && prefaceKey === EP2_OWN_KEY && !choices?.length) {
    return [...dialogue, ...ep2OwnPreface(), ...ep2Body()];
  }

  const picked = choices?.length
    ? (choices.find((choice) => choice.key === prefaceKey) ?? choices[0])
    : null;
  const pref = picked
    ? { ref: picked.key, text: picked.text, title: picked.title, subtitle: picked.subtitle }
    : prefaceTextFor(proper, day, prefaceKey);
  const properPreface: MassLine[] = pref.text
    ? [
        L("Nau Pris i pre o singim prefasio bilong Misa bilong dispela de."),
        CITE("Prefasio", pref.title ?? pref.ref ?? "", pref.subtitle),
        OR(pref.text),
      ]
    : pref.ref
      ? [L(`Nau Pris i pre o singim prefasio. ${pref.ref}`)]
      : [];

  if (epNum === 2) {
    const preface = properPreface.length ? properPreface : ep2OwnPreface();
    return [...dialogue, ...preface, ...ep2Body()];
  }

  const prefaceSlot: MassLine[] = properPreface.length
    ? properPreface
    : [L("Nau Pris i pre o singim prefasio."), S("Prefasio bilong Misa bilong dispela de — bai i kam long Buk Misa.")];
  const body = epNum === 1 ? ep1() : ep3();
  return [...dialogue, ...prefaceSlot, ...body];
}

function psalmBlock(psalm: { citation: string; response: string; stanzas: string[] }): MassLine[] {
  return [
    CITE("Sam bilong bekim", psalm.citation),
    RESP(psalm.response),
    ...psalm.stanzas.flatMap((stanza) => [RD(stanza, "psalm"), L("Bekim")]),
  ];
}

function ritualWord(day: LiturgicalDay, lit: ResolvedRitual, opts: MassOptions): MassLine[] {
  const out: MassLine[] = [];
  if (lit.note) out.push(L(lit.note));
  out.push(
    L(
      "Nau man o meri bilong ritim Tok bilong God i go long ples bilong rit, na em i ritim namba wan rit. Olgeta manmeri i sindaun na harim tok bilong God.",
    ),
  );
  const one = (label: string, reading: Scripture | null, slot: string) => {
    if (reading?.text) out.push(...scriptureBlock(label, reading));
    else out.push(S(slot));
    out.push(P("Dispela em i Tok bilong God."), ...Ol("Yumi tenkim God."));
  };
  one("Namba wan rit", lit.ot, "Namba wan rit — bai i kam long Leksonari.");
  out.push(L("Man o meri bilong lidim singsing i pre o singim Sam na olgeta manmeri i bekim."));
  if (lit.psalm && (lit.psalm.response || lit.psalm.stanzas.length)) out.push(...psalmBlock(lit.psalm));
  else out.push(S("Sam — bai i kam long Leksonari."));
  if (lit.nt) one("Namba tu rit", lit.nt, "Namba tu rit — bai i kam long Leksonari.");
  out.push(
    L(
      day.alleluia
        ? "Nau olgeta i singim o pre Aleluya."
        : "Long Taim Bilong Lent, ol i no singim Aleluya. Ol i singim narapela singsing Buk Misa i tok.",
    ),
  );
  if (lit.alleluia) {
    out.push(
      CITE("Welkamim Gutnius", lit.alleluiaCitation || ""),
      ...(day.alleluia
        ? [T("Aleluya, Aleluya.", undefined, null), RD(lit.alleluia, "psalm"), T("Aleluya.", undefined, null)]
        : [
            T("Glori na biknem long yu, Bikpela Jisas Krais.", undefined, null),
            RD(lit.alleluia, "psalm"),
            T("Glori na biknem long yu, Bikpela Jisas Krais.", undefined, null),
          ]),
    );
  }
  out.push(L("Diken o Pris yet i go long ples bilong ritim Gutnius, na em i tok:"));
  out.push(P("Lord i stap wantaim yupela."), ...Ol("Na wantaim spirit bilong yu."));
  if (lit.gospel?.text) {
    out.push(
      P(`${lit.gospel.source}.`),
      ...Ol("Ona long yu, Lord."),
      CITE("Gutnius", lit.gospel.citation, lit.gospel.source),
      RD(lit.gospel.text, "gospel"),
    );
  } else {
    out.push(
      P("Rit i kam long holi Gutnius, Santu N. i raitim."),
      ...Ol("Ona long yu, Lord."),
      S("Gutnius — bai i kam long Leksonari."),
    );
  }
  out.push(P("Dispela em i Gutnius bilong Bikpela."), ...Ol("Ona long yu, Bikpela Jisas Krais."));
  out.push(L("Nau Pris o Diken i givim skul."));
  out.push(L("Nau ol i mekim ol Pre bilong ol Bilipmanmeri."));
  out.push(...intercessionLines(day, opts));
  return out;
}

function liturgyOfTheWord(day: LiturgicalDay, opts: MassOptions): MassLine[] {
  if (opts.ritualReadings) return ritualWord(day, opts.ritualReadings, opts);
  if (opts.ritual && !opts.readingsOverride) {
    return [
      L("Rit bilong dispela Misa i kam long Leksonari."),
      S("Namba wan rit — bai i kam long Leksonari."),
      P("Dispela em i Tok bilong God."),
      ...Ol("Yumi tenkim God."),
      L("Man o meri bilong lidim singsing i pre o singim Sam na olgeta manmeri i bekim."),
      S("Sam — bai i kam long Leksonari."),
      S(day.alleluia ? "Aleluya — bai i kam long Leksonari." : "Singsing bipo long Gutnius — bai i kam long Leksonari."),
      L("Diken o Pris yet i go long ples bilong ritim Gutnius, na em i tok:"),
      P("Lord i stap wantaim yupela."),
      ...Ol("Na wantaim spirit bilong yu."),
      P("Rit i kam long holi Gutnius, Santu N. i raitim."),
      ...Ol("Ona long yu, Lord."),
      S("Gutnius — bai i kam long Leksonari."),
      P("Dispela em i Gutnius bilong Bikpela."),
      ...Ol("Ona long yu, Bikpela Jisas Krais."),
      L("Nau Pris o Diken i givim skul."),
      L("Nau ol i mekim ol Pre bilong ol Bilipmanmeri."),
      ...intercessionLines(day, opts),
    ];
  }
  const bundle = opts.readingsOverride ?? readingsForDay(day, opts.commonId);
  const notes: MassLine[] = [];
  if (bundle?.ferialOnFeast) {
    notes.push(
      L(
        `Tude em pestode. Hia em rit bilong de — wik ${bundle.readings.week} long Taim Bilong Yia, ${yearLabelTpi(bundle.readings.year)}.`,
      ),
    );
  }
  if (bundle?.commonLabel) {
    notes.push(L(`Rit i kam long ${bundle.commonLabel}.`));
  }
  if (isWeekdayReadingsPick(opts.commonId) && celebratingSaint(day)) {
    notes.push(L("Rit i kam long de (wikde). Pris i ken yusim rit bilong dispela santu tu."));
  }

  const ot: MassLine[] = [];
  if (bundle?.readings.vigil?.length) {
    const units = [
      { reading: bundle.readings.reading, psalm: bundle.readings.psalm },
      ...bundle.readings.vigil,
    ];
    units.forEach((item, i) => {
      ot.push(...scriptureBlock(`Rit namba ${i + 1}`, item.reading));
      ot.push(P("Dispela em i Tok bilong God."), ...Ol("Yumi tenkim God."));
      ot.push(L("11. Man o meri bilong lidim singsing i pre o singim Sam na olgeta manmeri i\nbekim."));
      ot.push(...psalmBlock(item.psalm));
    });
  } else if (bundle) {
    ot.push(...scriptureBlock("Namba wan rit", bundle.readings.reading));
    ot.push(P("Dispela em i Tok bilong God."), ...Ol("Yumi tenkim God."));
    ot.push(L("11. Man o meri bilong lidim singsing i pre o singim Sam na olgeta manmeri i\nbekim."));
    ot.push(...psalmBlock(bundle.readings.psalm));
  } else {
    ot.push(S("Namba wan rit — bai i kam long Leksonari."));
    ot.push(P("Dispela em i Tok bilong God."), ...Ol("Yumi tenkim God."));
    ot.push(L("11. Man o meri bilong lidim singsing i pre o singim Sam na olgeta manmeri i\nbekim."));
    ot.push(S("Sam — bai i kam long Leksonari."));
  }

  const second: MassLine[] = bundle?.readings.reading2
    ? [
        ...scriptureBlock("Namba tu rit", bundle.readings.reading2),
        P("Dispela em i Tok bilong God."),
        ...Ol("Yumi tenkim God."),
      ]
    : !bundle && (day.isSunday || day.rank === "solemnity")
      ? [
          L("Sapos i gat namba 2 rit, rida i ritim wankain olsem long namba wan rit."),
          S("Namba tu rit — bai i kam long Leksonari."),
          P("Dispela em i Tok bilong God."),
          ...Ol("Yumi tenkim God."),
        ]
      : [];

  const acclamation: MassLine[] = bundle
    ? [
        CITE("Welkamim Gutnius", ""),
        ...(day.alleluia
          ? [T("Aleluya, Aleluya.", undefined, null), RD(bundle.readings.alleluia, "psalm"), T("Aleluya.", undefined, null)]
          : [
              T("Glori na biknem long yu, Bikpela Jisas Krais.", undefined, null),
              RD(bundle.readings.alleluia, "psalm"),
              T("Glori na biknem long yu, Bikpela Jisas Krais.", undefined, null),
            ]),
      ]
    : [
        S(
          day.alleluia
            ? "Aleluya — bai i kam long Leksonari."
            : "Singsing bipo long Gutnius — bai i kam long Leksonari.",
        ),
      ];

  const gospel: MassLine[] = bundle
    ? (() => {
        const g = pickGospel(bundle.readings, day.sundayCycle);
        return [
          CITE("Gutnius", g.citation, g.source),
          RD(g.text, "gospel"),
        ];
      })()
    : [
        P("Rit i kam long holi Gutnius, Santu N. i raitim."),
        ...Ol("Ona long yu, Lord."),
        S("Gutnius — bai i kam long Leksonari."),
      ];

  const palm = day.properId === "temporale.palm";
  const passion = palm || day.properId === "temporale.good-friday";
  return [
    L(
      "10. Nau man o meri bilong ritim Tok bilong God i go long ples bilong rit, na em\ni ritim namba wan rit. Olgeta manmeri i sindaun na harim tok bilong God. Taim",
    ),
    ...notes,
    ...ot,
    ...second,
    L(
      day.alleluia
        ? "Nau olgeta i singim o pre Aleluya."
        : "Long Taim Bilong Lent, ol i no singim Aleluya. Ol i singim narapela singsing Buk Misa i tok.",
    ),
    ...acclamation,
    ...(passion
      ? palm
        ? palmPassionBefore()
        : []
      : [
          L("Diken o Pris yet i go long ples bilong ritim Gutnius, na em i tok:"),
          P("Lord i stap wantaim yupela."),
          ...Ol("Na wantaim spirit bilong yu."),
        ]),
    ...gospel,
    P("Dispela em i Gutnius bilong Bikpela."),
    ...Ol("Ona long yu, Bikpela Jisas Krais."),
    ...(palm ? palmPassionAfter() : []),
    ...(day.properId === "temporale.good-friday"
      ? []
      : [
          L("17. Nau Pris o Diken i givim skul. Em i mas givim skul long olgeta Sande na\npestode. Na em i gutpela long em i ken givim skul long ol arapela de tu."),
          ...(day.properId === "temporale.holy-thursday" ? footWashing() : []),
          ...(day.creed ? (opts.creed === "apostles" ? APOSTLES : NICENE) : []),
          L("Nau ol i mekim ol Pre bilong ol Bilipmanmeri."),
          ...intercessionLines(day, opts),
        ]),
  ];
}

function intercessionResponse(response: string): MassLine[] {
  if (response === "Krais, harim pre bilong mipela.") {
    return [
      L("Ol:"),
      O("Krais, harim pre bilong mipela."),
      L("O:"),
      O("Krais, marimari long mipela, na harim ol pre bilong mipela."),
    ];
  }
  if (response === "Lord, yu marimari.") {
    return [L("Ol:"), O("Lord, yu marimari. {{O:}} Harim pre bilong mipela.")];
  }
  return [...Ol(response)];
}

function intercessionClose(text: string): string {
  return text
    .replace(/\s*(Mipela i pre long nem bilong Krais, em i Bikpela bilong mipela\.)\s*$/, "\n\n$1")
    .replace(/\s*(Em i stap laip na em i King, nau na oltaim\.)\s*$/, "\n$1");
}

function intercessionLines(day: LiturgicalDay, opts: MassOptions): MassLine[] {
  const set = resolveIntercession(day, opts.intercessionScope ?? "season", opts.intercessionKey);
  if (!set) {
    return [CITE("Pre bilong ol bilipmanmeri", ""), S("Pre bilong ol Bilipmanmeri — bai i kam long Buk Misa.")];
  }
  const intentions: MassLine[] = [L("Ol pre")];
  set.intentions.forEach((intent, i) => {
    const labeled = intent.match(/^(\d+[a-z]?)\.\s+([\s\S]+)$/);
    const text = labeled
      ? `{{${labeled[1]}.}} ${labeled[2]}`
      : intent.startsWith("(")
        ? intent.replace(/^\(([^)]+)\)/, "{{($1)}}")
        : `{{${i + 1}.}} ${intent}`;
    intentions.push(RD(text));
    if (i === 0) intentions.push(...intercessionResponse(set.response));
  });
  return [
    CITE("Pre bilong ol bilipmanmeri", ""),
    L("Pris i go pas"),
    P(set.intro),
    ...intentions,
    L("Pre bilong Pris"),
    OR(intercessionClose(set.conclusion)),
    ...Ol("Amen."),
  ];
}


function eucharisticLiturgy(day: LiturgicalDay, proper: Proper | null, opts: MassOptions): MassLine[] {
  return [
    L("Ol pipel i ken kirapim song bilong redim ofa. Ol minista i stretim alta."),
    L("Pris i kisim plet i gat bret wantaim tupela han, em i apim plet liklik, na i tok isi:"),
    P("Ona i go long yu, God bilong heven na graun.\nYu save givim olkain gutpela samting long mipela.\nYu bin givim dispela bret long mipela,\nna nau mipela i laik ofarim em i go bek long yu.\nEm i kamap long graun na long wok bilong ol manmeri.\nBai em i kamap bret bilong givim laip long mipela."),
    L("Nau em i putim plet wantaim bret antap long korporal. Sapos i no gat singsing bilong ofa, orait Pris i ken autim strong dispela pre, bai olgeta manmeri i ken harim. Taim pre i pinis, orait ol i tok:"),
    O("Ona long yu, God. Ona long yu oltaim."),
    L("Diken, o Pris yet, i kapsaitim wain wantaim liklik wara tu long kap, na em i tok isi:"),
    P("Dispela misteri bilong wara na wain i bung wantaim\nem i mak bilong yumi i bung wantaim Krais.\nEm yet em i God, na em i bin kamap man wankain olsem yumi.\nNau em i ken helpim yumi long kisim laip bilong God."),
    L("Pris i kisim kap wantaim tupela han bilong em, em i apim liklik long alta, na i tok isi:"),
    P("Ona i go long yu, God bilong heven na graun.\nYu save givim olkain gutpela samting long mipela.\nYu bin givim dispela wain long mipela,\nna nau mipela i laik ofarim em i go bek long yu.\nEm i kamap long rop wain na long wok bilong ol manmeri.\nBai em i kamap dring bilong givim laip long mipela."),
    L("Nau Pris i putim kap antap long korporal. Sapos i no gat singsing bilong ofa, orait Pris i ken autim strong dispela pre, bai olgeta manmeri i ken harim. Taim pre i pinis, orait ol i tok:"),
    O("Ona long yu, God. Ona long yu oltaim."),
    L("Nau Pris i daunim het tru, na em i tok isi:"),
    P("Lord, mipela i daunim mipela yet,\nna mipela i sori long ol sin bilong mipela.\nMipela i pre, bai dispela sakrifais bilong mipela\ni ken kamap stret long ai bilong yu, Lord God."),
    L("Nau Pris i sanap long arere bilong alta, na em i wasim han bilong em, na i tok isi:"),
    P("Lord, wasim mi long ol pasin nogut bilong mi,\nna klinim mi long ol sin bilong mi."),
    L("Pris i sanap namel long alta, na em i lukim ol manmeri. Em i opim na pasim han bilong em, na em i tok:"),
    P("Ol bratasusa, yupela i pre, bai God Papa i strong olgeta\ni ken laikim dispela sakrifais bilong mi na bilong yupela."),
    L("Ol manmeri i sanap na i bekim:"),
    O("Bikpela i ken kisim dispela sakrifais long han bilong yu,\nbilong litimapim na givim glori long nem bilong em,\nna bilong helpim mipela, na holi Sios bilong em."),
    L("Nau Pris i opim na litimapim han, na em i mekim Pre bilong Ofa."),
    ...(proper?.collectOnly ? [] : orationOrSlot(proper?.offerings, "Pre bilong Ofa — bai i kam long Buk Misa.")),
    L("Pre i pinis, olgeta manmeri i tok:"),
    O("Amen."),
    ...eucharistic(opts.ep, day, proper, opts.prefaceKey, opts.prefaceChoices),
  ];
}

function communionRite(proper: Proper | null, blessing?: MassOptions["nuptialBlessing"], afterAntiphon: MassLine[] = []): MassLine[] {
  return [
    L("Pris i putim plet na kap long alta gen. Em i pasim han, na em i tok:"),
    P("Krais em i Sevia bilong yumi,\nna em i bin skulim yumi long kolim God em i Papa bilong yumi.\nOlsem na yumi inap pre:"),
    L("Em i opim na litimapim han, na wantaim olgeta manmeri, em i tok:"),
    T(
      "Papa bilong mipela, yu stap long heven.\nMekim nem bilong yu i kamap bikpela.\nMekim kingdom bilong yu i kam.\nStrongim mipela long bihainim laik bilong yu long graun,\nolsem ol i bihainim long heven.\nGivim mipela kaikai inap long tude.\nPogivim rong bilong mipela,\nolsem mipela i pogivim ol arapela\ni mekim rong long mipela.\nSambai long mipela long taim bilong traim.\nNa rausim olgeta samting nogut long mipela.",
      "O: Pater noster, qui es in caelis:\nsanctificetur nomen tuum;\nadveniat regnum tuum;\nfiat voluntas tua,\nsicut in caelo et in terra.\nPanem nostrum cotidianum da nobis hodie;\net dimitte nobis debita nostra,\nsicut et nos dimittimus debitoribus nostris;\net ne nos inducas in tentationem;\nsed libera nos a malo.",
      null,
    ),
    ...(blessing ?? []),
    ...(blessing
      ? []
      : [
          L("Pris i opim na litimapim han, na em wanpela i tok:"),
          P("Lord, mipela i pre, tekewe olgeta samting nogut long mipela.\nGivim gutpela taim long mipela.\nNa helpim mipela long marimari bilong yu,\nbai mipela inap long abrusim sin,\nna bai i no gat samting i ken mekim mipela i pret.\nOlsem na bai mipela i ken amamas\nna wetim kambek bilong Jisas Krais,\nem i Sevia bilong mipela."),
          L("Pris i pasim han."),
          L("Olgeta manmeri i pinisim pre, na i tok:"),
          O("Kingdom na strong na glori, em i bilong yu tasol, oltaim oltaim."),
          L("Pris i opim na litimapim han, na em i pre:"),
          P("Bikpela Jisas Krais,\nyu bin tokim ol Aposel bilong yu olsem,\n“Bel isi i stap wantaim yupela.\nGutpela taim bilong mi, mi givim long yupela.”\nOlsem na yu no ken tingim ol sin bilong mipela.\nTingim tasol bilip bilong Sios bilong yu,\ngivim gutpela taim bilong yu long em,\nna mekim em i kamap wanbel tru."),
          L("Em i pasim han."),
          P("Yu stap laip na yu King, nau na inap oltaim."),
          ...Ol("Amen."),
        ]),
    L("Pris i lukim ol manmeri, na em i opim na litimapim han, na em i pasim gen, na em i tok:"),
    P("Gutpela taim bilong Lord i stap oltaim wantaim yupela."),
    ...Ol("Na wantaim spirit bilong yu."),
    L("Bihain, sapos Pris i skelim olsem em i orait long mekim, orait Diken o Pris yet i tok:"),
    P("Yumi givim mak bilong bel isi long ol bratasusa."),
    L("Na olgeta manmeri i givim mak bilong soim bel isi, wanbel na laikim pasin. Pris i givim mak bilong bel isi long Diken o long minista."),
    L("129. Pris i kisim hostia, em i brukim hostia antap long plet, na i putim liklik hap\ninsait long kap, na em i tok isi:"),
    P("Dispela Bodi na Blut bilong Bikpela bilong yumi, Jisas Krais,\nnau i stap wantaim, i ken givim laip bilong oltaim long yumi,\nlong taim yumi kisim ol."),
    L("Taim Pris i brukim hostia, ol manmeri i ken sing o pre:"),
    T(
      "Lem bilong God, yu tekewe sin bilong olgeta manmeri,\nmarimari long mipela.\nLem bilong God, yu tekewe sin bilong olgeta manmeri,\nmarimari long mipela.\nLem bilong God, yu tekewe sin bilong olgeta manmeri,\ngivim gutpela taim long mipela.",
      "O: Agnus Dei, qui tollis peccata mundi:\nmiserere nobis.\nAgnus Dei, qui tollis peccata mundi:\nmiserere nobis.\nAgnus Dei, qui tollis peccata mundi:\ndona nobis pacem.",
    ),
    L("131. Pris i pasim han, na em i tok isi:"),
    P("Lord Jisas Krais, Pikinini bilong God i gat laip,\nlong laik bilong Papa na long wok bilong Holi Spirit,\nyu bin givim nupela laip long ol manmeri bilong graun,\nlong indai bilong yu.\nLong dispela holi Bodi na Blut bilong yu,\ntekewe ol sin bilong mi na olgeta samting nogut.\nHelpim mi long holim gut ol lo bilong yu,\nna strongim mi, bai mi no ken lusim yu."),
    L("O:"),
    P("Bodi na Blut bilong yu, Lord Jisas Krais,\ni no ken bringim mi long kot na mi lus. Nogat.\nLong marimari bilong yu,\nBodi na Blut bilong yu i ken helpim sol na bodi bilong mi,\nna tupela i ken kamap olsem marasin bilong oraitim mi."),
    L("132. Pris i brukim skru, em i kisim hostia, na i holim antap liklik long plet o long\nkalis, na i soim long ol manmeri. Na em i tok:"),
    P("Em hia Lem bilong God.\nEm i tekewe ol sin bilong olgeta manmeri bilong graun.\nOl manmeri, God i singautim ol long kaikai bilong Lem,\nem ol i ken amamas."),
    L("Na Pris wantaim ol manmeri i pre wantaim:"),
    T("Lord, mi no gutpela inap long yu kam insait long haus bilong mi.\nYu tok tasol na sol bilong mi bai i orait.", undefined, null),
    L("Pris i kisim plet o siborium wantaim ol hostia, na i go klostu long ol lain i laik kisim Komunio. Em i soim Bodi bilong Krais long wan wan manmeri i laik kisim Komunio, na em i tok:"),
    P("Bodi bilong Krais."),
    L("Man o meri i laik kisim Komunio i bekim:"),
    O("Amen."),
    L("Na Pris i givim Holi Komunio long em. Sapos Diken i tilim Holi Komunio, em i mekim wankain olsem."),
    L("Sapos ol manmeri bai i kisim Holi Komunio wantaim Bodi na Blut wantaim, Pris o Diken i givim kap long wan wan, na em i tok:"),
    P("Blut bilong Krais."),
    L("Man o meri i kisim Komunio i bekim:"),
    O("Amen."),
    L("Na em i dring."),
    L("Sapos Pris i givim Bodi na Blut wantaim, em i tok:"),
    P("Bodi na Blut bilong Krais."),
    L("136. Taim Pris i kisim Bodi bilong Krais, ol pipel i ken singim song bilong kisim\nKomunio."),
    L("137. Taim Pris i givim Komunio pinis, em yet o Diken o akolait i klinim plet\nantap long kap, na bihain em i klinim kap.\nNa taim em i wok long klinim ol samting, em i pre isi:"),
    P("Lord, Bodi na Blut bilong Krais, mipela i bin kisim long maus,\ni ken klinim sol bilong mipela.\nNa dispela kaikai yu bin givim mipela long graun,\ni ken kamap olsem marasin\nbilong givim laip bilong oltaim long mipela."),
    L("138. Nau Pris i ken i go long sia bilong em. Ol manmeri i sarap liklik taim na\npre. Ol i ken singim wanpela Sam o wanpela song o pre bilong litimapim nem\nbilong God."),
    ...antiphonLines("Antipon bilong Komunio", proper?.communion),
    ...afterAntiphon,
    L("Bihain Pris i sanap klostu long sia o klostu long alta, em i lukluk long ol manmeri na i pasim han, na em i tok:"),
    P("Yumi pre."),
    L("Pris na olgeta manmeri i sarap liklik taim na pre, sapos ol i no bin mekim bipo. Bihain Pris i opim na litimapim han, na em i mekim Pre bihain long Komunio."),
    ...(proper?.collectOnly ? [] : orationOrSlot(proper?.postcommunion, "Pre bihain long Komunio — bai i kam long Buk Misa.")),
    L("Na taim pre i pinis, olgeta manmeri i bekim:"),
    O("Amen."),
    ...(proper?.overPeople
      ? [
          L("Sapos Pris i laik, em i ken mekim dispela pre: Pre bilong Helpim ol Pipel"),
          OR(proper.overPeople),
          L("Ol:"),
          O("Amen."),
        ]
      : []),
  ];
}

function concludingRite(day: LiturgicalDay, proper: Proper | null): MassLine[] {
  const souls = day.properId === "sanctorale.11-02" || day.properId.startsWith("sanctorale.11-02.");
  const blessing = souls ? null : blessingFor(day);
  const pinis: MassLine[] = [
    L("Sapos i gat sampela sotpela toksave, ol i ken mekim nau."),
    L("Bihain em i taim bilong salim ol manmeri i go bek. Pris i lukim ol manmeri, em i opim na litimapim han, na i tok:"),
    P("Lord i stap wantaim yupela."),
    ...Ol("Na wantaim spirit bilong yu."),
    ...(souls ? [L("Pris i ken blesim ol manmeri wantaim Bikpela Blesing, p. 588.")] : []),
    ...(blessing
      ? [
          L("Diken, o Pris yet sapos i no gat Diken, i mas tok:"),
          P("Daunim het bilong yupela bilong kisim blesing."),
          ...blessing.petitions.flatMap((pet) => [OR(pet), ...Ol("Amen.")]),
          OR(blessing.closing),
          ...Ol("Amen."),
        ]
      : [
          L("Pris i blesim ol manmeri, na em i tok:"),
          P("God i strong olgeta i ken blesim yupela,\nPapa, na Pikinini, {{✠}} na Holi Spirit."),
          ...Ol("Amen."),
        ]),
    L("Bihain Diken, o Pris yet, i pasim han, em i lukim ol manmeri, na i tok:"),
    P("Yupela go, Misa i pinis."),
    L("O:"),
    P("Yupela go na autim Gutnius bilong Bikpela."),
    L("O:"),
    P("Yupela go wantaim bel isi,\nna givim glori long Bikpela long ol pasin bilong yupela."),
    L("O:"),
    P("Yupela go wantaim bel isi."),
    ...Ol("Yumi tenkim God."),
    L("Nau Pris i givim kis long alta wantaim devosen, olsem em i bin mekim long bigin bilong Misa. Pris wantaim ol minista i daunim het, na ol i go."),
  ];
  return pinis;
}

const PALM_NOTE =
  "Misa bilong Pam Sande i no gat Lotu Bigin na Tok Sori, long wanem, Pris wantaim ol bilipmanmeri i bin mekim prosesio pastaim, na dispela prosesio i kisim ples bilong Lotu Bigin. Olsem na bihain long prosesio, taim Pris i kamap long alta o long sia bilong em, em i statim Santu Misa wantaim pre bilong bigin, olsem Buk Misa i tok.";

function palmOpening(proper: Proper | null): MassLine[] {
  return [
    L(PALM_NOTE),
    L("Pris i pasim han na i tok:"),
    P("Yumi pre."),
    L("Pris wantaim olgeta manmeri ol i sarap liklik taim. Bihain Pris i opim na litimapim han long pre, na em i mekim Pre bilong Bigin."),
    ...orationOrSlot(proper?.collect, "Pre bilong Bigin — bai i kam long Buk Misa."),
    L("Pre bilong Bigin i pinis, orait olgeta manmeri i bekim:"),
    O("Amen."),
  ];
}

export function assembleMass(day: LiturgicalDay, opts: MassOptions, properOverride?: Proper | null): MassSection[] {
  const proper = properOverride ?? propersFor(day, opts.formulary);
  if (!properOverride && day.properId === "temporale.easter-vigil") {
    return easterVigilMass(day, opts, proper);
  }
  if (!properOverride && day.properId === "temporale.good-friday") {
    return [
      { id: "open", title: "", lines: goodFridayOpening() },
      { id: "tok", title: "", lines: [...goodFridayWordIntro(), ...liturgyOfTheWord(day, opts), ...goodFridayAfterGospel()] },
      { id: "kros", title: "", lines: goodFridayCross() },
      { id: "komunio", title: "", lines: goodFridayCommunion() },
    ];
  }
  const palm = day.properId === "temporale.palm";
  const bigin: MassLine[] = palm
    ? [...palmProcession(day.sundayCycle), ...palmOpening(proper)]
    : [
    L("1. Taim olgeta manmeri i bung pinis, orait Pris wantaim ol lain i helpim em\nlong lotu i wokabaut i go long alta, na ol manmeri i singim wanpela song\nbilong bigin.\nTaim ol i kam kamap long alta, ol i daunim het tru, na Pris i givim kis long alta."),
    ...antiphonLines("Antipon bilong Bigin", proper?.entrance),
    ...greeting(),
    ...penitential(opts.penitential),
    ...(day.gloria || opts.forceGloria ? GLORIA : [L("Long dispela de, ol i no singim Ona long God i stap antap.")]),
    L("Taim singsing o pre i pinis, Pris i pasim han na i tok:"),
    P("Yumi pre."),
    L("Pris wantaim olgeta manmeri ol i sarap liklik taim. Bihain Pris i opim na litimapim han long pre, na em i mekim Pre bilong Bigin ol i bin makim long Buk Misa."),
    ...orationOrSlot(proper?.collect, "Pre bilong Bigin — bai i kam long Buk Misa."),
    L("Pre bilong Bigin i pinis, orait olgeta manmeri i bekim:"),
    O("Amen."),
  ];

  const tok: MassLine[] = liturgyOfTheWord(day, opts);

  const thursday = day.properId === "temporale.holy-thursday";
  const yukaris = eucharisticLiturgy(day, proper, opts);
  const komunio = communionRite(
    proper,
    opts.nuptialBlessing,
    thursday
      ? [
          L(
            "Bihain long Komunio, Pris i putim siborium i gat ol hostia bilong neks de namel long alta. Pris i sanap klostu long sia, na i mekim Pre bihain long Komunio.",
          ),
        ]
      : [],
  );
  const pinis = thursday ? eucharistTransfer() : concludingRite(day, proper);

  return [
    { id: "bigin", title: palm ? "Prosesio" : "Lotu Bigin", lines: bigin },
    { id: "tok", title: "Lotu Bilong Tok Bilong God", lines: tok },
    { id: "yukaris", title: "Lotu Bilong Yukaris", lines: yukaris },
    { id: "komunio", title: "Lotu Bilong Kisim Komunio", lines: komunio },
    { id: "pinis", title: thursday ? "Karim Holi Yukaris i Go long Narapela Ples" : "Lotu Bilong Pinisim Misa", lines: pinis },
  ];
}

function vigilClean(proper: Proper | null): Proper | null {
  if (!proper) return proper;
  const communion = proper.communion?.text
    ? {
        ...proper.communion,
        text: proper.communion.text.replace(/\s*\n?\d{3}\s+SANDE BILONG ISTA\..*$/s, "").trim(),
      }
    : proper.communion;
  const post = proper.postcommunion?.split(/\n\s*68\.\s*Bikpela Blesing/)[0]?.trim();
  return { ...proper, communion, postcommunion: post };
}

function vigilPrayer(prayer: string, alt?: string, altNote?: string): MassLine[] {
  const out: MassLine[] = [
    L("Olgeta manmeri i sanap, na Pris i tok:"),
    P("Yumi pre."),
    OR(prayer),
    ...Ol("Amen."),
  ];
  if (alt) out.push(L(altNote ?? "O narapela pre:"), OR(alt), ...Ol("Amen."));
  return out;
}

function row(who: string, q: string, a: string): MassLine[] {
  return [{ voice: "together", label: who, text: q, note: `row:${a}` }];
}

function easterVigilMass(day: LiturgicalDay, opts: MassOptions, proper: Proper | null): MassSection[] {
  const cleaned = vigilClean(proper);
  const bundle = readingsForDay(day);
  const hap1: MassLine[] = [
    { voice: "cite", variant: "banner", label: "Hap Namba Wan", text: "Bigin bilong Selebresen bilong Vijil\nLotu bilong Lait" },
    { voice: "cite", variant: "banner", text: "Blesing bilong Paia na Redim Ista Kandel" },
    L("Ol i mas redim wanpela bikpela paia ausait long haus lotu. Taim ol pipel i bung pinis, orait Pris wantaim ol minista i go klostu long paia. Wanpela minista i holim Ista kandel. Ol i no ken karim kruse na ol arapela kandel. Sapos ol i no inap laitim bikpela paia ausait long haus lotu, orait ol i bihainim pasin i stap long n. 13."),
    L("Pris na olgeta manmeri i mekim Mak bilong Kruse, na Pris i tok:"),
    P("Long nem bilong Papa, na bilong Pikinini, na bilong Holi Spirit."),
    L("Bihain Pris i tok welkam long ol manmeri na i givim sotpela skul long mining bilong dispela Vijil long nait. Em i ken tok olsem:"),
    P(VIGIL_WELCOME),
    L("Pris i opim han bilong em, na em i blesim paia, na i tok:"),
    P("Yumi pre."),
    OR(VIGIL_FIRE),
    ...Ol("Amen."),
    L("Taim Pris i blesim nupela paia pinis, orait wanpela minista i bringim Ista kandel long Pris. Pris i makim mak bilong Diwai Kros long kandel. Em i makim leta A (Alfa, long Tok Grik) antap long Diwai Kros. Bihain em i makim leta O (Omega, long Tok Grik) aninit long Diwai Kros, na ol namba bilong yia namel long ol han bilong Diwai Kros. Taim em i mekim ol dispela pasin, orait em i tok:"),
    L("Pris i makim mak bilong Diwai Kros long Ista kandel, na em i tok:"),
    P("{{1.}} Krais em i bilong asde na bilong tude.\n{{(makim han i go antap na han i go daun bilong Diwai Kros)}}"),
    P("{{2.}} Krais em i Bigin na Pinis bilong olgeta samting.\n{{(makim han i go long han kais inap long han sut bilong Diwai Kros)}}"),
    P("{{3.}} Krais em i Alfa.\n{{(makim leta Alfa antap long Diwai Kros)}}"),
    P("{{4.}} Krais em i Omega.\n{{(makim leta Omega aninit long Diwai Kros)}}"),
    P("{{5.}} Olgeta taim em bilong Krais,\n{{(makim namba wan namba bilong yia)}}"),
    P("{{6.}} wantaim olgeta yia bai i kam bihain.\n{{(makim namba 2 namba bilong yia)}}"),
    P("{{7.}} Olgeta glori na strong em bilong Krais tasol,\n{{(makim namba 3 namba bilong yia)}}"),
    P("{{8.}} inap oltaim oltaim. Amen.\n{{(makim namba 4 namba bilong yia)}}"),
    L("Taim Pris i mekim mak bilong Diwai Kros na ol arapela mak pinis, orait em i putim 5-pela nil, ol i bin wokim long insens, long Ista kandel. Em i putim olsem mak bilong Diwai Kros, na em i tok:"),
    P("{{1.}} Long strong bilong ol holi sua bilong em,\n{{2.}} Krais i kisim long ol nil na spia.\n{{3.}} Em i ken was long yumi,\n{{4.}} na lukautim yumi.\n{{5.}} Krais em i Bikpela. Amen."),
    L("Nau Pris i laitim Ista kandel long nupela paia, na em i tok:"),
    P("Krais i kirap pinis wantaim bikpela glori.\nLait bilong em i ken rausim tudak\nlong bel na long tingting bilong yumi."),
    { voice: "cite", variant: "banner", text: "Prosesio" },
    L("Taim ol i laitim Ista kandel pinis, orait wanpela minista i kisim blakpela na hatpela sit bilong dispela paia yet na i putim long kap bilong insens, na bihain Pris i putim insens. Diken (o sapos i no gat Diken, narapela minista o Pris yet) i holim Ista kandel, litimapim antap, na i statim prosesio. Insens i go pas long prosesio, na Ista kandel i kam bihain. Na Pris wantaim ol minista, na wantaim ol manmeri i holim ol kandel i no lait yet i wokabaut bihain long Ista kandel. Taim ol i kam kamap long dua bilong haus lotu pinis, orait Diken (o minista o Pris i holim Ista kandel) i litimapim Ista kandel na i sing:"),
    L("Diken (o Minista):"),
    P("Lait bilong Krais. (O: Lumen Christi.)"),
    L("Ol:"),
    O("Yumi tenkim God. (O: Deo gratias.)"),
    L("Pris i laitim kandel bilong em yet long paia i kam long Ista kandel."),
    L("Diken (o minista o Pris) i wokabaut i go inap long namel long haus lotu. Nau em i litimapim Ista kandel gen na em i singim namba 2 taim:"),
    L("Diken (o Minista):"),
    P("Lait bilong Krais. (O: Lumen Christi.)"),
    L("Ol:"),
    O("Yumi tenkim God. (O: Deo gratias.)"),
    L("Nau olgeta manmeri i laitim kandel bilong ol yet long paia i kam long Ista kandel, na ol i wokabaut i go."),
    L("Taim Diken (o minista o Pris) i kam kamap klostu long alta pinis, orait em i tanim long ol manmeri, na i litimapim Ista kandel gen, na em i singim namba 3 taim olsem:"),
    L("Diken (o Minista):"),
    P("Lait bilong Krais. (O: Lumen Christi.)"),
    L("Ol:"),
    O("Yumi tenkim God. (O: Deo gratias.)"),
    L("Diken (o minista o Pris) i putim Ista kandel long ples bilong kandel namel klostu long hap bilong ritim Tok bilong God, o namel long ples bilong alta. Nau ol i onim olgeta lait bilong haus lotu, tasol ol i no ken laitim ol kandel bilong alta."),
    { voice: "cite", variant: "banner", text: "Amamas bilong Ista", note: "(Tok Rom: [[Exsultet]])" },
    L("Diken i autim o singim Amamas bilong Ista. Olgeta manmeri i sanap, na i holim ol kandel i lait. Sapos i no gat Diken, Pris o narapela man i ken singim."),
    P(VIGIL_EXSULTET_OPEN),
    P(`(${VIGIL_EXSULTET_ASK}\n{{Diken (o Pris):}} Lord i stap wantaim yupela.\n{{Ol:}} Na wantaim spirit bilong yu.)`),
    L("Diken (o Pris):"),
    P("Litimapim hat bilong yupela."),
    ...Ol("Mipela i litimapim long Lord."),
    L("Diken (o Pris):"),
    P("Yumi tenkim God, em i Lord bilong yumi."),
    ...Ol("Em i gutpela na i stret."),
    { voice: "priest", variant: "oration", text: VIGIL_EXSULTET_REST },
    ...Ol("Amen."),
  ];

  const units = bundle
    ? [{ reading: bundle.readings.reading, psalm: bundle.readings.psalm }, ...(bundle.readings.vigil ?? [])]
    : [];
  const ot: MassLine[] = [];
  const count = Math.max(units.length, VIGIL_OT_ORATIONS.length);
  for (let i = 0; i < count; i++) {
    const item = units[i];
    const ora = VIGIL_OT_ORATIONS[i];
    if (item?.reading?.text) ot.push(...scriptureBlock(`Rit namba ${i + 1}`, item.reading));
    else ot.push(S(`Rit namba ${i + 1} — bai i kam long Leksonari.`));
    ot.push(P("Dispela em i Tok bilong God."), ...Ol("Yumi tenkim God."));
    ot.push(L("Ol i singim o kolim Sam bilong bekim."));
    if (item?.psalm && (item.psalm.response || item.psalm.stanzas.length)) ot.push(...psalmBlock(item.psalm));
    else ot.push(S("Sam — bai i kam long Leksonari."));
    if (ora) ot.push(...vigilPrayer(ora.prayer, ora.alt, ora.altNote));
  }

  const gospel = bundle ? pickGospel(bundle.readings, day.sundayCycle) : null;
  const hap2: MassLine[] = [
    { voice: "cite", variant: "banner", label: "Hap Namba 2", text: "Lotu bilong Tok bilong God" },
    L("Dispela Vijil em i nambawan vijil, na em i olsem mama bilong olgeta vijil. Long dispela Vijil i gat 9-pela rit. 7-pela rit i kam long Olpela Testamen, na tupela i kam long Nupela Testamen (Pas na Gutnius). Sapos ol inap, orait long dispela Vijil ol i mas ritim olgeta rit. Long wanem, ol i mas bihainim as na mining bilong dispela nait."),
    L("Tasol sapos ol i no inap ritim olgeta rit, em i orait tu long sotim namba bilong ol rit bilong Olpela Testamen. Tasol oltaim ol i mas tingim olsem ritim Tok bilong God em i bikpela samting tru insait long Ista Vijil. Ol i ken ritim tripela o moa rit bilong Olpela Testamen, na ol i mas skelim sampela rit i kam long Moses na sampela i kam long ol Profet. Namba bilong ol rit bilong Olpela Testamen i no ken i go daun long tri. Na ol i mas singim o kolim tu ol Sam bilong bekim bilong wan wan rit. Na tu oltaim ol i mas ritim rit i kam long sapta 14 bilong Buk bilong Eksodas. Ol i no ken lusim dispela rit."),
    L("Bihain long singsing “Amamas bilong Ista”, ol i mekim ol liklik kandel i dai. Na ol i sindaun. Pastaim long ol rit, orait Pris i ken tok olsem:"),
    P(VIGIL_WORD_INTRO),
    L("Ol i statim ol rit nau. Ol man o meri ol i bin makim bilong mekim ol rit, ol i go sanap long ples bilong rit, na ritim. Bihain long wan wan rit ol i mas singim o kolim wanpela Sam bilong bekim. Bihain long Sam, orait olgeta manmeri i sanap, na Pris i tok Yumi pre. Ol i sarap liklik taim pastaim, na bihain Pris i kolim pre bilong wan wan rit. Sapos ol i laik, orait ol i ken lusim ol Sam na ol i ken sarap liklik taim bihain long wan wan rit tu. Na bihain Pris i tok Yumi pre."),
    ...ot,
    L("Bihain long las rit bilong Olpela Testamen wantaim Sam na Pre bilong em, orait ol i mas laitim ol kandel bilong alta. Pris i statim Ona long God i stap antap, na olgeta manmeri i bihainim em. Na taim ol i singim, orait ol i mas paitim belo."),
    GLORIA[1],
    L("Taim Ona long God i stap antap i pinis, orait Pris i pre."),
    CITE("Pre", ""),
    P("Yumi pre."),
    ...orationOrSlot(cleaned?.collect, "Pre bilong Bigin — bai i kam long Buk Misa."),
    ...Ol("Amen."),
    L("Nau wanpela man o meri i ritim Pas bilong Aposel Pol."),
    ...(bundle?.readings.reading2
      ? [
          ...scriptureBlock("Pas", bundle.readings.reading2),
          P("Dispela em i Tok bilong God."),
          ...Ol("Yumi tenkim God."),
        ]
      : [S("Pas — bai i kam long Leksonari."), P("Dispela em i Tok bilong God."), ...Ol("Yumi tenkim God.")]),
    L("Taim Pas i pinis, orait ol i sanap, na Pris i statim Aleluya tripela taim. Olgeta manmeri i bekim Aleluya. Nau ol lain bilong singsing i ken kirapim Sam 118, na olgeta manmeri i bekim Aleluya."),
    P("Aleluya."),
    ...Ol("Aleluya."),
    P("Aleluya."),
    ...Ol("Aleluya."),
    P("Aleluya."),
    ...Ol("Aleluya."),
    ...psalmBlock(VIGIL_ALLELUIA_PSALM),
    L("Pris i putim insens, na i givim blesing long Diken. Ol minista i mas karim insens tasol."),
    L("Diken o Pris yet i go long ples bilong ritim Gutnius, na em i tok:"),
    P("Lord i stap wantaim yupela."),
    ...Ol("Na wantaim spirit bilong yu."),
    ...(gospel
      ? [CITE("Gutnius", gospel.citation, gospel.source), RD(gospel.text, "gospel")]
      : [P("Rit i kam long holi Gutnius, Santu N. i raitim."), ...Ol("Ona long yu, Lord."), S("Gutnius — bai i kam long Leksonari.")]),
    P("Dispela em i Gutnius bilong Bikpela."),
    ...Ol("Ona long yu, Bikpela Jisas Krais."),
    L("Bihain long Gutnius Pris i mas givim skul. Em i ken sotim skul, tasol em i no ken lusim."),
  ];

  const hap3: MassLine[] = [
    { voice: "cite", variant: "banner", label: "Hap Namba 3", text: "Lotu bilong Baptais" },
    L("Lotu bilong Baptais i stat bihain long skul. Pris wantaim ol minista i go long ples bilong Baptais. Sapos ples bilong Baptais i no i stap long ples klia, orait ol i mas putim wanpela dis wara klostu long alta."),
    L("Nau ol i kolim nem bilong ol katekumen, na ol waspapamama bilong ol i kisim ol i kam long fran, long ai bilong ol manmeri bilong Sios. Sapos i gat ol liklik pikinini bilong kisim Baptais tu, orait ol papamama na waspapamama i kisim ol i kam long fran."),
    L("Sapos i gat prosesio i go long ples bilong kisim Baptais, orait ol i statim nau. Wanpela minista i karim Ista kandel i go pas, na ol lain bilong kisim Baptais wantaim ol waspapamama i bihainim em. Bihain ol arapela minista, Diken na Pris i wokabaut i go. Long taim bilong prosesio, ol i mas singim ol Litani (n. 43). Na taim ol Litani i pinis, orait Pris i givim tok (n. 40)."),
    L("Sapos lotu bilong Baptais i kamap long fran klostu long alta, orait Pris nau i mekim sotpela tok i go pas."),
    L("Sapos i gat lain bilong kisim Baptais:"),
    P(VIGIL_BAPTISM_WITH),
    L("Sapos i no gat lain bilong kisim Baptais, tasol em i blesim wara:"),
    P(VIGIL_BAPTISM_WATER_ONLY),
    { voice: "cite", variant: "banner", text: "Ol Litani" },
    L("Tupela man o meri i mas singim ol Litani. Olgeta manmeri i mas sanap i stap (long wanem, em i taim bilong Ista) na i bekim. Sapos i gat prosesio i go long ples bilong givim Baptais, orait ol i singim ol Litani long taim ol i prosesio. Sapos ol i mekim olsem, orait pastaim long prosesio, ol i mas kolim nem bilong ol lain i laik kisim Baptais, na ol i kam long fran. Taim ol i kam kamap pinis long fran, orait prosesio i bigin. Wanpela minista i karim Ista kandel i wokabaut i go pas, bihain ol katekumen i kam wantaim ol waspapamama, na bihain ol minista, Diken na Pris i wokabaut i go. Ol i mas givim ol toktok pastaim long Blesing bilong Wara."),
    L("Sapos i no gat lain bilong kisim Baptais, na sapos Pris i no blesim wara bilong givim Baptais, orait ol i no ken singim ol Litani. Na Pris i blesim wara (n. 54)."),
    L("Long ol Litani em i orait long kolim sampela moa nem bilong ol Santu, olsem nem bilong Wassantu bilong peris, na nem bilong ol Wassantu bilong ol manmeri husat bai i kisim Baptais."),
    ...row("Lida", "Lord, yu marimari.", "Lord, yu marimari."),
    ...row("Lida", "Krais, yu marimari.", "Krais, yu marimari."),
    ...row("Lida", "Lord, yu marimari.", "Lord, yu marimari."),
    ...VIGIL_LITANY_SAINTS.flatMap((name) => row("Lida", name, "Pre bilong helpim mipela.")),
    ...row("Lida", "Lord, yu marimari long mipela,", "Lord, yu helpim mipela."),
    ...row("Lida", "Long olgeta samting nogut,", "Lord, yu helpim mipela."),
    ...row("Lida", "Long olgeta sin,", "Lord, yu helpim mipela."),
    ...row("Lida", "Long indai bilong oltaim,", "Lord, yu helpim mipela."),
    ...row("Lida", "Bikos yu bin kamap man tru,", "Lord, yu helpim mipela."),
    ...row("Lida", "Bikos yu bin dai na kirap bek,", "Lord, yu helpim mipela."),
    ...row("Lida", "Bikos yu bin salim Holi Spirit i kam daun,", "Lord, yu helpim mipela."),
    ...row("Lida", "Marimari long mipela ol manmeri bilong sin,", "Mipela i pre, harim pre bilong mipela."),
    L("Sapos i gat lain bilong kisim Baptais:"),
    ...row("Lida", "Long grasia bilong Baptais givim nupela laip long ol dispela manmeri yu makim pinis.", "Mipela i pre, harim pre bilong mipela."),
    L("Sapos i no gat lain bilong kisim Baptais:"),
    ...row("Lida", "Mekim dispela wara i kamap holi long grasia bilong yu, bai ol pikinini bilong yu i ken kisim nupela laip.", "Mipela i pre, harim pre bilong mipela."),
    ...row("Lida", "Jisas, Pikinini bilong God i gat laip.", "Mipela i pre, harim pre bilong mipela."),
    ...row("Lida", "Krais, yu harim mipela.", "Krais, yu harim mipela."),
    ...row("Lida", "Krais, long marimari bilong yu, harim pre bilong mipela.", "Krais, long marimari bilong yu, harim pre bilong mipela."),
    L("Sapos sampela lain bai i kisim Baptais, orait Pris i opim na litimapim han, na em i autim pre olsem:"),
    OR(VIGIL_AFTER_LITANY),
    ...Ol("Amen."),
    { voice: "cite", variant: "banner", text: "Blesing bilong Wara bilong Baptais" },
    L("Pris i blesim wara bilong Baptais. Em i opim na litimapim han, na em i pre olsem:"),
    OR(VIGIL_FONT),
    L("Sapos em inap, orait nau Pris i putim Ista kandel i go daun insait long wara wanpela taim o tripela taim, na em i tok:"),
    P(VIGIL_FONT_CANDLE_A),
    L("Pris i holim Ista kandel insait long wara, na i tok moa olsem:"),
    P(VIGIL_FONT_CANDLE_B),
    ...Ol("Amen."),
    L("Pris i rausim Ista kandel long wara, na ol manmeri i tokaut:"),
    O("Olgeta hul wara, litimapim nem bilong Bikpela.\nGivim ona na biknem long em oltaim."),
    L("Bihain Pris i askim ol promis bilong lusim Satan na ol askim bilong bilip, olsem Buk bilong ol Sakramen i tok, na em i givim Baptais. Sapos i gat bikpela manmeri, ol i kisim Konpirmasio tu."),
    { voice: "cite", variant: "banner", text: "Blesing bilong Wara" },
    L("Sapos i no gat manmeri bilong kisim Baptais, na i no gat blesing bilong wara bilong Baptais, Pris i tok:"),
    P(VIGIL_WATER_INTRO),
    L("Ol i sarap liklik taim, na Pris i opim na litimapim han, na em i pre:"),
    OR(VIGIL_WATER),
    ...Ol("Amen."),
    { voice: "cite", variant: "banner", text: "Tokaut Gen long ol Promis bilong Baptais" },
    L("Taim Lotu bilong Baptais (na Konpirmasio) i pinis, orait olgeta manmeri i sanap na i holim kandel i lait, na ol i tokaut gen long ol promis bilong Baptais bilong ol, sapos ol i no bin tokaut pastaim, wantaim ol lain i bin kisim Baptais (n. 49). Sapos i no gat Baptais, orait ol i mekim olsem bihain long blesing bilong wara."),
    L("Pris i tokim ol manmeri olsem:"),
    P(VIGIL_RENEWAL_INTRO),
    ...row("Pris", "Yupela i laik lusim Satan?", "Yes, mi laik lusim."),
    ...row("Pris", "Yupela i laik lusim olgeta wok bilong em?", "Yes, mi laik lusim."),
    ...row("Pris", "Yupela i laik lusim olgeta promis nating bilong em?", "Yes, mi laik lusim."),
    L("O:"),
    ...row("Pris", "Yupela i laik lusim sin, bai yupela i ken i stap fri olsem pikinini bilong God?", "Yes, mi laik lusim."),
    ...row("Pris", "Yupela i laik lusim ol giaman amamas bilong ol pasin nogut, bai sin i no ken bosim yupela?", "Yes, mi laik lusim."),
    ...row("Pris", "Yupela i laik lusim Satan, em i as tru na hetman bilong sin?", "Yes, mi laik lusim."),
    L("Bisop Konperens i ken senisim dispela namba 2 rot bilong tokaut gen long ol promis bilong Baptais, na em i ken toktok long ol nid na pasin bilong ples."),
    L("Pris i go het olsem:"),
    ...row("Pris", "Yupela i bilip long God Papa i strong olgeta, em i mekim kamap heven na graun?", "Yes, mi bilip."),
    ...row(
      "Pris",
      "Yupela i bilip long Jisas Krais, em i Pikinini bilong God na Bikpela bilong yumi. Maria Virgo i karim em, em i dai, na ol i planim em. Em i kirap bek na i sindaun long raithan bilong God Papa?",
      "Yes, mi bilip.",
    ),
    ...row(
      "Pris",
      "Yupela i bilip long Holi Spirit, long holi Katolik Sios, long ol santu i wanfamili tasol, long God i pogivim sin, i kirapim bodi, na i givim laip bilong oltaim?",
      "Yes, mi bilip.",
    ),
    P(VIGIL_RENEWAL_CLOSE),
    ...Ol("Amen."),
    L("Pris i tromoi holi wara long ol manmeri, na ol sing:"),
    CITE("Antipon", ""),
    P(VIGIL_SPRINKLE),
    L("No gat Tok Bilip. Pris i statim Pre bilong ol Bilipmanmeri."),
    ...intercessionLines(day, opts),
  ];

  const hap4: MassLine[] = [
    { voice: "cite", variant: "banner", label: "Hap Namba 4", text: "Lotu bilong Yukaris" },
    L("Pris i go long alta na Lotu bilong Yukaris i bigin, wankain olsem ol arapela Misa."),
    L("Em i gutpela sapos ol nupela manmeri i bin kisim Baptais i ken karim bret na wain i kam long alta."),
    ...eucharisticLiturgy(day, cleaned, opts),
    L("Pastaim long Em hia Lem bilong God, Pris i ken givim sotpela skul long ol nupela lain i bin kisim Baptais long mining bilong kisim namba wan Komunio."),
    ...communionRite(cleaned),
    { voice: "cite", variant: "banner", text: "Bikpela Blesing", note: "left" },
    L("Diken, o Pris yet sapos i no gat Diken, i mas tok:"),
    P("Daunim het bilong yupela bilong kisim blesing."),
    ...VIGIL_BLESSING.flatMap((pet) => [OR(pet), ...Ol("Amen.")]),
    OR(VIGIL_BLESSING_CLOSE),
    ...Ol("Amen."),
    L("Pris i ken givim blesing bilong Lotu bilong Baptais bilong ol bikpela manmeri, o bilong Baptais bilong ol pikinini. Em yet i mas skelim."),
    L("Bilong salim ol manmeri i go, Diken o Pris yet i ken sing o tok:"),
    P("Yupela go, Misa i pinis, aleluya, aleluya."),
    ...Ol("Yumi tenkim God, aleluya, aleluya."),
    L("Pris i tok olsem long olgeta de bilong Wik bilong Ista."),
    L("Ista kandel i mas lait long olgeta bikpela selebresen bilong Taim bilong Ista."),
    L("Nau Pris i givim kis long alta wantaim devosen. Pris wantaim ol minista i daunim het, na ol i go."),
  ];

  return [
    { id: "hap1", title: "", lines: hap1 },
    { id: "hap2", title: "", lines: hap2 },
    { id: "hap3", title: "", lines: hap3 },
    { id: "hap4", title: "", lines: hap4 },
  ];
}

