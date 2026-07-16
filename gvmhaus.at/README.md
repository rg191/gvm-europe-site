# gvmhaus.at – FAQ / GYIK oldal beépítése a meglévő oldalba

Ez a mappa a **meglévő, élő gvmhaus.at** statikus oldalhoz készült, azzal
azonos sablonban (fejléc, lábléc, CSS, nyelvváltó, web-asset elérési utak).

## Fájlok

| Fájl | Hová kerül az élő oldalon |
|------|---------------------------|
| `faq.html` | `https://gvmhaus.at/faq.html` (német) |
| `hu/faq.html` | `https://gvmhaus.at/hu/faq.html` (magyar) |

Mindkettő a meglévő `/logo-white.png`, `/nav-mobile.css`, `/blog.css`,
`/nav-mobile.js`, favikon stb. eszközöket használja (abszolút `/` utak), tehát
a gvmhaus.at gyökerébe feltöltve azonnal, a többi oldallal egységesen jelenik meg.

## Teendő az élesítéshez (a site kezelőjének)

1. Töltsd fel a `faq.html`-t a webtárhely gyökerébe (a `index.html` mellé),
   a `hu/faq.html`-t pedig a `hu/` mappába.
2. **Menüpont hozzáadása** minden oldal `<nav>` `<ul class="nav-links">` listájához,
   a „Galerie/Galéria" után:
   ```html
   <li><a href="faq.html" data-de="FAQ" data-hu="GYIK">FAQ</a></li>
   ```
   (a `/hu/` oldalakon a `faq.html` relatív link `/hu/faq.html`-re mutat.)

   > ⚠️ Megjegyzés: a legtöbb oldal (`index`, `ablauf`, `galerie`, `agb`,
   > `datenschutz`, `impressum`, `nutzungsbedingungen`, `gvmhaus-15`) azonos
   > `nav`-ot használ, de a modell-részletoldalak (`gvmhaus-30/44/u-01/u-02`)
   > eltérő fejlécet tartalmaznak — ezeknél a menüsort a saját szerkezetükhöz
   > kell igazítani. A legbiztosabb, ha a menüpont a site **forrásában/generátorában**
   > kerül be (ha van ilyen), nem a legyártott HTML-ekben.
3. Kész – a DE/HU nyelvváltó, a kereső és a lenyíló kérdések a meglévő
   mechanizmussal működnek.

> A tartalom lektorált (HU + DE). A kontakt: `info@gvmhaus.at`, `+43 676 934 8474`.
> Néhány válasz (mintaház, finanszírozás, kiterjesztett garancia, szállítási
> biztosítás) szándékosan általános – a valós üzleti feltételekkel pontosítható.

## Belső felkészítő (értékesítés)

| Fájl | Cél |
|------|-----|
| `ertekesitoi-telefonos-tanulo.pdf` | **Legkönnyebb megnyitás** — töltsd le, nyisd meg PDF-olvasóban |
| `ertekesitoi-telefonos-tanulo.html` | Formázott böngészős nézet (lokálisan / feltöltés után) |
| `ertekesitoi-telefonos-tanulo.md` | Forrás (böngészőben nyers szöveg) |
| `deploy-tanulo-hetzner.sh` | Feltöltés az élő `gvmhaus.at`-ra (Hetzner Console) |

### Miért 404 a `https://gvmhaus.at/ertekesitoi-telefonos-tanulo.html`?

A fájl **csak a GitHub PR-ben** van, amíg fel nem töltöd a szerverre. Az élő oldalon még nincs.

**Azonnali megnyitás:** a PR-ből töltsd le a `.pdf` vagy `.html` fájlt, és nyisd meg lokálisan.

**Éles URL-hez** (Hetzner Console, root a gvmhaus VM-en):

```bash
curl -fsSL https://raw.githubusercontent.com/rg191/gvm-europe-site/cursor/gvmhaus-sales-phone-guide-9ebd/gvmhaus.at/deploy-tanulo-hetzner.sh | bash
```

Utána: `https://gvmhaus.at/ertekesitoi-telefonos-tanulo.html` (és `.pdf`).

Ha a FAQ árai / feltételei változnak, a tanulópéldányt ugyanazon a napon frissíteni kell.
