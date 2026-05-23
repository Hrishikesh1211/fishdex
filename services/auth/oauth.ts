import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { getSupabaseClient } from "../../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogleOAuth() {
  const supabase = getSupabaseClient();
  const redirectTo = Linking.createURL("callback");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.url) {
    throw new Error("Google did not return an auth URL.");
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== "success") {
    throw new Error("Google sign in was cancelled.");
  }

  await completeOAuthSessionFromUrl(result.url);
}

export async function signInWithAppleIdToken() {
  const available = await AppleAuthentication.isAvailableAsync();

  if (!available) {
    throw new Error("Apple Sign In is not available on this device.");
  }

  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );
  const credential = await AppleAuthentication.signInAsync({
    nonce: hashedNonce,
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error("Apple did not return an identity token.");
  }

  const { error } = await getSupabaseClient().auth.signInWithIdToken({
    provider: "apple",
    token: credential.identityToken,
    nonce: rawNonce,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function completeOAuthSessionFromUrl(url: string) {
  const supabase = getSupabaseClient();
  const params = getUrlParams(url);
  const providerError = params.get("error_description") ?? params.get("error");

  if (providerError) {
    throw new Error(providerError);
  }

  const code = params.get("code");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw new Error(error.message);
    }

    return;
  }

  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken || !refreshToken) {
    throw new Error("OAuth response did not include a session.");
  }

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    throw new Error(error.message);
  }
}

function getUrlParams(url: string) {
  const parsed = new URL(url);
  const params = new URLSearchParams(parsed.search);
  const hash = parsed.hash.startsWith("#") ? parsed.hash.slice(1) : parsed.hash;

  new URLSearchParams(hash).forEach((value, key) => {
    params.set(key, value);
  });

  return params;
}
