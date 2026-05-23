# FishQuest Current Progress

Last audited: 2026-05-22

## Summary

The workspace now contains the documentation memory system, Expo SDK 54 app foundation, design-system foundation, and navigation shell. No business features are implemented yet.

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
- Public environment validation in `lib/env/publicEnv.ts`.
- Lazy Supabase client singleton in `lib/supabase/client.ts`.
- `.env.example` documenting public Supabase env vars and service-role key restrictions.
- NativeWind configuration wired to shared design tokens.
- Shared design token source in `constants/design-tokens.json`.
- Typed token exports in `constants/tokens.ts`.
- UI primitives under `components/ui/`: `AppScreen`, `AppText`, `AppButton`, `Card`, `RarityBadge`, `ProgressPill`, `EmptyState`, and `LoadingState`.
- Reduced-motion hook for accessibility-aware UI states.
- Baseline verification scripts in `package.json`.
- Web export smoke test passes through Expo.
- Expo Go tunnel testing is supported with local dev dependency `@expo/ngrok`.
- Local Expo Go QR page generation is supported with dev dependency `qrcode`.

## Partially Exists

None found.

## Incomplete

Everything below is not yet implemented in this workspace:

- Supabase schema, migrations, RLS policies, and storage buckets.
- Supabase auth provider and session state.
- Auth flow.
- Catch journal.
- FishDex.
- Media upload.
- Local offline drafts.
- RevenueCat integration.
- PostHog integration.
- Sentry integration.
- Mapbox map/place memory.
- AI-assisted fish identification.
- Test framework.
- EAS build configuration.

## Technical Debt

Current technical debt is foundational absence rather than bad implementation:

- No Git repository metadata.
- No lint/format tooling yet.
- No CI pipeline.
- No database migration history.
- `npm install` reports 15 moderate transitive vulnerabilities after aligning to Expo SDK 54 and adding the local Expo tunnel helper. These were not force-fixed because forced audit fixes may break Expo compatibility.
- Temporary web export verification output was written to `C:\tmp\fishquest-export-test`.
- SDK 54 web export verification output was written to `C:\tmp\fishquest-sdk54-export-test`.

## Blockers

- Supabase project details are needed before backend implementation.
- RevenueCat, PostHog, and Sentry keys are needed before final integration.
- Mapbox token and map product scope are needed before map implementation.
- AI identification provider, consent model, and backend boundary are needed before AI implementation.
- Real auth cannot be protected until Supabase auth and a session provider exist.

## Current Priorities

1. Add linting and formatting tooling.
2. Add initial smoke tests or verification checklist.
3. Add Supabase auth session provider and route guard placeholders.
4. Add initial Supabase migrations for `profiles`, `species`, and catch journal tables.
5. Configure Apple/Google providers after auth provider architecture lands.

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
