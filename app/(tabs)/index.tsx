import { Redirect } from "expo-router";

import { routes } from "../../constants/routes";

export default function TabsIndexRoute() {
  return <Redirect href={routes.tabs.map} />;
}
