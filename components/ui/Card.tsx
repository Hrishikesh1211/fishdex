import { type ReactNode } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import { colors, radius, shadows, spacing } from "../../constants/tokens";

type CardProps = ViewProps & {
  children: ReactNode;
  elevated?: boolean;
};

export function Card({ children, elevated = false, style, ...props }: CardProps) {
  return (
    <View
      {...props}
      style={[styles.base, elevated ? styles.elevated : styles.soft, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: Number.parseInt(radius.md, 10),
    borderWidth: 1,
    padding: Number.parseInt(spacing[4], 10),
  },
  elevated: {
    ...shadows.lifted,
    backgroundColor: colors.surfaceElevated,
  },
  soft: {
    ...shadows.soft,
  },
});
