---
name: multilingual-pages
description: >-
  Keep multilingual static pages in sync in this repo. Use when editing HTML
  copy, navigation, pricing, legal pages, language switchers, or when the user
  asks to update HU/SK/EN (glogiai) or RO/HU/EN (gvmeurope.ro) content.
paths:
  - sites/**/*.html
  - sites/**/*.css
  - sites/**/*.js
---

# Multilingual static pages

## Locale maps

### GlogiAI (`sites/glogiai.hu/public/`)

| Locale | Typical paths |
|--------|----------------|
| HU (default) | `index.html`, `arazas.html`, `kapcsolat.html`, legal `*.html` |
| SK | `sk/` (e.g. `sk/index.html`, `sk/arazas.html`) |
| EN | `en/` (e.g. `en/index.html`, `en/pricing.html`) |

Shared CSS often at public root (`legal.css`, `pricing.css`) — check all locales if paths change.

### gvmeurope.ro (`sites/gvmeurope.ro/public/`)

| Locale | Path |
|--------|------|
| RO (default) | `index.html` |
| HU | `hu/index.html` |
| EN | `en/index.html` |

Shared assets: `static/style.css`, `static/main.js`, `static/logo.svg`.

Header language switchers use **relative** `RO | HU | EN` (or HU/SK/EN) links — preserve working relative paths when moving files.

## Edit workflow

1. Identify which site and which fact/UI change is requested.
2. Apply the same **factual** change to every locale for that site in one change set (prices, CTAs, contact, logo path, section order).
3. Keep structure parallel across locales unless the user asks for a locale-only experiment.
4. For legal pages (`aszf`, `adatkezeles`, `cookie`, `impresszum`), do not invent law text — mirror existing structure; flag if a locale is missing an equivalent file.
5. Smoke-check links: logo `src`, language switcher `href`s, and absolute product URLs (`app.glogiai.hu`) still resolve.

## Copy tone

- Match the existing page’s language and register; do not “upgrade” all locales to a new marketing voice unless asked.
- Romanian is default on gvmeurope.ro; Hungarian is default on glogiai.hu.
