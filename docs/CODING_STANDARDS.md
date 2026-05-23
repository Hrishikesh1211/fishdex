# FishQuest Coding Standards

Last audited: 2026-05-22

## Audit Status

No source code exists yet. These standards define how future code should be written.

## TypeScript Rules

- Use TypeScript for all app source.
- Prefer explicit domain types at service boundaries.
- Avoid `any` unless the reason is documented.
- Keep generated Supabase types separate from hand-written domain types.
- Use discriminated unions for state machines and async result states.
- Keep nullability intentional.

## Naming Conventions

- Components: `PascalCase`.
- Hooks: `useCamelCase`.
- Service functions: `camelCase` verbs, such as `createCatch`.
- Types: `PascalCase`.
- Constants: `SCREAMING_SNAKE_CASE` for true constants, `camelCase` for token objects.
- Route files: follow Expo Router conventions.
- Database tables: `snake_case`.
- Database columns: `snake_case`.

## Folder Conventions

- Route files belong in `app/`.
- Shared UI primitives belong in `components/ui/`.
- Feature components belong in `components/<feature>/`.
- Backend clients and SDK setup belong in `lib/`.
- Domain operations belong in `services/<domain>/`.
- Reusable hooks belong in `hooks/`.
- Shared types belong in `types/`.
- Local state stores belong in `state/`.
- Database migrations belong in `supabase/migrations/`.

## Component Rules

- Keep screens thin.
- Extract repeated UI into components.
- Extract repeated business logic into services or hooks.
- Components should receive typed props.
- UI primitives should not import feature services.
- Feature components may import domain types and feature services when appropriate.
- Avoid large inline style objects once tokens exist.

## Hook Rules

- Hooks must start with `use`.
- Hooks should do one coherent job.
- Do not hide unrelated side effects inside generic hooks.
- Data-fetching hooks should document cache and refresh behavior.
- Auth hooks must not duplicate session state across multiple stores.

## API Rules

- Screens should call service functions or hooks, not raw Supabase queries.
- Service functions must normalize errors.
- Do not expose service-role secrets to the client.
- Do not expose AI provider secrets to the client.
- Mapbox and AI identification must use documented service wrappers before screen integration.
- Every new API contract must update `docs/API_CONTRACTS.md`.

## Styling Rules

- Use the documented design token system once implemented.
- Keep FishQuest premium, calm, mysterious, collectible, immersive, modern, minimal, and outdoor-oriented.
- Do not use generic AI-product UI patterns for AI fish identification.
- Avoid one-off palettes.
- Avoid nested cards.
- Avoid visible instructional UI copy that explains obvious interactions.
- Ensure text fits on mobile.
- Use icon buttons for familiar commands where appropriate.

## Testing Rules

- Add tests for domain logic and service mapping.
- Add smoke tests or QA checklist updates for critical mobile flows.
- Test auth state transitions.
- Test catch creation and upload failures.
- Test offline draft recovery once implemented.

## Documentation Rules

- Update relevant docs after any meaningful architecture, schema, API, auth, deployment, or UI-system change.
- Update docs after every feature or service integration, including partial work.
- Keep `CURRENT_PROGRESS.md` and `FEATURE_STATUS.md` accurate.
- Add changelog entries for notable changes.
