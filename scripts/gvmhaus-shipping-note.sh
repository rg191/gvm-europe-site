#!/usr/bin/env bash
# gvmhaus.at — "Preise zzgl. Lieferung" megjegyzes beszurasa az aras oldalakra.
# Futtatas a szerveren (root@gvmhaus): bash fix.sh
# - Minden modositott fajlrol backup keszul: *.bak-shipping-<idobelyeg>
# - Ketszer futtatva nem duplikal (kihagyja, ahol mar bent van)
set -u

SITE=/var/www/gvmhaus
NOTE='<p class="shipping-note" style="margin:14px 0;padding:10px 14px;background:#f5f5f5;border-left:4px solid #b98c5a;font-size:0.95em;color:#333;">Hinweis: Alle Preise verstehen sich zuz&uuml;glich Transport- und Lieferkosten. Gerne erstellen wir Ihnen ein individuelles Angebot f&uuml;r die Lieferung.</p>'
STAMP=$(date +%Y%m%d-%H%M%S)

insert_note() {
  # a NOTE-ot az elso </footer> ele szurja; ha nincs footer, a </body> ele
  local p="$1" tag="$2"
  awk -v note="$NOTE" -v tag="$tag" '
    BEGIN { done = 0 }
    {
      if (!done) {
        i = index($0, tag)
        if (i > 0) {
          pre = substr($0, 1, i - 1)
          post = substr($0, i)
          print pre note post
          done = 1
          next
        }
      }
      print
    }' "$p" > "$p.tmp" && mv "$p.tmp" "$p"
}

for f in index.html gvmhaus-15.html gvmhaus-30.html gvmhaus-44.html gvmhaus-u-01.html gvmhaus-u-02.html; do
  p="$SITE/$f"
  if [ ! -f "$p" ]; then
    echo "KIHAGYVA (nincs ilyen fajl): $f"
    continue
  fi
  if grep -q "shipping-note" "$p"; then
    echo "MAR BENNE VAN, kihagyva: $f"
    continue
  fi
  cp "$p" "$p.bak-shipping-$STAMP"
  if grep -q "</footer>" "$p"; then
    insert_note "$p" "</footer>"
    echo "KESZ (footer vegen): $f"
  else
    insert_note "$p" "</body>"
    echo "KESZ (oldal vegen): $f"
  fi
done

echo
echo "--- Ellenorzes: Preis kornyeke az index.html-ben (ha finomitani kell, kuldj errol fotot) ---"
grep -n -i -m 8 -B1 -A1 preis "$SITE/index.html" || true
echo
echo "--- Ellenorzes: az uj megjegyzes helye ---"
grep -rn -l "shipping-note" "$SITE" --include=index.html --include=gvmhaus-15.html --include=gvmhaus-30.html --include=gvmhaus-44.html --include=gvmhaus-u-01.html --include=gvmhaus-u-02.html 2>/dev/null || grep -rln "shipping-note" "$SITE" | grep -v bak || true
echo
echo "KESZ. Biztonsagi mentesek: $SITE/*.bak-shipping-$STAMP"
echo "Ha vissza kellene allitani: cp \"$SITE/index.html.bak-shipping-$STAMP\" \"$SITE/index.html\" (es ugyanigy a tobbi fajlnal)"
