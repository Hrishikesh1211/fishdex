import { Pressable, StyleSheet, View } from "react-native";

import type { FishdexCatalogSpecies } from "../../services/fishdex";
import { colors, radius, rarityColors, spacing } from "../../constants/tokens";
import { AppText, Card, RarityBadge } from "../ui";

type FishdexSpeciesCardProps = {
  onPress?: () => void;
  species: FishdexCatalogSpecies;
};

export function FishdexSpeciesCard({ onPress, species }: FishdexSpeciesCardProps) {
  const specimenLabel = species.commonName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card style={species.locked ? styles.lockedCard : undefined}>
      <View style={styles.stack}>
        <View style={styles.header}>
          <View
            accessibilityLabel={`${species.commonName} specimen mark`}
            style={[
              styles.specimen,
              { borderColor: rarityColors[species.rarity] },
              species.locked && styles.specimenLocked,
            ]}
          >
            <AppText variant="heading" tone={species.locked ? "muted" : "accent"} weight="bold">
              {species.locked ? "?" : specimenLabel}
            </AppText>
          </View>

          <View style={styles.titleStack}>
            <AppText variant="heading" weight="semibold">
              {species.commonName}
            </AppText>
            {species.scientificName && !species.locked ? (
              <AppText variant="bodySmall" tone="muted" style={styles.scientificName}>
                {species.scientificName}
              </AppText>
            ) : species.locked ? (
              <AppText variant="bodySmall" tone="muted">
                Undiscovered record
              </AppText>
            ) : null}
          </View>

          <RarityBadge rarity={species.rarity} />
        </View>

        {species.description && !species.locked ? (
          <AppText variant="body" tone="secondary">
            {species.description}
          </AppText>
        ) : (
          <AppText variant="body" tone="secondary">
            A locked entry. Log this species later to reveal the full field notes.
          </AppText>
        )}

        <View style={styles.metaGrid}>
          <View style={styles.metaBlock}>
            <AppText variant="caption" tone="muted" weight="semibold">
              Habitat
            </AppText>
            <AppText variant="bodySmall" tone="secondary">
              {species.locked ? "Hidden until discovery" : species.habitat ?? "Unknown habitat"}
            </AppText>
          </View>
          <View style={styles.metaBlock}>
            <AppText variant="caption" tone="muted" weight="semibold">
              Regions
            </AppText>
            <AppText variant="bodySmall" tone="secondary">
              {species.regionNames.length > 0 ? species.regionNames.join(", ") : "Unmapped"}
            </AppText>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, species.discovered && styles.statusDotDiscovered]} />
          <AppText variant="caption" tone={species.discovered ? "accent" : "muted"} weight="semibold">
            {species.discovered ? `${species.catchCount} logged` : "First sighting pending"}
          </AppText>
        </View>

        {onPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open ${species.commonName}`}
            onPress={onPress}
            style={({ pressed }) => [styles.openButton, pressed && styles.openButtonPressed]}
          >
            <AppText variant="bodySmall" tone="accent" weight="semibold">
              Open record
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: Number.parseInt(spacing[3], 10),
    justifyContent: "space-between",
  },
  lockedCard: {
    opacity: 0.92,
  },
  metaBlock: {
    backgroundColor: colors.backgroundRaised,
    borderColor: colors.border,
    borderRadius: Number.parseInt(radius.sm, 10),
    borderWidth: 1,
    flex: 1,
    gap: Number.parseInt(spacing[1], 10),
    minWidth: 132,
    padding: Number.parseInt(spacing[3], 10),
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Number.parseInt(spacing[2], 10),
  },
  openButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderColor: colors.borderStrong,
    borderRadius: Number.parseInt(radius.full, 10),
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 36,
    paddingHorizontal: Number.parseInt(spacing[3], 10),
  },
  openButtonPressed: {
    opacity: 0.82,
  },
  scientificName: {
    fontStyle: "italic",
  },
  specimen: {
    alignItems: "center",
    backgroundColor: colors.backgroundRaised,
    borderRadius: Number.parseInt(radius.md, 10),
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  specimenLocked: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  stack: {
    gap: Number.parseInt(spacing[3], 10),
  },
  statusDot: {
    backgroundColor: colors.textMuted,
    borderRadius: Number.parseInt(radius.full, 10),
    height: 8,
    width: 8,
  },
  statusDotDiscovered: {
    backgroundColor: colors.accent,
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: Number.parseInt(spacing[2], 10),
  },
  titleStack: {
    flex: 1,
    gap: Number.parseInt(spacing[1], 10),
  },
});
