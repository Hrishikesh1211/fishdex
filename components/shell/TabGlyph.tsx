import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "../../constants/tokens";

type TabGlyphName = "map" | "fishdex" | "log" | "signals" | "profile";

type TabGlyphProps = {
  name: TabGlyphName;
  focused: boolean;
};

export function TabGlyph({ name, focused }: TabGlyphProps) {
  const color = focused ? colors.accent : colors.textMuted;

  if (name === "log") {
    return (
      <View style={[styles.logBase, { borderColor: color }]}>
        <View style={[styles.logLineHorizontal, { backgroundColor: color }]} />
        <View style={[styles.logLineVertical, { backgroundColor: color }]} />
      </View>
    );
  }

  if (name === "fishdex") {
    return (
      <View style={[styles.book, { borderColor: color }]}>
        <View style={[styles.bookLine, { backgroundColor: color }]} />
      </View>
    );
  }

  if (name === "signals") {
    return (
      <View style={styles.signalStack}>
        <View style={[styles.signalLineLong, { backgroundColor: color }]} />
        <View style={[styles.signalLineShort, { backgroundColor: color }]} />
      </View>
    );
  }

  if (name === "profile") {
    return (
      <View style={styles.profileStack}>
        <View style={[styles.profileHead, { borderColor: color }]} />
        <View style={[styles.profileBody, { backgroundColor: color }]} />
      </View>
    );
  }

  return (
    <View style={[styles.mapRing, { borderColor: color }]}>
      <View style={[styles.mapDot, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  book: {
    borderRadius: Number.parseInt(radius.xs, 10),
    borderWidth: 2,
    height: 22,
    justifyContent: "center",
    paddingHorizontal: Number.parseInt(spacing[1], 10),
    width: 22,
  },
  bookLine: {
    height: 14,
    width: 2,
  },
  logBase: {
    alignItems: "center",
    borderRadius: Number.parseInt(radius.full, 10),
    borderWidth: 2,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  logLineHorizontal: {
    borderRadius: Number.parseInt(radius.full, 10),
    height: 2,
    position: "absolute",
    width: 12,
  },
  logLineVertical: {
    borderRadius: Number.parseInt(radius.full, 10),
    height: 12,
    position: "absolute",
    width: 2,
  },
  mapDot: {
    borderRadius: Number.parseInt(radius.full, 10),
    height: 6,
    width: 6,
  },
  mapRing: {
    alignItems: "center",
    borderRadius: Number.parseInt(radius.full, 10),
    borderWidth: 2,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  profileBody: {
    borderRadius: Number.parseInt(radius.full, 10),
    height: 4,
    width: 18,
  },
  profileHead: {
    borderRadius: Number.parseInt(radius.full, 10),
    borderWidth: 2,
    height: 13,
    width: 13,
  },
  profileStack: {
    alignItems: "center",
    gap: Number.parseInt(spacing[1], 10),
  },
  signalLineLong: {
    borderRadius: Number.parseInt(radius.full, 10),
    height: 3,
    width: 24,
  },
  signalLineShort: {
    alignSelf: "flex-end",
    borderRadius: Number.parseInt(radius.full, 10),
    height: 3,
    width: 15,
  },
  signalStack: {
    gap: Number.parseInt(spacing[2], 10),
    width: 24,
  },
});
