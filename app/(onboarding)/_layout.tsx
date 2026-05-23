import { Stack } from "expo-router";

import { colors } from "../../constants/tokens";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "fade_from_bottom",
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
