# gvmhaus.at – feltölthető oldalak

Ez a mappa a **meglévő, élő gvmhaus.at** statikus oldalhoz készült, azzal
azonos sablonban (fejléc, lábléc, CSS, nyelvváltó, web-asset elérési utak).

## Fájlok

| Fájl | Hová kerül az élő oldalon |
|------|---------------------------|
| `index.html` | `https://gvmhaus.at/` (kezdőoldal) |
| `faq.html` | `https://gvmhaus.at/faq.html` (német GYIK) |
| `hu/faq.html` | `https://gvmhaus.at/hu/faq.html` (magyar GYIK) |
| `gvmhaus-15.html` … `gvmhaus-u-02.html` | modell-részletoldalak |

Mind a meglévő `/logo-white.png`, `/nav-mobile.css`, `/blog.css`,
`/nav-mobile.js`, favikon stb. eszközöket használja (abszolút `/` utak).

## Szállítási díj megjegyzés (2026-07)

A weboldalon megjelenő **listaárak nem tartalmazzák a szállítást**.
A szállítási díj a távolság és a megközelítés szerint alakul, és az egyedi
ajánlatban szerepel. Ez most a kezdőoldalon, a GYIK-ban és a modelloldalakon
is egyértelműen ki van írva.

## Teendő az élesítéshez (a site kezelőjének)

1. Töltsd fel az `index.html`-t a webtárhely gyökerébe (felülírja a meglévőt).
2. Töltsd fel a `faq.html`-t a gyökérbe, a `hu/faq.html`-t a `hu/` mappába.
3. Töltsd fel a `gvmhaus-*.html` modelloldalakat a gyökérbe.
4. Opcionális: FAQ menüpont a navigációba (ha még nincs):
   ```html
   <li><a href="faq.html" data-de="FAQ" data-hu="GYIK">FAQ</a></li>
   ```

> A kontakt: `info@gvmhaus.at`, `+43 676 934 8474`.
