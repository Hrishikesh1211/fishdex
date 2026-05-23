alter table public.catch_media
  alter column storage_bucket set default 'catch-originals',
  add column if not exists thumbnail_storage_bucket text,
  add column if not exists thumbnail_storage_path text,
  add column if not exists thumbnail_width integer,
  add column if not exists thumbnail_height integer,
  add column if not exists mime_type text,
  add column if not exists file_size_bytes integer;

do $$
begin
  alter table public.catch_media
    add constraint catch_media_thumbnail_width_check
    check (thumbnail_width is null or thumbnail_width > 0);
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter table public.catch_media
    add constraint catch_media_thumbnail_height_check
    check (thumbnail_height is null or thumbnail_height > 0);
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter table public.catch_media
    add constraint catch_media_mime_type_check
    check (mime_type is null or mime_type in ('image/jpeg', 'image/png', 'image/webp'));
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter table public.catch_media
    add constraint catch_media_file_size_bytes_check
    check (file_size_bytes is null or (file_size_bytes > 0 and file_size_bytes <= 8388608));
exception
  when duplicate_object then null;
end;
$$;

create index if not exists catch_media_thumbnail_path_idx
  on public.catch_media(thumbnail_storage_bucket, thumbnail_storage_path)
  where thumbnail_storage_path is not null and deleted_at is null;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values
  (
    'catch-originals',
    'catch-originals',
    false,
    8388608,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'catch-thumbnails',
    'catch-thumbnails',
    false,
    1048576,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can read their own catch storage objects" on storage.objects;
create policy "Users can read their own catch storage objects"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id in ('catch-originals', 'catch-thumbnails')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can upload their own catch storage objects" on storage.objects;
create policy "Users can upload their own catch storage objects"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id in ('catch-originals', 'catch-thumbnails')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own catch storage objects" on storage.objects;
create policy "Users can update their own catch storage objects"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id in ('catch-originals', 'catch-thumbnails')
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id in ('catch-originals', 'catch-thumbnails')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own catch storage objects" on storage.objects;
create policy "Users can delete their own catch storage objects"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id in ('catch-originals', 'catch-thumbnails')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
