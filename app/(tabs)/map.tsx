import { StyleSheet, View } from "react-native";

import { AppText, Card } from "../../components/ui";
import { ShellScreen } from "../../components/shell";
import { colors, radius, spacing } from "../../constants/tokens";

export default function MapScreen() {
  return (
    <ShellScreen
      eyebrow="Map"
      title="Places."
      description="Save waters you want to remember."
    >
      <Card>
        <View style={styles.mapSurface}>
          <View style={styles.waterLine} />
          <View style={styles.pin} />
          <AppText variant="bodySmall" tone="secondary" align="center">
            Your map will appear here.
          </AppText>
        </View>
      </Card>
    </ShellScreen>
  );
}

const styles = StyleSheet.create({
  mapSurface: {
    alignItems: "center",
    backgroundColor: colors.backgroundRaised,
    borderRadius: Number.parseInt(radius.xl, 10),
    gap: Number.parseInt(spacing[5], 10),
    justifyContent: "center",
    minHeight: 260,
    overflow: "hidden",
  },
  pin: {
    backgroundColor: colors.accent,
    borderRadius: Number.parseInt(radius.full, 10),
    height: 10,
    width: 10,
  },
  waterLine: {
    backgroundColor: colors.border,
    borderRadius: Number.parseInt(radius.full, 10),
    height: 2,
    width: "62%",
  },
});
