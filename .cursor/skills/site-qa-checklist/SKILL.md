---
name: site-qa-checklist
description: >-
  Smoke-test and debug static landing pages in this repo. Use when the user
  reports broken logo, language switcher, deploy preview issues, 404s, DNS,
  Netlify problems, or asks to verify / QA a page before merge.
---

# Site QA checklist

## Which site?

| Symptom / URL | Tree |
|---------------|------|
| glogiai.hu / app.glogiai.hu CTA | `sites/glogiai.hu/public/` |
| gvmeurope.ro / RO–HU–EN shipping | `sites/gvmeurope.ro/public/` |

## Fast visual / link checks

1. **Logo** — gvmeurope: `static/logo.svg` loads (no external WP/hotlink). Favicon same path.
2. **Language switcher** — every locale file exists; relative `href`s work from `/`, `/hu/`, `/en/` (glogiai: HU / `sk/` / `en/`).
3. **Facts sync** — phones, emails, prices (€79 / €99 / €129 on GlogiAI), app URL `https://app.glogiai.hu` match across locales when the change is factual.
4. **Forms / placeholders** — placeholder emails like `email@ceg.hu` are OK; real contacts must stay real.
5. **Mobile** — nav toggle (gvmeurope `.nav-toggle`) opens/closes; no horizontal overflow on hero.

## Local preview

```bash
# gvmeurope.ro
cd sites/gvmeurope.ro && docker compose up --build
# http://localhost:9081  /hu/  /en/

# glogiai.hu — any static server on public/
python3 -m http.server 8080 --directory sites/glogiai.hu/public
```

## Production / Netlify debug map

| Issue | First look |
|-------|------------|
| Old content after merge | GitHub Actions deploy workflow for that site; Netlify deploy log; hard refresh / HTML `Cache-Control` |
| Apex/www mismatch | `sites/*/NETLIFY-DNS.md` or `DNS-ALEX.md` |
| Only one site updated | Confirm publish dir / site ID secret matches the site you edited |
| Envoy/proxy 404 on old Hetzner | Prefer Netlify; see archive notes in `HOSZTOLAS.md` only if user insists on Hetzner |

## Report format

State: site → what broke → expected → fix (file paths). Do not paste credentials.
