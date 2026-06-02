# GVM Europe — moduláris AI ágens architektúra

## Miért nem egyetlen nagy prompt
A 400 soros, „mindentudó" rendszerprompt kiszámíthatatlan: a modellnek minden kérésnél
az összes szabályt, sablont és jogszabályt egyszerre kell fejben tartania. Ez
hallucinációhoz és minőségromláshoz vezet. A megoldás a **funkcionális hierarchia**:
vékony vezérlő + dedikált, izolált alügynökök + igény szerint behívott képességek.

```
┌──────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR  (.claude/CLAUDE.md, ~50 sor)                    │
│  kontextus · Quiet Luxury tónus · delegálás — szakmai munka nincs│
└───────────────┬───────────────┬───────────────┬───────────────┘
                │               │               │
        ┌───────▼──────┐ ┌──────▼────────┐ ┌────▼──────────────┐
        │ compliance-  │ │ financial-    │ │ editorial-        │
        │ audit        │ │ risk-calc.    │ │ creative          │
        │ (izolált ctx)│ │ (izolált ctx) │ │ (izolált ctx)     │
        └───────┬──────┘ └──────┬────────┘ └────┬──────────────┘
                │               │               │
   Skillek (Progressive Disclosure — csak ha kell):
   • ai-act-article-5      • nis2-gdpr-checklist     • midjourney-v7-aesthetic
```

## Rétegek
| Réteg | Hol | Felelősség |
|---|---|---|
| **Orchestrator** | `.claude/CLAUDE.md` | Kontextus, tónus, **delegálás**. Nincs benne jogszabály/sablon. |
| **Subagentek** | `.claude/agents/*.md` | Izolált kontextusablakú szakértők. Egy domain, egy egység. |
| **Skillek** | `.claude/skills/*/SKILL.md` | Igény szerint behívott tudás-/paramétermodulok. |
| **Evals** | `evals/` | A sikerességi ráta mérése és követése. |

## Subagentek
- **compliance-audit** — AI Act / NIS2 / GDPR audit. Verifikálható forrásból dolgozik
  (Skillek → Legal Data Hunter MCP → EUR-Lex), nem fejből idéz jogszabályt.
- **financial-risk-calculator** — a meg-nem-felelés forintosítása, ROI. Kódból számol
  (reprodukálható), explicit feltevés-listával, árfolyamot bemenetként kezel.
- **editorial-creative** — Forbes-szintű szöveg, címek, Action Plan, Midjourney v7 vizuál.
  Tényt csak a másik két subagent forrásolt kimenetéből vesz át.

## Skillek (Progressive Disclosure)
- **ai-act-article-5** — a tiltott MI-gyakorlatok (5. cikk) ellenőrzőlistája.
- **nis2-gdpr-checklist** — NIS2 hatály/intézkedések + GDPR alapok.
- **midjourney-v7-aesthetic** — „High-Fashion Business" prompt-paraméterek és anyag-szótár.

## Tervezési elvek
1. **Egy egység, egy felelősség.** Ha egy subagent két dolgot csinál, bontsd ketté.
2. **Forrás vagy bizonytalanság-jelzés** — soha nincs hamis jogi/pénzügyi bizonyosság.
3. **Izolált kontextus** — a subagentet nem terheli a többi domain zaja.
4. **Mérj, ne higgy.** Minden változtatás előtt/után `evals/`.

## Hogyan bővítsd
- **Új domain** → új `.claude/agents/<név>.md` + sor az Orchestrator delegálási táblájában.
- **Új tudásmodul** → új `.claude/skills/<név>/SKILL.md`, a subagent `Skill`-en hívja.
- **Új eset** → `evals/cases.json`.

## Környezet (a videó Action Plan-je szerint)
A projekt Claude Code-dal / Anthropic SDK-val fut. Modern környezetkezelés (pl. `uv sync`)
ad az ágensnek hozzáférést a helyi fájlrendszerhez és a kódvégrehajtáshoz; a jelen repó a
fájl-alapú konfigurációt (`.claude/`) tartalmazza, ami SDK-ból és CLI-ből is betölthető.
