import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ShellScreen } from "../../components/shell";
import { AppButton, Card, AppText } from "../../components/ui";
import { routes } from "../../constants/routes";
import { spacing } from "../../constants/tokens";

export default function PremiumOnboardingScreen() {
  return (
    <ShellScreen
      eyebrow="Premium"
      title="Premium."
      description="More room for your journal."
    >
      <Card>
        <View style={styles.stack}>
          <AppText variant="body" tone="secondary">
            Coming later.
          </AppText>
          <Link href={routes.tabs.profile} asChild>
            <AppButton label="Back" variant="secondary" />
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
