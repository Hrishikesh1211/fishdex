import designTokens from "./design-tokens.json";

export const tokens = designTokens;

export type FishQuestTokens = typeof tokens;
export type ColorToken = keyof typeof tokens.colors;
export type RarityToken = keyof typeof tokens.rarity;
export type TextVariant =
  | "caption"
  | "bodySmall"
  | "body"
  | "bodyLarge"
  | "heading"
  | "title"
  | "display";

export const colors = tokens.colors;
export const rarityColors = tokens.rarity;
export const spacing = tokens.spacing;
export const typography = tokens.typography;
export const radius = tokens.radius;
export const shadows = tokens.shadows.native;
export const motion = tokens.motion;
