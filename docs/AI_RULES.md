# FishQuest AI Rules

Last audited: 2026-05-22

These rules are mandatory for future AI agents working on FishQuest.

## First Steps For Every Agent

Codex must always read the docs before coding.

1. Read `docs/PROJECT_CONTEXT.md`.
2. Read `docs/CURRENT_PROGRESS.md`.
3. Read `docs/ARCHITECTURE.md`.
4. Read `docs/FEATURE_STATUS.md`.
5. Read the doc related to the requested change.
6. Inspect existing code before editing.
7. Confirm whether the requested system already exists.

## Repository Reality Rule

At audit time, this workspace had no app implementation. Future agents must update docs when implementation is added. Do not claim a feature exists unless source files in this workspace prove it.

## Preserve Working Systems

- Never rebuild working systems without strong justification.
- Never replace architecture just because a different pattern is familiar.
- Never rename files casually.
- Never refactor unrelated code during feature work.
- Never remove user changes unless explicitly asked.

## Avoid Duplicate Systems

Before creating a new abstraction, search for existing:

- clients
- services
- hooks
- stores
- components
- tokens
- validation schemas
- error helpers
- database tables
- route groups

If a similar system exists, extend or adapt it unless there is a documented reason not to.

## Documentation Updates Are Required

Codex must update docs after every feature, service integration, schema change, route change, UI-system change, or meaningful technical decision.

Update docs when changing:

- architecture
- folder structure
- dependencies
- routing
- database schema
- RLS policies
- auth flow
- API contracts
- UI tokens or component patterns
- testing strategy
- deployment or environment setup
- feature status

At minimum, update `CHANGELOG.md`, `CURRENT_PROGRESS.md`, and `FEATURE_STATUS.md` for meaningful changes.

## Design Consistency

- Preserve the FishQuest tone: premium, calm, mysterious, collectible, immersive, modern, minimal, outdoor-oriented.
- Do not introduce random UI styles.
- Do not make FishQuest feel like a generic utility dashboard.
- Do not make future AI identification feel like a generic AI UI.
- Use the established UI system once it exists.
- Keep screen copy concise and atmospheric.

## Security Consistency

- RLS is mandatory for user-owned Supabase data.
- Do not commit secrets.
- Do not log tokens or sensitive user data.
- Keep catch photos private by default.
- Treat precise location as sensitive.
- Do not expose service-role keys in mobile code.
- Do not expose AI provider keys in mobile code.
- Treat Mapbox location data and exact catch coordinates as sensitive.

## Incremental Development

- Make small, production-grade changes.
- Verify after changes.
- Prefer focused implementation over broad rewrites.
- Add only dependencies that solve real problems.
- Document technical debt instead of hiding it.

## Code Review Mindset

Before finishing, check:

- Does this duplicate an existing system?
- Does it follow the folder conventions?
- Does it match FishQuest design direction?
- Are docs updated?
- Are risks or blockers documented?
- Did verification run, or is the reason it could not run documented?

## Prohibited Behaviors

- Creating a second Supabase client.
- Creating multiple auth session sources of truth.
- Creating unrelated design token systems.
- Creating direct Mapbox or AI provider calls in screens instead of documented service wrappers.
- Using standalone/manual ngrok workflows. Expo-managed tunnel mode is allowed because FishQuest is tested with Expo Go on physical devices.
- Adding unapproved secrets.
- Scattering raw backend queries across screens.
- Building major features before foundation is stable.
- Pretending unimplemented features are complete.
