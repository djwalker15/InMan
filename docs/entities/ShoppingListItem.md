# ShoppingListItem

> Part of [[Feature 10 - Shopping List]]

A line item on a [[ShoppingList]]. Uses the **enum + child table pattern**: the `source_type` enum declares how this item was added, and a child table row (if applicable) holds the source reference.

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `list_item_id` | PK | |
| `list_id` | FK → [[ShoppingList]] | |
| `product_id` | FK → [[Product]] | |
| `quantity_needed` | numeric | |
| `unit` | text | |
| `source_type` | enum | `manual` \| `low_stock` \| `recipe` \| `meal_plan` |
| `is_checked` | bool | |
| `checked_by` | text FK → [[User]] | Nullable — Clerk user ID |
| `checked_at` | timestamp | Nullable |
| `unit_cost` | numeric | Nullable — captured at purchase |
| `notes` | text | |

## Child Tables

Zero or one child row per ShoppingListItem, determined by `source_type`:

| source_type | Child Table | Reference | Has Child Row? |
|-------------|-------------|-----------|---------------|
| `manual` | — | — | No — user added directly, no source ref |
| `low_stock` | [[ShoppingListItemLowStockSource]] | `inventory_item_id` FK → [[InventoryItem]] | Yes |
| `recipe` | [[ShoppingListItemRecipeSource]] | `recipe_id` FK → [[Recipe]] | Yes |
| `meal_plan` | [[ShoppingListItemBatchSource]] | `batch_id` FK → [[BatchEvent]] | Yes |

## Checkout Flow

When a user checks off an item:
1. System shows existing [[InventoryItem]]s for that [[Product]] within the [[Crew]] (with locations), plus "Create new"
2. If `source_type` = `low_stock`, pre-select the source InventoryItem (from [[ShoppingListItemLowStockSource]]) as the default
3. User confirms target → purchase [[Flow]] + [[FlowPurchaseDetail]] created, cached quantity updated
4. If creating new, user also picks `current_space_id`
5. `unit_cost` captured at time of purchase

## See Also

- [[Journey - Shopping Trip]] — at-the-store checkout flow
- [[Journey - Building a Shopping List]] — manual item addition
- [[Journey - Auto-Generated Shopping List]] — low_stock, recipe, and meal_plan sources
- [[Cost Data Flow]] — `unit_cost` captured at checkout
