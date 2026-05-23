import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { FishdexSpeciesDetail } from "../../../components/fishdex";
import { ShellScreen } from "../../../components/shell";
import { AppButton, EmptyState, LoadingState } from "../../../components/ui";
import { spacing } from "../../../constants/tokens";
import { getFishdexSpecies, type FishdexCatalogSpecies } from "../../../services/fishdex";
import { useAuth } from "../../../state/auth";

export default function FishdexSpeciesDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [species, setSpecies] = useState<FishdexCatalogSpecies | null>(null);

  const loadSpecies = useCallback(async () => {
    if (!user || !id) {
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const nextSpecies = await getFishdexSpecies(user.id, id);
      setSpecies(nextSpecies);
    } catch (error) {
      setSpecies(null);
      setErrorMessage(error instanceof Error ? error.message : "Unable to load this species.");
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    void loadSpecies();
  }, [loadSpecies]);

  return (
    <ShellScreen
      eyebrow="FishDex Record"
      title={species?.commonName ?? "Species record."}
      description="A closer look at this archive entry."
    >
      <View style={styles.actions}>
        <AppButton label="Back to FishDex" onPress={() => router.back()} variant="ghost" />
      </View>

      {loading ? <LoadingState label="Reading the record" /> : null}

      {!loading && errorMessage ? (
        <EmptyState
          title="This record drifted out."
          message={errorMessage}
          actionLabel="Try Again"
          onAction={loadSpecies}
        />
      ) : null}

      {!loading && !errorMessage && !species ? (
        <EmptyState
          title="No record found."
          message="Return to the FishDex and choose another species."
          actionLabel="Back"
          onAction={() => router.back()}
        />
      ) : null}

      {!loading && species ? <FishdexSpeciesDetail species={species} /> : null}
    </ShellScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: "flex-start",
    gap: Number.parseInt(spacing[3], 10),
  },
});
