---
name: deploy-sites
description: >-
  Deploy and hosting for glogiai.hu and gvmeurope.ro. Use when the user asks to
  deploy, publish, ship to production, fix Netlify, DNS, GitHub Actions deploy,
  or asks how/where a site is hosted.
---

# Deploy sites (glogiai.hu + gvmeurope.ro)

No build step: pure static HTML/CSS. Production deploys run via **GitHub Actions → Netlify** on push to `main` (and `workflow_dispatch`).

## glogiai.hu

| Item | Value |
|------|--------|
| Publish dir | `sites/glogiai.hu/public` |
| Root config | `netlify.toml` (repo root) |
| Workflow | `.github/workflows/netlify-deploy.yml` |
| Secrets | `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` |
| DNS notes | `sites/glogiai.hu/DNS-ALEX.md`, `sites/glogiai.hu/ALEX-UZENET.md` |

## gvmeurope.ro

| Item | Value |
|------|--------|
| Base / publish | Base: `sites/gvmeurope.ro` → publish `public` |
| Site config | `sites/gvmeurope.ro/netlify.toml` |
| Workflow | `.github/workflows/netlify-deploy-gvmeurope-ro.yml` |
| Secrets | `NETLIFY_AUTH_TOKEN`, `NETLIFY_GVMEUROPE_RO_SITE_ID` |
| Docs | `sites/gvmeurope.ro/NETLIFY-DNS.md`, `sites/gvmeurope.ro/HOSZTOLAS.md` |

**Preferred hosting: Netlify.** Hetzner path in `HOSZTOLAS.md` is archive/alternative — do not default to SSH deploy unless the user explicitly asks.

## Agent checklist before saying “deployed”

1. Confirm which site changed (`glogiai.hu` vs `gvmeurope.ro`).
2. Prefer merge/push to `main` so Actions run; do not invent credentials or call Netlify APIs unless secrets/tools are available.
3. After push, point the user at the matching GitHub Actions workflow run.
4. For local preview of gvmeurope.ro: `cd sites/gvmeurope.ro && docker compose up --build` → `http://localhost:9081` (also `/hu/`, `/en/`).

## Do not

- Put passwords, SSH keys, or Hetzner account credentials into skills, commits, or chat summaries.
- Change DNS or Netlify Site IDs without explicit user request and verification against the docs above.
