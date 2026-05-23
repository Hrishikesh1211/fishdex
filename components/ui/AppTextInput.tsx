import { forwardRef } from "react";
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  type TextInput as TextInputRef,
} from "react-native";

import { colors, radius, spacing, typography } from "../../constants/tokens";

type AppTextInputProps = TextInputProps & {
  invalid?: boolean;
};

export const AppTextInput = forwardRef<TextInputRef, AppTextInputProps>(
  ({ invalid, placeholderTextColor = colors.textMuted, style, ...props }, ref) => (
    <TextInput
      {...props}
      ref={ref}
      placeholderTextColor={placeholderTextColor}
      selectionColor={colors.focus}
      style={[styles.input, invalid && styles.invalid, style]}
    />
  ),
);

AppTextInput.displayName = "AppTextInput";

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: Number.parseInt(radius.md, 10),
    borderWidth: 1,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.body,
    fontSize: Number.parseInt(typography.sizes.body, 10),
    lineHeight: Number.parseInt(typography.lineHeights.body, 10),
    minHeight: 48,
    paddingHorizontal: Number.parseInt(spacing[4], 10),
    paddingVertical: Number.parseInt(spacing[3], 10),
  },
  invalid: {
    borderColor: colors.danger,
  },
});
