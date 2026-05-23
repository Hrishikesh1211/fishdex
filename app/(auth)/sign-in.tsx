import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ShellScreen } from "../../components/shell";
import { AppButton, AppTextInput, Card, AppText } from "../../components/ui";
import { routes } from "../../constants/routes";
import { spacing } from "../../constants/tokens";
import { useAuth } from "../../state/auth";

export default function SignInScreen() {
  const { action, errorMessage, signInWithApple, signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const isBusy = action !== null;

  async function handleEmailSignIn() {
    setFormMessage(null);

    if (!email.trim() || !password) {
      setFormMessage("Enter your email and password to continue.");
      return;
    }

    const result = await signInWithEmail({ email, password });

    if (!result.ok) {
      setFormMessage(result.message ?? null);
    }
  }

  async function handleAppleSignIn() {
    setFormMessage(null);
    const result = await signInWithApple();

    if (!result.ok) {
      setFormMessage(result.message ?? null);
    }
  }

  async function handleGoogleSignIn() {
    setFormMessage(null);
    const result = await signInWithGoogle();

    if (!result.ok) {
      setFormMessage(result.message ?? null);
    }
  }

  return (
    <ShellScreen
      eyebrow="Sign In"
      title="Return to the archive."
      description="Restore your journal, sightings, and discoveries with Supabase Auth."
    >
      <Card>
        <View style={styles.stack}>
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
            autoComplete="password"
            editable={!isBusy}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            textContentType="password"
            value={password}
          />
          {formMessage || errorMessage ? (
            <AppText variant="bodySmall" tone="danger">
              {formMessage ?? errorMessage}
            </AppText>
          ) : null}
          <AppButton
            disabled={isBusy}
            label={action === "email" ? "Signing In..." : "Sign In with Email"}
            onPress={handleEmailSignIn}
          />
          <AppButton
            disabled={isBusy}
            label={action === "apple" ? "Opening Apple..." : "Continue with Apple"}
            onPress={handleAppleSignIn}
            variant="secondary"
          />
          <AppButton
            disabled={isBusy}
            label={action === "google" ? "Opening Google..." : "Continue with Google"}
            onPress={handleGoogleSignIn}
            variant="secondary"
          />
          <Link href={routes.auth.createAccount} asChild>
            <AppButton disabled={isBusy} label="Create Account" variant="ghost" />
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
