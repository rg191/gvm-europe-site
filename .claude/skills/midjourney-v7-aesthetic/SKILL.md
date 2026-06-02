---
name: midjourney-v7-aesthetic
description: >-
  Midjourney v7 prompt-paraméterek a GVM Europe / Niviloop vizuális nyelvéhez, KÉT
  regiszterben: (1) "High-Fashion Business" csendélet (Vogue-kompozíció, Phase One XF look,
  márvány/selyem) és (2) Dokumentarista / riport (Magnum-féle decisive moment, available
  light, filmszemcse, valós emberek és terek). Akkor töltsd be, ha kész, prémium képi
  promptot kell generálni. Te a paraméter-szintaxist adod; a koncepció a hívóé.
---

# Midjourney v7 — GVM Europe vizuális nyelv

> A Midjourney paraméterei és viselkedése verziónként változnak. A `--style raw`,
> `--sref`, omni-reference és a súlyok elérhetősége/szintaxisa az aktuális kiadáshoz
> kötött — kétség esetén verifikáld a Midjourney aktuális dokumentációján.

## Két regiszter — mikor melyik
- **A) High-Fashion csendélet** — absztrakt, anyagközpontú, ember nélkül. Akkor jó, ha a téma
  fogalmi (compliance, kockázat, mérleg), és a „Quiet Luxury" steril eleganciája a cél.
- **B) Dokumentarista / riport** — valós emberek, terek, pillanatok; Magnum-féle decisive moment.
  Akkor jó, ha a téma emberi (generációk, munkahely, döntés, kifáradás) — elevenebb, kevésbé steril.
Kérdezd meg (vagy döntsd el a téma alapján), melyik regiszter illik. Adhatsz mindkettőből variánst.

## Alap-szintaxis (v7)
```
<jelenet leírása>, <anyagok>, <megvilágítás>, <kamera/objektív>, <hangulat>
--v 7 --ar 3:2 --style raw --stylize 250 --quality 2
```
- `--v 7` — v7 motor. `--style raw` — visszafogottabb, fotorealistább, kevésbé „díszített".
- `--ar` — képarány: `3:2` szerkesztői fotó, `4:5` portré/social, `16:9` borító/banner.
- `--stylize` (`--s`) — esztétikai erő (200–300 a visszafogott prémium tartomány).
- `--sref <url/seed>` — stílus-referencia a konzisztens arculathoz (sorozatoknál ajánlott).
- Kerüld a `--chaos` magas értékét: a „Quiet Luxury" konzisztenciát kíván, nem meglepetést.

## Anyag- és textúra-szótár
- **Márvány:** „honed Calacatta marble, soft veining, matte finish".
- **Selyem/szövet:** „draped raw silk, subtle sheen, fine fold detail".
- **Fém:** „brushed brass / blackened steel, low-key reflection".
- **Építészet:** „minimalist architecture, travertine, negative space, clean sightlines".
- **Bőr/papír:** „full-grain leather, embossed detail" / „heavyweight matte paper stock".

## Megvilágítás és kamera (Phase One XF look)
- **Kamera:** „shot on Phase One XF, IQ4 150MP back" — nagy felbontású, médium formátum jelleg.
- **Objektív:** „Schneider 80mm" (portré), „35mm" (környezeti).
- **Fény:** „soft directional window light, deep controlled shadows, low-key" — drámai, tiszta.
- **Paletta:** „muted, desaturated, tonal — greige, bone, charcoal, deep forest".

## Kompozíció (Vogue / editorial) — A regiszter
- „editorial composition, generous negative space, single strong subject".
- „eye-level or slightly low angle, confident, restrained" — tekintély, nem hivalkodás.
- Kerüld: zsúfolt háttér, élénk telített színek, lens-flare, stock-fotó beállítottság.

## Dokumentarista / riport — B regiszter
A cél a valós pillanat, nem a steril elegancia. Magyar fordítás: élet, ember, megrendezetlenség.

- **Közös „house style" utótag** (bármely jelenetre fűzhető):
  `available natural light, candid unposed reportage, fine film grain, photojournalism,
  Magnum documentary style --v 7 --style raw --stylize 120`
  (A `--stylize` 100–140 a realizmust védi; magasabb érték „szépíti" és hiteltelenít.)
- **Kamera/film-szótár** (ez adja a karaktert, válassz egy „ház-stockot" sorozathoz):
  - „shot on Leica M6, Kodak Portra 400" — meleg, lágy bőrtónus, prémium riport (ajánlott alapérték).
  - „Ilford HP5 black and white" — kontrasztos fekete-fehér, hiány/feszültség.
  - „Cinestill 800T" / „Kodak Portra 800" — éjszakai neon, available light, melankólia.
  - Objektív: „35mm reportage" (környezeti), „50mm" (alak), enyhe „motion blur" a mozgáshoz.
- **Arc-óvatosság:** a felismerhető arc a Midjourney gyenge pontja — komponálj „háttal /
  oldalról / off-frame tekintet / over-the-shoulder / kéz-közeli" beállítást; ez biztonságosabb
  ÉS gyakran erősebb is (a decisive moment a gesztusban van, nem a szembenézésben).
- **Decisive moment:** egy konkrét fél-másodperc (egy kétkedő tekintet, egy hátratolt szék, egy
  üres parkoló egyetlen autóval) többet mond, mint egy beállított csoportkép.
- Kerüld: stúdió, pózolt mosoly, túl tiszta/rendezett tér, telített reklámszín.

## Kész prompt-sablonok
**Vezetői portré (cikk-nyitókép):**
```
Confident executive in tailored charcoal wool suit, standing in a minimalist travertine
lobby, honed marble surface, soft directional window light, deep controlled shadows,
muted tonal palette, shot on Phase One XF IQ4, Schneider 80mm, editorial composition,
generous negative space --v 7 --ar 4:5 --style raw --stylize 250
```
**Absztrakt borító (compliance / kockázat téma) — A regiszter:**
```
Abstract still life, blackened steel scales and draped raw silk on honed Calacatta marble,
low-key lighting, single beam of soft light, desaturated greige and charcoal palette,
shot on Phase One XF, editorial minimalism, vast negative space
--v 7 --ar 16:9 --style raw --stylize 220
```
**Riport-tabló (emberi / munkahely téma) — B regiszter:**
```
Wide environmental shot of an open-plan office at dusk, a lone older executive reading a paper
printout, younger colleagues huddled around a glowing monitor across the room, empty desks between
them, mixed tungsten and cold screen light, shot on Leica M6, Kodak Portra 400, available light,
candid reportage, fine grain, Magnum documentary style --v 7 --ar 16:9 --style raw --stylize 120
```

## Protokoll
1. Kérd be a koncepciót (alany, hangulat, felhasználás: borító/portré/social).
2. **Válassz regisztert** (A csendélet / B riport) a téma alapján — fogalmi → A, emberi → B.
3. Válassz `--ar`-t, anyagot/film-stockot a megfelelő blokkból, és a regiszterhez illő `--stylize`-t
   (A: 200–250, B: 100–140).
4. Sorozatnál rögzíts `--sref`-et (B-nél egy „ház-stock" filmtípust is) a konzisztens arculathoz.
5. Adj 2–3 variánst, és jelöld, melyik mire optimális.
