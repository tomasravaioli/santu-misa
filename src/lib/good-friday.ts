import type { MassLine } from "./ordo";

const rub = (text: string): MassLine => ({ voice: "rubric", text });
const priest = (text: string): MassLine => ({ voice: "priest", text });
const people = (text: string): MassLine => ({ voice: "people", text });
const prayer = (text: string): MassLine => ({ voice: "priest", text, variant: "oration" });
const together = (text: string): MassLine => ({ voice: "together", text, variant: "hymn" });
const part = (label: string, text: string): MassLine => ({ voice: "cite", variant: "banner", label, text });
const title = (text: string): MassLine => ({ voice: "cite", variant: "banner", text });

const AMEN: MassLine[] = [rub("Ol:"), people("Amen.")];

function intention(heading: string, invite: string, collect: string): MassLine[] {
  return [
    { voice: "cite", variant: "banner", label: heading, text: "" },
    priest(invite),
    rub("Ol i sarap na pre. Bihain Pris i tok:"),
    prayer(collect),
    ...AMEN,
  ];
}

export function goodFridayOpening(): MassLine[] {
  return [
    rub("1. Long tradisen bilong Sios i kam long bipo tru, tude na tumora Sios i no save selebretim ol Sakramen. Tasol Pris i ken givim Sakramen bilong Konpesio na Sakramen bilong Unsio long ol sikmanmeri."),
    rub("2. Tude Pris i ken givim Holi Komunio long ol bilipmanmeri insait long selebresen bilong Pen na Indai bilong Bikpela tasol. Tasol ol i ken bringim Holi Komunio long ol sikmanmeri husat i no inap kam long selebresen."),
    rub("3. Alta i mas i stap nating. No gat kruse, no gat kandel, no gat laplap long em tu."),
    title("Selebresen bilong Pen na Indai bilong Bikpela"),
    rub("4. Selebresen bilong Pen na Indai bilong Bikpela i mas kamap long apinun, long tri klok samting. Em i orait tu long makim narapela taim long apinun, sapos dispela i helpim ol pipel. Dispela selebresen i gat tripela hap bilong em: Lotu bilong Tok bilong God, Lotu bilong Adoresen bilong Diwai Kros, na Holi Komunio."),
    rub("5. Pris na Diken i mas putim retpela klos bilong Misa, na ol i mas wokabaut i go klostu long alta, tasol ol i no ken mekim wanpela tok, na i no gat singsing tu. Ol i mas daunim het liklik long fran bilong alta, na slip long graun, na putim pes i go daun. O sapos ol i laik, ol i ken nildaun tasol na beten liklik taim. Ol arapela minista i mas nildaun tasol. Na olgeta manmeri i sarap na pre i stap."),
    rub("6. Bihain Pris wantaim ol minista i go long sia bilong ol. Pris i lukim ol manmeri, na em i litimapim na opim han, na em i kolim wanpela bilong ol dispela pre. Tasol em i no ken tok [[Yumi pre]] pastaim."),
    rub("Pre bilong Bigin"),
    prayer(`Lord, tingim marimari bilong yu,
na sambai oltaim long ol wokmanmeri bilong yu,
bai ol i ken kamap holi.
Long wanem, Krais, Pikinini bilong yu,
i bin kapsaitim blut bilong em yet bilong kisim bek ol.
Em i stap laip na em i King, nau na oltaim.`),
    ...AMEN,
    rub("O:"),
    prayer(`God, sin bilong Adam i bin bagarapim mipela,
na mipela i mas i dai.
Tasol long Pen na Indai bilong Krais,
Pikinini bilong yu na Bikpela bilong mipela,
yu bin kisim bek mipela.
Krais i bin kamap man wankain olsem mipela,
ol manmeri bilong graun.
Mipela i askim yu, givim grasia bilong yu long mipela,
bai mipela i ken kamap manmeri bilong heven,
wankain olsem em.
Mipela i pre long nem bilong Krais, em i Bikpela bilong mipela.`),
    ...AMEN,
  ];
}

export function goodFridayWordIntro(): MassLine[] {
  return [
    part("Hap Namba Wan", "Lotu bilong Tok bilong God"),
    rub("7. Olgeta i sindaun na wanpela rida i ritim rit namba wan i kam long Buk bilong Aisaia (52:13-15; 53:1-12) wantaim Sam."),
    rub("8. Bihain ol i ritim rit namba 2 i kam long Pas i go long Hibru (4:14-16; 5:7-9). Na bihain long rit, ol i singim song bilong welkamim Gutnius."),
    rub("9. Bihain ol i ritim Stori bilong Pen na Indai bilong Bikpela i kam long Gutnius bilong Jon (18:1-40; 19:1-42) wankain olsem ol bin ritim long las Sande."),
  ];
}

export function goodFridayAfterGospel(): MassLine[] {
  return [
    rub("10. Bihain long rit bilong Pen na Indai bilong Bikpela, Pris i mas givim wanpela sotpela skul. Taim skul i pinis, orait em i ken askim ol bilipmanmeri long sarap sotpela taim na pre."),
    title("Pre bilong Pipel bilong God"),
    rub("11. Lotu bilong Tok bilong God i pinis wantaim Pre bilong Pipel bilong God. Em i mas kamap olsem: Pris i mas sanap i stap klostu long sia bilong em, o long alta. Diken o narapela minista, i sanap long ples bilong rit, na em i kolim intensen bilong wan wan pre. Olsem na ol manmeri i sarap liklik taim. Taim ol i kolim intensen bilong pre pinis, orait Pris i opim han na em i singim o kolim pre."),
    rub("Ol bilipmanmeri i ken sanap i stap o nildaun long taim bilong ol dispela pre."),
    rub("12. Pastaim long pre bilong Pris, i gat tradisen bilong Sios i olsem: Diken i save tokim ol manmeri [[Yumi nildaun]], na [[Yumi sanap]]. Taim ol i nildaun, orait ol i sarap liklik taim na pre."),
    rub("Tasol Bisop Konperens i ken makim ol arapela tok bilong i go pas long pre bilong Pris."),
    rub("13. Sapos i gat sampela bikpela wari o wok, orait Bisop bilong daiosis i ken makim wanpela nupela pre bilong helpim dispela wari o wok."),
    ...intention(
      "I. Bilong helpim holi Sios",
      `Ol bratasusa, yumi pre bilong helpim holi Sios bilong God,
bai God na Bikpela bilong yumi
i ken givim gutpela taim long em, lukautim em,
na mekim em i kamap wanbel long olgeta hap bilong graun.
God i ken helpim yumi long i stap gut na painim gutpela taim,
bai yumi ken givim glori long God Papa i strong olgeta.`,
      `God, yu strong olgeta na yu stap oltaim.
Long wok bilong Krais,
yu bin soim glori bilong yu long olgeta lain manmeri.
Marimari long Sios bilong yu long olgeta hap bilong graun,
bai em i ken i stap strong long bilip,
na bai oltaim em i ken givim witnes long nem bilong yu.
Mipela i pre long nem bilong Krais, em i Bikpela bilong mipela.`,
    ),
    ...intention(
      "II. Bilong helpim Pop",
      `Yumi pre bilong helpim Papa Santu bilong yumi, Pop N.
God na Bikpela bilong yumi i bin makim em
bilong kisim namba bilong Bisop,
olsem na nau God i ken helpim em long was gut long holi Sios,
na long stiaim wokabaut bilong holi pipel bilong God.`,
      `God, yu strong olgeta na yu stap oltaim.
Tok bilong yu tasol i save mekim olgeta samting i kamap.
Harim ol pre bilong mipela, na mekim gut long Pop,
yu yet i bin makim bilong helpim mipela.
Mekim bai ol Kristen pipel i ken aninit long em,
na bihainim laik bilong yu oltaim.
Olsem na ol i ken gro long bilip na long ol gutpela pasin.
Mipela i pre long nem bilong Krais, em i Bikpela bilong mipela.`,
    ),
    ...intention(
      "III. Bilong helpim ol lain i bin kisim Sakramen bilong Ordo, na olgeta bilipmanmeri",
      `Yumi pre bilong helpim Bisop bilong yumi N.,
olgeta Bisop, Pris na Diken bilong Sios.
Na tu yumi pre bilong helpim olgeta bilipmanmeri.`,
      `God, yu strong olgeta na yu stap oltaim.
Spirit bilong yu i save stiaim Sios, na mekim em i kamap holi.
Harim pre bilong mipela,
na givim grasia bilong yu long ol wokmanmeri bilong yu,
bai ol i ken mekim gut wok bilong yu.
Mipela i pre long nem bilong Krais, em i Bikpela bilong mipela.`,
    ),
    ...intention(
      "IV. Bilong helpim ol katekumen",
      `Yumi pre bilong helpim ol katekumen (bilong yumi),
bai God na Bikpela bilong yumi
i ken redim hat bilong ol, na marimari long ol.
Olsem na em i ken pogivim olgeta sin bilong ol
long wara bilong nupela laip,
na ol i ken pas wantaim Jisas Krais, em i Bikpela bilong yumi.`,
      `God, yu strong olgeta na yu stap oltaim.
Oltaim yu save givim ol nupela pikinini long Sios bilong yu.
Strongim bilip na save bilong ol katekumen (bilong mipela),
bai ol i ken kisim nupela laip long wara bilong Baptais,
na bai ol i ken kamap lain pikinini bilong yu.
Mipela i pre long nem bilong Krais, em i Bikpela bilong mipela.`,
    ),
    ...intention(
      "V. Bilong helpim ol Kristen i kamap wanbel",
      `Yumi pre bilong helpim ol bratasusa bilong yumi
i bilip long Krais, tasol ol i bihainim narapela narapela lotu.
God na Bikpela bilong yumi i ken helpim ol
long bihainim olgeta pasin i tru,
na em i ken bungim ol long Sios bilong em, em i wanpela tasol.`,
      `God, yu strong olgeta na yu stap oltaim.
Yu save bungim ol samting i stap nabaut nabaut,
na yu save lukautim ol samting yu bungim pinis.
Marimari long ol lain sipsip bilong Pikinini bilong yu.
Yu bin mekim ol i kamap holi long wanpela Baptais tasol.
Mekim ol i kamap wan long bilip
na long pasin bilong laikim yu na ol arapela manmeri.
Mipela i pre long nem bilong Krais, em i Bikpela bilong mipela.`,
    ),
    ...intention(
      "VI. Bilong helpim ol Juda",
      `Yumi pre bilong helpim ol lain Juda.
Ol i namba wan lain bilong harim tok
bilong God na Bikpela bilong yumi.
God i ken helpim ol long laikim nem bilong em moa yet,
na long holim kontrak bipo em i bin wokim wantaim ol.`,
      `God, yu strong olgeta na yu stap oltaim.
Bipo tru yu bin givim ol promis bilong yu
long Abraham wantaim ol lain bilong em.
Harim pre bilong Sios bilong yu,
na mekim bai dispela lain,
bipo yu bin kisim ol olsem namba wan pipel bilong yu yet,
i ken painim marimari bilong yu,
na yu ken kisim bek ol.
Mipela i pre long nem bilong Krais, em i Bikpela bilong mipela.`,
    ),
    ...intention(
      "VII. Bilong helpim ol manmeri i no bilip long Krais",
      `Yumi pre bilong helpim ol manmeri i no bilip long Krais,
bai Holi Spirit i ken givim lait long ol,
na helpim ol long wokabaut long rot bilong salvesen.`,
      `God, yu strong olgeta na yu stap oltaim.
Helpim ol manmeri i no bilip long Krais,
bai ol i ken wokabaut long ai bilong yu wantaim ol gutpela pasin.
Helpim ol, bai ol i ken painim tok i tru.
Na helpim mipela tu, bai ol gutpela pasin bilong mipela
i ken givim witnes long bikpela laik bilong yu
i go long olgeta manmeri bilong graun.
Mipela i pre long nem bilong Krais, em i Bikpela bilong mipela.`,
    ),
    ...intention(
      "VIII. Bilong helpim ol manmeri i no bilip long God",
      `Yumi pre bilong helpim ol manmeri i no bilip long God,
bai ol i ken bihainim ol stretpela pasin,
na long dispela rot ol i ken painim God.`,
      `God, yu strong olgeta na yu stap oltaim.
Yu bin mekim kamap olgeta manmeri,
bai ol i ken mangal long painim yu,
na bai ol i ken kisim bel isi, taim ol i painim yu pinis.
Tru, kain kain samting nogut i pasim rot bilong ol.
Tasol yu inap long mekim ol i luksave long marimari bilong yu,
na long luksave long ol gutpela pasin
bilong ol manmeri i save bilip long yu.
Helpim ol, bai ol i ken bilip long yu,
long wanem, yu tasol yu trupela God,
na yu Papa bilong mipela na bilong olgeta manmeri.
Mipela i pre long nem bilong Krais, em i Bikpela bilong mipela.`,
    ),
    ...intention(
      "IX. Bilong helpim ol manmeri i holim wok gavman",
      `Yumi pre bilong helpim ol manmeri i holim wok gavman,
bai God na Bikpela bilong yumi
i ken stiaim tingting na bel bilong ol.
Olsem na ol i ken bihainim laik bilong em,
na mekim wok bilong kamapim gutpela taim,
na bilong helpim ol manmeri long i stap fri.`,
      `God, yu strong olgeta na yu stap oltaim.
Lewa bilong ol manmeri i stap long han bilong yu tasol.
Yu tasol i save givim namba long ol manmeri,
bai ol i ken mekim wok gavman.
Mipela i pre, lukdaun long ol manmeri i holim wok gavman.
Helpim ol, bai olgeta lain manmeri bilong graun
i ken i stap gut, na i ken painim gutpela taim,
na bai ol i ken i stap fri bilong skelim
long wanem rot ol i laik bihainim God.
Mipela i pre long nem bilong Krais, em i Bikpela bilong mipela.`,
    ),
    ...intention(
      "X. Bilong helpim ol manmeri i gat hevi",
      `Dia ol bratasusa, yumi pre long God Papa i strong olgeta,
bai em i ken rausim ol rong na kranki tingting
i stap long dispela graun.
Em i ken pinisim olgeta sik na hangre bilong ol manmeri.
Em i ken helpim ol manmeri i stap long kalabus,
na ol manmeri i pas long sen.
God i ken helpim tu ol manmeri i stap longwe
long ples bilong ol, na helpim ol long kam bek.
Em i ken mekim ol sikmanmeri i kamap orait,
na givim laip bilong oltaim long ol manmeri i laik i dai.`,
      `God, yu strong olgeta na yu stap oltaim.
Givim bel isi long ol manmeri i krai i stap,
na strongim ol manmeri i hatwok.
Harim pre bilong ol manmeri i gat pen na hevi, na i krai long yu.
Marimari long ol, na mekim ol i amamas gen.
Mipela i pre long nem bilong Krais, em i Bikpela bilong mipela.`,
    ),
  ];
}

export function goodFridayCross(): MassLine[] {
  return [
    part("Hap Namba 2", "Adoresen bilong Diwai Kros"),
    rub("14. Pre bilong Pipel bilong God i pinis, orait em i taim bilong Adoresen bilong Diwai Kros. I gat tupela rot bilong adorim Diwai Kros. Pris yet i mas skelim wanem rot em i laik bihainim bilong helpim ol bilipmanmeri."),
    title("Soim Diwai Kros"),
    { voice: "cite", variant: "banner", label: "Namba Wan Rot", text: "" },
    rub("15. Diken wantaim ol arapela minista i go long sakristi bilong kisim Diwai Kros, ol i bin karamapim wantaim vaiolet laplap pastaim. Tupela minista i karim ol kandel i lait, na ol i prosesio namel long haus lotu, na i go klostu long alta. Pris i sanap long fran bilong alta, na em i kisim Diwai Kros. Pastaim em i mas lusim hap laplap i karamapim het bilong Diwai Kros, na em i litimapim em na i tok (o sing): [[Lukim Diwai Kros]] (long Tok Rom: [[Ecce lignum Crucis]]). Diken i ken helpim Pris long singim, o ol lain bilong singsing tu i ken helpim Pris. Na olgeta manmeri i bekim: [[Kam, yumi adorim]] (long Tok Rom: [[Venite, adoremus]]). Singsing i pinis, orait ol i nildaun na sarap na adorim Diwai Kros liklik taim. Pris wanpela tasol i sanap i stap na litimapim Diwai Kros, bai olgeta manmeri i ken lukim gut."),
    rub("Pris:"),
    priest("Lukim Diwai Kros. Long em, Ridima bilong graun i hangamap."),
    rub("Ol:"),
    people("Kam, yumi adorim."),
    rub("Nau Pris i lusim laplap long rait han bilong Diwai Kros, em i litimapim Diwai Kros, na i tok (o sing) gen: [[Lukim Diwai Kros]]. Na ol i mekim wankain olsem bipo."),
    rub("Las, Pris i lusim laplap bilong Diwai Kros olgeta, em i litimapim Diwai Kros, na i tok (o sing) gen: [[Lukim Diwai Kros]]. Na ol i mekim wankain olsem bipo."),
    { voice: "cite", variant: "banner", label: "Namba 2 Rot", text: "" },
    rub("16. Pris o Diken wantaim ol minista i go long dua bilong haus lotu, na em i kisim Diwai Kros. Diwai Kros i no gat laplap i karamapim em. Ol minista i mas holim ol kandel i lait. Ol i statim prosesio long dua bilong haus lotu i go long alta, namel long haus lotu. Klostu long dua bilong haus lotu, Pris o Diken i karim Diwai Kros i sanap, em i litimapim Diwai Kros na i tok (o sing): [[Lukim Diwai Kros]]. Ol i bekim: [[Kam, yumi adorim]]. Ol i nildaun na sarap na adorim Diwai Kros liklik taim. Bihain Pris o Diken i mekim wankain samting namba 2 taim namel long haus lotu, na namba 3 taim klostu long alta. Ol manmeri i bekim wankain olsem bipo. Na bihain long wan wan bekim ol i mas sarap na adorim Diwai Kros liklik taim."),
    title("Adoresen bilong Holi Diwai Kros"),
    rub("17. Pris o Diken i karim Diwai Kros i go long fran bilong alta, na tupela minista i holim kandel i lait i go wantaim em. Em i putim Diwai Kros i go daun, o em i givim long sampela minista bilong holim. Ol i putim ol kandel long hap na long hap bilong Diwai Kros."),
    rub("18. Bilong adorim Diwai Kros, Pris i go pas long selebresen i go klostu long Diwai Kros. Em i ken rausim su na klos bilong Misa pastaim, sapos em i laik. Bihain ol arapela Pris na Diken, ol le minista, na ol bilipmanmeri i kam klostu long Diwai Kros. Ol i wokabaut i kam long fran olsem prosesio, bilong adorim Diwai Kros. Ol i ken brukim skru olsem mak bilong adoresen, o ol i ken givim kis long Diwai Kros, o ol i ken bihainim pasin na kastam bilong ples."),
    rub("19. Ol i mas yusim wanpela Diwai Kros tasol long taim bilong adoresen. Sapos i gat bikpela lain manmeri na em i no inap long olgeta i kam long fran, orait Pris na ol ministan i adorim Diwai Kros pastaim. Na bihain Pris i sanapim Diwai Kros namel long fran bilong alta, na em i tokim ol manmeri long adorim Diwai Kros. Pris i mas litimapim Diwai Kros liklik taim, bai ol bilipmanmeri i ken sarap na adorim em."),
    rub("20. Taim ol manmeri i wok long adorim Holi Diwai Kros, orait ol i ken singim [[Bikpela, mipela i adorim Diwai Kros bilong yu]] (long Tok Rom: [[Crucem tuam adoramus]]), o [[Pipel bilong mi, mi bin mekim wanem rong?]] (long Tok Rom: [[Improperia]]), na [[Diwai Kros gutpela tru]] (long Tok Rom: [[Crux fidelis]]). Ol i ken singim tu ol arapela singsing. Ol manmeri i bin adorim Diwai Kros pinis, orait ol i mas sindaun."),
  ];
}

export function goodFridayCommunion(): MassLine[] {
  return [
    part("Hap Namba 3", "Holi Komunio"),
    rub("22. Ol i putim klos long alta, wantaim korporal na Buk Misa. Diken o Pris i putim waitpela spesol laplap (humeral veil), na i go kisim Bleset Sakramen na putim antap long alta. Tupela minista wantaim ol kandel i lait i wokabaut wantaim Diken o Pris i karim Bleset Sakramen, na ol i putim ol kandel klostu long alta o antap long em. Ol manmeri i mas sanap i stap, na sarap. Diken o Pris i putim Bleset Sakramen antap long alta na rausim tuptup bilong siborium. Olsem na Pris i kam klostu long alta na i nildaun."),
    rub("23. Pris i pasim han na em i tok:"),
    priest(`Krais em i Sevia bilong yumi,
na em i bin skulim yumi long kolim God em i Papa bilong yumi.
Olsem na yumi inap pre:`),
    rub("Em i opim na litimapim han, na wantaim olgeta manmeri, em i tok:"),
    together(`Papa bilong mipela, yu stap long heven.
Mekim nem bilong yu i kamap bikpela.
Mekim kingdom bilong yu i kam.
Strongim mipela long bihainim laik bilong yu long graun,
olsem ol i bihainim long heven.
Givim mipela kaikai inap long tude.
Pogivim rong bilong mipela,
olsem mipela i pogivim ol arapela i mekim rong long mipela.
Sambai long mipela long taim bilong traim.
Na rausim olgeta samting nogut long mipela.`),
    rub("24. Pris i opim na litimapim han, na em wanpela i tok:"),
    priest(`Lord, mipela i pre, tekewe olgeta samting nogut long mipela.
Givim gutpela taim long mipela.
Na helpim mipela long marimari bilong yu,
bai mipela inap long abrusim sin,
na bai i no gat samting i ken mekim mipela i pret,
na paulim tingting bilong mipela.
Olsem na bai mipela i ken amamas
na wetim kambek bilong Jisas Krais,
em i Sevia bilong mipela.`),
    rub("Pris i pasim han. Na olgeta manmeri i pinisim pre, na i tok:"),
    people("Kingdom na strong na glori, em i bilong yu tasol, oltaim oltaim."),
    rub("25. Pris i pasim han i stap, na em i tok isi:"),
    priest(`Bodi na Blut bilong yu, Lord Jisas Krais,
i no ken bringim mi long kot na mi lus. Nogat.
Long marimari bilong yu,
Bodi na Blut bilong yu i ken helpim sol na bodi bilong mi,
na tupela i ken kamap olsem marasin bilong oraitim mi.`),
    rub("26. Pris i brukim skru, em i kisim hostia, na i holim antap liklik long plet o long kalis, na i soim long ol manmeri. Na em i tok:"),
    priest(`Em hia Lem bilong God.
Em i tekewe ol sin bilong olgeta manmeri bilong graun.
Ol manmeri, God i singautim ol long kaikai bilong Lem,
em ol i ken amamas.`),
    rub("Na Pris wantaim ol manmeri i pre wantaim:"),
    people(`Lord, mi no gutpela inap long yu kam insait long haus bilong mi.
Yu tok tasol na sol bilong mi bai i orait.`),
    rub("27. Pris i kaikai Bodi bilong Krais, na i tok isi:"),
    priest("Bodi bilong Krais."),
    rub("28. Pris i givim Komunio long ol manmeri. Long taim bilong Komunio, ol i ken singim Sam 22 o narapela singsing."),
    rub("29. Givim Komunio i pinis, orait Diken o narapela minista i bringim siborium long wanpela ples, ol i bin redim ausait long haus lotu. Sapos i no gat gutpela ples ausait, orait ol i ken putim long tabernakel."),
    rub("30. Bihain Pris i tok: [[Yumi pre]], na ol i ken sarap liklik taim. Bihain em i autim Pre bihain long Komunio:"),
    prayer(`God, yu strong olgeta na yu stap oltaim.
Long Indai na Kirap Bek bilong Krais,
yu bin givim nupela laip long mipela.
Inapim wok marimari bilong yu insait long mipela,
ol manmeri i bin kisim dispela Sakramen.
Na helpim mipela,
bai mipela i ken givim mipela yet olgeta long yu.
Mipela i pre long nem bilong Krais, em i Bikpela bilong mipela.`),
    ...AMEN,
    rub("31. Bilong salim ol manmeri i go, orait Diken o Pris yet, i tok: [[Daunim het bilong yupela bilong kisim blesing]]. Olsem na Pris i lukluk long ol manmeri, em i taitim han na i holim antap long ol manmeri, na em i pre."),
    prayer(`Lord, salim bikpela blesing bilong yu
i kam daun long pipel bilong yu.
Ol i bin tingim Indai bilong Pikinini bilong yu,
na nau ol i wetim Kirap Bek bilong em.
Olsem na mipela i askim yu, pogivim ol rong bilong ol,
givim gutpela taim long ol, strongim bilip bilong ol,
na mekim ol i kamap long laip i stap gut oltaim.
Mipela i pre long nem bilong Krais, em i Bikpela bilong mipela.`),
    ...AMEN,
    rub("32. Olgeta manmeri i brukim skru long Diwai Kros, na ol i go ausait, na ol i no ken toktok."),
    rub("33. Taim selebresen i pinis, orait ol i rausim olgeta samting i stap antap long alta. Tasol Diwai Kros wantaim tupela o foapela kandel i mas i stap yet."),
    rub("34. Ol lain i bin i stap long selebresen i no mas beten Ivining Pre bilong Sios."),
  ];
}
