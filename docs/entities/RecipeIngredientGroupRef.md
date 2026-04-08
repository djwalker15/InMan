# RecipeIngredientGroupRef

> Child table of [[RecipeIngredient]] when `ingredient_type` = `product_group`

Links a recipe ingredient to a [[ProductGroup]] (generic concept like "Sugar").

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `recipe_ingredient_id` | FK → [[RecipeIngredient]] | PK — one-to-one with parent |
| `product_group_id` | FK → [[ProductGroup]] | The generic product group |

## Behavior

- Cost calculation uses the average `last_unit_cost` across [[InventoryItem]]s for [[Product]]s in the group
- At batch time: find all Products in the group → find InventoryItems → prompt user to choose (FIFO suggestion)
- Enables recipe portability — "Sugar" works regardless of brand

## See Also

- [[RecipeIngredient]] — parent entity
- [[ProductGroup]] — the generic product concept
- [[RecipeIngredientProductRef]] — alternative: specific product
