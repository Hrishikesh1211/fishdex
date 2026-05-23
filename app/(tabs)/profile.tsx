import { StyleSheet, View } from "react-native";

import { ShellScreen } from "../../components/shell";
import { AppButton, Card, AppText } from "../../components/ui";
import { spacing } from "../../constants/tokens";
import { useAuth } from "../../state/auth";

export default function ProfileScreen() {
  const { action, profileSyncMessage, profileSyncStatus, signOut, user } = useAuth();
  const isSigningOut = action === "logout";

  return (
    <ShellScreen
      eyebrow="Profile"
      title="Your field journal."
      description="Your account is connected. Membership and journal settings will grow here next."
    >
      <Card elevated>
        <View style={styles.stack}>
          <AppText variant="heading" weight="semibold">
            Account
          </AppText>
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
              Syncing profile...
            </AppText>
          ) : null}
          <AppButton
            disabled={isSigningOut}
            label={isSigningOut ? "Signing Out..." : "Sign Out"}
            onPress={signOut}
            variant="secondary"
          />
        </View>
      </Card>
    </ShellScreen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Number.parseInt(spacing[3], 10),
  },
});
