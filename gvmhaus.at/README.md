# gvmhaus.at – élesítés

Statikus HTML a meglévő **https://gvmhaus.at/** tárhelyre (Hetzner VM,
jellemző webroot: `/var/www/gvmhaus`).

## Mit telepít

| Fájl | Élő URL |
|------|---------|
| `index.html` | https://gvmhaus.at/ |
| `hu/index.html` | https://gvmhaus.at/hu/ |
| `faq.html` | https://gvmhaus.at/faq.html |
| `hu/faq.html` | https://gvmhaus.at/hu/faq.html |
| `gvmhaus-*.html` | modell-részletoldalak |

Tartalom:
- **Árak nem tartalmazzák a szállítást** (DE + HU) a kezdő- és modelloldalakon
- **FAQ / GYIK** oldal + menüpont a navigációban

## Élesítés (Hetzner Cloud Console)

1. Nyisd meg a **gvmhaus** szervert a Hetzner Cloud Console-ban
2. **Console** → root shell
3. Futtasd:

```bash
curl -fsSL https://raw.githubusercontent.com/rg191/gvm-europe-site/cursor/gvmhaus-elesites-9ef9/gvmhaus.at/deploy-hetzner.sh | bash
```

A script backupot készít (`*.bak-elesites-<időbélyeg>`), majd felülírja a fenti fájlokat,
és a többi oldalon is beszúrja a FAQ menüpontot, ha hiányzik.

## Ellenőrzés

- https://gvmhaus.at/ — szállítási megjegyzés a modellárak alatt
- https://gvmhaus.at/faq.html — német GYIK
- https://gvmhaus.at/hu/faq.html — magyar GYIK

> Kontakt: `info@gvmhaus.at`, `+43 676 934 8474`
