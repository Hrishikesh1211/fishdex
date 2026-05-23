create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  parent_region_id uuid references public.regions(id) on delete set null,
  slug text not null unique,
  name text not null,
  region_type text not null check (region_type in ('continent', 'country', 'state', 'province', 'waterbody', 'locality', 'custom')),
  country_code text,
  latitude double precision check (latitude is null or (latitude >= -90 and latitude <= 90)),
  longitude double precision check (longitude is null or (longitude >= -180 and longitude <= 180)),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.profiles
  add column if not exists home_region_id uuid references public.regions(id) on delete set null,
  add column if not exists deleted_at timestamptz;

create table if not exists public.species (
  id uuid primary key default gen_random_uuid(),
  common_name text not null,
  scientific_name text,
  description text,
  habitat text,
  rarity text not null default 'common' check (rarity in ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
  image_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.species_regions (
  id uuid primary key default gen_random_uuid(),
  species_id uuid not null references public.species(id) on delete cascade,
  region_id uuid not null references public.regions(id) on delete cascade,
  presence_status text not null default 'native' check (presence_status in ('native', 'introduced', 'seasonal', 'rare', 'unknown')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (species_id, region_id)
);

create table if not exists public.catches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  species_id uuid references public.species(id) on delete set null,
  caught_at timestamptz not null default now(),
  location_name text,
  region_id uuid references public.regions(id) on delete set null,
  latitude double precision check (latitude is null or (latitude >= -90 and latitude <= 90)),
  longitude double precision check (longitude is null or (longitude >= -180 and longitude <= 180)),
  length_value numeric check (length_value is null or length_value >= 0),
  length_unit text check (length_unit is null or length_unit in ('in', 'cm')),
  weight_value numeric check (weight_value is null or weight_value >= 0),
  weight_unit text check (weight_unit is null or weight_unit in ('lb', 'oz', 'kg', 'g')),
  notes text,
  weather_snapshot jsonb not null default '{}'::jsonb,
  privacy text not null default 'private' check (privacy in ('private', 'unlisted', 'public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.catch_media (
  id uuid primary key default gen_random_uuid(),
  catch_id uuid not null references public.catches(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  media_type text not null default 'photo' check (media_type in ('photo', 'video')),
  storage_bucket text not null default 'catch-media',
  storage_path text not null,
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  upload_status text not null default 'uploaded' check (upload_status in ('pending', 'uploaded', 'failed', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.user_fishdex_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  species_id uuid not null references public.species(id) on delete cascade,
  first_catch_id uuid references public.catches(id) on delete set null,
  discovered_at timestamptz not null default now(),
  catch_count integer not null default 0 check (catch_count >= 0),
  best_length_value numeric check (best_length_value is null or best_length_value >= 0),
  best_length_unit text check (best_length_unit is null or best_length_unit in ('in', 'cm')),
  best_weight_value numeric check (best_weight_value is null or best_weight_value >= 0),
  best_weight_unit text check (best_weight_unit is null or best_weight_unit in ('lb', 'oz', 'kg', 'g')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, species_id)
);

create table if not exists public.signals (
  id uuid primary key default gen_random_uuid(),
  region_id uuid references public.regions(id) on delete set null,
  species_id uuid references public.species(id) on delete set null,
  title text not null,
  body text,
  signal_type text not null check (signal_type in ('seasonal', 'weather', 'spawn', 'migration', 'water', 'advisory', 'community', 'system')),
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  starts_at timestamptz,
  ends_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'revenuecat' check (provider in ('revenuecat')),
  provider_customer_id text,
  entitlement_id text not null,
  status text not null default 'unknown' check (status in ('trialing', 'active', 'past_due', 'canceled', 'expired', 'unknown')),
  current_period_started_at timestamptz,
  current_period_ends_at timestamptz,
  latest_event_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.ai_classifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  catch_id uuid references public.catches(id) on delete set null,
  media_id uuid references public.catch_media(id) on delete set null,
  status text not null default 'queued' check (status in ('queued', 'processing', 'completed', 'failed', 'cancelled')),
  suggested_species_id uuid references public.species(id) on delete set null,
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  provider text,
  model text,
  result_payload jsonb not null default '{}'::jsonb,
  error_message text,
  user_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists profiles_home_region_id_idx on public.profiles(home_region_id);
create index if not exists regions_parent_region_id_idx on public.regions(parent_region_id);
create index if not exists regions_region_type_idx on public.regions(region_type) where deleted_at is null;
create index if not exists species_common_name_idx on public.species(lower(common_name)) where deleted_at is null;
create unique index if not exists species_scientific_name_unique_idx on public.species(lower(scientific_name)) where scientific_name is not null and deleted_at is null;
create index if not exists species_rarity_idx on public.species(rarity) where deleted_at is null;
create index if not exists species_regions_species_id_idx on public.species_regions(species_id);
create index if not exists species_regions_region_id_idx on public.species_regions(region_id);
create index if not exists catches_user_caught_at_idx on public.catches(user_id, caught_at desc) where deleted_at is null;
create index if not exists catches_user_species_idx on public.catches(user_id, species_id) where deleted_at is null;
create index if not exists catches_region_id_idx on public.catches(region_id) where deleted_at is null;
create index if not exists catch_media_catch_id_idx on public.catch_media(catch_id) where deleted_at is null;
create index if not exists catch_media_user_id_idx on public.catch_media(user_id) where deleted_at is null;
create unique index if not exists catch_media_storage_path_unique_idx on public.catch_media(storage_bucket, storage_path) where deleted_at is null;
create index if not exists user_fishdex_user_discovered_idx on public.user_fishdex_entries(user_id, discovered_at desc);
create index if not exists signals_active_region_idx on public.signals(region_id, starts_at desc) where status = 'active' and deleted_at is null;
create index if not exists signals_active_species_idx on public.signals(species_id, starts_at desc) where status = 'active' and deleted_at is null;
create index if not exists subscriptions_user_status_idx on public.subscriptions(user_id, status) where deleted_at is null;
create index if not exists subscriptions_provider_customer_idx on public.subscriptions(provider, provider_customer_id) where provider_customer_id is not null and deleted_at is null;
create index if not exists ai_classifications_user_created_idx on public.ai_classifications(user_id, created_at desc) where deleted_at is null;
create index if not exists ai_classifications_catch_id_idx on public.ai_classifications(catch_id) where deleted_at is null;
create index if not exists ai_classifications_media_id_idx on public.ai_classifications(media_id) where deleted_at is null;
create index if not exists audit_logs_actor_created_idx on public.audit_logs(actor_user_id, created_at desc);
create index if not exists audit_logs_target_idx on public.audit_logs(target_table, target_id);

drop trigger if exists set_regions_updated_at on public.regions;
create trigger set_regions_updated_at before update on public.regions for each row execute function public.set_updated_at();

drop trigger if exists set_species_updated_at on public.species;
create trigger set_species_updated_at before update on public.species for each row execute function public.set_updated_at();

drop trigger if exists set_species_regions_updated_at on public.species_regions;
create trigger set_species_regions_updated_at before update on public.species_regions for each row execute function public.set_updated_at();

drop trigger if exists set_catches_updated_at on public.catches;
create trigger set_catches_updated_at before update on public.catches for each row execute function public.set_updated_at();

drop trigger if exists set_catch_media_updated_at on public.catch_media;
create trigger set_catch_media_updated_at before update on public.catch_media for each row execute function public.set_updated_at();

drop trigger if exists set_user_fishdex_entries_updated_at on public.user_fishdex_entries;
create trigger set_user_fishdex_entries_updated_at before update on public.user_fishdex_entries for each row execute function public.set_updated_at();

drop trigger if exists set_signals_updated_at on public.signals;
create trigger set_signals_updated_at before update on public.signals for each row execute function public.set_updated_at();

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();

drop trigger if exists set_ai_classifications_updated_at on public.ai_classifications;
create trigger set_ai_classifications_updated_at before update on public.ai_classifications for each row execute function public.set_updated_at();

alter table public.regions enable row level security;
alter table public.species enable row level security;
alter table public.species_regions enable row level security;
alter table public.catches enable row level security;
alter table public.catch_media enable row level security;
alter table public.user_fishdex_entries enable row level security;
alter table public.signals enable row level security;
alter table public.subscriptions enable row level security;
alter table public.ai_classifications enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Authenticated users can read active regions" on public.regions;
create policy "Authenticated users can read active regions"
  on public.regions
  for select
  to authenticated
  using (deleted_at is null);

drop policy if exists "Authenticated users can read active species" on public.species;
create policy "Authenticated users can read active species"
  on public.species
  for select
  to authenticated
  using (deleted_at is null);

drop policy if exists "Authenticated users can read species regions" on public.species_regions;
create policy "Authenticated users can read species regions"
  on public.species_regions
  for select
  to authenticated
  using (true);

drop policy if exists "Users can read their own catches" on public.catches;
create policy "Users can read their own catches"
  on public.catches
  for select
  to authenticated
  using (auth.uid() = user_id and deleted_at is null);

drop policy if exists "Users can create their own catches" on public.catches;
create policy "Users can create their own catches"
  on public.catches
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own catches" on public.catches;
create policy "Users can update their own catches"
  on public.catches
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their own catch media" on public.catch_media;
create policy "Users can read their own catch media"
  on public.catch_media
  for select
  to authenticated
  using (auth.uid() = user_id and deleted_at is null);

drop policy if exists "Users can create media for their own catches" on public.catch_media;
create policy "Users can create media for their own catches"
  on public.catch_media
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.catches
      where catches.id = catch_media.catch_id
        and catches.user_id = auth.uid()
        and catches.deleted_at is null
    )
  );

drop policy if exists "Users can update their own catch media" on public.catch_media;
create policy "Users can update their own catch media"
  on public.catch_media
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their own fishdex entries" on public.user_fishdex_entries;
create policy "Users can read their own fishdex entries"
  on public.user_fishdex_entries
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own fishdex entries" on public.user_fishdex_entries;
create policy "Users can create their own fishdex entries"
  on public.user_fishdex_entries
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own fishdex entries" on public.user_fishdex_entries;
create policy "Users can update their own fishdex entries"
  on public.user_fishdex_entries
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can read active signals" on public.signals;
create policy "Authenticated users can read active signals"
  on public.signals
  for select
  to authenticated
  using (
    status = 'active'
    and deleted_at is null
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  );

drop policy if exists "Users can read their own subscriptions" on public.subscriptions;
create policy "Users can read their own subscriptions"
  on public.subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id and deleted_at is null);

drop policy if exists "Users can read their own ai classifications" on public.ai_classifications;
create policy "Users can read their own ai classifications"
  on public.ai_classifications
  for select
  to authenticated
  using (auth.uid() = user_id and deleted_at is null);
