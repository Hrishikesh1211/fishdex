import { StyleSheet, View } from "react-native";

import { AppText, Card, ProgressPill } from "../ui";
import { spacing } from "../../constants/tokens";

type FishdexSummaryProps = {
  discoveredCount: number;
  totalCount: number;
};

export function FishdexSummary({ discoveredCount, totalCount }: FishdexSummaryProps) {
  return (
    <Card elevated>
      <View style={styles.stack}>
        <View style={styles.header}>
          <AppText variant="heading" weight="semibold">
            Archive Progress
          </AppText>
          <AppText variant="caption" tone="accent" weight="semibold">
            {discoveredCount}/{totalCount}
          </AppText>
        </View>
        <ProgressPill label="Discovered" current={discoveredCount} total={totalCount} />
        <AppText variant="bodySmall" tone="secondary">
          Seed species are live. Discoveries will unlock from saved catches in the next journal phase.
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stack: {
    gap: Number.parseInt(spacing[3], 10),
  },
});
