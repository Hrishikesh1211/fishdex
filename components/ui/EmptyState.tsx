import { type ReactNode } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import { colors, radius, spacing } from "../../constants/tokens";
import { AppButton } from "./AppButton";
import { AppText } from "./AppText";

type EmptyStateProps = ViewProps & {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  symbol?: ReactNode;
};

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  symbol,
  style,
  ...props
}: EmptyStateProps) {
  return (
    <View {...props} style={[styles.base, style]}>
      {symbol ? <View style={styles.symbol}>{symbol}</View> : null}
      <View style={styles.copy}>
        <AppText variant="heading" weight="semibold" align="center">
          {title}
        </AppText>
        <AppText variant="body" tone="secondary" align="center">
          {message}
        </AppText>
      </View>
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} variant="secondary" onPress={onAction} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: Number.parseInt(radius.md, 10),
    borderWidth: 1,
    gap: Number.parseInt(spacing[4], 10),
    padding: Number.parseInt(spacing[6], 10),
  },
  copy: {
    gap: Number.parseInt(spacing[2], 10),
  },
  symbol: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: Number.parseInt(radius.full, 10),
    height: 48,
    justifyContent: "center",
    width: 48,
  },
});
