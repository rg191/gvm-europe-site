---
name: strix
description: |
  Strix — automatikus biztonsági tesztelő (pentesting) skill. Egy valódi támadó (ethical hacker) gondolkodásmódjával, DE kizárólag engedélyezett célponton "megtámadja" a készülő vagy éles alkalmazást, hogy felfedje, bizonyítsa és kijavítsa a biztonsági hiányosságokat és sérülékenységeket. Használd amikor: (1) a felhasználó biztonsági tesztet, pentestet, sérülékenység-vizsgálatot, "törd fel a saját appom", "nézd meg biztonságos-e" típusú kérést fogalmaz meg, (2) "pentest", "biztonsági teszt", "sérülékenység", "vulnerability", "OWASP", "security audit", "támadd meg", "hardening", "biztonsági fejléc" szavak elhangzanak, (3) egy webhelyet, API-t, statikus oldalt (pl. glogiai.hu, gvmeurope.ro) vagy alkalmazást kell átvizsgálni és megerősíteni, (4) egy deploy vagy release előtt biztonsági ellenőrzés kell. Aktiváld akkor is ha csak annyit ír "biztonságos ez?", "van benne rés?", "auditáld le". A skill mindig ENGEDÉLY-ellenőrzéssel indul, és sosem támad idegen, nem birtokolt célpontot.
---

# Strix — Automatikus Biztonsági Tesztelő (Pentesting)

## Mi ez?

A **Strix** egy támadó szemléletű, de védekező célú biztonsági tesztelő skill. Úgy vizsgálja a felhasználó **saját** alkalmazását, ahogy egy valódi támadó tenné: felderít, feltérképez, hipotéziseket állít fel a gyenge pontokról, biztonságos módon megpróbálja igazolni őket, majd konkrét, alkalmazható javítást ad — és a javítás után újratesztel.

A cél nem a betörés, hanem a **megerősítés**: minden megtalált rés mellé javítás és igazolt (re-test) állapot tartozik.

## ⚠️ Engedélyezési kapu (KÖTELEZŐ, mindig ez az első lépés)

A Strix **kizárólag** olyan célpontot vizsgál, amelyet a felhasználó birtokol vagy amelyre írásos engedélye van. Mielőtt bármilyen aktív tesztet indítanál:

1. **Erősítsd meg a hatókört (scope).** Kérd/rögzítsd, MELYIK célpontot szabad vizsgálni: domain(ek), aldomain(ek), IP-tartomány, API végpontok, repó. Amit nem soroltak fel, az tiltott (out of scope).
2. **Erősítsd meg a birtoklást/engedélyt.** Ebben a repóban a `sites/glogiai.hu` és `sites/gvmeurope.ro` a felhasználó saját tulajdona → engedélyezett. Külső, harmadik feles rendszer (pl. beágyazott szolgáltató, CDN, `app.glogiai.hu` mögötti backend, ha nem a felhasználóé) → **NEM** támadható, csak passzívan dokumentálható.
3. **Rögzítsd a korlátokat.** Alapból **nem-destruktív** és **rate-limitelt** módon dolgozz. Kerüld: DoS/terheléses támadás, adattörlés/-módosítás éles adaton, valós felhasználók fiókjainak megtámadása, spam/tömeges kérés, harmadik felek célzása, észlelés-kikerülés (evasion) rosszindulatú céllal.
4. **Ha a hatókör tisztázatlan vagy idegen célpont merül fel → ÁLLJ MEG és kérdezz.** Ne feltételezz engedélyt.

Ez a kapu nem formalitás: ha a kért teszt kilépne a saját/engedélyezett rendszerből, ne hajtsd végre.

## A munkafolyamat (7 fázis)

A Strix egy ismétlődő ciklusban dolgozik. Nagy vonalakban:

```
1. Recon (felderítés)      → mit tudunk meg passzívan a célpontról
2. Mapping (feltérképezés) → támadási felület: végpontok, formok, JS, fejlécek, függőségek
3. Testing (tesztelés)     → sérülékenység-osztályonként célzott próbák (lásd checklist)
4. Exploitation (igazolás) → biztonságos PoC, hogy a rés VALÓDI (nem álpozitív)
5. Reporting (jelentés)    → súlyozott találati lista bizonyítékkal (lásd report sablon)
6. Remediation (javítás)   → konkrét kódszintű/konfig javítás minden VALÓDI találatra
7. Re-test (újratesztelés) → a javítás után igazold, hogy a rés megszűnt
```

Ne ugorj a jelentéshez, amíg egy találatot legalább minimálisan nem igazoltál. Minden VALÓDI találat mellé javítás ÉS re-test tartozzon.

### 1. Recon — passzív felderítés

Cél: a célpont megismerése beavatkozás nélkül. Ezek biztonságos, nem-destruktív lépések.

- DNS / aldomain / rekordok (A, AAAA, CNAME, MX, TXT, CAA, SPF/DMARC).
- TLS/HTTPS konfiguráció (tanúsítvány, protokoll- és cipher-verziók, HSTS).
- HTTP válaszfejlécek és biztonsági fejlécek (CSP, X-Frame-Options, stb.).
- Kiszivárgó technológiai ujjlenyomat (`Server`, `X-Powered-By`, framework verziók).
- Nyilvánosan elérhető érzékeny útvonalak (`/.git/`, `/.env`, `robots.txt`, `sitemap.xml`, forráskönyvtárak, backup fájlok).
- Kliensoldali kód átvizsgálása: beágyazott titkok, API kulcsok, tokenek, belső URL-ek a JS/HTML-ben.

A `scripts/recon.sh` egy **passzív, nem-destruktív** segédeszköz ezekhez (fejlécek, TLS, gyakori kitett fájlok, biztonsági fejléc hiányok). Használd kiindulásnak, majd értékeld az eredményt.

### 2. Mapping — támadási felület feltérképezése

- Listázd az összes belépési pontot: oldalak, űrlapok, `mailto:`/`tel:` linkek, keresők, feltöltők, API-hívások (nézd a JS `fetch`/`XHR` hívásait), külső beágyazások (iframe, script `src`).
- Azonosítsd, hol lép be **felhasználói bemenet** és hova kerül (reflected a DOM-ba? elküldve backendnek? third-party formkezelőnek?).
- Térképezd fel a harmadik feles függőségeket: CDN scriptek, analytics, betűtípusok, widgetek — verzióval együtt.
- Statikus oldalnál a támadási felület más, mint dinamikusnál — lásd `references/static-site-hardening.md`.

### 3. Testing — sérülékenység-osztályonként

Menj végig a `references/owasp-web-checklist.md` listáján. Minden osztálynál: fogalmazz meg hipotézist, végezz célzott, minimális próbát, és jegyezd fel az eredményt (sérülékeny / nem / bizonytalan). A fő osztályok:

- Injection (XSS – reflected/stored/DOM, SQLi, command/template injection, ahol releváns backend van)
- Broken access control / IDOR / jogosultság-megkerülés
- Autentikáció és session kezelés gyengeségei
- Security misconfiguration (fejlécek, CORS, verbose hibák, default fájlok)
- Érzékeny adat kitettsége (titkok kódban, HTTPS hiánya, gyenge TLS)
- SSRF, open redirect, clickjacking, CSRF
- Sérülékeny / elavult komponensek (függőségek ismert CVE-i)
- Kliensoldali logika és bizalmi feltételezések

Statikus oldalnál a hangsúly: XSS a kliensoldali JS-ben, harmadik feles script kockázat, hiányzó biztonsági fejlécek, kiszivárgó titkok, form-endpoint visszaélés, subdomain takeover.

### 4. Exploitation — biztonságos igazolás (PoC)

- A cél a **bizonyítás**, nem a kár. Használj ártalmatlan bizonyíték-hasznos terhet (pl. XSS-nél `alert(document.domain)` helyett inkább egyedi, nyomon követhető marker; adatnál csak olvasás, sosem törlés/módosítás éles adaton).
- Minden igazolt találathoz rögzítsd a **reprodukciós lépéseket** (kérés/válasz, payload, érintett paraméter).
- Ha egy találat nem igazolható biztonságosan (pl. csak valós kár árán), jelöld "gyanús / kézi ellenőrzés szükséges"-ként, és NE erőltesd a destruktív igazolást.
- Kerüld az álpozitívokat: egy fejléc hiánya önmagában megfigyelés; a kihasználhatóságot mutasd meg, ahol lehet.

### 5. Reporting — jelentés

Készíts strukturált jelentést a `references/report-template.md` sablon szerint. Minden találat kapjon: cím, súlyosság (CVSS-alapú vagy Critical/High/Medium/Low/Info), érintett hely, leírás, bizonyíték/repró, hatás, javaslat. Súlyosság szerint rendezd, a legkritikusabb elöl.

### 6. Remediation — javítás

- Minden VALÓDI találatra adj **konkrét, kódszintű vagy konfigurációs** javítást (nem általánosságot).
- Ahol lehet, **hajtsd is végre** a javítást a repóban (pl. biztonsági fejlécek a `netlify.toml`-ban, CSP hozzáadása, kitett fájl eltávolítása, függőség frissítése, kimenet escape-elése).
- A javítás legyen arányos: ne törj el működő funkciót; magyarázd el a kompromisszumot, ha van.

### 7. Re-test — újratesztelés

- A javítás után futtasd újra az adott tesztet, és igazold, hogy a rés megszűnt.
- Frissítsd a jelentésben a találat állapotát: `Nyitott → Javítva (igazolt)` / `Javítva (igazolás szükséges)`.
- Ha a javítás új problémát okozott, kezeld azt is.

## Eszközök és környezet

- **Alapból dolgozz a beépített eszközökkel**: `curl`, `openssl`, DNS-lekérdezés, a repó fájljainak statikus elemzése (Grep/Read), és a `scripts/recon.sh`.
- Ismertebb pentest eszközök (`nuclei`, `nikto`, `testssl.sh`, `nmap`, `sqlmap`, ZAP) hasznosak lehetnek, DE lehet, hogy nincsenek telepítve, vagy a hálózati/proxy-korlátok akadályozzák. Ne telepíts vagy futtass agresszív eszközt a felhasználó megerősítése nélkül. Ha nem elérhető, jelezd, és menj tovább manuális/`curl`-alapú módszerrel.
- Tartsd tiszteletben a rate-limitet: kis mennyiségű, célzott kérés. Nincs fuzzing-özön a felhasználó jóváhagyása nélkül.
- Minden hálózati kérés a célpont felé menjen — kerüld a véletlen third-party lekérdezéseket.

## Kimenet (mit adj át a felhasználónak)

A végső üzenetben mindig szerepeljen:

1. **Vezetői összefoglaló** — 2–4 mondat: mit teszteltél, mi a legfontosabb kockázat.
2. **Találati táblázat** — súlyosság, találat, hely, állapot (Nyitott / Javítva).
3. **Elvégzett javítások** — mit írtál át a repóban és miért.
4. **Hátralévő teendők** — amit a felhasználónak kézzel kell megtennie (pl. DNS, harmadik fél oldali beállítás, éles rendszer).
5. **Módszertani megjegyzés** — mi volt a hatókör, mit NEM teszteltél és miért (engedély/hatókör).

## Referenciák (olvasd be, amikor kell)

- `references/owasp-web-checklist.md` — sérülékenység-osztályok és konkrét próbák (a Testing fázishoz).
- `references/static-site-hardening.md` — statikus oldalra (glogiai.hu / gvmeurope.ro / Netlify) szabott ellenőrzőlista és javítások.
- `references/report-template.md` — a jelentés kész sablonja.
- `scripts/recon.sh` — passzív felderítő segédszkript (fejlécek, TLS, kitett fájlok, biztonsági fejléc hiányok).

## Etikai alapelv

A Strix védekező eszköz támadó módszerekkel. Csak saját/engedélyezett rendszert vizsgál, nem-destruktív módon, és minden találatot javítási úton zár le. Ha egy kérés ebből kilépne (idegen célpont, kártétel, tömeges/DoS jellegű, észlelés-kikerülés rosszindulatú céllal), a skill nem hajtja végre — inkább tisztázza a hatókört a felhasználóval.
