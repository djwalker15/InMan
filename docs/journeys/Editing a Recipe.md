# User Journey: Editing a Recipe

> Covers modifying an existing recipe — metadata updates, ingredient/step changes with versioning, version history, comparison, and revert
> Referenced by [[InMan User Journeys]] #10

---

## Overview

Editing a Recipe uses the **same hybrid layout** as [[Journey - Creating a Recipe]] — all sections visible with a logical top-to-bottom flow. The key difference is **versioning**: changes to ingredients or steps create a new [[RecipeVersion]], while metadata edits (name, description, times) update the [[Recipe]] in place.

This means the recipe always has a clean audit trail of its substance (what goes in, how it's made) while allowing casual metadata updates without cluttering the version history.

---

## Entry Points

| Entry Point | Context |
|-------------|---------|
| **Recipe view page** — "Edit" button | Opens the edit form pre-populated with current version data |
| **After a batch** — "This recipe needs adjusting" | Opens edit form, common after realizing quantities need tweaking |
| **Version history** — "Revert to this version" | Opens edit form pre-populated with the selected historical version's data |

---

## Two Types of Edits

### Metadata Edits (update in place — no new version)

Changes to these fields update the [[Recipe]] record directly:

| Field | Notes |
|-------|-------|
| Name | |
| Description | |
| Prep time | |
| Cook time | |
| Photo | |
| `output_product_id` | Linking or unlinking the output product for store-intent batching |

**On save:** [[Recipe]] updated. No new [[RecipeVersion]] created. `updated_at` refreshed. Success toast: "Recipe updated."

### Substance Edits (create new version)

Changes to any of the following trigger a new [[RecipeVersion]]:

- **Ingredients:** Adding, removing, reordering, changing quantity, changing unit, changing the ingredient reference (swapping a Product for a ProductGroup, linking a free-text ingredient, etc.), changing notes
- **Steps:** Adding, removing, reordering, changing instruction text, adding/removing step photos
- **Yield:** Changing yield quantity or yield unit (these are versioned because they affect cost-per-unit calculations)

The system detects whether substance has changed by comparing the current form state against the current version's data. If only metadata changed, no new version. If substance changed (even one ingredient quantity), new version.

---

## The Edit Form

Same hybrid layout as [[Journey - Creating a Recipe]]:

### Section 1 — Recipe Info (metadata)

Pre-populated from [[Recipe]]. Edits here are metadata — no versioning.

### Section 2 — Ingredients (versioned)

Pre-populated from the current [[RecipeVersion]]'s [[RecipeIngredient]]s (resolved through their child tables). Same interactive list builder as creation:

- Search field with four groups (ProductGroups, Products, Recipes, Create/Unlinked)
- Per-ingredient fields: reference, quantity, unit, notes
- Drag to reorder, remove, add new
- Live cost estimate updates as changes are made

**Key behaviors during edit:**
- Existing ingredients show their current linked state (Product name, ProductGroup name, sub-Recipe name, or ⚠️ unlinked)
- **Linking an unlinked ingredient:** tap the ⚠️ indicator → search field appears → select a Product, ProductGroup, or sub-Recipe. This resolves the free-text to a proper reference.
- **Changing a link:** tap an existing ingredient's reference → search field replaces it → select a new reference. The old child table row will be replaced by a new one in the new version.

### Section 3 — Steps (versioned)

Pre-populated from the current [[RecipeVersion]]'s [[RecipeStep]]s. Same ordered list builder as creation.

### Live Cost Estimate

Same behavior as creation — updates in real-time as ingredients are modified.

---

## Saving

### Save with no substance changes (metadata only)

- [[Recipe]] updated (name, description, times, photo, output_product_id)
- No new [[RecipeVersion]]
- Success toast: "Recipe updated."

### Save with substance changes (new version)

**Step 1 — Change detection:**
System compares the form state against the current version's ingredients, steps, and yield. If any substance has changed, the save will create a new version.

**Step 2 — Auto-generated change summary:**
System generates a human-readable summary of what changed:
- "Added 1 ingredient (Lime Juice)"
- "Removed 1 ingredient (Lemon Juice)"
- "Changed quantity on Sugar: 1 cup → 1.5 cups"
- "Reordered steps"
- "Changed yield: 32 oz → 48 oz"

**Step 3 — Optional user note:**
Prompt: "What did you change? (optional)" — text field for context like "Adjusted sweetness based on customer feedback" or "Doubled the batch size."

**Step 4 — Confirm and save:**

**On save:**
- New [[RecipeVersion]] created (version_number incremented, yield fields snapshot, `change_summary` auto-generated, `change_notes` from user, `created_by` = current user)
- New [[RecipeIngredient]] rows created for all ingredients (linked to the new version), with corresponding child table rows
- New [[RecipeStep]] rows created for all steps (linked to the new version)
- [[Recipe]] `current_version` updated to point to the new version
- Previous version's data is untouched — fully preserved
- Success toast: "Recipe updated — Version [N] created."

---

## Version History

Accessible from the recipe view page — "Version History" button or tab.

### Version List

| Version | Date | By | Changes | Notes |
|---------|------|----|---------|-------|
| **v3 (current)** | Apr 5, 2026 | Davontae | Changed qty on Sugar, added Lime Juice | Adjusted sweetness |
| v2 | Mar 28, 2026 | Davontae | Added step 4, changed yield | Scaled up for Haywire |
| v1 | Mar 20, 2026 | Davontae | — | Initial version |

Each row shows:
- Version number
- Created date
- Created by ([[User]] display name)
- Auto-generated change summary (`change_summary`)
- User note (`change_notes`) if provided

### View a Historical Version

Tapping a version shows its full ingredient list + steps as a read-only view, with the cost estimate calculated for that version's ingredients.

### Compare Versions

Select two versions → side-by-side comparison view:

**Ingredients diff:**

| Ingredient | v2 | v3 | Change |
|------------|----|----|--------|
| Sugar | 1 cup | 1.5 cups | 📝 Changed quantity |
| Lime Juice | — | 1 oz | ➕ Added |
| Lemon Juice | 1 oz | — | ➖ Removed |
| Water | 2 cups | 2 cups | — (unchanged) |

**Steps diff:**
- Added steps highlighted in green
- Removed steps highlighted in red
- Modified steps show old → new text

**Yield diff:**
- "Yield changed: 32 oz → 48 oz"

**Cost diff:**
- "Estimated cost: $4.72 → $5.10 (+$0.38)"

### Revert to a Previous Version

From the version history or comparison view: "Revert to this version" button.

**Flow:**
1. Confirmation: "Revert to Version [N]? This will create a new version (v[current+1]) with the same ingredients and steps as v[N]."
2. Optional change note (pre-filled: "Reverted to version [N]")
3. Confirm

**On revert:**
- New [[RecipeVersion]] created (version_number = current + 1)
- Ingredients and steps are **copied** from the selected historical version (new RecipeIngredient + child table rows, new RecipeStep rows)
- `change_summary` auto-generated: "Reverted to version [N]"
- `change_notes` from user (or pre-filled default)
- [[Recipe]] `current_version` updated to point to the new version
- The reverted-from version is preserved — version history only moves forward

---

## Data Model Changes

[[RecipeVersion]] gains two new fields:

| Field | Type | Notes |
|-------|------|-------|
| `change_summary` | text | Nullable — auto-generated summary of what changed from the previous version. Null for v1. |
| `change_notes` | text | Nullable — optional user-provided note explaining the change. |

---

## Data Model Touchpoints

| Entity | Operation | When |
|--------|-----------|------|
| [[Recipe]] | Read | Pre-populating the edit form |
| [[Recipe]] | Update | Metadata edits (name, description, times, photo, output_product_id) |
| [[RecipeVersion]] | Read | Loading current version's ingredients/steps, version history |
| [[RecipeVersion]] | Insert | New version on substance edit or revert |
| [[RecipeIngredient]] | Read | Loading current ingredients |
| [[RecipeIngredient]] | Insert | New rows for new version |
| RecipeIngredient child tables | Read | Loading ingredient references |
| RecipeIngredient child tables | Insert | New child rows for new version |
| [[RecipeStep]] | Read | Loading current steps |
| [[RecipeStep]] | Insert | New rows for new version |
| [[ProductGroup]] | Read | Ingredient search |
| [[Product]] | Read | Ingredient search, cost lookup |
| [[InventoryItem]] | Read | Live cost estimate |
| [[UnitDefinition]] | Read | Unit dropdowns |

---

## See Also

- [[Journey - Creating a Recipe]] — initial creation (v1), same form layout
- [[RecipeVersion]] — versioning model (updated with `change_summary`, `change_notes`)
- [[RecipeIngredient]] — ingredient rows are per-version (immutable once created)
- [[Journey - Cooking a Meal]] — batching always uses the `current_version`
- [[Journey - Prepping for Storage]] — batching always uses the `current_version`
