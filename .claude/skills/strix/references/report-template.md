# Strix — Biztonsági jelentés sablon

Használd ezt a `Reporting` fázisban. Töltsd ki a valós adatokkal, a legkritikusabb találat elöl.

---

# Biztonsági teszt jelentés — <célpont> 

- **Dátum**: <ÉÉÉÉ-HH-NN>
- **Hatókör (scope)**: <domainek / útvonalak / repó, amit teszteltél>
- **Hatókörön kívül**: <mit NEM teszteltél és miért — engedély/tulajdon>
- **Módszer**: passzív felderítés + nem-destruktív aktív próbák (Strix)
- **Tesztelő**: Strix (automatikus biztonsági tesztelő)

## Vezetői összefoglaló

<2–4 mondat: mit teszteltél, mi a legfontosabb kockázat, mennyire sürgős.>

## Találatok áttekintése

| # | Súlyosság | Találat | Hely | Állapot |
|---|-----------|---------|------|---------|
| 1 | Critical  | ...     | ...  | Nyitott / Javítva (igazolt) |
| 2 | High      | ...     | ...  | ... |
| 3 | Medium    | ...     | ...  | ... |

Súlyosság-eloszlás: Critical: _ · High: _ · Medium: _ · Low: _ · Info: _

---

## Részletes találatok

### [1] <cím> — <Súlyosság>

- **Hely / érintett komponens**: <URL, fájl:sor, paraméter>
- **Leírás**: <mi a probléma, miért sérülékeny>
- **Bizonyíték / reprodukció**:
  ```
  <kérés / válasz részlet / payload / lépések>
  ```
- **Hatás**: <mit tehet egy támadó, milyen adat/rendszer érintett>
- **Javaslat (javítás)**: <konkrét, kódszintű vagy konfigurációs lépés>
- **Állapot**: Nyitott / Javítva (igazolt) / Javítva (igazolás szükséges)
- **Re-test eredmény**: <a javítás után a próba megismételve — a rés megszűnt-e>

*(ismételd minden találatra)*

---

## Elvégzett javítások (repó)

- `<fájl>`: <mit módosítottál és miért>

## Hátralévő teendők (felhasználói / kézi)

- [ ] <pl. DNS rekord, harmadik fél oldali beállítás, kulcs-rotáció, éles rendszer>

## Módszertani megjegyzés

<Milyen korlátok között dolgoztál: rate-limit, nem-destruktív, mi maradt ki és miért. Milyen eszközök voltak/ nem voltak elérhetők.>
