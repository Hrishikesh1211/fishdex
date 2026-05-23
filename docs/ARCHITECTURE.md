# FishQuest Architecture

Last audited: 2026-05-23

## Audit Status

The repository now contains an Expo SDK 54 React Native foundation, design-system layer, navigation shell, Supabase client setup, and centralized Supabase Auth foundation. Full product features are still pending.

## Intended Stack

- Expo React Native
- TypeScript
- Expo Router
- NativeWind
- Supabase
- Postgres
- RevenueCat
- PostHog
- Sentry
- Mapbox planned for future map/place memory
- AI fish identification planned as a future backend-assisted feature

## Target App Architecture

FishQuest should use a feature-oriented React Native architecture with shared platform services and UI primitives.

Current top-level structure:

```text
app/
  _layout.tsx
  +not-found.tsx
  index.tsx
  (auth)/
    _layout.tsx
    callback.tsx
    welcome.tsx
    sign-in.tsx
    create-account.tsx
  (onboarding)/
    _layout.tsx
    premium.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    map.tsx
    fishdex.tsx
    fishdex/
      [id].tsx
    log-catch.tsx
    signals.tsx
    profile.tsx
components/
  fishdex/
  shell/
  ui/
constants/
  design-tokens.json
  routes.ts
  tokens.ts
hooks/
  useReducedMotion.ts
lib/
  env/
    publicEnv.ts
  supabase/
    client.ts
    sessionStorage.ts
    index.ts
services/
  auth/
    oauth.ts
  fishdex/
    fishdexService.ts
  profiles/
    profileService.ts
state/
  auth/
    AuthProvider.tsx
    index.ts
supabase/
  migrations/
types/
  database.ts
docs/
.env.example
app.json
babel.config.js
global.css
metro.config.js
nativewind-env.d.ts
package.json
tailwind.config.js
tsconfig.json
```

Planned feature/service folders from the original architecture remain valid but should be added only when needed.

## Module Boundaries

- `app/`: route entry points only. Keep screens thin and compose feature components.
- `components/ui/`: generic reusable UI primitives with no domain-specific data fetching.
- `components/<feature>/`: feature-specific presentation components.
- `services/`: async domain operations and backend access.
- `lib/`: client setup and infrastructure wrappers.
- `hooks/`: reusable React hooks. Hooks may compose services but should not hide unrelated behavior.
- `state/`: app-level client state, auth provider, draft state, and session-adjacent state.
- `types/`: shared TypeScript contracts and generated database types.
- `constants/`: design tokens and stable app constants.
- `supabase/`: migrations, SQL functions, seed data, and local Supabase metadata.

Do not duplicate service clients across features. Create one Supabase client wrapper, one RevenueCat wrapper, one PostHog wrapper, one Sentry setup, and one Mapbox integration wrapper if maps are added.

## Navigation Architecture

Use Expo Router.

Implemented route groups:

- `(tabs)`: main app shell with `map`, `fishdex`, `log-catch`, `signals`, and `profile`.
- `(tabs)/fishdex/[id]`: hidden tab route for species detail records.
- `(auth)`: `welcome`, `sign-in`, `create-account`, and OAuth `callback` routes.
- `(onboarding)`: placeholder `premium` onboarding route.
- `+not-found`: tokenized fallback route.
- `index.tsx`: redirects to `/map`.

Implemented protected route logic:

- `(tabs)/_layout.tsx` blocks unauthenticated users.
- `(auth)/_layout.tsx` redirects authenticated users to the Map tab.
- `index.tsx` redirects based on restored auth state.

Public path constants live in `constants/routes.ts`. Expo route groups are intentionally hidden from public paths, so constants use `/map`, `/welcome`, `/premium`, and similar route values.

## State Management

Implemented state:

- Supabase auth session: central `AuthProvider` and `useAuth` hook in `state/auth`.

Recommended approach for future state:

- Server/cache state: use a query library only if the app complexity justifies it. If introduced, document it here.
- Local UI state: React state.
- Offline catch drafts: local persisted state using a documented storage adapter.
- Global app settings: small typed store if needed.

Avoid creating multiple unrelated stores for the same domain.

## API Architecture

Primary API is expected to be Supabase:

- Supabase Auth for sessions.
- Postgres tables with RLS for app data.
- Supabase Storage for catch photos and media.
- Edge Functions only when client-side access is inappropriate.

Application services should expose typed functions such as `createCatch`, `listUserCatches`, `getSpecies`, and `updateProfile`, rather than scattering raw Supabase calls through screens.

Implemented foundation:

- `lib/env/publicEnv.ts`: validates public Expo runtime config.
- `lib/supabase/client.ts`: lazy singleton Supabase client.
- `lib/supabase/sessionStorage.ts`: SecureStore-backed native auth session storage.
- `state/auth/AuthProvider.tsx`: session restore, auth actions, and route guard state.
- `services/auth/oauth.ts`: Apple and Google provider flows.
- `services/fishdex/fishdexService.ts`: read-only FishDex catalog/detail service.
- `services/profiles/profileService.ts`: profile upsert after auth.
- `.env.example`: documents `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_APP_ENV`, and the backend-only `SUPABASE_SERVICE_ROLE_KEY`.

Only the public anon key may be used in Expo mobile runtime. Service-role keys are backend/server only.

Mapbox should be introduced only when map/place memory is ready. Map code should live behind a `lib/mapbox` adapter and `services/maps` domain layer so map rendering, geocoding, and future location queries do not leak through unrelated screens.

AI fish identification should be introduced behind `services/identification` and, if privileged provider credentials are required, a Supabase Edge Function or trusted backend service. Mobile clients must not hold private AI provider keys.

## Storage Architecture

Expected storage:

- Postgres: profiles, regions, species, species-region mappings, catches, catch media metadata, FishDex progress, signals, subscriptions, AI classification records, and audit logs.
- Supabase Storage: user-uploaded catch photos.
- Device storage: auth session persistence, offline catch drafts, maybe cached read-only species metadata.

Photo storage must be private by default unless explicit sharing is implemented.

## Realtime Architecture

Realtime is not required for MVP unless collaborative or multi-device updates need it. If used, scope subscriptions narrowly and clean them up on screen unmount.

Possible future realtime uses:

- Cross-device catch sync.
- Subscription or entitlement changes.
- Social or shared quest updates.

## Offline Strategy

MVP should support at least safe draft capture:

- User can create a catch draft without immediate upload.
- Photos and metadata are queued locally.
- Upload state is explicit.
- Conflicts are resolved conservatively.
- Failed uploads are retryable.

Do not promise complete offline sync until a queue, conflict model, and persistence strategy are implemented.

## Future Backend Architecture

Use Supabase first. Add custom backend services only when Supabase primitives are insufficient.

Potential future backend needs:

- Species enrichment or classification pipelines.
- AI fish identification for catch photos.
- Mapbox-backed geocoding or place enrichment if needed.
- Moderation and abuse handling.
- Admin dashboards.
- Premium analytics jobs.
- Public sharing pages.

## Scaling Strategy

- Keep database migrations linear and reviewed.
- Generate and commit Supabase TypeScript types.
- Centralize service clients.
- Use RLS for every user-owned table.
- Add observability before production release.
- Keep expensive media processing out of client screens.

## Architecture Diagram

```text
Expo React Native App
  |
  |-- Expo Router
  |     |-- Auth routes
  |     |-- Main tabs
  |     |-- Feature details
  |
  |-- UI Components + Feature Components
  |
  |-- Hooks / State
  |
  |-- Services
        |-- Supabase Auth
        |-- Supabase Postgres
        |-- Supabase Storage
        |-- RevenueCat
        |-- PostHog
        |-- Sentry
        |-- Mapbox (future)
        |-- AI Identification Backend (future)
```

## Current Implementation Findings

- Expo app foundation exists.
- `package.json` exists with Expo, Expo Router, NativeWind, React, and React Native dependencies.
- TypeScript configuration exists and typecheck passes.
- Root Expo Router layout exists with a short app loading state and route groups.
- Main tabs exist: Map, FishDex, Log Catch, Signals, Profile.
- Auth placeholder routes exist: Welcome, Sign In, Create Account.
- Premium onboarding placeholder route exists.
- UI primitives and token system exist.
- Supabase client foundation and public env validation exist.
- Real Supabase Auth behavior exists for email, Apple, and Google client flows.
- Initial profile migration and RLS policies exist.
- Read-only FishDex browsing exists with list, region filter, rarity display, locked states, and species detail route.
- No catch journal, storage buckets, RevenueCat, PostHog, Sentry, Mapbox, or AI identification features exist yet.
