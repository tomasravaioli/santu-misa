import type { EpBit } from "./ep-bits";

export type ExtraEpId = "r1" | "r2" | "n1" | "n2" | "n3" | "n4";

export const EXTRA_EP_IDS: ExtraEpId[] = ["r1", "r2", "n1", "n2", "n3", "n4"];

export function isExtraEp(ep: string | number): ep is ExtraEpId {
  return (EXTRA_EP_IDS as readonly string[]).includes(String(ep));
}

/** Only a weekday feria of Ordinary Time, which has no preface of its own. */
export function extraEpAllowed(day: {
  season: string;
  rank: string;
  isSunday?: boolean;
  properId?: string;
}): boolean {
  if (day.season !== "ordinary") return false;
  if (day.isSunday) return false;
  if (day.rank !== "feria") return false;
  if (day.properId?.startsWith("sanctorale.") || day.properId?.startsWith("votiv.")) return false;
  return true;
}

export const EXTRA_EP_TITLES: Record<ExtraEpId, string> = {
  "r1": "Bikpela Pre Tenkyu bilong kamap wanbel 1",
  "r2": "Bikpela Pre Tenkyu bilong kamap wanbel 2",
  "n1": "Sios i wokabaut long rot bilong kamap wan",
  "n2": "God i stiaim Sios bilong em long rot bilong salvesen",
  "n3": "Jisas em i rot i go long Papa",
  "n4": "Jisas i wokabaut namel long ol manmeri na i mekim gut long ol"
};

export const EXTRA_EPS: Record<ExtraEpId, { preface: EpBit[]; after: EpBit[] }> = {
  "r1": {
    "preface": [
      {
        "v": "P",
        "t": "Tru, em i gutpela na i stret,\noltaim mipela i mas tenkim yu, Lord,\nyu Papa na yu holi tru,\nyu strong olgeta na yu God bilong oltaim.\n\nOltaim yu save singautim mipela long kisim nupela laip.\nYu pulap long marimari,\nolsem na oltaim yu save pogivim ol rong\nbilong ol manmeri bilong sin.\nNa oltaim yu save singautim ol\nlong bilip long marimari bilong yu tasol.\n\nPlanti taim mipela i bin brukim kontrak bilong yu.\nTasol yu no bin givim baksait long mipela. Nogat.\nLong wok bilong Jisas,\nPikinini bilong yu na Ridima bilong mipela,\nna long bikpela laik bilong yu i kam long olgeta manmeri,\nyu bin pasim mipela long yu.\nNa dispela nupela kontrak em i strong tumas,\nna em i no inap lus.\n\nNau yu givim taim long pipel bilong yu,\nbai ol i ken kamap wanbel gen wantaim yu.\nNa long marimari bilong yu,\nyu laik givim grasia bilong yu long ol,\nbai ol i ken tanim bel,\nna bai ol i ken kisim nupela hop i kam long Jisas Krais.\nNa yu kirapim tingting long ol,\nbai ol i ken mekim wok bilong helpim ol arapela manmeri,\nna bai ol i ken trastim Holi Spirit.\n\nOlsem na mipela i pulap long amamas,\nna mipela i tokaut long bikpela laik bilong yu\ni kam long mipela.\nNa mipela i laik litimapim nem bilong yu,\nlong wanem, yu yet i bin kisim bek mipela.\nOlsem na wantaim ol lain bilong heven, mipela i sing (tok):"
      }
    ],
    "after": [
      {
        "v": "L",
        "t": "2. Pris i opim na litimapim han long pre, na em i tok:"
      },
      {
        "v": "P",
        "t": "Tru tumas, Lord, yu holi.\nNa long taim graun i kamap i kam inap nau,\nyu save wok bilong helpim ol manmeri long kamap holi,\nwankain olsem yu yet yu stap holi."
      },
      {
        "v": "L",
        "t": "3. Em i pasim han, na i holim han antap long ofa, na em i tok:"
      },
      {
        "v": "P",
        "t": "Mipela i pre,\nlukdaun long ol ofa bilong pipel bilong yu,\nna salim strong bilong Spirit bilong yu antap long ol,"
      },
      {
        "v": "L",
        "t": "Em i pasim han, na i mekim Mak bilong Kruse antap long bret na kap wantaim, na i tok:"
      },
      {
        "v": "P",
        "t": "bai ol i kamap Bodi ✠ na Blut"
      },
      {
        "v": "L",
        "t": "Em i pasim han."
      },
      {
        "v": "P",
        "t": "bilong Pikinini bilong yu, Jisas Krais, yu laikim em tumas.\nLong wok bilong em tasol,\nmipela i kamap pikinini bilong yu.\n\nTaim mipela i bin lus,\nna mipela i no inap kam klostu long yu gen,\nyu bin soim bikpela laik bilong yu i kam long mipela.\nJisas, Pikinini bilong yu, em yet i no gat rong na i no gat sin,\ntasol em i bin givim laip bilong em yet bilong helpim mipela,\nna ol i bin nilim em long Diwai Kros.\nTasol pastaim long em i opim tupela han bilong em\nnamel long heven na long graun,\nolsem mak bilong Kontrak bilong yu bilong oltaim,\nem i laik selebretim Pasova wantaim ol disaipel bilong em."
      },
      {
        "v": "L",
        "t": "4. Pris i mas autim klia na stret ol tok i kamap nau, long wanem, em ol tok bilong Bikpela yet."
      },
      {
        "v": "P",
        "t": "Taim em i kaikai wantaim ol,"
      },
      {
        "v": "L",
        "t": "Pris i kisim bret, em i holim antap liklik long alta, na i tok:"
      },
      {
        "v": "P",
        "t": "em i kisim bret. Em i tenkim yu, na litimapim nem bilong yu.\nEm i brukim bret, na em i givim long ol disaipel bilong em,\nna em i tok:"
      },
      {
        "v": "L",
        "t": "Em i daunim het liklik."
      },
      {
        "v": "P",
        "t": "YUPELA OLGETA, KISIM NA KAIKAI LONG EM.\nDISPELA EM I BODI BILONG MI.\nBAI MI GIVIM BILONG ORAITIM YUPELA."
      },
      {
        "v": "L",
        "t": "Pris i soim hostia em i bin konsekretim long ol manmeri. Bihain em i putim hostia gen long plet, na em i brukim skru bilong adorim Krais."
      },
      {
        "v": "L",
        "t": "5. Nau Pris i tok:"
      },
      {
        "v": "P",
        "t": "Krais i save pinis, olsem em bai i kisim bek olgeta manmeri\nlong Blut bilong em bai i kapsait long Diwai Kros.\nOlsem na taim ol i kaikai pinis,"
      },
      {
        "v": "L",
        "t": "Em i kisim kap, em i holim antap liklik long alta, na i tok:"
      },
      {
        "v": "P",
        "t": "em i kisim kap i gat wain. Em i tenkim yu gen.\nEm i givim kap long ol disaipel bilong em, na em i tok:"
      },
      {
        "v": "L",
        "t": "Em i daunim het liklik."
      },
      {
        "v": "P",
        "t": "YUPELA OLGETA, KISIM NA DRING LONG EM.\nDISPELA EM I KAP BILONG BLUT BILONG MI.\nEM I BLUT BILONG NUPELA KONTRAK I STAP OLTAIM.\nDISPELA BLUT BAI I LUS BILONG TEKEWE SIN\nBILONG YUPELA NA BILONG PLANTI MANMERI.\nYUPELA MEKIM OLSEM BILONG TINGIM MI GEN."
      },
      {
        "v": "L",
        "t": "Em i soim kap long ol manmeri. Bihain em i putim kap gen long korporal, na em i brukim skru bilong adorim Krais."
      },
      {
        "v": "L",
        "t": "6. Nau em i tok:"
      },
      {
        "v": "P",
        "t": "Nau yumi autim bilip bilong yumi."
      },
      {
        "v": "O",
        "t": "Lord, mipela i tokaut long Indai bilong yu,\nna mipela i autim bilip long Kirap Bek bilong yu,\ninap long taim yu kam bek gen."
      },
      {
        "v": "O",
        "t": "Lord, olgeta taim mipela i kaikai dispela Bret,\nna dring long dispela Kap,\nmipela i telimautim Indai bilong yu,\ninap long taim yu kam bek."
      },
      {
        "v": "O",
        "t": "Sevia bilong graun, kisim bek mipela.\nLong Diwai Kros na long Kirap Bek bilong yu,\nyu bin mekim mipela i kamap fri."
      },
      {
        "v": "L",
        "t": "7. Pris i opim na litimapim han, na em i pre:"
      },
      {
        "v": "P",
        "t": "God Papa, mipela i tingim Pikinini bilong yu,\nJisas Krais, em i Pasova bilong mipela,\nna em i bringim gutpela taim long mipela.\nMipela i selebretim Indai na Kirap Bek bilong em,\nna mipela i amamas na wet, bai em i kam bek gen.\nOlsem na mipela i ofarim dispela sakrifais long yu,\nlong wanem, yu gutpela tru, na yu God bilong marimari.\nDispela sakrifais i save mekim olgeta manmeri\ni kamap wanbel gen wantaim yu.\n\nPapa bilong marimari, lukdaun long ol manmeri\nyu bin pas wantaim yu\nlong sakrifais bilong Pikinini bilong yu.\nNa taim ol i kaikai long dispela wanpela Bret\nna ol i dring long dispela wanpela Kap,\nmekim bai Holi Spirit i ken mekim ol\ni kamap wanpela bodi wantaim Krais.\nLong wanem, Krais tasol i save rausim olgeta pasin\ni save brukim lain bilong mipela.\n\nMekim bai mipela i ken i stap wantingting na wanbel\nwantaim N., Pop bilong mipela,\nna wantaim N. Bisop bilong mipela."
      },
      {
        "v": "P",
        "t": "Helpim mipela long wok gut wantaim ol\nbilong redim Kingdom bilong yu,\ninap long de mipela yet i ken sanap long pes bilong yu\nwantaim ol Santu long heven,\nwantaim Santu Maria Virgo, em i Mama bilong God,\nwantaim Santu Josep, man bilong em,\nwantaim ol Santu Aposel na olgeta Santu,\nna wantaim ol bratasusa bilong mipela i dai pinis,\nna nau mipela i pre bai yu ken marimari long ol.\n\nWanpela de mipela bai i lusim dispela ples bilong indai,\nna mipela tu bai i kamap nupela gen.\nNa long dispela taim mipela bai inap amamas na tenkim yu tru"
      },
      {
        "v": "L",
        "t": "Em i pasim han."
      },
      {
        "v": "P",
        "t": "wantaim Krais, em i stap laip oltaim oltaim."
      },
      {
        "v": "L",
        "t": "8. Em i kisim kap na plet wantaim hostia na litimapim tupela wantaim, na em i tok:"
      },
      {
        "v": "P",
        "t": "Dispela Jisas Krais, long wok bilong Holi Spirit,\nem tasol i rot bilong givim olgeta ona na glori long yu,\nGod Papa, yu strong olgeta, nau na oltaim."
      },
      {
        "v": "O",
        "t": "Amen."
      },
      {
        "v": "L",
        "t": "Nau em i taim bilong Lotu bilong kisim Komunio, p. 570."
      }
    ]
  },
  "r2": {
    "preface": [
      {
        "v": "P",
        "t": "Tru, em i gutpela na i stret,\noltaim mipela i mas tenkim yu\nna litimapim nem bilong yu,\nGod, yu Papa na yu strong olgeta,\nlong ol bikpela wok yu save mekim long dispela graun,\nlong nem bilong Jisas Krais, em i Bikpela bilong mipela.\n\nMipela i stap yet namel long planti pait na pasin bilong kros.\nNa mipela i save,\nyu tasol inap long mekim mipela i tanim bel,\nna i tingting long sekan gen.\n\nLong strong bilong Spirit bilong yu,\nyu save senisim hat bilong ol manmeri,\nbai ol manmeri i bin i stap birua,\nol i ken toktok wantaim gen.\nNa ol manmeri i gat kros long ol arapela,\nol i ken sekan gen.\nNa bai ol pipel bilong graun i ken wok wantaim,\nna painim rot bilong kamapim bel isi na gutpela sindaun.\n\nLong strong na long wok bilong yu tasol, Lord,\nyu inap long pinisim olgeta pasin bilong bel nogut,\nna kamapim pasin bilong laikim wanpela narapela.\nYu tasol inap long pinisim olgeta pasin bilong bekim rong,\nna kamapim pasin bilong lusim rong.\nYu tasol inap long pinisim pasin bilong brukim lain,\nna kamapim pasin bilong gutpela sindaun.\n\nOlsem na mipela, ol manmeri i stap yet long graun,\ni laik bung wantaim ol lain i stap long heven,\nna mipela i laik tenkim yu oltaim, na mipela i sing (tok):"
      }
    ],
    "after": [
      {
        "v": "L",
        "t": "2. Pris i opim na litimapim han long pre, na em i tok:"
      },
      {
        "v": "P",
        "t": "God Papa, yu strong olgeta,\nmipela i litimapim nem bilong yu long Jisas Krais,\nem i Pikinini bilong yu,\nna yu bin salim em i kam long mipela.\nKrais em i Tok bilong yu, i save kisim bek mipela.\nKrais em i han bilong yu, i save helpim ol manmeri bilong sin.\nNa Krais em i rot bilong yu, i save bringim bel isi\nna gutpela taim bilong yu long mipela.\n\nLord, taim mipela i bin i go longwe long yu\nlong ol sin bilong mipela,\nyu bin marimari long mipela.\nOlsem na nau em i taim bilong mipela\ni mas tanim bel na kam bek long yu.\nNa mipela i mas laikim wanpela narapela,\nlong nem bilong Pikinini bilong yu.\nLong wanem, yu bin givim Pikinini bilong yu long mipela,\nna em i bin lusim laip bilong em bilong kisim bek mipela."
      },
      {
        "v": "L",
        "t": "3. Em i pasim han, na i holim han antap long ofa, na i tok:"
      },
      {
        "v": "P",
        "t": "Nau mipela i selebretim dispela pasin bilong Krais\nbilong mekim mipela i kamap wanbel gen wantaim yu.\nOlsem na mipela i askim yu,\nsalim Spirit bilong yu i kam,\nna mekim ol dispela presen i kamap holi,"
      },
      {
        "v": "L",
        "t": "Em i pasim han, na i mekim Mak bilong Kruse antap long bret na kap wantaim, na i tok:"
      },
      {
        "v": "P",
        "t": "bai ol i kamap Bodi ✠ na Blut bilong Pikinini bilong yu.\n\nTaim mipela i selebretim dispela Sakramen,\nmipela i bihainim tok bilong em tasol."
      },
      {
        "v": "L",
        "t": "Em i pasim han."
      },
      {
        "v": "L",
        "t": "4. Pris i mas autim klia na stret ol tok i kamap nau, long wanem, em ol tok bilong Bikpela yet."
      },
      {
        "v": "P",
        "t": "Taim Krais i kaikai yet,\nlong nait em i laik givim laip bilong em yet\nbilong mekim mipela i kamap fri,"
      },
      {
        "v": "L",
        "t": "Pris i kisim bret, em i holim antap liklik long alta, na i tok:"
      },
      {
        "v": "P",
        "t": "em i kisim bret long han bilong em.\nEm i tenkim yu, na litimapim nem bilong yu.\nEm i brukim bret, em i givim long ol disaipel bilong em,\nna em i tok:"
      },
      {
        "v": "L",
        "t": "Em i daunim het liklik."
      },
      {
        "v": "P",
        "t": "YUPELA OLGETA, KISIM NA KAIKAI LONG EM.\nDISPELA EM I BODI BILONG MI.\nBAI MI GIVIM BILONG ORAITIM YUPELA."
      },
      {
        "v": "L",
        "t": "Pris i soim hostia em i bin konsekretim long ol manmeri. Bihain em i putim hostia gen long plet, na em i brukim skru bilong adorim Krais."
      },
      {
        "v": "L",
        "t": "5. Bihain em i tok:"
      },
      {
        "v": "P",
        "t": "Na long wankain pasin, long dispela nait,"
      },
      {
        "v": "L",
        "t": "Em i kisim kap, em i holim antap liklik long alta, na i tok:"
      },
      {
        "v": "P",
        "t": "em i kisim kap bilong blesing long han bilong em.\nEm i tenkim yu long marimari bilong yu.\nEm i givim kap long ol disaipel bilong em, na em i tok:"
      },
      {
        "v": "L",
        "t": "Em i daunim het liklik."
      },
      {
        "v": "P",
        "t": "YUPELA OLGETA, KISIM NA DRING LONG EM.\nDISPELA EM I KAP BILONG BLUT BILONG MI.\nEM I BLUT BILONG NUPELA KONTRAK I STAP OLTAIM.\nDISPELA BLUT BAI I LUS BILONG TEKEWE SIN\nBILONG YUPELA NA BILONG PLANTI MANMERI.\nYUPELA MEKIM OLSEM BILONG TINGIM MI GEN."
      },
      {
        "v": "L",
        "t": "Em i soim kap long ol manmeri. Bihain em i putim kap gen long korporal, na em i brukim skru bilong adorim Krais."
      },
      {
        "v": "L",
        "t": "6. Nau em i tok:"
      },
      {
        "v": "P",
        "t": "Nau yumi autim bilip bilong yumi."
      },
      {
        "v": "O",
        "t": "Lord, mipela i tokaut long Indai bilong yu,\nna mipela i autim bilip long Kirap Bek bilong yu,\ninap long taim yu kam bek gen."
      },
      {
        "v": "O",
        "t": "Lord, olgeta taim mipela i kaikai dispela Bret,\nna dring long dispela Kap,\nmipela i telimautim Indai bilong yu,\ninap long taim yu kam bek."
      },
      {
        "v": "O",
        "t": "Sevia bilong graun, kisim bek mipela.\nLong Diwai Kros na long Kirap Bek bilong yu,\nyu bin mekim mipela i kamap fri."
      },
      {
        "v": "L",
        "t": "7. Pris i opim na litimapim han, na em i pre:"
      },
      {
        "v": "P",
        "t": "God Papa, mipela i tingim\nIndai na Kirap Bek bilong Pikinini bilong yu,\nna mipela i ofarim long yu,\ndispela sakrifais i save kisim bek mipela.\nKrais yet i bin givim dispela Misa long mipela,\nolsem mak bilong laikim pasin bilong em i kam long mipela.\n\nGod Papa, yu holi, mipela i askim yu,\nyu ken amamas long mipela,\nwankain olsem yu save amamas long Pikinini bilong yu.\nNa long dispela kaikai,\npulapim mipela long Spirit bilong em,\nbai em i ken tekewe olgeta samting nogut\ni save pasim mipela long kamap wanbel.\n\nSpirit bilong Pikinini bilong yu\ni ken mekim Sios bilong yu i kamap olsem mak\nbilong pasin wanbel.\nNa em i ken helpim Sios long mekim wok\nbilong bringim gutpela taim long olgeta manmeri bilong graun.\nNa em i ken helpim mipela tu long i stap wanbel na wantingting\nwantaim Pop bilong mipela N., na Bisop bilong mipela N.\nna ol arapela Bisop, na wantaim olgeta pipel bilong yu."
      },
      {
        "v": "P",
        "t": "God Papa, yu yet i bin bungim mipela\nlong dispela kaikai bilong Pikinini bilong yu.\nOlsem na mipela i pre,\nbai wanpela de yu ken bringim mipela long heven,\nwantaim Santu Maria Virgo, em i Mama bilong God,\nwantaim Santu Josep, man bilong em,\nwantaim ol Santu Aposel bilong yu na olgeta Santu,\nna wantaim ol bratasusa bilong mipela\nbilong kain kain lain na kain kain tok ples,\nol i bin dai wantaim pasin poroman bilong yu.\nBringim mipela olgeta i go insait long kaikai bilong oltaim,\nlong taim heven na graun bai i kamap nupela gen,\nna bel isi bilong yu bai i pulap tru long mipela,\nna bai i kamap ples klia olgeta,"
      },
      {
        "v": "L",
        "t": "Em i pasim han."
      },
      {
        "v": "P",
        "t": "long nem bilong Krais, em i Bikpela bilong mipela."
      },
      {
        "v": "L",
        "t": "8. Em i kisim kap na plet wantaim hostia na litimapim tupela wantaim, na em i tok:"
      },
      {
        "v": "P",
        "t": "Dispela Jisas Krais, long wok bilong Holi Spirit,\nem tasol i rot bilong givim olgeta ona na glori long yu,\nGod Papa, yu strong olgeta, nau na oltaim."
      },
      {
        "v": "O",
        "t": "Amen."
      },
      {
        "v": "L",
        "t": "Nau em i taim bilong Lotu bilong kisim Komunio, p. 570."
      }
    ]
  },
  "n1": {
    "preface": [
      {
        "v": "L",
        "t": "1. Ol i ken yusim dispela Bikpela Pre Tenkyu long ol Misa Bilong Helpim Sios, Bilong Helpim Pop, Bilong Helpim Bisop, Bilong Makim Nupela Pop o Bisop, Bilong Helpim Wanpela Kaunsel o Sinod, Bilong Helpim ol Pris, Misa Pris i Selebretim Bilong Helpim Em Yet, Bilong Helpim ol Wokmanmeri bilong Sios, Bilong Bung Bilong Ritrit o Bilong Pastoral Wok."
      },
      {
        "v": "P",
        "t": "Tru, em i gutpela na i stret,\nmipela i tenkim yu, Lord,\nna mipela i singsing amamas\nna litimapim nem bilong yu, Papa.\nLong wanem, marimari bilong yu i no gat arere bilong em.\n\nLong Gutnius bilong Pikinini bilong yu,\nyu bin bungim ol manmeri bilong kain kain lain pipel,\nna kain kain tok ples, na kain kain kantri,\nna yu bin bungim ol long wanpela Sios tasol.\nYu bin pulapim Sios bilong yu\nlong laip i kam long strong bilong Spirit bilong yu.\nNa oltaim yu save wok bilong bungim olgeta lain manmeri,\nna mekim ol i kamap wan.\n\nSios i save givim witnes long kontrak i kam long laik bilong yu.\nNa em i save givim hop long ol manmeri,\nbai ol i ken wet long Kingdom bilong yu.\nSios bilong yu i save lait olsem wanpela mak\ni soim gutpela pasin bilong yu.\nNa long Jisas Krais, em i Bikpela bilong mipela,\nyu bin promisim mipela olsem\nmarimari bilong yu bai i stap inap oltaim.\n\nOlsem na wantaim ol strongpela Ensel bilong heven,\nmipela hia long graun i litimapim nem bilong yu,\nna wantaim Sios long olgeta hap bilong graun,\nmipela i sing (tok):"
      }
    ],
    "after": [
      {
        "v": "L",
        "t": "2. Pris i opim na litimapim han long pre, na em i tok:"
      },
      {
        "v": "P",
        "t": "Tru tumas, God, yu holi,\nna mipela i mas litimapim nem bilong yu.\nYu save laikim olgeta manmeri,\nna yu save wokabaut wantaim mipela\nlong olgeta de bilong laip bilong mipela.\nMipela i litimapim nem bilong Pikinini bilong yu.\nEm i save stap namel long mipela,\ntaim mipela i bung long laikim pasin bilong em.\nBipo em i bin autim tok bilong Buk bilong God\nlong ol disaipel bilong em i wokabaut i go long Emeus,\nna em i bin brukim bret long ol.\nNa nau yet em i save mekim wankain samting long mipela tu."
      },
      {
        "v": "L",
        "t": "3. Em i pasim han, na i holim han antap long ofa, na i tok:"
      },
      {
        "v": "P",
        "t": "Papa bilong marimari, mipela i askim yu,\nsalim Holi Spirit bilong yu i kam daun\nbilong mekim dispela bret na wain i kamap holi,"
      },
      {
        "v": "L",
        "t": "Em i pasim han, na i mekim Mak bilong Kruse antap long bret na kap wantaim, na i tok:"
      },
      {
        "v": "P",
        "t": "bai tupela i kamap Bodi ✠ na Blut"
      },
      {
        "v": "L",
        "t": "Em i pasim han."
      },
      {
        "v": "P",
        "t": "bilong Jisas Krais, em i Bikpela bilong mipela."
      },
      {
        "v": "L",
        "t": "4. Pris i mas autim klia na stret ol tok i kamap nau, long wanem, em ol tok bilong Bikpela yet."
      },
      {
        "v": "P",
        "t": "Long nait bipo long em i karim pen,\ntaim em i sindaun long Las Kaikai,"
      },
      {
        "v": "L",
        "t": "Pris i kisim bret, em i holim antap liklik long alta, na i tok:"
      },
      {
        "v": "P",
        "t": "em i kisim bret, na em i tenkim yu.\nEm i brukim bret, na em i givim long ol disaipel bilong em,\nna em i tok:"
      },
      {
        "v": "L",
        "t": "Em i daunim het liklik."
      },
      {
        "v": "P",
        "t": "YUPELA OLGETA, KISIM NA KAIKAI LONG EM.\nDISPELA EM I BODI BILONG MI.\nBAI MI GIVIM BILONG ORAITIM YUPELA."
      },
      {
        "v": "L",
        "t": "Pris i soim hostia em i bin konsekretim long ol manmeri. Bihain em i putim hostia gen long plet, na em i brukim skru bilong adorim Krais."
      },
      {
        "v": "L",
        "t": "5. Bihain em i tok:"
      },
      {
        "v": "P",
        "t": "Na long wankain pasin, taim ol i kaikai pinis,"
      },
      {
        "v": "L",
        "t": "Em i kisim kap, em i holim antap liklik long alta, na i tok:"
      },
      {
        "v": "P",
        "t": "em i kisim kap, na em i tenkim yu gen.\nEm i givim kap long ol disaipel bilong em, na em i tok:"
      },
      {
        "v": "L",
        "t": "Em i daunim het liklik."
      },
      {
        "v": "P",
        "t": "YUPELA OLGETA, KISIM NA DRING LONG EM.\nDISPELA EM I KAP BILONG BLUT BILONG MI.\nEM I BLUT BILONG NUPELA KONTRAK I STAP OLTAIM.\nDISPELA BLUT BAI I LUS BILONG TEKEWE SIN\nBILONG YUPELA NA BILONG PLANTI MANMERI.\nYUPELA MEKIM OLSEM BILONG TINGIM MI GEN."
      },
      {
        "v": "L",
        "t": "Em i soim kap long ol manmeri. Bihain em i putim kap gen long korporal, na em i brukim skru bilong adorim Krais."
      },
      {
        "v": "O",
        "t": "6. Nau em i tok:"
      },
      {
        "v": "P",
        "t": "Nau yumi autim bilip bilong yumi."
      },
      {
        "v": "O",
        "t": "Lord, mipela i tokaut long Indai bilong yu,\nna mipela i autim bilip long Kirap Bek bilong yu,\ninap long taim yu kam bek gen."
      },
      {
        "v": "O",
        "t": "Lord, olgeta taim mipela i kaikai dispela Bret,\nna dring long dispela Kap,\nmipela i telimautim Indai bilong yu,\ninap long taim yu kam bek."
      },
      {
        "v": "O",
        "t": "Sevia bilong graun, kisim bek mipela.\nLong Diwai Kros na long Kirap Bek bilong yu,\nyu bin mekim mipela i kamap fri."
      },
      {
        "v": "L",
        "t": "7. Pris i opim na litimapim han, na em i pre:"
      },
      {
        "v": "P",
        "t": "God Papa, yu holi, nau mipela i tingim Krais,\nPikinini bilong yu na Sevia bilong mipela.\nEm i bin karim pen na i dai long Diwai Kros,\nna yu bin bringim em long glori bilong Kirap Bek,\nna yu bin mekim em i sindaun long raithan bilong yu.\nOlsem na nau na inap long taim em bai i kam bek gen,\nmipela i tokaut long bikpela wok bilong laikim pasin bilong yu.\nNa mipela i ofarim long yu dispela Bret bilong givim laip,\nna dispela Kap bilong blesing.\n\nGod Papa, lukdaun wantaim amamas\nlong dispela ofa bilong Sios bilong yu.\nLong dispela ofa,\nmipela i tokaut gen long sakrifais bilong Krais,\nlong Pen na Indai na Kirap Bek bilong em.\nNa mipela i pre,\nbai long strong bilong Spirit bilong laikim pasin bilong yu,\nmipela i ken i stap hap bodi bilong Pikinini bilong yu inap oltaim.\nLong wanem, mipela i save kisim Bodi na Blut bilong em,\nna mipela i kamap wan wantaim em.\n\nLord, mekim Sios bilong yu\n(i stap long daiosis bilong N.)\ni kamap nupela long lait bilong Gutnius.\nStrongim pasin bilong i stap wan\nlong ol bilipmanmeri bilong yu wantaim ol wasman bilong ol,\nwantaim Pop bilong mipela N., na Bisop bilong mipela N.\nna wantaim ol arapela Bisop."
      },
      {
        "v": "P",
        "t": "Mekim bai pipel bilong yu i ken i stap wan,\nbai ol i ken kamap olsem wanpela tok profet\nbilong helpim ol manmeri bilong graun\ni birua long wanpela narapela,\nbai ol i ken kisim pasin bilong bung wantaim\nna pasin bilong bel isi.\n\nTingim ol bratasusa bilong mipela (N. na N.)\ni bin dai, na nau ol i slip long bel isi bilong Krais.\nNa tingim tu olgeta arapela daimanmeri,\nyu tasol yu save long bilip bilong ol.\nMekim ol i amamas long lukim pes bilong yu,\nna long taim bilong kirap bek,\npulapim ol long laip tru bilong yu.\n\nNa taim wokabaut bilong mipela hia long graun i pinis,\nkisim mipela tu i go insait long haus bilong yu long heven,\nbai mipela i ken i stap laip wantaim yu inap oltaim.\nLong dispela ples,\nwantaim Santu Maria Virgo, em i Mama bilong God,\nwantaim Santu Josep, man bilong em,\nwantaim ol Aposel na Martir,\n(na wantaim Santu N.: Santu bilong dispela de"
      },
      {
        "v": "L",
        "t": "o Wassantu bilong haus lotu o bilong daiosis)"
      },
      {
        "v": "P",
        "t": "na wantaim olgeta Santu,\nmipela bai i amamas na litimapim nem bilong yu,"
      },
      {
        "v": "L",
        "t": "Em i pasim han."
      },
      {
        "v": "P",
        "t": "long Jisas Krais, em i Pikinini bilong yu."
      },
      {
        "v": "L",
        "t": "8. Em i kisim kap na plet wantaim hostia na litimapim tupela wantaim, na em i tok:"
      },
      {
        "v": "P",
        "t": "Dispela Jisas Krais, long wok bilong Holi Spirit,\nem tasol i rot bilong givim olgeta ona na glori long yu,\nGod Papa, yu strong olgeta, nau na oltaim."
      },
      {
        "v": "O",
        "t": "Amen."
      },
      {
        "v": "L",
        "t": "Nau em i taim bilong Lotu bilong kisim Komunio, p. 570."
      }
    ]
  },
  "n2": {
    "preface": [
      {
        "v": "L",
        "t": "1. Ol i ken yusim dispela Bikpela Pre Tenkyu long ol Misa Bilong Helpim Sios, Bilong Askim long Vokesen, Bilong Helpim ol Le Manmeri, Bilong Helpim Famili, Bilong Helpim ol Relijis, Bilong Askim long God long Singautim Planti Relijis, Bilong Askim Laikim Pasin long God, Bilong Helpim ol Wanblut na ol Pren, Bilong Tok Tenkyu long God."
      },
      {
        "v": "P",
        "t": "Tru, em i gutpela na i stret,\noltaim na long olgeta ples,\nmipela i tenkim yu, Lord, yu Papa na yu holi tru.\nGivim tenkyu long yu em i wok bilong mipela,\nna em i kisim bek mipela.\nYu yet i bin mekim dispela graun i kamap,\nna yu Papa bilong olgeta samting i gat laip.\n\nOlgeta samting i kam long save bilong yu,\nna yu no save lusim wanpela samting yu bin mekim.\nNau yet yu stap namel long mipela,\nna oltaim yu save wok bilong helpim mipela.\nBipo, long strongpela han bilong yu,\nyu bin stiaim pipel bilong yu, Israel,\nlong wokabaut bilong em long ples i no gat man.\nNa nau, long strong bilong Holi Spirit,\nyu save stiaim Sios bilong yu\nlong wokabaut bilong em long dispela graun,\nbai em i ken kamap long amamas bilong oltaim\nlong Kingdom bilong yu,\nlong nem bilong Krais, em i Bikpela bilong mipela.\n\nOlsem na wantaim ol Ensel na ol Santu,\nmipela tu i litimapim nem bilong yu, Lord,\nna mipela i singim song bilong givim glori long yu,\nna oltaim mipela i sing (tok):"
      }
    ],
    "after": [
      {
        "v": "L",
        "t": "2. Pris i opim na litimapim han, na em i tok:"
      },
      {
        "v": "P",
        "t": "Tru tumas, God, yu holi,\nna mipela i mas litimapim nem bilong yu.\nYu save laikim olgeta manmeri,\nna yu save wokabaut wantaim mipela\nlong olgeta de bilong laip bilong mipela.\nMipela i litimapim nem bilong Pikinini bilong yu.\nEm i save stap namel long mipela,\ntaim mipela i bung long laikim pasin bilong em.\nBipo em i bin autim tok bilong Buk bilong God\nlong ol disaipel bilong em i wokabaut i go long Emeus,\nna em i bin brukim bret long ol.\nNa nau yet em i save mekim wankain samting long mipela tu."
      },
      {
        "v": "L",
        "t": "3. Em i pasim han, na i holim han antap long ofa, na i tok:"
      },
      {
        "v": "P",
        "t": "Papa bilong marimari, mipela i askim yu,\nsalim Holi Spirit bilong yu i kam daun\nbilong mekim dispela bret na wain i kamap holi,"
      },
      {
        "v": "L",
        "t": "Em i pasim han, na i mekim Mak bilong Kruse antap long bret na kap wantaim, na i tok:"
      },
      {
        "v": "P",
        "t": "bai tupela i kamap Bodi ✠ na Blut"
      },
      {
        "v": "L",
        "t": "Em i pasim han."
      },
      {
        "v": "P",
        "t": "bilong Jisas Krais, em i Bikpela bilong mipela."
      },
      {
        "v": "L",
        "t": "4. Pris i mas autim klia na stret ol tok i kamap nau, long wanem, em ol tok bilong Bikpela yet."
      },
      {
        "v": "P",
        "t": "Long nait bipo long em i karim pen,\ntaim em i sindaun long Las Kaikai,"
      },
      {
        "v": "L",
        "t": "Pris i kisim bret, em i holim antap liklik long alta, na i tok:"
      },
      {
        "v": "P",
        "t": "em i kisim bret, na em i tenkim yu.\nEm i brukim bret, na em i givim long ol disaipel bilong em,\nna em i tok:"
      },
      {
        "v": "L",
        "t": "Em i daunim het liklik."
      },
      {
        "v": "P",
        "t": "YUPELA OLGETA, KISIM NA KAIKAI LONG EM.\nDISPELA EM I BODI BILONG MI.\nBAI MI GIVIM BILONG ORAITIM YUPELA."
      },
      {
        "v": "L",
        "t": "Pris i soim hostia em i bin konsekretim long ol manmeri. Bihain em i putim hostia gen long plet, na em i brukim skru bilong adorim Krais."
      },
      {
        "v": "L",
        "t": "5. Bihain em i tok:"
      },
      {
        "v": "P",
        "t": "Na long wankain pasin, taim ol i kaikai pinis,"
      },
      {
        "v": "L",
        "t": "Em i kisim kap, em i holim antap liklik long alta, na i tok:"
      },
      {
        "v": "P",
        "t": "em i kisim kap, na em i tenkim yu gen.\nEm i givim kap long ol disaipel bilong em, na em i tok:"
      },
      {
        "v": "L",
        "t": "Em i daunim het liklik."
      },
      {
        "v": "P",
        "t": "YUPELA OLGETA, KISIM NA DRING LONG EM.\nDISPELA EM I KAP BILONG BLUT BILONG MI.\nEM I BLUT BILONG NUPELA KONTRAK I STAP OLTAIM.\nDISPELA BLUT BAI I LUS BILONG TEKEWE SIN\nBILONG YUPELA NA BILONG PLANTI MANMERI.\nYUPELA MEKIM OLSEM BILONG TINGIM MI GEN."
      },
      {
        "v": "L",
        "t": "Em i soim kap long ol manmeri. Bihain em i putim kap gen long korporal, na em i brukim skru bilong adorim Krais."
      },
      {
        "v": "L",
        "t": "6. Nau em i tok:"
      },
      {
        "v": "P",
        "t": "Nau yumi autim bilip bilong yumi."
      },
      {
        "v": "O",
        "t": "Lord, mipela i tokaut long Indai bilong yu,\nna mipela i autim bilip long Kirap Bek bilong yu,\ninap long taim yu kam bek gen."
      },
      {
        "v": "O",
        "t": "Lord, olgeta taim mipela i kaikai dispela Bret,\nna dring long dispela Kap,\nmipela i telimautim Indai bilong yu,\ninap long taim yu kam bek."
      },
      {
        "v": "O",
        "t": "Sevia bilong graun, kisim bek mipela.\nLong Diwai Kros na long Kirap Bek bilong yu,\nyu bin mekim mipela i kamap fri."
      },
      {
        "v": "L",
        "t": "7. Pris i opim na litimapim han, na em i pre:"
      },
      {
        "v": "P",
        "t": "God Papa, yu holi, nau mipela i tingim Krais,\nPikinini bilong yu na Sevia bilong mipela.\nEm i bin karim pen na i dai long Diwai Kros,\nna yu bin bringim em long glori bilong Kirap Bek,\nna yu bin mekim em i sindaun long raithan bilong yu.\nOlsem na nau na inap long taim em bai i kam bek gen,\nmipela i tokaut long bikpela wok bilong laikim pasin bilong yu.\nNa mipela i ofarim long yu dispela Bret bilong givim laip,\nna dispela Kap bilong blesing.\n\nGod Papa, lukdaun wantaim amamas\nlong dispela ofa bilong Sios bilong yu.\nLong dispela ofa,\nmipela i tokaut gen long sakrifais bilong Krais,\nlong Pen na Indai na Kirap Bek bilong em.\nNa mipela i pre,\nbai long strong bilong Spirit bilong laikim pasin bilong yu,\nmipela i ken i stap hap bodi bilong Pikinini bilong yu inap oltaim.\nLong wanem, mipela i save kisim Bodi na Blut bilong em,\nna mipela i kamap wan wantaim em.\n\nLord, yu bin singautim mipela\nlong dispela kaikai bilong yu.\nMekim mipela i stap wan wantaim Pop bilong mipela N.,\nna Bisop bilong mipela N.\nwantaim ol arapela Bisop, Pris na Diken,\nna wantaim olgeta pipel bilong yu."
      },
      {
        "v": "P",
        "t": "Helpim mipela long wokabaut wantaim bilip na hop\nlong rot bilong yu,\nbai mipela i ken bringim amamas na strong bilong yu\ni kam long dispela graun.\n\nTingim ol bratasusa bilong mipela (N. na N.)\ni bin dai, na nau ol i slip long bel isi bilong Krais.\nNa tingim tu olgeta arapela daimanmeri,\nyu tasol yu save long bilip bilong ol.\nMekim ol i amamas long lukim pes bilong yu,\nna long taim bilong kirap bek,\npulapim ol long laip tru bilong yu.\n\nNa taim wokabaut bilong mipela hia long graun i pinis,\nkisim mipela tu i go insait long haus bilong yu long heven,\nbai mipela i ken i stap laip wantaim yu inap oltaim.\nLong dispela ples,\nwantaim Santu Maria Virgo, em i Mama bilong God,\nwantaim Santu Josep, man bilong em,\nwantaim ol Aposel na Martir,\n(na wantaim Santu N.: Santu bilong dispela de"
      },
      {
        "v": "L",
        "t": "o Wassantu bilong haus lotu o bilong daiosis)"
      },
      {
        "v": "P",
        "t": "na wantaim olgeta Santu,\nmipela bai i amamas na litimapim nem bilong yu,"
      },
      {
        "v": "L",
        "t": "Em i pasim han."
      },
      {
        "v": "P",
        "t": "long Jisas Krais, em i Pikinini bilong yu."
      },
      {
        "v": "L",
        "t": "8. Em i kisim kap na plet wantaim hostia na litimapim tupela wantaim, na em i tok:"
      },
      {
        "v": "P",
        "t": "Dispela Jisas Krais, long wok bilong Holi Spirit,\nem tasol i rot bilong givim olgeta ona na glori long yu,\nGod Papa, yu strong olgeta, nau na oltaim."
      },
      {
        "v": "O",
        "t": "Amen."
      },
      {
        "v": "L",
        "t": "Nau em i taim bilong Lotu bilong kisim Komunio, p. 570."
      }
    ]
  },
  "n3": {
    "preface": [
      {
        "v": "L",
        "t": "1. Ol i ken yusim dispela Bikpela Pre Tenkyu long ol Misa Bilong Telimautim Gutnius long Olgeta Lain Pipel, Bilong Helpim ol Kristen Manmeri i Kisim Hevi long Bilip bilong ol, Bilong Helpim Kantri o Ples, Bilong Helpim Ol Manmeri i Holim Wok Gavman, Bilong Helpim Ol Memba Bilong Palamen, Long Bigin Bilong Ol Ektiviti Bilong Nupela Yia, Bilong Helpim Ol Pipel I Kamap Gutpela Moa."
      },
      {
        "v": "P",
        "t": "Tru, em i gutpela na i stret,\noltaim na long olgeta ples,\nmipela i tenkim yu, Lord, yu Papa na yu holi tru,\nyu Lord bilong heven na graun.\nGivim tenkyu long yu em i wok bilong mipela,\nna em i kisim bek mipela,\nlong nem bilong Krais, em i Bikpela bilong mipela.\n\nLong Tok bilong yu tasol,\nyu bin mekim olgeta samting i kamap,\nna yu save lukautim olgeta samting\nlong gutpela save bilong yu.\nDispela Tok bilong yu i bin kamap man,\nna yu bin givim em long mipela,\nolsem namelman bilong mipela na yu.\nEm i bin autim tok bilong yu long mipela,\nna em i bin singautim mipela long bihainim em.\nEm yet em i rot i bringim mipela i go long yu.\nEm yet em i tok i tru i mekim mipela i kamap fri.\nNa em yet em i laip i pulapim mipela long amamas.\n\nLong Pikinini bilong yu,\nyu bin mekim olgeta manmeri i kamap,\nbai ol i ken givim glori long nem bilong yu.\nNa long Blut bilong em i kapsait long Diwai Kros,\nyu bin kisim bek ol,\nna yu makim ol long mak bilong Holi Spirit,\nbai ol i ken kamap wanpela famili tasol.\n\nOlsem na nau na inap oltaim, wantaim ol Ensel,\nmipela i tokaut long glori bilong yu,\nna mipela i amamas long litimapim nem bilong yu,\nna mipela i sing (tok):"
      }
    ],
    "after": [
      {
        "v": "L",
        "t": "2. Pris i opim na litimapim han long pre, na em i tok:"
      },
      {
        "v": "P",
        "t": "Tru tumas, God, yu holi,\nna mipela i mas litimapim nem bilong yu.\nYu save laikim olgeta manmeri,\nna yu save wokabaut wantaim mipela\nlong olgeta de bilong laip bilong mipela.\nMipela i litimapim nem bilong Pikinini bilong yu.\nEm i save stap namel long mipela,\ntaim mipela i bung long laikim pasin bilong em.\nBipo em i bin autim tok bilong Buk bilong God\nlong ol disaipel bilong em i wokabaut i go long Emeus,\nna em i bin brukim bret long ol.\nNa nau yet em i save mekim wankain samting long mipela tu."
      },
      {
        "v": "L",
        "t": "3. Em i pasim han, na i holim han antap long ofa, na i tok:"
      },
      {
        "v": "P",
        "t": "Papa bilong marimari, mipela i askim yu,\nsalim Holi Spirit bilong yu i kam daun\nbilong mekim dispela bret na wain i kamap holi,"
      },
      {
        "v": "L",
        "t": "Em i pasim han, na i mekim Mak bilong Kruse antap long bret na kap wantaim, na i tok:"
      },
      {
        "v": "P",
        "t": "bai tupela i kamap Bodi ✠ na Blut"
      },
      {
        "v": "L",
        "t": "Em i pasim han."
      },
      {
        "v": "P",
        "t": "bilong Jisas Krais, em i Bikpela bilong mipela."
      },
      {
        "v": "L",
        "t": "4. Pris i mas autim klia na stret ol tok i kamap nau, long wanem, em ol tok bilong Bikpela yet."
      },
      {
        "v": "P",
        "t": "Long nait bipo long em i karim pen,\ntaim em i sindaun long Las Kaikai,"
      },
      {
        "v": "L",
        "t": "Pris i kisim bret, em i holim antap liklik long alta, na i tok:"
      },
      {
        "v": "P",
        "t": "em i kisim bret, na em i tenkim yu.\nEm i brukim bret, na em i givim long ol disaipel bilong em,\nna em i tok:"
      },
      {
        "v": "L",
        "t": "Em i daunim het liklik."
      },
      {
        "v": "P",
        "t": "YUPELA OLGETA, KISIM NA KAIKAI LONG EM.\nDISPELA EM I BODI BILONG MI.\nBAI MI GIVIM BILONG ORAITIM YUPELA."
      },
      {
        "v": "L",
        "t": "Pris i soim hostia em i bin konsekretim long ol manmeri. Bihain em i putim hostia gen long plet, na em i brukim skru bilong adorim Krais."
      },
      {
        "v": "L",
        "t": "5. Bihain em i tok:"
      },
      {
        "v": "P",
        "t": "Na long wankain pasin, taim ol i kaikai pinis,"
      },
      {
        "v": "L",
        "t": "Em i kisim kap, em i holim antap liklik long alta, na i tok:"
      },
      {
        "v": "P",
        "t": "em i kisim kap, na em i tenkim yu gen.\nEm i givim kap long ol disaipel bilong em, na em i tok:"
      },
      {
        "v": "L",
        "t": "Em i daunim het liklik."
      },
      {
        "v": "P",
        "t": "YUPELA OLGETA, KISIM NA DRING LONG EM.\nDISPELA EM I KAP BILONG BLUT BILONG MI.\nEM I BLUT BILONG NUPELA KONTRAK I STAP OLTAIM.\nDISPELA BLUT BAI I LUS BILONG TEKEWE SIN\nBILONG YUPELA NA BILONG PLANTI MANMERI.\nYUPELA MEKIM OLSEM BILONG TINGIM MI GEN."
      },
      {
        "v": "L",
        "t": "Em i soim kap long ol manmeri. Bihain em i putim kap gen long korporal, na em i brukim skru bilong adorim Krais."
      },
      {
        "v": "O",
        "t": "6. Nau em i tok:"
      },
      {
        "v": "P",
        "t": "Nau yumi autim bilip bilong yumi."
      },
      {
        "v": "O",
        "t": "Lord, mipela i tokaut long Indai bilong yu,\nna mipela i autim bilip long Kirap Bek bilong yu,\ninap long taim yu kam bek gen."
      },
      {
        "v": "O",
        "t": "Lord, olgeta taim mipela i kaikai dispela Bret,\nna dring long dispela Kap,\nmipela i telimautim Indai bilong yu,\ninap long taim yu kam bek."
      },
      {
        "v": "O",
        "t": "Sevia bilong graun, kisim bek mipela.\nLong Diwai Kros na long Kirap Bek bilong yu,\nyu bin mekim mipela i kamap fri."
      },
      {
        "v": "L",
        "t": "7. Pris i opim na litimapim han, na em i pre:"
      },
      {
        "v": "P",
        "t": "God Papa, yu holi, nau mipela i tingim Krais,\nPikinini bilong yu na Sevia bilong mipela.\nEm i bin karim pen na i dai long Diwai Kros,\nna yu bin bringim em long glori bilong Kirap Bek,\nna yu bin mekim em i sindaun long raithan bilong yu.\nOlsem na nau na inap long taim em bai i kam bek gen,\nmipela i tokaut long bikpela wok bilong laikim pasin bilong yu.\nNa mipela i ofarim long yu dispela Bret bilong givim laip,\nna dispela Kap bilong blesing.\n\nGod Papa, lukdaun wantaim amamas\nlong dispela ofa bilong Sios bilong yu.\nLong dispela ofa, mipela i tokaut gen long sakrifais bilong Krais,\nlong Pen na Indai na Kirap Bek bilong em.\nNa mipela i pre,\nbai long strong bilong Spirit bilong laikim pasin bilong yu,\nmipela i ken i stap hap bodi bilong Pikinini bilong yu inap oltaim.\nLong wanem, mipela i save kisim Bodi na Blut bilong em,\nna mipela i kamap wan wantaim em.\n\nGod Papa, yu strong olgeta,\ngivim laip bilong Spirit bilong yu long mipela,\nol manmeri i bung long dispela Sakramen.\nNa mekim mipela i kamap\nolsem piksa bilong Pikinini bilong yu.\nMekim mipela i stap wan wantaim Pop bilong mipela N.,\nna Bisop bilong mipela N.\nwantaim ol arapela Bisop, Pris na Diken,\nna wantaim olgeta pipel bilong yu."
      },
      {
        "v": "P",
        "t": "Mekim bai olgeta bilipmanmeri bilong Sios\ni ken skelim gut ol mak bilong dispela taim nau\nlong lait bilong bilip,\nbai ol i ken givim ol yet olgeta long mekim wok bilong Gutnius.\nNa helpim mipela long luksave long ol nid\nbilong ol arapela manmeri,\nbai mipela i ken serim ol hevi na pen bilong ol,\nna ol amamas na hop bilong ol.\nNa bai mipela i ken strongim ol long salvesen i kam long yu,\nna mipela olgeta i ken wokabaut wantaim\nlong rot i kamap long Kingdom bilong yu.\n\nTingim ol bratasusa bilong mipela (N. na N.)\ni bin dai, na nau ol i slip long bel isi bilong Krais.\nNa tingim tu olgeta arapela daimanmeri,\nyu tasol yu save long bilip bilong ol.\nMekim ol i amamas long lukim pes bilong yu,\nna long taim bilong kirap bek,\npulapim ol long laip tru bilong yu.\n\nNa taim wokabaut bilong mipela hia long graun i pinis,\nkisim mipela tu i go insait long haus bilong yu long heven,\nbai mipela i ken i stap laip wantaim yu inap oltaim.\nLong dispela ples,\nwantaim Santu Maria Virgo, em i Mama bilong God,\nwantaim Santu Josep, man bilong em,\nwantaim ol Aposel na Martir,\n(na wantaim Santu N.: Santu bilong dispela de"
      },
      {
        "v": "L",
        "t": "o Wassantu bilong haus lotu o bilong daiosis)"
      },
      {
        "v": "P",
        "t": "na wantaim olgeta Santu,\nmipela bai i amamas na litimapim nem bilong yu,"
      },
      {
        "v": "L",
        "t": "Em i pasim han."
      },
      {
        "v": "P",
        "t": "long Jisas Krais, em i Pikinini bilong yu."
      },
      {
        "v": "L",
        "t": "8. Em i kisim kap na plet wantaim hostia na litimapim tupela wantaim, na em i tok:"
      },
      {
        "v": "P",
        "t": "Dispela Jisas Krais, long wok bilong Holi Spirit,\nem tasol i rot bilong givim olgeta ona na glori long yu,\nGod Papa, yu strong olgeta, nau na oltaim."
      },
      {
        "v": "O",
        "t": "Amen."
      },
      {
        "v": "L",
        "t": "Nau em i taim bilong Lotu bilong kisim Komunio, p. 570."
      }
    ]
  },
  "n4": {
    "preface": [
      {
        "v": "L",
        "t": "1. Ol i ken yusim dispela Bikpela Pre Tenkyu long ol Misa Bilong Helpim ol Manmeri i Mas Ranawe Na Lusim Kantri o Ples Bilong Ol, Long Taim bilong Hangre, o Bilong Helpim Ol Manmeri i No Gat Kaikai, Bilong Helpim ol Manmeri i Putim Hevi Long Yumi, Bilong Helpim Ol Manmeri i Stap Long Kalabus, Bilong Helpim ol Sikmanmeri, Bilong Helpim ol Manmeri i Laik i Dai, Bilong Askim Grasia Bilong Dai Gut, na Bilong Askim Kain Kain Samting."
      },
      {
        "v": "P",
        "t": "Tru, em i gutpela na i stret,\noltaim na long olgeta ples,\nmipela i tenkim yu, Lord, yu Papa bilong marimari,\nna yu gut olgeta.\nGivim tenkyu long yu em i wok bilong mipela,\nna em i kisim bek mipela.\n\nYu bin givim Jisas Krais, Pikinini bilong yu, long mipela,\nna em i Bikpela na Ridima bilong mipela.\n\nOltaim em i bin soim pasin marimari\nlong ol pikinini na long ol tarangu,\nlong ol sikmanmeri na long ol manmeri bilong sin.\nNa em i bin kamap olsem brata bilong ol manmeri i kisim hevi,\nna bilong ol manmeri i karim kain kain pen.\n\nLong tok na long pasin bilong em,\nem i bin tokaut long olgeta manmeri bilong graun olsem,\nyu Papa tru, na yu save lukautim gut olgeta pikinini bilong yu.\n\nOlsem na wantaim ol Ensel na ol Santu,\nmipela i givim ona long yu,\nna mipela i singim song bilong givim glori long yu,\nna oltaim mipela i sing (tok):"
      }
    ],
    "after": [
      {
        "v": "L",
        "t": "2. Pris i opim na litimapim han long pre, na em i tok:"
      },
      {
        "v": "P",
        "t": "Tru tumas, God, yu holi,\nna mipela i mas litimapim nem bilong yu.\nYu save laikim olgeta manmeri,\nna yu save wokabaut wantaim mipela\nlong olgeta de bilong laip bilong mipela.\nMipela i litimapim nem bilong Pikinini bilong yu.\nEm i save stap namel long mipela,\ntaim mipela i bung long laikim pasin bilong em.\nBipo em i bin autim tok bilong Buk bilong God\nlong ol disaipel bilong em i wokabaut i go long Emeus,\nna em i bin brukim bret long ol.\nNa nau yet em i save mekim wankain samting long mipela tu."
      },
      {
        "v": "L",
        "t": "3. Em i pasim han, na i holim han antap long ofa, na i tok:"
      },
      {
        "v": "P",
        "t": "Papa bilong marimari, mipela i askim yu,\nsalim Holi Spirit bilong yu i kam daun\nbilong mekim dispela bret na wain i kamap holi,"
      },
      {
        "v": "L",
        "t": "Em i pasim han, na i mekim Mak bilong Kruse antap long bret na kap wantaim, na i tok:"
      },
      {
        "v": "P",
        "t": "bai tupela i kamap Bodi ✠ na Blut"
      },
      {
        "v": "L",
        "t": "Em i pasim han."
      },
      {
        "v": "P",
        "t": "bilong Jisas Krais, em i Bikpela bilong mipela."
      },
      {
        "v": "L",
        "t": "4. Pris i mas autim klia na stret ol tok i kamap nau, long wanem, em ol tok bilong Bikpela yet."
      },
      {
        "v": "P",
        "t": "Long nait bipo long em i karim pen,\ntaim em i sindaun long Las Kaikai,"
      },
      {
        "v": "L",
        "t": "Pris i kisim bret, em i holim antap liklik long alta, na i tok:"
      },
      {
        "v": "P",
        "t": "em i kisim bret, na em i tenkim yu.\nEm i brukim bret, na em i givim long ol disaipel bilong em,\nna em i tok:"
      },
      {
        "v": "L",
        "t": "Em i daunim het liklik."
      },
      {
        "v": "P",
        "t": "YUPELA OLGETA, KISIM NA KAIKAI LONG EM.\nDISPELA EM I BODI BILONG MI.\nBAI MI GIVIM BILONG ORAITIM YUPELA."
      },
      {
        "v": "L",
        "t": "Pris i soim hostia em i bin konsekretim long ol manmeri. Bihain em i putim hostia gen long plet, na em i brukim skru bilong adorim Krais."
      },
      {
        "v": "L",
        "t": "5. Bihain em i tok:"
      },
      {
        "v": "P",
        "t": "Na long wankain pasin, taim ol i kaikai pinis,"
      },
      {
        "v": "L",
        "t": "Em i kisim kap, em i holim antap liklik long alta, na i tok:"
      },
      {
        "v": "P",
        "t": "em i kisim kap, na em i tenkim yu gen.\nEm i givim kap long ol disaipel bilong em, na em i tok:"
      },
      {
        "v": "L",
        "t": "Em i daunim het liklik."
      },
      {
        "v": "P",
        "t": "YUPELA OLGETA, KISIM NA DRING LONG EM.\nDISPELA EM I KAP BILONG BLUT BILONG MI.\nEM I BLUT BILONG NUPELA KONTRAK I STAP OLTAIM.\nDISPELA BLUT BAI I LUS BILONG TEKEWE SIN\nBILONG YUPELA NA BILONG PLANTI MANMERI.\nYUPELA MEKIM OLSEM BILONG TINGIM MI GEN."
      },
      {
        "v": "L",
        "t": "Em i soim kap long ol manmeri. Bihain em i putim kap gen long korporal, na em i brukim skru bilong adorim Krais."
      },
      {
        "v": "L",
        "t": "6. Nau em i tok:"
      },
      {
        "v": "P",
        "t": "Nau yumi autim bilip bilong yumi."
      },
      {
        "v": "O",
        "t": "Lord, mipela i tokaut long Indai bilong yu,\nna mipela i autim bilip long Kirap Bek bilong yu,\ninap long taim yu kam bek gen."
      },
      {
        "v": "O",
        "t": "Lord, olgeta taim mipela i kaikai dispela Bret,\nna dring long dispela Kap,\nmipela i telimautim Indai bilong yu,\ninap long taim yu kam bek."
      },
      {
        "v": "O",
        "t": "Sevia bilong graun, kisim bek mipela.\nLong Diwai Kros na long Kirap Bek bilong yu,\nyu bin mekim mipela i kamap fri."
      },
      {
        "v": "L",
        "t": "7. Pris i opim na litimapim han, na em i pre:"
      },
      {
        "v": "P",
        "t": "God Papa, yu holi, nau mipela i tingim Krais,\nPikinini bilong yu na Sevia bilong mipela.\nEm i bin karim pen na i dai long Diwai Kros,\nna yu bin bringim em long glori bilong Kirap Bek,\nna yu bin mekim em i sindaun long raithan bilong yu.\nOlsem na nau na inap long taim em bai i kam bek gen,\nmipela i tokaut long bikpela wok bilong laikim pasin bilong yu.\nNa mipela i ofarim long yu dispela Bret bilong givim laip,\nna dispela Kap bilong blesing.\n\nGod Papa, lukdaun wantaim amamas\nlong dispela ofa bilong Sios bilong yu.\nLong dispela ofa,\nmipela i tokaut gen long sakrifais bilong Krais,\nlong Pen na Indai na Kirap Bek bilong em.\nNa mipela i pre,\nbai long strong bilong Spirit bilong laikim pasin bilong yu,\nmipela i ken i stap hap bodi bilong Pikinini bilong yu inap oltaim.\nLong wanem, mipela i save kisim Bodi na Blut bilong em,\nna mipela i kamap wan wantaim em.\n\nLord, mekim Sios bilong yu\ni kamap strong long pasin bilong bilip na laik,\nwantaim Pop bilong mipela N.,\nna Bisop bilong mipela N.\nwantaim ol arapela Bisop, Pris na Diken,\nna wantaim olgeta manmeri yu bin makim pinis bilong yu yet."
      },
      {
        "v": "P",
        "t": "Opim ai bilong mipela,\nbai mipela i ken lukim ol nid bilong ol bratasusa bilong mipela.\nGivim gutpela toktok na gutpela pasin long mipela,\nbai mipela i ken givim bel isi\nlong ol manmeri i karim hevi na i gat wari.\nNa mekim bai mipela i ken helpim ol tru,\nolsem Krais i bin skulim mipela\nlong pasin na long skul bilong em.\nMekim bai Sios bilong yu i ken kamap witnes\nbilong tok i tru na bilong pasin bilong kamap fri,\nbilong gutpela taim na bilong stretpela pasin,\nbai olgeta manmeri i ken painim nupela hop long laip bilong ol.\n\nTingim ol bratasusa bilong mipela (N. na N.)\ni bin dai, na nau ol i slip long bel isi bilong Krais.\nNa tingim tu olgeta arapela daimanmeri,\nyu tasol yu save long bilip bilong ol.\nMekim ol i amamas long lukim pes bilong yu,\nna long taim bilong kirap bek,\npulapim ol long laip tru bilong yu.\n\nNa taim wokabaut bilong mipela hia long graun i pinis,\nkisim mipela tu i go insait long haus bilong yu long heven,\nbai mipela i ken i stap laip wantaim yu inap oltaim.\nLong dispela ples,\nwantaim Santu Maria Virgo, em i Mama bilong God,\nwantaim Santu Josep, man bilong em,\nwantaim ol Aposel na Martir,\n(na wantaim Santu N.: Santu bilong dispela de"
      },
      {
        "v": "L",
        "t": "o Wassantu bilong haus lotu o bilong daiosis)"
      },
      {
        "v": "P",
        "t": "na wantaim olgeta Santu,\nmipela bai i amamas na litimapim nem bilong yu,"
      },
      {
        "v": "L",
        "t": "Em i pasim han."
      },
      {
        "v": "P",
        "t": "long Jisas Krais, em i Pikinini bilong yu."
      },
      {
        "v": "L",
        "t": "8. Em i kisim kap na plet wantaim hostia na litimapim tupela wantaim, na em i tok:"
      },
      {
        "v": "P",
        "t": "Dispela Jisas Krais, long wok bilong Holi Spirit,\nem tasol i rot bilong givim olgeta ona na glori long yu,\nGod Papa, yu strong olgeta, nau na oltaim."
      },
      {
        "v": "O",
        "t": "Amen."
      },
      {
        "v": "L",
        "t": "Nau em i taim bilong Lotu bilong kisim Komunio, p. 570."
      }
    ]
  }
};
