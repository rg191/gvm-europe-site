# glogiai.hu — Alexnek: mi változott + DNS teendők

> **Tárgy (e-mailhez):** glogiai.hu — mi változott + DNS teendők

Szia Alex,

Frissítettük a **glogiai.hu** bemutatkozó oldalt. A kód kész és éles — Netlify-ra automatikusan deployol a `main` branch push után. **Neked főleg DNS / hosting oldalon van teendő.**

---

## Mi változott az oldalon (Robi kérésére)

1. **Bejelentkezés gomb** a fejlécben (jobb felső sarok)  
   → ide mutat: **https://app.glogiai.hu**

2. **Szembetűnő Kapcsolat szekció** a főoldalon  
   Elérhetőségek (GVM Europe Kft., cím, e-mailek) + gyors gombok.  
   A menüben is van **Kapcsolat** link.

3. **Bővített lábléc** (4 oszlop)  
   Márka, platform linkek, jogi oldalak, elérhetőség — főoldalon és jogi aloldalakon is (HU / SK / EN).

4. **Árazás kártyák**  
   A regisztráció gombok szintén a platformra mutatnak: **https://app.glogiai.hu**

5. **Deploy**  
   - GitHub repo: `rg191/gvm-europe-site`  
   - Publish mappa: `sites/glogiai.hu/public`  
   - Netlify site: `glogiai-hu.netlify.app`

---

## Amit neked kell csinálni (DNS / hosting)

### 1. Landing oldal — `glogiai.hu` / `www.glogiai.hu` → Netlify

| Rekord | Típus | Érték | Állapot |
|--------|-------|-------|---------|
| `www` | CNAME | `glogiai-hu.netlify.app` | ✅ már jó |
| `@` (apex) | A vagy ALIAS | Netlify load balancer IP | ⚠️ **ellenőrizd** |

- A `www` rendben van.
- A **`glogiai.hu` apex** jelenleg: A → `75.2.60.5` — kérlek ellenőrizd a Netlify Domain settings-ben, hogy ez a Netlify által kért IP-e. Ha nem, állítsd át arra, amit a Netlify mutat.

Netlify: **Site → Domain management → glogiai.hu**

### 2. Platform — `app.glogiai.hu`

| Rekord | Típus | Érték | Állapot |
|--------|-------|-------|---------|
| `app` | A | `185.208.224.100` | ✅ már létezik |
| `platform` | A | `185.208.224.100` | ✅ opcionális alias |

A landing oldal **Bejelentkezés** gombja és az árazás kártyái ide mutatnak.

Ha a platform más IP-n fut, csak az `app` A rekordot kell frissíteni — a HTML-t nem.

**Fontos:** az `app.glogiai.hu` **SSL-jét és a reverse proxy-t** a platform szerveren kell rendben tartani (ez nem a Netlify landing oldal része).

### 3. E-mail (ha releváns)

| Rekord | Típus | Érték |
|--------|-------|-------|
| `@` | MX | `mail.glogiai.hu` (prioritás 0) |

---

## Amit NEM kell DNS-ben / kódban

- A statikus HTML fájlok frissítése — automatikus deploy GitHub → Netlify
- A landing oldal SSL-je — Netlify kezeli

---

## Ellenőrzés, ha kész vagy

1. https://www.glogiai.hu — Kapcsolat szekció + bővített lábléc látszik
2. Fejléc: **Bejelentkezés** → https://app.glogiai.hu megnyílik
3. https://glogiai.hu (apex) — ugyanaz, mint a www

---

## További dokumentáció

- Részletes DNS útmutató: [`DNS-ALEX.md`](./DNS-ALEX.md)
- GitHub link: https://github.com/rg191/gvm-europe-site/blob/main/sites/glogiai.hu/DNS-ALEX.md

Ha valami nem stimmel (pl. az `app` nem tölt be HTTPS-sel), szólj — akkor megnézzük a platform szerver / proxy oldalt is.
