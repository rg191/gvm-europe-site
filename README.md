# GVM Europe – glogiai.hu

Statikus weboldal a **GVM Europe Kft.** számára.

## Hosztolás — melyiket válaszd?

| Helyzet | Megoldás |
|---|---|
| **Nincs szerver jelszó** (pl. Hetzner elfelejtve) | [**Netlify**](sites/glogiai.hu/HOSZTOLAS.md#1-netlify-ajánlott--nincs-szerver-kell) — ingyenes, GitHub deploy |
| Van Tárhely.Eu admin | [Tárhely.Eu FTP](sites/glogiai.hu/HOSZTOLAS.md#2-tárhelyeu-ha-van-ügyféladmin-hozzáférésed) |
| Van Hetzner SSH | [Docker a szerveren](sites/glogiai.hu/HOSZTOLAS.md#3-hetzner-csak-ha-van-ssh-hozzáférés) |

**Teljes útmutató:** [sites/glogiai.hu/HOSZTOLAS.md](sites/glogiai.hu/HOSZTOLAS.md)

## Gyors szerkesztés

1. `sites/glogiai.hu/public/index.html` vagy `static/style.css`
2. Git push
3. Netlify automatikusan deployol (ha ott van) — vagy FTP / `deploy.sh` más hosztoknál

## Fájlok

```
sites/glogiai.hu/public/   ← az oldal (index.html + static/)
netlify.toml               ← Netlify beállítás (repo gyökér)
```
