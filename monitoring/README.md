# AlphaPanel Monitoring

Collectors push metrics to Redis and the backend exposes them via `/api/v1/metrics`.

- `collector.sh` — cron-friendly host metrics (CPU, RAM, disk, network)
- Integrates with dashboard realtime via Socket.IO `metrics:update`
