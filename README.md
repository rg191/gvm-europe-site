# glogiai.hu — GlogiAI platform (statikus oldal)

A **GlogiAI** mesterséges intelligenciára épülő fuvarbörze és logisztikai platform bemutatkozó oldala.
Üzemeltető: **GVM Europe Kft.**

## Tartalom

```
sites/glogiai.hu/public/
├── index.html              # Főoldal (HU)
├── legal.css               # Jogi aloldalak közös stílusa
├── aszf.html               # ÁSZF
├── adatkezeles.html        # Adatkezelési tájékoztató (GDPR)
├── cookie.html             # Cookie szabályzat
├── impresszum.html         # Impresszum
├── kapcsolat.html          # Kapcsolat
└── sk/                     # Szlovák verzió (index + 5 jogi oldal)
```

Nyelvek: **HU / SK** (nyelvváltó a fejlécben). Nincs build lépés — tiszta statikus HTML/CSS.

## Deploy

Netlify (lásd `netlify.toml`): Add new site → Import from GitHub → `rg191/gvm-europe-site`, branch `main`.
A publish directory: `sites/glogiai.hu/public`.

## Nyitott teendő

Az árazás szekció (`index.html` + `sk/index.html`) jelenleg **placeholder** csomagadatokkal
(`[kitöltendő]` / `[doplniť]`, `— €`) — a valós árakkal kell kitölteni élesítés előtt/után.
