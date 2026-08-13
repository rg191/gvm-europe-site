# OWASP-alapú web sérülékenység-ellenőrzőlista (Strix — Testing fázis)

Ezt a listát a Strix `Testing` fázisában használd. Minden osztálynál: **hipotézis → minimális, célzott próba → eredmény (sérülékeny / nem / bizonytalan)**. Csak engedélyezett célponton, nem-destruktív módon. A tartalomjegyzék:

1. Injection (XSS / SQLi / command / template)
2. Broken Access Control / IDOR
3. Autentikáció és session
4. Security Misconfiguration (fejlécek, CORS, hibák)
5. Érzékeny adat kitettsége
6. SSRF / Open Redirect / Clickjacking / CSRF
7. Sérülékeny és elavult komponensek
8. Kliensoldali kockázatok
9. Súlyosság-besorolás

---

## 1. Injection

### Cross-Site Scripting (XSS)
- **Reflected**: minden paraméter, ami visszatükröződik a válaszba. Próba: egyedi marker (`strix7391`) → keresd a nyers, escape-eletlen visszatükröződést. Ha megjelenik kontextusban (HTML/attribútum/JS/URL), próbálj kontextus-megfelelő, ártalmatlan payloadot.
- **Stored**: bármi, amit az app tárol és később megjelenít (komment, profil, űrlap). Marker beküldése → hol jelenik meg újra.
- **DOM-based**: nézd a kliens JS-t: `innerHTML`, `document.write`, `eval`, `location.hash`/`search` → DOM sink. Ez statikus oldalon a fő XSS-vektor.
- **Igazolás**: ártalmatlan PoC (pl. egyedi marker vagy `console.log`), NE kártékony payload.

### SQL / NoSQL Injection
- Csak ha van backend/adatbázis-háttér. Paramétereknél: hibaalapú (`'`), logikai (`' OR '1'='1`), idő-alapú próbák — óvatosan, nem-destruktívan (SELECT-jellegű, sosem DELETE/UPDATE éles adaton).
- Statikus oldalon jellemzően nem releváns (nincs szerveroldali DB).

### Command / Template Injection
- Ahol felhasználói input parancsba vagy sablonmotorba kerül. Próbák: `${7*7}`, `{{7*7}}`, `; id`. Csak ha van szerveroldali feldolgozás.

## 2. Broken Access Control / IDOR
- Objektum-azonosítók manipulálása (`?id=1` → `?id=2`): elérhető-e más adata?
- Jogosultsági szintek megkerülése: admin útvonalak közvetlen elérése auth nélkül (`/admin`, `/dashboard`).
- Force browsing: kitalálható, nem linkelt útvonalak.
- Statikus oldalon: van-e „védettnek szánt", de közvetlen URL-lel elérhető fájl.

## 3. Autentikáció és session
- Gyenge jelszó-policy, brute-force védelem hiánya (NE indíts valódi brute-force-t éles fiók ellen).
- Session cookie flag-ek: `Secure`, `HttpOnly`, `SameSite`.
- Token kiszivárgás URL-ben, logban, kliens tárolóban (localStorage).
- Kijelentkezés / session lejárat működése.

## 4. Security Misconfiguration
- **Biztonsági fejlécek** (hiányuk → megfigyelés, kihasználhatóság → magyarázd):
  - `Content-Security-Policy` (a legfontosabb XSS-mérséklés)
  - `X-Frame-Options` / CSP `frame-ancestors` (clickjacking)
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security` (HSTS)
  - `Referrer-Policy`
  - `Permissions-Policy`
- **CORS**: túl megengedő `Access-Control-Allow-Origin: *` érzékeny adatnál; reflektált Origin + `Allow-Credentials: true`.
- **Verbose hibák / debug**: stack trace, verziószám, belső útvonal a válaszban.
- **Alapértelmezett / felesleges fájlok**: `/.git/`, `/.env`, `.DS_Store`, `backup.zip`, `/admin`, konfig fájlok.
- **Directory listing** engedélyezve.

## 5. Érzékeny adat kitettsége
- Titkok a kliensoldali kódban (API kulcs, token, jelszó, privát végpont). Grep a JS/HTML-ben: `api_key`, `secret`, `token`, `password`, `Bearer`, AWS/Google kulcsminták.
- HTTPS hiánya vagy kevert tartalom (mixed content).
- Gyenge TLS (elavult protokoll/cipher, lejárt/érvénytelen tanúsítvány).
- PII vagy belső adat kiszivárgása a HTML kommentekben, forráskódban.

## 6. SSRF / Open Redirect / Clickjacking / CSRF
- **Open redirect**: `?url=`, `?next=`, `?redirect=` → átirányít-e külső domainre kontroll nélkül.
- **Clickjacking**: keretezhető-e az oldal (`X-Frame-Options`/CSP hiánya) → érzékeny művelet esetén kockázat.
- **CSRF**: állapotváltó műveletek védelme (token) — ahol van backend session.
- **SSRF**: szerveroldali kérés felhasználói URL alapján — csak backendes appnál.

## 7. Sérülékeny és elavult komponensek
- Listázd a harmadik feles scripteket/könyvtárakat verzióval (JS libek, CDN, widgetek).
- Ellenőrizd ismert CVE-kre / elavult verziókra.
- Subresource Integrity (SRI) hiánya külső scripteknél → CDN-kompromittálás kockázata.

## 8. Kliensoldali kockázatok
- DOM XSS sinkek (lásd 1.).
- Bizalmi feltételezés a kliensen (pl. „ellenőrzés csak JS-ben" — megkerülhető).
- `postMessage` kezelés origin-ellenőrzés nélkül.
- Third-party script túlzott hozzáférése.

## 9. Súlyosság-besorolás
- **Critical**: közvetlen rendszer/adat kompromittálás (RCE, auth bypass, kitett titok éles kulccsal).
- **High**: stored XSS, IDOR érzékeny adaton, gyenge TLS érzékeny forgalmon.
- **Medium**: reflected XSS korlátozott hatással, hiányzó CSP kihasználható kontextusban, open redirect.
- **Low**: hiányzó megerősítő fejlécek közvetlen kihasználhatóság nélkül, információszivárgás.
- **Info**: megfigyelés, best-practice eltérés, hardening-javaslat.
