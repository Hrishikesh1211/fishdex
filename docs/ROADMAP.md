# FishQuest Roadmap

Last audited: 2026-05-22

## Phase 0: Documentation and Audit

Status: complete for current empty workspace.

- Audit repository.
- Create long-term documentation memory system.
- Record current implementation reality.
- Establish AI development rules.

## Phase 1: App Foundation

Goal: create a stable Expo React Native base.

- Initialize Expo TypeScript app.
- Configure Expo Router.
- Configure NativeWind.
- Add design tokens.
- Add lint, format, typecheck scripts.
- Add route shell.
- Add app icons/splash placeholders.
- Add environment example.
- Add baseline error boundary.

## Phase 2: Auth Foundation

Goal: secure user identity and protected navigation.

- Configure Supabase client.
- Add auth session provider.
- Add Apple Sign In.
- Add Google Sign In if required.
- Add protected routes.
- Add profile table migration.
- Add sign out and account deletion request path.

## Phase 3: FishDex MVP

Goal: collectible discovery foundation.

- Add species schema.
- Add seed species catalog.
- Add FishDex list.
- Add species detail screen.
- Add rarity and discovery state.
- Add progress summaries.

## Phase 4: Catch Journal MVP

Goal: core user value through catch logging.

- Add catches schema.
- Add create catch flow.
- Add catch list.
- Add catch detail.
- Add edit/delete.
- Add photo attach and upload.
- Add local draft persistence.

## Phase 5: Sync, Storage, and Offline Reliability

Goal: make field use dependable.

- Add private Supabase Storage bucket.
- Add upload retry queue.
- Add draft recovery.
- Add sync status UI.
- Add conflict handling rules.
- Add local cache strategy.

## Phase 6: Premium and Monetization

Goal: add tasteful subscription value.

- Configure RevenueCat.
- Define entitlements.
- Add restore purchases.
- Add premium gates.
- Add calm premium screen.
- Add analytics around conversion without invasive tracking.

## Phase 7: Observability and QA

Goal: prepare production-grade releases.

- Add Sentry.
- Add PostHog.
- Add release tagging.
- Add smoke test checklist.
- Add automated tests for services and critical flows.
- Add EAS build profiles.

## Phase 8: Mapbox Exploration and Insights

Goal: deepen FishQuest identity.

- Add trip grouping.
- Add Mapbox map/place memory views.
- Add personal records.
- Add seasonal discovery or quest systems.
- Add habitat and condition insights.
- Add privacy controls for exact catch locations.

## Phase 9: AI-Assisted Identification

Goal: help users identify fish while preserving user control and privacy.

- Define AI provider/backend contract.
- Add secure server-side identification request flow.
- Add user consent and photo handling rules.
- Add AI suggestion UI inside catch logging and FishDex.
- Add confirmation/correction workflow.
- Store identification history only when privacy rules are satisfied.

## Phase 10: Community and Sharing

Goal: optional social value without noise.

- Add controlled sharing.
- Add privacy-first public catch cards.
- Add moderation plan.
- Add report/block tools if user-generated public content exists.

## Phase 11: Production Scale

Goal: operate safely long term.

- Add admin tooling.
- Add database backups and monitoring.
- Add support workflows.
- Add data export and deletion automation.
- Add performance budgets.
- Add deeper analytics governance.
