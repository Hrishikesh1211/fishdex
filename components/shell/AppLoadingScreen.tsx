import { StyleSheet, View } from "react-native";

import { AppScreen, AppText, LoadingState } from "../ui";
import { spacing } from "../../constants/tokens";

export function AppLoadingScreen() {
  return (
    <AppScreen>
      <View style={styles.content}>
        <View style={styles.copy}>
          <AppText variant="title" weight="bold" align="center">
            FishQuest
          </AppText>
        </View>
        <LoadingState label="Opening" />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: Number.parseInt(spacing[6], 10),
    justifyContent: "center",
  },
  copy: {
    gap: Number.parseInt(spacing[2], 10),
  },
});
