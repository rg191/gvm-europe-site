# glogiai.hu – hosztolás (Netlify / Tárhely.Eu / Hetzner)

> **Egy helyen minden, ami ehhez az oldalhoz tartozik.**

## Melyiket válaszd?

| Ha… | Akkor… |
|---|---|
| **Nincs Hetzner jelszavad** | → **Netlify** (lent, 1. opció) — ingyenes, GitHub-ból deploy |
| Van Tárhely.Eu ügyféladminod | → **Tárhely.Eu** (2. opció) — FTP feltöltés |
| Van SSH a Hetznerre | → **Hetzner** (3. opció) — Docker |

---

## 1. Netlify (ajánlott — nincs szerver kell)

**Előny:** ingyenes, automatikus deploy GitHub push-ra, HTTPS, nem kell szerver jelszó.

### Lépések

1. Regisztrálj: https://app.netlify.com (GitHub fiókkal is mehet)
2. **Add new site → Import an existing project → GitHub**
3. Repo: `rg191/gvm-europe-site`
4. Build settings (a `netlify.toml` már beállítja):
   - **Publish directory:** `sites/glogiai.hu/public`
   - **Build command:** üres vagy `echo ok`
5. Deploy → kapsz egy URL-t, pl. `gvm-europe-site.netlify.app`
6. **Domain settings → Add custom domain →** `glogiai.hu` + `www.glogiai.hu`
7. Netlify megadja a DNS beállítást — ezt írd be a **Tárhely.Eu** DNS-ben:

```
glogiai.hu      CNAME  →  [a-netlify-site-neve].netlify.app
www.glogiai.hu  CNAME  →  [a-netlify-site-neve].netlify.app
```

Vagy apex (A rekord) esetén Netlify Load Balancer IP-k:
```
glogiai.hu  A  75.2.60.5
glogiai.hu  A  99.83.231.61
```

8. Kész — push után automatikusan frissül az oldal.

### Javítás később

1. Szerkeszd: `sites/glogiai.hu/public/index.html`
2. `git push` → Netlify 1–2 perc alatt deployol

---

## 2. Tárhely.Eu (ha van ügyféladmin hozzáférésed)

A domain már ott van (ns.tns1.eu). A mail szerver IP: `185.208.224.100`.

1. Lépj be: https://tarhely.eu ügyféladmin / cPanel
2. **Fájlkezelő** vagy FTP → `public_html` (vagy a domain mappája)
3. Töltsd fel a `sites/glogiai.hu/public/` tartalmát (`index.html` + `static/` mappa)
4. DNS-ben állítsd az A rekordot:

```
glogiai.hu      A  185.208.224.100
www.glogiai.hu  A  185.208.224.100
```

(Jelenleg `46.225.184.176`-ra mutat — ezt cseréld le.)

---

## 3. Hetzner (csak ha van SSH hozzáférés)

| Mi | Hol |
|---|---|
| Szerver IP | `46.225.184.176` |
| Útvonal | `/srv/sites/glogiai.hu` |
| Konténer | `glogiai-hu-web`, port `9080` |

```bash
ssh root@46.225.184.176
/srv/sites/glogiai.hu/deploy.sh
```

Részletek: `docker-compose.yml`, `deploy.sh` ebben a mappában.

---

## Gyors referencia (minden opcióhoz)

| | |
|---|---|
| **Domain** | `glogiai.hu` |
| **DNS kezelő** | Tárhely.Eu |
| **Forráskód** | [rg191/gvm-europe-site](https://github.com/rg191/gvm-europe-site) |
| **Oldal fájlok** | `sites/glogiai.hu/public/` |
| **index.html** | fő tartalom |
| **static/style.css** | stílus |

## Más site-ok (NE keverd!)

| Oldal | Hol |
|---|---|
| **glogiai.hu** | Ez a projekt (Netlify / Tárhely / Hetzner) |
| **gvmeurope.hu** | Külön szerver (`185.80.49.249`) — fő cégoldal |

## Mappa struktúra

```
sites/glogiai.hu/
├── HOSZTOLAS.md
├── public/
│   ├── index.html
│   └── static/style.css
├── docker-compose.yml    ← csak Hetznerhez
└── deploy.sh             ← csak Hetznerhez

netlify.toml              ← repo gyökér, Netlify-hoz
```
