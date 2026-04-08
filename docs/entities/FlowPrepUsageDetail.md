# FlowPrepUsageDetail

> Child table of [[Flow]] when `flow_type` = `prep_usage`

Prep-usage-specific fields for ingredient consumption during a [[BatchEvent]].

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `flow_id` | FK → [[Flow]] | PK — one-to-one with parent |
| `batch_id` | FK → [[BatchEvent]] | The batch that consumed this ingredient |

## Behavior

- Links the ingredient deduction back to the specific batch for cost tracking
- `batch_id` enables tracing: "this olive oil was consumed during the Margarita batch on Saturday"
- Generated automatically on batch completion (one per [[BatchInput]])

## See Also

- [[Flow]] — parent entity
- [[BatchEvent]] — the batch that triggered this flow
- [[BatchInput]] — the ingredient record within the batch
- [[Cost Data Flow]] — prep usage flows are part of batch costing
