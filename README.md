# AlphaPanel

Modern self-hosted hosting control panel. No license, no activation keys, full self-hosted.

## Architecture

```
alphapanel/
├── frontend/     # Next.js + TypeScript + Tailwind + shadcn/ui
├── backend/      # NestJS + Prisma + JWT + Socket.IO
├── daemon/       # Privileged root operations (Unix socket)
├── workers/      # BullMQ job processors
├── nginx/        # Reverse proxy templates
├── docker/       # Docker Compose stack
└── monitoring/   # Metrics collectors
```

## Authentication

- **JWT access tokens** (short-lived) + **opaque refresh tokens** (stored hashed in DB)
- **Roles:** `SUPER_ADMIN`, `ADMIN`, `RESELLER`, `USER`
- **Session management:** list/revoke sessions, logout, logout-all
- **API:** `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`, `GET /auth/me`, `GET /auth/sessions`
- **Frontend:** Next.js middleware protects panel routes; `AuthProvider` + auto token refresh

Default admin after seed: `admin@alphapanel.local` / `AlphaPanel@2026`

## Quick Start (Development)

```bash
# Backend
cd backend && cp .env.example .env && npm install && npx prisma migrate dev && npm run start:dev

# Frontend
cd frontend && cp .env.example .env.local && npm install && npm run dev

# Daemon (Linux only, requires root for production)
cd daemon && npm install && npm run build

# Workers
cd workers && npm install && npm run start:dev
```

## Production Install (Ubuntu)

```bash
sudo bash scripts/install-ubuntu.sh
```

## Stack

- **Frontend:** Next.js, TypeScript, TailwindCSS, shadcn/ui, Framer Motion
- **Backend:** NestJS, Prisma, MariaDB/MySQL, Redis, Socket.IO
- **Security:** JWT, Helmet, rate limiting, 2FA, CSRF protection

## License

Self-hosted — no subscription restrictions. AlphaPanel branding throughout.
