import { Image, StyleSheet, View } from "react-native";

import type { FishdexCatalogSpecies } from "../../services/fishdex";
import { colors, radius, rarityColors, spacing } from "../../constants/tokens";
import { AppText, Card, RarityBadge } from "../ui";

type FishdexSpeciesDetailProps = {
  species: FishdexCatalogSpecies;
};

export function FishdexSpeciesDetail({ species }: FishdexSpeciesDetailProps) {
  const specimenLabel = species.commonName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.stack}>
      <Card elevated>
        <View style={styles.heroStack}>
          <View
            style={[
              styles.specimenPlate,
              { borderColor: rarityColors[species.rarity] },
              species.locked && styles.specimenPlateLocked,
            ]}
          >
            {species.imageUrl && !species.locked ? (
              <Image
                accessibilityIgnoresInvertColors
                source={{ uri: species.imageUrl }}
                style={styles.specimenImage}
              />
            ) : (
              <View style={styles.specimenMark}>
                <AppText variant="display" tone={species.locked ? "muted" : "accent"} weight="bold">
                  {species.locked ? "?" : specimenLabel}
                </AppText>
              </View>
            )}
          </View>
          <View style={styles.titleStack}>
            <RarityBadge rarity={species.rarity} />
            <AppText variant="title" weight="bold">
              {species.commonName}
            </AppText>
            {species.scientificName && !species.locked ? (
              <AppText variant="body" tone="muted" style={styles.scientificName}>
                {species.scientificName}
              </AppText>
            ) : (
              <AppText variant="body" tone="secondary">
                {species.locked ? "Not found yet" : "Name unavailable"}
              </AppText>
            )}
          </View>
        </View>
      </Card>

      <Card style={styles.notesCard}>
        <View style={styles.notesStack}>
          <AppText variant="heading" weight="semibold">
            Notes
          </AppText>
          <AppText variant="body" tone="secondary">
            {species.locked
              ? "Catch this fish to fill in the details."
              : species.description ?? "No notes yet."}
          </AppText>
        </View>
      </Card>

      <Card style={styles.factsCard}>
        <DetailRow
          label="Habitat"
          value={species.locked ? "Unknown" : species.habitat ?? "Unknown"}
        />
        <View style={styles.divider} />
        <DetailRow
          label="Range"
          value={species.regionNames.length > 0 ? species.regionNames.join(", ") : "Unmapped"}
        />
        <View style={styles.divider} />
        <DetailRow
          label="Discovered"
          value={species.discovered ? `${species.catchCount} caught` : "Not yet"}
        />
      </Card>
    </View>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <AppText variant="caption" tone="muted" weight="semibold">
        {label}
      </AppText>
      <AppText variant="bodySmall" tone="secondary" style={styles.detailValue}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  detailRow: {
    alignItems: "flex-start",
    gap: Number.parseInt(spacing[2], 10),
  },
  detailValue: {
    maxWidth: "100%",
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    width: "100%",
  },
  factsCard: {
    gap: Number.parseInt(spacing[4], 10),
  },
  heroStack: {
    gap: Number.parseInt(spacing[5], 10),
  },
  notesCard: {
    backgroundColor: colors.surface,
  },
  notesStack: {
    gap: Number.parseInt(spacing[3], 10),
  },
  scientificName: {
    fontStyle: "italic",
  },
  specimenImage: {
    height: "100%",
    resizeMode: "cover",
    width: "100%",
  },
  specimenMark: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderColor: colors.borderStrong,
    borderRadius: Number.parseInt(radius.full, 10),
    borderWidth: 1,
    height: 112,
    justifyContent: "center",
    width: 112,
  },
  specimenPlate: {
    alignItems: "center",
    aspectRatio: 1.18,
    backgroundColor: colors.backgroundRaised,
    borderRadius: Number.parseInt(radius.xl, 10),
    borderWidth: 1,
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
  },
  specimenPlateLocked: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  stack: {
    gap: Number.parseInt(spacing[4], 10),
  },
  titleStack: {
    alignSelf: "stretch",
    gap: Number.parseInt(spacing[2], 10),
  },
});
