# User Journey: Prepping for Storage (Store/Split Batch)

> Covers the store-intent batch workflow — same recipe execution as Cooking a Meal, but the output creates new InventoryItems
> Referenced by [[InMan User Journeys]] #12

---

## Overview

Prepping for Storage is the **store-intent batch** — the output is stored in inventory for later use, not consumed immediately. Examples: making a batch of Simple Syrup, prepping a large pot of soup to portion into containers, mixing a spice blend.

This journey shares **Steps 1-3** with [[Journey - Cooking a Meal]] (recipe selection, scaling, ingredient resolution, progressive deduction). The difference is **Step 4**: instead of marking the batch as consumed, the user defines the output — how much, in what portions, and where to store it.

---

## Prerequisites

- The [[Recipe]] must have `output_product_id` set — this defines what [[Product]] the output will be stored as. If not set, the user is prompted: "This recipe doesn't have an output product linked. Set one now?" → opens the output product linking flow (see [[Recipe]] entity).
- All ingredients must be linked (no `free_text` ingredient types).

---

## Steps 1-3 — Shared with Cooking a Meal

These steps are identical to [[Journey - Cooking a Meal]]:

### Step 1 — Select Recipe and Scale

Same recipe search, same scaling controls (preset multipliers, custom input, target yield). All ingredient quantities update in real-time.

**Additional guard:** Recipe must have `output_product_id` set. If null, "Set output product" prompt appears before proceeding.

### Step 2 — Review and Resolve Ingredients

Same interactive ingredient table with real-time availability, ProductGroup resolution (user picks specific InventoryItem), availability statuses (Ready, Short, Out), and adjustment controls (change scale, swap source, skip ingredient).

### Step 3 — Cook (Deduct As You Go)

Same progressive deduction — each ingredient is deducted when the user taps "Use," creating a prep_usage [[Flow]] + [[FlowPrepUsageDetail]] + [[BatchInput]] immediately. Same mid-batch failure handling (log as waste, keep deductions, or undo).

> For full details on Steps 1-3, see [[Journey - Cooking a Meal]].

---

## Step 4 — Define Output (Store Intent)

This is where the journey diverges. Instead of completing as consumed, the user defines what's being stored.

### Output Product

The output [[Product]] is determined by the [[Recipe]]'s `output_product_id`. Shown as a header:

```
Output: Simple Syrup (from recipe yield: 64 oz at 2×)
```

### Single or Split

The user chooses how to store the output:

**Single output** — one [[InventoryItem]] for the full yield.

**Split output** — divide into multiple [[InventoryItem]]s with different quantities and locations.

### Single Output Form

| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| Quantity | Yes | Recipe yield at current scale (e.g., 64 oz) | Numeric — can be adjusted if actual yield differs |
| Unit | Yes | Recipe's yield unit | From [[UnitDefinition]] |
| Location | Yes | — | [[Space]] tree dropdown. Must be assigned. |
| Home location | No | Same as current | [[Space]] tree dropdown. "Same as current" shortcut. |
| Expiry date | No | — | Date picker |
| Notes | No | — | e.g., "Made for Saturday service" |

### Split Output Form

A table where the user adds rows for each portion:

| Portion | Quantity | Unit | Location | Expiry | Notes |
|---------|----------|------|----------|--------|-------|
| 1 | 16 oz | oz | Fridge > Main | Apr 15 | |
| 2 | 16 oz | oz | Fridge > Main | Apr 15 | |
| 3 | 16 oz | oz | Bar > Speed Rail | — | For tonight's service |
| 4 | 16 oz | oz | Walk-in > Shelf 2 | Apr 20 | Backup |
| **Total** | **64 oz** | | | | |

**Controls:**
- "Add portion" — new row
- Total quantity across all portions must equal the recipe yield (or the user can adjust if actual yield differs)
- A running total shows: "64 of 64 oz allocated" or "48 of 64 oz allocated — 16 oz unassigned"
- Each portion requires a location — no deferred shelving for batch outputs
- Expiry and notes are optional per portion

### Cost Calculation

The output cost is **derived from ingredients**:

```
Total batch cost: $12.40
  (sum of all deducted ingredient quantities × their unit costs)

Per output unit: $0.19 / oz
  ($12.40 ÷ 64 oz yield)

Per portion (if split):
  Portion 1: 16 oz × $0.19 = $3.10
  Portion 2: 16 oz × $0.19 = $3.10
  Portion 3: 16 oz × $0.19 = $3.10
  Portion 4: 16 oz × $0.19 = $3.10
```

This derived cost becomes the `last_unit_cost` on each output [[InventoryItem]]. It flows downstream into waste costing (if the output is later wasted) and nested recipe costing (if the output is used as a sub-recipe ingredient in another batch).

---

## Step 5 — Complete

### Completion Summary

| Metric | Value |
|--------|-------|
| Recipe | Simple Syrup (v3) |
| Scale | 2× |
| Ingredients used | 3 of 3 |
| Ingredients short | 0 |
| Total ingredient cost | $12.40 |
| Output | Simple Syrup — 64 oz (4 portions) |
| Cost per unit | $0.19 / oz |
| Stored in | Fridge > Main (×2), Bar > Speed Rail (×1), Walk-in > Shelf 2 (×1) |

User taps "Complete."

### On Completion (atomic via edge function)

**BatchEvent finalization:**
- [[BatchEvent]] status → `completed`, `completed_at` set, `batch_intent` = `store`
- `total_cost` calculated from ingredient deductions

**Output creation (one per portion, or one for single output):**
- [[InventoryItem]] created for each portion:
  - `product_id` = Recipe's `output_product_id`
  - `crew_id` = current Crew
  - `quantity` = portion quantity
  - `unit` = portion unit
  - `current_space_id` = assigned location (required)
  - `home_space_id` = assigned home or same as current
  - `last_unit_cost` = derived cost per unit
  - `expiry_date` = if set
  - `notes` = if set
- [[BatchOutput]] created for each portion (linking the InventoryItem to the BatchEvent)
- Purchase [[Flow]] created for each output InventoryItem (quantity entering inventory)
- [[FlowPurchaseDetail]] created with `unit_cost` = derived cost per unit, `source` = "Batch: [Recipe name] [date]"

**All of the above is atomic** — if any step fails, the entire output creation is rolled back. The ingredient deductions from Step 3 are already committed (they happened progressively) and are not affected.

### Success

Toast: "Batch complete — [N] portion(s) of [Product name] stored."

---

## Relationship to Cooking a Meal

| Aspect | Cooking a Meal (#11) | Prepping for Storage (#12) |
|--------|---------------------|---------------------------|
| Batch intent | `consume` | `store` |
| `output_product_id` required | No | Yes |
| Steps 1-3 | Identical | Identical |
| Output | Nothing — batch is consumed | New InventoryItem(s) created |
| Output location | N/A | Required |
| Split into portions | N/A | Optional |
| Output cost | Tracked on BatchEvent only | Derived cost flows to InventoryItem's `last_unit_cost` |
| Purchase Flow for output | No | Yes — output entering inventory |

---

## Data Model Touchpoints

Steps 1-3 touchpoints are identical to [[Journey - Cooking a Meal]]. Step 4-5 adds:

| Entity | Operation | When |
|--------|-----------|------|
| [[Recipe]] | Read (`output_product_id`) | Determining the output Product |
| [[BatchEvent]] | Update | Completion (status, total_cost, batch_intent) |
| [[BatchOutput]] | Insert | One per output portion |
| [[InventoryItem]] | Insert | One per output portion |
| [[Flow]] | Insert (purchase) | One per output InventoryItem (output entering inventory) |
| [[FlowPurchaseDetail]] | Insert | One per purchase Flow (derived cost, source = batch reference) |
| [[Space]] | Read | Location assignment for each portion |

---

## See Also

- [[Journey - Cooking a Meal]] — consume-intent batch (shares Steps 1-3)
- [[Journey - Creating a Recipe]] — setting up recipes, including `output_product_id` (set after creation)
- [[Recipe]] — `output_product_id` determines what Product the output is stored as
- [[BatchEvent]] — `batch_intent` = store
- [[BatchOutput]] — links output InventoryItems to the batch
- [[Cost Data Flow]] — derived cost from ingredients flows to output InventoryItem's `last_unit_cost`, then downstream to waste costing and nested recipe costing
