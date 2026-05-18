#!/usr/bin/env bash
# AlphaPanel — create hosting account (called by daemon only)
set -euo pipefail
USERNAME="${1:?username required}"
DOMAIN="${2:?domain required}"
HOME_DIR="/home/${USERNAME}"

useradd -m -s /bin/bash "$USERNAME" 2>/dev/null || true
mkdir -p "${HOME_DIR}/public_html"
chown -R "${USERNAME}:${USERNAME}" "$HOME_DIR"
echo "AlphaPanel: created hosting for ${USERNAME} (${DOMAIN})"
