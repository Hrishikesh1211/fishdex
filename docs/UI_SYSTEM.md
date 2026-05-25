# FishQuest UI System

Last updated: 2026-05-25

## Audit Status

The FishQuest UI foundation now exists and has received a premium Liftoff-inspired refinement pass. Design tokens live in `constants/design-tokens.json`, typed token exports live in `constants/tokens.ts`, NativeWind is configured in `tailwind.config.js`, and reusable primitives live under `components/ui/`.

## Aesthetic Direction

FishQuest should feel premium, calm, clear, collectible, immersive, modern, minimal, and outdoor-oriented.

Use visual language that suggests Apple-like simplicity, quiet outdoor journaling, dark atmospheric maps, and clean collectible progress. The app should be understandable in under 30 seconds.

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

- Soft off-black/deep navy neutrals for structure.
- One primary soft lavender accent for key actions, selected states, and progress.
- Warm accent used rarely for special collectible moments.
- Rarity colors are small badge accents only, never full card backgrounds.
- Error, success, warning, and info colors must remain accessible.

Use glow sparingly: primary buttons and progress fills may carry subtle accent glow. Avoid heavy gradients, glowing panels, high-saturation screens, or one-note palettes.

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
- `AppButton`: accessible pill-shaped 48 px minimum touch target with primary, secondary, and ghost variants.
- `Card`: spacious glassy rounded surface container with very subtle elevation.
- `RarityBadge`: tokenized rarity indicator that uses both color and text.
- `ProgressPill`: compact progress label and bar with accessible progress text.
- `EmptyState`: calm empty-state container with optional action.
- `LoadingState`: accessible loading row that respects reduced motion by replacing the spinner with a static indicator.
- `AppTextInput`: token-backed form input for auth and future form flows.

The current app shell uses `components/shell/` for repeated screen layout and tab glyphs. These shell components compose the lower-level `components/ui/` primitives and are not business features.

## Navigation Visual System

- The tab bar is a floating, rounded, glassy surface.
- Active tab color uses the primary lavender accent.
- The Catch tab uses a filled accent plus glyph when active.
- Labels stay simple: Map, FishDex, Catch, Nearby, Profile.
- Do not change navigation structure during visual refinement passes.

## FishDex Feature UI

Implemented feature components in `components/fishdex/`:

- `FishdexSummary`: simple collection progress summary using `ProgressPill`.
- `FishdexRegionFilter`: horizontal token-backed region filter chips.
- `FishdexSpeciesCard`: tappable collectible card with a larger specimen tile, rarity badge as a small accent, simple area hint, and caught/not caught state.
- `FishdexSpeciesDetail`: premium specimen-focused detail composition for rarity, notes, habitat, range, and discovered state.

Locked species should feel collectible without feeling confusing. Prefer “Not found yet” over lore-heavy language.

FishDex UI refinement rules:

- Use "Progress", "Rarity", and "Discovered" rather than archive/system language.
- Prefer larger specimen imagery or calm placeholder marks over dense metadata.
- Make rarity visible through badges, dots, borders, and tiny accents only.
- Avoid separate action clutter when the whole species card can be the tap target.
- Keep detail pages quiet: one strong specimen hero, one notes section, one compact facts section.
- Do not let rarity colors become full-card backgrounds.

## Catch Logging Feature UI

The Log Catch screen uses existing primitives rather than a separate form system:

- Cards group one decision at a time: species, photo, time, measurements, notes, privacy, and actions.
- Species and privacy use token-backed pressable choices with selected states.
- Date/time uses quick actions plus editable fields until a native date picker abstraction is introduced.
- Photo selection is visually clear but should stay secondary to quick catch creation until the flow is redesigned intentionally.
- Validation errors are grouped near the final actions and use `AppText` danger tone.

Catch logging should stay calm and field-friendly. Avoid dense utility forms, exact coordinate exposure, noisy gamified feedback during the save flow, or catch-specific inspiration rewrites until the product direction is re-approved.

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
- Empty states should be short and obvious.
- Navigation labels should be familiar: Map, FishDex, Catch, Nearby, Profile.
- Avoid technical/system copy such as “archive state,” “environmental signal,” “classification,” or “sync queue” in user-facing UI.
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
