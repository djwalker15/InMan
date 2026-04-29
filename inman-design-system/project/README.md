# InMan Design System

> **The Curated Larder** — a digital sanctuary for home and bar inventory management.

InMan is an inventory management system tailored to work well in **home kitchens** as much as **commercial bars**. The product organizes physical space hierarchically — Premises → Areas → Sub-sections → Containers — so a Crew (a shared workspace) always knows what they have, where it lives, and what's expiring.

This design system codifies the visual & content language of InMan: warm pantry-paper surfaces, sage-green primary, Plus Jakarta Sans + Be Vietnam Pro typography, ambient (never digital) shadows, and a strict "no-line" rule for sectioning.

---

## Sources

- **Figma:** `InMan Prototype.fig` (mounted as a virtual filesystem in this project)
  - 5 pages: `/Journeys`, `/Screens`, `/Ready`, `/Components`, `/High-Level`
  - The real designs live on `/Screens` (LandingPage, Dashboard, SignIn, SignUp, three Onboarding flows) and `/Components` (Buttons, Inputs, Nav, Onboarding, plus shared symbols).
  - `/High-Level` and `/Journeys` are stubs/roadmap placeholders — no high-fidelity content there.

- **Provided design rationale:** The "Curated Larder" creative brief (see `## Visual Foundations` below).

---

## Index of this folder

| File / folder | What's inside |
|---|---|
| `README.md` | This document — context, content, visuals, iconography, manifest |
| `SKILL.md` | Agent skill manifest (load this design system into Claude Code) |
| `colors_and_type.css` | Single source of truth for color + type tokens (CSS variables + semantic classes) |
| `fonts/README.md` | Font sourcing notes |
| `assets/` | Real raw assets copied from Figma — logo mark, wordmark, hero image, key icons |
| `preview/` | Small HTML cards that populate the Design System tab |
| `ui_kits/inman-app/` | Hi-fi recreation of the InMan mobile app (React/JSX + index.html click-thru). Includes `Icons.jsx` (custom solid icon set) and `Components.jsx` (toggles, chips, list rows, alerts, toasts, search, segmented, stepper, empty state, modal, bottom sheet) |

---

## Content Fundamentals

InMan's voice is **warm, capable, and quietly proud of being organized**. It speaks like a thoughtful host who has done this before — never patronizing, never breathless. Reads like the label on a jar in a well-stocked pantry.

### Core attributes
- **Person:** Second person — *"Know what **you** have. Use what **you** buy."*
- **Casing:** Sentence case for almost all UI copy. Eyebrow labels (`SETUP PROGRESS`, `CREW NAME`, `PREMISES`) are uppercase with letter-spacing — a "labeled jar" device, used sparingly.
- **Tone:** Calm. Confident. Slightly editorial. Never cute or hand-wavy.
- **Punctuation:** Em dashes (`—`) are part of the rhythm. Periods on full sentences. No exclamation points except the single onboarding celebration *"Your pantry is live 🎉"* (the only emoji in the entire product).
- **Length:** Headlines are short and declarative (3–8 words). Subhead/body explains in one sentence, max two. Hint copy is one short clause.

### Tone-and-voice examples (real, from the Figma)

| Surface | Copy |
|---|---|
| Landing hook | *"Know what you have. Use what you buy."* |
| Landing subhead | *"Track your pantry, bar, and every shelf between. Share with the people who share your kitchen."* |
| Landing CTA | *"Get started — it's free"* |
| Dashboard greeting | *"Welcome, Davontae"* |
| Onboarding hero | *"Welcome. Let's get you set up."* |
| Onboarding subhead | *"A Crew is a shared workspace for your inventory. Pick one."* |
| Onboarding hero (Spaces) | *"Let's map your spaces"* |
| Spaces subhead | *"Your pantry, bar, and every shelf between — organized so InMan knows where everything lives."* |
| Crew name hint | *"e.g. Walker Home, Haywire Bar"* — concrete, dual-context (home **and** bar) |
| Reassurance | *"You can rename this later."* |
| Skip link | *"I'm just exploring — skip for now"* / *"I'll explore later"* |
| Tip card | *"Pro Tip: You only need to add the levels that make sense for your space. Skip anything too granular."* |
| Recommendation pill | *"Recommended for first-time users"* |

### Vocabulary
The product has its own light jargon — capitalize these proper nouns when they appear:
- **Crew** — a shared workspace (a household, a bar staff, a prep team)
- **Premises** — the top of the spatial hierarchy (a home, a bar)
- **Area** — a room or zone (Pantry Wall, Upper Cabinet)
- **Sub-section** — a shelf within an area (Top Shelf)
- **Container** — the physical vessel holding items (Glass Jar Set)
- **Spaces** — collective term for the whole hierarchy
- **Items** / **Batches** — what's actually stored

### Emoji & exclamation
**One emoji exists in the product:** 🎉 on the "Your pantry is live" hero card after onboarding success. That's it. Don't add more. Use real iconography for everything else.

---

## Visual Foundations

### The North Star: "The Digital Curator"
The interface should feel like a stack of high-quality paper stocks — not a plastic utility app. **Tonal depth, not strokes.** Boundaries are defined by background color shifts, never 1px borders.

### Color
Rooted in **organic minerals and botanical tones**. See `colors_and_type.css` for tokens.

- **Primary — Sage:** `#31694D` (sage-700) → `#4A8265` (sage-600). Always rendered as a 135° linear gradient on primary CTAs to avoid "flat-button fatigue".
- **Surfaces — Warm Stone (Paper Stack):** `#FDF9F2` (paper-50) → `#F2EEE6` (paper-150, the most-used canvas) → `#EBE8E1` (paper-250). A nested element should always be ±1 tier from its parent.
- **Ink — Near-black:** `#1C1C18` for primary text. **Never `#000000`**, including in shadows.
- **Semantic:** `#BA1A1A` error/expiring, `#D97706` amber for tip/warning, sage for success.

### Surface hierarchy & nesting
Treat the UI as physical paper:
1. **Base** (`surface`, paper-150) — the page canvas.
2. **Subtle group** (`surface-container-low`, paper-100) — soft pillows of related content.
3. **Elevated card** (`surface-container-highest` or pure white) — interactive plinths.
4. Inner containers always sit **one tier higher or lower** than their parent. Two same-tier surfaces never touch.

### The "No-Line" Rule
**Forbidden:** 1px solid borders to section content. Forbidden: horizontal divider lines in lists.
**Allowed fallback:** A "Ghost Border" using `outline-variant` at **15% opacity** when accessibility absolutely requires a boundary. Never 100% opaque.

### Typography
- **Display & Headlines:** Plus Jakarta Sans (700) — geometric, friendly, authoritative. `display-lg` (36/40, -0.9px tracking) for welcome states; `headline-md` (20/28) for category headers.
- **Body & Labels:** Be Vietnam Pro (400/500/700) — exceptional small-scale readability.
- **Eyebrows:** 11px Plus Jakarta Sans Bold uppercase, `0.55px` tracking. The "labeled jar" device — used sparingly.
- **Numbers:** Plus Jakarta Sans for tabular numerics. Distinct, organized.
- **Asymmetric margin trick:** Headlines often get a larger left margin to feel "tabbed" — editorial rhythm, not centered defaults.
- **Font fallback flag:** Liberation Serif appears in the Figma as a rendering artifact in the Spaces-Intro screen. Treat it as Plus Jakarta Sans (the design intent is sans, not serif).

### Elevation & Depth
Light is **organic, not digital**. Stacking surface tiers is the *primary* method of elevation; shadows are secondary.

| Use | Shadow |
|---|---|
| Resting card on paper | `0 1px 2px rgba(0,0,0,0.05)` (`--shadow-ambient-sm`) |
| Floating card | `0 8px 48px rgba(28,28,24,0.06), 0 4px 32px rgba(28,28,24,0.04)` (`--shadow-ambient-lg`) |
| Primary CTA | `0 8px 16px -4px rgba(49,105,77,0.20)` (`--shadow-cta`) — sage-tinted, not grey |
| Sticky CTA hero | `0 8px 20px rgba(74,130,101,0.25)` (`--shadow-cta-strong`) |

**Never** use pure black or default Material drop shadows — they're too aggressive.

### Backgrounds
- **No full-bleed gradients on screens.** The page canvas is always one paper tier.
- **Imagery:** Editorial photography, warm-toned (the hero "modern larder" image). Cropped tight, soft 0–20% black gradient overlay at top to seat type. Never cool, never b&w.
- **No textures, no repeating patterns, no hand-drawn illustrations.** The brand is photographic + typographic.
- **Decorative shapes** (e.g. on the dashboard hero card) appear as 20%-alpha sage circles set against the gradient — quiet, paper-like.

### Animation
The Figma is static, so animation is inferred:
- **Easing:** Soft, organic — `cubic-bezier(0.32, 0.72, 0, 1)` (an iOS-like ease-out) for page transitions; `ease-out` for hovers.
- **Durations:** 180ms for hover, 280ms for press, 320–420ms for sheets/modals.
- **No bounces.** No spring overshoots. The brand rejects "playful" motion in favor of considered.
- **Fades & tonal shifts** over slides and scales.

### Hover states
**Tonal hover, always.** Shift the background by exactly **one tier** (e.g. `surface` → `surface-container-low`). Do not darken with rgba overlays. Do not change opacity. Color stays the same; the paper underneath gets one shade warmer.

### Press / active states
- Buttons: scale to **0.98** with the gradient holding (no color change).
- List rows: jump up another tier (`surface-container-low` → `surface-container`).
- No flash, no ripple.

### Borders
- **Default:** None. Use surface tiers.
- **Ghost border (accessibility fallback only):** `1px solid rgba(192, 201, 193, 0.15)`.
- **Tip/warning cards** are the one place a 1px amber/sage border is acceptable, because they're functional alerts, not container chrome.

### Transparency & blur (glassmorphism)
Used for **floating navigation, sticky CTAs, and modal scrims** — never for resting cards.
- **Bottom nav:** `rgba(253, 249, 242, 0.8)` + `backdrop-filter: blur(16px)` + ghost border on top edge.
- **Sticky CTA tray:** `rgba(253, 249, 242, 0.9)` + `blur(12px)`.
- **Modal scrim:** `blur(20px)` + tinted `rgba(28, 28, 24, 0.4)` — the bg behind a modal is **blurred**, not just dimmed.

### Corner radii
- **8px (`--r-md`):** default — list items, alerts, inputs.
- **12px (`--r-lg`):** cards, buttons, inputs in onboarding (hero feel).
- **9999px (`--r-full`):** progress bars, recommendation pills, avatar/user buttons, icon plinths.
- Always softened — no `0` radius, no perfectly square corners on interactive elements.

### Cards (the "Pantry Item" card)
- Background: `surface-container-lowest` (paper-50) or pure white when sitting on the warmer paper-150 canvas.
- Radius: `12px`.
- Shadow: `--shadow-ambient-lg` if floating, `--shadow-ambient-sm` if resting.
- Padding: `24px`. Generous; cards breathe.
- Internal images: 8px radius — like a label on a container.

### Input fields
- **No "box" inputs.** No outline by default.
- Background: `surface-container-low` at rest.
- Active: background shifts to `surface-container-highest` + a 2px sage **bottom-bar** (not a full ring).
- Radius: `12px`. Padding: `18px 16px`. Font: 16px Be Vietnam Pro.
- Hint text below: 14px, `--ink-500`.

### Layout rules
- **390px** is the canonical mobile width.
- Outer page padding: **24px** horizontal.
- Card-to-card vertical gap: **16–24px**.
- Section-to-section gap: **32–48px** (the brand breathes — don't cram).
- Asymmetric margins: section headers often nudge a few px left of body text.
- Sticky CTA trays sit pinned 24px above the device safe area.

### Imagery vibe
- **Warm.** Cream / cream-yellow / soft amber overall cast.
- **Lived-in.** Real kitchens, real bars — not stock studio shots.
- **Tight crops.** Composition leans on negative space + one focal object (bottles, jars, hands).
- Subtle 0–20% top-down black gradient for type contrast.

---

## Iconography

InMan uses **flat, single-color SVG glyphs** at 16–24px. There is **no icon font** and no icon library import in the Figma — every icon ships as a hand-tuned SVG. They're solid (filled), not outlined, with:

- A 1.5–2 unit visual weight on a 16/20/24 grid.
- One color per icon, usually `--sage-700` for active states or `--ink-600` for inactive.
- Square-ish aspect, no gradients, no multi-tone.

When an icon sits inside a "plinth" (a 32×32 or 48×48 rounded background), the plinth uses `--paper-200` or `rgba(74, 130, 101, 0.1)` (10% sage tint) and the icon centers at sage-700.

### What's in `assets/`
| File | What it is |
|---|---|
| `brand-icon.svg` | The InMan glyph (small, beside the wordmark) — sage |
| `wordmark.svg` | "InMan" wordmark (logotype) — sage |
| `icon-user.svg` | User avatar icon (signed-in nav) |
| `icon-checklist-hero.svg` | Stylized checklist glyph used on the dashboard hero card |
| `hero-larder.png` | The signature editorial larder photograph from the landing page |

### Custom InMan icon set
A custom solid/chunky icon set has been drawn to match the Figma brand-glyph vocabulary. Lives in `ui_kits/inman-app/Icons.jsx` as React components, all 24×24, single-color (`currentColor`), 2.25–2.75 stroke weight where outlined.

**Navigation:** `IconHome`, `IconInventory`, `IconShopping`, `IconBatches`, `IconMore`, `IconBack`, `IconClose`, `IconMenu`, `IconChevronRight`, `IconChevronDown`.
**Actions:** `IconPlus`, `IconSearch`, `IconFilter`, `IconSort`, `IconScan`, `IconCamera`, `IconEdit`, `IconDelete`, `IconShare`, `IconCheck`, `IconClock`, `IconAlert`, `IconInfo`.
**Inventory objects:** `IconBottle`, `IconBox` (more to add as needed).

For anything not yet in the set, fall back to **Phosphor Bold** (filled) or **Lucide stroke-1.5** — and flag the substitution.

### Emoji
Used **once**: 🎉 on the "Your pantry is live" hero card. Do not add others.

### Unicode characters as icons
The em dash (`—`) is used as a decorative joiner in marketing copy ("every shelf between — organized so..."). The bullet (`•`) appears in masked password fields. That's the extent of unicode-as-glyph.

---

## Caveats & substitutions
- **Liberation Serif** from the Figma is treated as a rendering artifact and replaced with Plus Jakarta Sans.
- Icon set is partial — Phosphor Bold + Lucide substituted, flagged above.
- **High-Level** and **Journeys** Figma pages are placeholder stubs — no high-fidelity content.
