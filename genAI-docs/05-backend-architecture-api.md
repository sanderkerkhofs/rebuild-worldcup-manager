# 05 - Backend Architecture and API

This document explains backend structure in a simple, implementation-first way.

## 1. Layered architecture

### Request flow (always the same)

Client -> Controller -> Service -> Repository (Prisma) -> PostgreSQL

### Layer responsibilities

- Controller:
  - route wiring
  - auth middleware usage
  - request/response mapping
  - no business rules
- Service:
  - business workflow
  - authorization checks
  - progression logic
  - orchestration of repositories and domain rules
- Domain model:
  - constructor invariants
  - static `from` mappings
- Repository/Prisma:
  - persistence
  - indexes and constraints

### Simple rule of thumb

- Controllers should stay thin.
- Services should contain decision logic.
- Repositories should only talk to the database.

## 2. Target backend structure

```text
back-end/
  app.ts
  controller/
    authController.ts
    tournamentController.ts
    matchController.ts
    playerController.ts
    userController.ts
  service/
    authService.ts
    tournamentService.ts
    roundProgressionService.ts
    matchService.ts
    playerService.ts
    userService.ts
  model/
    user.ts
    team.ts
    player.ts
    match.ts
    goal.ts
  repository/
    prisma/
      schema.prisma
      migrations/
      client.ts
  util/
    middleware.ts
    jwt.ts
    password.ts
    swagger.ts
    competition.ts
    seed.ts
  types/
    index.ts
  test/
```

## 3. Core endpoints

The endpoint list below is the required API surface for this assignment.

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Competition

- `GET /api/competition`
- `GET /api/competition/overview`
- `GET /api/competition/bracket`
- `GET /api/competition/rounds`
- `POST /api/competition/rounds/:roundOrderNumber/simulate` (admin)
- `POST /api/competition/reset-matches` (admin)

### Matches

- `GET /api/matches`
- `GET /api/matches/top-scorers`
- `GET /api/matches/:matchId`
- `PATCH /api/matches/:matchId/status` (admin/referee)
- `PUT /api/matches/:matchId/result` (admin/referee)
- `POST /api/matches/:matchId/goals` (admin/referee)
- `PATCH /api/matches/:matchId/goals/:goalId` (admin/referee)

### Players

- `GET /api/players`
- `GET /api/players/:playerId`
- `POST /api/players` (admin)
- `PUT /api/players/:playerId` (admin)
- `PATCH /api/players/:playerId/status` (admin)
- `DELETE /api/players/:playerId` (admin)

### Users

- `GET /api/users` (admin)
- `DELETE /api/users/:userId` (admin, no self-delete)

### Minimal CRUD showcase mapping

Use this to demonstrate fullstack CRUD expectations in class:

- Create: `POST /api/players`
- Read: `GET /api/players` and `GET /api/players/:playerId`
- Update: `PUT /api/players/:playerId` and `PATCH /api/players/:playerId/status`
- Delete: `DELETE /api/players/:playerId`

## 4. Middleware design

- `authenticateToken`
- `requireRoles(...roles)`
- `asyncHandler`
- centralized `errorHandler`

Execution order for protected routes:

1. authenticate token
2. validate role
3. run controller
4. controller calls service
5. service may throw typed application errors
6. centralized error handler formats response

## 5. API contract principles

- Never expose password hash.
- Return typed DTOs only.
- Keep enum values consistent between DB, backend, frontend.
- Use explicit validation errors with clear messages.
- Round routes use `roundOrderNumber` only (1..4) as identifier.
- Round completion is derived by services (all round matches `FINISHED` + progression succeeded), not represented as a client-set match status.

### Response and error shape guidance

- Success responses should return stable DTOs.
- Validation and authorization failures should return clear, human-readable messages.
- Never leak stack traces or internal database details in API responses.

## 6. Swagger requirements

- mounted at `/api-docs`
- include schemas for all request/response bodies
- include auth requirements per protected route
- include examples for role-specific routes

Swagger is part of the learning goal: every important route should be easy to test manually.

## 7. Testing strategy

- domain unit tests:
  - invariant checks
  - enum validation
  - invalid constructor input rejection
- service unit tests:
  - role guard logic
  - round lock logic
  - progression logic
  - score/goal validation
- manual verification via Swagger for endpoint behavior

## 8. Beginner-friendly implementation guardrails

- Prefer explicit naming over short or clever naming.
- Keep controller files focused by resource.
- Keep service methods small and single-purpose where possible.
- Add short comments only where business rules are not obvious.
- Avoid unnecessary abstraction layers for this assignment.
