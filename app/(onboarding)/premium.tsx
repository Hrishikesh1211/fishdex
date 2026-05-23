import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ShellScreen } from "../../components/shell";
import { AppButton, Card, AppText, RarityBadge } from "../../components/ui";
import { routes } from "../../constants/routes";
import { spacing } from "../../constants/tokens";

export default function PremiumOnboardingScreen() {
  return (
    <ShellScreen
      eyebrow="Premium"
      title="For deeper discovery."
      description="A quiet RevenueCat-ready onboarding shell. Payments are not connected yet."
    >
      <Card elevated>
        <View style={styles.stack}>
          <RarityBadge rarity="legendary" />
          <AppText variant="body" tone="secondary">
            Premium will eventually unlock richer journal memory, FishDex depth, and
            advanced exploration.
          </AppText>
          <Link href={routes.tabs.profile} asChild>
            <AppButton label="Back to Profile" variant="secondary" />
          </Link>
        </View>
      </Card>
    </ShellScreen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Number.parseInt(spacing[4], 10),
  },
});
