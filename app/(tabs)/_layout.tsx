import { Tabs } from "expo-router";

import { TabGlyph } from "../../components/shell";
import { colors, radius, spacing } from "../../constants/tokens";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="map"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0,
        },
        tabBarStyle: {
          backgroundColor: colors.backgroundRaised,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          minHeight: 78,
          paddingBottom: Number.parseInt(spacing[2], 10),
          paddingTop: Number.parseInt(spacing[2], 10),
        },
        tabBarItemStyle: {
          borderRadius: Number.parseInt(radius.md, 10),
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
        name="log-catch"
        options={{
          title: "Log",
          tabBarAccessibilityLabel: "Log Catch",
          tabBarIcon: ({ focused }) => <TabGlyph name="log" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="signals"
        options={{
          title: "Signals",
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
