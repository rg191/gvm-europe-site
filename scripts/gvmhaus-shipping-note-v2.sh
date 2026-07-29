#!/usr/bin/env bash
# gvmhaus.at v2 — az arcimkekbe is bekerul a szallitasi megjegyzes.
# "Preis (netto)"  -> "Preis (netto, zzgl. Lieferung)"
# "Ár (nettó)"     -> "Ár (nettó, szállítás nélkül)"
# Futtatas a szerveren: bash fix2.sh
set -u

SITE=/var/www/gvmhaus
STAMP=$(date +%Y%m%d-%H%M%S)

for f in index.html gvmhaus-15.html gvmhaus-30.html gvmhaus-44.html gvmhaus-u-01.html gvmhaus-u-02.html; do
  p="$SITE/$f"
  if [ ! -f "$p" ]; then
    echo "KIHAGYVA (nincs ilyen fajl): $f"
    continue
  fi
  if grep -q "zzgl. Lieferung)" "$p"; then
    echo "MAR BENNE VAN, kihagyva: $f"
    continue
  fi
  if ! grep -q "Preis (netto)" "$p"; then
    echo "NINCS BENNE arcimke, kihagyva: $f"
    continue
  fi
  cp "$p" "$p.bak-shipping2-$STAMP"
  sed -i 's/Preis (netto)/Preis (netto, zzgl. Lieferung)/g' "$p"
  sed -i 's/Ár (nettó)/Ár (nettó, szállítás nélkül)/g' "$p"
  echo "KESZ: $f"
done

echo
echo "--- Ellenorzes: igy neznek ki most az arcimkek az index.html-ben ---"
grep -n -m 6 "zzgl. Lieferung" "$SITE/index.html" || echo "HIBA: nem talalom a modositast az index.html-ben"
echo
echo "KESZ. Biztonsagi mentesek: $SITE/*.bak-shipping2-$STAMP"
echo "Visszaallitas ha kell: cp \"$SITE/index.html.bak-shipping2-$STAMP\" \"$SITE/index.html\" (es ugyanigy a tobbinel)"
