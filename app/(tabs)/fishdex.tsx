import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";

import { ShellScreen } from "../../components/shell";
import {
  FishdexRegionFilter,
  FishdexSpeciesCard,
  FishdexSummary,
} from "../../components/fishdex";
import { AppButton, AppText, EmptyState, LoadingState } from "../../components/ui";
import { routes } from "../../constants/routes";
import { spacing } from "../../constants/tokens";
import { listFishdexCatalog, type FishdexCatalog } from "../../services/fishdex";
import { useAuth } from "../../state/auth";

export default function FishDexScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [catalog, setCatalog] = useState<FishdexCatalog | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    if (!user) {
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const nextCatalog = await listFishdexCatalog(user.id);
      setCatalog(nextCatalog);
    } catch (error) {
      setCatalog(null);
      setErrorMessage(error instanceof Error ? error.message : "Unable to load the FishDex.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const filteredSpecies = useMemo(() => {
    if (!catalog || !selectedRegionId) {
      return catalog?.species ?? [];
    }

    return catalog.species.filter((species) => species.regionIds.includes(selectedRegionId));
  }, [catalog, selectedRegionId]);

  const selectedRegionName =
    catalog?.regions.find((region) => region.id === selectedRegionId)?.name ?? "All fish";

  return (
    <ShellScreen
      eyebrow="FishDex"
      title="FishDex"
      description="Catch fish. Fill your collection."
    >
      {loading ? <LoadingState label="Opening the FishDex" /> : null}

      {!loading && errorMessage ? (
        <EmptyState
          title="Can't load FishDex."
          message={errorMessage}
          actionLabel="Try Again"
          onAction={loadCatalog}
        />
      ) : null}

      {!loading && catalog && catalog.totalCount === 0 ? (
        <EmptyState
          title="No fish yet."
          message="Add the starter fish to begin."
          actionLabel="Refresh"
          onAction={loadCatalog}
        />
      ) : null}

      {!loading && catalog && catalog.totalCount > 0 ? (
        <View style={styles.stack}>
          <FishdexSummary
            discoveredCount={catalog.discoveredCount}
            totalCount={catalog.totalCount}
          />
          <View style={styles.sectionHeader}>
            <AppText variant="heading" weight="semibold">
              {selectedRegionName}
            </AppText>
            <AppButton label="Refresh" onPress={loadCatalog} variant="ghost" style={styles.refresh} />
          </View>
          <FishdexRegionFilter
            regions={catalog.regions}
            selectedRegionId={selectedRegionId}
            onSelectRegion={setSelectedRegionId}
          />
          {filteredSpecies.map((species) => (
            <FishdexSpeciesCard
              key={species.id}
              species={species}
              onPress={() => router.push(routes.tabs.fishdexSpecies(species.id))}
            />
          ))}
          {filteredSpecies.length === 0 ? (
            <EmptyState
              title="Nothing here yet."
              message="Try another area."
            />
          ) : null}
        </View>
      ) : null}
    </ShellScreen>
  );
}

const styles = StyleSheet.create({
  refresh: {
    minHeight: 44,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: Number.parseInt(spacing[3], 10),
    justifyContent: "space-between",
  },
  stack: {
    gap: Number.parseInt(spacing[4], 10),
  },
});
