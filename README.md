# glogiai.hu — GlogiAI platform (statikus oldal)

A **GlogiAI** mesterséges intelligenciára épülő fuvarbörze és logisztikai platform bemutatkozó oldala.
Üzemeltető: **GVM Europe Kft.**

## Tartalom

```
glogiai/public/             # GlogiAI landing (Netlify → glogiai.hu)
├── index.html              # Főoldal (HU)
├── sk/                     # Szlovák verzió
└── en/                     # Angol verzió
sites/
└── gvmeurope.ro/public/    # GVM Europe Románia (Hetzner → gvmeurope.ro)
    ├── index.html          # Román (RO)
    ├── hu/index.html       # Magyar
    ├── en/index.html       # Angol
    └── static/logo.svg     # Helyi logó (nem külső URL)
```

- **glogiai.hu** — Nyelvek: **HU / SK / EN**. Forrás: **`glogiai/public`**. Netlify deploy (`netlify.toml`). A `sites/glogiai.hu/public` szimlink a kompatibilitásért.
- **gvmeurope.ro** — Nyelvek: **RO / HU / EN**. **Saját Netlify site** (nem a glogiai `genuine-banoffee`). Útmutató: `sites/gvmeurope.ro/NETLIFY-DNS.md`.
- A glogiai.hu **nem** a loopmagazin-web / loopmagazin-site repóban van. Cloud Agent: ezt a `gvm-europe-site` klónt kell használni.

Nincs build lépés — tiszta statikus HTML/CSS.

## Deploy

Netlify (lásd `netlify.toml`): push a `main` branchre → GitHub Actions automatikusan deployol.
Publish directory: `glogiai/public`.

**DNS beállítás:** Alex — lásd `glogiai/DNS-ALEX.md` (rövid összefoglaló: `glogiai/ALEX-UZENET.md`).

## Platform URL

A bejelentkezés és regisztráció gombok: **https://app.glogiai.hu**

## Árazás

A főoldalon (HU / SK / EN) és a dedikált árazás oldalakon (`arazas.html`, `sk/arazas.html`, `en/pricing.html`) a Basic (79 €), Pro (99 €) és Premium (129 €) csomagok szerepelnek.
