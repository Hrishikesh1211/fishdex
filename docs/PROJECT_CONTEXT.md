# FishQuest Project Context

Last audited: 2026-05-22
Workspace: `C:\Users\rhris\FishDex_test`

## Current Repository Reality

This workspace is currently empty except for the documentation system created during this audit. There is no Expo app, TypeScript source, Supabase schema, configuration, package manifest, routing tree, or Git metadata present in this folder at audit time.

All product and architecture notes below are the intended direction for FishQuest. Future agents must treat implementation status as unbuilt until code exists in this workspace.

## Product Vision

FishQuest is a premium iOS-first fishing adventure and aquatic discovery app. It combines atmospheric outdoor exploration, a collectible FishDex, catch journaling, and progression systems into an experience that feels calm, mysterious, modern, and high quality.

FishQuest is not a utilitarian fishing tool. It should not primarily feel like a weather dashboard, knot guide, map utility, or tournament tracker. It should feel like a quiet field journal fused with a collectible discovery game.

## Emotional Pillars

- Premium: polished typography, restrained motion, high trust, no clutter.
- Calm: low-noise screens, spacious rhythm, gentle interaction feedback.
- Mysterious: discovery mechanics, unknown silhouettes, hidden aquatic life, atmospheric content.
- Collectible: FishDex completion, rarity, habitat records, personal milestones.
- Immersive: strong sense of place, water, weather, time, and outdoor memory.
- Modern: native-feeling iOS interactions, concise UI, strong system integration.
- Minimal: fewer controls, better defaults, careful information hierarchy.
- Outdoor-oriented: grounded in actual fishing trips, locations, catches, conditions, and nature.

## Target Users

- Recreational anglers who want a beautiful personal catch journal.
- Exploratory anglers who enjoy discovering species, habitats, and progress.
- Collectors who respond to completion systems and rarity.
- Premium mobile users who value design, calm, privacy, and polish.
- Future community users who may want optional sharing without turning the app into a noisy social feed.

## Platform Strategy

- Primary platform: iOS.
- Initial framework: Expo React Native with TypeScript and Expo Router.
- Android may be supported later if the architecture remains portable.
- Web is not a primary app surface unless needed for admin, marketing, or support flows.
- Maps are a future exploration layer, with Mapbox as the planned provider when map/place memory becomes a core feature.
- AI fish identification is a future assisted-identification feature, not an MVP dependency and not a substitute for user confirmation.

## Monetization

Planned monetization uses RevenueCat for premium subscriptions or purchases.

Potential premium value:

- Advanced FishDex progression.
- Unlimited catch history and media.
- Premium analytics and personal insights.
- Premium map or trip memory views.
- Themed collectibles, seasonal quests, or deeper discovery systems.
- Sync, backup, and cross-device history.

Monetization must not damage the calm, premium tone. Avoid manipulative pressure, aggressive paywalls, or noisy conversion screens.

## Analytics and Monitoring

FishQuest plans to use PostHog for product analytics and Sentry for production monitoring.

PostHog should answer product questions without collecting sensitive catch details, private notes, precise coordinates, private media URLs, or secrets.

Sentry should capture crashes and operational errors with release/environment context, while scrubbing tokens and private user content.

## Future AI Fish Identification

AI-assisted fish identification may eventually help users classify catch photos and discover FishDex entries. This feature must be treated as assistive and probabilistic:

- Users must be able to confirm or correct AI suggestions.
- The model/provider contract must be documented before implementation.
- Uploaded photos and metadata must follow privacy and consent rules.
- AI output should never silently overwrite user-entered species data.
- The UI must remain premium and atmospheric, not a generic AI chat or prompt interface.

## Product Philosophy

- Start with trust and memory: catches, species, photos, conditions, and personal progress.
- Make discovery meaningful: collecting should feel earned, not artificially inflated.
- Preserve atmosphere: every feature should make the user feel closer to water, weather, habitat, or story.
- Favor quality over feature volume.
- Avoid duplicating generic fishing app features unless they deepen the FishQuest experience.

## Design Philosophy

FishQuest should borrow inspiration from modern atmospheric adventure interfaces, premium editorial design, Fishbrain-style fishing context, and collectible progression systems.

Design principles:

- Use restraint before decoration.
- Create hierarchy through spacing, typography, color, and media.
- Make primary screens feel like an app, not a marketing page.
- Keep components consistent and reusable.
- Let visual assets show real fish, water, location, texture, or progress.
- Avoid random fantasy UI styles that do not belong to a premium outdoor app.
- Avoid generic AI-product visual language. FishQuest should feel like an aquatic discovery journal, not a chatbot wrapper.

## Non-Goals

- Not a cluttered fishing utility dashboard.
- Not a full social network at MVP.
- Not a tournament management app.
- Not a replacement for regulatory fishing license or legal compliance tools.
- Not a weather-only or sonar-style utility.
- Not a generic habit tracker with fishing labels.
- Not a gamified toy interface that undermines real outdoor use.

## Scalability Goals

- Support long-term AI-assisted development without duplicate systems.
- Keep folder boundaries and feature ownership clear.
- Separate UI, domain logic, services, data contracts, and platform integrations.
- Keep database schema intentional and documented.
- Preserve migration history once Supabase is introduced.
- Build observability early enough to debug production behavior.
- Treat security, privacy, and user-generated media as core platform responsibilities.

## Long-Term Roadmap Summary

1. Foundation: Expo app, docs, linting, formatting, TypeScript, design tokens, routing shell.
2. Auth and identity: Supabase auth, Apple Sign In, Google Sign In, protected routes.
3. Core journal: catches, photos, species selection, trip context, offline-friendly drafts.
4. FishDex MVP: species catalog, discovery state, rarity, progress.
5. Cloud sync: Supabase persistence, storage, RLS, migrations.
6. Premium layer: RevenueCat entitlements, tasteful paywall, feature gating.
7. Insights and exploration: Mapbox map/place memory, habitat, conditions, statistics, quests.
8. Observability and release: Sentry, PostHog, EAS channels, release QA.
9. Future intelligence: AI-assisted fish identification, species enrichment, personal insights.
10. Production scale: admin tools, moderation, data exports, privacy controls.
