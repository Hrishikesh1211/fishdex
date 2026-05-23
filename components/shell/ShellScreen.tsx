import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { AppScreen, AppText } from "../ui";
import { spacing } from "../../constants/tokens";

type ShellScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function ShellScreen({
  eyebrow,
  title,
  description,
  children,
}: ShellScreenProps) {
  return (
    <AppScreen scroll>
      <View style={styles.stack}>
        <View style={styles.hero}>
          <AppText variant="caption" tone="accent" weight="semibold">
            {eyebrow}
          </AppText>
          <AppText variant="display" weight="bold">
            {title}
          </AppText>
          <AppText variant="bodyLarge" tone="secondary">
            {description}
          </AppText>
        </View>
        {children ? <View style={styles.body}>{children}</View> : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Number.parseInt(spacing[4], 10),
  },
  hero: {
    gap: Number.parseInt(spacing[3], 10),
  },
  stack: {
    gap: Number.parseInt(spacing[6], 10),
  },
});
