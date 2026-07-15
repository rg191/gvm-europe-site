---
name: gvm-brand-context
description: >-
  GVM Europe / GlogiAI brand and product context for this monorepo. Use when
  editing site copy, logos, contact info, pricing, or when the user mentions
  GVM, GlogiAI, gvmeurope.ro, glogiai.hu, shipping, or fuvarbörze — especially
  to avoid mixing brands or sites.
---

# GVM brand & product context

## Two products in this repo (do not mix)

| Site | Path | What it is | Languages |
|------|------|------------|-----------|
| **GlogiAI** | `sites/glogiai.hu/public/` | AI fuvarbörze / logisztikai platform landing | HU (default), SK, EN |
| **GVM Europe RO** | `sites/gvmeurope.ro/public/` | GVM Europe szállítmányozás (Románia) landing | RO (default), HU, EN |

Operator: **GVM Europe Kft.**

## Hard brand rules

1. **GlogiAI** = platform / App (`https://app.glogiai.hu` for login/register). Copy and CTAs stay product-focused.
2. **gvmeurope.ro** = szállítmányozás / freight company landing for Romania — **not** modulház / gvmhaus.at content.
3. Never hotlink logos from `gvmeurope.hu` or other external WP paths. Local asset only: `sites/gvmeurope.ro/public/static/logo.svg`.
4. Do not invent legal entity names, addresses, or pricing that contradict existing pages.
5. Pricing on GlogiAI (as of repo): Basic **79 €**, Pro **99 €**, Premium **129 €** — keep HU / SK / EN in sync when changing prices.

## Related domains (outside this tree, for orientation)

- `gvmeurope.hu` — separate Hungarian/hosting context; not this Netlify publish tree.
- `gvmszallitmanyozas.hu` → redirects toward gvmeurope.hu (info only; do not “fix” in-repo).

## When unsure

Prefer matching existing HTML wording and structure over inventing a new brand voice. If RO / HU / EN (or HU / SK / EN) would diverge on facts, sync all locales in the same change.
