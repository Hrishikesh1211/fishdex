insert into public.regions (
  id,
  parent_region_id,
  slug,
  name,
  region_type,
  country_code,
  latitude,
  longitude,
  metadata
) values
  (
    '10000000-0000-4000-8000-000000000001',
    null,
    'north-america',
    'North America',
    'continent',
    null,
    48.1667,
    -100.1667,
    '{"starter_catalog": true}'::jsonb
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000001',
    'united-states',
    'United States',
    'country',
    'US',
    39.8283,
    -98.5795,
    '{"starter_catalog": true}'::jsonb
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000002',
    'great-lakes',
    'Great Lakes',
    'waterbody',
    'US',
    45.0522,
    -82.4846,
    '{"starter_catalog": true}'::jsonb
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000002',
    'us-northeast',
    'U.S. Northeast',
    'locality',
    'US',
    42.4072,
    -71.3824,
    '{"starter_catalog": true}'::jsonb
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    '10000000-0000-4000-8000-000000000002',
    'us-southeast',
    'U.S. Southeast',
    'locality',
    'US',
    33.2479,
    -83.4412,
    '{"starter_catalog": true}'::jsonb
  )
on conflict (id) do update set
  parent_region_id = excluded.parent_region_id,
  slug = excluded.slug,
  name = excluded.name,
  region_type = excluded.region_type,
  country_code = excluded.country_code,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  metadata = excluded.metadata,
  updated_at = now(),
  deleted_at = null;

insert into public.species (
  id,
  common_name,
  scientific_name,
  description,
  habitat,
  rarity,
  image_url,
  metadata
) values
  (
    '20000000-0000-4000-8000-000000000001',
    'Largemouth Bass',
    'Micropterus nigricans',
    'A warm-water ambush predator often found near cover, grass edges, docks, and quiet coves.',
    'Lakes, ponds, reservoirs, and slow rivers with vegetation or structure.',
    'common',
    null,
    '{"starter_catalog": true, "tone": "freshwater"}'::jsonb
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    'Smallmouth Bass',
    'Micropterus dolomieu',
    'A bronze, hard-fighting bass associated with clear water, rock, current, and cooler structure.',
    'Clear lakes, rocky rivers, shoals, and gravel bars.',
    'uncommon',
    null,
    '{"starter_catalog": true, "tone": "freshwater"}'::jsonb
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    'Rainbow Trout',
    'Oncorhynchus mykiss',
    'A cold-water salmonid with a luminous side band and a habit of turning clean current into motion.',
    'Cold streams, tailwaters, mountain lakes, and stocked reservoirs.',
    'rare',
    null,
    '{"starter_catalog": true, "tone": "coldwater"}'::jsonb
  ),
  (
    '20000000-0000-4000-8000-000000000004',
    'Channel Catfish',
    'Ictalurus punctatus',
    'A whiskered bottom-feeder built for dusk, scent trails, and deep river bends.',
    'Rivers, reservoirs, farm ponds, and warm lowland lakes.',
    'common',
    null,
    '{"starter_catalog": true, "tone": "freshwater"}'::jsonb
  ),
  (
    '20000000-0000-4000-8000-000000000005',
    'Bluegill',
    'Lepomis macrochirus',
    'A bright panfish and frequent first discovery, often found in sunlit shallows and weedlines.',
    'Ponds, lakes, backwaters, and vegetated shallows.',
    'common',
    null,
    '{"starter_catalog": true, "tone": "freshwater"}'::jsonb
  ),
  (
    '20000000-0000-4000-8000-000000000006',
    'Northern Pike',
    'Esox lucius',
    'A long, toothy hunter that haunts weedbeds and cold edges with sudden speed.',
    'Cool lakes, marshy bays, and slow rivers with aquatic vegetation.',
    'epic',
    null,
    '{"starter_catalog": true, "tone": "predator"}'::jsonb
  ),
  (
    '20000000-0000-4000-8000-000000000007',
    'Walleye',
    'Sander vitreus',
    'A low-light predator prized for its glassy eyes, subtle bite, and evening movement.',
    'Large lakes, reservoirs, rivers, reefs, and wind-swept points.',
    'rare',
    null,
    '{"starter_catalog": true, "tone": "freshwater"}'::jsonb
  ),
  (
    '20000000-0000-4000-8000-000000000008',
    'Red Drum',
    'Sciaenops ocellatus',
    'A coppery coastal fish marked by a dark tail spot and powerful runs across flats and marsh edges.',
    'Estuaries, grass flats, tidal creeks, surf lines, and coastal marsh.',
    'legendary',
    null,
    '{"starter_catalog": true, "tone": "saltwater"}'::jsonb
  )
on conflict (id) do update set
  common_name = excluded.common_name,
  scientific_name = excluded.scientific_name,
  description = excluded.description,
  habitat = excluded.habitat,
  rarity = excluded.rarity,
  image_url = excluded.image_url,
  metadata = excluded.metadata,
  updated_at = now(),
  deleted_at = null;

insert into public.species_regions (
  species_id,
  region_id,
  presence_status
) values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', 'native'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', 'native'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000003', 'native'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000004', 'native'),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000004', 'seasonal'),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'native'),
  ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000002', 'native'),
  ('20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000003', 'native'),
  ('20000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000003', 'native'),
  ('20000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000005', 'native')
on conflict (species_id, region_id) do update set
  presence_status = excluded.presence_status,
  updated_at = now();
