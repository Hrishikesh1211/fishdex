import { Image, Pressable, StyleSheet, View } from "react-native";

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
  const regionLabel = species.regionNames[0] ?? "Unknown area";
  const statusLabel = species.discovered
    ? species.catchCount > 1
      ? `${species.catchCount} caught`
      : "Caught"
    : "Not caught";

  const content = (
    <Card elevated={species.discovered} style={species.locked ? styles.lockedCard : undefined}>
      <View style={styles.stack}>
        <View style={styles.row}>
          <View
            accessibilityLabel={`${species.commonName} specimen mark`}
            style={[
              styles.specimen,
              { borderColor: rarityColors[species.rarity] },
              species.locked && styles.specimenLocked,
            ]}
          >
            {species.imageUrl && !species.locked ? (
              <Image
                accessibilityIgnoresInvertColors
                source={{ uri: species.imageUrl }}
                style={styles.specimenImage}
              />
            ) : (
              <View style={[styles.specimenFallback, species.discovered && styles.specimenGlow]}>
                <AppText variant="heading" tone={species.locked ? "muted" : "accent"} weight="bold">
                  {species.locked ? "?" : specimenLabel}
                </AppText>
              </View>
            )}
          </View>

          <View style={styles.copy}>
            <View style={styles.titleRow}>
              <View style={styles.titleStack}>
                <AppText variant="heading" weight="semibold">
                  {species.commonName}
                </AppText>
                <AppText variant="bodySmall" tone={species.locked ? "muted" : "secondary"}>
                  {species.locked ? "Not found yet" : regionLabel}
                </AppText>
              </View>
              <RarityBadge rarity={species.rarity} />
            </View>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, species.discovered && styles.statusDotDiscovered]} />
              <AppText
                variant="caption"
                tone={species.discovered ? "accent" : "muted"}
                weight="semibold"
              >
                {statusLabel}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${species.commonName}`}
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.cardPressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardPressed: {
    opacity: 0.86,
  },
  copy: {
    flex: 1,
    gap: Number.parseInt(spacing[3], 10),
    minWidth: 0,
  },
  lockedCard: {
    opacity: 0.9,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: Number.parseInt(spacing[4], 10),
  },
  specimen: {
    alignItems: "center",
    backgroundColor: colors.backgroundRaised,
    borderRadius: Number.parseInt(radius.lg, 10),
    borderWidth: 1,
    height: 76,
    justifyContent: "center",
    overflow: "hidden",
    width: 86,
  },
  specimenFallback: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: Number.parseInt(radius.full, 10),
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  specimenGlow: {
    borderColor: colors.borderStrong,
    borderWidth: 1,
  },
  specimenImage: {
    height: "100%",
    resizeMode: "cover",
    width: "100%",
  },
  specimenLocked: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  stack: {
    gap: Number.parseInt(spacing[4], 10),
  },
  statusDot: {
    backgroundColor: colors.textMuted,
    borderRadius: Number.parseInt(radius.full, 10),
    height: 7,
    width: 7,
  },
  statusDotDiscovered: {
    backgroundColor: colors.accent,
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: Number.parseInt(spacing[2], 10),
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: Number.parseInt(spacing[3], 10),
    justifyContent: "space-between",
  },
  titleStack: {
    flex: 1,
    gap: Number.parseInt(spacing[1], 10),
    minWidth: 0,
  },
});
