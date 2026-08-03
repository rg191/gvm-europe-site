# gvmhaus.at — Alexnek: árak melletti szállítási megjegyzés + DNS kérdés

> **Tárgy (e-mailhez):** gvmhaus.at — szerver/DNS teendő (árak frissítése nem jelenik meg)

Szia Alex,

A **gvmhaus.at** oldalon frissítettük az árakat: minden ár mellé kikerült, hogy a **szállítást nem tartalmazza** („Preis (netto, zzgl. Lieferung)"), és a láblécbe is került egy megjegyzés erről.

A gond: a módosítás a **178.104.125.15** szerveren (Hetzner, „gvmhaus" nevű gép) történt meg — ott az nginx be is van állítva a gvmhaus.at-ra (`server_name gvmhaus.at www.gvmhaus.at`, `root /var/www/gvmhaus`) —, **de a gvmhaus.at DNS A rekordja jelenleg egy másik szerverre mutat: 116.203.115.156**. Így a látogatók a régi oldalt látják.

Két megoldás közül választhatsz — nekünk az **1. az egyszerűbb**, ha hozzáférsz ahhoz a szerverhez:

---

## 1. lehetőség — ha van hozzáférésed a 116.203.115.156 szerverhez (nincs DNS-módosítás)

Lépj be rá SSH-val vagy konzolból, és futtasd le ezt a két parancsot root-ként:

```bash
curl -sL bit.ly/gvmfix -o fix.sh
bash fix.sh
```

A script:
- megkeresi a gvmhaus site mappá(ka)t és beszúrja a szállítási megjegyzést (lábléc + árcímkék),
- minden módosított fájlról időbélyeges biztonsági mentést készít (`*.bak-shipping-*`),
- kétszer futtatva sem duplikál,
- a végén ellenőrzi és kiírja: `KULSO: RENDBEN — AZ OLDAL A NETEN IS FRISSULT!`

(A script forrása nyilvánosan megnézhető: `rg191/gvm-europe-site` repó, `scripts/gvmhaus-shipping-note.sh` — a bit.ly link erre mutat.)

---

## 2. lehetőség — DNS átállítás a már frissített szerverre

| Rekord | Típus | Jelenlegi érték | Új érték |
|--------|-------|-----------------|----------|
| `@` (gvmhaus.at) | A | `116.203.115.156` | `178.104.125.15` |
| `www` | A (vagy CNAME a gvmhaus.at-ra) | `116.203.115.156` | `178.104.125.15` |

- TTL-t érdemes átállítás előtt rövidre venni (300 s), hogy gyorsan átálljon.
- Átállítás után szólj Robinak: a 178-as szerveren ellenőrizzük/kiadjuk a Let's Encrypt tanúsítványt (`certbot --nginx -d gvmhaus.at -d www.gvmhaus.at`), hogy a HTTPS is rendben legyen.
- **Fontos:** ha tudomásod szerint a 116.203.115.156-on futó oldal újabb tartalmú, mint a 178-as szerveren lévő másolat, akkor NE váltsunk DNS-t — inkább az 1. lehetőséget válaszd, és írd meg, mit tudsz arról a szerverről.

---

## Kérdés

Meg tudod írni, **mi fut a 116.203.115.156-on és ki kezeli**? (Robi Hetzner-projektjében nem szerepel.) Ha se hozzáférés, se infó, akkor a 2. lehetőség marad.

Köszi!
Robi
