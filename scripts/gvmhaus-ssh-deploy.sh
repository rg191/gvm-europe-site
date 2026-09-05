#!/usr/bin/env bash
# GVM Haus chatbot deploy via SSH (Cloud Agent + environment secrets)
set -euo pipefail

KEY="${GVMHAUS_SSH_PRIVATE_KEY:-}"
HOST="${GVMHAUS_SSH_HOST:-116.203.115.156}"
USER="${GVMHAUS_SSH_USER:-root}"
BRANCH="${GVMHAUS_DEPLOY_BRANCH:-cursor/chatbot-kommunikacio-megfeleloseg-4aa6}"
DEPLOY_URL="https://raw.githubusercontent.com/rg191/gvm-europe-site/${BRANCH}/gvmhaus.at/deploy-chatbot.sh"

if [[ -z "$KEY" ]]; then
  echo "ERROR: GVMHAUS_SSH_PRIVATE_KEY secret hiányzik." >&2
  exit 1
fi

mkdir -p ~/.ssh
chmod 700 ~/.ssh
printf '%s\n' "$KEY" > ~/.ssh/gvmhaus_deploy
chmod 600 ~/.ssh/gvmhaus_deploy

SSH_OPTS=(
  -i ~/.ssh/gvmhaus_deploy
  -o BatchMode=yes
  -o StrictHostKeyChecking=accept-new
  -o ConnectTimeout=15
)

# Prefer Hetzner hostname if reverse DNS resolves
if [[ "$HOST" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  RDNS="$(host "$HOST" 2>/dev/null | awk '/pointer/ {print $NF}' | sed 's/\.$//' || true)"
  if [[ -n "$RDNS" ]]; then
    HOST="$RDNS"
  fi
fi

echo "==> SSH deploy to ${USER}@${HOST}"
ssh "${SSH_OPTS[@]}" "${USER}@${HOST}" \
  "curl -fsSL '${DEPLOY_URL}' | bash"

echo "==> Live check"
curl -fsSL --max-time 20 "https://gvmhaus.at/chatbot.js?v=20260901" | rg -q "DETAIL_PROMPT|wantsDetail" \
  && echo "OK: chatbot.js frissítve (DETAIL_PROMPT / wantsDetail megtalálva)" \
  || echo "WARN: live chatbot.js még nem mutatja az új kódot — hard refresh vagy cache"
