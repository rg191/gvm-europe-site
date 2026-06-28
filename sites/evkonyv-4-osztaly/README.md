# Negyedik osztály digitális évkönyve — 2024

Statikus, fotó-központú digitális évkönyv (HTML + CSS), nyomtatható / PDF-be
menthető verzióval. Nincs build lépés, nincs backend.

```
sites/evkonyv-4-osztaly/public/
├── index.html        # az évkönyv (5 szekció: borító, születésnapok,
│                     #   kirándulás, év pillanatai, zárás)
├── evkonyv.css       # design + reszponzív rács + nyomtatás/PDF stílus
└── images/
    ├── ph-borito.svg       # helyőrző — borítófotó
    ├── ph-portret.svg      # helyőrző — születésnapi (1:1) fotók
    ├── ph-taj.svg          # helyőrző — kirándulás / év pillanatai (4:3)
    └── ph-osztalykep.svg   # helyőrző — záró osztálykép (3:2)
```

> A jelenlegi nevek, dátumok és aláírások **mintaadatok**, a képek **helyőrzők**.
> Cseréld őket a valós tartalomra a leadás előtt.

## Felépítés (a brief szerint)

1. **Borító** — „Negyedik osztály évkönyve – 2024” + reprezentatív fotó
2. **Születésnapok** — időrend január→december, hónaponkénti fejléccel;
   reszponzív galéria: **mobil 1 / tablet 2 / desktop 3 oszlop**
3. **Osztálykirándulás** — dátum-fejléc + 6–8 nagy fotó, opcionális aláírással
4. **Az év pillanatai** — esemény/hónap szerint, max 12–16 fotó, galéria
5. **Zárás** — nagy osztálykép + tanári dedikáció

## Hogyan cseréld a fotókat

1. **Normalizáld** a képet a leadás előtt: max **1200 px** széles, **JPEG**,
   kb. **150 KB** alatt; egységes arány (születésnap 1:1, többi 4:3).
2. Tedd a fájlt az `images/` mappába (pl. `images/botond.jpg`).
3. `index.html`-ben írd át a megfelelő `src="..."` értéket a helyőrzőről
   (pl. `images/ph-portret.svg` → `images/botond.jpg`) és frissítsd az `alt`
   szöveget, a nevet, dátumot / aláírást.
4. **Születésnapok sorrendje:** maradjon január→december; azonos hónapon belül
   név szerint. A `.month-label` sorok jelölik a hónaphatárt — szükség szerint
   adj hozzá / vegyél el hónapot.
5. Akinek nincs saját képe: használj egy kirándulás/év-pillanatai fotót, ahol
   rajta van.

Minden `<img>` `loading="lazy"` — a fotók csak görgetéskor töltődnek (gyors
első betöltés).

## PDF export / nyomtatás

A fejléc **„⤓ PDF / Nyomtatás”** gombja (vagy `Ctrl/Cmd + P`) megnyitja a
nyomtatást. Cél: **Mentés PDF-ként**.

- A4 vagy US Letter méret, szekciónkénti logikus oldaltörésekkel.
- A fotók/kártyák nem törnek ketté oldalhatáron.
- Fekete-fehér nyomtatáshoz is olvasható.
- A „Háttérgrafikák” opciót kapcsold **be** a böngésző nyomtatási
  párbeszédében, hogy a fotók is megjelenjenek.

## Helyi megtekintés

Nyisd meg az `index.html`-t böngészőben, vagy:

```
cd sites/evkonyv-4-osztaly/public && python3 -m http.server 8080
# majd: http://localhost:8080
```

## Reszponzivitás

Tesztelt töréspontok: mobil (iPhone 12), tablet (iPad), desktop (1920×1080).
Születésnap-galéria: 1 / 2 / 3 oszlop; a tab-ok koppinthatók mobilon.
