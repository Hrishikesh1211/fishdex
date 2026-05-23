# FishQuest API Contracts

Last audited: 2026-05-23

## Audit Status

Supabase client setup, auth/profile service helpers, read-only FishDex catalog/detail services, the first catch logging service, and secure private catch photo upload now exist. Product APIs for subscriptions, analytics, maps, and AI identification are still pending.

## Current APIs

Implemented:

- Supabase Auth session APIs through `state/auth/AuthProvider.tsx`.
- Apple and Google provider helpers in `services/auth/oauth.ts`.
- Profile upsert helper in `services/profiles/profileService.ts`.
- Read-only FishDex catalog/detail service in `services/fishdex/fishdexService.ts`.
- Catch creation, local draft persistence, pending local media queue helpers, private catch photo upload, and offline catch sync queue in `services/catches/`.
- Minimal typed Supabase database contract in `types/database.ts`.
- Database tables for profiles, regions, species, catches, media metadata, FishDex entries, signals, subscriptions, AI classifications, and audit logs.

Expected future integrations:

- Supabase Auth
- Supabase Postgres
- Supabase Storage private catch media buckets
- Supabase Edge Functions when needed
- RevenueCat Purchases SDK
- PostHog analytics
- Sentry error reporting
- Mapbox maps/geocoding planned for future map/place memory
- AI fish identification planned through a trusted backend boundary

## Contract Principles

- Screens should call typed services, not raw backend clients.
- Service functions should return predictable typed results.
- Data validation should happen at boundaries.
- Database-generated types should be committed once Supabase is configured.
- Errors should be normalized before they reach UI components.
- API changes must update this document.

## Request Conventions

Future service functions should use object parameters for clarity:

```ts
createCatch({
  speciesId,
  caughtAt,
  location,
  measurements,
  notes,
  photoLocalUris,
});
```

Avoid long positional argument lists.

## Response Conventions

Use one consistent response shape per service layer.

Recommended:

```ts
type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: AppError };
```

If a query library is introduced, document whether services throw errors or return result objects. Do not mix both styles casually.

## Error Format Standards

Recommended shared error shape:

```ts
type AppError = {
  code: string;
  message: string;
  cause?: unknown;
  retryable?: boolean;
};
```

UI messages should be calm, useful, and privacy-safe. Internal details should go to Sentry, not visible UI.

## Validation Strategy

- Validate user input before writing to Supabase.
- Validate server responses where data is external, generated, or not fully trusted.
- Use shared schema definitions if a validation library is adopted.
- Keep validation near service boundaries and form submission boundaries.

## Auth Strategy

API calls that require a user must verify an active Supabase session before calling user-owned tables or storage.

All user-owned data must rely on RLS in Postgres. Client-side checks improve UX but are not security boundaries.

## Planned Domain APIs

These are planned contracts only.

### Auth

- `useAuth().signInWithEmail({ email, password })`
- `useAuth().signUpWithEmail({ email, password, displayName })`
- `useAuth().signInWithApple()`
- `useAuth().signInWithGoogle()`
- `useAuth().signOut()`
- `AuthProvider` handles `getSession()` and `onAuthStateChange()` internally.

### Profile

- `getMyProfile()`
- `ensureUserProfile(user)`
- `deleteMyAccountRequest()`

### FishDex

- `listFishdexCatalog(userId)`
- `getFishdexSpecies(userId, speciesId)`
- `listMyDiscoveredSpecies()`
- `markSpeciesDiscoveredFromCatch()`

Current FishDex service types:

- `FishdexCatalog`
- `FishdexCatalogSpecies`
- `FishdexRegion`

Current catalog responses include region filter data, rarity, discovery/locked state, catch count, and detail metadata needed by the list and species detail screens.

### Catch Journal

- `createCatch()`
- `saveCatchDraft(userId, draft)`
- `loadCatchDraft(userId)`
- `clearCatchDraft(userId)`
- `enqueueCatchDraftForSync({ catchInput, photo })`
- `syncQueuedCatchDrafts(userId)`
- `syncQueuedCatchDraftById(userId, catchId)`
- `summarizeCatchSyncQueue(userId)`
- `queuePendingCatchMediaUpload({ userId, catchId, photo })`
- `updateCatch()`
- `softDeleteCatch()`
- `getCatchById()`
- `listMyCatches()`
- `syncCatchDraft()`

Current `createCatch` behavior:

- Inserts into `catches`.
- Validates required species, date/time, privacy, notes length, and non-negative measurements.
- Updates or creates `user_fishdex_entries` for catch count and best measurements.
- Photo upload is orchestrated by `uploadCatchPhoto` after the catch row exists.
- Accepts an optional stable `id` for queued offline submissions. Duplicate ID retries are treated as already-synced catch rows to avoid duplicate catches.

Current offline sync behavior:

- Log Catch saves submitted catches to an AsyncStorage queue before network sync.
- Pending/failed queue items can be retried manually or when NetInfo reports connectivity returning while the screen is mounted.
- This is a single-device MVP queue, not a full offline database.

### Media

- `uploadCatchPhoto()`
- `softDeleteCatchMedia()`
- `getSignedCatchPhotoUrl()`

Current media behavior:

- The Log Catch screen can pick one local image.
- Selected image metadata is stored in the local draft.
- After catch submission, the image is compressed with `expo-image-manipulator`.
- The compressed original uploads to private bucket `catch-originals`.
- A generated thumbnail uploads to private bucket `catch-thumbnails`.
- `catch_media` stores original path, thumbnail path, dimensions, MIME type, file size, and upload status.
- Upload progress is staged progress from validation through metadata save. Supabase direct mobile uploads do not currently expose byte-level progress.
- Failed uploads are queued locally and can be retried from the Log Catch screen.
- Mobile clients must not write permanent public media URLs.

Current direct upload limitation:

- No trusted backend or Edge Function exists yet, so the mobile app uploads directly to private Supabase Storage using the authenticated anon client and Storage RLS.
- Signed upload URLs are still the target production pattern once a backend boundary exists.
- Service-role keys remain server-only and are not used by the mobile upload path.

### Subscription

- `configurePurchases()`
- `getCustomerInfo()`
- `restorePurchases()`
- `hasPremiumEntitlement()`

### Analytics

- `identifyUser()`
- `trackEvent()`
- `resetAnalyticsIdentity()`

Analytics events must avoid private notes, precise private coordinates, private media URLs, raw AI prompts, and secrets.

### Maps

Planned only when Mapbox-backed exploration work begins:

- `getMapConfig()`
- `reverseGeocodeCatchLocation()`
- `searchFishingPlaces()`
- `getPlaceMemorySummary()`

Mapbox access tokens must be environment-scoped and restricted where possible.

### AI Fish Identification

Planned only after catch media, consent, and backend boundaries exist:

- `requestFishIdentification()`
- `getIdentificationResult()`
- `confirmIdentificationSuggestion()`
- `rejectIdentificationSuggestion()`

AI identification responses should include suggested species, confidence, provider/model metadata, and a user-confirmation state. Suggestions must not become authoritative FishDex data until the user confirms or edits them.

### Audit Logs

Audit logs are server-only. Mobile clients must not insert audit rows directly.

## Versioning

For MVP, app and database contracts can evolve together through migrations. Once public clients exist, breaking contract changes must be documented with migration steps.
