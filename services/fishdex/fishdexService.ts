import { getSupabaseClient } from "../../lib/supabase";
import type { RarityToken } from "../../constants/tokens";

type SpeciesRow = {
  id: string;
  common_name: string;
  scientific_name: string | null;
  description: string | null;
  habitat: string | null;
  rarity: string;
  image_url: string | null;
};

type RegionRow = {
  id: string;
  name: string;
  region_type: string;
};

type SpeciesRegionRow = {
  species_id: string;
  region_id: string;
  presence_status: string;
};

type FishdexEntryRow = {
  species_id: string;
  catch_count: number;
  discovered_at: string;
};

export type FishdexCatalogSpecies = {
  id: string;
  commonName: string;
  scientificName: string | null;
  description: string | null;
  habitat: string | null;
  rarity: RarityToken;
  imageUrl: string | null;
  regionIds: string[];
  regionNames: string[];
  discovered: boolean;
  catchCount: number;
  discoveredAt: string | null;
  locked: boolean;
};

export type FishdexRegion = {
  id: string;
  name: string;
  regionType: string;
  speciesCount: number;
};

export type FishdexCatalog = {
  discoveredCount: number;
  regions: FishdexRegion[];
  species: FishdexCatalogSpecies[];
  totalCount: number;
};

const rarityOrder: Record<RarityToken, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
  mythic: 6,
};

const validRarities: RarityToken[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
];

export async function listFishdexCatalog(userId: string): Promise<FishdexCatalog> {
  const supabase = getSupabaseClient();

  const [speciesResponse, regionsResponse, speciesRegionsResponse, entriesResponse] =
    await Promise.all([
      supabase
        .from("species")
        .select("id, common_name, scientific_name, description, habitat, rarity, image_url")
        .order("common_name", { ascending: true }),
      supabase.from("regions").select("id, name, region_type").order("name", { ascending: true }),
      supabase.from("species_regions").select("species_id, region_id, presence_status"),
      supabase
        .from("user_fishdex_entries")
        .select("species_id, catch_count, discovered_at")
        .eq("user_id", userId),
    ]);

  if (speciesResponse.error) {
    throw new Error(speciesResponse.error.message);
  }

  if (regionsResponse.error) {
    throw new Error(regionsResponse.error.message);
  }

  if (speciesRegionsResponse.error) {
    throw new Error(speciesRegionsResponse.error.message);
  }

  if (entriesResponse.error) {
    throw new Error(entriesResponse.error.message);
  }

  return mapCatalog({
    entries: entriesResponse.data ?? [],
    regions: regionsResponse.data ?? [],
    species: speciesResponse.data ?? [],
    speciesRegions: speciesRegionsResponse.data ?? [],
  });
}

export async function getFishdexSpecies(
  userId: string,
  speciesId: string,
): Promise<FishdexCatalogSpecies | null> {
  const catalog = await listFishdexCatalog(userId);

  return catalog.species.find((species) => species.id === speciesId) ?? null;
}

function mapCatalog({
  entries,
  regions,
  species,
  speciesRegions,
}: {
  entries: FishdexEntryRow[];
  regions: RegionRow[];
  species: SpeciesRow[];
  speciesRegions: SpeciesRegionRow[];
}): FishdexCatalog {
  const regionById = new Map(regions.map((region) => [region.id, region]));
  const entryBySpeciesId = new Map(entries.map((entry) => [entry.species_id, entry]));
  const regionIdsBySpeciesId = new Map<string, string[]>();
  const regionNamesBySpeciesId = new Map<string, string[]>();
  const speciesCountByRegionId = new Map<string, number>();

  speciesRegions.forEach((link) => {
    const region = regionById.get(link.region_id);

    if (!region) {
      return;
    }

    const currentRegionIds = regionIdsBySpeciesId.get(link.species_id) ?? [];
    currentRegionIds.push(region.id);
    regionIdsBySpeciesId.set(link.species_id, currentRegionIds);

    const current = regionNamesBySpeciesId.get(link.species_id) ?? [];
    current.push(region.name);
    regionNamesBySpeciesId.set(link.species_id, current);
    speciesCountByRegionId.set(
      region.id,
      (speciesCountByRegionId.get(region.id) ?? 0) + 1,
    );
  });

  const mappedSpecies = species
    .map<FishdexCatalogSpecies>((row) => {
      const entry = entryBySpeciesId.get(row.id);
      const rarity = normalizeRarity(row.rarity);

      return {
        id: row.id,
        commonName: row.common_name,
        scientificName: row.scientific_name,
        description: row.description,
        habitat: row.habitat,
        rarity,
        imageUrl: row.image_url,
        regionIds: regionIdsBySpeciesId.get(row.id)?.sort() ?? [],
        regionNames: regionNamesBySpeciesId.get(row.id)?.sort() ?? [],
        discovered: Boolean(entry),
        catchCount: entry?.catch_count ?? 0,
        discoveredAt: entry?.discovered_at ?? null,
        locked: !entry,
      };
    })
    .sort((left, right) => {
      if (left.discovered !== right.discovered) {
        return left.discovered ? -1 : 1;
      }

      const rarityDelta = rarityOrder[left.rarity] - rarityOrder[right.rarity];

      if (rarityDelta !== 0) {
        return rarityDelta;
      }

      return left.commonName.localeCompare(right.commonName);
    });

  return {
    discoveredCount: mappedSpecies.filter((item) => item.discovered).length,
    regions: regions
      .map((region) => ({
        id: region.id,
        name: region.name,
        regionType: region.region_type,
        speciesCount: speciesCountByRegionId.get(region.id) ?? 0,
      }))
      .filter((region) => region.speciesCount > 0)
      .sort((left, right) => left.name.localeCompare(right.name)),
    species: mappedSpecies,
    totalCount: mappedSpecies.length,
  };
}

function normalizeRarity(rarity: string): RarityToken {
  return validRarities.includes(rarity as RarityToken) ? (rarity as RarityToken) : "common";
}
