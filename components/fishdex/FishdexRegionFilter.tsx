import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import type { FishdexRegion } from "../../services/fishdex";
import { colors, radius, spacing } from "../../constants/tokens";
import { AppText } from "../ui";

type FishdexRegionFilterProps = {
  regions: FishdexRegion[];
  selectedRegionId: string | null;
  onSelectRegion: (regionId: string | null) => void;
};

export function FishdexRegionFilter({
  regions,
  selectedRegionId,
  onSelectRegion,
}: FishdexRegionFilterProps) {
  return (
    <View style={styles.wrapper}>
      <AppText variant="caption" tone="muted" weight="semibold">
        Region
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FilterChip
          active={selectedRegionId === null}
          label="All waters"
          onPress={() => onSelectRegion(null)}
        />
        {regions.map((region) => (
          <FilterChip
            key={region.id}
            active={selectedRegionId === region.id}
            label={`${region.name} (${region.speciesCount})`}
            onPress={() => onSelectRegion(region.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

type FilterChipProps = {
  active: boolean;
  label: string;
  onPress: () => void;
};

function FilterChip({ active, label, onPress }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.chipPressed,
      ]}
    >
      <AppText variant="bodySmall" tone={active ? "primary" : "secondary"} weight="semibold">
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: Number.parseInt(radius.full, 10),
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: Number.parseInt(spacing[3], 10),
  },
  chipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  chipPressed: {
    opacity: 0.82,
  },
  scrollContent: {
    gap: Number.parseInt(spacing[2], 10),
    paddingRight: Number.parseInt(spacing[4], 10),
  },
  wrapper: {
    gap: Number.parseInt(spacing[2], 10),
  },
});
