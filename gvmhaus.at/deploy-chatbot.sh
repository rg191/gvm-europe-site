#!/usr/bin/env bash
# GVM Haus — csak chatbot.js + chatbot.css élesítés
# Futtasd a gvmhaus szerveren rootként (SSH vagy Hetzner Console):
#   curl -fsSL https://raw.githubusercontent.com/rg191/gvm-europe-site/cursor/chatbot-kommunikacio-megfeleloseg-4aa6/gvmhaus.at/deploy-chatbot.sh | bash
set -euo pipefail

BRANCH="${BRANCH:-cursor/chatbot-kommunikacio-megfeleloseg-4aa6}"
BASE="${BASE:-https://cdn.jsdelivr.net/gh/rg191/gvm-europe-site@${BRANCH}/gvmhaus.at}"
FALLBACK_BASE="https://raw.githubusercontent.com/rg191/gvm-europe-site/${BRANCH}/gvmhaus.at"

fetch_file() {
  local rel="$1" dest="$2"
  if curl -fsSL "${BASE}/${rel}" -o "${dest}" 2>/dev/null; then
    return 0
  fi
  curl -fsSL "${FALLBACK_BASE}/${rel}" -o "${dest}"
}
STAMP="$(date +%Y%m%d-%H%M%S)"
WEBROOT=""

for d in /var/www/gvmhaus /var/www/gvmhaus.at /var/www/html /srv/www/gvmhaus.at /srv/gvmhaus /var/www; do
  if [[ -f "${d}/index.html" ]]; then
    WEBROOT="$d"
    break
  fi
done

if [[ -z "$WEBROOT" ]]; then
  echo "ERROR: nem találom a webrootot (index.html)." >&2
  exit 1
fi

echo "==> Webroot: $WEBROOT"
echo "==> Branch:  $BRANCH"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

for rel in chatbot.js chatbot.css; do
  fetch_file "${rel}" "${tmp}/${rel}"
  if [[ -f "${WEBROOT}/${rel}" ]]; then
    cp -a "${WEBROOT}/${rel}" "${WEBROOT}/${rel}.bak-chatbot-${STAMP}"
    echo "  backup: /${rel}.bak-chatbot-${STAMP}"
  fi
  install -m 0644 "${tmp}/${rel}" "${WEBROOT}/${rel}"
  echo "  OK  /${rel}"
done

echo ""
echo "==> Kész. Teszt:"
echo "  https://gvmhaus.at/ — chat: szigetelés → rövid válasz; „részletek” → mély műszaki"
echo "  (Hard refresh: Ctrl+Shift+R — cache ?v=20260901)"
