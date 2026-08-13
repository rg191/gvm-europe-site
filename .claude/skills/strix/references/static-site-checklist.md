# Statikus / marketing oldal — biztonsági checklist

Ez a lista statikus HTML/CSS oldalakra készült (mint a `glogiai.hu` és
`gvmeurope.ro` ebben a repóban). Nincs szerveroldali kód, ezért a támadási
felület a **konfiguráció**, a **külső függőségek**, a **kliensoldali
viselkedés** és a **DNS/e-mail** körül összpontosul. Haladj végig
kategóriánként; minden tételnél döntsd el, érintett-e, majd igazold a hatást.

## 1. HTTP biztonsági fejlécek (deployolt oldalon és a Netlify configban)

A statikus oldalak legnagyobb „olcsó" nyeresége. Ellenőrizd a `netlify.toml`
`[[headers]]` blokkjait és a valós HTTP válaszokat.

- **Content-Security-Policy (CSP)** — a legfontosabb XSS-elleni védelem.
  Hiánya = Medium. Legyen legalább `default-src 'self'`, a külső CDN-ek
  (fontok, szkriptek) explicit engedélyezve, `object-src 'none'`,
  `base-uri 'self'`, `frame-ancestors 'none'` (ha nem szabad beágyazni).
  Kerüld a `'unsafe-inline'` / `'unsafe-eval'` engedélyeket script-src-ben.
- **Strict-Transport-Security (HSTS)** — `max-age=31536000; includeSubDomains`.
  Hiánya = Low/Medium.
- **X-Content-Type-Options: nosniff** — Low, ha hiányzik.
- **X-Frame-Options: DENY** vagy CSP `frame-ancestors 'none'` — clickjacking
  ellen. Hiánya = Low/Medium a felület függvényében.
- **Referrer-Policy** — `strict-origin-when-cross-origin` vagy szigorúbb.
- **Permissions-Policy** — kapcsold ki a nem használt böngésző-API-kat
  (kamera, mikrofon, geolokáció): `geolocation=(), camera=(), microphone=()`.

## 2. Külső függőségek integritása

- **Subresource Integrity (SRI)** — minden külső `<script src>` és
  `<link rel="stylesheet">` kapjon `integrity` + `crossorigin="anonymous"`
  attribútumot. SRI nélkül egy feltört CDN tetszőleges kódot futtathat az
  oldaladon (supply-chain kockázat). Hiánya külső, harmadik feles forrásnál =
  Medium.
- **Külső domainek számbavétele** — listázd, honnan tölt az oldal erőforrást.
  Minden extra domain bővíti a támadási felületet és a nyomkövetést.
- **Elavult / sérülékeny library** — ha van beágyazott JS könyvtár, nézd meg a
  verziót és az ismert CVE-ket.

## 3. Kevert tartalom és linkbiztonság

- **Mixed content** — `http://` hivatkozás HTTPS oldalon (kép, szkript, link).
  A böngésző blokkolhatja vagy man-in-the-middle-re nyit. Cél: minden `https://`.
- **`target="_blank"` `rel="noopener noreferrer"` nélkül** — reverse tabnabbing:
  a megnyitott oldal a `window.opener`-en át átirányíthatja az eredeti fület.
  Low, de triviálisan javítható.
- **Nyílt átirányítás** — ha bármilyen JS egy paraméter alapján irányít át
  (`location = param`), az adathalászathoz használható.

## 4. Kliensoldali viselkedés

- **Inline eseménykezelők és `javascript:` URL-ek** — nehezítik a szigorú
  CSP-t; keresd az `onclick=`, `onload=` stb. mintákat.
- **DOM-alapú XSS** — ha JS beír felhasználói/URL-adatot a DOM-ba
  (`innerHTML`, `document.write`, `insertAdjacentHTML` szűrés nélkül).
- **`postMessage` kezelők** — ellenőrzik-e az `event.origin`-t?
- **localStorage/sessionStorage** — nincs-e benne érzékeny adat vagy token?

## 5. Beégetett titkok és kitett fájlok

- **Titkok a forrásban** — API-kulcs, token, jelszó, privát végpont HTML/JS-ben.
  Bármi, ami a kliensre kerül, publikus. High, ha valódi titok.
- **Kitett érzékeny fájlok** — `.git/`, `.env`, `.DS_Store`, backup (`*.bak`,
  `*~`), `sitemap`/könyvtárlistázás, admin/staging útvonalak, forráskomment
  belső infóval.
- **Metaadat-szivárgás** — belső hosztnevek, e-mailek, verziószámok
  kommentekben vagy a válasz fejlécekben (`Server`, `X-Powered-By`).

## 6. Űrlapok és harmadik feles beágyazások

- **Űrlap célpont (action)** — hová megy az adat? HTTPS-e? Saját vagy külső
  szolgáltató? Van-e spam/CSRF védelem (pl. Netlify Forms honeypot)?
- **Kapcsolat/feliratkozás űrlap** — nincs-e nyílt e-mail-injektálás vagy
  visszaigazolás nélküli tömegküldés lehetősége a backendben.
- **Süti-bannerek / consent** — a nyomkövető szkriptek tényleg csak
  hozzájárulás után töltődnek? (GDPR-releváns, a repó jogi oldalaival össze kell
  csengjen.)

## 7. DNS és e-mail (domain-szintű védelem)

Statikus oldalnál is a domain a márka — a hiánya adathalászatra ad teret.

- **SPF, DKIM, DMARC** — ha a domainről mennek e-mailek, e nélkül könnyen
  hamisítható a feladó. `dig TXT` a `_dmarc` és a root rekordra.
- **CAA rekord** — korlátozza, mely CA adhat ki tanúsítványt a domainre.
- **Tanúsítvány** — érvényes, nem járt le, teljes lánc, erős TLS (nincs
  TLS 1.0/1.1). Ellenőrizhető `openssl s_client` vagy online skennerrel.

## Gyors nem-romboló ellenőrzések (éles oldalon is biztonságos)

```bash
# Válaszfejlécek megtekintése
curl -sSI https://glogiai.hu | sort

# Kevert tartalom / külső források gyors keresése a forrásban
python3 .claude/skills/strix/scripts/recon_static.py sites/ 

# DNS e-mail védelem
dig +short TXT glogiai.hu
dig +short TXT _dmarc.glogiai.hu

# TLS lejárat és lánc
echo | openssl s_client -connect glogiai.hu:443 -servername glogiai.hu 2>/dev/null | openssl x509 -noout -dates -issuer
```
