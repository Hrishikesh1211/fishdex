import "react-native-url-polyfill/auto";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { validatePublicEnv } from "../env/publicEnv";
import { supabaseSessionStorage } from "./sessionStorage";
import type { Database } from "../../types/database";

let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const env = validatePublicEnv();

  supabaseClient = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: supabaseSessionStorage,
    },
  });

  return supabaseClient;
}

export function resetSupabaseClientForTests() {
  supabaseClient = null;
}
