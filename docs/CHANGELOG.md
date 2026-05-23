# FishQuest Changelog

## 2026-05-22

### Design System Foundation Added

- Added minimal Expo React Native foundation with Expo Router.
- Added TypeScript configuration and baseline `npm run typecheck` script.
- Added NativeWind configuration backed by shared design tokens.
- Added local `@expo/ngrok` dev dependency so Expo-managed tunnel mode works for Expo Go testing.
- Added dev-only `qrcode` helper for generating a local Expo Go QR page.
- Added design token source in `constants/design-tokens.json` and typed exports in `constants/tokens.ts`.
- Added reusable UI primitives: `AppScreen`, `AppText`, `AppButton`, `Card`, `RarityBadge`, `ProgressPill`, `EmptyState`, and `LoadingState`.
- Added reduced-motion accessibility hook.
- Added design-system preview route at `app/index.tsx`.

### Navigation Shell Added

- Added Expo Router main tab shell with Map, FishDex, Log Catch, Signals, and Profile tabs.
- Added auth placeholder route group with Welcome, Sign In, and Create Account.
- Added premium onboarding placeholder route.
- Added app loading state and not-found route.
- Added route constants in `constants/routes.ts`.
- Added shell components for shared screen layout and tab glyphs.

### Supabase Preparation Added

- Added `@supabase/supabase-js`, `@react-native-async-storage/async-storage`, and `react-native-url-polyfill`.
- Added `.env.example` with public Supabase env vars and backend-only service-role key warnings.
- Added public runtime config validation in `lib/env/publicEnv.ts`.
- Added lazy Supabase client singleton in `lib/supabase/client.ts`.
- Documented Supabase local/staging/production setup and dashboard steps.

### Design System Foundation Verified

- `npm run typecheck` passes.
- `npx expo-doctor` passes all checks.
- `npx expo export --platform web --output-dir C:\tmp\fishquest-export-test` bundles successfully.
- `npx expo export --platform web --clear --output-dir C:\tmp\fishquest-sdk54-export-test` bundles successfully on SDK 54.
- `npx expo export --platform web --clear --output-dir C:\tmp\fishquest-shell-export-test` bundles successfully with the navigation shell.

### Documentation Memory Updated

- Expanded the documentation memory system with future Mapbox map/place memory planning.
- Added future AI fish identification planning and backend-boundary rules.
- Made Codex documentation-first and documentation-update rules more explicit.
- Clarified that standalone/manual ngrok workflows are prohibited, while Expo-managed tunnel mode is allowed for Expo Go testing.

### Changed

- Updated Expo start scripts to use tunnel mode by default for Expo Go, with explicit localhost and LAN alternatives.
- Downgraded the Expo foundation from SDK 56 to SDK 54 for compatibility with the current iPhone Expo Go app.
- Aligned React, React Native, Expo Router, Expo modules, TypeScript, and React types to the SDK 54 package matrix.
- Added an explicit Expo Router Babel transform in `babel.config.js` so SDK 54 bundling receives a literal route root.

### Initial Documentation Added

- Created long-term documentation memory system under `docs/`.
- Recorded complete repository audit findings.
- Documented intended product vision, architecture, UI system, API contracts, database plan, auth flow, deployment strategy, roadmap, feature status, coding standards, AI rules, testing guide, and security rules.

### Initial Audit Findings

- `C:\Users\rhris\FishDex_test` is not a Git repository at audit time.
- At the initial audit, no application source files existed.
- At the initial audit, no package manifest existed.
- At the initial audit, no Expo, TypeScript, Supabase, NativeWind, RevenueCat, PostHog, or Sentry configuration existed.
- At the initial audit, no implemented routing, screens, components, hooks, services, state, or tests existed.

### Notes

- No business feature implementation was added.
- No refactors were performed.
- Documentation intentionally separates planned architecture from current repository reality.
