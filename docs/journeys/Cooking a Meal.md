# User Journey: Cooking a Meal (Consume Batch)

> Covers the consume-intent batch workflow — pick a recipe, scale it, resolve ingredients, cook, deduct as you go, complete
> Referenced by [[InMan User Journeys]] #11

---

## Overview

Cooking a Meal is the **consume-intent batch** — the output is eaten or served, not stored in inventory. Pick a recipe, scale it, resolve generic ingredients to specific inventory items, then work through the recipe deducting ingredients as you go.

The flow is **interactive**, not linear: ingredient availability is shown in real-time, the user can adjust scale or swap ingredients on the fly, and deductions happen progressively as the user marks each ingredient as "used." If something goes wrong mid-batch, the already-deducted ingredients are accurately tracked, and the remainder can be logged as waste.

A [[BatchEvent]] with `batch_intent` = `consume` is created to track the session. No [[InventoryItem]]s are created — everything consumed is deducted from existing inventory.

---

## Entry Points

| Entry Point | Context |
|-------------|---------|
| **Recipe view page** — "Cook this" / "Start a batch" | Recipe pre-selected |
| **Recipes list** — quick action on a recipe row | Recipe pre-selected |
| **Kiosk Mode** — if batch/cook is an allowed action | Recipe search, scoped to crew |
| **Dashboard** — "Cook something" shortcut | Recipe search |

---

## Step 1 — Select Recipe and Scale

### Recipe Selection

If not pre-selected from entry point: search field showing all [[Recipe]]s for the current [[Crew]]. Each result shows name, yield, estimated cost, and readiness status (✅ ready to batch, ⚠️ unlinked ingredients).

**Guard:** Recipes with unlinked ingredients (`free_text` type) cannot be batched. These show a "Link ingredients first" message linking to [[Journey - Editing a Recipe]].

### Scaling

The recipe's base yield is shown (e.g., "Yields 32 oz"). Scaling options:

| Control | Behavior |
|---------|----------|
| **Preset multipliers** | 0.5×, 1×, 2×, 3×, 4× — tappable chips |
| **Custom multiplier** | Numeric input for any value (e.g., 1.5×, 0.75×) |
| **Target yield** | "I want [X] [unit]" — system calculates the multiplier (e.g., "I want 64 oz" → 2× for a 32 oz recipe) |

All ingredient quantities update in real-time as the scale changes.

---

## Step 2 — Review and Resolve Ingredients

An interactive ingredient table showing every ingredient at the scaled quantities, with real-time inventory availability:

| Ingredient | Needed | Available | Source | Status |
|------------|--------|-----------|--------|--------|
| Sugar (ProductGroup) | 3 cups | — | [Choose] | ⚠️ Unresolved |
| Lime Juice | 4 oz | 12 oz | Pantry > Shelf 2 | ✅ Ready |
| Tequila | 8 oz | 6 oz | Bar > Speed Rail | 🟡 Short (2 oz) |
| Simple Syrup (sub-recipe) | 4 oz | 8 oz | Fridge > Main | ✅ Ready |

### Resolving ProductGroup Ingredients

When an ingredient references a [[ProductGroup]], the user must choose which specific [[InventoryItem]] to deduct from:

1. Tap "Choose" on the unresolved row
2. System shows all [[InventoryItem]]s for [[Product]]s in that group:

| Product | Quantity | Location | Expiry | FIFO |
|---------|----------|----------|--------|------|
| Domino Sugar, 4 lb | 3.2 lbs | Pantry > Shelf 1 | — | ✅ Use this |
| C&H Sugar, 2 lb | 1.8 lbs | Pantry > Shelf 3 | — | |

3. User selects one → row updates to show the resolved source and availability status

### Availability Statuses

| Status | Condition | Behavior |
|--------|-----------|----------|
| ✅ **Ready** | Available ≥ Needed | Full deduction will succeed |
| 🟡 **Short** | Available > 0 but < Needed | Shows shortfall. On deduction: deducts what's available, flags the remainder. User can proceed. |
| 🔴 **Out** | Available = 0 | Nothing to deduct. User can skip this ingredient or cancel. |
| ⚠️ **Unresolved** | ProductGroup not yet resolved to a specific InventoryItem | Must resolve before proceeding |

### Adjustments During Review

- **Change scale** — re-scale up or down, all quantities recalculate, statuses update
- **Swap source** — tap an ingredient's source to pick a different InventoryItem (e.g., use the C&H sugar instead of the Domino)
- **Skip an ingredient** — mark as "skip" if you're out or substituting something off-system (e.g., borrowing from a neighbor)

---

## Step 3 — Cook (Deduct As You Go)

Once all ProductGroup ingredients are resolved and the user is satisfied with the plan, they tap "Start cooking."

The view shifts to **cooking mode**: the recipe's [[RecipeStep]]s are displayed alongside the ingredient list. As the user works through the recipe, they mark each ingredient as "used":

### Ingredient Deduction UX

Each ingredient row has a "Use" button (or swipe action on mobile):

```
☐ Sugar — 3 cups (from Domino Sugar, Pantry > Shelf 1)     [Use ✓]
☐ Lime Juice — 4 oz (from Pantry > Shelf 2)                [Use ✓]
☐ Tequila — 8 oz (from Bar > Speed Rail)                   [Use ✓]
☐ Simple Syrup — 4 oz (from Fridge > Main)                 [Use ✓]
```

**On tapping "Use":**
- A prep_usage [[Flow]] is created **immediately** for that ingredient
- The corresponding [[FlowPrepUsageDetail]] child row is created (linking to the [[BatchEvent]])
- A [[BatchInput]] record is created (linking ingredient to the batch)
- The [[InventoryItem]]'s cached quantity is decremented
- The row updates to show ✅ with the deducted amount
- If the ingredient was **short**, the deduction is for the available amount only. The row shows: "✅ Used 6 oz (short 2 oz)"

**Skipped ingredients** show as ⏭️ — no Flow created, no deduction.

### Recipe Steps Display

The recipe's [[RecipeStep]]s are shown in order alongside or below the ingredient list. This is read-only — the steps are a reference while cooking. The user can scroll through or tap to expand individual steps.

### Mid-Batch Failure

If something goes wrong during cooking:

1. User taps "Cancel batch" or "Something went wrong"
2. Confirmation: "Some ingredients have already been deducted. Do you want to log the used ingredients as waste?"
3. Options:
   - **Log as waste** → opens [[Journey - Logging Waste]] with all already-deducted ingredients queued, reason = `prep_failure`, batch pre-linked
   - **Keep deductions** → ingredients stay deducted (they were used even if the result failed), batch marked as cancelled
   - **Cancel and undo** → reverses the deductions (creates compensating purchase Flows to restore quantities), batch marked as cancelled

---

## Step 4 — Complete

Once all ingredients are marked as used (or skipped), the user taps "Finish."

### Completion Summary

| Metric | Value |
|--------|-------|
| Recipe | Simple Syrup (v3) |
| Scale | 2× (yields 64 oz) |
| Ingredients used | 4 of 4 |
| Ingredients short | 1 (Tequila: needed 8 oz, used 6 oz) |
| Ingredients skipped | 0 |
| Total cost | $12.40 (sum of deducted ingredients × their unit costs) |
| Cost per yield unit | $0.19 / oz |

### On Completion

- [[BatchEvent]] status → `completed`, `completed_at` set
- `batch_intent` = `consume` — no output InventoryItems created
- `total_cost` calculated and stored
- All [[BatchInput]]s and their corresponding [[Flow]]s already exist from the progressive deduction
- Success toast: "Batch complete — [Recipe name] at [scale]×"

**Data touched on completion:**
- [[BatchEvent]] (update — status, completed_at, total_cost)
- No new Flows — they were all created during Step 3

---

## Data Model Touchpoints

| Entity | Operation | When |
|--------|-----------|------|
| [[Recipe]] | Read | Recipe selection, steps display |
| [[RecipeVersion]] | Read | Loading current version's ingredients and steps |
| [[RecipeIngredient]] + child tables | Read | Ingredient list with references |
| [[ProductGroup]] | Read | Resolving generic ingredients to specific InventoryItems |
| [[Product]] | Read | Ingredient display, cost lookup |
| [[InventoryItem]] | Read | Availability check, cost lookup |
| [[InventoryItem]] | Update (cached quantity) | Each "Use" deduction |
| [[UnitDefinition]] | Read | Unit conversion for availability comparison |
| [[Space]] | Read | Source location display |
| [[BatchEvent]] | Insert | Start of batch session |
| [[BatchEvent]] | Update | Completion (status, total_cost) |
| [[BatchInput]] | Insert | One per ingredient as it's used |
| [[Flow]] | Insert (prep_usage) | One per ingredient as it's used |
| [[FlowPrepUsageDetail]] | Insert | One per prep_usage Flow (batch_id link) |

---

## See Also

- [[Journey - Prepping for Storage]] — store/split-intent batch (creates output InventoryItems)
- [[Journey - Creating a Recipe]] — where recipes are built
- [[Journey - Editing a Recipe]] — adjusting recipes based on cooking experience
- [[Journey - Logging Waste]] — batch failure entry point for wasted ingredients
- [[Journey - Expiry Management]] — FIFO suggestions influence which InventoryItem to pick
- [[BatchEvent]] — the batch session entity
- [[BatchInput]] — ingredient consumption records
- [[FlowPrepUsageDetail]] — links prep_usage Flows to the batch
- [[Cost Data Flow]] — batch costing from ingredient deductions
