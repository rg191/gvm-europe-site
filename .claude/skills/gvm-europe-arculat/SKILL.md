---
name: gvm-europe-arculat
description: >-
  GVM Europe (gvmeurope.ro) arculati skillje — az ügyfél brandjének egyetlen
  igazságforrása: színek, tipográfia, hangnem, komponensek. Használd MINDEN
  olyan munkánál, ami a gvmeurope.ro weboldalt, a GVM Europe landing oldalait
  vagy bármilyen GVM-branded anyagát érinti — akkor is, ha a felhasználó csak
  annyit ír: "adj hozzá egy szekciót a GVM oldalhoz", "frissítsd a gvmeurope.ro
  szövegét", "módosítsd az oldalt", "új szekció kell", "GVM landing".
  NE használd más ügyfél (pl. glogiai.hu) vagy a Niviloop saját tartalmához.
---

# GVM Europe Speditie Freight SRL — arculat

## A cég

- **Hivatalos név**: GVM Europe Speditie Freight SRL
- **Székhely**: Miercurea Ciuc (Csíkszereda), România
- **Domain**: gvmeurope.ro
- **Iparág / szolgáltatások**: nemzetközi közúti fuvarozás, spedíció,
  logisztika és raktározás Romániában és Európában
- **Célközönség**: fuvaroztatni akaró cégek (B2B); az oldalon ajánlatot
  akarnak kérni és meggyőződni a cég megbízhatóságáról

## Nyelvek

Háromnyelvű oldal, a **román a fő nyelv** (gyökér):

- RO: `sites/gvmeurope.ro/public/index.html`
- HU: `sites/gvmeurope.ro/public/hu/index.html`
- EN: `sites/gvmeurope.ro/public/en/index.html`

**Minden tartalomváltozást mindhárom nyelvi verzióban át kell vezetni** —
egy szekció, gomb vagy meta-szöveg sem maradhat el egyik nyelvből sem.
A nyelvváltó (`.lang-switch`) a navigációban van: RO / HU / EN.

## Tipográfia

- **Display / címsor**: Syne 600–800 (`--font-display`), fallback "Avenir Next"
- **Törzsszöveg**: Figtree 400–700 (`--font-body`), fallback "Segoe UI"
- Betöltés: Google Fonts, `display=swap` (lásd a `<head>`-et)
- Címsorok: `letter-spacing: -0.02em`, `clamp()`-alapú méretezés
  (pl. section-title: `clamp(1.9rem, 4vw, 2.75rem)`)

## Színek

Forrás: `sites/gvmeurope.ro/public/static/style.css` `:root` blokk.
Új szín NEM vezethető be az ügyfél jóváhagyása nélkül.

| Token | Hex | Használat |
|---|---|---|
| `--ink` | `#1c2430` | fő szövegszín, sötét felületek |
| `--ink-soft` | `#4a5563` | másodlagos szöveg, nav-linkek |
| `--paper` | `#eef1f4` | oldal-háttér |
| `--paper-deep` | `#e2e7ec` | mélyebb háttérsáv |
| `--surface` | `#f7f8fa` | kártya/felület |
| `--accent` | `#0f6e64` | gombok, hangsúly (sötét teal-zöld) |
| `--accent-deep` | `#0a4f48` | linkek, hover, logó-gradiens vége |
| `--line` | `rgba(28,36,48,0.12)` | elválasztók, borderek |
| `--shadow` | `0 18px 50px rgba(28,36,48,0.12)` | egyetlen árnyék-recept |

## Hangnem

- Megszólítás: **formális** minden nyelven — RO: „dvs.", HU: önöző, EN: sima
  professzionális ("your")
- Stílus: tömör, tényközlő, szolgáltatás-fókuszú; rövid mondatok
- Kulcsüzenetek: biztonság, pontosság, átláthatóság (siguranță,
  punctualitate, transparență) — ezek a cég saját szavai, ezekre építs
- Tilos: túlzó marketing-frázisok („forradalmi", „unlock"), emoji a
  weboldal-szövegben, versenytárs-említés

## Komponensek és stílusjegyek

Új kód ezekhez igazodjon (mind a `static/style.css`-ben):

- **Border-radius**: 8px (gombok, kis elemek), 12px (nagyobb felületek) —
  más érték ne jelenjen meg
- **Easing**: minden átmenet `var(--ease)` = `cubic-bezier(0.22, 1, 0.36, 1)`
- **Gombok**: `.btn` alap + `.btn-primary` (accent háttér, fehér szöveg) és
  `.btn-outline` variáns; hover: `translateY(-2px)`
- **Szekciók**: `section` 5rem paddinggel, benne `.section-container`
  (max-width 1080px) → `.section-title` + `.section-desc` (max 38rem)
- **Belépő animáció**: `.reveal` osztály (fade + 22px translateY), a
  `main.js` IntersectionObserver kapcsolja `is-in`-re — új szekció is ezt
  használja, ne találj ki új animációt
- **Navbar**: fixed, blur-ös áttetsző háttér, görgetésre `is-scrolled`
- **Szolgáltatások**: szándékosan **lista, nem kártyarács** — ezt a döntést
  tartsd tiszteletben
- **Logó**: inline SVG (path-alapú wordmark, fontfüggetlen) — soha ne cseréld
  szöveges/fontos változatra; a logó-gradiens `#0f6e64 → #0a4f48`

## Technika

- **Stack**: statikus HTML + CSS + vanilla JS, nincs build lépés, nincs framework
- **Fájlstruktúra**: minden a `sites/gvmeurope.ro/public/` alatt;
  közös eszközök: `public/static/` (style.css, main.js, hero.svg, about.svg, logo.svg)
- **Deploy**: Netlify (base: `sites/gvmeurope.ro`, publish: `public`), plusz
  önálló Docker/nginx opció (`Dockerfile`, `nginx.conf`) — a repo-gyökér
  `netlify.toml` a glogiai.hu-é, azt ne bántsd

## Mit NE

- Ne használd a Niviloop arculati elemeit vagy hangnemét (az a kivitelező
  saját brandje). Figyelem: a GVM jelenlegi arculata (Syne + teal) vizuálisan
  közel áll a Niviloopéhoz — ettől még a fenti tokenek az ügyfél élő,
  leszállított brandje; ha a szétválasztás felmerül, azt a felhasználóval
  kell egyeztetni, nem önhatalmúlag átszínezni.
- Ne keverd a glogiai.hu oldallal — az másik ügyfél ugyanebben a repóban.
- Ne térj el a fenti tokenektől „szebb" színek vagy fontok irányába — ha
  javításra van ötleted, javaslatként fogalmazd meg a felhasználónak.
- Ne adj az oldalhoz külső függőséget (framework, ikonkészlet, tracking)
  egyeztetés nélkül.

## Ízlés-alap

A fenti brand-szabályokon túl kövesd az általános design-ízlés elveket
(ugyfel-arculat-sablon skill, `references/design-izles.md`): kevés szín,
két betűcsalád, visszafogott animáció, konkrét szövegek, WCAG AA kontraszt,
mobil nézet ellenőrzése. Konfliktus esetén az ügyfél dokumentált brandje az úr.
