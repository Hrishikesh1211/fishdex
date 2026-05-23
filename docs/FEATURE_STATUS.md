# FishQuest Feature Status

Last audited: 2026-05-22

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
| Expo Router navigation | In progress | 75% | App scaffold | Real auth guards and feature details | Root layout, main tabs, auth placeholders, premium onboarding placeholder, route constants, and not-found route exist. |
| NativeWind styling | Complete | 100% | App scaffold | None | NativeWind configured with token-backed `tailwind.config.js`, `babel.config.js`, `metro.config.js`, and `global.css`. |
| UI primitives | In progress | 55% | Design tokens | Inputs/lists not built yet | Core primitives built: AppScreen, AppText, AppButton, Card, RarityBadge, ProgressPill, EmptyState, LoadingState. |
| Design tokens | Complete | 100% | NativeWind or constants | None | Colors, spacing, typography, radius, shadows, rarity, and motion tokens exist. |
| Environment structure | Complete | 100% | Expo public env | Real keys not committed | `.env.example` documents app env, Supabase URL, anon key, and service-role restrictions. |
| Supabase client | Complete | 100% | Env vars, package install | Real anon key required at runtime | Centralized lazy client exists in `lib/supabase`; no auth behavior is wired yet. |
| Database migrations | Not started | 0% | Supabase project | Schema decisions | Start with profiles, species, catches. |
| Auth session provider | Not started | 0% | Supabase client | Provider configuration | Central route protection required. |
| Auth placeholder routes | Complete | 100% | Expo Router navigation | None | Welcome, Sign In, and Create Account placeholders exist without real auth. |
| Apple Sign In | Not started | 0% | Auth foundation, Apple config | Apple developer setup | Primary iOS auth path. |
| Google Sign In | Not started | 0% | Auth foundation, OAuth config | Google OAuth setup | Optional secondary path. |
| Profile management | Not started | 0% | Auth, profiles table | None | Minimal profile first. |
| FishDex catalog | Not started | 0% | Species schema, seed data | Species data source | Core collectible feature. |
| FishDex progress | Not started | 0% | Catches, fishdex_entries | None | Discovery state from catches. |
| Species detail | Not started | 0% | FishDex catalog, UI system | Species media | Important premium surface. |
| Catch logging | Not started | 0% | Auth, catches table, UI | None | Core MVP workflow. |
| Catch list | Not started | 0% | Catch logging | None | Personal journal timeline. |
| Catch detail/edit | Not started | 0% | Catch list | None | Needed for trust and correction. |
| Photo upload | Not started | 0% | Supabase Storage | Storage policies | Private by default. |
| Offline drafts | Not started | 0% | Local storage strategy | Sync model | Field reliability feature. |
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
