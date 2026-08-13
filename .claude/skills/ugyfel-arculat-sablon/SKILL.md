---
name: ugyfel-arculat-sablon
description: >-
  Ügyfelenkénti arculati skill generátor webdesign ügyfélprojektekhez. Ebből a
  sablonból minden ügyfélhez külön arculati skill készül (pl. gvm-europe-arculat),
  ami az adott ügyfél brandjét rögzíti — színeket, tipográfiát, hangnemet,
  komponenseket —, hogy az ügyfélmunka SOHA ne a Niviloop saját arculatát kapja.
  Használd amikor (1) új ügyfélprojekt vagy ügyfél-weboldal indul, (2) a
  felhasználó ügyfélnek készít designtervet, koncepciót vagy stílust, (3) elhangzik:
  "új ügyfél", "ügyfél weboldal", "csinálj arculati skillt", "design terv az
  ügyfélnek", "milyen stílusban legyen az oldala", (4) egy meglévő ügyféloldal
  arculatát kell skillbe rögzíteni. Aktiváld akkor is, ha csak annyit ír a
  felhasználó "csinálj skillt az X cégnek" vagy "ne a saját arculatom legyen".
  NE aktiváld Niviloop-saját tartalomra (arra a niviloop-arculat való), és ne
  aktiváld, ha az adott ügyfélnek már létezik kész arculati skillje — olyankor azt
  használd.
---

# Ügyfél-arculat sablon

Ez a skill egy **generátor**: nem ő maga az arculat, hanem ebből készül minden
ügyfélhez egy saját, önálló arculati skill (`<ugyfel>-arculat` néven). A cél,
hogy az ügyfélmunkában az ügyfél brandje éljen, ne a Niviloopé — és hogy egy új
ügyfélnél percek alatt legyen egy rögzített, újrafelhasználható design-alap,
amiből az ügyfélnek átadható terv is készíthető.

## Mikor mit csinálj

Két alaphelyzet van, először ezt döntsd el:

**A) Az ügyfélnek már van arculata** (meglévő weboldal, logó, brand book,
korábbi anyagok). Ilyenkor a te dolgod a **kinyerés**: ne találj ki semmit,
hanem dokumentáld, ami van. Forrás-sorrend: brand book > élő weboldal
CSS-változói és fontjai > logó színei > korábbi anyagok. Minden hexkódot és
fontnevet a forrásból másolj, ne emlékezetből.

**B) Az ügyfélnek még nincs arculata** (új cég, új oldal, redesign nulláról).
Ilyenkor a te dolgod a **levezetés**: az iparágból, célközönségből és
pozicionálásból javasolj design-irányt. Ehhez olvasd el a
`references/design-izles.md` fájlt — az ott leírt ízlés-alapelvek adják a
minőségi minimumot. A javaslatot **tervként** add át (lásd lent: Designterv az
ügyfélnek), és csak jóváhagyás után rögzítsd skillbe véglegesként. Addig a
generált skill elejére írd oda: `> STÁTUSZ: JAVASLAT — ügyfél-jóváhagyásra vár`.

## Brief: mit kell tudni az ügyfélről

Amit a forrásokból (repo, weboldal, beszélgetés) ki tudsz nyerni, azt ne
kérdezd meg — csak a tényleges hiányokat kérdezd, egyszerre, tömören:

1. **Cég**: hivatalos név, rövid név, székhely, domain, iparág, fő szolgáltatások
2. **Közönség és nyelvek**: kinek szól az oldal, milyen nyelveken (és melyik a fő)
3. **Hangnem**: formális/közvetlen, megszólítás (Ön/te), mit NEM mondhat soha
4. **Vizuális kiindulás**: van-e logó, meglévő színek, kedvelt/utált referenciaoldalak
5. **Technika**: milyen stacken él/készül az oldal (statikus HTML, framework, CMS)

## A skill legenerálása

1. Másold le az `assets/UGYFEL-SKILL-SABLON.md` sablont.
2. Töltsd ki az összes `{{PLACEHOLDER}}` mezőt a brief és a kinyert adatok
   alapján. Ami az adott ügyfélnél nem értelmezhető (pl. nincs többnyelvűség),
   azt a szekciót töröld — ne hagyj üres vagy "N/A" szekciót.
3. A frontmatter `description` legyen "pushy": sorolja fel a cégnevet, a domaint,
   a tipikus kéréseket ("módosítsd az oldalt", "új szekció", "landing az
   ügyfélnek"), hogy a skill magától triggereljen, amikor az ügyfél projektjén
   folyik munka.
4. Mentsd az ügyfél projektjének repójába: `.claude/skills/<ugyfel>-arculat/SKILL.md`.
   Ha a felhasználó a claude.ai fiókjában is használná, csomagold be
   (`package_skill`) és add át `.skill` fájlként.
5. Ellenőrzés a kész skillen:
   - minden hexkód és fontnév forrásból származik (A eset) vagy jóváhagyott
     tervből (B eset);
   - szerepel benne a "mit NE" lista;
   - szerepel benne, hogy a Niviloop-arculat elemei (Syne + teal kombináció,
     Niviloop-hangnem) ügyfélmunkában csak akkor jelenhetnek meg, ha az ügyfél
     brandje történetesen tényleg ezeket használja — és ilyenkor érdemes
     jelezni a felhasználónak az egybeesést;
   - a fájl önállóan megáll: aki csak ezt a skillt látja, tud az ügyfélnek
     konzisztens felületet készíteni.

## Designterv az ügyfélnek (átadható dokumentum)

Ha a felhasználó az ügyfélnek átadható tervet kér (vagy B esetben mindig),
készíts a skill mellé egy rövid, közérthető koncepció-dokumentumot
(`<ugyfel>-designterv.md` vagy kérésre .docx/.pdf): design-irány egy mondatban,
színpaletta mintákkal és indoklással, tipográfia-páros indoklással,
oldalstruktúra szekciólistával, 2-3 hangnem-példamondat. Az indoklás üzleti
nyelven szóljon ("a sötétzöld a megbízhatóságot erősíti a fuvarozásban"), ne
CSS-változókban. A tervben nem szerepelhet Niviloop-branding — ez az ügyfél
dokumentuma.

## Ízlés-alap

Bármelyik esetben (A vagy B), mielőtt vizuális döntést hozol vagy kódolsz,
olvasd el a `references/design-izles.md` fájlt. Az ott leírtak minden generált
ügyfél-skillbe öröklődnek a sablon "Ízlés-alap" szekcióján keresztül — ezért a
sablon kitöltésekor azt a szekciót ne töröld.
