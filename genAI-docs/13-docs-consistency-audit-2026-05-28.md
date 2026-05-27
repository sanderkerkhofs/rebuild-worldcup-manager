# 13 - Docs Consistency Audit (2026-05-28)

## Purpose

This note summarizes the documentation alignment pass after scope and learning-goal refinements.

## Audit scope

Checked across all files in `genAI-docs`:

- role model consistency
- match lifecycle consistency
- round identifier consistency
- locale naming consistency
- assignment intent and beginner-readability alignment

## Confirmed decisions (canonical)

1. Guest model

- Guest is unauthenticated and not stored as a database role.
- Persisted roles are `ADMIN`, `REFEREE`, `USER`.

2. Knockout scoring

- Draws are not allowed in persisted knockout match results.
- Every finished match has a winner.

3. Round identifier

- API and service boundaries use `roundOrderNumber` (1..4).
- Legacy `:roundId` route style is removed from docs.

4. Match lifecycle

- Match statuses: `PLANNED`, `NOT_STARTED`, `IN_PROGRESS`, `FINISHED`.
- `COMPLETED` is not a match status.
- Round completion is derived: all matches in round are `FINISHED` and progression succeeds.

5. Locale naming

- Canonical locale codes are `en`, `nl`, `fr`.
- UI labels may render uppercase (`EN`, `NL`, `FR`) while stored values stay lowercase.

6. Assignment intent

- Project is a school assignment and fullstack CRUD showcase.
- Priority is clear structure, readable code, and easy explanation.
- UI should be clean and nice, but visual perfection is not the top priority.
- Logic should be correct for assignment/demo use, not real-world perfect simulation.

## Files most impacted

- `00-project-charter.md`
- `01-requirements.md`
- `03-domain-business-logic.md`
- `04-data-model-erd.md`
- `05-backend-architecture-api.md`
- `06-frontend-architecture-layout.md`
- `07-auth-roles-security.md`
- `09-ai-rebuild-playbook.md`
- `10-definition-of-done-checklist.md`
- `11-recreation-analysis.md`
- `12-project-intent-and-learning-goals.md`

## Result

Documentation is now internally consistent with the intended assignment scope and implementation style.

No blocking contradictions were found in the audited areas.

## Next practical usage

When generating or reviewing code, treat this file plus:

- `12-project-intent-and-learning-goals.md`
- `10-definition-of-done-checklist.md`

as the primary quality and consistency gate.
