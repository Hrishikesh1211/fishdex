# FishQuest UI System

Last updated: 2026-05-22

## Audit Status

The first FishQuest UI foundation now exists. Design tokens live in `constants/design-tokens.json`, typed token exports live in `constants/tokens.ts`, NativeWind is configured in `tailwind.config.js`, and reusable primitives live under `components/ui/`.

## Aesthetic Direction

FishQuest should feel premium, calm, mysterious, collectible, immersive, modern, minimal, and outdoor-oriented.

Use visual language that suggests water, dusk, field journals, species discovery, quiet maps, and collectible archives. Avoid loud utility-dashboard styling.

FishQuest must not look like a generic AI app. Future AI-assisted fish identification should feel like a subtle field-guide aid inside the FishDex and catch flow, not a chat screen or prompt console.

## Implemented Token System

The token source of truth is `constants/design-tokens.json`. React Native components import typed exports from `constants/tokens.ts`; NativeWind imports the same JSON file in `tailwind.config.js`.

Current token groups:

- `colors`: dark atmospheric surfaces, text, borders, accent, warm accent, status colors, focus, scrim.
- `rarity`: common, uncommon, rare, epic, legendary, mythic.
- `spacing`: 4 px based spacing scale.
- `typography`: family placeholders, sizes, line heights, weights.
- `radius`: none, xs, sm, md, lg, xl, full.
- `shadows`: native iOS-oriented soft/lifted shadows and web equivalents.
- `motion`: instant, fast, base, slow durations.

Future changes must edit the token source instead of scattering hardcoded colors or spacing values through screens.

## Typography System

No custom fonts are installed yet. The implemented foundation uses system typography through the token layer.

Recommended approach:

- Use a high-quality readable sans-serif for app UI.
- Consider an editorial serif or distinctive display face only for selective hero/species moments.
- Keep body text legible on mobile.
- Do not use overly decorative fonts for core workflows.
- Define font tokens before building many screens.

Implemented text variants:

- `display`: rare, large atmospheric moments.
- `title`: screen headers and major cards.
- `heading`: section labels.
- `body`: readable content.
- `caption`: metadata, timestamps, small labels.
- `mono`: coordinates, measurements, technical metadata if needed.

## Color System

Color tokens exist in `constants/design-tokens.json` and are exposed to NativeWind under `fq.*` and rarity colors under `rarity.*`.

Recommended palette behavior:

- Deep aquatic neutrals for structure.
- Muted blue-green accents for water and discovery.
- Warm sunlit accents used sparingly for premium highlights.
- Rarity colors must be controlled and documented.
- Error, success, warning, and info colors must remain accessible.

Avoid one-note palettes dominated by a single hue. The app should not become all navy, all teal, all purple, or all beige.

Implemented color token categories:

- `background`
- `surface`
- `surfaceElevated`
- `textPrimary`
- `textSecondary`
- `textMuted`
- `border`
- `accent`
- `accentSoft`
- `success`
- `warning`
- `danger`
- `rarityCommon`
- `rarityUncommon`
- `rarityRare`
- `rarityLegendary`

Actual rarity token names are `common`, `uncommon`, `rare`, `epic`, `legendary`, and `mythic`.

## Spacing System

Define spacing tokens before production UI work.

Recommended base:

- 4 px micro increments.
- 8 px standard rhythm.
- 16 px default screen padding.
- 24 to 32 px for major section separation.

Keep repeated controls dimensionally stable so labels, icons, counts, and states do not shift layout.

## Motion Philosophy

Motion should be subtle and atmospheric.

Good uses:

- Gentle screen transitions.
- Soft reveal for newly discovered species.
- Small haptic-confirmed interactions.
- Progress transitions.

Avoid:

- Excessive bounce.
- Busy particle effects in core screens.
- Motion that delays logging a catch.
- Game-like noise in serious journaling flows.

## Component Philosophy

- Build small UI primitives first.
- Build feature components from primitives.
- Keep screen files thin.
- Use icons where controls are familiar.
- Use text buttons only for clear commands.
- Avoid nesting cards inside cards.
- Keep cards for repeated items, details, modals, and true framed tools.
- Do not create random one-off visual styles per screen.

## Implemented Components

All components are in `components/ui/` and exported through `components/ui/index.ts`.

- `AppScreen`: safe-area aware dark screen wrapper with optional scrolling and tokenized padding.
- `AppText`: tokenized typography, tone, weight, alignment, and readable scaling.
- `AppButton`: accessible 48 px minimum touch target with primary, secondary, and ghost variants.
- `Card`: tokenized surface container with soft or elevated shadow.
- `RarityBadge`: tokenized rarity indicator that uses both color and text.
- `ProgressPill`: compact progress label and bar with accessible progress text.
- `EmptyState`: calm empty-state container with optional action.
- `LoadingState`: accessible loading row that respects reduced motion by replacing the spinner with a static indicator.

The current app shell uses `components/shell/` for repeated screen layout and tab glyphs. These shell components compose the lower-level `components/ui/` primitives and are not business features.

## Accessibility Rules

- Text must meet contrast requirements.
- Hit targets should be at least 44 x 44 points.
- Controls need labels for screen readers.
- Do not rely on color alone for rarity, status, or errors.
- Support Dynamic Type where practical.
- Avoid tiny metadata text as the only path to important information.
- Modal and sheet flows must be dismissible and navigable.
- Loading states must consider reduced motion.
- Primary touch targets should stay at least 44 points high; current buttons use 48 px minimum height.

## FishQuest UI Rules

- The first screen after auth should feel like a living field journal or discovery hub, not a generic dashboard.
- FishDex progress should feel collectible and mysterious.
- Catch logging must remain fast and calm.
- Species detail pages should prioritize imagery, habitat, rarity, records, and personal discovery status.
- Future Mapbox views should feel like place memory and exploration, not a dense utility map.
- Future AI identification surfaces should always show confidence, allow correction, and preserve a premium discovery tone.
- Empty states should invite exploration without sounding like marketing copy.
- Premium surfaces should feel integrated, not bolted on.

## Anti-Patterns To Avoid

- Utility-first clutter that makes FishQuest feel like spreadsheet software.
- Random gradients, blobs, or decorative shapes that do not represent the product.
- Overly playful cartoon UI for core workflows.
- Generic SaaS landing-page layouts inside the app.
- Generic AI chat/prompt interfaces for species identification.
- Multiple competing button styles.
- Multiple card radius systems.
- Inline styles scattered across screens after tokens exist.
- Inconsistent icons or hand-drawn one-off SVG controls.
- Long instructional text embedded in the app UI.

## UI Consistency Rules

- All colors must come from documented tokens.
- All spacing should use documented scale values.
- Shared primitives should be reused before creating feature-specific variants.
- New UI patterns must be documented here.
- Major visual changes must update screenshots or QA notes when screenshot testing exists.
- Do not create a second token file, theme object, or component primitive set without updating this document and explaining why.
