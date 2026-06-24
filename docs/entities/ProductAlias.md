# ProductAlias

> Part of [[Feature 3 - Item Catalog]], [[Feature 4 - Inventory Level Tracking]]

A learned mapping from a receipt's abbreviated line text to a catalog [[Product]]. Created when a [[Crew]] confirms which product a scanned receipt line refers to (see [[Journey - Adding Inventory]] — Method 5). On the next receipt that prints the same raw text, the line auto-resolves with no fuzzy/LLM pass.

Mutable crew-scoped cache — not part of the [[Flow]] ledger, carries no accounting meaning. No soft delete: a correction simply upserts a new `product_id` over the old mapping.

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `alias_id` | PK | |
| `crew_id` | FK → [[Crew]] | Aliases are private to the crew that learned them |
| `raw_text` | text | Normalized (trimmed, lower-cased, whitespace-collapsed) receipt line text |
| `merchant` | text | Nullable — store context for debugging / future per-store keys |
| `product_id` | FK → [[Product]] | The catalog product the line maps to |
| `created_by` | FK → [[User]] | Nullable — who confirmed the mapping |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | Bumped on re-confirmation (upsert) |

Unique on `(crew_id, raw_text)` — one mapping per crew per raw line.

## How it's used

The `parse-receipt` edge function resolves each receipt line through a confidence funnel:

1. **Alias lookup** — exact match on `(crew_id, normalized raw_text)` → resolved (cheapest path; this entity).
2. **Trigram candidates** — `search_products_fuzzy` over the `products.name` trigram index.
3. **LLM disambiguation** — Claude picks the best candidate (or none) from the shortlist.

Only lines the user resolves to an **existing** product are written back as aliases. Create-new products are minted inside `bulk_import_inventory` and have no id to alias at write time.

## See Also

- [[Product]] — the catalog entity an alias points at
- [[Journey - Adding Inventory]] — Method 5 (Receipt / Invoice Scan) creates and consumes aliases
- [[Flow]] — the purchase ledger receipt scanning ultimately writes to
