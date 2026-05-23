# FishQuest API Contracts

Last audited: 2026-05-22

## Audit Status

No API clients, service functions, Supabase project files, or backend contracts exist in this workspace at audit time.

## Current APIs

None implemented.

Expected future integrations:

- Supabase Auth
- Supabase Postgres
- Supabase Storage
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

- `getCurrentSession()`
- `signInWithApple()`
- `signInWithGoogle()`
- `signOut()`
- `onAuthStateChange()`

### Profile

- `getMyProfile()`
- `upsertMyProfile()`
- `deleteMyAccountRequest()`

### FishDex

- `listSpecies()`
- `getSpeciesById()`
- `listMyDiscoveredSpecies()`
- `markSpeciesDiscoveredFromCatch()`

### Catch Journal

- `createCatch()`
- `updateCatch()`
- `deleteCatch()`
- `getCatchById()`
- `listMyCatches()`
- `syncCatchDraft()`

### Media

- `uploadCatchPhoto()`
- `deleteCatchPhoto()`
- `getSignedCatchPhotoUrl()`

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

## Versioning

For MVP, app and database contracts can evolve together through migrations. Once public clients exist, breaking contract changes must be documented with migration steps.
