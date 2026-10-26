import type { MassLine } from "./ordo";

const rub = (text: string): MassLine => ({ voice: "rubric", text });
const sung = (text: string): MassLine => ({ voice: "together", text });
const head = (label: string): MassLine => ({ voice: "cite", text: label, variant: "banner" });

/** Mandatum, Buk Misa pp. 288-289, nn. 10-13. */
export function footWashing(): MassLine[] {
  return [
    head("Wasim Lek"),
    rub("10. Bihain long skul em i taim bilong wasim lek, sapos Pris i skelim olsem em i gutpela long mekim olsem."),
    rub("11. Ol manmeri ol i bin makim pinis namel long Pipel bilong God bilong wasim lek bilong ol, ol i mas kam klostu, na sindaun long ol sia long fran. Pris i ken rausim klos bilong Misa, sapos em i laik. Sampela minista i ken helpim Pris. Em i kapsaitim wara long lek bilong wan wan man o meri, na mekim drai long taul."),
    rub("12. Taim Pris i wasim ol lek, orait ol manmeri i ken singim sampela antipon, o narapela song."),
    rub("Antipon 1 (Lukim Jn 13:4, 5, 15)"),
    sung(`Bihain long Bikpela i kirap na i lusim kaikai,
em i kapsaitim wara long wanpela dis,
na em i stat long wasim lek bilong ol disaipel.
Em i mekim olsem bilong soim pasin long ol.`),
    rub("Antipon 2 (Lukim Jon 13:12, 13, 15)"),
    sung(`Bihain long kaikai wantaim ol disaipel bilong em,
Bikpela Jisas i wasim lek bilong ol, na i tokim ol olsem,
“Ating yupela i save long as bilong dispela mi mekim long yupela?
Mi Tisa na mi Bikpela bilong yupela.
Mi soim pasin long yupela,
na yupela tu i mas mekim wankain pasin
olsem nau mi mekim long yupela.”`),
    rub("Antipon 3 (Jn 13:6, 7, 8)"),
    sung(`“Bikpela, ating yu laik wasim lek bilong mi?”
Jisas i bekim tok bilong em olsem,
“Sapos mi no wasim yu, orait yu no inap i stap wantaim mi.”
{{Ves:}} Em i kam long Saimon Pita. Na Pita i askim em,
- Bikpela, ating yu laik wasim lek bilong mi?
{{Ves:}} Samting mi mekim, nau yu no klia long em.
Tasol bihain bai yu klia.
- Bikpela, ating yu laik wasim lek bilong mi?`),
    rub("Antipon 4 (Lukim Jn 13:14)"),
    sung(`Mi Bikpela na mi Tisa, na mi wasim lek bilong yupela.
Orait yupela tu i mas wasim lek bilong wanpela narapela.`),
    rub("Antipon 5 (Jn 13:35)"),
    sung(`Sapos yupela wan wan i laikim tru ol arapela,
orait dispela bai i soim olgeta man olsem, yupela i disaipel bilong mi.
{{Ves:}} Jisas i tokim ol disaipel bilong em olsem,
- Sapos yupela wan wan i laikim tru ol arapela,
orait dispela bai i soim olgeta man olsem yupela i disaipel bilong mi.`),
    rub("Antipon 6 (Jn 13:34)"),
    sung(`Bikpela i tok olsem, “Mi givim nupela lo long yupela olsem,
yupela wan wan i mas laikim tru ol arapela olsem mi bin laikim yupela.”`),
    rub("Antipon 7 (1 Ko 13:13)"),
    sung(`Pasin bilong bilip, na pasin bilong hop, na laikim pasin
i ken i stap long yupela. Tasol namba wan pasin tru, em i laikim pasin.
{{Ves:}} Nau yumi gat bilip, na hop, na laikim pasin.
Tasol namba wan pasin tru, em i laikim pasin.
- Pasin bilong bilip, na pasin bilong hop, na laikim pasin
i ken i stap long yupela. Tasol namba wan pasin tru, em i laikim pasin.`),
    rub("13. Bihain long wasim lek, orait Pris i mas wasim han bilong em. Bihain em i putim klos bilong Misa gen, na i go bek long sia bilong em. Na em i go pas long Pre bilong ol Bilipmanmeri."),
    rub("No gat Tok Bilip."),
  ];
}

/** Transfer of the Eucharist, Buk Misa p. 297, nn. 37-44. */
export function eucharistTransfer(): MassLine[] {
  return [
    rub("37. Pre Bihain long Komunio i pinis, orait Pris i sanap yet na i putim insens long kap bilong insens, em i blesim insens na i nildaun, na i givim insens long Holi Yukaris tripela taim. Bihain Pris i putim waitpela spesel laplap (humeral veil), em i sanap na kisim siborium, na karamapim em wantaim dispela laplap."),
    rub("38. Prosesio i stat nau wantaim Holi Yukaris, na wantaim kandel na insens tu. Ol i karim Holi Yukaris i go long arapela tabernakel bipo ol i bin redim insait long haus lotu, o long narapela ples. Ol i mas bilasim gut tru dispela tabernakel o dispela narapela ples Holi Yukaris bai i stap long em. Wanpela minista i karim kruse i go pas wantaim tupela minista i holim kandel i lait. Ol manmeri i ken bihainim ol wantaim kandel i lait, sapos ol i laik. Pris i karim Holi Yukaris i kam las, na minista i karim insens i go pas long em. Taim ol i wokabaut, ol i kirapim wanpela singsing, olsem [[Pange, lingua]] (tasol lusim tupela las hap), o narapela singsing bilong onarim Yukaris."),
    rub("39. Taim prosesio i kamap long ples Holi Yukaris bai i stap long em, orait Pris i putim siborium insait long tabernakel, na larim dua bilong tabernakel i stap op. Sapos i gat Diken, orait Diken i ken helpim Pris. Bihain Pris i putim insens long kap bilong insens, na em i nildaun na i givim insens long Holi Yukaris tripela taim. Ol manmeri i singim [[Tantum ergo Sacramentum]] ([[Yumi laik adorim Jisas]]), o narapela singsing bilong onarim Holi Yukaris. Nau Diken, o Pris yet, i pasim dua bilong tabernakel."),
    rub("40. Pris wantaim ol minista i sarap na adorim Jisas liklik taim. Bihain ol i mas nildaun na i go bek long sakristi."),
    rub("41. Nau ol i mas rausim olgeta klos na bilas bilong alta, na alta i mas i stap nating. Na sapos ol inap, ol i mas rausim olgeta kruse long haus lotu tu. Sapos ol i no inap rausim ol kruse, orait ol i mas karamapim ol long laplap."),
    rub("42. Ol lain i bin i stap long Misa bilong Las Kaikai bilong Bikpela i no mas beten Ivining Pre bilong Sios."),
    rub("43. Ol bilipmanmeri i ken adorim Holi Yukaris long nait. Tasol bihain long biknait, ol i no ken singsing tumas na amamas na putim insens, long wanem, em i Gut Fraide pinis."),
    rub("44. Sapos lotu bilong Pen na Indai bilong Bikpela bilong Gut Fraide i no kamap long dispela haus lotu stret, orait Pris i mas pinisim Misa wantaim las blesing, wankain olsem em i save mekim long olgeta Misa. Bihain em i mas putim Holi Yukaris i go bek long tabernakel."),
  ];
}
