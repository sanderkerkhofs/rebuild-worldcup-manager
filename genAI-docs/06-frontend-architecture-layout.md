# 06 - Frontend Architecture and Layout

This document describes a simple, clear frontend structure for the assignment.

## 1. Frontend goals

- show tournament state clearly
- enforce UX-level role restrictions
- keep API calls out of UI components
- keep components reusable and testable
- keep code easy to read and explain by a novice developer

## 2. Frontend stack

- Next.js (Pages Router)
- React + TypeScript
- SWR for server data fetching
- localStorage for JWT + user + locale

## 3. Target structure

```text
front-end/
  pages/
    _app.tsx
    index.tsx
    login.tsx
    register.tsx
    matches/index.tsx
    matches/[matchId].tsx
    stats.tsx
    admin.tsx
    referee.tsx
  components/
    Layout.tsx
    LoginForm.tsx
    DashboardPanels.tsx
  services/
    authService.ts
    competitionService.ts
  lib/
    api.ts
    useSession.tsx
    session.ts
    i18n.tsx
    matchStatus.ts
  styles/
    globals.css
  types/
    index.ts
```

Keep this structure simple. Do not add extra folders unless needed by assignment scope.

## 4. Layout and navigation rules

- Global `Layout` wraps every page in `_app.tsx`.
- Navigation is role-aware:
  - guest: home/login/register
  - authenticated user: matches/stats
  - admin: admin page visible
  - referee: referee page visible
- Language switcher always available.

Simple navigation rule:

- guest sees only public pages
- logged-in users see user pages
- role-specific pages appear only for allowed roles

## 5. Page responsibilities

- `index.tsx`:
  - current round summary
  - top standings and top scorers preview
- `login.tsx` / `register.tsx`:
  - authentication forms
  - predefined account hints for demo
- `matches/index.tsx`:
  - grouped fixtures by round
- `matches/[matchId].tsx`:
  - match detail
  - status/result/goal edits by permitted roles
- `stats.tsx`:
  - standings and scorer tables
- `admin.tsx`:
  - simulate round
  - reset tournament
  - user management
- `referee.tsx`:
  - assigned matches list and quick actions

Each page should focus on one main job and delegate API calls to services.

## 6. State and data flow

- Session context stores `token`, `user`, `isAuthenticated`.
- SWR keys include token scope where needed.
- Service modules call a shared API client wrapper.
- UI components do not call `fetch` directly.

Recommended flow per page:

1. read session/role from context
2. request data via service + SWR
3. render loading, error, or data state
4. call service mutations for actions
5. revalidate data after successful mutation

## 7. Route guard policy

- Guests can access public pages only.
- Protected pages show clear access-denied messaging.
- Forbidden role should receive explanation, not blank page.

Frontend guards improve UX, but backend authorization remains the source of truth.

## 8. i18n policy

- support `nl`, `en`, `fr`
- translation dictionary key-based
- locale persisted in storage
- use locale codes in state/API (`en`, `nl`, `fr`); UI labels may render uppercase (`EN`, `NL`, `FR`)
- minimum pages translated:
  - home
  - login/register
  - matches or stats

Keep translation keys short and consistent so they are easy to maintain.

## 9. UX consistency rules for rebuild

- Use consistent status badges and labels.
- Keep table columns aligned across pages.
- Keep actions disabled when business preconditions fail.
- Surface backend error messages in user-readable blocks.

UI/UX should look clean and organized, but avoid spending assignment time on excessive visual complexity.

## 10. Beginner-friendly frontend guardrails

- Keep components small and purposeful.
- Prefer explicit prop names and type names.
- Avoid deeply nested component trees when not necessary.
- Add concise comments only for non-obvious logic.
- Use shared UI patterns (cards, tables, badges, buttons) consistently across pages.
