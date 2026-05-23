# FishQuest Testing Guide

Last audited: 2026-05-23

## Audit Status

No automated test framework exists yet. The app has a TypeScript check script and auth-specific manual smoke tests.

## Testing Strategy

Testing should scale with product risk:

- Unit tests for pure domain logic.
- Service tests for API mapping and error normalization.
- Component tests for critical UI states where practical.
- Manual smoke tests for native flows.
- Real-device QA for auth, camera/media, purchases, and offline behavior.
- Future Mapbox flows must be tested for permissions, privacy, and low-connectivity behavior.
- Future AI identification flows must be tested for consent, failed recognition, user correction, and provider errors.

## Test Commands

Current commands:

```bash
npm run typecheck
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
- Starter FishDex catalog renders after applying `202605230003_seed_starter_catalog.sql`.
- FishDex refresh handles loading and error states.
- Species detail opens.
- Regional FishDex filter changes the visible species set.
- Locked species show locked copy but remain openable.
- Rarity badges appear consistently on list and detail screens.
- Catch creation opens.
- Catch can be saved.
- Catch list updates after save.
- Log Catch can save and restore a local draft.
- Log Catch validates missing species, invalid date/time, negative measurements, and long notes.
- Log Catch can submit a catch and FishDex progress updates after refresh/navigation.
- Photo picker can attach one local photo to a draft.
- Submitted photo uploads to private Supabase Storage and is not exposed as a public URL.
- Catch media metadata row is created with original path, thumbnail path, dimensions, MIME type, file size, and `uploaded` status.
- Failed photo upload shows an error and retry action.
- Offline draft survives app restart.
- Offline submitted catch shows saved locally/pending sync state and syncs after reconnect.
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
- Email/password sign in.
- Email account creation with and without email confirmation enabled.
- App restart session restore.
- Profile upsert after first login once the profiles migration is applied.
- Missing profiles table warning does not crash the app.
- Google OAuth cancellation.
- Apple Sign In cancellation.

## Auth Smoke Test Flow

1. Start from a fresh install or sign out.
2. Confirm `/map` redirects to `/welcome`.
3. Create an email account.
4. If email confirmation is enabled, confirm the email and then sign in.
5. Confirm the Map tab loads.
6. Close and reopen the app; confirm the session restores without returning to auth.
7. Open Profile and sign out.
8. Confirm tabs redirect back to `/welcome`.
9. Try an invalid password and confirm an error appears.
10. After applying the profiles migration, confirm `public.profiles` has one row for the signed-in user.

## Upload Testing

Current media upload behavior:

- Current state: picker, compression, private Storage upload, thumbnail generation, media metadata insert, and same-session retry exist.
- Upload one catch photo.
- Cancel photo picker.
- Try a non-image file if the platform picker permits it; it should be rejected.
- Try a source image over 12 MB; it should be rejected before upload when file size is available.
- Retry failed upload.
- Test weak network.
- Confirm private storage access: objects should exist under `{user_id}/{catch_id}/...` in `catch-originals` and `catch-thumbnails`, and buckets should not be public.
- Confirm another user cannot read the object path or `catch_media` row.
- Confirm deleted catch removes or detaches media according to policy.

## Offline Testing

Current offline draft behavior:

- Current state: one Log Catch draft can be saved/restored locally; submitted drafts are queued locally before network sync.
- Create catch with no network.
- Attach photo with no network.
- Restart app before sync.
- Restore draft.
- Reconnect and sync.
- Retry failed sync.
- Verify no duplicate catch is created.
- Verify UI states: saved locally, pending sync, synced, failed sync.
- Verify the same queued catch uses the same `catches.id` across retries.
- Verify reconnect retry works while the Log Catch screen is mounted.

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
- No automated smoke test runner.
- No scripts.
- No QA fixtures.
- No staging environment.
