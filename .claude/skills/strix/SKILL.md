---
name: strix
description: >-
  Automatizált biztonsági tesztelő (pentesting) skill — egy valódi támadó
  szemével vizsgálja végig a saját, engedélyezett alkalmazásaidat és
  weboldalaidat, hogy felfedje és javasolja a biztonsági hiányosságok és
  sérülékenységek javítását. Használd amikor: (1) a felhasználó biztonsági
  tesztet, pentestet, sérülékenység-vizsgálatot, "hackeld meg a saját
  oldalunkat", security review-t vagy audit-ot kér; (2) "biztonság", "pentest",
  "sérülékenység", "vulnerability", "XSS", "CSP", "security header", "OWASP",
  "kockázat", "adatszivárgás", "audit" szavak hangzanak el egy saját projekt
  kapcsán; (3) deploy vagy kiadás előtt ellenőrizni akarod, hogy egy
  weboldal/webalkalmazás biztonságos-e; (4) egy statikus oldal (glogiai.hu,
  gvmeurope.ro) vagy webapp konfigurációját, fejléceit, külső szkriptjeit,
  űrlapjait akarod átvizsgálni. Aktiváld akkor is ha csak annyit ír "nézd át
  biztonságilag", "van-e ezen rés", "törhető-e ez", "mennyire biztonságos".
  CSAK saját tulajdonú vagy írásban engedélyezett célpontra alkalmazd —
  idegen rendszer engedély nélküli tesztelését a skill nem végzi el.
---

# Strix — automatizált biztonsági tesztelés (pentesting)

A Strix úgy vizsgálja a **saját, engedélyezett** alkalmazásaidat, ahogy egy
valódi támadó tenné: feltérképez, próbálgat, megpróbál átjutni a védelmeken —
de nem azért, hogy kárt okozzon, hanem hogy **még a támadó előtt** megtaláld és
kijavítsd a gyenge pontokat. A cél mindig kettős: **felfedni** a sérülékenységet
és **konkrét javítást** javasolni rá.

Ez a skill defenzív biztonsági munka. Nem eszköz idegen rendszerek betöréséhez.
Az alábbi engedély-kapu nem formalitás — ez tartja a munkát a jogszerű,
etikus oldalon.

## 0. Engedély és hatókör — mindig ezzel kezdd

Mielőtt bármit tesztelnél, tisztázd (és rögzítsd a jelentés elején):

1. **Kié a célpont?** Csak akkor haladj tovább, ha a célpont a felhasználó
   tulajdona, vagy van rá írásos tesztelési engedélye. Ha ez nem egyértelmű a
   kontextusból, **kérdezz rá egyetlen mondatban**, és addig ne indíts aktív
   tesztet. (Ebben a repóban a `glogiai.hu` és `gvmeurope.ro` a GVM Europe Kft.
   saját oldalai — ezek engedélyezettek.)
2. **Mi a hatókör?** Melyik domain(ek), útvonalak, komponensek tartoznak bele,
   és mi az, ami kifejezetten kimarad (pl. külső szolgáltatók, fizetési
   szolgáltató, harmadik feles beágyazások infrastruktúrája).
3. **Környezet:** éles vagy staging? Éles rendszeren **csak nem-romboló,
   read-only jellegű** ellenőrzést végezz (lásd „Amit sosem csinálunk").

Ha a célpont nem a felhasználóé és nincs bizonyíthatóan engedélye, **állj meg**
és mondd el, milyen engedélyre lenne szükség. Ne kerüld meg ezt a lépést.

## A munkafolyamat: Recon → Teszt → Igazolás → Jelentés → Javítás

A biztonsági tesztelés nem véletlenszerű próbálgatás, hanem módszeres átfésülés.
Öt fázisban dolgozz, hogy semmi ne maradjon ki és minden állítás megalapozott
legyen.

### 1) Recon (feltérképezés)
Értsd meg, mit támadsz, mielőtt támadnál. Térképezd fel a felületet:
- Milyen technológia? Statikus oldal, SPA, szerveroldali app, API?
- Milyen **belépési pontok** vannak: űrlapok, query paraméterek, feltöltés,
  bejelentkezés, API végpontok, sütik, `postMessage`, URL-fragmentek?
- Milyen **külső függőségek**: harmadik feles szkriptek (CDN), iframe-ek,
  analytics, betűtípusok, beágyazott widgetek?
- Milyen **konfiguráció** védi: HTTP fejlécek, CSP, CORS, süti-attribútumok,
  TLS, DNS (SPF/DMARC/CAA)?

Statikus oldalnál a recon nagy részét automatizálja a
`scripts/recon_static.py` — futtasd le legelőször (lásd lentebb).

### 2) Teszt (aktív próbálgatás)
A belépési pontokat végigpróbálva keresd az adott alkalmazástípusra jellemző
sérülékenységeket. Ne fejből dolgozz: nyisd meg a megfelelő checklistet és
haladj végig rajta.

- **Statikus oldal / marketing site** (mint ez a repó) →
  `references/static-site-checklist.md`
- **Dinamikus webalkalmazás / API** → `references/web-app-checklist.md`

A checklisten szereplő minden tételnél döntsd el: érintett-e, és ha igen,
próbáld ki a legkisebb ártalmatlan bizonyító lépéssel.

### 3) Igazolás (verify — ez nem opcionális)
A biztonsági jelentés akkor ér valamit, ha **igaz**. A hamis riasztás (false
positive) rosszabb a semminél: elfedi a valódi problémákat és rombolja a
bizalmat. Ezért minden gyanús találatnál:
- Reprodukáld egy konkrét, minimális bizonyítékkal (pl. a pontos kérés/válasz,
  a payload, a fájl és sor, a képernyőn megjelenő eredmény).
- Kérdezd meg magadtól: mi a **valós hatás**? Ki, milyen adatot, milyen
  feltétellel ér el? Ha nincs valódi hatás, ne jelentsd sérülékenységként —
  legfeljebb „megfigyelés" (hardening tipp) szintjén.
- Ha bizonytalan vagy, jelöld `PLAUSIBLE`-ként `CONFIRMED` helyett, és írd le,
  mi hiányzik a megerősítéshez.

### 4) Jelentés
Írj tömör, cselekvésre kész jelentést a `references/report-template.md` formátum
szerint. Minden találat kapjon súlyosságot (lásd lentebb), konkrét helyet,
reprodukciós lépést és javasolt javítást. Súlyosság szerint csökkenő sorrendben.

### 5) Javítás
A Strix nem áll meg a hibalistánál — a cél a **kijavított** alkalmazás. Ha a
felhasználó kéri (vagy a javítás egyértelmű és biztonságos, pl. hiányzó
security header, SRI hash, `rel="noopener"`), írd meg a javítást is, és
magyarázd el, miért zárja be a rést. Kockázatos vagy funkciót érintő
változtatásnál előbb egyeztess.

## A recon szkript használata

A `scripts/recon_static.py` a repó statikus oldalait (vagy bármely megadott
HTML-mappát + Netlify konfigot) fésüli át gyakori, könnyen automatizálható
problémákra: hiányzó SRI külső szkripteknél, `http://` kevert tartalom,
`target="_blank"` `rel="noopener"` nélkül, inline eseménykezelők, gyanús
beégetett titkok, hiányzó biztonsági fejlécek a Netlify configban, kitett
érzékeny fájlok.

```bash
# Az egész repó statikus oldalai:
python3 .claude/skills/strix/scripts/recon_static.py sites/

# Egy konkrét oldal:
python3 .claude/skills/strix/scripts/recon_static.py sites/glogiai.hu/public --netlify netlify.toml

# JSON kimenet további feldolgozáshoz:
python3 .claude/skills/strix/scripts/recon_static.py sites/ --json
```

A szkript kimenete kiindulópont, nem végeredmény: a talált tételeket vidd be a
2)–3) fázison (igazold a hatást), mielőtt jelentenéd. Csak Python stdlib kell
hozzá, nincs külső függőség.

## Súlyossági besorolás

A prioritás azt tükrözi, mennyire könnyen és mekkora kárral használható ki egy
hiba — így a felhasználó tudja, mit javítson először.

- **Critical** — távoli kódfuttatás, autentikáció megkerülése, tömeges
  adatszivárgás, teljes átvétel. Azonnali javítás.
- **High** — egyéni fiók/adat kompromittálása (pl. tárolt XSS hitelesített
  felületen, IDOR érzékeny adaton, SQLi).
- **Medium** — feltételekhez kötött vagy korlátozott hatású hiba (pl. reflektált
  XSS felhasználói interakcióval, CSRF nem-kritikus műveleten, hiányzó CSP).
- **Low** — kis kockázatú gyengeség (pl. hiányzó `X-Content-Type-Options`,
  információszivárgás verziószámból).
- **Info / Hardening** — nincs közvetlen kihasználhatóság, de jó gyakorlat
  (pl. szigorúbb `Referrer-Policy`, `Permissions-Policy`).

Ha CVSS-t is szeretnél adni, add meg, de a fenti címke legyen az elsődleges.

## Amit sosem csinálunk

Ezek a határok tartják a munkát defenzívnek és jogszerűnek — akkor sem lépjük át
őket, ha a felhasználó viccből kéri:

- **Nincs engedély nélküli célpont.** Idegen rendszert, harmadik felet, más
  tulajdonának infrastruktúráját nem teszteljük.
- **Nincs romboló teszt.** Semmi DoS/terheléses támadás, adat törlése vagy
  módosítása éles rendszeren, szolgáltatás megzavarása.
- **Nincs valódi felhasználói adat.** Teszthez saját/kamu fiókot és
  szintetikus adatot használunk, nem meglévő ügyfelekét.
- **Nincs tömeges célzás és nincs detektálás-kerülés** rosszindulatú célból.
- **Nincs kiszivárogtatás.** A megtalált érzékeny adatot nem visszük ki külső
  szolgáltatásba, a jelentésben is csak a bizonyításhoz feltétlenül szükséges
  minimumot idézzük.

Ha egy kérés túllépné ezeket, mondd el röviden, miért nem végezzük el, és
kínálj fel egy biztonságos, defenzív alternatívát.

## Referenciafájlok

- `references/static-site-checklist.md` — statikus/marketing oldalak (fejlécek,
  CSP, SRI, kevert tartalom, űrlapok, kitett fájlok, DNS-e-mail védelem).
- `references/web-app-checklist.md` — dinamikus appok és API-k (OWASP-alapú:
  injektálás, auth, hozzáférés-vezérlés, SSRF, deserializáció stb.).
- `references/report-template.md` — a biztonsági jelentés kötelező formátuma.
- `scripts/recon_static.py` — automatizált statikus recon szkript.
