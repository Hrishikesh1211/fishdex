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
      title="Profile."
      description="Your account and settings."
    >
      <Card>
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

const styles = StyleSheet.create({
  stack: {
    gap: Number.parseInt(spacing[3], 10),
  },
});
