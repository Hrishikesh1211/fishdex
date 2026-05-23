# FishQuest Testing Guide

Last audited: 2026-05-22

## Audit Status

No test framework, app source, or package scripts exist in this workspace at audit time.

## Testing Strategy

Testing should scale with product risk:

- Unit tests for pure domain logic.
- Service tests for API mapping and error normalization.
- Component tests for critical UI states where practical.
- Manual smoke tests for native flows.
- Real-device QA for auth, camera/media, purchases, and offline behavior.
- Future Mapbox flows must be tested for permissions, privacy, and low-connectivity behavior.
- Future AI identification flows must be tested for consent, failed recognition, user correction, and provider errors.

## Future Test Commands

No commands exist yet.

Expected future commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Update this guide with actual scripts after `package.json` exists.

## Smoke Test Checklist

Run before preview releases:

- App launches without crash.
- Auth loading state resolves.
- Sign in works.
- Sign out clears user state.
- Main navigation tabs render.
- FishDex list renders.
- Species detail opens.
- Catch creation opens.
- Catch can be saved.
- Catch list updates after save.
- Photo selection/upload path works if implemented.
- Offline draft survives app restart if implemented.
- Premium entitlement screen loads if implemented.
- Sentry captures test error in non-production if configured.
- PostHog sends allowed events if configured.
- Mapbox map/place memory loads only if implemented.
- AI fish identification shows suggestions and allows correction only if implemented.

## Auth Testing

- Fresh install with no session.
- Existing session restore.
- Expired or revoked session.
- Apple Sign In success.
- Apple Sign In cancellation.
- Google Sign In success if implemented.
- Sign out.
- Account deletion request path.
- Protected route redirect behavior.

## Upload Testing

Once media upload exists:

- Upload one catch photo.
- Upload multiple photos if supported.
- Cancel photo picker.
- Retry failed upload.
- Test weak network.
- Confirm private storage access.
- Confirm deleted catch removes or detaches media according to policy.

## Offline Testing

Once offline drafts exist:

- Create catch with no network.
- Attach photo with no network.
- Restart app before sync.
- Restore draft.
- Reconnect and sync.
- Retry failed sync.
- Verify no duplicate catch is created.

## Release Testing

Before App Store or TestFlight:

- Run all automated checks.
- Test on a physical iPhone.
- Verify environment points to staging or production intentionally.
- Verify RevenueCat products in sandbox.
- Verify no debug secrets or test banners are present.
- Verify privacy-sensitive analytics are not sent.
- Verify account deletion path.
- Verify Sentry release/environment tags.
- Verify Mapbox token/environment when map features exist.
- Verify AI provider keys are server-side only when identification exists.

## Test Data

Use dedicated staging users and staging Supabase data. Do not test destructive flows against production user data.

## Current Gaps

- No automated tests.
- No app to smoke test.
- No scripts.
- No QA fixtures.
- No staging environment.
