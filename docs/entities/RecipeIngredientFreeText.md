# RecipeIngredientFreeText

> Child table of [[RecipeIngredient]] when `ingredient_type` = `free_text`

Stores an unlinked ingredient — typed by the user but not resolved to any [[Product]], [[ProductGroup]], or [[Recipe]].

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `recipe_ingredient_id` | FK → [[RecipeIngredient]] | PK — one-to-one with parent |
| `name` | text | The ingredient name as typed (e.g., "sugar", "a pinch of love") |

## Behavior

- **Cost calculation:** Skipped — marked as "missing cost data"
- **Batching:** Blocked — recipe cannot be batched until this ingredient is linked
- The recipe shows ⚠️ "X ingredients need linking"
- User can resolve later by editing the recipe and linking to a Product, ProductGroup, or sub-Recipe

## See Also

- [[RecipeIngredient]] — parent entity
- [[Journey - Creating a Recipe]] — where free-text ingredients are created
