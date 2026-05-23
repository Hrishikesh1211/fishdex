export type AppEnv = "local" | "staging" | "production";

export type PublicEnv = {
  appEnv: AppEnv;
  supabaseUrl: string;
  supabaseAnonKey: string;
};

type RawPublicEnv = {
  appEnv?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

const validAppEnvs: AppEnv[] = ["local", "staging", "production"];

export class PublicEnvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicEnvError";
  }
}

export function readRawPublicEnv(): RawPublicEnv {
  return {
    appEnv: process.env.EXPO_PUBLIC_APP_ENV,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function validatePublicEnv(rawEnv: RawPublicEnv = readRawPublicEnv()): PublicEnv {
  const missing: string[] = [];

  if (!rawEnv.appEnv) {
    missing.push("EXPO_PUBLIC_APP_ENV");
  }

  if (!rawEnv.supabaseUrl) {
    missing.push("EXPO_PUBLIC_SUPABASE_URL");
  }

  if (!rawEnv.supabaseAnonKey) {
    missing.push("EXPO_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (missing.length > 0) {
    throw new PublicEnvError(
      `Missing required public environment variable(s): ${missing.join(", ")}. Copy .env.example to .env.local and fill in the values.`,
    );
  }

  const appEnv = rawEnv.appEnv;
  const supabaseUrl = rawEnv.supabaseUrl;
  const supabaseAnonKey = rawEnv.supabaseAnonKey;

  if (!appEnv || !supabaseUrl || !supabaseAnonKey) {
    throw new PublicEnvError("Public environment validation failed unexpectedly.");
  }

  if (!validAppEnvs.includes(appEnv as AppEnv)) {
    throw new PublicEnvError(
      `Invalid EXPO_PUBLIC_APP_ENV "${appEnv}". Expected one of: ${validAppEnvs.join(", ")}.`,
    );
  }

  assertValidUrl(supabaseUrl, "EXPO_PUBLIC_SUPABASE_URL");

  if (appEnv === "production" && !supabaseUrl.startsWith("https://")) {
    throw new PublicEnvError("EXPO_PUBLIC_SUPABASE_URL must use https:// in production.");
  }

  if (supabaseAnonKey.trim().length < 20) {
    throw new PublicEnvError(
      "EXPO_PUBLIC_SUPABASE_ANON_KEY looks too short. Use the public anon key from Supabase Dashboard > Project Settings > API.",
    );
  }

  return {
    appEnv: appEnv as AppEnv,
    supabaseUrl,
    supabaseAnonKey,
  };
}

function assertValidUrl(value: string, envName: string) {
  try {
    const parsed = new URL(value);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("unsupported protocol");
    }
  } catch {
    throw new PublicEnvError(`${envName} must be a valid http(s) URL.`);
  }
}
