import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ShellScreen } from "../../components/shell";
import { AppButton, Card, AppText } from "../../components/ui";
import { routes } from "../../constants/routes";
import { spacing } from "../../constants/tokens";

export default function SignInScreen() {
  return (
    <ShellScreen
      eyebrow="Sign In"
      title="Return to the archive."
      description="This route is a placeholder for Supabase and Apple/Google auth."
    >
      <Card>
        <View style={styles.stack}>
          <AppText variant="body" tone="secondary">
            No credentials are collected in this shell.
          </AppText>
          <Link href={routes.auth.createAccount} asChild>
            <AppButton label="Create Account" variant="secondary" />
          </Link>
          <Link href={routes.auth.welcome} asChild>
            <AppButton label="Back to Welcome" variant="ghost" />
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
