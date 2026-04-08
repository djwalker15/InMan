# ShoppingListItemBatchSource

> Child table of [[ShoppingListItem]] when `source_type` = `meal_plan`

Records that this shopping list item was auto-generated because a planned [[BatchEvent]] requires ingredients.

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `list_item_id` | FK → [[ShoppingListItem]] | PK — one-to-one with parent |
| `batch_id` | FK → [[BatchEvent]] | The planned batch that needs this ingredient |

## Behavior

- Source link shows context: "Needed for: planned batch of Margaritas (Saturday)"
- If the batch plan is cancelled, these items can be deprioritized

## See Also

- [[ShoppingListItem]] — parent entity
- [[Journey - Auto-Generated Shopping List]] — planned batches generate these entries
