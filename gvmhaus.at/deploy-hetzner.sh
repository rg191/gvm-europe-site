#!/usr/bin/env bash
# GVM Haus — élesítés: szállítási megjegyzés + FAQ + modelloldalak
# Futtasd a gvmhaus Hetzner VM-en rootként (Cloud Console → Console):
#   curl -fsSL https://raw.githubusercontent.com/rg191/gvm-europe-site/cursor/gvmhaus-elesites-9ef9/gvmhaus.at/deploy-hetzner.sh | bash
set -euo pipefail

BRANCH="${BRANCH:-cursor/chatbot-kommunikacio-megfeleloseg-4aa6}"
BASE="https://raw.githubusercontent.com/rg191/gvm-europe-site/${BRANCH}/gvmhaus.at"
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
echo "==> Backup:  *.bak-elesites-$STAMP"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
mkdir -p "${tmp}/hu" "${WEBROOT}/hu"

fetch() {
  local rel="$1"
  curl -fsSL "${BASE}/${rel}" -o "${tmp}/${rel}"
}

backup_if_exists() {
  local dest="$1"
  if [[ -f "$dest" ]]; then
    cp -a "$dest" "${dest}.bak-elesites-${STAMP}"
  fi
}

install_file() {
  local rel="$1"
  local dest="${WEBROOT}/${rel}"
  backup_if_exists "$dest"
  install -m 0644 "${tmp}/${rel}" "$dest"
  echo "  OK  /$rel"
}

echo "==> Letöltés GitHubról..."
for rel in \
  index.html \
  faq.html \
  chatbot.js \
  chatbot.css \
  gvmhaus-15.html \
  gvmhaus-30.html \
  gvmhaus-44.html \
  gvmhaus-u-01.html \
  gvmhaus-u-02.html \
  hu/index.html \
  hu/faq.html
do
  fetch "$rel"
done

echo "==> Telepítés (backup + overwrite)..."
for rel in \
  index.html \
  faq.html \
  chatbot.js \
  chatbot.css \
  gvmhaus-15.html \
  gvmhaus-30.html \
  gvmhaus-44.html \
  gvmhaus-u-01.html \
  gvmhaus-u-02.html \
  hu/index.html \
  hu/faq.html
do
  install_file "$rel"
done

# FAQ menüpont a többi (nem felülírt) oldalon is, ha még nincs
echo "==> FAQ menüpont pótlása a többi oldalon (ha hiányzik)..."
python3 - <<'PY' "$WEBROOT"
import pathlib, sys
root = pathlib.Path(sys.argv[1])
patterns = [
    (
        '    <li><a href="galerie.html" data-de="Galerie" data-hu="Galéria">Galerie</a></li>\n',
        '    <li><a href="faq.html" data-de="FAQ" data-hu="GYIK">FAQ</a></li>\n',
    ),
    (
        '    <li><a href="/galerie.html" data-de="Galerie" data-hu="Galéria">Galerie</a></li>\n',
        '    <li><a href="/faq.html" data-de="FAQ" data-hu="GYIK">FAQ</a></li>\n',
    ),
    (
        '    <li><a href="https://gvmhaus.at/galerie.html" data-de="Galerie" data-hu="Galéria">Galerie</a></li>\n',
        '    <li><a href="https://gvmhaus.at/faq.html" data-de="FAQ" data-hu="GYIK">FAQ</a></li>\n',
    ),
]
skip_names = {
    "index.html", "faq.html",
    "gvmhaus-15.html", "gvmhaus-30.html", "gvmhaus-44.html",
    "gvmhaus-u-01.html", "gvmhaus-u-02.html",
}
changed = 0
for path in sorted(root.rglob("*.html")):
    if path.name.endswith(f".bak-elesites-") or ".bak-elesites-" in path.name:
        continue
    # skip files we just overwrote (already have FAQ)
    try:
        rel = path.relative_to(root).as_posix()
    except ValueError:
        continue
    if rel in ("index.html", "faq.html", "hu/index.html", "hu/faq.html") or path.name in skip_names:
        # still ensure FAQ present on non-overwritten pages only
        if rel in ("index.html", "faq.html", "hu/index.html", "hu/faq.html") or path.name.startswith("gvmhaus-"):
            continue
    text = path.read_text(errors="replace")
    if "faq.html" in text.split("nav-links", 1)[-1].split("</ul>", 1)[0] if "nav-links" in text else "":
        continue
    new = text
    for marker, faq in patterns:
        if marker in new:
            new = new.replace(marker, marker + faq, 1)
            break
    if new != text:
        path.write_text(new)
        print(f"  FAQ nav: /{rel}")
        changed += 1
print(f"  ({changed} oldal frissítve)")
PY

echo
echo "KESZ — ellenőrizd:"
echo "  https://gvmhaus.at/"
echo "  https://gvmhaus.at/faq.html"
echo "  https://gvmhaus.at/hu/faq.html"
echo "  https://gvmhaus.at/gvmhaus-15.html"
echo
echo "Visszaállítás példája:"
echo "  cp ${WEBROOT}/index.html.bak-elesites-${STAMP} ${WEBROOT}/index.html"
