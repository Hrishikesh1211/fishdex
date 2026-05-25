import { type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors, radius, shadows, spacing } from "../../constants/tokens";
import { AppText } from "./AppText";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type AppButtonVariant = "primary" | "secondary" | "ghost";

type AppButtonProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  variant?: AppButtonVariant;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const variantStyles: Record<AppButtonVariant, ViewStyle> = {
  primary: {
    ...shadows.glow,
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
};

const labelTone: Record<AppButtonVariant, "primary" | "secondary"> = {
  primary: "primary",
  secondary: "primary",
  ghost: "secondary",
};

export function AppButton({
  label,
  variant = "primary",
  icon,
  disabled,
  style,
  accessibilityLabel,
  ...props
}: AppButtonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        disabled && styles.disabled,
        pressed && !disabled && !reducedMotion && styles.pressed,
        style,
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <AppText
        variant="body"
        tone={labelTone[variant]}
        weight="semibold"
        style={variant === "primary" ? styles.primaryLabel : undefined}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: Number.parseInt(radius.full, 10),
    borderWidth: 1,
    flexDirection: "row",
    gap: Number.parseInt(spacing[2], 10),
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: Number.parseInt(spacing[5], 10),
    paddingVertical: Number.parseInt(spacing[3], 10),
  },
  disabled: {
    opacity: 0.46,
  },
  icon: {
    minHeight: 20,
    minWidth: 20,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  primaryLabel: {
    color: colors.background,
  },
});
