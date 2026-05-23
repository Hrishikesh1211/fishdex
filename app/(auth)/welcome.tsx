import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ShellScreen } from "../../components/shell";
import { AppButton, Card, AppText } from "../../components/ui";
import { routes } from "../../constants/routes";
import { spacing } from "../../constants/tokens";

export default function WelcomeScreen() {
  return (
    <ShellScreen
      eyebrow="Welcome"
      title="Begin beside the water."
      description="Your catches, discoveries, and field notes are kept behind your account."
    >
      <Card elevated>
        <View style={styles.stack}>
          <AppText variant="body" tone="secondary">
            Sign in to continue your FishQuest archive, or create a new journal before the first cast.
          </AppText>
          <Link href={routes.auth.signIn} asChild>
            <AppButton label="Sign In" />
          </Link>
          <Link href={routes.auth.createAccount} asChild>
            <AppButton label="Create Account" variant="secondary" />
          </Link>
        </View>
      </Card>
    </ShellScreen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Number.parseInt(spacing[3], 10),
  },
});
