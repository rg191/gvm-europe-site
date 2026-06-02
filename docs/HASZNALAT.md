# Használati gyorsindító — GVM Europe AI Ágens

Ez a dokumentum azt mutatja meg, **hogyan használd** a moduláris ágenst a napi munkában.
A felépítés logikája külön él: [`docs/architecture.md`](architecture.md).

---

## 1. Helyben — Claude Code CLI-vel (a leggyakoribb)

A `.claude/` mappa konfigurációját a Claude Code automatikusan betölti, ha a projekt
gyökeréből indítod:

```bash
cd gvm-europe-site
claude
```

Innentől **egyszerűen magyarul beszélsz vele** — nem kell külön „aktiválni" semmit. Az
Orchestrator (`.claude/CLAUDE.md`) eldönti a domaint, és a megfelelő alügynöknek delegál:

| Amit írsz | Amit indít |
|---|---|
| „Egy 300 fős energiakereskedő NIS2 alá esik? Mik a legsürgősebb teendők?" | `compliance-audit` |
| „Mekkora a bírság-kitettsége forintban egy tiltott gyakorlatnál?" | `financial-risk-calculator` |
| „Írj erről egy Forbes-szintű cikket borító-vizuállal." | `editorial-creative` (+ `midjourney-v7-aesthetic` Skill) |

Az alügynököt explicit is kérheted: *„Indítsd a compliance-audit alügynököt erre…"*.
A Skillek (pl. `ai-act-article-5`) maguktól töltődnek be, amikor egy alügynöknek szüksége van
rájuk (Progressive Disclosure) — neked nem kell hívnod őket.

## 2. A weben

A [claude.ai/code](https://claude.ai/code) felületen a repóhoz kötve ugyanígy működik:
ugyanaz a delegálás, ugyanazok az alügynökök és Skillek. (A repó baseline-mérése és a
`docs/sample-article-hr-tech.md` mintacikk is így, éles alügynök-hívásokkal készült.)

## 3. Mérés — eval suite

Bármelyik ágenst vagy Skillt módosítod, futtasd újra a méréseket és vesd össze a baseline-nal:

```bash
python3 evals/run_evals.py --validate                  # a 12 eset szerkezeti ellenőrzése
python3 evals/run_evals.py --template > evals/uj.csv   # üres pontozó-sablon
python3 evals/run_evals.py --score evals/baseline.csv  # a referencia: 11/12 = 92%
```

Részletek és a baseline elemzése: [`evals/README.md`](../evals/README.md),
[`evals/baseline-results.md`](../evals/baseline-results.md).

---

## Gyakori kérdések

| Kérdés | Válasz |
|---|---|
| **Kell API-kulcs?** | A CLI-hez igen (Anthropic-fiók / `ANTHROPIC_API_KEY` környezeti változó). A weben a fiókod kezeli. |
| **Hol állítom a tónust/delegálást?** | `.claude/CLAUDE.md` (Orchestrator). |
| **Hol egy domain logikája?** | `.claude/agents/<név>.md`. |
| **Hol egy tudásmodul?** | `.claude/skills/<név>/SKILL.md`. |
| **Hogyan adok új képességet?** | Új `agents/` vagy `skills/` fájl + egy sor az Orchestrator delegálási táblájába. |
| **Honnan tudom, hogy forrásból dolgozott?** | Az alügynök a válasz végén jelzi a forrásokat és azt, mit ad át a következő egységnek. |

---

## Tipikus munkafolyamat (példa)

1. **Kérdezz** természetes nyelven (pl. egy ügyfél MI-rendszerének megfelelőségéről).
2. Az Orchestrator **delegál** a `compliance-audit`-nak; ha forintosítás is kell, **párhuzamosan**
   indul a `financial-risk-calculator`.
3. Ha publikálható anyag a cél, az `editorial-creative` **összefűzi** a forrásolt kimeneteket
   „Quiet Luxury" cikké + Midjourney-vizuállá.
4. **Validálj:** a jogi/pénzügyi állításokat a `verifikálandó` jelölések mentén ellenőrizd —
   a végső megítélés mindig szakemberé.

---

**Fontos.** Az ágens jogi/pénzügyi kimenetei döntés-előkészítők, nem tanácsadás. A források és a
`verifikálandó` jelölések a megbízhatóságot szolgálják; a végső érvényesítés képzett szakemberé.
