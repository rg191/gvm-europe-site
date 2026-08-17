<!-- SABLON — másold, töltsd ki a {{...}} mezőket, a nem értelmezhető
     szekciókat töröld. A kész fájl helye:
     .claude/skills/{{ugyfel-slug}}-arculat/SKILL.md -->
---
name: {{ugyfel-slug}}-arculat
description: >-
  {{Ügyfél rövid név}} ({{domain}}) arculati skillje — az ügyfél brandjének
  egyetlen igazságforrása: színek, tipográfia, hangnem, komponensek. Használd
  MINDEN olyan munkánál, ami a {{Ügyfél rövid név}} weboldalát, landing oldalát,
  vagy bármilyen {{Ügyfél rövid név}}-branded anyagát érinti — akkor is, ha a
  felhasználó csak annyit ír: "{{tipikus kérés 1}}", "{{tipikus kérés 2}}",
  "módosítsd az oldalt", "új szekció kell". NE használd más ügyfél vagy a
  Niviloop saját tartalmához.
---

# {{Ügyfél teljes név}} — arculat

<!-- B esetben (még nincs jóváhagyott arculat) hagyd itt ezt a sort:
> STÁTUSZ: JAVASLAT — ügyfél-jóváhagyásra vár -->

## A cég

- **Hivatalos név**: {{hivatalos cégnév}}
- **Székhely**: {{város, ország}}
- **Domain**: {{domain}}
- **Iparág / szolgáltatások**: {{mit csinál a cég, kinek}}
- **Célközönség**: {{kik és mit akarnak az oldalon elérni}}

## Nyelvek

{{Fő nyelv és további nyelvi verziók + URL-struktúra. FONTOS szabály, ha
többnyelvű: minden tartalomváltozást MINDEN nyelvi verzióban át kell vezetni —
sorold fel a fájlokat/útvonalakat.}}

## Tipográfia

- **Display / címsor**: {{fontnév + súlyok}} — {{honnan töltődik, pl. Google Fonts link}}
- **Törzsszöveg**: {{fontnév + súlyok}}
- {{Egyéb szabály: méretskála, betűköz, címsorhossz}}

## Színek

| Token | Hex | Használat |
|---|---|---|
| `--ink` | {{#hex}} | {{fő szövegszín}} |
| `--paper` | {{#hex}} | {{háttér}} |
| `--accent` | {{#hex}} | {{linkek, gombok, hangsúly}} |
| {{további tokenek a tényleges CSS-ből}} | | |

{{Szabály: honnan származnak a tokenek (fájl + útvonal), és hogy új szín NEM
vezethető be az ügyfél jóváhagyása nélkül.}}

## Hangnem

- Megszólítás: {{Ön/te/dvs. stb., nyelvenként ha eltér}}
- Stílus: {{pl. professzionális, tömör, tényközlő}}
- Kulcsüzenetek: {{pl. megbízhatóság, pontosság — a cég saját szavaival}}
- Tilos: {{túlzó marketing-frázisok, versenytárs-említés, stb.}}

## Komponensek és stílusjegyek

{{A meglévő oldal jellegzetes megoldásai, amiket új munkában követni kell:
border-radius értékek, árnyék-recept, gomb-variánsok, animáció-stílus,
szekció-felépítés, logó-kezelés. Konkrét class-nevekkel/értékekkel, hogy az
új kód illeszkedjen a meglévőhöz.}}

## Technika

- **Stack**: {{statikus HTML/framework/CMS}}
- **Fájlstruktúra**: {{hol élnek a forrásfájlok a repóban}}
- **Deploy**: {{hova és hogyan megy ki}}

## Mit NE

- Ne használd a Niviloop arculati elemeit (az a kivitelező saját brandje).
- {{ügyfél-specifikus tiltások}}
- Ne térj el a fenti tokenektől "szebb" színek vagy fontok irányába — ha
  javításra van ötleted, javaslatként fogalmazd meg a felhasználónak.

## Ízlés-alap

A fenti brand-szabályokon túl kövesd az általános design-ízlés elveket
(ugyfel-arculat-sablon skill, `references/design-izles.md`): kevés szín,
két betűcsalád, visszafogott animáció, konkrét szövegek, WCAG AA kontraszt,
mobil nézet ellenőrzése. Konfliktus esetén az ügyfél dokumentált brandje az úr.
