# FishQuest Current Progress

Last audited: 2026-05-25

## Summary

The workspace now contains the documentation memory system, Expo SDK 54 app foundation, refined minimal design system, navigation shell, Supabase client setup, centralized Supabase Auth foundation, the first production-oriented database schema migration, starter catalog seed data, the core read-only FishDex browsing experience, the first catch logging flow, private Supabase Storage photo upload for catches, and partial offline catch draft sync.

## Already Built

- Documentation system under `docs/`.
- Minimal Expo React Native app scaffold.
- Expo SDK 54 dependency baseline for current Expo Go iPhone compatibility.
- TypeScript configuration with strict checking.
- Expo Router root layout with app loading state.
- Main tab shell: Map, FishDex, Log Catch, Signals, Profile.
- Auth placeholder shell: Welcome, Sign In, Create Account.
- Premium onboarding placeholder shell.
- Not-found route.
- Route constants in `constants/routes.ts`.
- Supabase dependency foundation: `@supabase/supabase-js`, AsyncStorage, and URL polyfill.
- Auth dependencies: `expo-secure-store`, `expo-apple-authentication`, and `expo-crypto`.
- Public environment validation in `lib/env/publicEnv.ts`.
- Lazy Supabase client singleton in `lib/supabase/client.ts`.
- Secure native Supabase session storage adapter in `lib/supabase/sessionStorage.ts`.
- Auth session provider and `useAuth` hook in `state/auth/`.
- Email sign in and email account creation behavior.
- Apple Sign In client flow using native Apple auth and Supabase ID token exchange.
- Google Sign In client flow using Supabase OAuth and Expo WebBrowser auth sessions.
- Protected tab routes and authenticated-user redirect out of auth routes.
- Logout from the Profile tab.
- Initial `profiles` migration with RLS policies.
- Core schema migration for regions, species, species-region mappings, catches, catch media, FishDex entries, signals, subscriptions, AI classifications, and audit logs.
- Starter catalog seed migration for initial regions, species, and species-region mappings.
- Local typed database contract covering the implemented tables in `types/database.ts`.
- Read-only FishDex catalog/detail service in `services/fishdex/`.
- Feature FishDex components in `components/fishdex/`.
- FishDex tab loads species, regions, species-region links, and the signed-in user's discovery entries.
- FishDex list has regional filtering.
- FishDex species cards show rarity and locked/undiscovered states.
- FishDex species detail route exists at `/fishdex/[id]`.
- FishDex visual refinement now uses larger collectible specimen cards, simpler labels, whole-card species taps, and a calmer specimen-focused detail layout.
- Log Catch screen with species selection, photo picker, date/time fields, optional size/weight, notes, privacy, local draft save, submit, upload progress, and offline sync status.
- Catch creation service in `services/catches/`.
- Local catch draft persistence through AsyncStorage.
- Local pending media queue for failed uploads and future background retry.
- AsyncStorage-backed catch sync queue for submitted drafts.
- Conflict-safe queued catch IDs so retrying a submitted local draft does not create duplicate catch rows.
- NetInfo-based retry when connection returns while Log Catch is mounted.
- Log Catch UI indicators for saved locally, pending sync, synced, and failed sync states.
- Catch submission writes `catches` and updates `user_fishdex_entries`.
- Private Storage bucket migration for `catch-originals` and `catch-thumbnails`.
- Catch photo compression with `expo-image-manipulator`.
- Catch photo upload service that stores private original images, generated thumbnails, and `catch_media` metadata.
- Upload progress, upload error handling, and same-session retry on the Log Catch screen.
- Best-effort profile upsert after login/session restore.
- `.env.example` documenting public Supabase env vars and service-role key restrictions.
- NativeWind configuration wired to shared design tokens.
- Shared design token source in `constants/design-tokens.json`.
- Premium minimal UI pass: softer off-black/deep navy palette, quieter cards, reduced shadows, native-feeling tab labels, simpler copy, and lower visual density.
- Liftoff-inspired foundation pass: glassier dark surfaces, soft lavender primary accent, pill controls, subtle accent glow for key actions/progress, and floating rounded tab bar.
- Typed token exports in `constants/tokens.ts`.
- UI primitives under `components/ui/`: `AppScreen`, `AppText`, `AppButton`, `Card`, `RarityBadge`, `ProgressPill`, `EmptyState`, and `LoadingState`.
- Reduced-motion hook for accessibility-aware UI states.
- Baseline verification scripts in `package.json`.
- Web export smoke test passes through Expo.
- Expo Go tunnel testing is supported with local dev dependency `@expo/ngrok`.
- Local Expo Go QR page generation is supported with dev dependency `qrcode`.

## Partially Exists

- Auth routes and behavior are implemented, but password reset and account deletion are pending.
- Profile creation exists as an auth-time upsert, but profile viewing/editing is not built.
- Database migrations cover the first production schema and starter catalog, but generated Supabase types are still pending.
- FishDex browsing exists, but search, catch-driven discovery updates, and real media-backed species art are pending.
- Catch logging exists, but catch list/detail/edit are pending.
- Cloud media upload exists through direct authenticated Supabase Storage upload. Signed upload URLs are pending until a backend/Edge Function exists.

## Incomplete

Everything below is not yet implemented in this workspace:

- Signed upload URL backend/Edge Function.
- Supabase dashboard OAuth provider configuration.
- Password reset, account deletion, and complete profile management.
- Catch journal list/detail/edit.
- FishDex catch-driven discovery/progress updates.
- Multi-photo media upload and background retry worker.
- Full offline database, offline FishDex catalog cache, and cross-device conflict resolution.
- RevenueCat integration.
- PostHog integration.
- Sentry integration.
- Mapbox map/place memory.
- AI-assisted fish identification.
- Test framework.
- EAS build configuration.

## Technical Debt

Current technical debt is mostly foundational absence rather than bad implementation:

- No lint/format tooling yet.
- No CI pipeline.
- Generated Supabase TypeScript types are pending; `types/database.ts` is currently hand-written.
- Offline sync is intentionally partial and screen-scoped. It retries when Log Catch is mounted and network returns, but does not run as a true background task.
- `npm install` reports 15 moderate transitive vulnerabilities after aligning to Expo SDK 54 and adding the local Expo tunnel helper. These were not force-fixed because forced audit fixes may break Expo compatibility.
- Temporary web export verification output was written to `C:\tmp\fishquest-export-test`.
- SDK 54 web export verification output was written to `C:\tmp\fishquest-sdk54-export-test`.

## Blockers

- Starter catalog seed migration has been applied in the current Supabase project, per user confirmation.
- Supabase Auth provider settings must be configured for Apple and Google.
- RevenueCat, PostHog, and Sentry keys are needed before final integration.
- Mapbox token and map product scope are needed before map implementation.
- AI identification provider, consent model, and backend boundary are needed before AI implementation.
- Apply `supabase/migrations/202605230004_create_catch_media_storage.sql` in each Supabase environment before testing photo upload there.
- Signed upload URL support needs a trusted backend/Edge Function.

## Current Priorities

1. Add linting and formatting tooling.
2. Add initial smoke tests or verification checklist.
3. Add FishDex search/sort polish if needed.
4. Configure Apple and Google auth providers in Supabase and Apple/Google dashboards.
5. Add catch list/detail/edit or harden offline sync with a background worker and generated Supabase types.

## Pending Future Platforms and Services

- RevenueCat: planned for premium entitlements after core value exists.
- PostHog: planned for privacy-safe product analytics.
- Sentry: planned for crash/error monitoring before production testing.
- Mapbox: planned for future atmospheric map/place memory and exploration.
- AI fish identification: planned as a future assistive feature after media upload, consent, and secure backend routing exist.

## Recommended Next Implementation Phase

Foundation phase continuation:

- Preserve the existing token and UI primitive system.
- Preserve the implemented route shell and keep new screens thin.
- Add feature routes only after confirming they reuse `components/ui/` and `components/shell/`.
- Do not build full features until architecture, tokens, and service boundaries exist.
