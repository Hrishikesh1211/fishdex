import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ShellScreen } from "../../components/shell";
import { AppButton, AppTextInput, Card, AppText } from "../../components/ui";
import { routes } from "../../constants/routes";
import { spacing } from "../../constants/tokens";
import { useAuth } from "../../state/auth";

export default function CreateAccountScreen() {
  const { action, errorMessage, signUpWithEmail } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const isBusy = action !== null;

  async function handleCreateAccount() {
    setFormMessage(null);

    if (!email.trim() || !password) {
      setFormMessage("Enter an email and password to create your account.");
      return;
    }

    if (password.length < 8) {
      setFormMessage("Use at least 8 characters for your password.");
      return;
    }

    const result = await signUpWithEmail({ displayName, email, password });
    setFormMessage(result.message ?? (result.ok ? null : "Account creation failed."));
  }

  return (
    <ShellScreen
      eyebrow="Create Account"
      title="Start a lasting record."
      description="Create the private account that will hold your FishDex progress and catches."
    >
      <Card>
        <View style={styles.stack}>
          <AppTextInput
            autoComplete="name"
            editable={!isBusy}
            onChangeText={setDisplayName}
            placeholder="Display name"
            textContentType="name"
            value={displayName}
          />
          <AppTextInput
            autoCapitalize="none"
            autoComplete="email"
            editable={!isBusy}
            inputMode="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email"
            textContentType="emailAddress"
            value={email}
          />
          <AppTextInput
            autoCapitalize="none"
            autoComplete="new-password"
            editable={!isBusy}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            textContentType="newPassword"
            value={password}
          />
          {formMessage || errorMessage ? (
            <AppText variant="bodySmall" tone={formMessage?.startsWith("Check") ? "secondary" : "danger"}>
              {formMessage ?? errorMessage}
            </AppText>
          ) : null}
          <AppButton
            disabled={isBusy}
            label={action === "signup" ? "Creating..." : "Create Account"}
            onPress={handleCreateAccount}
          />
          <Link href={routes.auth.signIn} asChild>
            <AppButton disabled={isBusy} label="I Already Have an Account" variant="secondary" />
          </Link>
          <Link href={routes.auth.welcome} asChild>
            <AppButton disabled={isBusy} label="Back to Welcome" variant="ghost" />
          </Link>
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
