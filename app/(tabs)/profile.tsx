import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ShellScreen } from "../../components/shell";
import { AppButton, Card, AppText } from "../../components/ui";
import { routes } from "../../constants/routes";
import { spacing } from "../../constants/tokens";

export default function ProfileScreen() {
  return (
    <ShellScreen
      eyebrow="Profile"
      title="Your field journal."
      description="Account, membership, and identity surfaces are placeholders until auth exists."
    >
      <Card elevated>
        <View style={styles.stack}>
          <AppText variant="heading" weight="semibold">
            Shell routes
          </AppText>
          <AppText variant="bodySmall" tone="secondary">
            These routes are present for navigation testing only.
          </AppText>
          <View style={styles.actions}>
            <Link href={routes.auth.welcome} asChild>
              <AppButton label="Welcome" variant="secondary" />
            </Link>
            <Link href={routes.onboarding.premium} asChild>
              <AppButton label="Premium" variant="ghost" />
            </Link>
          </View>
        </View>
      </Card>
    </ShellScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: Number.parseInt(spacing[3], 10),
  },
  stack: {
    gap: Number.parseInt(spacing[3], 10),
  },
});
