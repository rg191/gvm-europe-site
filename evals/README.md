# Eval Suite — GVM Europe AI Ágens

> *„Csak a mérhető javulás jelent valódi fejlődést."*

Ez a mappa méri a moduláris ágens-architektúra teljesítményét. 12 teszteset fedi le a
három domaint (compliance, finance, editorial) és az orchestrációt.

## Munkafolyamat
1. **Validálás** — a case-fájl szerkezete ép-e:
   ```bash
   python3 evals/run_evals.py --validate
   ```
2. **Baseline rögzítése** — generálj üres pontozó-sablont, futtasd le a kérdéseket a
   *jelenlegi* (monolitikus) prompttal, és pontozd a rubrikák szerint:
   ```bash
   python3 evals/run_evals.py --template > evals/baseline.csv
   # töltsd ki a passed_rubric_points oszlopot, majd:
   python3 evals/run_evals.py --score evals/baseline.csv
   ```
3. **Új mérés** — futtasd ugyanezeket az eseteket a moduláris architektúrával
   (Orchestrator + subagentek + skillek), pontozd, és hasonlítsd a baseline-hoz:
   ```bash
   python3 evals/run_evals.py --score evals/modular.csv
   ```

## Pontozás
- Esetenként `score = teljesített rubrikapont / összes rubrikapont` (0..1).
- Egy eset **sikeres**, ha `score >= 0.8`.
- A suite eredménye a sikeres esetek aránya.

A rubrikapontok szándékosan viselkedés-alapúak (pl. „verifikálandónak jelöli a
jogszabályt", „nem éget be árfolyamot"), nem szó szerinti egyezést várnak — így a
pontozást ember vagy bíró-modell is konzisztensen el tudja végezni.

## Bővítés
Új eset: vegyél fel egy objektumot a `cases.json` `cases` tömbjébe (`id`, `domain`,
`expected_route`, `input`, `rubric`). A 10–15 eset jó kiindulás; bővítsd a valós
ügyfél-esetekkel, ahol az ágens elhasalt.
