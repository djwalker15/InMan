# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is the **InMan design vault** — Obsidian-based documentation for the InMan inventory management product. There is **no application code in this repo**. The React/Supabase prototype lives in a separate repo (`djwalker15/Inmanprototype`); this vault is where the conceptual data model, features, entities, user journeys, and flow diagrams are designed and kept in sync.

All content lives under `docs/`, which is the Obsidian vault root.

## Read this first

`docs/CLAUDE.md` is the authoritative project brief. It covers the tech stack, auth model (Clerk + Supabase), RLS patterns, every architectural decision (Flow ledger as canonical source, quantity-as-cache, soft deletes, atomic edge functions, unit conversion rules, enum + child table pattern, kiosk auth), the full 43-entity data model, and all 26 user journeys. **Before answering any question about the product, data model, or architecture, read `docs/CLAUDE.md`** — the summaries in individual entity/feature notes are often less current.

Where `docs/CLAUDE.md` and an older note disagree, `docs/CLAUDE.md` wins. It also contains a "Superseded Guidance" section listing decisions that have been reversed.

## Vault layout

```
docs/
├── CLAUDE.md                    # authoritative project brief — start here
├── InMan Data Model.md          # index of all entities/features/journeys (wikilinks)
├── InMan User Journeys.md       # index of all 26 journeys with statuses
├── InMan_ERD.mermaid            # full ERD (mermaid source)
├── entities/                    # 43 entity notes (one markdown file per table)
├── features/                    # 11 feature specs (Feature 1–11)
├── journeys/                    # 24 user-journey notes (2 more absorbed)
├── cross-cutting/               # concerns spanning features (cost flow, user attribution, nullable crew_id)
├── *.canvas                     # Obsidian canvas files — visual journey/flow graphs
└── Edge Review.md               # per-edge annotation table for the v2 canvas
```

Everything outside `docs/` is repo plumbing (`.git`, `.gitignore`, `.claude`, `.env`). The top-level `.gitignore` excludes `.obsidian/` and `.env`, so Obsidian workspace state and secrets stay local.

## How the notes link together

- **Wikilinks** (`[[Flow]]`, `[[Journey - Logging Waste]]`) are the primary cross-reference mechanism. Obsidian resolves them by filename — renaming a note without updating inbound links breaks the graph.
- Entity notes reference the feature(s) they belong to at the top (`> Part of [[Feature 7 - In-Out Flows]]`).
- Feature notes list their entities and the journeys that touch them.
- Journey notes reference the entities they read/write.
- The two index files (`InMan Data Model.md`, `InMan User Journeys.md`) are the table-of-contents and should be updated whenever an entity or journey is added/renamed/absorbed.

## Canvas files and `Edge Review.md`

The `.canvas` files (`User Journeys v2.canvas` is the current one; `User Journeys.canvas` and `InMan Canvas.canvas` are older) are Obsidian canvases — JSON graphs of nodes (markdown cards / file embeds) and edges. `Edge Review.md` is a living table where each edge in `User Journeys v2.canvas` gets a row with **Data Flow** and **UI Detail** annotations. When editing a journey's flow, the canvas edges and the `Edge Review.md` table need to stay in sync.

`InMan_ERD.mermaid` is a standalone mermaid ERD source; keep it consistent with the entity notes when schema decisions change.

## Conventions to preserve when editing

- **`docs/CLAUDE.md` is the source of truth for architecture decisions.** If you change a decision, update it there first, then propagate to the affected entity/feature/journey notes. Do not leave the root brief stale.
- **Entity notes use the enum + child table pattern** for polymorphic references (Flow, RecipeIngredient, ShoppingListItem, WasteEvent). Never introduce nullable FK columns on a parent entity — add a child table instead. See `docs/CLAUDE.md` §"Enum + child tables" for the full rationale.
- **All `user_id` fields are `text`**, not UUID — Clerk uses string IDs. RLS uses `auth.jwt()->>'sub'`, never `auth.uid()`.
- **Soft deletes use `deleted_at`**. The list of mutable-vs-immutable entities in `docs/CLAUDE.md` is definitive — immutable entities (Flow and its children, WasteEvent, BatchInput/Output, RecipeStep, IntakeSession*, UnitDefinition) have `created_at` only.
- **Terminology:** "Space" (not Location) for hierarchy nodes; "location" only refers to `home_space_id` / `current_space_id` on an item. "Crew" is the tenant boundary. "Owner" is distinct from "Admin".

## Working in this repo

There is no build, no tests, and no lint. Edits are markdown and occasional JSON (canvas files). Treat a task as done when the affected notes, the relevant index file, `docs/CLAUDE.md` (if a decision changed), the ERD (if schema changed), and the canvas + `Edge Review.md` (if a journey flow changed) are all consistent.
