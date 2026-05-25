import { StyleSheet, View } from "react-native";

import { ShellScreen } from "../../components/shell";
import { AppButton, Card, AppText, ProgressPill } from "../../components/ui";
import { colors, radius, spacing } from "../../constants/tokens";
import { useAuth } from "../../state/auth";

const profileStats = [
  { label: "Catches", value: "0" },
  { label: "Fish", value: "0" },
  { label: "Regions", value: "0" },
];

const starterAchievements = [
  {
    accent: colors.success,
    detail: "Log your first catch",
    label: "First Catch",
    mark: "1",
    progress: 0,
    total: 1,
  },
  {
    accent: colors.accent,
    detail: "Add a catch photo",
    label: "Photo Keeper",
    mark: "P",
    progress: 0,
    total: 1,
  },
  {
    accent: colors.accentWarm,
    detail: "Discover a new fish",
    label: "New Find",
    mark: "F",
    progress: 0,
    total: 1,
  },
];

export default function ProfileScreen() {
  const { action, profileSyncMessage, profileSyncStatus, signOut, user } = useAuth();
  const isSigningOut = action === "logout";
  const displayName = getDisplayName(user?.user_metadata?.full_name, user?.email);
  const initials = getInitials(displayName);
  const memberSince = getMemberSince(user?.created_at);

  return (
    <ShellScreen
      eyebrow="Profile"
      title={displayName}
      description={memberSince}
    >
      <Card elevated style={styles.identityCard}>
        <View style={styles.identityTop}>
          <View style={styles.avatar}>
            <AppText variant="heading" weight="semibold">
              {initials}
            </AppText>
          </View>
          <View style={styles.identityCopy}>
            <AppText variant="body" weight="semibold">
              Level 1 Explorer
            </AppText>
            <AppText variant="bodySmall" tone="secondary">
              Keep building your FishDex.
            </AppText>
          </View>
        </View>

        <ProgressPill label="Progress" current={0} total={100} style={styles.progress} />

        <View style={styles.statsRow}>
          {profileStats.map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <AppText variant="heading" weight="semibold">
                {stat.value}
              </AppText>
              <AppText variant="caption" tone="muted" weight="semibold">
                {stat.label}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="heading" weight="semibold">
            Achievements
          </AppText>
          <AppText variant="caption" tone="muted" weight="semibold">
            0 / 3
          </AppText>
        </View>

        <View style={styles.achievementStack}>
          {starterAchievements.map((achievement) => (
            <AchievementRow key={achievement.label} {...achievement} />
          ))}
        </View>
      </View>

      <Card style={styles.recentCard}>
        <View style={styles.stack}>
          <View style={styles.sectionHeader}>
            <AppText variant="heading" weight="semibold">
              Recent
            </AppText>
            <AppText variant="caption" tone="muted" weight="semibold">
              Journal
            </AppText>
          </View>
          <View style={styles.emptyRecent}>
            <View style={styles.emptyMark}>
              <AppText variant="body" tone="accent" weight="semibold">
                +
              </AppText>
            </View>
            <View style={styles.emptyCopy}>
              <AppText variant="body" weight="semibold">
                Your first catch will appear here.
              </AppText>
              <AppText variant="bodySmall" tone="secondary">
                Save a catch to start your story.
              </AppText>
            </View>
          </View>
        </View>
      </Card>

      <Card style={styles.accountCard}>
        <View style={styles.stack}>
          <View style={styles.sectionHeader}>
            <AppText variant="heading" weight="semibold">
              Account
            </AppText>
          </View>
          <AppText variant="bodySmall" tone="secondary">
            {user?.email ?? "Signed in with a provider account."}
          </AppText>
          {profileSyncStatus === "schema_missing" || profileSyncStatus === "error" ? (
            <AppText variant="bodySmall" tone="danger">
              {profileSyncMessage}
            </AppText>
          ) : null}
          {profileSyncStatus === "syncing" ? (
            <AppText variant="bodySmall" tone="muted">
              Syncing...
            </AppText>
          ) : null}
          <AppButton
            disabled={isSigningOut}
            label={isSigningOut ? "Signing out..." : "Sign out"}
            onPress={signOut}
            variant="secondary"
          />
        </View>
      </Card>
    </ShellScreen>
  );
}

type AchievementRowProps = {
  accent: string;
  detail: string;
  label: string;
  mark: string;
  progress: number;
  total: number;
};

function AchievementRow({
  accent,
  detail,
  label,
  mark,
  progress,
  total,
}: AchievementRowProps) {
  const percent = total > 0 ? Math.min(Math.max(progress / total, 0), 1) : 0;

  return (
    <View style={styles.achievementRow}>
      <View style={[styles.achievementMark, { borderColor: accent, backgroundColor: `${accent}22` }]}>
        <AppText variant="caption" weight="bold" style={{ color: accent }}>
          {mark}
        </AppText>
      </View>
      <View style={styles.achievementCopy}>
        <View style={styles.achievementTitleRow}>
          <AppText variant="bodySmall" weight="semibold">
            {label}
          </AppText>
          <AppText variant="caption" tone="muted" weight="semibold">
            {progress}/{total}
          </AppText>
        </View>
        <AppText variant="caption" tone="secondary">
          {detail}
        </AppText>
        <View style={styles.achievementTrack}>
          <View style={[styles.achievementFill, { backgroundColor: accent, width: `${percent * 100}%` }]} />
        </View>
      </View>
    </View>
  );
}

function getDisplayName(fullName: unknown, email?: string) {
  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim();
  }

  const emailName = email?.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  return emailName ? titleCase(emailName) : "Explorer";
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "FQ";
}

function getMemberSince(createdAt?: string) {
  if (!createdAt) {
    return "Explorer";
  }

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return "Explorer";
  }

  return `Explorer since ${date.getFullYear()}`;
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const styles = StyleSheet.create({
  accountCard: {
    padding: Number.parseInt(spacing[4], 10),
  },
  achievementCopy: {
    flex: 1,
    gap: Number.parseInt(spacing[1], 10),
    minWidth: 0,
  },
  achievementFill: {
    borderRadius: Number.parseInt(radius.full, 10),
    height: "100%",
  },
  achievementMark: {
    alignItems: "center",
    borderRadius: Number.parseInt(radius.md, 10),
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  achievementRow: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: Number.parseInt(radius.lg, 10),
    borderWidth: 1,
    flexDirection: "row",
    gap: Number.parseInt(spacing[3], 10),
    padding: Number.parseInt(spacing[3], 10),
  },
  achievementStack: {
    gap: Number.parseInt(spacing[2], 10),
  },
  achievementTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  achievementTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: Number.parseInt(radius.full, 10),
    height: 5,
    marginTop: Number.parseInt(spacing[1], 10),
    overflow: "hidden",
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderColor: colors.borderStrong,
    borderRadius: Number.parseInt(radius.full, 10),
    borderWidth: 1,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  emptyCopy: {
    flex: 1,
    gap: Number.parseInt(spacing[1], 10),
  },
  emptyMark: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: Number.parseInt(radius.full, 10),
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  emptyRecent: {
    alignItems: "center",
    flexDirection: "row",
    gap: Number.parseInt(spacing[3], 10),
  },
  identityCard: {
    gap: Number.parseInt(spacing[4], 10),
    padding: Number.parseInt(spacing[4], 10),
  },
  identityCopy: {
    flex: 1,
    gap: Number.parseInt(spacing[1], 10),
  },
  identityTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: Number.parseInt(spacing[4], 10),
  },
  progress: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  recentCard: {
    padding: Number.parseInt(spacing[4], 10),
  },
  section: {
    gap: Number.parseInt(spacing[3], 10),
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stack: {
    gap: Number.parseInt(spacing[3], 10),
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    gap: Number.parseInt(spacing[1], 10),
  },
  statsRow: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    paddingTop: Number.parseInt(spacing[3], 10),
  },
});
