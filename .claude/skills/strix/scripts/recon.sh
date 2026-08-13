#!/usr/bin/env bash
#
# Strix recon.sh — PASSZÍV, nem-destruktív felderítő segédszkript.
#
# CSAK saját / engedélyezett célponton futtasd. Nem indít fuzzingot, nem
# módosít adatot, nem terhel: néhány célzott, olvasó GET/HEAD kérést küld.
#
# Használat:
#   ./recon.sh https://glogiai.hu
#   ./recon.sh https://gvmeurope.ro
#
# Amit ellenőriz:
#   1) HTTP válasz + biztonsági fejlécek (megléte/hiánya)
#   2) TLS/tanúsítvány alapinfó
#   3) Gyakran kitett érzékeny útvonalak (.git, .env, backup, stb.)
#   4) Szerver-ujjlenyomat és átirányítások
#
set -uo pipefail

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "Használat: $0 <https://celpont>" >&2
  echo "FIGYELEM: csak saját/engedélyezett célponton futtasd." >&2
  exit 1
fi

# Normalizálás: séma nélkül https-t feltételezünk
if [[ "$TARGET" != http://* && "$TARGET" != https://* ]]; then
  TARGET="https://$TARGET"
fi
HOST="$(echo "$TARGET" | sed -E 's#^https?://##; s#/.*$##')"

UA="Strix-Recon/1.0 (authorized security testing)"
CURL=(curl -sS --max-time 15 -A "$UA")

hr(){ printf '%s\n' "------------------------------------------------------------"; }
sec(){ hr; printf '## %s\n' "$1"; hr; }

echo "Strix passzív felderítés — cél: $TARGET  (host: $HOST)"
echo "Időbélyeg: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"

# --- 1) Fejlécek -------------------------------------------------------------
sec "1) HTTP fejlécek és átirányítások"
HEADERS="$("${CURL[@]}" -D - -o /dev/null -L "$TARGET" 2>&1)"
echo "$HEADERS"

sec "1b) Biztonsági fejlécek megléte"
check_header() {
  local name="$1"
  if echo "$HEADERS" | grep -iq "^$name:"; then
    local val; val="$(echo "$HEADERS" | grep -i "^$name:" | head -1 | cut -d: -f2- | sed 's/^ *//')"
    printf '  [OK ] %-28s %s\n' "$name" "$val"
  else
    printf '  [!! ] %-28s HIÁNYZIK\n' "$name"
  fi
}
for h in "Content-Security-Policy" "Strict-Transport-Security" "X-Frame-Options" \
         "X-Content-Type-Options" "Referrer-Policy" "Permissions-Policy"; do
  check_header "$h"
done
echo "  (Info-szivárgás — érdemes elrejteni:)"
for h in "Server" "X-Powered-By"; do
  if echo "$HEADERS" | grep -iq "^$h:"; then
    printf '  [i  ] %-28s %s\n' "$h" "$(echo "$HEADERS" | grep -i "^$h:" | head -1 | cut -d: -f2- | sed 's/^ *//')"
  fi
done

# --- 2) TLS ------------------------------------------------------------------
sec "2) TLS / tanúsítvány"
if command -v openssl >/dev/null 2>&1; then
  echo | timeout 15 openssl s_client -servername "$HOST" -connect "$HOST:443" 2>/dev/null \
    | openssl x509 -noout -subject -issuer -dates 2>/dev/null \
    || echo "  (nem sikerült TLS-infót lekérni)"
else
  echo "  openssl nem elérhető — kihagyva."
fi

# --- 3) Kitett fájlok --------------------------------------------------------
sec "3) Gyakran kitett érzékeny útvonalak (csak olvasás)"
PATHS=(".git/HEAD" ".git/config" ".env" ".DS_Store" "backup.zip" "config.json" \
       "robots.txt" "sitemap.xml" ".well-known/security.txt")
BASE="${TARGET%/}"
for p in "${PATHS[@]}"; do
  code="$("${CURL[@]}" -o /dev/null -w '%{http_code}' "$BASE/$p" 2>/dev/null || echo "ERR")"
  case "$code" in
    200) printf '  [!! ] %-32s -> %s (ELÉRHETŐ — vizsgáld!)\n' "/$p" "$code" ;;
    401|403) printf '  [i  ] %-32s -> %s (védett)\n' "/$p" "$code" ;;
    301|302) printf '  [i  ] %-32s -> %s (átirányít)\n' "/$p" "$code" ;;
    404) printf '  [OK ] %-32s -> %s\n' "/$p" "$code" ;;
    *)   printf '  [?  ] %-32s -> %s\n' "/$p" "$code" ;;
  esac
done

hr
echo "Kész. Ez PASSZÍV kiindulás — az eredményt a Strix SKILL.md szerint értékeld,"
echo "majd folytasd a Testing fázissal (references/owasp-web-checklist.md)."
