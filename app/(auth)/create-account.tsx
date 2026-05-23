import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ShellScreen } from "../../components/shell";
import { AppButton, Card, AppText } from "../../components/ui";
import { routes } from "../../constants/routes";
import { spacing } from "../../constants/tokens";

export default function CreateAccountScreen() {
  return (
    <ShellScreen
      eyebrow="Create Account"
      title="Start a lasting record."
      description="This route reserves the account creation flow before real auth exists."
    >
      <Card>
        <View style={styles.stack}>
          <AppText variant="body" tone="secondary">
            Account creation will be implemented after auth architecture lands.
          </AppText>
          <Link href={routes.auth.signIn} asChild>
            <AppButton label="I Already Have an Account" variant="secondary" />
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
