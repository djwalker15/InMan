# RecipeIngredientProductRef

> Child table of [[RecipeIngredient]] when `ingredient_type` = `product`

Links a recipe ingredient to a specific [[Product]].

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `recipe_ingredient_id` | FK → [[RecipeIngredient]] | PK — one-to-one with parent |
| `product_id` | FK → [[Product]] | The specific product |

## Behavior

- Cost calculation uses `last_unit_cost` from the matching [[InventoryItem]]
- At batch time, deducts from the specific InventoryItem for this Product
- If multiple InventoryItems exist for this Product, user chooses (with FIFO suggestion)

## See Also

- [[RecipeIngredient]] — parent entity
- [[RecipeIngredientGroupRef]] — alternative: generic product group
