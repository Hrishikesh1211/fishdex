import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { AppScreen, AppText } from "../ui";
import { spacing } from "../../constants/tokens";

type ShellScreenProps = {
  eyebrow?: string;
  title: string;
  description?: string;
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
          {eyebrow ? (
            <AppText variant="caption" tone="accent" weight="semibold">
              {eyebrow}
            </AppText>
          ) : null}
          <AppText variant="title" weight="semibold">
            {title}
          </AppText>
          {description ? (
            <AppText variant="body" tone="secondary">
              {description}
            </AppText>
          ) : null}
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
    gap: Number.parseInt(spacing[2], 10),
  },
  stack: {
    gap: Number.parseInt(spacing[5], 10),
  },
});
