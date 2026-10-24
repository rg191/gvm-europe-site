#!/usr/bin/env bash
# gvmeurope.ro deploy – futtasd a Hetzner szerveren.
# A szerver címét ez a fájl szándékosan nem tartalmazza (publikus repó);
# lásd a Hetzner konzolt vagy a jelszókezelőt.
set -euo pipefail

SITE_DIR="/srv/sites/gvmeurope.ro"
REPO_URL="https://github.com/rg191/gvm-europe-site.git"
BRANCH="${DEPLOY_BRANCH:-main}"

echo "==> gvmeurope.ro deploy (${SITE_DIR})"

if [[ ! -d "${SITE_DIR}/repo/.git" ]]; then
  echo "==> Első telepítés: repo klónozása..."
  mkdir -p "${SITE_DIR}"
  git clone --branch "${BRANCH}" "${REPO_URL}" "${SITE_DIR}/repo"
fi

echo "==> Repo frissítése (${BRANCH})..."
git -C "${SITE_DIR}/repo" fetch origin
git -C "${SITE_DIR}/repo" checkout "${BRANCH}"
git -C "${SITE_DIR}/repo" pull origin "${BRANCH}"

echo "==> Site fájlok szinkronizálása..."
rsync -av --delete \
  "${SITE_DIR}/repo/sites/gvmeurope.ro/" \
  "${SITE_DIR}/" \
  --exclude repo

echo "==> Docker konténer újraépítése..."
cd "${SITE_DIR}"
docker compose up -d --build

echo ""
echo "✓ Kész! A site fut: http://127.0.0.1:9081"
echo "  Domain: gvmeurope.ro → proxy (Coolify/Envoy) → port 9081"
echo "  Konténer: gvmeurope-ro-web"
echo "  Nyelvek: RO (gyökér), HU (/hu/), EN (/en/)"
echo "  Logo: static/logo.svg (helyi fájl, nem külső URL)"
