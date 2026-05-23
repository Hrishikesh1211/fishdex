const tokens = require("./constants/design-tokens.json");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        fq: tokens.colors,
        rarity: tokens.rarity,
      },
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
      fontSize: tokens.typography.sizes,
      lineHeight: tokens.typography.lineHeights,
      boxShadow: tokens.shadows.web,
      transitionDuration: tokens.motion.duration,
    },
  },
  plugins: [],
};
