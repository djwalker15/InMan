# RecipeIngredientRecipeRef

> Child table of [[RecipeIngredient]] when `ingredient_type` = `sub_recipe`

Links a recipe ingredient to another [[Recipe]] (sub-recipe / nested recipe).

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `recipe_ingredient_id` | FK → [[RecipeIngredient]] | PK — one-to-one with parent |
| `sub_recipe_id` | FK → [[Recipe]] | The recipe whose output is used as an ingredient |

## Behavior

- Cost calculation is recursive — rolls up the sub-recipe's ingredient costs
- At batch time, deducts from InventoryItem of the sub-recipe's output (if it exists in inventory), or can trigger a sub-batch
- **Circular reference guard:** DB trigger on this table prevents cycles (Recipe A → Recipe B → Recipe A)

## See Also

- [[RecipeIngredient]] — parent entity
- [[Recipe]] — the sub-recipe being referenced
