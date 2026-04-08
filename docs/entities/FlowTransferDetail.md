# FlowTransferDetail

> Child table of [[Flow]] when `flow_type` = `transfer`

Transfer-specific fields for a lateral inventory movement between [[Space]]s.

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `flow_id` | FK → [[Flow]] | PK — one-to-one with parent |
| `from_space_id` | FK → [[Space]] | Where the item was before |
| `to_space_id` | FK → [[Space]] | Where the item moved to |

## Behavior

- Transfer flows don't change quantity — they update `current_space_id` on [[InventoryItem]]
- Provides movement history for [[Feature 5 - Assignment and Location Tracing]]
- Both `from_space_id` and `to_space_id` are required (a transfer always has an origin and destination)

## See Also

- [[Flow]] — parent entity
- [[Journey - Moving Items]] — all five scenarios generate transfer flows
