#!/usr/bin/env bash
# gvmhaus.at — szallitasi megjegyzes + ondiagnosztika (v3)
# Futtatas a szerveren: bash fix.sh
# 1) Megkeresi az OSSZES gvmhaus-os site-mappat (/var/www, /srv, /usr/share/nginx, /home)
# 2) Mindegyikben: lablec-megjegyzes + arcimkek atirasa (backup-pal, idempotens)
# 3) Leellenorzi, hogy a szerver es a kulvilag mar az uj oldalt latja-e
set -u

NOTE='<p class="shipping-note" style="margin:14px 0;padding:10px 14px;background:#f5f5f5;border-left:4px solid #b98c5a;font-size:0.95em;color:#333;">Hinweis: Alle Preise verstehen sich zuz&uuml;glich Transport- und Lieferkosten. Gerne erstellen wir Ihnen ein individuelles Angebot f&uuml;r die Lieferung.</p>'
STAMP=$(date +%Y%m%d-%H%M%S)
PAGES="index.html gvmhaus-15.html gvmhaus-30.html gvmhaus-44.html gvmhaus-u-01.html gvmhaus-u-02.html"

insert_note() {
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

apply_to_dir() {
  local d="$1" f p
  echo "== Feldolgozas: $d =="
  for f in $PAGES; do
    p="$d/$f"
    [ -f "$p" ] || continue
    if ! grep -q "shipping-note" "$p"; then
      cp "$p" "$p.bak-shipping-$STAMP"
      if grep -q "</footer>" "$p"; then
        insert_note "$p" "</footer>"
      else
        insert_note "$p" "</body>"
      fi
      echo "   + lablec-megjegyzes beszurva: $f"
    fi
    if grep -q "Preis (netto)" "$p"; then
      cp "$p" "$p.bak-arcimke-$STAMP"
      sed -i 's/Preis (netto)/Preis (netto, zzgl. Lieferung)/g' "$p"
      sed -i 's/Ár (nettó)/Ár (nettó, szállítás nélkül)/g' "$p"
      echo "   + arcimkek atirva: $f"
    fi
  done
}

echo "===== 1. LEPES: gvmhaus site-mappak keresese ====="
CANDS=""
for base in /var/www /srv /usr/share/nginx /home /opt; do
  [ -d "$base" ] || continue
  for idx in $(find "$base" -maxdepth 4 -name index.html 2>/dev/null); do
    if grep -qi "gvmhaus" "$idx" 2>/dev/null; then
      CANDS="$CANDS
$(dirname "$idx")"
    fi
  done
done
CANDS=$(printf '%s\n' "$CANDS" | sort -u | grep -v '^$' || true)
if [ -z "$CANDS" ]; then
  echo "HIBA: nem talaltam gvmhaus-os index.html-t. Ellenorizd kezzel: ls /var/www"
else
  printf 'Talalt mappak:\n%s\n\n' "$CANDS"
  for d in $CANDS; do
    apply_to_dir "$d"
  done
fi

echo
echo "===== 2. LEPES: webszerver-konfiguracio ====="
ls /etc/nginx/sites-enabled 2>/dev/null && grep -rh -e server_name -e "root " /etc/nginx/sites-enabled 2>/dev/null | head -20
ls /etc/apache2/sites-enabled 2>/dev/null
grep -n gvmhaus /etc/caddy/Caddyfile 2>/dev/null | head -5
ss -ltnp 2>/dev/null | head -8

echo
echo "===== 3. LEPES: ellenorzes ====="
MYIP=$(hostname -I 2>/dev/null || echo ismeretlen)
DNSIP=$(getent hosts gvmhaus.at 2>/dev/null || echo "nem oldhato fel")
echo "Ennek a szervernek az IP-je : $MYIP"
echo "A gvmhaus.at DNS szerint    : $DNSIP"
echo
echo "-- Helyi valasz (ezt adja ez a szerver) --"
curl -s -m 10 -H "Host: gvmhaus.at" http://127.0.0.1/ -o /tmp/gvm-local.html 2>/dev/null || true
if grep -q shipping-note /tmp/gvm-local.html 2>/dev/null; then
  echo "HELYI:  RENDBEN — a szerver mar az uj oldalt adja"
else
  echo "HELYI:  MEG NEM az uj oldalt adja (mas mappabol mehet a kiszolgalas)"
fi
echo
echo "-- Kulso valasz (ezt latjak a latogatok a neten) --"
curl -s -m 15 https://gvmhaus.at/ -o /tmp/gvm-ext.html 2>/dev/null || true
if grep -q shipping-note /tmp/gvm-ext.html 2>/dev/null; then
  echo "KULSO:  RENDBEN — AZ OLDAL A NETEN IS FRISSULT!"
else
  echo "KULSO:  meg a regi latszik — vagy cache (pl. Cloudflare), vagy a DNS mas szerverre mutat (lasd fent az IP-ket)"
  curl -sI -m 15 https://gvmhaus.at/ 2>/dev/null | grep -i -e "^server" -e cache -e cf- | head -5
fi
echo
echo "KESZ. Biztonsagi mentesek: *.bak-shipping-$STAMP es *.bak-arcimke-$STAMP a site-mappakban."
