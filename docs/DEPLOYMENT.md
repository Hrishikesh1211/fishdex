# FishQuest Deployment

Last audited: 2026-05-22

## Audit Status

The workspace now has a minimal Expo SDK 54 project, `package.json`, NativeWind configuration, and baseline scripts. EAS configuration, environment files, and deployment pipelines are still pending.

## Local Setup

Current local setup:

```text
C:\Users\rhris\FishDex_test
```

The folder currently contains documentation plus a minimal Expo/Router/NativeWind design-system foundation.

Current Expo SDK target: SDK 54, because the current iPhone Expo Go app being used for testing supports SDK 54.

Current setup:

```bash
npm install
npm run start
```

Current package manager: npm.

Local development targets Expo Go on physical devices. Use Expo-managed tunnel mode by default. Do not use standalone/manual ngrok workflows unless the user explicitly requests them.

Expo tunnel support is project-scoped through the local dev dependency `@expo/ngrok`. Do not rely on an undocumented global install.

QR generation for local Expo Go testing uses the dev-only `qrcode` package and writes ignored files under `.expo-logs/`.

If Expo Go updates its supported SDK, upgrade intentionally with the official Expo upgrade path and update this document.

## Expo Setup

Planned Expo files:

- `app.json` or `app.config.ts`
- `eas.json`
- `babel.config.js`
- `metro.config.js` if needed
- `nativewind-env.d.ts`
- `global.css` or NativeWind entry stylesheet if required
- `app/` route directory

Implemented Expo files:

- `app.json`
- `app/_layout.tsx`
- `app/index.tsx`
- `babel.config.js`
- `metro.config.js`
- `tailwind.config.js`
- `global.css`
- `nativewind-env.d.ts`
- `package.json`
- `tsconfig.json`

## EAS Setup

Planned build profiles:

- `development`: dev client or local testing.
- `preview`: internal testers and staging backend.
- `production`: App Store builds.

Each profile must document its environment variables and backend target.

## Environment Strategy

Use separate environments:

- local
- staging
- production

Expected variables:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_APP_ENV`
- `EXPO_PUBLIC_POSTHOG_KEY`
- `EXPO_PUBLIC_POSTHOG_HOST`
- `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`
- `EXPO_PUBLIC_MAPBOX_TOKEN` when Mapbox is implemented
- `SENTRY_AUTH_TOKEN` for build/upload workflows only, not public app runtime
- AI provider keys must not be public Expo variables. Use Supabase Edge Functions or trusted backend secrets for AI identification.

Never commit secrets. Public mobile keys must still be scoped by backend rules.

Implemented environment files:

- `.env.example`: documents public Expo env vars and the backend-only service-role key warning.
- `.env*`: ignored by Git.

Current public Supabase URL:

```text
https://sbbotzergiwoxutzbnub.supabase.co
```

Use `EXPO_PUBLIC_APP_ENV=local`, `staging`, or `production`. Production Supabase URLs must use `https://`.

`SUPABASE_SERVICE_ROLE_KEY` is for future trusted backend/server contexts only. It must never be prefixed with `EXPO_PUBLIC_`, committed, logged, or imported by mobile app code.

## Supabase Dashboard Setup

For each environment, create or select a Supabase project:

- Local: use the current Supabase project or a local Supabase instance for development.
- Staging: use a separate Supabase project from production.
- Production: use a locked-down production project with backups, RLS, private storage, and monitoring.

Dashboard steps:

1. Open the Supabase Dashboard and select the target project.
2. Go to Project Settings > API.
3. Copy the Project URL into `EXPO_PUBLIC_SUPABASE_URL`.
4. Copy the public anon key into `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
5. Do not copy the service-role key into Expo env files.
6. Go to Authentication > Providers and configure Apple/Google later when auth is implemented.
7. Go to Authentication > URL Configuration later and add the Expo/native redirect URLs required by the implemented auth flow.
8. Create private Storage buckets only when upload flows are implemented.
9. Enable and verify RLS policies before any user-owned tables are used by the app.

## Staging and Production Strategy

- Staging should use a separate Supabase project or schema.
- Production should have stricter RLS, backups, and monitoring.
- RevenueCat products and entitlements must be clearly separated between sandbox/testing and production.
- PostHog and Sentry environments must identify release channel and app version.
- Mapbox tokens should be scoped by environment and restricted where possible.
- AI identification providers must be configured through trusted server-side environments, not mobile runtime config.

## Build Commands

Current commands:

```bash
npm run start
npm run start:localhost
npm run start:lan
npm run typecheck
npm run ios
npm run android
npm run web
```

Verified command:

```bash
npx expo export --platform web --clear --output-dir C:\tmp\fishquest-sdk54-export-test
```

Expected future commands:

```bash
npm run lint
npm run test
npx eas build --profile preview --platform ios
npx eas build --profile production --platform ios
```

Lint, tests, EAS profiles, and environment validation are still pending.

Use `npm run start` for Expo Go tunnel testing. Use `npm run start:localhost` only for local browser/simulator work. Avoid direct standalone ngrok commands and custom ngrok tunnels.

## Deployment Flow

Planned flow:

1. Update code and docs.
2. Run lint, typecheck, and tests.
3. Run local smoke test.
4. Build preview with EAS.
5. QA on real iOS device.
6. Promote backend migrations after review.
7. Build production.
8. Submit to App Store Connect.
9. Monitor Sentry, PostHog, and Supabase logs.

## Onboarding Future Developers

1. Read `docs/PROJECT_CONTEXT.md`.
2. Read `docs/AI_RULES.md`.
3. Read `docs/ARCHITECTURE.md`.
4. Inspect existing source before changing anything.
5. Confirm environment variables and local setup.
6. Run the documented verification commands.
7. Update docs after meaningful changes.

## Current Gaps

- No EAS configuration.
- No environment files or examples.
- No deployment pipeline.
- No lint or test scripts yet.
