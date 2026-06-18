# GVM Europe – glogiai.hu

Statikus weboldal a **GVM Europe Kft.** számára.

## Hol van minden?

**→ [sites/glogiai.hu/HOSZTOLAS.md](sites/glogiai.hu/HOSZTOLAS.md)** — teljes Hetzner hosztolási útmutató

| | |
|---|---|
| Domain | `glogiai.hu` |
| Hoszt | Hetzner Cloud (`46.225.184.176`) |
| Szerver útvonal | `/srv/sites/glogiai.hu` |
| Konténer | `glogiai-hu-web` |

## Gyors szerkesztés

1. Módosítsd: `sites/glogiai.hu/public/index.html` vagy `static/style.css`
2. Commit + push GitHubra
3. Szerveren: `/srv/sites/glogiai.hu/deploy.sh`

## Helyi előnézet

```bash
cd sites/glogiai.hu
docker compose up --build
# http://localhost:9080
```
