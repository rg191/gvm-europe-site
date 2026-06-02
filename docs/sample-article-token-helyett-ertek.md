# A token-éhségből kijózanodás
## Miért fordult át a vezetői figyelem a „minél több MI-fogyasztásról" a valódi megtérülésre

*Magyar adaptáció Tim Keary Forbes-cikke nyomán („Why TokenMaxxing Is Out And ValueMaxxing Is In",
Forbes, 2026. június 2.). A megszólalói állítások a hivatkozott Forbes-cikkből származnak; ez a
magyar változat azok adaptációja.*

> **Munkapéldány — „AI vezetőknek" rovat.** Az `editorial-creative` alügynök kimenete. Forrás-alapú
> adaptáció; minden tény és idézet a hivatkozott Forbes-cikkből. A publikálásra kész verzió:
> [`published/token-helyett-ertek.md`](published/token-helyett-ertek.md).

**Alternatív címek:**
1. *Az 500 milliós tanulság: amikor az MI-számla utoléri a lelkesedést*
2. *Token helyett érték — a 2026-os fordulat, amit minden vezetőnek értenie kell*
3. *„Divathóbort" vagy mérnöki munka? A nagyvállalatok újragondolják az MI-költést*

---

Néhány hónappal ezelőtt a legtöbb nagyvállalatnál még egyetlen kérdés járt körbe a fejlesztői
csapatokban: ki használ több mesterséges intelligenciát? A jelenségnek neve is lett — **TokenMaxxing**
—, és 2026 elején valóságos versennyé fajult. A Forbes hasábjain Tim Keary most arról ír, hogy ez a
verseny kifulladt, és valami józanabb lép a helyébe: a **ValueMaxxing**, vagyis nem a fogyasztás,
hanem a tényleges üzleti érték maximalizálása.

Ahhoz, hogy a fordulat világos legyen, először tisztázzunk két szót.

### Két fogalom, közérthetően

A **token** az MI-modell legkisebb feldolgozási egysége — durván leegyszerűsítve egy szövegdarabka,
amit a rendszer beolvas vagy kiír. Minél többet dolgozik a modell, annál több tokent „fogyaszt", és
minél több a token, annál nagyobb a számla. A token tehát egyszerre a használat és a költség
mérőszáma.

A **kódolóügynök** (mint a Claude Code vagy a Codex) olyan MI-eszköz, amely a fejlesztő helyett vagy
mellett önállóan ír és módosít programkódot. Minél többet futtatják, annál több tokent éget el.

A TokenMaxxing logikája ennyi volt: ha a fejlesztő sok tokent használ, biztosan sokat dolgozik. A
vállalatok ezt termelékenységi mutatóként kezelték — a Meta és a Disney például token-ranglistákat is
bevezetett.

### Amikor megérkezett a számla

A baj az volt, hogy a mutató félrevezet. A Forbes-cikk három intő példát sorol. A **Microsoft**
pénzügyi okokból kivezeti Claude Code-előfizetéseinek nagy részét. Az **Uber** négy hónap alatt
felélte a teljes éves MI-költségvetését. Az Axios beszámolója szerint pedig egy ügyfél egyetlen hónap
alatt 500 millió dollárt költött el, egész egyszerűen azért, mert senki nem szabott használati
korlátot a Claude-licencekhez.

A számok mögött egy elvi probléma áll, amit a megszólalók pontosan megfogalmaznak.

**Dheeraj Pandey**, a DevRev társalapító-vezérigazgatója (korábban a Nutanix vezetője) szerint a token
„nagyszerű mérőszám a bemenetre, de nem a kimenetre vagy az eredményekre". Figyelmeztet: nem lehet
bérköltséget megtakarítani, ha a token többe kerül, mint maga a bér. A helyes számítás szerinte
egyszerű: add össze a bér- és a tokenköltséget, majd döntsd el — produktívabbak lettünk, vagy csak
égetjük a pénzt? „Ez most egy divathóbort" — fogalmaz.

**April Zheng**, a Salesforce Agentforce GenAI-stratégiáért felelős vezetője árnyaltabb. Szerinte a
tokenmaxxing egyszerre hiúsági mérőszám és valóban hatásos, ezért „nehéz teljesen elutasítani". A
hasonlata sokat elárul: a termelékenységet a tokenfogyasztás alapján mérni olyan, mintha valakit az
alapján ítélnénk meg, hogy az autója este 10-kor még a parkolóban állt-e. Jelentheti, hogy keményen
dolgozik — vagy hogy túl részeg volt hazavezetni. A mutató nem tudja a kettő közti különbséget.

### A fordulat: a fix költségvetés logikája

A megszólalók egyetértenek abban, hogy az olcsó MI-számítás kora a végéhez közeledik. **Cassidy
Williams**, a GitHub fejlesztői érdekképviseletének vezető igazgatója szerint az MI „tüzes árverése" —
vagyis a szolgáltatók által támogatott, mesterségesen olcsó számítás — kifut. A számítás drága;
sokszor hatékonyabb közvetlenül elvégezni a munkát, mint mindent egy modellen átfuttatni. A kérdés
átfordul: hogyan hozzuk ki egy fix költségvetésből a legtöbb **értéket**?

**Kylan Gibbs**, az Inworld AI vezérigazgatója még élesebben fogalmaz: aki a tokenfogyasztást
összekeverte a mérnöki munkával, az 2026-ban egy olyan pénzügyi igazgatónak fogja magyarázni az
MI-számláit, aki „már nem találja elbűvölőnek az irányítópultot". A Microsoft döntését pedig
jelzésértékűnek tartja: ez az első eset, hogy egy nagy felhőszolgáltató elállt egy olyan eszköztől,
amelyet a saját mérnökei preferáltak. „Amikor a legmélyebb rálátással bíró üzemeltető a költségfegyelmet
választja, a marketingkampánynak vége."

### Hogyan néz ki a józan mérés?

**Neel Sundaresan**, az IBM automatizálásért és MI-ért felelős vezérigazgatója (a „Bob" platform
vezetője) szerint a tokenmaxxing mint termelékenység-mérés „alapvetően hibás" és könnyen manipulálható.
Helyette több mutatót néznek egyszerre: kódminőség, kódsorok, módosított fájlok, beküldött módosítások,
kijavított hibák, visszavont módosítások. Az IBM-nél egy átlagos fejlesztő havonta legfeljebb 150
dollárt költ — bár akadnak havi 1000 dollár feletti nagyfelhasználók is. A „Bob" platform a megfelelő
modell kiválasztásával fog költséget: kis feladatra kis modell, nagyra nagy. És bár az IBM nem teszi
kötelezővé az MI-használatot, az elkötelezettség mégis 95% felett van. Az elv: „használd, ha kell".

**Becky Trevino**, a Flexera termékigazgatója szerint a valuemaxxing valójában piaci újragondolás.
Megkérdőjelezi a „több eszköz, több token, több költés" reflexet, és a fókuszt a megtérülésre, az
elszámoltathatóságra és az ellenőrzésre tereli. Az érték kulcsa szerinte: erősebb, strukturált
felügyelet, a párhuzamos alkalmazások megszüntetése, átláthatóság és a rövidítések elkerülése.

A józanságnak van ellenpontja is: a cikk megjegyzi, hogy a tokenmaxxinggal egyes startupok — például a
Cleo — valódi eredményt értek el. A kép tehát nem fekete-fehér.

### Mit jelent ez a vezetőnek?

A tanulság a Forbes-cikkből egyszerű: az MI-bevezetés nem csodaszer. A Claude Code puszta
hozzáférhetővé tétele senkit nem tesz automatikusan produktívabbá, és irányítás (governance) nélkül a
költségek kiszámíthatatlanul elszállnak. **Jensen Huang**, az Nvidia vezérigazgatója szerint
„mélységesen riasztaná", ha egy 500 000 dolláros fejlesztő kevesebb mint 250 000 dollárt költene
MI-tokenekre — a token-éhség tehát fentről is ösztönzött. A mostani fordulat épp ezt az ösztönzést
írja felül.

---

## Mit tegyen a vezető — öt pont

1. **Ne a fogyasztást mérd, hanem az eredményt.** A token bemeneti mutató; a kimenet a kódminőség, a
   kijavított hibák, a leszállított érték. Pandey képlete: bér- + tokenköltség egy összegben, és a
   kérdés — produktívabbak lettünk-e?
2. **Szabj használati korlátot a licencekhez.** Az 500 millió dolláros eset oka nem a technológia volt,
   hanem a hiányzó plafon.
3. **Igazítsd a modellt a feladathoz.** Kis feladatra kis (olcsóbb) modell, nagyra nagy — ahogy az IBM
   „Bob" platformja teszi.
4. **Ne kötelezz, hanem tedd hasznossá.** Az IBM kötelezés nélkül is 95% feletti elkötelezettséget ér
   el — „használd, ha kell".
5. **Építs felügyeletet.** Strukturált governance, párhuzamos eszközök kiszűrése, átláthatóság — az
   érték itt keletkezik, nem a fogyasztásban.

---

## Forrás

Tim Keary: *Why TokenMaxxing Is Out And ValueMaxxing Is In*. Forbes, 2026. június 2. A cikkben szereplő
megszólalói idézetek és tényadatok (Microsoft, Uber, Axios, valamint Jensen Huang, April Zheng, Dheeraj
Pandey, Cassidy Williams, Kylan Gibbs, Neel Sundaresan, Becky Trevino nyilatkozatai) a hivatkozott
Forbes-cikkből származnak.

---

## Midjourney v7 — borító-prompt — dokumentarista (B regiszter)

A forrás Zheng-hasonlatát fotózzuk le: „este 10-kor a parkolóban áll-e az autó". A költség és a
kifáradás valós, éjszakai pillanatban — nem absztrakt korong-halom.

**Elsődleges (borító, 16:9) — a parkoló-metafora:**
```
Wide documentary night shot, a vast empty corporate parking lot under sodium lights, a single car
left alone near a glass office tower with a few windows still lit, long shadows, wet asphalt
reflections, shot on 35mm, Kodak Portra 800, available light, photojournalism, fine grain,
melancholic --v 7 --ar 16:9 --style raw --stylize 130
```

**Variáns — a költség, ami fizikai (CFO éjszaka, 4:5):**
```
Candid reportage, a tired finance executive lit only by a glowing dashboard on a monitor in a dark
office at night, reflection of charts in their glasses, loosened tie, late hour, Kodak Portra 800,
available light, fine grain, Magnum documentary style --v 7 --ar 4:5 --style raw --stylize 120
```

**Variáns — a „divathóbort" iróniája (fejlesztői asztal hajnali 2-kor, 16:9):**
```
Documentary still, a developer's desk at 2am, three glowing monitors, empty energy drink cans, a
forgotten sandwich, blue screen glow on an empty chair, nobody present, candid, shot on 35mm,
Cinestill 800T, neon-tinged available light, fine grain --v 7 --ar 16:9 --style raw --stylize 130
```

**Fogalmi alternatíva — „fogyasztás vs. érték" csendélet (A regiszter, ha absztraktabb kell):**
```
Abstract still life, an overflowing heap of tiny dull brass tokens spilling across honed Calacatta
marble, contrasted with a single heavy polished gold ingot in a beam of soft light, low-key, muted
greige and charcoal palette, shot on Phase One XF IQ4, editorial minimalism, vast negative space
--v 7 --ar 16:9 --style raw --stylize 230
```

Az **elsődleges** (üres éjszakai parkoló) a leghűbb a forrás hasonlatához és a legerősebb hangulatilag.
A **CFO** és a **hajnali asztal** a pénzügyi, illetve a „divathóbort" szögre hangol. A **csendélet** a
steril fallback. Sorozathoz közös `--sref` (riportnál a Portra 800 a „ház-stock" az éjszakai darabokhoz).
