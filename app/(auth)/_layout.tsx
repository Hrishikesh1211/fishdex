import { Redirect, Stack } from "expo-router";

import { AppLoadingScreen } from "../../components/shell";
import { colors } from "../../constants/tokens";
import { routes } from "../../constants/routes";
import { useAuth } from "../../state/auth";

export default function AuthLayout() {
  const { status } = useAuth();

  if (status === "loading") {
    return <AppLoadingScreen />;
  }

  if (status === "authenticated") {
    return <Redirect href={routes.tabs.map} />;
  }

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
