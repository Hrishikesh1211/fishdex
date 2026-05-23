import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import { getSupabaseClient } from "../../lib/supabase";
import { signInWithAppleIdToken, signInWithGoogleOAuth } from "../../services/auth/oauth";
import {
  ensureUserProfile,
  type ProfileSyncStatus,
} from "../../services/profiles/profileService";

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";
type AuthAction = "apple" | "email" | "google" | "logout" | "signup" | null;

type AuthResult = {
  ok: boolean;
  message?: string;
  needsEmailConfirmation?: boolean;
};

type EmailCredentials = {
  email: string;
  password: string;
};

type SignUpCredentials = EmailCredentials & {
  displayName?: string;
};

type AuthContextValue = {
  action: AuthAction;
  errorMessage: string | null;
  profileSyncMessage: string | null;
  profileSyncStatus: ProfileSyncStatus;
  session: Session | null;
  signInWithApple: () => Promise<AuthResult>;
  signInWithEmail: (credentials: EmailCredentials) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  signUpWithEmail: (credentials: SignUpCredentials) => Promise<AuthResult>;
  status: AuthStatus;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [action, setAction] = useState<AuthAction>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profileSyncMessage, setProfileSyncMessage] = useState<string | null>(null);
  const [profileSyncStatus, setProfileSyncStatus] = useState<ProfileSyncStatus>("idle");
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const syncProfile = useCallback(async (user: User) => {
    setProfileSyncStatus("syncing");
    setProfileSyncMessage(null);

    const result = await ensureUserProfile(user);

    setProfileSyncStatus(result.status);
    setProfileSyncMessage(result.message ?? null);
  }, []);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    async function restoreSession() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw new Error(error.message);
        }

        if (!active) {
          return;
        }

        setSession(data.session);
        setStatus(data.session ? "authenticated" : "unauthenticated");

        if (data.session?.user) {
          void syncProfile(data.session.user);
        }

        const listener = supabase.auth.onAuthStateChange((_event, nextSession) => {
          if (!active) {
            return;
          }

          setSession(nextSession);
          setStatus(nextSession ? "authenticated" : "unauthenticated");
          setErrorMessage(null);

          if (nextSession?.user) {
            void syncProfile(nextSession.user);
          } else {
            setProfileSyncStatus("idle");
            setProfileSyncMessage(null);
          }
        });

        unsubscribe = () => listener.data.subscription.unsubscribe();
      } catch (error) {
        if (!active) {
          return;
        }

        setSession(null);
        setStatus("error");
        setErrorMessage(getErrorMessage(error));
      }
    }

    void restoreSession();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [syncProfile]);

  const runAuthAction = useCallback(
    async (nextAction: Exclude<AuthAction, null>, task: () => Promise<AuthResult>) => {
      setAction(nextAction);
      setErrorMessage(null);

      try {
        return await task();
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        return { ok: false, message };
      } finally {
        setAction(null);
      }
    },
    [],
  );

  const signInWithEmail = useCallback(
    async ({ email, password }: EmailCredentials) =>
      runAuthAction("email", async () => {
        const { data, error } = await getSupabaseClient().auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          void syncProfile(data.user);
        }

        return { ok: true };
      }),
    [runAuthAction, syncProfile],
  );

  const signUpWithEmail = useCallback(
    async ({ displayName, email, password }: SignUpCredentials) =>
      runAuthAction("signup", async () => {
        const { data, error } = await getSupabaseClient().auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: displayName?.trim() || undefined,
            },
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user && data.session) {
          void syncProfile(data.user);
          return { ok: true };
        }

        return {
          ok: true,
          message: "Check your email to confirm your FishQuest account.",
          needsEmailConfirmation: true,
        };
      }),
    [runAuthAction, syncProfile],
  );

  const signInWithGoogle = useCallback(
    async () =>
      runAuthAction("google", async () => {
        await signInWithGoogleOAuth();
        return { ok: true };
      }),
    [runAuthAction],
  );

  const signInWithApple = useCallback(
    async () =>
      runAuthAction("apple", async () => {
        await signInWithAppleIdToken();
        return { ok: true };
      }),
    [runAuthAction],
  );

  const signOut = useCallback(
    async () =>
      runAuthAction("logout", async () => {
        const { error } = await getSupabaseClient().auth.signOut();

        if (error) {
          throw new Error(error.message);
        }

        setSession(null);
        setStatus("unauthenticated");
        setProfileSyncStatus("idle");
        setProfileSyncMessage(null);

        return { ok: true };
      }),
    [runAuthAction],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      action,
      errorMessage,
      profileSyncMessage,
      profileSyncStatus,
      session,
      signInWithApple,
      signInWithEmail,
      signInWithGoogle,
      signOut,
      signUpWithEmail,
      status,
      user: session?.user ?? null,
    }),
    [
      action,
      errorMessage,
      profileSyncMessage,
      profileSyncStatus,
      session,
      signInWithApple,
      signInWithEmail,
      signInWithGoogle,
      signOut,
      signUpWithEmail,
      status,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
