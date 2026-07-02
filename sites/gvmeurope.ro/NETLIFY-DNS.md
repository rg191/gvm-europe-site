# gvmeurope.ro — Netlify deploy + DNS

> A román GVM Europe landing oldal Netlify-on fut (ugyanúgy, mint a glogiai.hu).
> A javított logó és RO/HU/EN nyelvváltó a `sites/gvmeurope.ro/public/` mappában van.

## 1. Új Netlify site létrehozása (egyszer)

1. Jelentkezz be: **https://app.netlify.com**
2. **Add new site** → **Import an existing project** → **GitHub**
3. Repo: **`rg191/gvm-europe-site`**, branch: **`main`**
4. Site beállítások:

| Mező | Érték |
|------|-------|
| **Base directory** | `sites/gvmeurope.ro` |
| **Build command** | *(üresen hagyható — a netlify.toml kezeli)* |
| **Publish directory** | `public` |

5. **Deploy site**
6. Site settings → **Site configuration** → **General** → **Site details** → másold ki a **Site ID**-t (pl. `abc123-def456-...`)
7. Site settings → **Domain management** → **Add a domain**:
   - `gvmeurope.ro`
   - `www.gvmeurope.ro`

A Netlify megadja a DNS rekordokat (általában CNAME a `www`-re, apex-nél A/ALIAS vagy Netlify DNS).

## 2. GitHub secret (automatikus deploy)

GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret neve | Érték |
|-------------|-------|
| `NETLIFY_GVMEUROPE_RO_SITE_ID` | A Netlify Site ID (6. lépés) |

A `NETLIFY_AUTH_TOKEN` már létezik a glogiai.hu-hoz — ugyanazt használja ez a workflow is.

Push a `main`-re után a **Deploy gvmeurope.ro to Netlify** workflow automatikusan fut.

## 3. DNS — gvmeurope.ro átállítása Hetzner-ről Netlify-ra

**Jelenlegi állapot:** `gvmeurope.ro` → A → `46.225.184.176` (Hetzner)

**Cél:** Netlify (a Domain management oldalon látható értékek)

Tipikus beállítás (Tárhely.Eu / domain regisztrátor):

| Rekord | Típus | Érték |
|--------|-------|-------|
| `www` | CNAME | *(pl. `gvmeurope-ro.netlify.app` — a Netlify megmutatja)* |
| `@` (apex) | A vagy ALIAS | *(Netlify load balancer IP — a Netlify Domain settings-ben)* |

Vagy: használd a **Netlify DNS**-t (domain nameserverek átállítása Netlify-ra).

## 4. Ellenőrzés deploy után

1. https://www.gvmeurope.ro/ — logó + román (RO)
2. Fejléc: **RO | HU | EN** — kattintás működik
3. https://www.gvmeurope.ro/hu/ — magyar
4. https://www.gvmeurope.ro/en/ — angol
5. https://www.gvmeurope.ro/static/logo.svg — logó fájl (200 OK)

## 5. Mi változott a korábbi hibákhoz képest

| Probléma | Megoldás |
|----------|----------|
| Logó nem töltődött | Helyi `/static/logo.svg` |
| HU/EN nem működött | `/hu/` és `/en/` oldalak a repóban |
| Hetzner nehéz elérni | Netlify deploy — nincs szerver SSH |

## 6. Hetzner (opcionális, kikapcsolható)

Ha a DNS Netlify-ra mutat, a Hetzner szerver (`46.225.184.176`) már nem szolgálja ki a gvmeurope.ro-t.
A régi Hetzner deploy: `sites/gvmeurope.ro/HOSZTOLAS.md` (archív).
