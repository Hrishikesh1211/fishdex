# FishQuest Auth Flow

Last audited: 2026-05-22

## Audit Status

Supabase client setup now exists, but real auth behavior is not implemented. The auth screens remain placeholders, and no login, signup, token exchange, protected route, or backend data access is wired yet.

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

Email auth may be added later if it fits product strategy, but it is not a default requirement.

## Session Flow

Planned flow once auth is implemented:

1. App boots and initializes Supabase client.
2. Auth provider loads any persisted session.
3. Root route decides between authenticated app and auth/onboarding routes.
4. Auth state changes update app state and analytics identity.
5. Protected services require an active user session.
6. Sign out clears auth session, local user state, analytics identity, and sensitive drafts when appropriate.

## Protected Routes

Use Expo Router route groups:

- Public: onboarding, sign in, legal links if needed.
- Protected: FishDex, catch journal, profile, settings, premium surfaces.

Route protection should be centralized in a layout or auth guard hook. Avoid repeating redirect logic inside every screen.

## Token Handling

- The mobile app may use only `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- `SUPABASE_SERVICE_ROLE_KEY` is backend/server only and must never be exposed through Expo public env vars or imported into mobile code.
- Let Supabase client manage session persistence.
- Do not manually store provider tokens in arbitrary storage.
- Never log tokens.
- Avoid passing tokens through screen params.
- Clear session state on sign out.

## Apple Sign In

Planned considerations:

- Configure Apple capability for iOS builds.
- Handle first-sign-in name availability correctly.
- Store display name only if provided and user consents where relevant.
- Support account deletion requirements for App Store compliance.

## Google Sign In

Planned considerations:

- Configure OAuth client IDs for development, staging, and production.
- Keep redirect URLs aligned with Supabase settings.
- Do not hardcode secrets in the app.

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
- Supabase auth persistence is configured with AsyncStorage for future auth work.
- Missing or malformed public env vars throw `PublicEnvError` with actionable messages when the client is requested.

Current Supabase project URL:

```text
https://sbbotzergiwoxutzbnub.supabase.co
```

## Current Gaps

- No auth provider.
- No protected routes.
- No Apple or Google Sign In configuration.
- No RLS policies.
- No account deletion flow.
- No login/signup behavior is wired to the placeholder auth screens.
