# Statikus oldal biztonsági megerősítése (Strix)

Ez a referencia a **statikus HTML/CSS/JS** oldalakra szabott (mint glogiai.hu és gvmeurope.ro ebben a repóban, Netlify deployjal). Statikus oldalnál nincs szerveroldali DB/session, ezért a támadási felület más: a hangsúly a **kliensoldali kódon, harmadik feles scripteken, HTTP fejléceken, kitett fájlokon és a form-endpointokon** van.

## Fő kockázatok statikus oldalon

1. **DOM XSS** — a saját JS `innerHTML`/`document.write`/`eval` + `location.hash`/`search` kombinációja.
2. **Harmadik feles script kompromittálás** — CDN/analytics/widget script SRI nélkül.
3. **Hiányzó biztonsági HTTP fejlécek** — CSP, HSTS, X-Frame-Options, nosniff.
4. **Kiszivárgó titkok** — API kulcs/token a kliens JS-ben vagy HTML-ben.
5. **Kitett fájlok** — `/.git/`, `.env`, backup, forrás, `.DS_Store`.
6. **Form-endpoint visszaélés** — külső űrlapkezelő (spam, adatlopás), CSRF.
7. **Subdomain takeover** — elárvult DNS CNAME (pl. törölt Netlify/hosting site).
8. **Mixed content / nem-HTTPS** — kevert http erőforrás HTTPS oldalon.

## Ellenőrzőlista

### A) Kliensoldali kód (repó statikus elemzése — Grep/Read)
- [ ] Keress DOM XSS sinkeket: `innerHTML`, `outerHTML`, `document.write`, `eval(`, `setTimeout(` string-gel, `insertAdjacentHTML`, jQuery `.html(`.
- [ ] Nézd, hogy ezek fogadnak-e felhasználói/URL-eredetű adatot (`location.hash`, `location.search`, `document.referrer`, `postMessage`).
- [ ] Grep titkokra: `api_key`, `apikey`, `secret`, `token`, `password`, `Bearer `, `AKIA` (AWS), `AIza` (Google), `sk_live`, privát végpont-URL-ek.
- [ ] Külső scriptek listája (`<script src=...>`): van-e `integrity=` (SRI) és `crossorigin`?
- [ ] HTML kommentekben nincs-e belső infó, TODO-titok, staging URL.

### B) HTTP biztonsági fejlécek (Netlify-n a `netlify.toml`-ban vagy `_headers` fájlban állítható)
Ajánlott alap fejlécek statikus oldalra:
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Permissions-Policy: geolocation=(), microphone=(), camera=()
```
- [ ] CSP-t **a valós erőforrásokhoz** szabd (ha van külső analytics/CDN/font, engedd meg őket célzottan — ne `*`). Előbb térképezd fel a tényleges third-party forrásokat, majd írd meg a CSP-t úgy, hogy ne törjön el működő funkció.
- [ ] `frame-ancestors 'none'` VAGY `X-Frame-Options: DENY` a clickjacking ellen.
- [ ] HSTS csak akkor, ha az oldal (és aldomainek) tényleg mindig HTTPS.

Netlify példa (`netlify.toml`):
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; ..."
```

### C) Kitett fájlok és útvonalak (passzív próba a scripts/recon.sh-val)
- [ ] `/.git/HEAD`, `/.git/config` → forráskód-szivárgás (kritikus, ha elérhető).
- [ ] `/.env`, `/config.json`, `/backup.zip`, `/.DS_Store`.
- [ ] `robots.txt`, `sitemap.xml` — mit fed fel a struktúráról.
- [ ] Directory listing kikapcsolva.

### D) TLS / HTTPS
- [ ] Érvényes tanúsítvány, nincs lejárat, helyes domain.
- [ ] HTTP → HTTPS átirányítás (Netlify alapból ad, ellenőrizd).
- [ ] Nincs mixed content (http:// erőforrás https oldalon).

### E) Űrlapok és endpointok
- [ ] Hova küld az űrlap (`action=`)? Saját backend, Netlify Forms, vagy külső szolgáltató?
- [ ] Van-e anti-spam (honeypot / captcha)?
- [ ] Nem megy-e érzékeny adat harmadik félhez rejtve.
- [ ] `mailto:` linkek — email-szüretelés kockázata (elfogadható, csak jegyezd fel).

### F) DNS / subdomain
- [ ] Minden CNAME él-e (nincs elárvult rekord törölt hoszting felé → takeover kockázat).
- [ ] SPF / DMARC / DKIM beállítva-e (email-hamisítás elleni védelem), ha a domain küld emailt.
- [ ] CAA rekord (ki adhat ki tanúsítványt).

## Tipikus javítások ebben a repóban
- Biztonsági fejlécek hozzáadása a `netlify.toml`-hoz (mindkét site-hoz: glogiai.hu és gvmeurope.ro külön deploy).
- SRI hozzáadása külső scriptekhez, vagy a script self-hostolása.
- Bármely kitett titok azonnali visszavonása (rotáció) és eltávolítása a kódból + git-előzményből.
- `.gitignore` bővítése, hogy titkok/backupok ne kerüljenek a publish dir-be.
- CSP finomhangolása a tényleges third-party forrásokhoz.

> Megjegyzés: a `gvmeurope.ro` külön Netlify site, a `glogiai.hu` a `netlify.toml` publish dir-jét használja. A fejléceket mindkét deployhoz külön kell alkalmazni (a `netlify.toml` a glogiai deployra vonatkozik; a másikhoz `_headers` fájl vagy saját config kell).
