# Crew

> Part of [[Feature 1 - Multi-Organization Tenancy]]

The tenant boundary for the entire system. Everything downstream — [[Space]]s, [[InventoryItem]]s, [[Recipe]]s, [[ShoppingList]]s — belongs to a Crew.

A Crew represents any group using InMan together: a solo person in an apartment, a family household, or a business like a bar. The name was chosen to feel natural at every scale — "my crew of one" through "the Haywire crew."

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `crew_id` | PK | |
| `name` | text | |
| `created_by` | text FK → [[User]] | Clerk user ID |
| `created_at` | timestamp | |
| `updated_at` | timestamp | Auto-maintained by trigger |
| `settings` | JSON | Configurable preferences like kiosk auth method |

## Relationships

- Has many [[CrewMember]]s (join to [[User]])
- Has many [[Space]]s (one or more root Premises)
- Has many [[InventoryItem]]s
- Has many [[Recipe]]s (crew-private ones)
- Has many [[ShoppingList]]s
- Has many [[Category]] records (crew-custom ones)
- Has many [[KioskSession]]s
- Has many [[Flow]]s
- Has many [[WasteEvent]]s (via Flows)
- Has many [[BatchEvent]]s

## See Also

- [[Nullable crew_id Pattern]] — [[Product]], [[Category]], and [[Recipe]] use nullable `crew_id` to distinguish global vs. crew-scoped records
- [[User Attribution]] — all state-changing actions within a Crew are user-stamped
