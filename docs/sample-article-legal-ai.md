# Amikor a Big Tech ügyvédnek áll: a jogi MI szabályozási térképe 2026-ban

*Az OpenAI, az Anthropic és a Microsoft belépése a jogi vertikálisba nem terméktörténet, hanem
megfelelőségi kérdés. A general counsel dolga nem az, hogy kiválassza a győztest — hanem hogy ne
legyen ő a következő titoksértési ügy.*

> **Minta-deliverable.** Ez a cikk az `editorial-creative` alügynök kimenete, amely kizárólag a
> `compliance-audit` alügynök forrásolt megállapításaira épül (egy Artificial Lawyer-stílusú piaci
> elemzés apropóján). A piaci állításokat (IPO, felvásárlások, partnerségek) nem hitelesíti — csak
> a szabályozási dimenziókat dolgozza fel.

---

## Lead

A jogi MI piaca néhány hónap alatt átrendeződött: a szakcikkek szerint az OpenAI a jogi
szerződéskezelés egyik úttörőjét, az Ironclad alapító-vezérét, Jason Boehmiget igazolta, miközben
az Anthropic és a Microsoft is nyíltan a jogi munkafolyamatokra pozicionál. A piaci forgatókönyvek
— felvásárlások, tőzsdei kilépés, exkluzív partnerségek — érdekesek, de a vállalati jogi vezető
szempontjából lényegtelenek. Ezeket itt kizárólag a forrás állításaként kezeljük; nem hitelesítjük
őket.

Ami a döntéshozó asztalán számít, az más kérdés: ha a négy legnagyobb modellszállító közül
kettő-három egyszerre lesz a jogi szektor MI-infrastruktúrája, az három, már ma hatályos
szabályozási rétegben hagy nyomot — az AI Actben, a GDPR-ben az ügyvédi titoktartással ütközve, és
az ellátási lánc koncentrációs rezsimekben (NIS2, DORA). Ez a cikk ezt a három réteget bontja le,
és megmondja, mit kell tenni 2026-08-02 előtt.

---

## A tévhit, amit érdemes először eltemetni: a jogi MI nem „automatikusan nagy kockázatú"

A piaci pánik első reflexe a túlbiztosítás: ha MI-t használunk a jogban, az biztosan az AI Act
legszigorúbb, nagy kockázatú kategóriájába esik. Ez tévedés — és a tévedésnek ára van, mert
fölösleges megfelelési terhet és lassúságot szül.

A szerződéselemzés, a jogi kutatás és a dokumentumgenerálás egy ügyvédi irodánál vagy belső jogi
csapatnál főszabály szerint **nem** automatikusan nagy kockázatú. Az AI Act III. mellékletének 8.
pontja az *igazságszolgáltatási hatóság által vagy nevében* használt rendszerre céloz — nem a
magánjogi képviselő munkaeszközére ([artificialintelligenceact.eu/annex/3](https://artificialintelligenceact.eu/annex/3)).
A 6(3) cikk szűrője ráadásul kiveszi a szűk, előkészítő jellegű feladatokat a magas kockázatú
besorolás alól ([artificialintelligenceact.eu/article/6](https://artificialintelligenceact.eu/article/6)).

Ez a különbségtétel a teljes megfelelési stratégia tengelye. Aki ezt nem érti, vagy túl-, vagy
alultervez.

## Hol billen át a mérleg: a nagy kockázat valódi kapui

Két helyzetben válik a jogi MI valóban nagy kockázatúvá. Az első: ha **bíróság vagy ADR-fórum
nevében** telepítik — ekkor a III. melléklet 8. pontja közvetlenül aktiválódik. A második, és a
gyakorlatban alattomosabb: ha a rendszer **természetes személyt profiloz** — például prediktív
kimenetel-becslést ad arról, hogy egy adott bíró vagy ellenérdekű fél hogyan fog dönteni vagy
viselkedni.

Itt egy figyelmeztetés, amit a terméklelkesedés szeret elnyelni: a 6(3) cikk szerinti mentességre
**kétség esetén nem szabad támaszkodni**. A Bizottság szűken értelmezi a kivételt. Ha egy eszköz a
„segít előkészíteni" és a „befolyásolja az érdemi értékelést" határán mozog, a biztonságos default
a nagy kockázatú besorolás melletti tervezés — nem ellene.

A gyakorlati következmény: a beszerzési és jogi vezetőnek nem a szállító marketinganyagát, hanem a
**konkrét use case-t** kell minősítenie, eszközönként, funkcióként. Egy platform egyszerre lehet
ártalmatlan a szerződés-összefoglalóban és nagy kockázatú a kimenetel-előrejelzésben.

## A szállító oldali réteg: a GPAI-kötelezettségek már élnek

Itt fordul meg sokak naptára. Az OpenAI és az Anthropic mint általános célú MI- (GPAI-)
szolgáltatók kötelezettségei **nem a jövő** — 2025. augusztus 2. óta alkalmazandók (AI Act 53.
cikk). Technikai dokumentáció, szerzői jogi politika, betanítóadat-összefoglaló: ezeknek
rendelkezésre kell állniuk.

A frontier-modellek ráadásul a szigorúbb, „rendszerszintű kockázat" rezsimbe eshetnek (55. cikk) —
ez azonban **modellenként verifikálandó**, nem általánosítható.

Mit jelent ez a vevő-oldali general counselnek? Hogy a megfelelési bizonyíték egy része nem nálad
keletkezik, hanem a szállítónál. A due diligence kérdése nem az, hogy „megfelel-e az AI Actnek" —
hanem hogy **át tudja-e adni** a dokumentációt, amely a te saját megfelelésedet alátámasztja. Ha
nem, az red flag.

## A réteg, ahol a GDPR-megfelelés nem elég: az ügyvédi titoktartás

Ez a cikk legkényesebb pontja, és itt a legtöbb a félreértés. Az LLM-szolgáltató jellemzően
**adatfeldolgozó** — ami kötelezővé teszi a GDPR 28. cikke szerinti adatfeldolgozói szerződést.
USA-szállítónál kell egy adattovábbítási alap is: DPF vagy SCC (a konkrét mechanizmus
**verifikálandó** szállítónként).

De itt jön a csavar, amit a beszerzés rendszeresen átlát: **a GDPR-megfelelés nem oldja fel a
nemzeti ügyvédi titoktartást.** Magyarországon az Üttv. és a MÜK szabályai külön rezsim. Ügyfél-adat
harmadik fél felhőjébe adása nem pusztán adatvédelmi kérdés — **titoksértés** is lehet, függetlenül
attól, hogy a DPA papíron rendben van. Ehhez nem adatvédelmi tisztviselő, hanem **kamarai jogi
felülvizsgálat** kell.

A general counsel számára ez azt jelenti: a jogi MI bevezetése két, párhuzamos megfelelési sávot
futtat — adatvédelmit és kamarait —, és a kettő nem helyettesíti egymást.

## A negyedik réteg: a koncentráció mint rendszerkockázat

Ha a piac tényleg „három óriáshoz vándorol", az nem csak árazási kérdés. Ellátási lánc szempontból
ez **NIS2-relevancia**: a kritikus szállítók koncentrációja a szabályozott biztonsági lánc része.
Pénzügyi ügyfélnél pedig **DORA** lép be — a harmadik-fél IKT- és koncentrációs kockázat kezelése
**2025. január 17. óta alkalmazandó**.

Az ellensúly nem az, hogy ne használj Big Tech modellt. Hanem hogy a szerződésben legyen
**exit-terv** és **hordozhatósági klauzula** — hogy a függőség ne váljon csapdává, ha az árazás, a
feltételek vagy a szolgáltatás megváltozik.

## A naptár, amelyet nem szabad elrontani

Egy dátum-csapda zárja a képet. A Digital Omnibus 2026. május 7-i ideiglenes megállapodása a III.
melléklet nagy kockázatú kötelezettségeit **2026-08-02-ről 2027-12-02-re halasztaná**. Csábító erre
tervezni — de ez ma **még nem hatályos jog**: formális elfogadás és OJ-közzététel előtt áll. A
felelős tervezési dátum addig változatlanul **2026-08-02** (forrás: Bird & Bird, Gibson Dunn). Aki a
halasztásra épít, lefedetlen kockázatot vállal egy olyan könnyítés reményében, amely még nem
létezik.

---

## Vezetői összefoglaló

A jogi produktivitási MI az ügyvédi irodánál vagy belső csapatnál főszabály szerint nem
automatikusan nagy kockázatú az AI Act alatt — de bírósági/ADR-telepítésnél vagy természetes személy
profilozásánál azzá válik, és a 6(3) mentességre kétség esetén nem szabad építeni. A modellszállítók
(OpenAI, Anthropic) GPAI-kötelezettségei már 2025-08-02 óta élnek, így a due diligence kulcskérdése,
hogy a szállító át tudja-e adni a megfelelést alátámasztó dokumentációt. A GDPR 28. cikk szerinti
adatfeldolgozói szerződés szükséges, de nem elégséges: a nemzeti ügyvédi titoktartást (HU: Üttv./MÜK)
külön, kamarai felülvizsgálattal kell kezelni. A „három óriáshoz vándorlás" koncentrációs kockázatot
hoz (NIS2; pénzügyi ügyfélnél DORA), amelyet exit-tervvel és hordozhatósági klauzulával kell
ellensúlyozni. A felelős tervezési dátum 2026-08-02 marad, mert a Digital Omnibus halasztása ma még
nem hatályos jog.

---

## Vezetői Action Plan

1. **Use case-szintű kockázati besorolás.** Minden bevezetett vagy mérlegelt jogi MI-funkciót külön
   minősíts (szerződéselemzés / kutatás / profilozás / kimenetel-becslés), ne platform-szinten. —
   *Felelős: General Counsel + AI compliance lead.* — *Tét: téves besorolás → nagy kockázatú
   kötelezettségek elmulasztása vagy fölös teher.*
2. **A profilozás és a bírósági/ADR-használat kizárása vagy izolálása.** Tiltsd vagy külön, magas
   kockázatú rezsimben kezeld a természetes személyt profilozó funkciókat. — *Felelős: GC + üzleti
   use case owner.* — *Tét: nagy kockázatú besorolás aktiválódása, a 6(3) mentesség elvesztése.*
3. **Szállítói GPAI-dokumentáció bekérése a due diligence-ben.** Szerződéskötés előtt kérd a
   technikai dokumentációt, szerzői jogi politikát, betanítóadat-összefoglalót (53. cikk);
   frontier-modellnél a rendszerszintű kockázati státuszt **verifikáld** (55. cikk). — *Felelős:
   Beszerzés + GC.* — *Tét: saját megfelelésed nem bizonyítható a szállítói input nélkül.*
4. **GDPR 28. cikk szerinti DPA + adattovábbítási alap rögzítése.** USA-szállítónál a DPF/SCC
   mechanizmust **verifikáld** és dokumentáld. — *Felelős: DPO + GC.* — *Tét: jogszerűtlen
   adattovábbítás, hatósági szankció.*
5. **Kamarai titoktartási felülvizsgálat — a GDPR-tól elkülönítve.** Vizsgáltasd meg az ügyfél-adat
   felhőbe adását az Üttv./MÜK szerint, mielőtt éles adat kerül a rendszerbe. — *Felelős: GC + külső
   kamarai jogi szakértő.* — *Tét: titoksértés, fegyelmi és bizalmi következmény, amelyet a DPA nem
   fed le.*
6. **Koncentrációs kontroll: exit- és hordozhatósági klauzulák.** Építs exit-tervet és portabilitási
   feltételeket; pénzügyi ügyfélnél igazítsd a DORA harmadik-fél keretéhez. — *Felelős: GC +
   IT/IKT-kockázat + (pénzügynél) DORA-felelős.* — *Tét: vendor lock-in, NIS2/DORA megfelelési
   hiány.*
7. **2026-08-02 mint tervezési határidő rögzítése.** Ne tervezz a Digital Omnibus halasztására, amíg
   az nem hatályos; építsd be a felülvizsgálati pontot az OJ-közzétételre. — *Felelős: AI compliance
   lead.* — *Tét: lefedetlen kockázat egy még nem létező könnyítés reményében.*

---

## Midjourney v7 borító-prompt — dokumentarista (B regiszter)

A „jogi munka találkozik a gépi infrastruktúrával" feszültséget valós ügyvédi térben, riportstílusban
fotózzuk — a tekintély a környezetből jön, nem a beállításból.

**Elsődleges (borító, 16:9) — az ügyvéd és a gép:**
```
Documentary shot in a law-firm library at dusk, a general counsel seen from the side reviewing a
contract on a laptop, the screen glow lighting their face, tall shelves of legal volumes blurred
behind, a second monitor showing faint AI chat interface, mixed warm desk lamp and cold screen
light, candid unposed, shot on Leica M6, Kodak Portra 400, fine grain, photojournalism, Magnum
documentary style --v 7 --ar 16:9 --style raw --stylize 120
```

**Variáns — a függőség (server-folyosó, 4:5):**
```
Wide documentary shot, a single lawyer in a suit standing small at the end of a cold data-center
aisle of glowing server racks, looking up, dwarfed by the infrastructure, available light, long
perspective, fine grain, shot on 35mm, Cinestill 800T, Magnum documentary style
--v 7 --ar 4:5 --style raw --stylize 130
```

**Fogalmi alternatíva — mérleg+áramkör csendélet (A regiszter, ha absztraktabb kell):**
```
Abstract still life, a blackened steel scale of justice partially fused with fine brushed-brass
circuit lines on honed Calacatta marble, one taut draped raw silk ribbon, low-key single beam,
desaturated greige and charcoal palette with deep forest accent, shot on Phase One XF IQ4,
editorial minimalism, vast negative space --v 7 --ar 16:9 --style raw --stylize 230
```

Az **elsődleges** a riport (ügyvéd + gép valós térben). A **server-folyosó** a beszállítói függőség /
koncentráció vizuális tézise. A **csendélet** a steril fallback. Sorozathoz közös `--sref` (Portra 400
nappali / Cinestill 800T éjszakai „ház-stock").

---

## Forrásjegyzék

- **AI Act, III. melléklet (8. pont) — igazságszolgáltatási rendszerek:** [artificialintelligenceact.eu/annex/3](https://artificialintelligenceact.eu/annex/3)
- **AI Act, 6. cikk (6(3) szűrő) — nagy kockázatú besorolás kivételei:** [artificialintelligenceact.eu/article/6](https://artificialintelligenceact.eu/article/6)
- **AI Act, 53. cikk — GPAI-szolgáltatói kötelezettségek** (alkalmazandó 2025-08-02 óta).
- **AI Act, 55. cikk — rendszerszintű kockázatú GPAI** (modellenként *verifikálandó*).
- **GDPR, 28. cikk — adatfeldolgozói szerződés;** adattovábbítási alap (DPF/SCC) USA-szállítónál
  *verifikálandó*.
- **Nemzeti ügyvédi titoktartás (HU): Üttv. és MÜK szabályai** — kamarai jogi felülvizsgálat
  szükséges.
- **NIS2** — ellátási lánc koncentrációs kockázat.
- **DORA** — harmadik-fél IKT- és koncentrációs kockázat (alkalmazandó 2025-01-17 óta).
- **Digital Omnibus (2026-05-07 ideiglenes megállapodás)** — a III. melléklet halasztása
  2027-12-02-re *nem hatályos jog* a formális elfogadás/OJ-közzététel előtt. Forrás: **Bird & Bird,
  Gibson Dunn**.
- **Midjourney v7 esztétikai paraméterek:** belső `midjourney-v7-aesthetic` Skill.

*A felvételekre, IPO-ra, felvásárlásokra és partnerségekre vonatkozó piaci állítások a hivatkozott
szakcikk állításai; e cikk nem hitelesíti őket.*

---

**Disclaimer.** Ez az anyag tájékoztató jellegű, nem minősül jogi vagy pénzügyi tanácsadásnak. A
„verifikálandó" jelölésű pontok (frontier-modell 55. cikk szerinti státusz; DPF/SCC adattovábbítási
mechanizmus; a Digital Omnibus hatályba lépése) önálló, naprakész ellenőrzést igényelnek. A végső
jogi és kamarai megfelelési érvényesítés minden esetben minősített szakember és az illetékes ügyvédi
kamara feladata.
