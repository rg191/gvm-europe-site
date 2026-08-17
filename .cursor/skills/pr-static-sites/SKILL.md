---
name: pr-static-sites
description: >-
  Commit and PR checklist for static HTML changes in glogiai.hu and
  gvmeurope.ro. Use before finishing a change set, when opening/updating a PR,
  or when the user asks for review readiness / what to verify before merge.
---

# PR checklist — static sites

## Scope discipline

1. Touch only the site(s) requested (`sites/glogiai.hu/` vs `sites/gvmeurope.ro/`).
2. Prefer one PR theme (copy, pricing, deploy docs, skills) — avoid unrelated drive-bys.
3. Never commit secrets, SSH keys, Hetzner passwords, or Netlify tokens.

## Multilingual gate

If you changed a fact or CTA on one locale, update the sibling locales in the **same commit/PR**:

- GlogiAI: HU + `sk/` + `en/` (and dedicated pricing pages if prices changed)
- gvmeurope.ro: RO + `hu/` + `en/`

Shared CSS/JS under `static/` or public root counts as all-locale impact — re-check each language.

## Deploy awareness

| Site | Deploy trigger | Config |
|------|----------------|--------|
| glogiai.hu | push `main` → `.github/workflows/netlify-deploy.yml` | root `netlify.toml` |
| gvmeurope.ro | push `main` → `netlify-deploy-gvmeurope-ro.yml` | `sites/gvmeurope.ro/netlify.toml` |

Preview deploys on PRs are enough to validate HTML; production follows merge to `main`.

## Pre-merge self-review

- [ ] Brand: no gvmhaus/modulház mix-in; GlogiAI vs shipping copy correct
- [ ] Links: language switcher, logo, `app.glogiai.hu` (if touched)
- [ ] No broken relative paths from nested locales (`../`, `/static/`)
- [ ] README/docs only if the user asked or deploy map truly changed
- [ ] Commit message names the site and the user-visible change

## Agent communication

Prefer Hungarian when the user writes Hungarian. Keep summaries short: what changed, which locales, PR link.
