# Biztonsági jelentés — sablon

A jelentés akkor hasznos, ha a felhasználó **el tudja olvasni és cselekedni tud
belőle**. Súlyosság szerint csökkenő sorrend. Minden találat legyen igazolt
(lásd a SKILL.md „Igazolás" fázisát). Ne sorolj fel hipotetikus vagy
nem-reprodukált problémákat megerősítettként.

## Fejléc — mindig ezzel kezdd

```
# Biztonsági jelentés — <célpont neve / domain>
- Dátum: <ÉÉÉÉ-HH-NN>
- Hatókör: <mit tartalmaz és mit NEM>
- Engedély: <a célpont tulajdonosa / az engedély alapja>
- Környezet: <éles | staging>
- Módszer: <static recon + kézi ellenőrzés | dinamikus teszt | ...>
```

## Összefoglaló

Egy rövid bekezdés a laikus döntéshozónak: mi a legfontosabb kockázat, hány
találat van súlyosság szerint, mi a javasolt sürgős lépés.

| Súlyosság | Darab |
|-----------|-------|
| Critical  | 0     |
| High      | 0     |
| Medium    | 0     |
| Low       | 0     |
| Info      | 0     |

## Találatok

Minden találat ebben a formában, súlyosság szerint csökkenő sorrendben:

---

### [SÚLYOSSÁG] Rövid, beszédes cím
- **Állapot:** CONFIRMED | PLAUSIBLE
- **Hely:** fájl:sor, URL, végpont vagy komponens
- **Kategória:** pl. XSS / hiányzó CSP / SRI / IDOR / SSRF
- **Leírás:** mi a hiba és miért probléma.
- **Hatás:** ki, milyen adatot, milyen feltétellel ér el vagy tud manipulálni.
  Konkrét, ne általánosság.
- **Reprodukció:** a minimális lépéssor / payload / kérés-válasz, amivel
  bizonyítottad. Csak a szükséges minimumot idézd érzékeny adatból.
- **Javítás:** konkrét, alkalmazható javaslat (kód, config, fejléc). Ha a
  javítást el is végezted, hivatkozz a változtatásra.
- **Referencia:** OWASP/CWE hivatkozás, ha releváns.

---

## Megfigyelések (hardening)

Nem kihasználható, de ajánlott szigorítások — kis lista, súlyozás nélkül.

## Mit ellenőriztünk és rendben találtunk

Rövid felsorolás azokról a kategóriákról, amelyeket teszteltél és nem találtál
problémát — ez adja meg a jelentés terjedelmi hitelességét, és megmutatja, mi
NEM maradt ki.
