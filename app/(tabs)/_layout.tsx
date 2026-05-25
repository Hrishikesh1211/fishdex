import { Redirect, Tabs } from "expo-router";

import { AppLoadingScreen, TabGlyph } from "../../components/shell";
import { routes } from "../../constants/routes";
import { colors, radius, shadows, spacing } from "../../constants/tokens";
import { useAuth } from "../../state/auth";

export default function TabsLayout() {
  const { status } = useAuth();

  if (status === "loading") {
    return <AppLoadingScreen />;
  }

  if (status !== "authenticated") {
    return <Redirect href={routes.auth.welcome} />;
  }

  return (
    <Tabs
      initialRouteName="map"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
          letterSpacing: 0,
        },
        tabBarStyle: {
          ...shadows.soft,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: Number.parseInt(radius.xl, 10),
          borderTopColor: colors.border,
          borderTopWidth: 0,
          borderWidth: 1,
          bottom: Number.parseInt(spacing[2], 10),
          height: 60,
          left: Number.parseInt(spacing[3], 10),
          paddingBottom: Number.parseInt(spacing[1], 10),
          paddingTop: Number.parseInt(spacing[1], 10),
          position: "absolute",
          right: Number.parseInt(spacing[3], 10),
        },
        tabBarItemStyle: {
          borderRadius: Number.parseInt(radius.full, 10),
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ focused }) => <TabGlyph name="map" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="fishdex"
        options={{
          title: "FishDex",
          tabBarIcon: ({ focused }) => <TabGlyph name="fishdex" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="fishdex/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="log-catch"
        options={{
          title: "Catch",
          tabBarAccessibilityLabel: "Log Catch",
          tabBarIcon: ({ focused }) => <TabGlyph name="log" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="signals"
        options={{
          title: "Nearby",
          tabBarIcon: ({ focused }) => <TabGlyph name="signals" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabGlyph name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
