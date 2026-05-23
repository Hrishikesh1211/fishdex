# FishQuest Auth Flow

Last audited: 2026-05-23

## Audit Status

Supabase Auth is now wired through a centralized auth provider. Email sign in/sign up, Apple Sign In, Google OAuth, session restore, logout, protected tab routes, and best-effort profile creation are implemented in the Expo app.

## Auth Goals

- Support premium iOS-first authentication.
- Prefer Apple Sign In for iOS.
- Support Google Sign In as a secondary option if product strategy requires it.
- Keep session handling centralized and secure.
- Protect user-owned catch, profile, and media data with Supabase RLS.

## Planned Providers

- Supabase Auth
- Apple Sign In
- Google Sign In

- Email/password auth

## Session Flow

1. App boots and initializes Supabase client.
2. `AuthProvider` loads any persisted session with `supabase.auth.getSession()`.
3. Supabase auth state changes update the single in-memory session source of truth.
4. Root/index routing sends authenticated users to `/map` and unauthenticated users to `/welcome`.
5. `(tabs)` is protected at the route-group layout level.
6. `(auth)` redirects authenticated users back to `/map`.
7. Sign out calls `supabase.auth.signOut()` and clears local auth/profile state.

## Protected Routes

Use Expo Router route groups:

- Public: onboarding, sign in, legal links if needed.
- Protected: FishDex, catch journal, profile, settings, premium surfaces.

Implemented route protection is centralized in route-group layouts. Avoid adding duplicate redirect logic inside individual screens.

## Token Handling

- The mobile app may use only `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- `SUPABASE_SERVICE_ROLE_KEY` is backend/server only and must never be exposed through Expo public env vars or imported into mobile code.
- Let Supabase client manage session persistence.
- Native session persistence uses `expo-secure-store` through `lib/supabase/sessionStorage.ts`.
- Web falls back to AsyncStorage because SecureStore is native-only.
- Do not manually store provider tokens in arbitrary storage.
- Never log tokens.
- Avoid passing tokens through screen params.
- Clear session state on sign out.

## Apple Sign In

Implemented client behavior:

- Uses `expo-apple-authentication`.
- Uses `expo-crypto` to generate a raw nonce and send the hashed nonce to Apple.
- Uses Supabase `signInWithIdToken` with the raw nonce.

Remaining setup:

- Configure Apple capability for iOS builds.
- Handle first-sign-in name availability correctly.
- Store display name only if provided and user consents where relevant.
- Support account deletion requirements for App Store compliance.

## Google Sign In

Implemented client behavior:

- Uses Supabase `signInWithOAuth({ provider: "google" })`.
- Uses `expo-web-browser` auth sessions.
- Redirect URI is generated with `Linking.createURL("callback")`.
- OAuth callback route exists at `/callback`.

Remaining setup:

- Configure OAuth client IDs for development, staging, and production.
- Keep redirect URLs aligned with Supabase settings.
- Do not hardcode secrets in the app.

## Email Auth

- Sign in uses `supabase.auth.signInWithPassword`.
- Account creation uses `supabase.auth.signUp` with optional `display_name` metadata.
- If Supabase email confirmation is enabled, the create-account screen shows a confirmation message instead of assuming an active session.

## Profile Creation

- `services/profiles/profileService.ts` upserts `public.profiles` after session restore and first login.
- The initial migration is `supabase/migrations/202605230001_create_profiles.sql`.
- The core schema migration is `supabase/migrations/202605230002_create_core_schema.sql`.
- Missing profile schema is surfaced as a non-blocking profile sync warning so auth can still be tested while migrations are being applied.

## Auth and Analytics

- Identify users in PostHog only after a valid session exists.
- Reset analytics identity on sign out.
- Avoid sending sensitive catch notes or precise private coordinates as analytics properties.
- Sentry user context should be minimal and cleared on sign out.

## Security Rules

- RLS is mandatory for user-owned data.
- Client route guards are UX only.
- The database must enforce ownership.
- Storage buckets for catch photos should be private by default.
- Admin or service-role operations must never be exposed to mobile clients.

## Implemented Auth Preparation

- `lib/env/publicEnv.ts` validates public runtime config.
- `lib/supabase/client.ts` creates a lazy singleton Supabase client.
- `react-native-url-polyfill/auto` is loaded before creating the Supabase client.
- Supabase auth persistence is configured with SecureStore on native devices and AsyncStorage on web.
- Missing or malformed public env vars throw `PublicEnvError` with actionable messages when the client is requested.

Current Supabase project URL:

```text
https://sbbotzergiwoxutzbnub.supabase.co
```

## Current Gaps

- Supabase dashboard provider configuration must be completed for Apple and Google.
- The core schema migration is applied in the current Supabase project, per user confirmation. Apply it to any future staging/production projects before data features depend on those tables.
- Storage bucket policies are not implemented yet.
- No account deletion flow.
- No password reset flow.
- No analytics or Sentry user context binding yet.
