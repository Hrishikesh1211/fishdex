import { StyleSheet, View, type ViewProps } from "react-native";

import { colors, radius, shadows, spacing } from "../../constants/tokens";
import { AppText } from "./AppText";

type ProgressPillProps = ViewProps & {
  label: string;
  current: number;
  total: number;
};

export function ProgressPill({
  label,
  current,
  total,
  style,
  ...props
}: ProgressPillProps) {
  const progress = total > 0 ? Math.min(Math.max(current / total, 0), 1) : 0;
  const percent = Math.round(progress * 100);

  return (
    <View
      {...props}
      accessibilityLabel={`${label}: ${current} of ${total}, ${percent} percent`}
      style={[styles.base, style]}
    >
      <View style={styles.labelRow}>
        <AppText variant="caption" tone="secondary" weight="semibold">
          {label}
        </AppText>
        <AppText variant="caption" tone="accent" weight="semibold">
          {current}/{total}
        </AppText>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "transparent",
    borderRadius: Number.parseInt(radius.lg, 10),
    gap: Number.parseInt(spacing[2], 10),
    padding: Number.parseInt(spacing[3], 10),
  },
  fill: {
    ...shadows.glow,
    backgroundColor: colors.accent,
    borderRadius: Number.parseInt(radius.full, 10),
    height: "100%",
  },
  labelRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  track: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: Number.parseInt(radius.full, 10),
    height: 6,
    overflow: "hidden",
  },
});
