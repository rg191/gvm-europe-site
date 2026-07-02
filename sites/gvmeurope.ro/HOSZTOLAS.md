# gvmeurope.ro — Hetzner hosztolás

> **Román GVM Europe landing** (GVM Europe Speditie Freight SRL).  
> Ne keverd össze a `glogiai.hu` vagy `gvmeurope.hu` oldalakkal.

## Gyors referencia

| Mi | Hol |
|---|---|
| **Domain** | `gvmeurope.ro` / `www.gvmeurope.ro` |
| **Szerver IP** | `46.225.184.176` (Hetzner Cloud) |
| **Szerver útvonal** | `/srv/sites/gvmeurope.ro` |
| **Docker konténer** | `gvmeurope-ro-web` |
| **Belső port** | `9081` (127.0.0.1) |
| **Forráskód** | `sites/gvmeurope.ro/public/` |

## Nyelvek

| Nyelv | URL |
|---|---|
| Román (alapértelmezett) | `/` → `index.html` |
| Magyar | `/hu/` → `hu/index.html` |
| Angol | `/en/` → `en/index.html` |

A fejlécben a **RO | HU | EN** váltó relatív linkeket használ — mindhárom HTML fájl a repóban van.

## Logo

A logó helyi SVG fájl: `public/static/logo.svg`  
**Ne** használj külső URL-t (pl. `gvmeurope.hu/wp-content/...`) — az 404-et vagy hotlink tiltást okozhat.

## Telepítés / frissítés

```bash
ssh root@46.225.184.176
/srv/sites/gvmeurope.ro/deploy.sh
```

Első telepítésnél a script klónozza a repót és felépíti a konténert.

## Proxy (Coolify / Envoy)

```
gvmeurope.ro      →  http://127.0.0.1:9081
www.gvmeurope.ro  →  http://127.0.0.1:9081
```

Ha 404-et kapsz (`server: envoy`), a proxy nincs összekötve a **9081**-es porttal.

## Helyi teszt

```bash
cd sites/gvmeurope.ro
docker compose up --build
# Böngésző: http://localhost:9081
# Magyar: http://localhost:9081/hu/
# Angol: http://localhost:9081/en/
```

## Javított hibák (2026-07)

1. **Logo nem töltődött be** — külső/hibás képútvonal helyett helyi `static/logo.svg`
2. **Nyelvváltás nem működött** — hiányzó `hu/index.html` és `en/index.html` fájlok hozzáadva, relatív linkek
