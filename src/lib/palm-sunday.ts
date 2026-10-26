import type { SundayCycle } from "./calendar";
import type { MassLine } from "./ordo";

const rub = (text: string): MassLine => ({ voice: "rubric", text });
const priest = (text: string): MassLine => ({ voice: "priest", text });
const people = (text: string): MassLine => ({ voice: "people", text });
const prayer = (text: string): MassLine => ({ voice: "priest", text, variant: "oration" });
const sung = (text: string): MassLine => ({ voice: "together", text });
const reading = (text: string): MassLine => ({ voice: "reading", text, variant: "gospel" });
const head = (label: string, citation = ""): MassLine => ({ voice: "cite", label, text: citation });

const GOSPEL_A = "Jisas wantaim ol disaipel bilong em i kamap klostu long Jerusalem, na ol i kamap long ples Betfage long maunten Oliv. Na Jisas i salim tupela disaipel na em i tokim tupela olsem, “Yutupela go long dispela ples nau yumi lukluk long em. Na wantu bai yutupela i lukim wanpela donki ol i pasim i stap, na pikinini bilong em i stap wantaim em. Lusim rop na bringim tupela i kam long mi. Na sapos wanpela man i mekim wanpela tok long yutupela, orait yutupela i mas tok olsem, ‘Bikpela i gat wok long tupela. Na kwiktaim bai em i salim tupela i kam bek.’“ Dispela samting i kamap bilong inapim dispela tok profet i bin mekim bipo, “Autim dispela tok long ol manmeri bilong Saion, ‘Lukim. King bilong yupela em i kam nau. Em i kam olsem man i no gat nem, na em i sindaun antap long wanpela donki. Em i sindaun long yangpela donki na i kam.’“ Orait tupela disaipel i go mekim olsem Jisas i bin tokim tupela. Tupela i bringim donki mama wantaim pikinini bilong em, na tupela i putim longpela klos bilong tupela antap long tupela donki. Na Jisas i sindaun antap. Na planti manmeri ol i rausim longpela klos bilong ol na lainim long rot. Na sampela i katim ol han bilong diwai na putim long rot. Na ol manmeri i wokabaut i go paslain long Jisas wantaim ol manmeri i wokabaut i kam bihain, olgeta i wok long singaut olsem, “Hosana long Pikinini Bilong Devit. God i ken mekim gut long dispela man i kam long nem bilong Bikpela. Litimapim nem bilong God Antap Tru.” Jisas i go insait long Jerusalem, na olgeta manmeri bilong taun i kirap nogut na i askim nabaut olsem, “Dispela man em i husat tru?” Na ol manmeri i wokabaut ol i tok, “Em Jisas, em profet i kam long taun Nasaret long Galili.”";
const GOSPEL_B = "Jisas wantaim ol disaipel bilong em i kamap klostu long Jerusalem, na ol i kamap long ples Betfage na Betani, long maunten Oliv. Na Jisas i salim tupela disaipel na i tokim tupela olsem, “Yutupela go long dispela ples nau yumi lukluk long em. Yutupela go long dispela ples, na wantu bai yutupela i lukim wanpela yangpela donki ol i pasim i stap. I no gat wanpela man i bin sindaun long em bipo. Lusim rop na bringim donki i kam. Na sapos wanpela man i askim yutupela, ‘Bilong wanem yutupela i kisim donki i go?’, yutupela i mas bekim tok olsem, ‘Bikpela i gat wok long em, na em bai i salim i kam bek kwiktaim.’“ Orait tupela i go, na tupela i lukim wanpela yangpela donki i sanap i stap long rot. Ol man i bin pasim dispela donki i stap klostu long dua bilong wanpela haus. Orait tupela i lusim rop long em. Na ol man i sanap klostu ol i askim tupela olsem, “Yutupela i laik mekim wanem na yutupela i lusim dispela donki?” Na tupela i bekim tok olsem Jisas i bin tokim tupela. Na ol i orait long tupela i ken kisim donki i go. Orait tupela i bringim donki i kam long Jisas. Na tupela i putim longpela klos bilong tupela antap long em, na Jisas i sindaun long em. Na planti manmeri i rausim longpela klos bilong ol na lainim long rot. Na sampela i go long gaden na katim ol han bilong diwai na putim long rot. Na ol manmeri i wokabaut i go paslain long Jisas wantaim ol manmeri i wokabaut i kam bihain, olgeta i wok long singaut olsem, “Hosana long God. God i ken mekim gut long dispela man i kam long nem bilong Bikpela. God i ken mekim gut long dispela king i laik bosim yumi nau, em king i kam long lain bilong tumbuna bilong yumi, Devit. Hosana long God Antap Tru!”";
const GOSPEL_B2 = "Bikpela lain manmeri i kam i stap long Jerusalem bilong lukim ol bikpela de bilong lotu. Na long de bihain long Jisas i bin kaikai long haus bilong Lasarus, ol manmeri i harim tok olsem, klostu Jisas i laik kamap long Jerusalem. Olsem na ol i kisim ol han bilong diwai pam na ol i go bungim em long rot. Na ol i singaut olsem, “Hosana long God. God i ken mekim gut long dispela man i kam long nem bilong Bikpela. Em i king bilong Israel.” Na Jisas i kisim wanpela donki na i sindaun long en. Em i olsem tok i stap long buk bilong God, “Yupela ol manmeri bilong taun Saion, yupela i no ken pret. Lukim. King bilong yupela em i kam nau. Em i sindaun long yangpela donki na i kam.” Pastaim ol disaipel bilong em ol i no save long as bilong dispela tok. Tasol bihain long God i givim biknem pinis long Jisas, ol i tingim dispela tok i stap long buk bilong God, na ol i save, em i tok long Jisas stret. Na ol i tingim gen dispela samting ol manmeri i bin mekim long em.";
const GOSPEL_C = "Jisas i statim gen wokabaut bilong em, na i bihainim rot i go antap long Jerusalem. Jisas i kamap klostu long ples Betfage na Betani, long maunten ol i kolim Oliv, na em i salim tupela disaipel na i tokim tupela olsem, “Yutupela go long dispela ples i stap long hap. Yutupela go long dispela ples, na bai yutupela i lukim wanpela yangpela donki ol i pasim i stap. I no gat wanpela man i bin sindaun long em bipo. Lusim rop na bringim donki i kam hia. Na sapos wanpela man i askim yutupela olsem, ‘Bilong wanem yutupela i lusim dispela donki?’, orait yutupela i mas bekim tok bilong em olsem, ‘Bikpela i gat wok long em.’“ Jisas i salim tupela, na tupela i go, na tupela i lukim olgeta samting i stap olsem em i bin tokim tupela. Tupela i wok long lusim rop bilong dispela donki, na ol papa bilong em ol i askim tupela olsem, “Bilong wanem yutupela i lusim dispela donki?” Na tupela i tok, “Bikpela i gat wok long em.” Orait tupela i bringim donki i kam long Jisas. Na tupela i putim longpela klos bilong tupela antap long donki. Na ol i helpim Jisas long sindaun antap. Em i sindaun long donki na i go, na ol manmeri i rausim longpela klos bilong ol na lainim long rot. Em i kam klostu pinis long hap rot i lusim maunten Oliv na i go daun. Na ol bikpela lain disaipel bilong em i stat long amamas. Ol i ting long olgeta mirakel ol i bin lukim, na ol i singaut strong, na ol i litimapim nem bilong God. Ol i singaut olsem, “God i ken mekim gut long dispela king i kam long nem bilong Bikpela. Litimapim nem bilong God Antap Tru! Em i mekim yumi manmeri i stap bel isi.” Na sampela Farisi ol i stap insait long dispela bikpela lain manmeri, ol i tokim Jisas olsem, “Tisa, yu mas krosim ol dispela disaipel bilong yu. Ol i no ken mekim dispela kain tok.” Na em i bekim tok olsem, “Mi tokim yupela, sapos ol i pasim maus, ol ston yet bai i singaut na litimapim nem bilong God.”";

const AMEN: MassLine[] = [rub("Ol:"), people("Amen.")];

const WELCOME = `Dia ol bratasusa,
long bigin bilong taim bilong Lent i kam inap nau,
yumi bin redim yumi yet
wantaim ol wok penans na ol wok marimari.
Tude yumi bung wantaim Sios long olgeta hap bilong graun,
na yumi statim dispela taim
bilong tingim misteri bilong Pasova bilong Bikpela Jisas Krais.
Yumi min long Pen na Indai na Kirap Bek bilong em.
Long wanem, em i go insait long taun Jerusalem
bilong inapim dispela wok Ridima bilong em.
Olsem na wantaim bikpela bilip na laik,
yumi tingim Bikpela bilong yumi
i go insait long taun Jerusalem
bilong kisim bek yumi.
Na yumi bihainim lekmak bilong em,
bai long grasia bilong em yet,
yumi ken bihainim em long rot i go long Diwai Kros.
Na bihain yumi ken bihainim em
long rot i go long Kirap Bek, na long laip bilong oltaim.`;

const BLESS_1 = `God, yu strong olgeta na yu stap oltaim,
long blesing bilong yu,
mekim holi ✠ ol dispela han bilong diwai.
Nau mipela i amamas long bihainim Krais,
em i King bilong mipela.
Helpim mipela, bai wanpela de
mipela i ken kamap long Jerusalem bilong heven.
Em i stap laip na em i King, nau na oltaim.`;

const BLESS_2 = `God, strongim bilip bilong ol manmeri i hop long yu.
Marimari long ol, na harim ol pre bilong ol.
Tude mipela i karim ol han bilong diwai,
long wanem, mipela i laik onarim Krais i win.
Helpim mipela long onarim yu oltaim
long ol gutpela wok bilong mipela.
Em i stap laip na em i King, nau na oltaim.`;

const WALK = `Dia ol bratasusa,
ol manmeri bilong Jerusalem i bin singsing ona long Jisas.
Olsem na nau yumi tu i laik bihainim pasin bilong ol,
na yumi wokabaut wantaim bel isi.`;

const ANT_1 = `Ol pikinini bilong ol Juda, ol i karim lip bilong diwai oliv.
Ol i go lukim Bikpela, ol i singaut na ol i tok:
Hosana long God i stap antap.`;

const PS24 = [
`Dispela graun wantaim olgeta samting i stap long em,
em i bilong Bikpela tasol.
Olgeta ples na olgeta manmeri i stap long ol,
ol tu i bilong em.
Em yet i bin wokim graun antap long solwara,
na em i wokim graun i sanap strong namel long ol raunwara.`,
`Husat inap long i go antap long maunten bilong Bikpela?
Husat inap i go insait long haus holi bilong em?
Man bilong stretpela pasin na klinpela hat,
na man i no save givim em yet long ol samting bilong graun,
na man i no save giaman na tok tru antap nating.`,
`Em bai i kisim ol blesing bilong Bikpela.
Na God bai i kisim bek em,
long wanem, God em i Sevia bilong em.
Kain man olsem i save wok long painim God.
Ol i save wok long lukim pes bilong God bilong Jekop.`,
`Yupela ol dua bilong bipo, yupela op bikpela,
bai King bilong glori i ken i go insait.
Husat em i King bilong glori?
Bikpela em i King bilong glori.
Em i gat bikpela strong na pawa.
Bikpela em i strong long pait.`,
`Yupela ol dua bilong bipo, yupela op bikpela,
bai King bilong glori i ken i go insait.
Husat em i King bilong glori?
Bikpela em i King bilong glori,
na em i Bikpela i gat olgeta strong.`,
];

const ANT_2 = `Ol pikinini bilong ol Juda i putim ol laplap long rot,
ol i singaut na tok: Hosana long Pikinini bilong Devit.
God i ken mekim gut long em i kam long nem bilong Bikpela.`;

const PS47 = [
`Yupela olgeta lain pipel, yupela paitim han.
Yupela singaut amamas long God.
Long wanem, Bikpela, em i God Antap Tru,
na em i nambawan King na i bosim olgeta manmeri bilong graun.`,
`Em i daunim olgeta pipel na olgeta lain manmeri,
na em i mekim ol arapela lain i stap aninit long yumi.
Em yet i bin makim wanpela graun na i givim pinis long yumi.
Yumi lain bilong Jekop, na em i laikim yumi tru.
Bikpela i go antap, na ol manmeri i amamas na winim biugel wantaim.`,
`Yumi singsing amamas long nem bilong God.
Yumi singsing amamas long King bilong yumi.
God em i King bilong olgeta hap bilong graun.
Yumi mas singim song bilong litimapim nem bilong em,
wantaim olgeta strong bilong yumi.`,
`God em i King na i bosim olgeta lain manmeri.
God i sindaun long holi sia King bilong em.
Olgeta hetman bilong ol lain manmeri
i bung wantaim ol pipel bilong lain bilong God bilong Abraham.
Long wanem, olgeta hetman bilong graun i stap aninit long God.
Em yet i stap antap long ol.`,
];

const GLORIA_KING = "Glori na ona na biknem long yu, Krais, King na Ridima bilong mipela.";

const KING_VERSES = [
`Ol pikinini i amamas na singsing Hosana long yu.`,
`Yu King bilong Israel. Yu King i kam long lain bilong Devit.
Yu King i kam long nem bilong Bikpela.`,
`Ol lain bilong heven i bung wantaim
na singim song bilong litimapim nem bilong yu.
Na ol man na meri na olgeta samting bilong graun
i singsing wantaim ol.`,
`Ol Juda i holim han bilong diwai,
na ol i kam bungim yu long rot.
Mipela tu i kam long bungim yu
wantaim ol beten na ol singsing bilong mipela.`,
`Taim Pen na Indai bilong yu i wok long kam klostu,
ol Juda i litimapim nem bilong yu.
Nau yu stap pinis long Kingdom bilong yu long heven,
na mipela tu i laik litimapim nem bilong yu.`,
`Yu bin amamas long pasin bilong ol Juda.
Olsem na nau yu ken amamas long pasin bilong mipela tu.
Yu gutpela King, na yu pulap long marimari.
Yu save laikim olgeta samting i gutpela na i stret.`,
];

const ENTER_VERSES = [
`Taim Bikpela i go insait long taun holi,
ol pikinini bilong ol Juda i singsing amamas long kirap bilong laip.`,
`Taim ol manmeri i harim olsem Jisas i redi long i go insait long Jerusalem,
ol i go bungim em long rot.`,
];

const ENTER_ANSWER = `Ol i holim han bilong diwai,
na ol i singaut: Hosana long God i stap antap.`;

const SIMPLE_VERSES = `Sikspela de pastaim long Pasova,
taim Bikpela i go insait long taun Jerusalem,
ol pikinini i ran i go bungim em.
Ol i holim han bilong diwai long han bilong ol,
na ol i singaut strong olsem:`;

const SIMPLE_ANSWER = `Hosana long God i stap antap. God i ken blesim yu,
long wanem, yu pulap long marimari, na yu kam long mipela.`;

const SIMPLE_PSALM = `Yupela ol dua bilong bipo, yupela op bikpela,
bai King bilong glori i ken i go insait.
Husat em i King bilong glori?
Bikpela em i King bilong glori,
na em i Bikpela i gat olgeta strong.`;

function psalm(stanzas: string[]): MassLine[] {
  const out: MassLine[] = [];
  stanzas.forEach((stanza, i) => {
    out.push(sung(stanza));
    if (i < stanzas.length - 1) out.push(rub("(Kolim Antipon gen)"));
  });
  out.push(rub("(Kolim Antipon gen)"));
  return out;
}

function kingHymn(): MassLine[] {
  const out: MassLine[] = [
    head("Song bilong Krais i King"),
    rub("Lain bilong singsing:"),
    sung(GLORIA_KING),
  ];
  for (const verse of KING_VERSES) {
    out.push(rub("Lain bilong singsing:"), sung(verse), rub("Ol:"), people(GLORIA_KING));
  }
  return out;
}

function entranceGospel(year: SundayCycle): MassLine[] {
  const one = (label: string, cite: string, who: string, text: string): MassLine[] => [
    rub(label),
    {
      voice: "cite",
      label: "Gutnius",
      text: cite,
      note: `✠ Rit i kam long holi Gutnius, Santu ${who} i raitim.`,
    },
    reading(text),
    priest("Dispela em i Gutnius bilong Bikpela."),
  ];
  if (year === "A") {
    return one("Yia A (Mt 21:1-11)", "Mt 21:1-11", "Matyu", GOSPEL_A);
  }
  if (year === "C") {
    return one("Yia C (Lk 19:28-40)", "Lk 19:28-40", "Luk", GOSPEL_C);
  }
  return [
    ...one("Yia B (Mk 11:1-10)", "Mk 11:1-10", "Mak", GOSPEL_B),
    ...one("O narapela rit bilong Yia B (Jn 12:12-16)", "Jn 12:12-16", "Jon", GOSPEL_B2),
  ];
}

export function palmProcession(year: SundayCycle): MassLine[] {
  return [
    head("Tingim Bikpela Jisas Krais i Go Insait long Jerusalem"),
    rub("1. Long dispela de, Sios i tingim Bikpela Jisas Krais i go insait long Jerusalem bilong inapim wok bilong kisim bek yumi long Pen na Indai na Kirap Bek bilong em. Olsem na ol bilipmanmeri i mas tingim dispela pasin bilong Bikpela i go insait long Jerusalem long olgeta Misa bilong dispela de. Ol i ken mekim bikpela prosesio ausait long haus lotu, o liklik prosesio insait long haus lotu. Bikpela prosesio i mas kamap wanpela taim tasol long wan wan haus lotu. Olsem na sapos i gat arapela Misa long dispela haus lotu, orait ol i mas mekim liklik prosesio insait long haus lotu tasol long ol arapela Misa."),
    rub("Sapos i no gat prosesio ausait o insait long haus lotu, em i gutpela long mekim wanpela Baibel Lotu bilong tingim Bikpela Jisas Krais i go insait long Jerusalem olsem Mesaia, na bilong tingim Pen na Indai bilong em. Dispela Baibel Lotu i ken kamap long Sarere apinun, o long Sande yet, taim ol manmeri inap long bung wantaim."),
    head("Namba Wan We: Prosesio Ausait long Haus Lotu"),
    rub("2. Long taim bilong lotu olgeta manmeri i bung long wanpela liklik haus lotu o wanpela hap i no longwe tumas long haus lotu ol i laik i go long em. Ol bilipmanmeri i ken holim ol pam o han bilong diwai long han bilong ol."),
    rub("3. Pris na Diken i putim retpela klos bilong Misa, na ol i go wantaim ol minista long dispela ples ol manmeri i bung long em. Sapos Pris i laik, em i ken putim kop. Tasol sapos em i putim kop, orait pastaim long Misa em i mas lusim kop na putim klos bilong Misa stret."),
    rub("4. Ol manmeri i singim dispela antipon o wanpela arapela song:"),
    head("Antipon", "Mt 21:9"),
    sung("Hosana, pikinini bilong Devit, ol i onarim yu, i kam long nem bilong Bikpela, em i King bilong Israel. Hosana long God i stap antap."),
    rub("5. Song i pinis, orait Pris i tok:"),
    priest("Long nem bilong Papa, na bilong Pikinini, na bilong Holi Spirit."),
    rub("Na Pris wantaim ol bilipmanmeri i mekim Mak bilong Kruse. Bihain Pris i givim tok welkam long ol manmeri, na em i givim sotpela tok, bilong strongim ol manmeri long lotu gut. Em i ken tok olsem:"),
    priest(WELCOME),
    rub("6. Bihain long sotpela tok, orait Pris i mekim wanpela bilong ol dispela pre. Em i opim na litimapim han, na em i pre:"),
    priest("Yumi pre."),
    prayer(BLESS_1),
    ...AMEN,
    rub("O:"),
    prayer(BLESS_2),
    ...AMEN,
    rub("Pris i blesim ol han bilong diwai wantaim holi wara, tasol em i no mekim wanpela tok."),
    rub("7. Nau, Diken o Pris yet (sapos i no gat Diken) i ritim Gutnius bilong Bikpela i go insait long Jerusalem. Em i bihainim wanpela bilong ol 4-pela buk bilong Gutnius. Em i ken givim insens long buk bilong Gutnius."),
    ...entranceGospel(year),
    rub("8. Bihain long Gutnius, Pris i ken givim sotpela skul. Bihain, taim prosesio i laik bigin, orait Pris o Diken o narapela minista i ken toktok long ol manmeri olsem:"),
    priest(WALK),
    rub("O:"),
    priest("Yumi wokabaut wantaim bel isi."),
    rub("Ol:"),
    people("Long nem bilong Krais. Amen."),
    rub("9. Ol i statim prosesio i go long haus lotu Misa bai i kamap long em. Sapos i gat insens, man i karim insens i go pas. Bihain long em, wanpela akolait o narapela minista i karim kruse, ol i bin bilasim long pam o long han bilong diwai. Na tupela minista i karim ol kandel i lait. Bihain long ol, Diken i karim Buk bilong Gutnius, na Pris wantaim ol arapela minista i wokabaut bihain long em. Ol manmeri i wokabaut las, na ol i karim han bilong diwai o pam. Long taim bilong prosesio, ol manmeri i ken singim ol dispela song hia, o narapela song bilong onarim Krais i King."),
    head("Antipon 1"),
    sung(ANT_1),
    rub("Ol i ken yusim dispela antipon olsem bekim bilong ol ves bilong Sam 24."),
    head("Sam 24"),
    ...psalm(PS24),
    head("Antipon 2"),
    sung(ANT_2),
    rub("Dispela Antipon ol i ken bekim long ol ves bilong Sam 24."),
    head("Sam 47"),
    ...psalm(PS47),
    ...kingHymn(),
    rub("10. Taim prosesio i go insait long haus lotu, ol i mas singim dispela song, o narapela song i tokaut long Bikpela i go insait long Jerusalem."),
    rub("Lain bilong singsing:"),
    sung(ENTER_VERSES[0]),
    rub("Ol:"),
    people(ENTER_ANSWER),
    rub("Lain bilong singsing:"),
    sung(ENTER_VERSES[1]),
    rub("Ol:"),
    people(ENTER_ANSWER),
    rub("11. Taim Pris i kamap long alta, em i givim kis long alta, na em i ken givim insens tu. Bihain Pris i go long sia bilong em, na em i rausim kop, sapos em i bin putim, na em i putim klos bilong Misa. Em i no ken mekim Lotu bilong Bigin. Na em i ken lusim tu Lord, yu marimari, sapos dispela bai i helpim Misa. Olsem na em i go stret long Pre bilong Bigin, na Misa i go het wankain olsem ol arapela de."),
    head("Namba 2 We: Prosesio Insait long Haus Lotu"),
    rub("12. Sapos ol i no inap mekim prosesio ausait long haus lotu, ol i ken tingim Bikpela i go insait long Jerusalem insait long haus lotu yet. Ol i mekim liklik prosesio insait long haus lotu tasol pastaim long Misa."),
    rub("13. Olgeta bilipmanmeri i bung long dua bilong haus lotu o insait long haus lotu yet, na ol i holim han bilong diwai. Pris wantaim ol minista na liklik lain manmeri i go long wanpela hap bilong haus lotu inap long ol arapela manmeri i ken lukim ol gut. Tasol ol i no ken mekim olsem long ples alta i stap long em."),
    rub("14. Taim Pris i go long dispela hap, orait ol i singim Hosana, Pikinini bilong Devit, o narapela song. Bihain Pris i blesim ol han bilong diwai na ol i ritim Gutnius bilong Bikpela i go insait long Jerusalem (n. 5-7). Bihain long Gutnius, Pris wantaim ol minista na liklik lain manmeri i wokabaut i go long ples alta i stap long em, na ol i singim Ol pikinini bilong ol Juda (n. 9), o narapela song."),
    rub("15. Taim Pris i kamap long alta, em i givim kis long alta, na em i go long sia bilong em. Em i no ken mekim Lotu bilong Bigin. Na em i ken lusim tu Lord, yu marimari, sapos dispela bai i helpim Misa. Olsem na em i go stret long Pre bilong Bigin, na Misa i go het wankain olsem ol arapela de."),
    head("Namba 3 We: Pris i Wokabaut i Go long Alta"),
    rub("16. Sapos i gat ol arapela Misa long haus lotu, na ol i no inap mekim prosesio insait long haus lotu, orait ol i ken tingim Bikpela i go insait long Jerusalem long taim Pris i wokabaut i go long alta tasol."),
    rub("17. Taim Pris i wokabaut i go long alta, orait ol i singim antipon i stap long n. 18 wantaim Sam, o narapela song. Taim Pris i kamap long alta, orait em i givim kis long alta, na em i go long sia bilong em. Em i mekim Mak bilong Kruse, na em i ken givim sotpela toktok long ol manmeri. Na bihain, Misa i go het wankain olsem ol arapela de."),
    rub("Long ol arapela Misa, sapos ol i no inap singim song bilong bigin, orait Pris i go long alta na i givim kis long em. Pris i ken givim sotpela toktok long ol manmeri. Na bihain Misa i go het wankain olsem ol arapela de."),
    rub("18. Antipon bilong Bigin (Lukim Jn 12:1, 12-13 na Sam 24:9-10)"),
    rub("Lain bilong singsing:"),
    sung(SIMPLE_VERSES),
    rub("Ol:"),
    people(SIMPLE_ANSWER),
    sung(SIMPLE_PSALM),
    rub("Ol:"),
    people(SIMPLE_ANSWER),
  ];
}

export function palmPassionBefore(): MassLine[] {
  return [
    rub("21. Taim ol i ritim stori bilong Pen na Indai bilong Bikpela ol i no ken laitim kandel na yusim insens. Na tu ol i no ken tok Lord i stap wantaim yupela na ol i no ken mekim Mak bilong Kruse long buk tu. Sapos i gat Diken, orait em i mas ritim dispela stori. Tasol sapos i no gat Diken, orait Pris yet i mas ritim. Na sampela rida tu i ken ritim, tasol Pris yet i mas ritim ol tok bilong Krais. Sapos i gat Diken, orait em i mas askim blesing bilong Pris, olsem em i save mekim taim em i ritim Gutnius. Tasol ol arapela rida i no ken askim blesing."),
  ];
}

export function palmPassionAfter(): MassLine[] {
  return [
    rub("22. Bihain long stori bilong Pen na Indai bilong Bikpela, Pris i ken givim wanpela sotpela skul. Na tu ol i ken sarap liklik taim na tingim."),
    rub("I gat Tok Bilip na Pre bilong ol Bilipmanmeri."),
  ];
}
