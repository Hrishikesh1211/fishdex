import { StyleSheet, View, type ViewProps } from "react-native";

import {
  colors,
  radius,
  rarityColors,
  spacing,
  type RarityToken,
} from "../../constants/tokens";
import { AppText } from "./AppText";

type RarityBadgeProps = ViewProps & {
  rarity: RarityToken;
};

const rarityLabel: Record<RarityToken, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
  mythic: "Mythic",
};

export function RarityBadge({ rarity, style, ...props }: RarityBadgeProps) {
  return (
    <View
      {...props}
      accessibilityLabel={`${rarityLabel[rarity]} rarity`}
      style={[
        styles.base,
        {
          borderColor: colors.border,
          backgroundColor: colors.surfaceMuted,
        },
        style,
      ]}
    >
      <View
        style={[styles.dot, { backgroundColor: rarityColors[rarity] }]}
      />
      <AppText variant="caption" tone="secondary" weight="semibold">
        {rarityLabel[rarity]}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: Number.parseInt(radius.full, 10),
    borderWidth: 1,
    flexDirection: "row",
    gap: Number.parseInt(spacing[2], 10),
    minHeight: 26,
    paddingHorizontal: Number.parseInt(spacing[3], 10),
  },
  dot: {
    borderRadius: Number.parseInt(radius.full, 10),
    height: 8,
    width: 8,
  },
});
