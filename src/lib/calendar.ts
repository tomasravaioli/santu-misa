export type LitColor = "green" | "red" | "white" | "violet" | "rose" | "black";
export type Rank = "solemnity" | "feast" | "memorial" | "optional" | "feria";
export type Season = "advent" | "christmas" | "lent" | "easter" | "ordinary";
export type SundayCycle = "A" | "B" | "C";
export type WeekdayCycle = "I" | "II";

export const FERIA_CELEBRATION = "feria";

export type CelebrationChoice = {
  id: string;
  titleTpi: string;
  rank: Rank;
};

export type LiturgicalDay = {
  date: string;
  weekday: number;
  season: Season;
  week: number | null;
  rank: Rank;
  color: LitColor;
  titleTpi: string;
  subtitleTpi: string;
  metaTpi: string;
  properId: string;
  sundayCycle: SundayCycle;
  weekdayCycle: WeekdayCycle;
  gloria: boolean;
  creed: boolean;
  alleluia: boolean;
  isSunday: boolean;
  isTriduum: boolean;
  options: CelebrationChoice[];
  celebratedId: string;
};

export const WEEKDAYS_TPI = [
  "Sande",
  "Mande",
  "Tunde",
  "Trinde",
  "Fonde",
  "Fraide",
  "Sarere",
] as const;

export const MONTHS_TPI = [
  "Janueri",
  "Februeri",
  "Mas",
  "Epril",
  "Me",
  "Jun",
  "Julai",
  "Ogas",
  "Septemba",
  "Oktoba",
  "Novemba",
  "Desemba",
] as const;

export const SEASON_TPI: Record<Season, string> = {
  advent: "Taim Bilong Atven",
  christmas: "Taim Bilong Krismas",
  lent: "Taim Bilong Lent",
  easter: "Taim Bilong Ista",
  ordinary: "Taim Bilong Yia",
};

export const COLOR_TPI: Record<LitColor, string> = {
  green: "Grinpela",
  red: "Retpela",
  white: "Waitpela",
  violet: "Vaiolet",
  rose: "Rospela",
  black: "Blakpela",
};

/** Rank line as printed in Buk Misa. Optional memorials have none. */
export const RANK_TPI: Record<Rank, string> = {
  solemnity: "Bikpela pestode",
  feast: "Pestode",
  memorial: "De bilong tingim",
  optional: "",
  feria: "",
};

export const COLOR_CLASS: Record<LitColor, string> = {
  green: "bg-lit-green",
  red: "bg-lit-red",
  white: "bg-lit-white",
  violet: "bg-lit-violet",
  rose: "bg-lit-rose",
  black: "bg-lit-black",
};

/** Civil date where the app is opened, not a fixed mission timezone. */
export function todayYmd(): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function parseYmd(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split("-").map(Number);
  return { y: y ?? 2026, m: m ?? 1, d: d ?? 1 };
}

export function addDays(iso: string, n: number): string {
  const { y, m, d } = parseYmd(iso);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}

export function weekdayOf(iso: string): number {
  const { y, m, d } = parseYmd(iso);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function sundayOnOrBefore(iso: string): string {
  return addDays(iso, -weekdayOf(iso));
}

export function formatLongTpi(iso: string): string {
  const { y, m, d } = parseYmd(iso);
  const wd = WEEKDAYS_TPI[weekdayOf(iso)];
  const mo = MONTHS_TPI[m - 1];
  return `${wd} ${d} ${mo} ${y}`;
}

export function monthTitleTpi(iso: string): string {
  const { y, m } = parseYmd(iso);
  return `${MONTHS_TPI[m - 1]} ${y}`;
}

export function shiftMonth(iso: string, delta: number): string {
  const { y, m, d } = parseYmd(iso);
  const dt = new Date(Date.UTC(y, m - 1 + delta, 1));
  const y2 = dt.getUTCFullYear();
  const m2 = dt.getUTCMonth() + 1;
  const dim = new Date(Date.UTC(y2, m2, 0)).getUTCDate();
  return `${y2}-${String(m2).padStart(2, "0")}-${String(Math.min(d, dim)).padStart(2, "0")}`;
}

export function easterSunday(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = h + l - 7 * m + 114;
  const month = Math.floor(n / 31);
  const day = (n % 31) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function firstAdvent(year: number): string {
  const christmas = `${year}-12-25`;
  const christmasWd = weekdayOf(christmas);
  const sunBefore = addDays(christmas, -((christmasWd + 7) % 7 || 7));
  return addDays(sunBefore, -21);
}

export function baptismOfTheLord(year: number): string {
  const epiphanyWd = weekdayOf(`${year}-01-06`);
  if (epiphanyWd === 0) return `${year}-01-07`;
  return addDays(`${year}-01-06`, 7 - epiphanyWd);
}

export function christTheKing(year: number): string {
  return addDays(firstAdvent(year), -7);
}

export function holyFamilyDate(christmasYear: number): string {
  const wd = weekdayOf(`${christmasYear}-12-25`);
  if (wd === 0) return `${christmasYear}-12-30`;
  return addDays(`${christmasYear}-12-25`, 7 - wd);
}

function liturgicalYear(iso: string): number {
  const { y } = parseYmd(iso);
  return iso >= firstAdvent(y) ? y + 1 : y;
}

function sundayCycleFor(year: number): SundayCycle {
  const r = year % 3;
  if (r === 1) return "A";
  if (r === 2) return "B";
  return "C";
}

function weeksBetween(sunA: string, sunB: string): number {
  const a = Date.parse(`${sunA}T00:00:00Z`);
  const b = Date.parse(`${sunB}T00:00:00Z`);
  return Math.round((b - a) / 86400000 / 7);
}

type Saint = {
  name: string;
  rank: Rank;
  color: LitColor;
  ofTheLord?: boolean;
  properKey?: string;
};

const SAINTS: Record<string, Saint | Saint[]> = {
  "01-01": { name: "Santu Maria, Mama bilong God", rank: "solemnity", color: "white" },
  "01-06": { name: "Epifani bilong Bikpela", rank: "solemnity", color: "white", ofTheLord: true },
  "01-25": { name: "Aposel Santu Pol i tanim bel", rank: "feast", color: "white" },
  "02-02": { name: "Maria na Josep i bringim Bikpela Jisas i go long Tempel", rank: "feast", color: "white", ofTheLord: true },
  "02-22": { name: "Sia bilong Santu Pita, Aposel", rank: "feast", color: "white" },
  "03-19": { name: "Santu Josep, man bilong Santu Maria Virgo", rank: "solemnity", color: "white" },
  "03-25": { name: "Ensel i bringim tok long Santu Maria, na Bikpela Jisas Krais i kamap man", rank: "solemnity", color: "white" },
  "04-25": { name: "Santu Mak, Evangelis", rank: "feast", color: "red" },
  "05-01": { name: "Santu Josep i Wokman", rank: "optional", color: "white" },
  "05-03": { name: "Santu Filip na Jems, Aposel", rank: "feast", color: "red" },
  "05-14": { name: "Santu Matias, Aposel", rank: "feast", color: "red" },
  "05-31": { name: "Santu Maria Virgo i go lukim Santu Elisabet", rank: "feast", color: "white" },
  "06-24": { name: "Santu Elisabet i karim Santu Jon bilong Baptais", rank: "solemnity", color: "white" },
  "06-29": { name: "Santu Pita na Pol, Aposel", rank: "solemnity", color: "red" },
  "07-03": { name: "Santu Tomas, Aposel", rank: "feast", color: "red" },
  "07-07": { name: "Santu Pita To Rot, Martir", rank: "memorial", color: "red" },
  "07-22": { name: "Santu Maria Magdalena", rank: "feast", color: "white" },
  "07-25": { name: "Santu Jems, Aposel", rank: "feast", color: "red" },
  "07-26": { name: "Santu Joakim na Ana, Papamama bilong Santu Maria Virgo", rank: "memorial", color: "white" },
  "08-06": { name: "Bikpela Jisas i kamap narakain", rank: "feast", color: "white", ofTheLord: true },
  "08-10": { name: "Santu Lorens, Diken na Martir", rank: "feast", color: "red" },
  "08-15": { name: "Asunsio bilong Santu Maria Virgo", rank: "solemnity", color: "white" },
  "08-24": { name: "Santu Bartolomyu, Aposel", rank: "feast", color: "red" },
  "09-08": { name: "Tingim de mama i karim Santu Maria Virgo", rank: "feast", color: "white" },
  "09-14": { name: "Holi Diwai Kros i win", rank: "feast", color: "red", ofTheLord: true },
  "09-16": { name: "Independens De", rank: "feast", color: "white" },
  "09-21": { name: "Santu Matyu, Aposel na Evangelis", rank: "feast", color: "red" },
  "09-29": { name: "Santu Maikel, Gebriel na Rafael, Akensel", rank: "feast", color: "white" },
  "10-18": { name: "Santu Luk, Evangelis", rank: "feast", color: "red" },
  "10-28": { name: "Santu Saimon na Jut, Aposel", rank: "feast", color: "red" },
  "11-01": { name: "Olgeta Santu", rank: "solemnity", color: "white" },
  "11-02": { name: "De bilong tingim olgeta bilipmanmeri i dai pinis", rank: "feria", color: "violet" },
  "11-09": { name: "Blesing bilong Haus Lotu bilong Santu Jon long Lateran, long ples Rom", rank: "feast", color: "white", ofTheLord: true },
  "11-30": { name: "Santu Andru, Aposel", rank: "feast", color: "red" },
  "12-08": { name: "Santu Maria Virgo i no gat sin", rank: "solemnity", color: "white" },
  "12-25": { name: "Krismas bilong Bikpela", rank: "solemnity", color: "white", ofTheLord: true },
  "12-26": { name: "Santu Stiven, namba wan Martir", rank: "feast", color: "red" },
  "12-27": { name: "Santu Jon, Aposel na Evangelis", rank: "feast", color: "white" },
  "12-28": { name: "Ol liklik holi pikinini, King Herot i bin kilim ol i dai, martir", rank: "feast", color: "red" },

  "01-02": { name: "Santu Basil na Gregori, Bisop na Tisa bilong Sios", rank: "memorial", color: "white" },
  "01-03": { name: "Holi Nem bilong Jisas", rank: "optional", color: "white" },
  "01-07": { name: "Santu Remon bilong Penyafort, Pris", rank: "optional", color: "white" },
  "01-13": { name: "Santu Hilari, Bisop na Tisa bilong Sios", rank: "optional", color: "white" },
  "01-15": { name: "Santu Arnold Janssen, Pris", rank: "memorial", color: "white" },
  "01-17": { name: "Santu Antoni, Abbot", rank: "memorial", color: "white" },
  "01-20": [
    { name: "Santu Febian, Pop na Martir", rank: "optional", color: "red" },
    {
      name: "Santu Sebastian, Martir",
      rank: "optional",
      color: "red",
      properKey: "sanctorale.01-20.sebastian",
    },
  ],
  "01-21": { name: "Santu Agnes, Virgo na Martir", rank: "memorial", color: "red" },
  "01-22": { name: "Santu Vinsen, Diken na Martir", rank: "optional", color: "red" },
  "01-24": { name: "Santu Fransis bilong Sales, Bisop na Tisa bilong Sios", rank: "memorial", color: "white" },
  "01-26": { name: "Santu Timoti na Taitus, Bisop", rank: "memorial", color: "white" },
  "01-27": { name: "Santu Angela Merisi, Virgo", rank: "optional", color: "white" },
  "01-28": { name: "Santu Tomas Akwainas, Pris na Tisa bilong Sios", rank: "memorial", color: "white" },
  "01-31": { name: "Santu Jon Bosko, Pris", rank: "memorial", color: "white" },
  "02-03": [
    { name: "Santu Bles, Bisop na Martir", rank: "optional", color: "red" },
    { name: "Santu Ansgar, Bisop", rank: "optional", color: "white", properKey: "sanctorale.02-03.ansgar" },
  ],
  "02-05": { name: "Santu Agata, Virgo na Martir", rank: "memorial", color: "red" },
  "02-06": { name: "Santu Pol Miki wantaim ol lain Martir bilong Siapan", rank: "memorial", color: "red" },
  "02-08": [
    { name: "Santu Jerom Emiliani", rank: "optional", color: "white" },
    { name: "Santu Josefin Bakhita, Virgo", rank: "optional", color: "white", properKey: "sanctorale.02-08.bakhita" },
  ],
  "02-10": { name: "Santu Skolastika, Virgo", rank: "memorial", color: "white" },
  "02-11": { name: "Santu Maria Virgo bilong Lourdes", rank: "optional", color: "white" },
  "02-14": { name: "Santu Siril, Monk, na Metodius, Bisop", rank: "memorial", color: "white" },
  "02-17": { name: "Ol Sevenpela Santu i bin kirapim Orda bilong ol Servait", rank: "optional", color: "white" },
  "02-21": { name: "Santu Pita Damian, Bisop na Tisa bilong Sios", rank: "optional", color: "white" },
  "02-23": { name: "Santu Polikap, Bisop na Martir", rank: "memorial", color: "red" },
  "02-27": { name: "Santu Gregori bilong Narek, Abbot na Tisa bilong Sios", rank: "optional", color: "white" },
  "03-04": { name: "Santu Kasimir", rank: "optional", color: "white" },
  "03-07": { name: "Santu Perpetua na Felisiti, Martir", rank: "memorial", color: "red" },
  "03-08": { name: "Santu Jon bilong God, Relijis", rank: "optional", color: "white" },
  "03-09": { name: "Santu Franses bilong Rom, Relijis", rank: "optional", color: "white" },
  "03-17": { name: "Santu Petrik, Bisop", rank: "optional", color: "white" },
  "03-18": { name: "Santu Siril bilong Jerusalem, Bisop na Tisa bilong Sios", rank: "optional", color: "white" },
  "03-23": { name: "Santu Turibio Bilong Mongrovejo, Bisop", rank: "optional", color: "white" },
  "04-02": { name: "Santu Fransis bilong Paola, Ermit", rank: "optional", color: "white" },
  "04-04": { name: "Santu Isidor, Bisop na Tisa bilong Sios", rank: "optional", color: "white" },
  "04-05": { name: "Santu Vinsen Ferrer, Pris", rank: "optional", color: "white" },
  "04-07": { name: "Santu Jon Baptis de la Salle, Pris", rank: "memorial", color: "white" },
  "04-11": { name: "Santu Stanislaus, Bisop na Martir", rank: "memorial", color: "red" },
  "04-13": { name: "Santu Martin 1, Pop na Martir", rank: "optional", color: "red" },
  "04-21": { name: "Santu Anselm, Bisop na Tisa bilong Sios", rank: "optional", color: "white" },
  "04-23": [
    { name: "Santu George, Martir", rank: "optional", color: "red" },
    { name: "Santu Adalbert, Bisop na Martir", rank: "optional", color: "red", properKey: "sanctorale.04-23.adalbert" },
  ],
  "04-24": { name: "Santu Fidelis bilong Sigmaringen, Pris na Martir", rank: "optional", color: "red" },
  "04-27": { name: "Santu Luis Maria Grignion de Montfort, Pris", rank: "optional", color: "white" },
  "04-28": { name: "Santu Pita Sanel, Pris na Martir", rank: "memorial", color: "red" },
  "04-29": { name: "Santu Katarina bilong Siena, Virgo na Tisa bilong Sios", rank: "memorial", color: "white" },
  "04-30": { name: "Santu Paius 5, Pop", rank: "optional", color: "white" },
  "05-02": { name: "Santu Atanasius, Bisop na Tisa bilong Sios", rank: "memorial", color: "white" },
  "05-10": { name: "Santu Jon bilong Avila, Pris na Tisa bilong Sios", rank: "optional", color: "white" },
  "05-12": [
    { name: "Santu Nirius na Akilius, Martir", rank: "optional", color: "red" },
    { name: "Santu Pankras, Martir", rank: "optional", color: "red", properKey: "sanctorale.05-12.pancras" },
  ],
  "05-13": { name: "Santu Maria Virgo bilong Fatima", rank: "optional", color: "white" },
  "05-18": { name: "Santu Jon 1, Pop na Martir", rank: "optional", color: "red" },
  "05-20": { name: "Santu Bernardin bilong Siena, Pris", rank: "optional", color: "white" },
  "05-21": { name: "Santu Kristofer Magallanes, Pris, wantaim ol lain Martir", rank: "optional", color: "red" },
  "05-22": { name: "Santu Rita bilong Kaskia, Relijis", rank: "optional", color: "white" },
  "05-24": { name: "Maria, Helpim bilong ol Kristen", rank: "memorial", color: "white" },
  "05-25": [
    { name: "Santu Bid, Pris na Tisa bilong Sios", rank: "optional", color: "white" },
    { name: "Santu Gregori 7, Pop", rank: "optional", color: "white", properKey: "sanctorale.05-25.gregory" },
    { name: "Santu Maria Magdalena de Pazzi, Virgo", rank: "optional", color: "white", properKey: "sanctorale.05-25.pazzi" },
  ],
  "05-26": { name: "Santu Filip Neri, Pris", rank: "memorial", color: "white" },
  "05-27": { name: "Santu Ogastin bilong Kenteberi, Bisop", rank: "optional", color: "white" },
  "05-29": { name: "Santu Pol 6, Pop", rank: "optional", color: "white" },
  "06-01": { name: "Santu Jastin, Martir", rank: "memorial", color: "red" },
  "06-02": { name: "Santu Marselainus na Pita, Martir", rank: "optional", color: "red" },
  "06-03": { name: "Santu Charles Lwanga wantaim ol lain Martir", rank: "memorial", color: "red" },
  "06-05": { name: "Santu Bonifas, Bisop na Martir", rank: "memorial", color: "red" },
  "06-06": { name: "Santu Norbert, Bisop", rank: "optional", color: "white" },
  "06-09": { name: "Santu Efrem, Diken na Tisa bilong Sios", rank: "optional", color: "white" },
  "06-11": { name: "Santu Barnabas, Aposel", rank: "memorial", color: "red" },
  "06-13": { name: "Santu Antoni bilong Padua, Pris na Tisa bilong Sios", rank: "memorial", color: "white" },
  "06-19": { name: "Santu Romuald, Abbot", rank: "optional", color: "white" },
  "06-21": { name: "Santu Alois Gonsaga, Relijis", rank: "memorial", color: "white" },
  "06-22": [
    { name: "Santu Polainus bilong Nola, Bisop", rank: "optional", color: "white" },
    { name: "Santu Jon Fisher, Bisop, na Santu Tomas Mor, Martir", rank: "optional", color: "red", properKey: "sanctorale.06-22.fisher" },
  ],
  "06-27": { name: "Santu Siril bilong Aleksandria, Bisop na Tisa bilong Sios", rank: "optional", color: "white" },
  "06-28": { name: "Santu Irinius, Bisop na Martir", rank: "memorial", color: "red" },
  "06-30": { name: "Namba wan lain Martir bilong holi Sios long Rom", rank: "optional", color: "red" },
  "07-04": { name: "Santu Elisabet bilong Portugal", rank: "optional", color: "white" },
  "07-05": { name: "Santu Antoni Sakaria, Pris", rank: "optional", color: "white" },
  "07-06": { name: "Santu Maria Goretti, Virgo na Martir", rank: "optional", color: "red" },
  "07-09": { name: "Santu Ogastin Sao Rong, Pris, wantaim ol lain Martir", rank: "optional", color: "red" },
  "07-11": { name: "Santu Benedik, Abbot", rank: "memorial", color: "white" },
  "07-13": { name: "Santu Henri", rank: "optional", color: "white" },
  "07-14": { name: "Santu Kamilus bilong Lellis, Pris", rank: "optional", color: "white" },
  "07-15": { name: "Santu Bonaventura, Bisop na Tisa bilong Sios", rank: "memorial", color: "white" },
  "07-16": { name: "Santu Maria Virgo bilong Maunten Karmel", rank: "optional", color: "white" },
  "07-20": { name: "Santu Apollinaris, Bisop na Martir", rank: "optional", color: "red" },
  "07-21": { name: "Santu Lorens bilong Brindisi, Pris na Tisa bilong Sios", rank: "optional", color: "white" },
  "07-23": { name: "Santu Bridget, Relijis", rank: "optional", color: "white" },
  "07-24": { name: "Santu Sarbellus Makhluf, Pris", rank: "optional", color: "white" },
  "07-28": { name: "Santu Maria Virgo, Kwin bilong bel isi", rank: "memorial", color: "white" },
  "07-29": { name: "Santu Marta, Maria na Lasarus", rank: "memorial", color: "white" },
  "07-30": { name: "Santu Pita Krisologus, Bisop na Tisa bilong Sios", rank: "optional", color: "white" },
  "07-31": { name: "Santu Ignesius bilong Loyola, Pris", rank: "memorial", color: "white" },
  "08-01": { name: "Santu Alfons Liguori, Bisop na Tisa bilong Sios", rank: "memorial", color: "white" },
  "08-02": [
    { name: "Santu Oisibius bilong Verselli, Bisop", rank: "optional", color: "white" },
    { name: "Santu Pita Julian Eymard, Pris", rank: "optional", color: "white", properKey: "sanctorale.08-02.eymard" },
  ],
  "08-03": { name: "Santu Dominik, Pris", rank: "memorial", color: "white" },
  "08-04": { name: "Santu Jon Viani, Pris", rank: "memorial", color: "white" },
  "08-05": { name: "Blesing bilong Haus Lotu bilong Santu Maria, long ples Rom", rank: "optional", color: "white" },
  "08-07": { name: "Santu Sikstas 2, Pop na Martir, wantaim ol lain Martir", rank: "optional", color: "red" },
  "08-08": { name: "Santu Mary MacKillop, Relijis", rank: "optional", color: "white" },
  "08-09": { name: "Santu Teresia Benedikta bilong Diwai Kros (Edith Stein), Virgo na Martir", rank: "optional", color: "red" },
  "08-11": { name: "Santu Klara, Virgo", rank: "memorial", color: "white" },
  "08-12": { name: "Santu Jen Franses bilong Santal, Relijis", rank: "optional", color: "white" },
  "08-13": { name: "Santu Ponsian, Pop na Martir, na Santu Hipolitus, Pris na Martir", rank: "optional", color: "red" },
  "08-14": { name: "Santu Maksimilian Kolbe, Pris na Martir", rank: "memorial", color: "red" },
  "08-16": { name: "Santu Stiven bilong Hangari", rank: "optional", color: "white" },
  "08-19": { name: "Santu Jon Eudes, Pris", rank: "optional", color: "white" },
  "08-20": { name: "Santu Bernard, Abbot na Tisa bilong Sios", rank: "memorial", color: "white" },
  "08-21": { name: "Santu Paius 10, Pop", rank: "memorial", color: "white" },
  "08-22": { name: "Santu Maria Virgo Maria em i Kwin", rank: "memorial", color: "white" },
  "08-23": { name: "Santu Rosa bilong Lima, Virgo", rank: "optional", color: "white" },
  "08-25": { name: "Santu Luis", rank: "optional", color: "white" },
  "08-27": { name: "Santu Monika", rank: "memorial", color: "white" },
  "08-28": { name: "Santu Ogastin, Bisop na Tisa bilong Sios", rank: "memorial", color: "white" },
  "08-29": { name: "Pen na Indai bilong Santu Jon bilong Baptais", rank: "memorial", color: "white" },
  "09-03": { name: "Santu Gregori, Pop na Tisa bilong Sios", rank: "memorial", color: "white" },
  "09-05": { name: "Santu Teresa bilong Kolkata, Virgo", rank: "optional", color: "white" },
  "09-09": { name: "Santu Pita Klaver, Pris", rank: "optional", color: "white" },
  "09-12": { name: "Holi Nem bilong Maria", rank: "optional", color: "white" },
  "09-13": { name: "Santu Jon Krisostom, Bisop na Tisa bilong Sios", rank: "memorial", color: "white" },
  "09-15": { name: "Santu Maria Virgo i krai long indai bilong Jisas", rank: "memorial", color: "white" },
  "09-17": { name: "Santu Konilius, Pop na Martir, na Santu Siprian, Bisop na Martir", rank: "optional", color: "red" },
  "09-19": { name: "Santu Januerius, Bisop na Martir", rank: "optional", color: "red" },
  "09-20": { name: "Santu Andru Kim, Pris, na Pol Song Husang, wantaim ol lain Martir", rank: "memorial", color: "red" },
  "09-23": { name: "Santu Pio bilong Pietrelsina, Pris", rank: "memorial", color: "white" },
  "09-25": { name: "Bleset Jon Baptais Masukoni, Pris na Martir", rank: "memorial", color: "red" },
  "09-26": { name: "Santu Kosmas na Demian, Martir", rank: "optional", color: "red" },
  "09-27": { name: "Santu Vinsen de Pol, Pris", rank: "memorial", color: "white" },
  "09-28": [
    { name: "Santu Wenseslaus, Martir", rank: "optional", color: "red" },
    {
      name: "Santu Lorens Ruis wantaim ol lain Martir",
      rank: "optional",
      color: "red",
      properKey: "sanctorale.09-28.ruiz",
    },
  ],
  "09-30": { name: "Santu Jerom, Pris na Tisa bilong Sios", rank: "memorial", color: "white" },
  "10-01": { name: "Santu Teresia bilong Pikinini Jisas, Virgo na Tisa bilong Sios", rank: "memorial", color: "white" },
  "10-02": { name: "Ol Holi Ensel i Lukaut", rank: "memorial", color: "white" },
  "10-04": { name: "Santu Fransis bilong Assisi", rank: "memorial", color: "white" },
  "10-05": { name: "Santu Faustina Kowalska, Virgo", rank: "optional", color: "white" },
  "10-06": { name: "Santu Bruno, Pris", rank: "optional", color: "white" },
  "10-07": { name: "Santu Maria Virgo bilong Pre Rosari", rank: "memorial", color: "white" },
  "10-09": { name: "Santu Denis, Bisop, wantaim ol lain Martir", rank: "optional", color: "red" },
  "10-11": { name: "Santu Jon 23, Pop", rank: "optional", color: "white" },
  "10-14": { name: "Santu Kalistus 1, Pop na Martir", rank: "optional", color: "red" },
  "10-15": { name: "Santu Teresia bilong Jisas, Virgo na Tisa bilong Sios", rank: "memorial", color: "white" },
  "10-16": [
    { name: "Santu Hetwik, Relijis", rank: "optional", color: "white" },
    { name: "Santu Margaret Maria Alakoque, Virgo", rank: "optional", color: "white", properKey: "sanctorale.10-16.alacoque" },
  ],
  "10-17": { name: "Santu Ignesius bilong Antiok, Bisop na Martir", rank: "memorial", color: "red" },
  "10-19": { name: "Santu Jon de Brebeuf na Aisak Joks, Pris na Martir wantaim ol lain Martir", rank: "optional", color: "red" },
  "10-22": { name: "Santu Jon Pol 2, Pop", rank: "optional", color: "white" },
  "10-23": { name: "Santu Jon bilong Kapestrano, Pris", rank: "optional", color: "white" },
  "10-24": { name: "Santu Antoni Klaret, Bisop", rank: "optional", color: "white" },
  "11-03": { name: "Santu Martin de Porres, Relijis", rank: "optional", color: "white" },
  "11-04": { name: "Santu Charles Borromeo, Bisop", rank: "memorial", color: "white" },
  "11-10": { name: "Santu Leo, Pop na Tisa bilong Sios", rank: "memorial", color: "white" },
  "11-11": { name: "Santu Martin bilong Tours, Bisop", rank: "memorial", color: "white" },
  "11-12": { name: "Santu Josafat, Bisop na Martir", rank: "memorial", color: "red" },
  "11-15": { name: "Santu Albert, Bisop na Tisa bilong Sios", rank: "optional", color: "white" },
  "11-16": { name: "Santu Margaret bilong Skotland", rank: "optional", color: "white" },
  "11-17": { name: "Santu Elisabet bilong Hangari, Relijis", rank: "memorial", color: "white" },
  "11-18": { name: "Blesing bilong tupela Haus Lotu bilong Santu Pita na Pol, Aposel, long ples Rom", rank: "optional", color: "red" },
  "11-21": { name: "Papamama i bringim Santu Maria Virgo i go long Tempel", rank: "memorial", color: "white" },
  "11-22": { name: "Santu Sisilia, Virgo na Martir", rank: "memorial", color: "red" },
  "11-23": [
    { name: "Santu Klemens 1, Pop na Martir", rank: "optional", color: "red" },
    { name: "Santu Kolumban, Abbot", rank: "optional", color: "white", properKey: "sanctorale.11-23.columban" },
  ],
  "11-24": { name: "Santu Andru Dung Lak, Pris, wantaim ol lain Martir", rank: "memorial", color: "red" },
  "11-25": { name: "Santu Katarina bilong Aleksandria, Virgo na Martir", rank: "optional", color: "red" },
  "12-03": { name: "Santu Fransis Sevier, Pris", rank: "memorial", color: "white" },
  "12-04": { name: "Santu Jon Damasen, Pris na Tisa bilong Sios", rank: "optional", color: "white" },
  "12-06": { name: "Santu Nikolas, Bisop", rank: "optional", color: "white" },
  "12-07": { name: "Santu Ambros, Pris na Tisa bilong Sios", rank: "memorial", color: "white" },
  "12-09": { name: "Santu Jon Diego Kuauatlatoatsin", rank: "optional", color: "white" },
  "12-10": { name: "Santu Maria Virgo bilong Loreto", rank: "optional", color: "white" },
  "12-11": { name: "Santu Damasus 1, Pop", rank: "optional", color: "white" },
  "12-12": { name: "Santu Maria Virgo bilong Guadalupe", rank: "optional", color: "white" },
  "12-13": { name: "Santu Lusi, Virgo na Martir", rank: "memorial", color: "red" },
  "12-14": { name: "Santu Jon bilong Diwai Kros, Pris na Tisa bilong Sios", rank: "memorial", color: "white" },
  "12-21": { name: "Santu Pita Kanisius, Pris na Tisa bilong Sios", rank: "optional", color: "white" },
  "12-23": { name: "Santu Jon bilong Kenti, Pris", rank: "optional", color: "white" },
  "12-29": { name: "Santu Tomas Beket, Bisop na Martir", rank: "optional", color: "red" },
  "12-31": { name: "Santu Silvesta 1, Pop", rank: "optional", color: "white" },
};

function saintsOn(md: string): Saint[] {
  const v = SAINTS[md];
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export type SaintSearchHit = {
  id: string;
  name: string;
  iso: string;
  rank: Rank;
};

const SEARCH_ALIAS: Record<string, string> = {
  teresa: "teresia",
  teresita: "teresia",
  francis: "fransis",
  francisco: "fransis",
  agustin: "ogastin",
  augustin: "ogastin",
  jose: "josep",
  joseph: "josep",
  pedro: "pita",
  peter: "pita",
  pablo: "pol",
  paul: "pol",
  juan: "jon",
  john: "jon",
  lorenzo: "lorens",
  lawrence: "lorens",
  maximiliano: "maksimilian",
  maximilian: "maksimilian",
  ista: "kirap bek",
  pascua: "kirap bek",
  easter: "kirap bek",
  ramos: "pam",
  palm: "pam",
  pentecostes: "pentikos",
  pentecost: "pentikos",
  pentekos: "pentikos",
  ascension: "asensio",
  asension: "asensio",
  trinidad: "triwan",
  trinity: "triwan",
  triniti: "triwan",
  ceniza: "sit",
  corpus: "bodi",
};

function foldSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchKey(name: string): string {
  return foldSearch(name)
    .replace(
      /\b(santu|bleset|bilong|wantaim|lain|martir|virgo|pris|tisa|sios|bisop|diken|aposel|evangelis|pop|abbot|relijis|monk|ermit)\b/g,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function searchQueries(raw: string): string[] {
  const folded = foldSearch(raw);
  if (!folded) return [];
  const aliased = folded
    .split(" ")
    .filter(Boolean)
    .map((token) => SEARCH_ALIAS[token] ?? token)
    .join(" ");
  return aliased === folded ? [folded] : [folded, aliased];
}

function matchScore(key: string, query: string): number {
  const tokens = query.split(" ");
  const words = key.split(" ");
  if (key === query) return 100;
  if (words.some((word) => word.startsWith(query))) return 80;
  if (query.length >= 4 && new RegExp(`(?:^|\\s)${query}`).test(key)) return 60;
  if (tokens.length > 1 && tokens.every((token) => key.includes(token))) return 50;
  if (tokens.every((token) => words.some((word) => word.startsWith(token)))) return 40;
  return 0;
}

function movableFeasts(year: number): { name: string; id: string; rank: Rank; iso: string; extra: string }[] {
  const easter = easterSunday(year);
  return [
    { name: "Trinde bilong Sit", id: "temporale.ash", rank: "feria", iso: addDays(easter, -46), extra: "ceniza ash wednesday" },
    { name: "Pam Sande", id: "temporale.palm", rank: "solemnity", iso: addDays(easter, -7), extra: "ramos palm sunday" },
    { name: "Las Kaikai bilong Bikpela", id: "temporale.holy-thursday", rank: "solemnity", iso: addDays(easter, -3), extra: "jueves santo holy thursday" },
    { name: "Fraide bilong Pen na Indai bilong Bikpela", id: "temporale.good-friday", rank: "solemnity", iso: addDays(easter, -2), extra: "viernes santo good friday" },
    { name: "Sarere Holi — Ista Vijil", id: "temporale.easter-vigil", rank: "solemnity", iso: addDays(easter, -1), extra: "vigilia pascual easter vigil" },
    { name: "Kirap Bek bilong Bikpela", id: "temporale.easter", rank: "solemnity", iso: easter, extra: "ista pascua easter" },
    { name: "Asensio bilong Bikpela", id: "temporale.ascension", rank: "solemnity", iso: addDays(easter, 39), extra: "ascension asension" },
    { name: "Pentikos", id: "temporale.pentecost", rank: "solemnity", iso: addDays(easter, 49), extra: "pentecostes pentecost pentekos" },
    { name: "Jisas Krais, Hetpris bilong oltaim oltaim", id: "temporale.christ-high-priest", rank: "feast", iso: addDays(easter, 53), extra: "hetpris" },
    { name: "Hol Triwan God", id: "temporale.trinity", rank: "solemnity", iso: addDays(easter, 56), extra: "trinidad trinity triniti" },
    { name: "Bodi na Blut bilong Krais", id: "temporale.corpus", rank: "solemnity", iso: addDays(easter, 60), extra: "corpus christi korpus" },
    { name: "Santu Hat bilong Jisas", id: "temporale.sacred-heart", rank: "solemnity", iso: addDays(easter, 68), extra: "sagrado corazon sacred heart" },
    { name: "Hat bilong Santu Maria Virgo i no gat sin", id: "temporale.immaculate-heart", rank: "memorial", iso: addDays(easter, 69), extra: "inmaculado immaculate heart" },
    { name: "Jisas Krais, King bilong olgeta", id: "temporale.christ-the-king", rank: "solemnity", iso: christTheKing(year), extra: "cristo rey christ the king" },
    { name: "Baptais bilong Bikpela", id: "temporale.baptism", rank: "feast", iso: baptismOfTheLord(year), extra: "bautismo baptism" },
    { name: "Holi Famili", id: "temporale.holy-family", rank: "feast", iso: holyFamilyDate(year), extra: "sagrada familia holy family" },
  ];
}

/** Saints and movable feasts of `year` whose name matches, best first. */
export function searchSaints(raw: string, year: number): SaintSearchHit[] {
  const queries = searchQueries(raw).filter((query) => query.length >= 2);
  if (!queries.length) return [];
  const hits: { hit: SaintSearchHit; score: number }[] = [];
  const add = (name: string, extra: string, id: string, rank: Rank, iso: string) => {
    const key = searchKey(`${name} ${extra}`);
    if (!key) return;
    const score = Math.max(...queries.map((query) => matchScore(key, query)));
    if (!score) return;
    hits.push({ hit: { id, name, iso, rank }, score });
  };
  for (const [md, value] of Object.entries(SAINTS)) {
    for (const saint of Array.isArray(value) ? value : [value]) {
      add(saint.name, "", saintProperId(md, saint), saint.rank, `${year}-${md}`);
    }
  }
  for (const feast of movableFeasts(year)) {
    add(feast.name, feast.extra, feast.id, feast.rank, feast.iso);
  }
  hits.sort((a, b) => b.score - a.score || a.hit.iso.localeCompare(b.hit.iso) || a.hit.name.localeCompare(b.hit.name));
  return hits.slice(0, 40).map((item) => item.hit);
}

function lastSaturdayOfMay(year: number): string {
  for (let d = 31; d >= 25; d--) {
    const iso = `${year}-05-${String(d).padStart(2, "0")}`;
    if (weekdayOf(iso) === 6) return iso;
  }
  return `${year}-05-31`;
}

/** World Mission Sunday is the second-to-last Sunday of October, not the last. */
function penultimateOctoberSunday(year: number): string {
  const lastSunday = 31 - weekdayOf(`${year}-10-31`);
  return `${year}-10-${String(lastSunday - 7).padStart(2, "0")}`;
}

function saintProperId(md: string, saint: Saint): string {
  return saint.properKey ?? `sanctorale.${md}`;
}

type SaintUse = "auto" | "option" | "none";

function classifySaint(
  saint: Saint,
  iso: string,
  season: Season,
  isSunday: boolean,
  privileged: boolean,
  currentRank: Rank,
): SaintUse {
  if (privileged) return "none";
  if (saint.rank === "solemnity") {
    if (isSunday && (season === "advent" || season === "lent" || season === "easter")) return "none";
    if (currentRank === "solemnity") return "none";
    return "auto";
  }
  if (saint.rank === "feast") {
    if (isSunday) {
      if (saint.ofTheLord && (season === "ordinary" || season === "christmas") && currentRank !== "solemnity") {
        return "auto";
      }
      return "none";
    }
    if (currentRank === "solemnity" || currentRank === "feast") return "none";
    return "auto";
  }
  if (saint.rank === "memorial" || saint.rank === "optional") {
    if (isSunday) return "none";
    if (currentRank === "solemnity" || currentRank === "feast" || currentRank === "memorial") return "none";
    const { m, d } = parseYmd(iso);
    const optionalOnly = season === "lent" || (season === "advent" && m === 12 && d >= 17);
    if (saint.rank === "memorial" && !optionalOnly) return "auto";
    return "option";
  }
  if (saint.name.includes("dai pinis") && !isSunday && currentRank !== "solemnity" && currentRank !== "feast") {
    return "auto";
  }
  return "none";
}

function isSundayOfSeason(properId: string): boolean {
  if (properId.startsWith("png.")) return true;
  return /^temporale\.(ordinary|advent|lent|easter|christmas)\.[\w-]+\.sun$/.test(properId);
}

export function rankLabelTpi(rank: Rank, properId: string): string | null {
  if (rank === "feria" || rank === "optional") return null;
  if (rank === "feast" && isSundayOfSeason(properId)) return null;
  const label = RANK_TPI[rank];
  return label || null;
}

function ordinaryWeek(iso: string, year: number): number {
  const easter = easterSunday(year);
  const ash = addDays(easter, -46);
  const baptism = baptismOfTheLord(year);
  const thisSun = sundayOnOrBefore(iso);
  if (iso < ash) {
    const sunB = sundayOnOrBefore(baptism);
    return Math.max(1, weeksBetween(sunB, thisSun) + 1);
  }
  const king = christTheKing(year);
  return Math.min(34, Math.max(1, 34 - weeksBetween(thisSun, king)));
}

function seasonOf(iso: string, year: number): { season: Season; week: number | null; color: LitColor } {
  const easter = easterSunday(year);
  const ash = addDays(easter, -46);
  const palm = addDays(easter, -7);
  const pentecost = addDays(easter, 49);
  const advent = firstAdvent(year);
  const baptism = baptismOfTheLord(year);
  const gaudete = addDays(advent, 14);
  const firstLentSun = addDays(ash, 4);
  const laetare = addDays(firstLentSun, 21);

  if (iso >= advent && iso < `${year}-12-25`) {
    const w = weeksBetween(advent, sundayOnOrBefore(iso)) + 1;
    return { season: "advent", week: w, color: iso === gaudete ? "rose" : "violet" };
  }
  if (iso >= `${year}-12-25` || iso < baptism) {
    return { season: "christmas", week: null, color: "white" };
  }
  if (iso >= ash && iso < easter) {
    if (iso >= palm) {
      return { season: "lent", week: 6, color: iso === palm ? "red" : "violet" };
    }
    const w = weeksBetween(firstLentSun, sundayOnOrBefore(iso)) + 1;
    return { season: "lent", week: Math.max(0, w), color: iso === laetare ? "rose" : "violet" };
  }
  if (iso >= easter && iso <= pentecost) {
    const w = weeksBetween(easter, sundayOnOrBefore(iso)) + 1;
    return { season: "easter", week: w, color: iso === pentecost ? "red" : "white" };
  }
  return { season: "ordinary", week: ordinaryWeek(iso, year), color: "green" };
}

function feriaTitle(iso: string, week: number | null, season: Season): string {
  const wd = WEEKDAYS_TPI[weekdayOf(iso)] ?? "De";
  if (season === "lent" && week === 0) return `${wd} bihain long Trinde bilong Sit`;
  if (week) return `${wd}, wik ${week} long ${SEASON_TPI[season]}`;
  return `${wd} long ${SEASON_TPI[season]}`;
}

function sundayTitle(week: number | null, season: Season): string {
  if (week) return `Sande ${week} long ${SEASON_TPI[season]}`;
  return `Sande long ${SEASON_TPI[season]}`;
}

function weekdayKey(iso: string): string {
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][weekdayOf(iso)] ?? "feria";
}

export function resolveDay(iso: string, celebrateId?: string | null): LiturgicalDay {
  const { y, m, d } = parseYmd(iso);
  const litYear = liturgicalYear(iso);
  const easter = easterSunday(y);
  const ash = addDays(easter, -46);
  const palm = addDays(easter, -7);
  const holyThu = addDays(easter, -3);
  const goodFri = addDays(easter, -2);
  const holySat = addDays(easter, -1);
  const pentecost = addDays(easter, 49);
  const trinity = addDays(easter, 56);
  const corpus = addDays(easter, 60);
  const sacredHeart = addDays(easter, 68);
  const king = christTheKing(y);
  const baptism = baptismOfTheLord(y);
  const family = holyFamilyDate(iso >= `${y}-12-25` ? y : y - 1);
  const isTriduum = iso >= holyThu && iso <= easter;
  const holyWeek = iso > palm && iso < holyThu;
  const easterOctave = iso > easter && iso < addDays(easter, 8);
  const privileged = isTriduum || holyWeek || easterOctave || iso === ash || iso === palm || iso === easter || iso === pentecost;

  const wd = weekdayOf(iso);
  const isSunday = wd === 0;
  const pack = seasonOf(iso, y);

  let title = isSunday ? sundayTitle(pack.week, pack.season) : feriaTitle(iso, pack.week, pack.season);
  let rank: Rank = "feria";
  let color = pack.color;
  let gloria = false;
  let creed = false;
  let properId = `temporale.${pack.season}.${pack.week ?? 0}.${weekdayKey(iso)}`;

  if (isSunday) {
    creed = true;
    if (pack.season !== "lent" && pack.season !== "advent") gloria = true;
  }

  const apply = (
    nextTitle: string,
    nextRank: Rank,
    nextColor: LitColor,
    nextGloria: boolean,
    nextCreed: boolean,
    nextProper: string,
  ) => {
    title = nextTitle;
    rank = nextRank;
    color = nextColor;
    gloria = nextGloria;
    creed = nextCreed;
    properId = nextProper;
  };

  if (iso === easter) {
    apply("Kirap Bek bilong Bikpela", "solemnity", "white", true, true, "temporale.easter");
  } else if (iso === pentecost) {
    apply("Pentikos", "solemnity", "red", true, true, "temporale.pentecost");
  } else if (iso === addDays(pentecost, 4)) {
    apply("Jisas Krais, Hetpris bilong oltaim oltaim", "feast", "white", true, false, "temporale.christ-high-priest");
  } else if (iso === trinity) {
    apply("Hol Triwan God", "solemnity", "white", true, true, "temporale.trinity");
  } else if (iso === corpus) {
    apply("Bodi na Blut bilong Krais", "solemnity", "white", true, true, "temporale.corpus");
  } else if (iso === sacredHeart) {
    apply("Santu Hat bilong Jisas", "solemnity", "white", true, true, "temporale.sacred-heart");
  } else if (iso === addDays(sacredHeart, 1)) {
    apply("Hat bilong Santu Maria Virgo i no gat sin", "memorial", "white", false, false, "temporale.immaculate-heart");
  } else if (iso === addDays(easter, 39)) {
    apply("Asensio bilong Bikpela", "solemnity", "white", true, true, "temporale.ascension");
  } else if (iso === palm) {
    apply("Pam Sande", "solemnity", "red", false, true, "temporale.palm");
  } else if (iso === holyThu) {
    apply("Las Kaikai bilong Bikpela", "solemnity", "white", true, false, "temporale.holy-thursday");
  } else if (iso === goodFri) {
    apply("Fraide bilong Pen na Indai bilong Bikpela", "solemnity", "red", false, false, "temporale.good-friday");
  } else if (iso === holySat) {
    apply("Sarere Holi — Ista Vijil", "solemnity", "white", true, false, "temporale.easter-vigil");
  } else if (iso === ash) {
    apply("Trinde bilong Sit", "feria", "violet", false, false, "temporale.ash");
  } else if (iso === king && isSunday) {
    apply("Jisas Krais, King bilong olgeta", "solemnity", "white", true, true, "temporale.christ-the-king");
  } else if (iso === baptism) {
    apply("Baptais bilong Bikpela", "feast", "white", true, isSunday, "temporale.baptism");
  } else if (iso === family) {
    apply("Holi Famili", "feast", "white", true, isSunday, "temporale.holy-family");
  } else if (
    isSunday &&
    pack.season === "christmas" &&
    iso > `${y}-01-01` &&
    iso < `${y}-01-06`
  ) {
    apply("Sande 2 bihain long Krismas", "feria", "white", true, true, "temporale.christmas.2.sun");
  } else if (easterOctave) {
    title = isSunday ? "Sande 2 long Taim Bilong Ista" : feriaTitle(iso, 1, "easter");
    rank = "solemnity";
    color = "white";
    gloria = true;
    creed = true;
    properId = `temporale.easter-octave.${weekdayKey(iso)}`;
  }

  if (
    pack.season === "advent" &&
    m === 12 &&
    d >= 17 &&
    d <= 24 &&
    !isSunday &&
    rank === "feria"
  ) {
    properId = `temporale.advent.12-${String(d).padStart(2, "0")}`;
    title = `${d} Desemba`;
  }

  if (pack.season === "christmas" && m === 12 && d >= 29 && d <= 31 && rank === "feria") {
    properId = `temporale.christmas.12-${String(d).padStart(2, "0")}`;
    title = `${d} Desemba`;
  }

  if (isSunday && pack.season === "ordinary" && rank === "feria") {
    if (m === 8 && d <= 7) {
      apply("Baibel Sande", "feria", pack.color, true, true, "png.bible-sunday");
    } else if (iso === penultimateOctoberSunday(y)) {
      apply("Misin Sande", "feria", pack.color, true, true, "png.mission-sunday");
    }
  }

  const key = `${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const listed = saintsOn(key);
  const classified = listed.map((saint) => ({
    saint,
    use: classifySaint(saint, iso, pack.season, isSunday, privileged, rank),
    id: saintProperId(key, saint),
  }));
  const autos = classified.filter((c) => c.use === "auto");
  const optionals = classified.filter((c) => c.use === "option");

  const applySaint = (saint: Saint, asOptional: boolean) => {
    const nextRank: Rank =
      asOptional && (saint.rank === "memorial" || saint.rank === "optional")
        ? "optional"
        : saint.rank;
    const saintGloria = saint.rank === "solemnity" || saint.rank === "feast";
    const saintCreed = saint.rank === "solemnity" || (isSunday && saintGloria);
    apply(saint.name, nextRank, saint.color, saintGloria, saintCreed, saintProperId(key, saint));
    if (saint.rank === "feria") gloria = false;
  };

  let options: CelebrationChoice[] = [];
  let celebratedId = FERIA_CELEBRATION;

  if (autos.length) {
    const pick = autos[0]!;
    applySaint(pick.saint, false);
    celebratedId = pick.id;
  } else if (optionals.length) {
    const feriaChoice: CelebrationChoice = {
      id: FERIA_CELEBRATION,
      titleTpi: title,
      rank: "feria",
    };
    options = [
      feriaChoice,
      ...optionals.map((c) => ({
        id: c.id,
        titleTpi: c.saint.name,
        rank: "optional" as const,
      })),
    ];
    const wanted = celebrateId && optionals.find((c) => c.id === celebrateId);
    if (wanted) {
      applySaint(wanted.saint, true);
      celebratedId = wanted.id;
    } else {
      celebratedId = FERIA_CELEBRATION;
    }
  }

  const dayRank: string = rank;
  const votiveOk =
    autos.length === 0 && dayRank !== "solemnity" && dayRank !== "feast" && dayRank !== "memorial";
  const offer = (id: string, titleTpi: string) => {
    if (!votiveOk) return;
    const choice: CelebrationChoice = { id, titleTpi, rank: "optional" };
    if (!options.length) {
      options = [{ id: FERIA_CELEBRATION, titleTpi: title, rank: "feria" }, choice];
    } else if (!options.some((opt) => opt.id === id)) {
      options = [...options, choice];
    }
    if (celebrateId === id) {
      apply(titleTpi, "optional", "white", false, false, id);
      celebratedId = id;
    }
  };
  if (wd === 5 && d <= 7 && pack.season === "ordinary") {
    offer("m1130-116", "Namba Wan Fraide bilong Mun: Santu Hat bilong Jisas");
  }
  if (wd === 6 && d <= 7 && pack.season === "ordinary") {
    offer("temporale.immaculate-heart", "Namba Wan Sarere bilong Mun: Hat bilong Santu Maria Virgo i no gat sin");
  }
  if (m === 5 && wd === 6 && d <= 7) {
    offer("m1144-121", "Santu Maria Virgo, Sta bilong Solwara");
  }
  if (iso === lastSaturdayOfMay(y)) {
    offer("m1144-122", "Santu Maria Virgo, Meri bilong Santu Hat");
  }

  const rankNow: string = rank;
  const marySaturday =
    wd === 6 &&
    pack.season === "ordinary" &&
    !privileged &&
    autos.length === 0 &&
    rankNow !== "solemnity" &&
    rankNow !== "feast" &&
    rankNow !== "memorial";
  if (marySaturday) {
    const mary = {
      id: "votiv.mary-saturday",
      titleTpi: "Misa bilong Santu Maria Virgo",
      rank: "optional" as const,
    };
    if (!options.length) {
      options = [{ id: FERIA_CELEBRATION, titleTpi: title, rank: "feria" }, mary];
    } else if (!options.some((opt) => opt.id === mary.id)) {
      options = [...options, mary];
    }
    if (celebrateId === mary.id) {
      apply(mary.titleTpi, "optional", "white", false, false, mary.id);
      celebratedId = mary.id;
    }
  }

  if (key === "12-25") {
    title = "Krismas bilong Bikpela";
    rank = "solemnity";
    color = "white";
    gloria = true;
    creed = true;
    const masses: CelebrationChoice[] = [
      { id: "christmas.vigil", titleTpi: "Misa long Vijil", rank: "solemnity" },
      { id: "christmas.night", titleTpi: "Misa bilong Nait", rank: "solemnity" },
      { id: "christmas.dawn", titleTpi: "Misa bilong Moning Taim", rank: "solemnity" },
      { id: "christmas.day", titleTpi: "Misa long Taim bilong San", rank: "solemnity" },
    ];
    options = masses;
    const picked = masses.find((item) => item.id === celebrateId) ?? masses[3]!;
    properId = picked.id;
    celebratedId = picked.id;
  }

  if (key === "11-02") {
    title = "De bilong tingim olgeta bilipmanmeri i dai pinis";
    rank = "feria";
    color = "violet";
    gloria = false;
    creed = false;
    const masses: CelebrationChoice[] = [
      { id: "sanctorale.11-02", titleTpi: "Misa 1", rank: "feria" },
      { id: "sanctorale.11-02.2", titleTpi: "Misa 2", rank: "feria" },
      { id: "sanctorale.11-02.3", titleTpi: "Misa 3", rank: "feria" },
    ];
    options = masses;
    const picked = masses.find((item) => item.id === celebrateId) ?? masses[0]!;
    properId = picked.id;
    celebratedId = picked.id;
  }

  const vigilOf: Record<string, string> = {
    "sanctorale.01-06": "epiphany.vigil",
    "temporale.epiphany": "epiphany.vigil",
    "temporale.ascension": "ascension.vigil",
    "temporale.pentecost": "temporale.pentecost-vigil",
    "sanctorale.06-24": "sanctorale.06-24.vigil",
    "sanctorale.06-29": "sanctorale.06-29.vigil",
    "sanctorale.08-15": "sanctorale.08-15.vigil",
  };
  const vigilId = vigilOf[properId] ?? (celebrateId && Object.values(vigilOf).includes(celebrateId) ? celebrateId : null);
  if (vigilId) {
    const dayId =
      vigilOf[properId] === vigilId
        ? properId
        : (Object.entries(vigilOf).find(([, id]) => id === vigilId)?.[0] ?? properId);
    const masses: CelebrationChoice[] = [
      { id: vigilId, titleTpi: "Misa long Vijil", rank: "solemnity" },
      { id: dayId, titleTpi: "Misa bilong Pestode", rank: "solemnity" },
    ];
    options = masses;
    const picked = masses.find((item) => item.id === celebrateId) ?? masses[1]!;
    properId = picked.id;
    celebratedId = picked.id;
  }

  const sundayCycle = sundayCycleFor(litYear);
  const weekdayCycle: WeekdayCycle = litYear % 2 === 0 ? "II" : "I";
  const rankLine = rankLabelTpi(rank, properId);
  const subtitleTpi = [rankLine, SEASON_TPI[pack.season], `${COLOR_TPI[color]} klos`]
    .filter(Boolean)
    .join(" · ");

  return {
    date: iso,
    weekday: wd,
    season: pack.season,
    week: pack.week,
    rank,
    color,
    titleTpi: title,
    subtitleTpi,
    metaTpi: `Yia ${sundayCycle} · Wikde ${weekdayCycle === "I" ? "1" : "2"}`,
    properId,
    sundayCycle,
    weekdayCycle,
    gloria,
    creed,
    alleluia: pack.season !== "lent",
    isSunday,
    isTriduum,
    options,
    celebratedId,
  };
}
