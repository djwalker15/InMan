# InMan Design System — Skill

When the user asks you to design **anything for InMan** (a screen, a flow, marketing material, a product feature), load this design system as your single source of truth.

## Where everything lives

- **`README.md`** — full design rationale: voice, content, color, type, elevation, animation, hover/press, glassmorphism, layout, iconography, caveats. Read this first.
- **`colors_and_type.css`** — every token as a CSS variable. Import as the first stylesheet on every page you build:
  ```html
  <link rel="stylesheet" href="path/to/colors_and_type.css">
  ```
  Use semantic classes (`.display-lg`, `.body-md`, `.label-eyebrow`, etc.) and CSS variables (`var(--sage-700)`, `var(--paper-150)`, `var(--shadow-ambient-lg)`) instead of inlining hex codes.
- **`assets/`** — real brand assets (wordmark, glyph, hero image). Always reference these; do not regenerate logos from scratch.
- **`ui_kits/inman-app/`** — a working hi-fi recreation of the InMan mobile app. The JSX components (`Brand.jsx`, `Buttons.jsx`, `Cards.jsx`, `Onboarding.jsx`, `Dashboard.jsx`, `Screens.jsx`) are the canonical reference for component construction. Open `ui_kits/inman-app/index.html` to see the click-thru.
- **`preview/`** — small standalone HTML cards used by the Design System tab. Each card demonstrates one token group. Useful as copy/paste minimal examples.

## Non-negotiable rules

These are the rules people break first; do not break them.

1. **No 1px container borders.** Define boundaries with surface-tier shifts (`paper-50` ↔ `paper-150` ↔ `paper-250`). The only border allowed: amber on Tip/warning cards.
2. **Never `#000`.** Text is `--ink-900` (`#1C1C18`). Shadows tint warm or sage, never pure black.
3. **Sage CTAs are gradients.** Use `var(--gradient-primary)` (135°, sage-700 → sage-600) on every primary button. Never flat sage.
4. **One emoji.** 🎉 on the "Your pantry is live" hero card. That's it. Do not add others.
5. **Eyebrow labels are tracked-out caps** (Plus Jakarta Sans Bold, +0.55px). Use them sparingly — they are the "labeled jar" device.
6. **Surfaces nest one tier at a time.** A card on `paper-150` should be `paper-50` or pure white; never two `paper-150` surfaces touching.
7. **No textures, patterns, or hand-drawn illustrations.** The brand is photographic + typographic.
8. **Inputs have no box.** Paper-100 fill at rest; on focus, fill shifts to `paper-250` and a 2px sage **bottom bar** appears. No full ring.

## Voice

Warm, capable, second-person. Short declarative headlines (3–8 words). Sentence case for UI; uppercase for eyebrow labels only. Em dashes are part of the rhythm. No exclamation points. Vocabulary is product-specific — capitalize **Crew, Premises, Area, Sub-section, Container, Spaces**.

## Component starting points

When designing a new screen, reach for these from the UI kit before inventing new ones:

- **Layout / nav:** `<NavHeader variant="…">`, `<BottomNav>`, `<ProgressBar>`, `<HierarchyNode>`
- **Buttons & inputs:** `<PrimaryButton>`, `<SecondaryButton>`, `<TextButton>`, `<Field>`, `<SearchBar>`, `<Stepper>`, `<Toggle>`, `<Segmented>`
- **Containers:** `<DecisionCard>`, `<HeroCard>`, `<TipCard>`, `<ListRow>`, `<Modal>`, `<Sheet>`
- **Communication:** `<Alert kind="success|error|info|warn">`, `<Toast>`, `<Chip variant="default|sage|warn|error">`, `<EmptyState>`
- **Icons:** `Icons.jsx` — `IconHome`, `IconInventory`, `IconShopping`, `IconBatches`, `IconMore`, `IconBack`, `IconClose`, `IconMenu`, `IconChevron{Right,Down}`, `IconPlus`, `IconSearch`, `IconFilter`, `IconSort`, `IconScan`, `IconCamera`, `IconEdit`, `IconDelete`, `IconShare`, `IconCheck`, `IconClock`, `IconAlert`, `IconInfo`, `IconBottle`, `IconBox`. All 24×24 by default, accept `size` and `color`.
- Mobile canvas is **390px wide**. Outer padding **24px**. Card padding **24px**. Card-to-card gap **16–24px**. Section-to-section gap **32–48px**.
- Sticky CTA trays use glassmorphism (`rgba(253,249,242,0.9)` + `blur(12px)`).
- Hovers are **tonal** (one tier shift), never opacity changes.
- Press states scale to `0.98`.

## When something is missing

- **Icons:** Figma ships ~10 hand-tuned SVGs. If you need more, substitute **Phosphor Bold** (filled) or **Lucide stroke-1.5** — and tell the user you substituted.
- **Photography:** All product imagery should be warm, lived-in, tight-cropped editorial shots. If you don't have one, leave a placeholder labeled "editorial larder photo — warm cast" rather than generating cool-toned or stock-y stand-ins.
- **Animation:** Static Figma. Use 180ms hovers, 280ms press, 320–420ms sheets. Easing `cubic-bezier(0.32,0.72,0,1)`. No bounces, no springs.

## Caveats

- **Liberation Serif** in the Figma is a rendering artifact — treat all text as Plus Jakarta Sans / Be Vietnam Pro.
- **`/High-Level`** and **`/Journeys`** Figma pages are placeholder stubs.
- The icon set is **partial**; substitutions are flagged in `README.md`.

Read `README.md` for the full rationale before making non-trivial design decisions.
