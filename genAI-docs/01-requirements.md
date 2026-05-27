# 01 - Requirements

## 1. Functional requirements

### FR-01 Competition identity

- System exposes one fixed competition:
  - name: worldcup-manager-2026
  - year: 2026
  - hostCountry: United States, Canada, Mexico
  - format: Knockout

### FR-02 Fixed tournament structure

- System supports fixed rounds only:
  - round 1: 8th Final (8 matches)
  - round 2: Quarterfinal (4 matches)
  - round 3: Semifinal (2 matches)
  - round 4: Final (1 match)
- Canonical round identifier is `roundOrderNumber` (1..4).

### FR-03 Team and player seed

- Seed exactly 16 teams.
- Seed 15 players per team.
- Each player has:
  - first/last name
  - shirt number (unique per team)
  - position
  - status (`AVAILABLE` or `UNAVAILABLE`)

### FR-04 Match lifecycle

- Matches have lifecycle statuses:
  - `PLANNED`
  - `NOT_STARTED`
  - `IN_PROGRESS`
  - `FINISHED`
- `FINISHED` is the terminal status a referee can set for an individual match.
- Round completion is derived (not stored as match status): all matches in the round are `FINISHED` and progression to next round succeeds.
- Score and status updates must obey role and round lock rules.
- Draw results are invalid in all knockout matches.

### FR-05 Goal registration

- Goal event stores `matchId`, `playerId`, `teamId`.
- Scorer must be:
  - existing player
  - in selected team
  - `AVAILABLE`

### FR-06 Winner progression

- When all matches in round N are finished with valid non-draw scores, winners are assigned to round N+1 in bracket order.
- Round N becomes logically complete once progression is successful.

### FR-07 Authentication

- Public register endpoint creates `USER` account only.
- Login returns JWT and public user profile.
- Protected endpoints require valid JWT.

### FR-08 Authorization

- Admin:
  - simulate round
  - reset tournament matches
  - list users
  - delete user except self
  - full match/player control
- Referee:
  - update status/result/goals only for assigned matches
- User/Guest:
  - read-only access according to page policy

Note: Guest is unauthenticated and not stored in the database.

### FR-09 Public competition views

- Overview endpoint returns:
  - competition metadata
  - teams
  - rounds
  - matches
  - standings
  - top scorers

### FR-10 i18n

- At least 3 pages must support 2+ locales.
- Locale switch must be available in UI.
- Canonical locale codes are `en`, `nl`, and `fr`.

## 2. Non-functional requirements

### NFR-01 Stack compliance

- Use TypeScript in frontend and backend.
- Use Express, Next.js, Prisma, PostgreSQL.

### NFR-02 Layering

- Controllers: transport only, no business validation.
- Services: workflow and authorization validation.
- Domain models: invariant and input validation.
- Repository/ORM mapping isolated from service contracts.

Implementation should remain beginner-friendly and avoid unnecessary abstraction layers.

### NFR-03 API quality

- Swagger docs complete and executable.
- At least one complete CRUD method route (`GET`, `POST`, `PUT`, `DELETE`) tested against real DB.

### NFR-04 Security

- Password hashing with bcrypt.
- JWT auth middleware.
- Helmet enabled.
- CORS configured.

### NFR-05 UX

- Responsive desktop/mobile pages.
- Clear error messages for forbidden and invalid operations.
- UI should look clean and consistent, but visual polish is secondary to functional correctness and code clarity.

### NFR-06 Testability

- Domain validations fully unit tested.
- Service layer business logic fully unit tested.
- Controller flows manually verifiable via Swagger.

### NFR-07 Readability and explainability

- Code should be easy to read and explain by a novice developer.
- Use clear naming and concise comments for non-obvious logic.
- Prefer simple, explicit implementations over clever patterns.
