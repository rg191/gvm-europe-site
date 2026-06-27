# glogiai.hu — DNS beállítás (Alex)

> A statikus landing oldal kódja kész és a `main` branch push után Netlify-ra deployol.
> **Te csak a DNS-t állítsd be** — a tartalmat nem kell módosítanod.

## 1. Landing oldal — `glogiai.hu` / `www.glogiai.hu`

**Cél:** Netlify (`glogiai-hu.netlify.app`)

| Rekord | Típus | Érték | Megjegyzés |
|--------|-------|-------|------------|
| `www` | CNAME | `glogiai-hu.netlify.app` | ✅ már jó (2026-06-27) |
| `@` (apex) | A vagy ALIAS | Netlify load balancer IP | Ellenőrizd a Netlify Domain settings-ben |

A Netlify adminban: **Site → Domain management → glogiai.hu** — ott látod a pontos apex rekordot (A/ALIAS/ANAME), amit a Tárhely.Eu-nál be kell állítani.

**Jelenlegi állapot (2026-06-27):**
- `www.glogiai.hu` → CNAME → `glogiai-hu.netlify.app` ✅
- `glogiai.hu` (apex) → A → `75.2.60.5` — ellenőrizd, hogy ez a Netlify által kért IP

## 2. Platform / bejelentkezés — `app.glogiai.hu`

**Cél:** A GlogiAI alkalmazás szervere (jelenleg `185.208.224.100`)

| Rekord | Típus | Érték | Megjegyzés |
|--------|-------|-------|------------|
| `app` | A | `185.208.224.100` | ✅ már létezik |
| `platform` | A | `185.208.224.100` | ✅ már létezik (opcionális alias) |

A landing oldal **Bejelentkezés** gombja és az árazás kártyái ide mutatnak:
**https://app.glogiai.hu**

Ha a platform más IP-n vagy reverse proxy mögött fut, csak az `app` A rekordot kell frissíteni — a HTML-t nem.

## 3. E-mail (ha kell)

| Rekord | Típus | Érték |
|--------|-------|-------|
| `@` | MX | `mail.glogiai.hu` (prioritás 0) |

## 4. Ellenőrzés deploy után

1. https://www.glogiai.hu — főoldal, Kapcsolat szekció, bővített lábléc
2. Fejléc jobb felső: **Bejelentkezés** → https://app.glogiai.hu
3. https://glogiai.hu (apex) — ugyanaz, mint www (ha az apex DNS jó)

## 5. Amit NEM kell DNS-ben

- A statikus oldal fájljai (`index.html`, jogi oldalak) — GitHub → Netlify automatikus deploy
- SSL: Netlify kezeli a landing oldalt; az `app` subdomain SSL-jét a platform szerveren/proxy-n kell beállítani

---

Kérdés esetén: a repo `sites/glogiai.hu/public/` mappája a forrás, publish dir: `sites/glogiai.hu/public`.
