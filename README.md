# glogiai.hu — GlogiAI platform (statikus oldal)

A **GlogiAI** mesterséges intelligenciára épülő fuvarbörze és logisztikai platform bemutatkozó oldala.
Üzemeltető: **GVM Europe Kft.**

## Tartalom

```
sites/
├── glogiai.hu/public/      # GlogiAI landing (Netlify → glogiai.hu)
│   ├── index.html          # Főoldal (HU)
│   ├── sk/                 # Szlovák verzió
│   └── en/                 # Angol verzió
└── gvmeurope.ro/public/    # GVM Europe Románia (Hetzner → gvmeurope.ro)
    ├── index.html          # Román (RO)
    ├── hu/index.html       # Magyar
    ├── en/index.html       # Angol
    └── static/logo.svg     # Helyi logó (nem külső URL)
```

- **glogiai.hu** — Nyelvek: **HU / SK / EN**. Netlify deploy (`netlify.toml`).
- **gvmeurope.ro** — Nyelvek: **RO / HU / EN**. **Netlify deploy** (`sites/gvmeurope.ro/NETLIFY-DNS.md`).

Nincs build lépés — tiszta statikus HTML/CSS.

## Deploy

Netlify (lásd `netlify.toml`): push a `main` branchre → GitHub Actions automatikusan deployol.
Publish directory: `sites/glogiai.hu/public`.

**DNS beállítás:** Alex — lásd `sites/glogiai.hu/DNS-ALEX.md` (rövid összefoglaló: `sites/glogiai.hu/ALEX-UZENET.md`).

## Platform URL

A bejelentkezés és regisztráció gombok: **https://app.glogiai.hu**

## Árazás

A főoldalon (HU / SK / EN) és a dedikált árazás oldalakon (`arazas.html`, `sk/arazas.html`, `en/pricing.html`) a Basic (79 €), Pro (99 €) és Premium (129 €) csomagok szerepelnek.
