# FishQuest Changelog

## 2026-05-23

### Secure Fish Photo Upload Added

- Added `expo-image-manipulator` for client-side catch photo compression and thumbnail preparation.
- Added `supabase/migrations/202605230004_create_catch_media_storage.sql` for private `catch-originals` and `catch-thumbnails` buckets, Storage ownership policies, and expanded `catch_media` metadata columns.
- Added `services/catches/uploadCatchPhoto` to validate selected images, compress photos, upload private original/thumbnail objects, and insert `catch_media` metadata.
- Updated Log Catch submission to upload attached photos after creating the catch, show staged upload progress, handle errors, and allow retry.
- Kept failed uploads in the local pending media queue for future background retry support.
- Documented the temporary direct authenticated upload limitation until a backend/Edge Function can issue signed upload URLs.

### Catch Logging Flow Added

- Added `expo-image-picker` for local catch photo selection.
- Added Log Catch form with species selection, date/time, optional length/weight, notes, privacy, save draft, and submit actions.
- Added catch validation for required species/date, valid time, non-negative measurements, privacy, and note length.
- Added `services/catches/` for catch creation, local draft persistence, and local pending media queue.
- Catch submission now inserts into `catches` and creates/updates `user_fishdex_entries`.
- Photo selection now supports private Supabase Storage upload through the secure media flow.
- Moved Log Catch draft/submit actions and feedback near the top of the screen so submit is visible on mobile.

### FishDex Starter Catalog Added

- Added `supabase/migrations/202605230003_seed_starter_catalog.sql` with starter regions, species, and species-region mappings.
- Added read-only FishDex catalog service in `services/fishdex/`.
- Added FishDex feature components for catalog summary and species cards.
- Replaced the FishDex placeholder tab with a service-backed starter catalog view.
- Added loading, empty, error, and refresh states for the FishDex tab.

### FishDex Core Browsing Added

- Added region filter chips for the FishDex list.
- Added locked/undiscovered species presentation.
- Added hidden tab detail route at `/fishdex/[id]`.
- Added species detail UI with rarity, locked state, field notes, habitat, range, and discovery status.
- Extended FishDex service types with `FishdexRegion`, region IDs, and `getFishdexSpecies`.

### Core Database Schema Added

- Added `supabase/migrations/202605230002_create_core_schema.sql`.
- Added production-oriented tables for regions, species, species-region mappings, catches, catch media, user FishDex entries, signals, subscriptions, AI classifications, and audit logs.
- Extended `profiles` with `home_region_id` and `deleted_at`.
- Added foreign keys, check constraints, timestamp triggers, soft-delete columns, and common query indexes.
- Added RLS policies for catalog reads, user-owned journal/progress data, subscription reads, and AI classification reads.
- Kept subscription writes, AI classification writes, catalog writes, signal writes, and audit logs server-side/service-role only.
- Updated `types/database.ts` so the typed Supabase client knows the current schema shape.
- Rewrote `DATABASE_SCHEMA.md` as the source of truth for implemented tables and RLS strategy.

### Supabase Auth Foundation Added

- Added centralized `AuthProvider` and `useAuth` hook for the single auth session source of truth.
- Added secure native Supabase session storage with `expo-secure-store`; web falls back to AsyncStorage.
- Added email sign in and account creation behavior.
- Added native Apple Sign In client flow with nonce handling.
- Added Google OAuth client flow using Expo WebBrowser auth sessions.
- Added route protection for main tabs and redirect behavior for authenticated users in auth routes.
- Added logout behavior to the Profile tab.
- Added auth callback route.
- Added `AppTextInput` UI primitive for token-backed auth inputs.
- Added initial `profiles` table migration with owner-only RLS policies.
- Added best-effort profile creation after login/session restore.

### Auth Foundation Verified

- `npm run typecheck` passes.

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
