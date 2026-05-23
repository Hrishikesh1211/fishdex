import type { Href } from "expo-router";

const route = (href: string) => href as Href;

export const routes = {
  root: route("/"),
  tabs: {
    map: route("/map"),
    fishdex: route("/fishdex"),
    logCatch: route("/log-catch"),
    signals: route("/signals"),
    profile: route("/profile"),
  },
  auth: {
    welcome: route("/welcome"),
    signIn: route("/sign-in"),
    createAccount: route("/create-account"),
  },
  onboarding: {
    premium: route("/premium"),
  },
} as const;

type NestedRouteValues<T> = T extends string
  ? T
  : T extends Record<string, unknown>
    ? NestedRouteValues<T[keyof T]>
    : never;

export type AppRoute = NestedRouteValues<typeof routes>;
