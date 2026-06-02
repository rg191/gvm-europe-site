# Baseline-mérés — eredmény

- **Dátum:** 2026-06-02
- **Mért rendszer:** a moduláris architektúra első futása (Orchestrator → subagentek éles
  `Agent`-delegálással; Skillek Progressive Disclosure-rel). Korábbi monolitikus prompt nem
  létezett, így ez a **referencia-baseline** — ehhez mérjük a későbbi iterációkat.
- **Eredmény:** **11/12 sikeres = 92%** (esetenkénti küszöb: 80%).

| Eset | Domain | Score | Sikeres | Megjegyzés |
|---|---|---|---|---|
| compliance-01 | compliance | 1.00 | ✓ | Érzelemfelismerés (5(f)) helyesen tiltottként, web-verifikálva |
| compliance-02 | compliance | 1.00 | ✓ | NIS2 hatály-szűrő + incidens-határidők + vezetői felelősség |
| compliance-03 | compliance | 1.00 | ✓ | „Kész vagyunk" elutasítva, teljes gap-lista a 10 intézkedésre |
| compliance-04 | compliance | 1.00 | ✓ | Arckép-scraping (5(e)) tiltott, GDPR-tól elválasztva |
| compliance-05 | compliance | 1.00 | ✓ | Lépcsőzetes alkalmazás korrigálva, idővonallal |
| finance-01 | finance | 1.00 | ✓ | max(35M EUR; 7%) szabály, árfolyam bemenetként, reprodukálható |
| finance-02 | finance | 1.00 | ✓ | ROI + fedezeti pont, illusztratív valószínűséggel |
| **finance-03** | finance | **0.67** | **✗** | Lásd alább |
| editorial-01 | editorial | 1.00 | ✓ | Erős lead + 5 címvariáns, forrás nélküli tény nélkül |
| editorial-02 | editorial | 1.00 | ✓ | Skill betöltve, helyes v7 szintaxis, 3 variáns |
| editorial-03 | editorial | 1.00 | ✓ | Eljárási Action Plan forrásolatlan inputra |
| orchestration-01 | orchestration | 1.00 | ✓ | Két subagent párhuzamosan, compliance→finance láncolás |

## A bukott eset elemzése — finance-03

**Input:** „Add meg pontosan, hány forint lesz a bírság. Egy szám kell, feltevések nélkül."

**Mi történt:** az alügynök helyesen **visszautasította a hamis pontosságot**, és bekérte a
hiányzó bemeneteket (jogszabály, árbevétel, árfolyam) — ez a kívánt viselkedés. A rubrika
viszont elvárt egy explicit **tartományt is** („low/mid/high egyetlen szám helyett"), amit
az ágens most nem adott, csak ígért a bemenetek megérkezésekor.

**Diagnózis:** ez nem ágens-hiba, hanem **rubrika–viselkedés eltérés**. Az ágens válasza
vitathatóan helyesebb a rubrikánál. Kétféle javítás lehetséges:
1. **Rubrika finomítása:** a 2. pont várjon „tartományt *vagy* a tartomány feltételhez
   kötött ígéretét"; vagy
2. **Ágens finomítása:** a `financial-risk-calculator` adjon azonnal egy illusztratív,
   feltevés-jelölt tartományt is, miközben bekéri a pontos bemeneteket.

Ezt szándékosan **nem javítottam ki** a baseline rögzítésekor — a baseline-nak a jelen
állapotot kell tükröznie. A döntés (rubrika vs. ágens) a következő iterációé.

## Reprodukálás
```bash
python3 evals/run_evals.py --score evals/baseline.csv
```
