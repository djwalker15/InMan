# RecipeIngredient

> Part of [[Feature 8 - Recipes]]

An ingredient line in a [[RecipeVersion]]. Uses the **enum + child table pattern**: the `ingredient_type` enum declares what kind of ingredient this is, and exactly one child table row exists with the type-specific reference.

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `recipe_ingredient_id` | PK | |
| `recipe_version_id` | FK → [[RecipeVersion]] | |
| `ingredient_type` | enum | `product` \| `product_group` \| `sub_recipe` \| `free_text` |
| `quantity` | numeric | |
| `unit` | text | Resolved via [[UnitDefinition]] for conversion |
| `sort_order` | integer | |
| `notes` | text | e.g., "melted", "room temperature", "divided" |

## Child Tables

Exactly one child row per RecipeIngredient, determined by `ingredient_type`:

| ingredient_type | Child Table | Reference |
|----------------|-------------|-----------|
| `product` | [[RecipeIngredientProductRef]] | `product_id` FK → [[Product]] |
| `product_group` | [[RecipeIngredientGroupRef]] | `product_group_id` FK → [[ProductGroup]] |
| `sub_recipe` | [[RecipeIngredientRecipeRef]] | `sub_recipe_id` FK → [[Recipe]] |
| `free_text` | [[RecipeIngredientFreeText]] | `name` text |

## Behavior by Type

| Type | Cost Calculation | Inventory Deduction at Batch Time |
|------|-----------------|----------------------------------|
| `product` | Uses `last_unit_cost` from matching [[InventoryItem]] | Deducts from specific InventoryItem |
| `product_group` | Average cost across InventoryItems in the group | User prompted to choose (FIFO suggestion) |
| `sub_recipe` | Recursive cost from sub-recipe ingredients | Deducts from sub-recipe output InventoryItem or triggers sub-batch |
| `free_text` | ⚠️ Skipped — cost incomplete | ❌ Blocked — recipe cannot be batched until linked |

## Circular Reference Guard

When `ingredient_type` = `sub_recipe`:
- **App layer** checks before saving — friendly error if cycle detected
- **DB trigger** on [[RecipeIngredientRecipeRef]] fires on INSERT/UPDATE, walks the chain via recursive CTE, raises exception if cycle found

## Immutable

RecipeIngredients and their child rows are never modified after creation — they belong to a frozen [[RecipeVersion]]. New versions create new rows.

## See Also

- [[Journey - Creating a Recipe]] — how ingredients are added
- [[Cost Data Flow]] — ingredient costs are the foundation of recipe cost calculation
- [[UnitDefinition]] — unit conversion
