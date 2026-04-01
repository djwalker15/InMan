# InMan — Conceptual Data Model

> **Generated:** March 25, 2026 | **Updated:** March 30, 2026
> **Purpose:** Map all planned features, their data requirements, and how they connect — designed for Obsidian graph view
> **Status:** Conceptual — not yet implemented
> **Auth Provider:** Clerk (string-based user IDs, all user profile data managed by Clerk)

---

## Entities

### Core
- [[Crew]] — Tenant boundary
- [[User]] — Local reference to Clerk-managed user (slim table)
- [[CrewMember]] — Join table linking [[User]]s to [[Crew]]s

### Spaces
- [[Space]] — Physical hierarchy node
- [[SpaceTemplate]] — Pre-built hierarchy blueprints

### Catalog
- [[Product]] — Universal product definition
- [[Category]] — Product/item categorization
- [[InventoryItem]] — Crew-specific product instance at a location (quantity is a **cache** derived from [[Flow]] ledger)

### Reference Data
- [[UnitDefinition]] — Unit conversion reference (weight, volume, count)

### Transactions
- [[Flow]] — Core transaction ledger (canonical source of truth for quantity and movement)

### Waste
- [[WasteEvent]] — Slim waste record (reason, total_cost, photo, notes — all other fields derived from [[Flow]])
- [[WasteExpiredDetail]] — Context for expired waste
- [[WasteSpoilageDetail]] — Context for spoiled waste
- [[WasteDamageDetail]] — Context for damaged waste
- [[WastePrepFailureDetail]] — Context for prep failure waste
- [[WasteSpillDetail]] — Context for spilled waste
- [[WasteOtherDetail]] — Context for other waste

### Recipes & Batching
- [[Recipe]] — Formula for producing something (has `output_product_id` for store intent)
- [[RecipeVersion]] — Versioned snapshot of a recipe
- [[RecipeIngredient]] — Ingredient line (DB trigger prevents circular references)
- [[RecipeStep]] — Instruction step in a recipe version
- [[BatchEvent]] — Execution of a recipe (completion is an atomic edge function)
- [[BatchInput]] — Ingredient consumed during a batch
- [[BatchOutput]] — Output produced by a batch

### Shopping
- [[ShoppingList]] — Named, collaborative shopping list
- [[ShoppingListItem]] — Line item with separate source FKs (not polymorphic)

### Kiosk
- [[KioskSession]] — Device-level session for shared-use environments

---

## Features

1. [[Feature 1 - Multi-Organization Tenancy]]
2. [[Feature 2 - Space Hierarchy Setup]]
3. [[Feature 3 - Item Catalog]]
4. [[Feature 4 - Inventory Level Tracking]]
5. [[Feature 5 - Assignment and Location Tracing]]
6. [[Feature 6 - Waste Tracking]]
7. [[Feature 7 - In-Out Flows]]
8. [[Feature 8 - Recipes]]
9. [[Feature 9 - Batching and Prepping]]
10. [[Feature 10 - Shopping List]]
11. [[Feature 11 - Kiosk Mode]]

---

## Cross-Cutting Concerns

- [[Cost Data Flow]]
- [[Nullable crew_id Pattern]]
- [[User Attribution]]

---

## Architecture Decisions

- **Quantity is a cache.** [[Flow]] ledger is canonical. See [[InventoryItem]], [[Flow]].
- **Soft deletes everywhere.** Mutable entities use `deleted_at`. Immutable records (Flow, WasteEvent, etc.) never deleted.
- **Atomic edge functions.** Batch completion, waste logging, shopping checkout, bulk reassignment wrapped in transactions.
- **No `direction` on Flow.** Derived from `flow_type`. See [[Flow]].
- **Slim WasteEvent.** Waste-specific fields only; quantity/item/crew/user derived from [[Flow]].
- **Separate source FKs on ShoppingListItem.** Not polymorphic. See [[ShoppingListItem]].
- **Recipe output_product_id.** Links recipe to its output [[Product]] for store intent. See [[Recipe]].
- **Circular reference guard.** App-level + DB trigger on [[RecipeIngredient]].
- **Within-category unit conversion.** See [[UnitDefinition]].
