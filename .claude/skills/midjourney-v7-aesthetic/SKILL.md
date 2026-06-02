---
name: midjourney-v7-aesthetic
description: >-
  "High-Fashion Business" Midjourney v7 prompt-paraméterek és anyag-meghatározások
  adatbázisa a GVM Europe / Niviloop vizuális nyelvéhez (Vogue-kompozíció, Phase One XF
  look, márvány/selyem/minimalista építészet). Akkor töltsd be, ha kész, prémium képi
  promptot kell generálni. Te a paraméter-szintaxist adod; a koncepció a hívóé.
---

# Midjourney v7 — "High-Fashion Business" esztétika

> A Midjourney paraméterei és viselkedése verziónként változnak. A `--style raw`,
> `--sref`, omni-reference és a súlyok elérhetősége/szintaxisa az aktuális kiadáshoz
> kötött — kétség esetén verifikáld a Midjourney aktuális dokumentációján.

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

## Kompozíció (Vogue / editorial)
- „editorial composition, generous negative space, single strong subject".
- „eye-level or slightly low angle, confident, restrained" — tekintély, nem hivalkodás.
- Kerüld: zsúfolt háttér, élénk telített színek, lens-flare, stock-fotó beállítottság.

## Kész prompt-sablonok
**Vezetői portré (cikk-nyitókép):**
```
Confident executive in tailored charcoal wool suit, standing in a minimalist travertine
lobby, honed marble surface, soft directional window light, deep controlled shadows,
muted tonal palette, shot on Phase One XF IQ4, Schneider 80mm, editorial composition,
generous negative space --v 7 --ar 4:5 --style raw --stylize 250
```
**Absztrakt borító (compliance / kockázat téma):**
```
Abstract still life, blackened steel scales and draped raw silk on honed Calacatta marble,
low-key lighting, single beam of soft light, desaturated greige and charcoal palette,
shot on Phase One XF, editorial minimalism, vast negative space
--v 7 --ar 16:9 --style raw --stylize 220
```

## Protokoll
1. Kérd be a koncepciót (alany, hangulat, felhasználás: borító/portré/social).
2. Válassz `--ar`-t a felhasználáshoz, anyagokat a szótárból, fényt a Phase One block-ból.
3. Sorozatnál rögzíts `--sref`-et a konzisztens arculathoz.
4. Adj 2–3 variánst, és jelöld, melyik mire optimális.
