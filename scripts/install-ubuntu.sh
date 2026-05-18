#!/usr/bin/env bash
# AlphaPanel — Ubuntu 22.04/24.04 production installer
# Self-hosted, no license, full stack
set -euo pipefail

ALPHAPANEL_ROOT="${ALPHAPANEL_ROOT:-/opt/alphapanel}"
ALPHAPANEL_USER="alphapanel"
NODE_VERSION="22"
DOMAIN="${ALPHAPANEL_DOMAIN:-panel.local}"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[AlphaPanel]${NC} $*"; }
ok() { echo -e "${GREEN}[OK]${NC} $*"; }
err() { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || err "Run as root: sudo bash install-ubuntu.sh"

log "Updating system packages..."
apt-get update -y
apt-get upgrade -y

log "Installing dependencies..."
apt-get install -y curl git build-essential nginx mariadb-server redis-server \
  certbot python3-certbot-nginx ufw fail2ban docker.io docker-compose-plugin

# Node.js via NodeSource
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
  apt-get install -y nodejs
fi
ok "Node $(node -v)"

# Create system user
if ! id "$ALPHAPANEL_USER" &>/dev/null; then
  useradd -r -m -d "$ALPHAPANEL_ROOT" -s /bin/bash "$ALPHAPANEL_USER"
  ok "Created user $ALPHAPANEL_USER"
fi

# Clone or copy project
if [[ ! -d "$ALPHAPANEL_ROOT/backend" ]]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
  log "Copying AlphaPanel from $PROJECT_ROOT to $ALPHAPANEL_ROOT"
  mkdir -p "$ALPHAPANEL_ROOT"
  rsync -a --exclude node_modules --exclude .next --exclude dist "$PROJECT_ROOT/" "$ALPHAPANEL_ROOT/"
fi

chown -R "$ALPHAPANEL_USER:$ALPHAPANEL_USER" "$ALPHAPANEL_ROOT"

# MariaDB setup
log "Configuring MariaDB..."
MYSQL_ROOT_PASS="${MYSQL_ROOT_PASSWORD:-$(openssl rand -base64 24)}"
mysql -e "CREATE DATABASE IF NOT EXISTS alphapanel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || true
mysql -e "CREATE USER IF NOT EXISTS 'alphapanel'@'localhost' IDENTIFIED BY '${MYSQL_PASSWORD:-alphapanel_secret}';" 2>/dev/null || true
mysql -e "GRANT ALL PRIVILEGES ON alphapanel.* TO 'alphapanel'@'localhost'; FLUSH PRIVILEGES;" 2>/dev/null || true

# Environment files
JWT_SECRET="${JWT_SECRET:-$(openssl rand -base64 48)}"
DAEMON_SECRET="${DAEMON_SHARED_SECRET:-$(openssl rand -base64 32)}"

if [[ ! -f "$ALPHAPANEL_ROOT/backend/.env" ]]; then
  cp "$ALPHAPANEL_ROOT/backend/.env.example" "$ALPHAPANEL_ROOT/backend/.env"
  sed -i "s|change-me-to-a-long-random-string-in-production|$JWT_SECRET|g" "$ALPHAPANEL_ROOT/backend/.env"
  sed -i "s|change-me-daemon-secret|$DAEMON_SECRET|g" "$ALPHAPANEL_ROOT/backend/.env"
  sed -i "s|alphapanel_secret|${MYSQL_PASSWORD:-alphapanel_secret}|g" "$ALPHAPANEL_ROOT/backend/.env"
fi

if [[ ! -f "$ALPHAPANEL_ROOT/frontend/.env.local" ]]; then
  cp "$ALPHAPANEL_ROOT/frontend/.env.example" "$ALPHAPANEL_ROOT/frontend/.env.local"
fi

# Install & build
log "Installing backend..."
cd "$ALPHAPANEL_ROOT/backend"
sudo -u "$ALPHAPANEL_USER" npm ci
sudo -u "$ALPHAPANEL_USER" npx prisma generate
sudo -u "$ALPHAPANEL_USER" npx prisma migrate deploy
sudo -u "$ALPHAPANEL_USER" npm run seed 2>/dev/null || true
sudo -u "$ALPHAPANEL_USER" npm run build

log "Installing frontend..."
cd "$ALPHAPANEL_ROOT/frontend"
sudo -u "$ALPHAPANEL_USER" npm ci
sudo -u "$ALPHAPANEL_USER" npm run build

log "Installing daemon..."
cd "$ALPHAPANEL_ROOT/daemon"
sudo -u "$ALPHAPANEL_USER" npm ci
sudo -u "$ALPHAPANEL_USER" npm run build

log "Installing workers..."
cd "$ALPHAPANEL_ROOT/workers"
sudo -u "$ALPHAPANEL_USER" npm ci

# Daemon socket directory
mkdir -p /var/run/alphapanel
chown root:"$ALPHAPANEL_USER" /var/run/alphapanel
chmod 750 /var/run/alphapanel

# Systemd services
cat > /etc/systemd/system/alphapanel-api.service <<EOF
[Unit]
Description=AlphaPanel API
After=network.target mariadb.service redis-server.service

[Service]
Type=simple
User=$ALPHAPANEL_USER
WorkingDirectory=$ALPHAPANEL_ROOT/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/main.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/alphapanel-frontend.service <<EOF
[Unit]
Description=AlphaPanel Frontend
After=alphapanel-api.service

[Service]
Type=simple
User=$ALPHAPANEL_USER
WorkingDirectory=$ALPHAPANEL_ROOT/frontend
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm run start
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/alphapanel-daemon.service <<EOF
[Unit]
Description=AlphaPanel Privileged Daemon
After=network.target

[Service]
Type=simple
User=root
Environment=DAEMON_SOCKET_PATH=/var/run/alphapanel/daemon.sock
Environment=DAEMON_SHARED_SECRET=$DAEMON_SECRET
WorkingDirectory=$ALPHAPANEL_ROOT/daemon
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/alphapanel-workers.service <<EOF
[Unit]
Description=AlphaPanel Workers
After=redis-server.service alphapanel-api.service

[Service]
Type=simple
User=$ALPHAPANEL_USER
WorkingDirectory=$ALPHAPANEL_ROOT/workers
ExecStart=/usr/bin/npx ts-node src/index.ts
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable alphapanel-api alphapanel-frontend alphapanel-daemon alphapanel-workers
systemctl restart alphapanel-api alphapanel-frontend alphapanel-daemon alphapanel-workers

# Nginx
log "Configuring Nginx..."
cp "$ALPHAPANEL_ROOT/nginx/alphapanel.conf" /etc/nginx/sites-available/alphapanel
sed -i "s/panel.example.com/$DOMAIN/g" /etc/nginx/sites-available/alphapanel
ln -sf /etc/nginx/sites-available/alphapanel /etc/nginx/sites-enabled/alphapanel
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
nginx -t && systemctl reload nginx

# Metrics collector cron
chmod +x "$ALPHAPANEL_ROOT/monitoring/collector.sh"
(crontab -l 2>/dev/null | grep -v alphapanel-collector; echo "* * * * * $ALPHAPANEL_ROOT/monitoring/collector.sh") | crontab -

# Firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

ok "AlphaPanel installed successfully!"
echo ""
echo "  Panel URL:  http://$DOMAIN"
echo "  API Docs:   http://$DOMAIN/docs (via API port 4000 in dev)"
echo "  Admin:      admin@alphapanel.local / AlphaPanel@2026"
echo ""
echo "  Services:"
echo "    systemctl status alphapanel-api"
echo "    systemctl status alphapanel-frontend"
echo "    systemctl status alphapanel-daemon"
echo ""
echo "  Change default password after first login."
