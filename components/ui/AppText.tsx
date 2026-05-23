import { Text, type TextProps, StyleSheet, type TextStyle } from "react-native";

import { colors, typography, type TextVariant } from "../../constants/tokens";

type AppTextTone = "primary" | "secondary" | "muted" | "accent" | "warm" | "danger";

type AppTextProps = TextProps & {
  variant?: TextVariant;
  tone?: AppTextTone;
  weight?: keyof typeof typography.weights;
  align?: "auto" | "left" | "right" | "center" | "justify";
};

const toneColor: Record<AppTextTone, string> = {
  primary: colors.textPrimary,
  secondary: colors.textSecondary,
  muted: colors.textMuted,
  accent: colors.accent,
  warm: colors.accentWarm,
  danger: colors.danger,
};

export function AppText({
  variant = "body",
  tone = "primary",
  weight = "regular",
  align,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      allowFontScaling
      style={[
        styles.base,
        {
          color: toneColor[tone],
          fontSize: Number.parseInt(typography.sizes[variant], 10),
          fontWeight: typography.weights[weight] as TextStyle["fontWeight"],
          lineHeight: Number.parseInt(typography.lineHeights[variant], 10),
          textAlign: align,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: typography.fontFamily.body,
    letterSpacing: 0,
  },
});
