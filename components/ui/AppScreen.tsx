import { type ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
  type StyleProp,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing } from "../../constants/tokens";

type AppScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function AppScreen({
  children,
  scroll = false,
  padded = true,
  style,
  contentStyle,
}: AppScreenProps) {
  const content = (
    <View style={[padded && styles.content, contentStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.root, style]} edges={["top", "right", "bottom", "left"]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Number.parseInt(spacing[4], 10),
    paddingVertical: Number.parseInt(spacing[6], 10),
    paddingBottom: Number.parseInt(spacing[20], 10),
  },
  scrollContent: {
    flexGrow: 1,
  },
});
