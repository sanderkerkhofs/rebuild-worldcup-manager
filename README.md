# Rebuild Worldcup Manager

Full-stack Worldcup Manager rebuild.

- Backend: Express + TypeScript + Prisma
- Frontend: Next.js (Pages Router) + TypeScript
- Database: PostgreSQL (Docker)

## Prerequisites

- Node.js 20+
- npm 10+
- Docker + Docker Compose

## Quick Start

1. Start PostgreSQL

```bash
docker compose -f genAI-docs/docker-compose-pgsql.yml up -d --build
```

2. Install dependencies

```bash
npm install --prefix back-end
npm install --prefix front-end
```

3. Configure env files

```bash
cp back-end/.env.example back-end/.env
cp front-end/.env.local.example front-end/.env.local
```

4. Generate Prisma client, run migration, and seed data

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

5. Start both apps (separate terminals)

```bash
npm run dev:backend
npm run dev:frontend
```

6. Open apps

- Frontend: http://localhost:8080
- Backend status: http://localhost:3000/status
- Swagger UI: http://localhost:3000/api-docs

## Demo Credentials (Seeded)

The seed script creates these accounts.

### Admin

- Username: `admin`
- Password: `admin123`

### Referees

- Username: `Frank_De_Bleeckere`, Password: `referee123`
- Username: `Ismail_Elfath`, Password: `referee123`
- Username: `Michael_Oliver`, Password: `referee123`
- Username: `Tori_Penso`, Password: `referee123`

### Regular Users

- Username: `greetjej`, Password: `user123`
- Username: `elkes`, Password: `user123`
- Username: `johanp`, Password: `user123`

## API Base URL

- `http://localhost:3000/api`

For authenticated routes, send:

- Header: `Authorization: Bearer <jwt-token>`

## API Endpoints

### Health / Docs

- `GET /status`
- `GET /api-docs`

### Auth

- `POST /api/auth/register` (public)
- `POST /api/auth/login` (public)
- `GET /api/auth/me` (authenticated)

### Competition

- `GET /api/competition` (public)
- `GET /api/competition/overview` (public)
- `GET /api/competition/bracket` (public)
- `GET /api/competition/rounds` (public)
- `POST /api/competition/rounds/:roundOrderNumber/simulate` (ADMIN)
- `POST /api/competition/reset-matches` (ADMIN)

### Matches

- `GET /api/matches` (public)
- `GET /api/matches/top-scorers` (public)
- `GET /api/matches/:matchId` (public)
- `PATCH /api/matches/:matchId/status` (ADMIN, REFEREE)
- `PUT /api/matches/:matchId/result` (ADMIN, REFEREE)
- `POST /api/matches/:matchId/goals` (ADMIN, REFEREE)
- `PATCH /api/matches/:matchId/goals/:goalId` (ADMIN, REFEREE)

### Players

- `GET /api/players` (public)
- `GET /api/players/:playerId` (public)
- `POST /api/players` (ADMIN)
- `PUT /api/players/:playerId` (ADMIN)
- `PATCH /api/players/:playerId/status` (ADMIN)
- `DELETE /api/players/:playerId` (ADMIN)

### Users

- `GET /api/users` (ADMIN)
- `DELETE /api/users/:userId` (ADMIN)

## Useful Commands

From repository root:

```bash
npm run build
npm run test
```

Backend only:

```bash
npm --prefix back-end run dev
npm --prefix back-end run build
npm --prefix back-end run test
```

Frontend only:

```bash
npm --prefix front-end run dev
npm --prefix front-end run build
```
