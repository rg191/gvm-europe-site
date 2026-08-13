# Design-ízlés alapelvek (minden ügyfélprojektre)

Ez a "taste" réteg: attól függetlenül érvényes, hogy melyik ügyfélnek dolgozol.
A cél, hogy a kész felület szerkesztett, szakmai munkának nézzen ki — ne
generált sablonnak.

## Amitől egy oldal "AI-generáltnak" néz ki — ezeket kerüld

- Lila/indigó gradiens hero, világító neon-accent sötét háttéren, üveghatás
  (glassmorphism) mindenhol.
- Három egyforma kártya emoji-ikonnal ("🚀 Gyors, 🔒 Biztonságos, ⚡ Egyszerű").
  Ha a tartalom listaszerű, gyakran jobb egy jól szedett lista, mint a
  kártyarács — a gvmeurope.ro szolgáltatás-szekciója is lista, szándékosan.
- Töltelékszöveg: "Emelje új szintre vállalkozását", "unlock your potential",
  lorem ipsum. Minden szöveg legyen konkrét: mit csinál a cég, kinek, hol.
- Mindenhez animáció. Egyfajta, visszafogott belépő-animáció (pl. reveal
  fade+translate, egy közös easinggel) elég; a hover-effekt legyen finom.
- Betűtípus-káosz: kettőnél több betűcsalád, vagy a "mindig Inter" reflex.

## Amitől jó lesz

**Tipográfia.** Egy karakteres display font címsorokhoz + egy jól olvasható
szövegfont — ez a páros hordozza az arculat felét. A címsor legyen tömör
(max ~8 szó), a törzsszöveg sorhossza 60–75 karakter, line-height 1.6–1.7.
A betűméret-skála legyen kevés fokozatú és következetes.

**Szín.** Egy tinta-szín (sötét, de nem #000), egy papír-háttér (világos, de
nem #fff), egy accent és annak egy mélyebb árnyalata — ennyi elég egy teljes
oldalhoz. Az accentet takarékosan: linkek, gombok, hangsúlyok. Minden
szín CSS-változóba kerüljön (`--ink`, `--paper`, `--accent` minta), és a
szöveg/háttér kontraszt érje el a WCAG AA szintet (4.5:1).

**Layout.** Egy oldalnak egy megkülönböztető ötlete legyen (egy erős hero, egy
szokatlan szekcióritmus, egy karakteres illusztráció-stílus) — a többi rész
lehet nyugodtan konvencionális. Következetes térköz-skála (pl. 4/8 px alapú),
egyetlen border-radius érték családja, egyetlen árnyék-recept. A mobil nézet
nem utógondolat: minden szekciót nézz meg keskeny viewporton is.

**Tartalom és bizalom.** Valódi cégadatok (székhely, cégnév, elérhetőség) a
láthatóságuknak megfelelő helyen; a CTA konkrét cselekvés ("Kérjen ajánlatot"),
nem szlogen. B2B/szolgáltató ügyfélnél a megbízhatóság-jelek (referenciák,
számok, tanúsítványok) többet érnek bármilyen effektnél.

**Technika.** Statikus oldalhoz nem kell framework. Rendszerfontok vagy max
két webfont, `display=swap`-pal. Inline SVG logó, hogy fontfüggetlen legyen.
Semantikus HTML (nav/header/main/section/footer), aria-címkék, `alt` szövegek.
A kész munkát mindig nézd meg legalább egy renderelt képernyőn, mielőtt
késznek mondod.

## Az ügyfél brandje az úr

Ha az ügyfél-skillben rögzített érték (szín, font, hangnem) ellentmond a fenti
általános ízlésnek, az ügyfélé az elsőbbség — de jelezd a felhasználónak, ha
valami objektíven árt (pl. olvashatatlan kontraszt), és javasolj alternatívát.
Niviloop-arculati elem (Syne + teal páros, Niviloop-hangnem) ügyfélmunkába
csak akkor kerülhet, ha az ügyfél saját, dokumentált brandje történetesen ez.
