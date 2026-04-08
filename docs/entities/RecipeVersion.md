# RecipeVersion

> Part of [[Feature 8 - Recipes]]

A frozen snapshot of a [[Recipe]]'s substance (ingredients, steps, yield) at a point in time. Created on each substantive edit to preserve history. Metadata edits (name, description, prep/cook times) update the [[Recipe]] in place and do NOT create a new version.

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `recipe_version_id` | PK | |
| `recipe_id` | FK → [[Recipe]] | |
| `version_number` | integer | Auto-incremented per Recipe |
| `yield_quantity` | numeric | Versioned — affects cost-per-unit |
| `yield_unit` | text | Versioned — affects cost-per-unit |
| `prep_time_minutes` | integer | |
| `cook_time_minutes` | integer | |
| `change_summary` | text | Nullable — auto-generated summary of what changed from the previous version (e.g., "Added 1 ingredient, changed quantity on 2"). Null for v1. |
| `change_notes` | text | Nullable — optional user-provided note explaining the change (e.g., "Adjusted sweetness based on customer feedback"). |
| `created_by` | text FK → [[User]] | Clerk user ID |
| `created_at` | timestamp | |
| `deleted_at` | timestamp | Nullable — soft delete |

## Versioning Rules

A new version is created when any of the following change:
- Ingredients (added, removed, reordered, quantity, unit, reference, notes)
- Steps (added, removed, reordered, instruction text, photos)
- Yield quantity or yield unit

A new version is NOT created for:
- Recipe name, description, prep time, cook time, photo, output_product_id

## Revert

Reverting to a previous version creates a **new version** (v[current+1]) that copies the ingredients and steps from the selected historical version. Version history only moves forward — no version is ever deleted or overwritten.

## Immutable

Once created, a RecipeVersion and its [[RecipeIngredient]]s and [[RecipeStep]]s are never modified. New edits create new versions with new rows.

## Relationships

- Belongs to [[Recipe]]
- Has many [[RecipeIngredient]]s (and their child table rows)
- Has many [[RecipeStep]]s
- Referenced by [[BatchEvent]] — batches point to the exact version used

## See Also

- [[Journey - Editing a Recipe]] — versioning workflow, comparison, revert
- [[Journey - Creating a Recipe]] — creates version 1
