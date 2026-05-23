# FishQuest Security Rules

Last audited: 2026-05-23

## Audit Status

Security-sensitive auth implementation and private catch photo upload now exist. Supabase Auth sessions are centralized, native session persistence uses SecureStore, and catch media is stored in private Supabase Storage buckets.

## Secret Management

- Never commit secrets.
- Never expose service-role keys in the mobile app.
- Use environment variables and EAS secrets for build-time sensitive values.
- Public mobile keys must be protected by backend authorization rules.
- Keep `.env.example` current without real secrets.

## Auth Rules

- Supabase Auth is the source of user identity.
- Route guards are not security boundaries.
- RLS must enforce ownership.
- Sign out must clear sensitive local state.
- Account deletion must be supported before production.
- The mobile client stores Supabase sessions through `expo-secure-store` on native platforms.
- Web uses AsyncStorage fallback only because SecureStore is native-only.

## Upload Security

- Catch photos are private by default.
- Storage paths should include user ownership.
- Users may only read/write their own private media unless explicit sharing exists.
- Validate file type and size before upload.
- Avoid exposing permanent public URLs for private media.
- Use signed URLs when needed.
- Current app upload is a temporary authenticated direct upload through the anon client plus Storage RLS because no backend/Edge Function exists yet.
- Use signed upload URLs when the backend boundary is added.
- Client image compression prepares JPEG derivatives and helps reduce EXIF exposure, but EXIF/location privacy must be reviewed before camera-first workflows ship.

## API Security

- Normalize errors before displaying them.
- Do not leak backend internals to users.
- Validate all user input before writes.
- Use Edge Functions for privileged operations.
- Never call privileged operations directly from the client with service credentials.

## RLS Rules

Every user-owned table must have RLS enabled.

Implemented:

- `profiles` has owner-only select, insert, and update policies.
- `catches`, `catch_media`, and `user_fishdex_entries` have owner-only policies.
- `regions`, `species`, `species_regions`, and active `signals` are readable by authenticated users.
- `subscriptions` and `ai_classifications` are readable by the owning user but written server-side.
- `audit_logs` has RLS enabled with no mobile-client policies.

Minimum policy expectations:

- Users can select their own records.
- Users can insert records only for themselves.
- Users can update only their own records.
- Users can delete only their own records when deletion is allowed.
- Public catalog tables are read-only to clients unless admin tools exist.

## Storage Privacy

- Use private buckets for catch media.
- Use explicit policies for object ownership.
- Current private buckets are `catch-originals` and `catch-thumbnails`.
- Catch media object paths must begin with the owning user ID.
- Storage policies allow authenticated users to manage only objects whose first folder matches `auth.uid()`.
- Delete or anonymize media according to account deletion policy.
- Do not send precise private media metadata to analytics.

## Mobile Security

- Do not store secrets in app code.
- Do not log tokens.
- Do not include sensitive data in crash reports.
- Treat precise location and catch notes as private.
- Avoid putting sensitive data in route params.
- Keep dependencies current and remove unused packages.
- Current catch logging does not collect exact latitude/longitude.
- Selected catch photos are compressed and uploaded to private Storage after catch submission.

## Admin Security

- Admin tools must be separate from the mobile client.
- Admin access must use strong authentication.
- Admin actions should be logged.
- Service-role keys belong only in trusted backend environments.

## Logging and Audit Rules

- Log operational errors without sensitive payloads.
- Scrub tokens, private notes, precise coordinates, and media URLs.
- Track product analytics at event level, not private-content level.
- Document any new analytics event that uses user data.

## Compliance Considerations

- Provide privacy policy and terms before production.
- Provide account deletion.
- Support data export or deletion workflows as required.
- Follow App Store guidance for Sign In with Apple and subscriptions.
