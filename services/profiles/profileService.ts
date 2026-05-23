import type { User } from "@supabase/supabase-js";

import { getSupabaseClient } from "../../lib/supabase";

export type ProfileSyncStatus = "idle" | "syncing" | "ready" | "schema_missing" | "error";

export type ProfileSyncResult = {
  status: ProfileSyncStatus;
  message?: string;
};

type UserMetadata = {
  display_name?: unknown;
  full_name?: unknown;
  name?: unknown;
  avatar_url?: unknown;
  picture?: unknown;
};

const missingSchemaCodes = new Set(["42P01", "PGRST106", "PGRST205"]);

export async function ensureUserProfile(user: User): Promise<ProfileSyncResult> {
  const supabase = getSupabaseClient();
  const metadata = user.user_metadata as UserMetadata;

  const displayName =
    readString(metadata.display_name) ??
    readString(metadata.full_name) ??
    readString(metadata.name) ??
    fallbackDisplayName(user.email);
  const avatarUrl = readString(metadata.avatar_url) ?? readString(metadata.picture);

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        display_name: displayName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select("id")
    .single();

  if (!error) {
    return { status: "ready" };
  }

  if (missingSchemaCodes.has(error.code)) {
    return {
      status: "schema_missing",
      message: "The profiles table is not available yet. Apply the initial Supabase migration.",
    };
  }

  return {
    status: "error",
    message: error.message,
  };
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function fallbackDisplayName(email?: string) {
  if (!email) {
    return null;
  }

  const [name] = email.split("@");
  return name || null;
}
