# Fonts

The InMan Figma source uses three foundry fonts:

- **Plus Jakarta Sans** (display + headlines + numerics)
- **Be Vietnam Pro** (body + labels)
- **Manrope** (a small amount of accent body in the hero/landing — used for the "Get started — it's free" CTA and hero details)

All three are available as Google Fonts and are loaded via `@import` in `colors_and_type.css`.
If you need self-hosted .woff2 files, drop them into this folder and replace the @import with `@font-face` blocks.

> **Liberation Serif** appears in a few approximated screens (the "Onboarding: Spaces Intro" screen) and is treated as a Figma rendering artifact — Plus Jakarta Sans is used in its place per the design intent ("editorial" sans).
