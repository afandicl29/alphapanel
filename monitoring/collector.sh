#!/usr/bin/env bash
# AlphaPanel host metrics collector — run via cron every 60s
set -euo pipefail

REDIS_URL="${REDIS_URL:-redis://127.0.0.1:6379}"
KEY="alphapanel:metrics:host"

CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
MEM_TOTAL=$(free -m | awk '/Mem:/ {print $2}')
MEM_USED=$(free -m | awk '/Mem:/ {print $3}')
DISK=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')
NET_RX=$(cat /sys/class/net/$(ip route | awk '/default/ {print $5}')/statistics/rx_bytes 2>/dev/null || echo 0)
NET_TX=$(cat /sys/class/net/$(ip route | awk '/default/ {print $5}')/statistics/tx_bytes 2>/dev/null || echo 0)
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

PAYLOAD=$(cat <<EOF
{"cpu":$CPU,"ramUsed":$MEM_USED,"ramTotal":$MEM_TOTAL,"diskUsedPercent":$DISK,"networkRx":$NET_RX,"networkTx":$NET_TX,"timestamp":"$TS"}
EOF
)

redis-cli -u "$REDIS_URL" SET "$KEY" "$PAYLOAD" EX 120 >/dev/null 2>&1 || true
