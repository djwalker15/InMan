# ShoppingListItemLowStockSource

> Child table of [[ShoppingListItem]] when `source_type` = `low_stock`

Records that this shopping list item was auto-generated because an [[InventoryItem]]'s quantity dropped below `min_stock`.

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `list_item_id` | FK → [[ShoppingListItem]] | PK — one-to-one with parent |
| `inventory_item_id` | FK → [[InventoryItem]] | The item that triggered the low stock alert |

## Behavior

- During checkout, this InventoryItem is pre-suggested as the restock target
- The source link enables prioritization: low_stock items are essential vs. plan-dependent

## See Also

- [[ShoppingListItem]] — parent entity
- [[Journey - Checking Stock]] — low stock alerts that trigger these entries
