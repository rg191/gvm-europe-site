#!/usr/bin/env bash
# GVM Haus — belső értékesítői tanulópéldány feltöltése az élő gvmhaus.at-ra
# Futtasd a szerveren rootként (Hetzner Console → Cloud Console → gvmhaus VM):
#   curl -fsSL https://raw.githubusercontent.com/rg191/gvm-europe-site/cursor/gvmhaus-sales-phone-guide-9ebd/gvmhaus.at/deploy-tanulo-hetzner.sh | bash
set -euo pipefail

BRANCH="${BRANCH:-cursor/gvmhaus-sales-phone-guide-9ebd}"
BASE="https://raw.githubusercontent.com/rg191/gvm-europe-site/${BRANCH}/gvmhaus.at"
WEBROOT=""

for d in /var/www/html /var/www/gvmhaus.at /var/www/gvmhaus /srv/www/gvmhaus.at /srv/gvmhaus /var/www; do
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
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

curl -fsSL "${BASE}/ertekesitoi-telefonos-tanulo.html" -o "${tmp}/ertekesitoi-telefonos-tanulo.html"
curl -fsSL "${BASE}/ertekesitoi-telefonos-tanulo.pdf"  -o "${tmp}/ertekesitoi-telefonos-tanulo.pdf" || true

install -m 0644 "${tmp}/ertekesitoi-telefonos-tanulo.html" "${WEBROOT}/ertekesitoi-telefonos-tanulo.html"
if [[ -f "${tmp}/ertekesitoi-telefonos-tanulo.pdf" ]]; then
  install -m 0644 "${tmp}/ertekesitoi-telefonos-tanulo.pdf" "${WEBROOT}/ertekesitoi-telefonos-tanulo.pdf"
fi

# Belső mappa (nem menüpont) — ugyanaz a fájl
mkdir -p "${WEBROOT}/internal"
install -m 0644 "${WEBROOT}/ertekesitoi-telefonos-tanulo.html" \
  "${WEBROOT}/internal/ertekesitoi-telefonos-tanulo.html"

echo "OK"
echo "  HTML: https://gvmhaus.at/ertekesitoi-telefonos-tanulo.html"
echo "  PDF:  https://gvmhaus.at/ertekesitoi-telefonos-tanulo.pdf"
echo "  alt:  https://gvmhaus.at/internal/ertekesitoi-telefonos-tanulo.html"
