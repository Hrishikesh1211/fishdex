# FishQuest Database Schema

Last audited: 2026-05-23

## Audit Status

FishQuest now has a first production-oriented Supabase schema migration set.

Implemented migrations:

- `supabase/migrations/202605230001_create_profiles.sql`
- `supabase/migrations/202605230002_create_core_schema.sql`
- `supabase/migrations/202605230003_seed_starter_catalog.sql`
- `supabase/migrations/202605230004_create_catch_media_storage.sql`

Implemented local database type contract:

- `types/database.ts`

Generated Supabase types are still pending. Replace the hand-written type contract with generated types once the Supabase CLI type generation workflow is configured.

## Schema Principles

- Use Postgres through Supabase.
- Use UUID primary keys.
- Use `created_at` and `updated_at` on mutable tables.
- Use `deleted_at` for soft-deletable user-owned or editorial records.
- Keep Supabase `auth.users` as the identity source.
- Keep app-specific user fields in `public.profiles`.
- Keep species catalog data separate from user FishDex progress.
- Keep uploaded media metadata separate from catches.
- Keep subscription state server-written.
- Keep AI provider details and audit logs server-controlled.
- Preserve migrations. Do not hand-edit production schemas without a migration.

## Current Tables

### `profiles`

App-specific user profile associated with Supabase Auth.

Key columns:

- `id uuid primary key references auth.users(id) on delete cascade`
- `display_name text`
- `avatar_url text`
- `home_region_id uuid references regions(id) on delete set null`
- `created_at timestamptz`
- `updated_at timestamptz`
- `deleted_at timestamptz`

RLS:

- Users can select, insert, and update their own profile.
- No public profile reads until social/public sharing is intentionally designed.

### `regions`

Canonical geography/waterbody hierarchy for FishDex, catches, and signals.

Key columns:

- `id uuid primary key`
- `parent_region_id uuid references regions(id) on delete set null`
- `slug text unique`
- `name text`
- `region_type text`
- `country_code text`
- `latitude double precision`
- `longitude double precision`
- `metadata jsonb`
- `created_at`, `updated_at`, `deleted_at`

RLS:

- Authenticated users can read active regions.
- Writes are reserved for trusted backend/admin workflows.

### `species`

Canonical FishDex species catalog.

Key columns:

- `id uuid primary key`
- `common_name text`
- `scientific_name text`
- `description text`
- `habitat text`
- `rarity text`
- `image_url text`
- `metadata jsonb`
- `created_at`, `updated_at`, `deleted_at`

RLS:

- Authenticated users can read active species.
- Writes are reserved for trusted backend/admin workflows.

### `species_regions`

Join table describing where species are present.

Key columns:

- `id uuid primary key`
- `species_id uuid references species(id) on delete cascade`
- `region_id uuid references regions(id) on delete cascade`
- `presence_status text`
- `created_at`, `updated_at`
- Unique pair: `(species_id, region_id)`

RLS:

- Authenticated users can read species-region mappings.
- Writes are reserved for trusted backend/admin workflows.

### `catches`

Private-first user catch journal records.

Key columns:

- `id uuid primary key`
- `user_id uuid references auth.users(id) on delete cascade`
- `species_id uuid references species(id) on delete set null`
- `caught_at timestamptz`
- `location_name text`
- `region_id uuid references regions(id) on delete set null`
- `latitude double precision`
- `longitude double precision`
- `length_value numeric`
- `length_unit text`
- `weight_value numeric`
- `weight_unit text`
- `notes text`
- `weather_snapshot jsonb`
- `privacy text`
- `created_at`, `updated_at`, `deleted_at`

RLS:

- Users can select, insert, and update their own catches.
- Physical deletes are intentionally not exposed to mobile clients; use `deleted_at` for soft delete.
- Public/shared catch visibility needs explicit future policies before launch.

Implemented app behavior:

- `services/catches/createCatch` inserts user-owned catches.
- Exact latitude/longitude are not collected by the current Log Catch form.
- Public privacy can be selected, but no exact location is exposed by the current form.

### `catch_media`

Metadata for catch photos/videos stored in Supabase Storage.

Key columns:

- `id uuid primary key`
- `catch_id uuid references catches(id) on delete cascade`
- `user_id uuid references auth.users(id) on delete cascade`
- `media_type text`
- `storage_bucket text`
- `storage_path text`
- `thumbnail_storage_bucket text`
- `thumbnail_storage_path text`
- `width integer`
- `height integer`
- `thumbnail_width integer`
- `thumbnail_height integer`
- `mime_type text`
- `file_size_bytes integer`
- `upload_status text`
- `created_at`, `updated_at`, `deleted_at`

RLS:

- Users can read and update their own media metadata.
- Users can insert media metadata only for catches they own.
- Private Storage bucket policies mirror this ownership model.

Storage:

- `catch-originals`: private bucket for compressed full-size catch photos, max 8 MB.
- `catch-thumbnails`: private bucket for generated catch thumbnails, max 1 MB.
- Object paths must be scoped as `{user_id}/{catch_id}/{media_id}.jpg`.
- Authenticated users can select, insert, update, and delete only Storage objects whose first path segment matches their `auth.uid()`.
- The mobile app currently performs direct authenticated uploads with the anon key plus Storage RLS. Signed upload URLs should replace this path once a trusted backend or Edge Function exists.

Current app behavior:

- Photo picker stores local image metadata in drafts.
- On submit, `services/catches/uploadCatchPhoto` compresses the image, uploads a private original and thumbnail, and inserts the `catch_media` row.
- Failed uploads are queued locally and can be retried from the Log Catch screen.
- EXIF/location metadata privacy remains a concern. The current client compression path prepares JPEG derivatives and should be reviewed before accepting camera EXIF-heavy workflows.

### `user_fishdex_entries`

Per-user collectible FishDex discovery/progress state.

Key columns:

- `id uuid primary key`
- `user_id uuid references auth.users(id) on delete cascade`
- `species_id uuid references species(id) on delete cascade`
- `first_catch_id uuid references catches(id) on delete set null`
- `discovered_at timestamptz`
- `catch_count integer`
- best length/weight fields
- `created_at`, `updated_at`
- Unique pair: `(user_id, species_id)`

RLS:

- Users can select, insert, and update their own FishDex entries.
- Future server logic may become the preferred write path if progress rules become complex.

### `signals`

Published environmental, seasonal, advisory, or species/region hints for the Signals tab.

Key columns:

- `id uuid primary key`
- `region_id uuid references regions(id) on delete set null`
- `species_id uuid references species(id) on delete set null`
- `title text`
- `body text`
- `signal_type text`
- `status text`
- `starts_at timestamptz`
- `ends_at timestamptz`
- `metadata jsonb`
- `created_at`, `updated_at`, `deleted_at`

RLS:

- Authenticated users can read active, in-window signals.
- Writes are reserved for trusted backend/admin workflows.

### `subscriptions`

RevenueCat entitlement snapshot and subscription state.

Key columns:

- `id uuid primary key`
- `user_id uuid references auth.users(id) on delete cascade`
- `provider text`
- `provider_customer_id text`
- `entitlement_id text`
- `status text`
- period timestamps
- `latest_event_at timestamptz`
- `metadata jsonb`
- `created_at`, `updated_at`, `deleted_at`

RLS:

- Users can read their own subscription snapshot.
- Writes are server-only through RevenueCat webhooks or trusted backend code.

### `ai_classifications`

Future AI fish identification request/result tracking.

Key columns:

- `id uuid primary key`
- `user_id uuid references auth.users(id) on delete cascade`
- `catch_id uuid references catches(id) on delete set null`
- `media_id uuid references catch_media(id) on delete set null`
- `status text`
- `suggested_species_id uuid references species(id) on delete set null`
- `confidence numeric`
- `provider text`
- `model text`
- `result_payload jsonb`
- `error_message text`
- `user_confirmed_at timestamptz`
- `created_at`, `updated_at`, `deleted_at`

RLS:

- Users can read their own classifications.
- Writes are server-only through an Edge Function or trusted backend. Mobile clients must not call AI providers directly or store provider keys.

### `audit_logs`

Server-side audit trail for sensitive backend/admin events.

Key columns:

- `id uuid primary key`
- `actor_user_id uuid references auth.users(id) on delete set null`
- `action text`
- `target_table text`
- `target_id uuid`
- `metadata jsonb`
- `created_at timestamptz`

RLS:

- RLS is enabled with no client policies.
- Service-role/trusted backend only.

## Indexing Strategy

Implemented indexes cover:

- Profile home region lookup.
- Region hierarchy and type filtering.
- Species common/scientific name lookup.
- Species rarity filtering.
- Species-region joins.
- User catch timeline and user/species catch lookups.
- Catch media by catch, user, and storage path.
- Catch media by thumbnail storage path.
- User FishDex progress by discovery time.
- Active signals by region/species.
- User subscription state and RevenueCat customer lookup.
- AI classification history by user/catch/media.
- Audit log actor and target lookup.

Spatial indexes are intentionally not included yet because PostGIS and Mapbox-backed location queries are not implemented.

## RLS Strategy

Current policy model:

- Catalog reads: authenticated users can read active `regions`, `species`, `species_regions`, and active `signals`.
- User-owned reads/writes: users can manage their own `profiles`, `catches`, `catch_media`, and `user_fishdex_entries`.
- Server-owned writes: `subscriptions`, `ai_classifications`, `signals`, catalog tables, and `audit_logs` are written only by trusted backend/admin workflows.
- Client route guards are UX only. Postgres RLS is the security boundary.

Implemented Storage policy work:

- Private buckets exist for `catch-originals` and `catch-thumbnails`.
- Storage object policies require authenticated ownership by the first folder segment.

Future policy work:

- Add public/shared catch policies only after product privacy rules are finalized.
- Add admin role helpers if an admin dashboard is built.
- Add deletion/anonymization procedures for account deletion.

## Migration Strategy

- All schema changes must be migrations under `supabase/migrations/`.
- Keep migrations linear and append-only after they are applied to shared environments.
- Refresh generated Supabase TypeScript types after migrations are applied.
- Seed data should be explicit and repeatable. Starter catalog seed data uses fixed UUIDs and `on conflict` upserts.
- Destructive migrations require backup and rollback notes.

## Current Gaps

- The core schema migration has been applied in the current Supabase project, per user confirmation.
- Generated Supabase database types are pending.
- Supabase Storage bucket and storage RLS policies are implemented in migration `202605230004_create_catch_media_storage.sql`.
- `catch_media` upload/write flow is implemented with a temporary direct authenticated upload. Signed upload URL support remains pending until a backend/Edge Function exists.
- Starter seed species/region data has been applied in the current Supabase project, per user confirmation.
- Account deletion/anonymization routines are pending.
