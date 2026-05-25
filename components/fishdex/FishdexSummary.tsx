import { StyleSheet, View } from "react-native";

import { AppText, Card, ProgressPill } from "../ui";
import { colors, radius, shadows, spacing } from "../../constants/tokens";

type FishdexSummaryProps = {
  discoveredCount: number;
  totalCount: number;
};

export function FishdexSummary({ discoveredCount, totalCount }: FishdexSummaryProps) {
  const percent = totalCount > 0 ? Math.round((discoveredCount / totalCount) * 100) : 0;

  return (
    <Card elevated>
      <View style={styles.stack}>
        <View style={styles.cardContent}>
          <View style={styles.copy}>
            <AppText variant="caption" tone="muted" weight="semibold">
              Your Progress
            </AppText>
            <AppText variant="display" weight="bold">
              {percent}%
            </AppText>
            <AppText variant="bodySmall" tone="secondary">
              {discoveredCount} / {totalCount} discovered
            </AppText>
          </View>
          <View style={styles.specimenRing}>
            <View style={styles.specimenCore}>
              <AppText variant="heading" tone="accent" weight="bold">
                FQ
              </AppText>
            </View>
          </View>
        </View>
        <ProgressPill label="Discovered" current={discoveredCount} total={totalCount} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: Number.parseInt(spacing[5], 10),
    justifyContent: "space-between",
  },
  copy: {
    flex: 1,
    gap: Number.parseInt(spacing[1], 10),
  },
  specimenCore: {
    alignItems: "center",
    backgroundColor: colors.backgroundRaised,
    borderRadius: Number.parseInt(radius.full, 10),
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  specimenRing: {
    ...shadows.glow,
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderRadius: Number.parseInt(radius.full, 10),
    borderWidth: 1,
    height: 88,
    justifyContent: "center",
    width: 88,
  },
  stack: {
    gap: Number.parseInt(spacing[4], 10),
  },
});
