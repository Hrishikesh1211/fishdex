# FishQuest Feature Status

Last audited: 2026-05-25

## Status Legend

- Not started: no implementation exists.
- Planned: documented but not implemented.
- In progress: partial source exists.
- Complete: implemented and verified.

| Feature | Status | Completion | Dependencies | Blockers | Notes |
| --- | --- | ---: | --- | --- | --- |
| Documentation memory system | Complete | 100% | None | None | Initial docs created in `docs/`. |
| Expo app scaffold | Complete | 100% | Package manager, Expo SDK 54 | None | Minimal Expo SDK 54 app exists with `app.json`, `package.json`, and Expo Router entry for current Expo Go compatibility. |
| TypeScript setup | Complete | 100% | App scaffold | None | Strict `tsconfig.json`; `npm run typecheck` passes. |
| Expo Router navigation | In progress | 85% | App scaffold, auth provider | Feature details | Root layout, main tabs, auth routes, premium onboarding placeholder, route constants, not-found route, and auth guards exist. |
| NativeWind styling | Complete | 100% | App scaffold | None | NativeWind configured with token-backed `tailwind.config.js`, `babel.config.js`, `metro.config.js`, and `global.css`. |
| UI primitives | In progress | 75% | Design tokens | Lists/selectors not built yet | Core primitives built and refined for calmer cards, buttons, inputs, empty states, badges, and progress. |
| Design tokens | Complete | 100% | NativeWind or constants | None | Colors, spacing, typography, radius, shadows, rarity, and motion tokens exist; palette now favors premium minimal off-black/deep navy with one primary accent. |
| Environment structure | Complete | 100% | Expo public env | Real keys not committed | `.env.example` documents app env, Supabase URL, anon key, and service-role restrictions. |
| Supabase client | Complete | 100% | Env vars, package install | Real anon key required at runtime | Centralized lazy client exists in `lib/supabase` with SecureStore-backed native session persistence. |
| Database migrations | In progress | 75% | Supabase project | Generate types | Initial production schema, starter catalog seed, and private catch media Storage migrations exist. Apply new migrations to each Supabase environment before testing. |
| Auth session provider | Complete | 100% | Supabase client, SecureStore | None | Central `AuthProvider` restores sessions, listens to auth state, and exposes auth actions. |
| Auth routes | In progress | 80% | Expo Router navigation, auth provider | Password reset/account deletion | Welcome, Sign In, Create Account, and callback routes are wired to auth behavior. |
| Apple Sign In | In progress | 60% | Auth foundation, Apple config | Apple developer/Supabase provider setup | Native client flow implemented with nonce; external provider setup still required. |
| Google Sign In | In progress | 60% | Auth foundation, OAuth config | Google OAuth/Supabase provider setup | Expo WebBrowser OAuth flow implemented; external provider setup still required. |
| Email auth | In progress | 75% | Supabase Auth | Password reset, email template decisions | Sign in and account creation are implemented. |
| Profile management | In progress | 30% | Auth, profiles table | Real profile metrics and editing | Best-effort profile creation exists; Profile tab now has presentational identity/progression UI, but editing and live profile stats are pending. |
| FishDex catalog | In progress | 75% | Species schema, seed data, auth | Search/sort polish and real species media | Starter seed data, read service, simplified list screen, region filter, locked states, rarity display, refined collectible cards, and detail route exist. |
| FishDex progress | Planned | 5% | Catches, user_fishdex_entries | Progress service rules | Schema exists; discovery update logic is not implemented. |
| Species detail | In progress | 60% | FishDex catalog, UI system | Real species media and catch-derived personal records | Detail route exists with a specimen-focused hero, rarity, locked state, notes, habitat, range, and discovery status. |
| Catch logging | In progress | 70% | Auth, catches table, FishDex species, Storage | Catch list/detail/edit | Stable pre-catch-inspiration form, local drafts, validation, queued submit, private photo upload, and FishDex progress update exist. |
| Catch list | Not started | 0% | Catch logging | List service and UI | Personal journal timeline. |
| Catch detail/edit | Not started | 0% | Catch list | None | Needed for trust and correction. |
| Photo upload | In progress | 65% | Supabase Storage, catch logging | Signed upload URL backend and background retry worker | One photo can be compressed, uploaded to private original/thumbnail buckets, linked through `catch_media`, and retried after failure. Direct mobile upload is temporary until a backend exists. |
| Offline drafts | In progress | 65% | AsyncStorage, NetInfo, catch service | Background sync and offline catalog cache | Log Catch can save/restore one draft, queue submitted catches locally, retry failed sync, and retry when connectivity returns while mounted. |
| Trips | Planned | 0% | Catch journal | Product scope | Can follow MVP. |
| Mapbox map/place memory | Planned | 0% | Location data, privacy rules, Mapbox token | Map product scope | Must feel atmospheric, not like a dense utility map. |
| AI fish identification | Planned | 0% | Catch photos, secure backend, consent model | Provider/model decision | Assistive only; user confirmation required. |
| RevenueCat premium | Not started | 0% | App scaffold, products | Store config | Integrate after core value exists. |
| Premium onboarding shell | Complete | 100% | Expo Router navigation, UI system | RevenueCat integration pending | Placeholder route exists without payments. |
| PostHog analytics | Not started | 0% | App scaffold, privacy rules | Project key | Avoid sensitive payloads. |
| Sentry monitoring | Not started | 0% | App scaffold, project setup | DSN/token | Add before production testing. |
| Tests | Not started | 0% | App scaffold | Framework choice | Unit and smoke tests needed. |
| EAS builds | Not started | 0% | Expo config | Apple/EAS setup | Preview and production profiles. |
| Account deletion | Not started | 0% | Auth/profile | Product/legal flow | Required for App Store compliance. |
| Admin tools | Planned | 0% | Backend maturity | Scope | Future production-scale need. |
