import { View, StyleSheet } from "react-native";

import { ShellScreen } from "../../components/shell";
import { Card, AppText, ProgressPill, RarityBadge } from "../../components/ui";
import { spacing } from "../../constants/tokens";

export default function FishDexScreen() {
  return (
    <ShellScreen
      eyebrow="FishDex"
      title="The archive is waiting."
      description="A collectible species record will live here once the catalog exists."
    >
      <Card elevated>
        <View style={styles.stack}>
          <View style={styles.row}>
            <RarityBadge rarity="common" />
            <RarityBadge rarity="rare" />
          </View>
          <ProgressPill label="Discovered" current={0} total={64} />
          <AppText variant="bodySmall" tone="muted">
            Species data and discovery state are intentionally not connected yet.
          </AppText>
        </View>
      </Card>
    </ShellScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Number.parseInt(spacing[2], 10),
  },
  stack: {
    gap: Number.parseInt(spacing[4], 10),
  },
});
