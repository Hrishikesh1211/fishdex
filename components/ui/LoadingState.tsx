import { ActivityIndicator, StyleSheet, View, type ViewProps } from "react-native";

import { colors, radius, spacing } from "../../constants/tokens";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { AppText } from "./AppText";

type LoadingStateProps = ViewProps & {
  label?: string;
};

export function LoadingState({
  label = "Preparing the waterline",
  style,
  ...props
}: LoadingStateProps) {
  const reducedMotion = useReducedMotion();

  return (
    <View
      {...props}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      style={[styles.base, style]}
    >
      {reducedMotion ? <View style={styles.staticIndicator} /> : (
        <ActivityIndicator color={colors.accent} />
      )}
      <AppText variant="bodySmall" tone="secondary" weight="medium">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: Number.parseInt(radius.full, 10),
    borderWidth: 1,
    flexDirection: "row",
    gap: Number.parseInt(spacing[3], 10),
    minHeight: 52,
    paddingHorizontal: Number.parseInt(spacing[4], 10),
    paddingVertical: Number.parseInt(spacing[3], 10),
  },
  staticIndicator: {
    backgroundColor: colors.accent,
    borderRadius: Number.parseInt(radius.full, 10),
    height: 12,
    width: 12,
  },
});
