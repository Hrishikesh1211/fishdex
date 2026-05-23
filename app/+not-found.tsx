import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ShellScreen } from "../components/shell";
import { AppButton, Card, AppText } from "../components/ui";
import { routes } from "../constants/routes";
import { spacing } from "../constants/tokens";

export default function NotFoundScreen() {
  return (
    <ShellScreen
      eyebrow="Lost Water"
      title="This route drifted off."
      description="The shell caught an unknown path before it could become a broken screen."
    >
      <Card>
        <View style={styles.stack}>
          <AppText variant="body" tone="secondary">
            Return to the main map shell.
          </AppText>
          <Link href={routes.tabs.map} asChild>
            <AppButton label="Go to Map" />
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
