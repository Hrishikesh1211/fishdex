import { StyleSheet, View } from "react-native";

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
            <AppText variant="display" tone={species.locked ? "muted" : "accent"} weight="bold">
              {species.locked ? "?" : specimenLabel}
            </AppText>
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
                {species.locked ? "Undiscovered species record" : "Scientific name unavailable"}
              </AppText>
            )}
          </View>
        </View>
      </Card>

      <Card>
        <View style={styles.stack}>
          <AppText variant="heading" weight="semibold">
            Field Notes
          </AppText>
          <AppText variant="body" tone="secondary">
            {species.locked
              ? "The full archive entry is still sealed. Log this species later to reveal its field notes, habitat details, and personal records."
              : species.description ?? "No field notes have been added yet."}
          </AppText>
        </View>
      </Card>

      <View style={styles.detailGrid}>
        <DetailBlock
          label="Habitat"
          value={species.locked ? "Hidden until discovery" : species.habitat ?? "Unknown"}
        />
        <DetailBlock
          label="Known Range"
          value={species.regionNames.length > 0 ? species.regionNames.join(", ") : "Unmapped"}
        />
        <DetailBlock
          label="Discovery"
          value={species.discovered ? `${species.catchCount} logged` : "First sighting pending"}
        />
        <DetailBlock
          label="Archive State"
          value={species.locked ? "Locked" : "Open"}
        />
      </View>
    </View>
  );
}

type DetailBlockProps = {
  label: string;
  value: string;
};

function DetailBlock({ label, value }: DetailBlockProps) {
  return (
    <Card style={styles.detailBlock}>
      <AppText variant="caption" tone="muted" weight="semibold">
        {label}
      </AppText>
      <AppText variant="bodySmall" tone="secondary">
        {value}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  detailBlock: {
    flex: 1,
    gap: Number.parseInt(spacing[2], 10),
    minWidth: 140,
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Number.parseInt(spacing[3], 10),
  },
  heroStack: {
    alignItems: "center",
    gap: Number.parseInt(spacing[4], 10),
  },
  scientificName: {
    fontStyle: "italic",
  },
  specimenPlate: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: colors.backgroundRaised,
    borderRadius: Number.parseInt(radius.md, 10),
    borderWidth: 1,
    justifyContent: "center",
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
