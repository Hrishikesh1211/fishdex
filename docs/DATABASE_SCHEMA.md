# FishQuest Database Schema

Last audited: 2026-05-22

## Audit Status

No Supabase files, migrations, generated database types, seed data, or schema files exist in this workspace at audit time.

## Current DB Structure

None implemented.

## Planned Schema Principles

- Use Postgres through Supabase.
- Use UUID primary keys.
- Use `created_at` and `updated_at` timestamps on mutable tables.
- Use RLS on every user-owned table.
- Keep species catalog data separate from user progress.
- Keep uploaded media metadata separate from catch records when multiple photos are possible.
- Preserve migrations. Do not hand-edit production schemas without a migration.

## Planned Tables

### `profiles`

Responsibility: app-specific user profile associated with Supabase auth user.

Likely columns:

- `id uuid primary key references auth.users(id)`
- `display_name text`
- `avatar_url text`
- `created_at timestamptz`
- `updated_at timestamptz`

### `species`

Responsibility: canonical FishDex catalog.

Likely columns:

- `id uuid primary key`
- `common_name text`
- `scientific_name text`
- `description text`
- `habitat text`
- `rarity text`
- `region_tags text[]`
- `image_url text`
- `created_at timestamptz`
- `updated_at timestamptz`

### `catches`

Responsibility: user catch journal records.

Likely columns:

- `id uuid primary key`
- `user_id uuid references auth.users(id)`
- `species_id uuid references species(id)`
- `caught_at timestamptz`
- `location_name text`
- `latitude double precision`
- `longitude double precision`
- `length_value numeric`
- `length_unit text`
- `weight_value numeric`
- `weight_unit text`
- `notes text`
- `weather_snapshot jsonb`
- `privacy text`
- `created_at timestamptz`
- `updated_at timestamptz`

### `catch_photos`

Responsibility: metadata for uploaded catch photos.

Likely columns:

- `id uuid primary key`
- `catch_id uuid references catches(id)`
- `user_id uuid references auth.users(id)`
- `storage_path text`
- `width integer`
- `height integer`
- `created_at timestamptz`

### `fishdex_entries`

Responsibility: per-user discovery state and species progress.

Likely columns:

- `id uuid primary key`
- `user_id uuid references auth.users(id)`
- `species_id uuid references species(id)`
- `first_catch_id uuid references catches(id)`
- `discovered_at timestamptz`
- `count integer`
- `best_length_value numeric`
- `best_weight_value numeric`
- `created_at timestamptz`
- `updated_at timestamptz`

### `trips`

Responsibility: optional grouping for catches and outdoor sessions.

Likely columns:

- `id uuid primary key`
- `user_id uuid references auth.users(id)`
- `title text`
- `started_at timestamptz`
- `ended_at timestamptz`
- `location_name text`
- `notes text`
- `created_at timestamptz`
- `updated_at timestamptz`

### `subscription_events`

Responsibility: entitlement metadata and webhook history if RevenueCat webhooks are used.

Likely columns:

- `id uuid primary key`
- `user_id uuid references auth.users(id)`
- `provider text`
- `event_type text`
- `payload jsonb`
- `created_at timestamptz`

### `identification_requests`

Responsibility: future AI fish identification request and result tracking.

Likely columns:

- `id uuid primary key`
- `user_id uuid references auth.users(id)`
- `catch_id uuid references catches(id)`
- `photo_id uuid references catch_photos(id)`
- `status text`
- `suggested_species_id uuid references species(id)`
- `confidence numeric`
- `provider text`
- `model text`
- `result_payload jsonb`
- `user_confirmed_at timestamptz`
- `created_at timestamptz`
- `updated_at timestamptz`

## Indexing Strategy

Planned indexes:

- `profiles(id)`
- `species(common_name)`
- `species(rarity)`
- `catches(user_id, caught_at desc)`
- `catches(user_id, species_id)`
- `catch_photos(catch_id)`
- `fishdex_entries(user_id, species_id)` unique
- `trips(user_id, started_at desc)`
- `identification_requests(user_id, created_at desc)`
- `identification_requests(catch_id)`

Spatial indexes should be considered only after Mapbox-backed location queries or map/place memory are implemented.

## RLS Strategy

- `profiles`: users can read/update their own profile. Public profile reads only if social features require it.
- `catches`: users can CRUD their own catches. Shared/public catches require explicit privacy rules.
- `catch_photos`: users can manage photos for their own catches.
- `fishdex_entries`: users can read/write their own progress through controlled app logic.
- `species`: read-only to authenticated users or public if app requires it.
- `subscription_events`: service role writes only. Users should not modify raw provider events.
- `identification_requests`: users may read their own requests. Writes should be controlled by service logic or Edge Functions if provider calls are involved.

## Migration Strategy

- All schema changes must be migrations under `supabase/migrations/`.
- Migrations must be reviewed before production deploy.
- Generated database types should be refreshed after migrations.
- Seed data should be explicit and repeatable.
- Destructive migrations require backup and rollback notes.

## Current Gaps

- No Supabase project initialized.
- No migrations exist.
- No generated database types exist.
- No RLS policies exist.
- No storage buckets exist.
