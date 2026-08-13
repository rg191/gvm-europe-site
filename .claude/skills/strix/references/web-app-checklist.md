# Dinamikus webalkalmazás / API — biztonsági checklist

Szerveroldali logikát, adatbázist, hitelesítést tartalmazó appokhoz és
API-khoz. A szerkezet az **OWASP Top 10** és az **OWASP ASVS/WSTG** logikáját
követi. Minden belépési pontot (paraméter, fejléc, süti, body, útvonal,
fájlfeltöltés) próbálj végig a releváns kategóriákkal, és **igazold a hatást**,
mielőtt jelentenéd.

## A01 — Hozzáférés-vezérlés (Broken Access Control)
- **IDOR** — objektumazonosító (`/api/orders/123`) átírásával elérsz-e más
  felhasználó adatát? Vízszintes és függőleges jogosultság-emelés.
- **Function-level auth** — admin végpontok elérhetők-e sima felhasználóként,
  csak azért mert a UI elrejti a gombot?
- **Elérési út bejárás (path traversal)** — `../` fájlolvasás.
- **CORS félrekonfigurálás** — `Access-Control-Allow-Origin: *` hitelesített
  adaton, vagy origin visszatükrözés `Allow-Credentials: true` mellett.
- **CSRF** — állapotváltó műveleteknél van-e token/SameSite süti?

## A02 — Kriptográfiai hibák
- Érzékeny adat titkosítatlan átvitele vagy tárolása.
- Gyenge hash jelszóhoz (MD5/SHA1 só nélkül) bcrypt/argon2 helyett.
- Kiszámítható tokenek, gyenge véletlenszám, keményen kódolt kulcsok.

## A03 — Injektálás
- **SQL/NoSQL injection** — paraméterekben, fejlécekben, JSON mezőkben.
  Próbáld: `'`, `" OR 1=1 --`, idő-alapú (`SLEEP`) vak teszt.
- **Command injection** — ha input shell-parancsba kerül.
- **XSS** — reflektált, tárolt, DOM-alapú. Ellenőrizd a kimeneti kódolást
  minden helyen, ahol felhasználói adat jelenik meg.
- **Template injection (SSTI)**, **LDAP**, **XPath**, **header injection**.

## A04 — Nem biztonságos tervezés
- Üzleti logikai hibák: kupon többszöri beváltása, ár manipulálása a kérésben,
  rate limit hiánya kritikus műveleten (jelszó-visszaállítás, OTP).
- Munkafolyamat-lépések átugrása (pl. fizetés kihagyása).

## A05 — Hibás biztonsági konfiguráció
- Alap-hitelesítők, felesleges nyitott funkciók, részletes hibaüzenetek/
  stacktrace, debug mód éles környezetben.
- Hiányzó biztonsági fejlécek (lásd static-site-checklist 1. pont).
- Nyitott felügyeleti felületek, könyvtárlistázás, kitett `.git`/`.env`.

## A06 — Sérülékeny és elavult komponensek
- Függőségek verziója vs. ismert CVE-k (npm/pip/gem audit).
- Elavult szerver-/keretrendszer-verzió a fejlécekben.

## A07 — Azonosítás és hitelesítés hibái
- Gyenge jelszószabály, hiányzó brute-force védelem és rate limit.
- Hibás munkamenet-kezelés: kijelentkezés után is él a session, session
  fixation, `HttpOnly`/`Secure`/`SameSite` süti-attribútumok hiánya.
- Hibás jelszó-visszaállítás (kitalálható token, user enumeration).
- Hiányos MFA, megkerülhető 2FA.

## A08 — Szoftver- és adatintegritási hibák
- Nem biztonságos deszerializáció.
- Aláírás-ellenőrzés nélküli auto-update / CI-CD supply chain.
- SRI hiánya külső szkripteknél.

## A09 — Naplózás és monitorozás hiányosságai
- Biztonsági események (bejelentkezés, hozzáférés-megtagadás) naplózatlanok.
- Érzékeny adat (jelszó, token) a logban.

## A10 — SSRF (Server-Side Request Forgery)
- A szerver felhasználó által megadott URL-t hív le? Belső hálózat, cloud
  metadata endpoint (`169.254.169.254`) elérhető-e rajta keresztül?

## API-specifikus (OWASP API Top 10)
- Objektum- és property-szintű jogosultság (BOLA/BOPLA).
- Túl bőkezű adatvisszaadás (excessive data exposure) — a kliens szűr, nem a
  szerver.
- Hiányzó rate limit, tömeges hozzárendelés (mass assignment).
- Nem dokumentált / régi API-verziók (shadow/zombie API).

## Módszertan minden belépési pontnál
1. Azonosítsd az inputot és hogy hova kerül (SQL, HTML, shell, fájlrendszer,
   URL, log).
2. Küldj ártalmatlan próbajelet, figyeld a visszajelzést (hibaüzenet, késés,
   tükrözés).
3. Ha jel van, minimális bizonyító payloaddal igazold — ne menj tovább a
   szükségesnél, éles adaton semmiképp.
4. Rögzítsd: kérés, válasz, hatás, súlyosság, javítás.
