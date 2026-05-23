import { Redirect } from "expo-router";

import { AppLoadingScreen } from "../components/shell";
import { routes } from "../constants/routes";
import { useAuth } from "../state/auth";

export default function IndexRoute() {
  const { status } = useAuth();

  if (status === "loading") {
    return <AppLoadingScreen />;
  }

  return <Redirect href={status === "authenticated" ? routes.tabs.map : routes.auth.welcome} />;
}
