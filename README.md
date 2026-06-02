# GVM Europe — moduláris AI ágens

Prémium (Quiet Luxury) B2B tanácsadói AI ágens, amely **AI Act / NIS2 / GDPR
megfelelőségre**, a kockázat **forintosítására** és **Forbes-szintű szerkesztői**
kimenetre specializált — moduláris, „High-Stakes" architektúrában.

Nem egyetlen óriásprompt: vékony **Orchestrator** + dedikált **alügynökök** + igény
szerint behívott **Skillek**. Részletek: [`docs/architecture.md`](docs/architecture.md).

## Felépítés
```
.claude/
  CLAUDE.md                      # Orchestrator (vezérlő, ~50 sor)
  agents/
    compliance-audit.md          # AI Act / NIS2 / GDPR audit
    financial-risk-calculator.md # bírság-/kockázat-forintosítás, ROI
    editorial-creative.md        # cikk, cím, Action Plan, Midjourney v7
  skills/
    ai-act-article-5/SKILL.md
    nis2-gdpr-checklist/SKILL.md
    midjourney-v7-aesthetic/SKILL.md
evals/                           # mérhető sikerességi ráta (12 teszteset)
docs/architecture.md
```

## Gyors start
A `.claude/` konfigurációt a Claude Code CLI és az Anthropic Agent SDK is betölti, ha a
projekt gyökeréből indítod. Az Orchestrator a kérés domainje szerint delegál a megfelelő
alügynöknek; a subagentek a Skilleket csak szükség esetén töltik be (Progressive Disclosure).

## Mérés
```bash
python3 evals/run_evals.py --validate            # case-fájl ellenőrzése
python3 evals/run_evals.py --template > evals/baseline.csv
python3 evals/run_evals.py --score evals/baseline.csv
```
Lásd [`evals/README.md`](evals/README.md).

## Fontos korlát
Az ágens jogi/pénzügyi anyagai **döntés-előkészítők, nem tanácsadás**. A compliance-állítások
verifikálható forráshoz kötöttek (Skillek → Legal Data Hunter MCP → EUR-Lex); a végső
megítélés képzett szakemberé.
