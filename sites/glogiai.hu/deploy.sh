#!/usr/bin/env bash
# glogiai.hu deploy – futtasd a Hetzner szerveren
set -euo pipefail

SITE_DIR="/srv/sites/glogiai.hu"
REPO_URL="https://github.com/rg191/gvm-europe-site.git"
BRANCH="${DEPLOY_BRANCH:-main}"

echo "==> glogiai.hu deploy (${SITE_DIR})"

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
  "${SITE_DIR}/repo/sites/glogiai.hu/" \
  "${SITE_DIR}/" \
  --exclude repo \
  --exclude public

echo "==> Docker konténer újraépítése..."
cd "${SITE_DIR}"
docker compose up -d --build

echo ""
echo "✓ Kész! A site fut: http://127.0.0.1:9080"
echo "  Domain: glogiai.hu → proxy (Coolify/Envoy) → port 9080"
echo "  Konténer: glogiai-hu-web"
echo "  Szerkesztés: ${SITE_DIR}/repo/sites/glogiai.hu/public/"
