# gvmeurope.ro — Netlify (külön site, NEM a glogiai)

## Fontos

| Site | Netlify | Secret |
|------|---------|--------|
| **glogiai.hu** | `genuine-banoffee-bf6eea` | `NETLIFY_SITE_ID` |
| **gvmeurope.ro** | külön site (pl. `gvm-europe-staging`) | `NETLIFY_GVMEUROPE_RO_SITE_ID` |

**Ne** használd a `genuine-banoffee-bf6eea.netlify.app` címet / Site ID-t a román oldalhoz.
Ha a két secret ugyanaz, a román deploy felülírja a GlogiAI oldalt.

## 1. Dedikált Netlify site (ha még nincs)

1. https://app.netlify.com → **Add new site** → **Import an existing project** → GitHub  
2. Repo: `rg191/gvm-europe-site`, branch: `main`  
3. Beállítások:

| Mező | Érték |
|------|-------|
| **Base directory** | `sites/gvmeurope.ro` |
| **Build command** | *(üres / netlify.toml)* |
| **Publish directory** | `public` |

4. Site settings → **Site details** → másold a **Site ID**-t  
5. GitHub → Settings → Secrets → Actions → `NETLIFY_GVMEUROPE_RO_SITE_ID` = ez a Site ID  
   (különböznie kell a `NETLIFY_SITE_ID`-tól)

Ha már létezik a **gvm-europe-staging** site, annak a Site ID-ját tedd a secretbe.

## 2. Deploy

A workflow jelenleg csak **kézi** indításra fut:

GitHub → **Actions** → **Deploy gvmeurope.ro to Netlify** → **Run workflow**

(A guard elutasítja, ha a secret = glogiai Site ID.)

## 3. DNS — gvmeurope.ro → Netlify

**Jelenlegi DNS:** `gvmeurope.ro` / `www` → `A` rekord a Hetzner szerverre
(a pontos IP-t `dig gvmeurope.ro +short` adja meg)  
**Nameserver:** `dns1.hu` / `dns2.hu` / `dns3.hu`

Amíg ez így van, a böngésző a Hetzner-t látja, nem a Netlify-t.

A Netlify **Domain management** oldalon add hozzá:

- `gvmeurope.ro`
- `www.gvmeurope.ro`

majd a domain regisztrátornál (dns1.hu) állítsd a Netlify által kért rekordokra (tipikusan `www` CNAME → `*.netlify.app`, apex A/ALIAS → Netlify IP).

## 4. Ellenőrzés

1. Dedikált `*.netlify.app` URL — logó + RO/HU/EN  
2. DNS átállás után: https://www.gvmeurope.ro/  
3. https://www.gvmeurope.ro/static/logo.svg → 200  

## 5. Hetzner

Opcionális / archív. DNS Netlify-ra állítása után a Hetzner szerver már nem szolgálja a domaint. Lásd `HOSZTOLAS.md`.

Az átállás után a szerver IP-je **nem lesz többé DNS-ből felderíthető** — ezért
sem ebbe a repóba, sem más publikus helyre ne kerüljön vissza. Ha a Hetzner
szerver továbbra is fut, érdemes a tűzfalán is korlátozni: 80/443 csak a
proxy felől, SSH csak ismert IP-ről.
