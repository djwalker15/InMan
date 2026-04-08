# FlowPurchaseDetail

> Child table of [[Flow]] when `flow_type` = `purchase`

Purchase-specific fields for an inbound inventory flow.

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `flow_id` | FK → [[Flow]] | PK — one-to-one with parent |
| `unit_cost` | numeric | Nullable — cost per unit at time of purchase |
| `source` | text | Nullable — store/vendor name (e.g., "H-E-B", "Sysco"). Placeholder for future Vendor entity. |

## Behavior

- `unit_cost` updates `last_unit_cost` on the target [[InventoryItem]]
- `source` is a simple text field for now — future purchase order / vendor system will replace it
- Feeds into [[Cost Data Flow]] step 1

## See Also

- [[Flow]] — parent entity
- [[Cost Data Flow]] — purchase flows establish cost
- [[Journey - Adding Inventory]] — creates purchase flows
- [[Journey - Intake Session]] — creates purchase flows on completion
