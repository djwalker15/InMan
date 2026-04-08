# ShoppingListItemRecipeSource

> Child table of [[ShoppingListItem]] when `source_type` = `recipe`

Records that this shopping list item was auto-generated because a [[Recipe]] requires an ingredient the Crew doesn't have.

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `list_item_id` | FK → [[ShoppingListItem]] | PK — one-to-one with parent |
| `recipe_id` | FK → [[Recipe]] | The recipe that needs this ingredient |

## Behavior

- Source link shows context: "Needed for: Simple Syrup recipe"
- If the recipe plan changes, these items can be deprioritized

## See Also

- [[ShoppingListItem]] — parent entity
- [[Journey - Auto-Generated Shopping List]] — recipe needs generate these entries
