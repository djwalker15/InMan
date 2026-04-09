# User Journey: Cost Reporting

> Covers the unified cost analytics dashboard — spending, waste costs, recipe costing, inventory valuation
> Referenced by [[InMan User Journeys]] #23

---

## Overview

Cost Reporting pulls together financial data from across the system into a single dedicated dashboard (`/reports/costs`). It follows the same three-layer pattern as [[Journey - Reviewing Waste History]]: summary cards at the top, charts in the middle, and a detailed transaction log at the bottom.

Five cost dimensions are surfaced: spending by category/time, waste cost analysis, recipe/meal costing, cost per Space, and current inventory valuation. All layers respond to the same filter set.

---

## Entry Points

| Entry Point | Pre-applied Filters |
|-------------|-------------------|
| **Nav item** — "Reports" → "Cost Report" | None (current month default) |
| **Dashboard widget** — monthly spend summary | Current month |
| **Recipe view** — "Cost breakdown" | Recipe filter pre-applied |
| **Waste History** — "View in cost report" | Waste-only filter |

---

## Filters

Persistent filter bar. All filters stack and apply to all layers simultaneously.

| Filter | Type | Options |
|--------|------|---------|
| **Time period** | Preset + custom range | This week, This month, Last month, Last 3 months, Last 6 months, This year, Custom |
| **Category** | Multi-select dropdown | All [[Category]]s |
| **Space** | Tree dropdown | [[Space]] node with "Include children" toggle |
| **Product** | Search/select | By [[Product]] name/brand |
| **Crew member** | Multi-select dropdown | All [[CrewMember]]s |
| **Recipe** | Search/select | By [[Recipe]] name — filters to costs from batches of this recipe |
| **Source / vendor** | Search/select | From [[FlowPurchaseDetail]] `source` field — filters to purchases from this store/vendor |
| **Flow type** | Multi-select chips | Purchase, Waste, Consumption, Prep usage, Adjustment |

---

## Layer 1 — Summary Cards

At-a-glance metrics for the filtered data:

| Card | Value | Source |
|------|-------|--------|
| **Total Spending** | $842.50 | Sum of `unit_cost × quantity` from purchase [[Flow]]s (via [[FlowPurchaseDetail]]) |
| **Waste Cost** | $142.50 | Sum of `total_cost` from [[WasteEvent]]s in the period |
| **Waste % of Spend** | 16.9% | Waste cost ÷ total spending |
| **Meals / Batches** | 23 batches | Count of completed [[BatchEvent]]s |
| **Avg Batch Cost** | $12.40 | Total batch costs ÷ batch count |
| **Current Inventory Value** | $1,245.80 | Sum of (`quantity × last_unit_cost`) across all [[InventoryItem]]s (not time-filtered — always current) |

Each card is tappable — filters to that dimension.

---

## Layer 2 — Charts

### Chart A — Spending Over Time

Line or bar chart. X-axis = time buckets. Y-axis = cost. Toggleable between:
- **Total spending** (purchases only)
- **Spending vs. waste** (two lines — shows how much of what you're buying ends up wasted)
- **Net cost** (spending minus inventory value gained — what you actually "consumed" in cost)

### Chart B — Spending by Category

Horizontal bar chart showing purchase cost per [[Category]].

Useful for: "We're spending $200/month on liquor and $80 on produce."

### Chart C — Waste as % of Spending by Category

Combined bar chart — each category shows total spend and waste side by side.

Useful for: "We spend $80 on produce but waste $25 of it (31%). We spend $200 on liquor but only waste $8 (4%)."

### Chart D — Recipe Cost Comparison

Bar chart showing cost per batch (or cost per yield unit) across recipes.

Useful for: "Margaritas cost $8.40/batch, Simple Syrup costs $2.10/batch."

### Chart E — Cost by Source / Vendor

Pie or bar chart showing purchase spending by `source` from [[FlowPurchaseDetail]].

Useful for: "We spend 60% at Sysco, 25% at H-E-B, 15% at Restaurant Depot."

### Chart F — Inventory Valuation by Space

Treemap or bar chart showing the value of inventory stored in each [[Space]].

Useful for: "The walk-in cooler holds $450 in inventory, the bar speed rail holds $120."

---

## Layer 3 — Detailed Transaction Log

A unified log of all cost-relevant [[Flow]]s matching the current filters, sorted newest first.

### Row Format

| Date | Type | Item | Qty | Unit Cost | Total | Source | By |
|------|------|------|-----|-----------|-------|--------|----|
| Apr 5 | Purchase | Cholula Hot Sauce | 2 | $3.50 | $7.00 | H-E-B | Davontae |
| Apr 5 | Purchase | Lime Juice, 16 oz | 3 | $2.99 | $8.97 | H-E-B | Davontae |
| Apr 4 | Waste | Heavy Cream | 1 | $4.50 | $4.50 | — | Marcus |
| Apr 3 | Prep usage | Sugar | 2 cups | $0.12 | $0.24 | Batch: Simple Syrup | Davontae |
| Apr 3 | Adjustment | Olive Oil | +2 oz | $0.38 | $0.76 | Physical count | Davontae |

### Flow Type Context

| Flow Type | Cost Source | "Source" Column Shows |
|-----------|-----------|----------------------|
| Purchase | [[FlowPurchaseDetail]] `unit_cost` | Store/vendor from `source` field |
| Waste | [[WasteEvent]] `total_cost` (derived from item's last_unit_cost) | Waste reason |
| Consumption | Item's `last_unit_cost` at time of consumption | — |
| Prep usage | Item's `last_unit_cost` at time of batch | "Batch: [Recipe name]" |
| Adjustment | Delta × item's `last_unit_cost` | "System reconciliation" or "Physical count" |

### Inline Expansion

Tapping a row expands to show:
- Full item details (Product name, brand, location)
- Flow context (which batch, which waste event, which audit)
- For purchases: receipt/vendor context
- For waste: links to the waste detail (from [[Journey - Reviewing Waste History]])

---

## Recipe Cost View

When filtered to a specific [[Recipe]], the dashboard transforms into a recipe cost analysis:

### Recipe Cost Breakdown

| Ingredient | Qty per Batch | Unit Cost | Ingredient Cost | % of Total |
|------------|--------------|-----------|----------------|-----------|
| Sugar | 2 cups | $0.12/cup | $0.24 | 5% |
| Water | 2 cups | — | — | — |
| Lime Juice | 4 oz | $0.38/oz | $1.52 | 32% |
| Tequila | 6 oz | $0.95/oz | $5.70 | 63% |
| **Total** | | | **$7.46** | |

**Cost per yield unit:** $0.23 / oz (based on 32 oz yield)

### Recipe Cost Over Time

Line chart showing how the batch cost has changed over time (as ingredient prices fluctuate):
- "Margaritas cost $7.46/batch now vs. $6.80/batch last month — Tequila price increased"

### Batch History for This Recipe

| Date | Scale | Total Cost | Cost/Unit | Cooked By |
|------|-------|-----------|-----------|-----------|
| Apr 3 | 2× | $14.92 | $0.23/oz | Davontae |
| Mar 28 | 1× | $7.46 | $0.23/oz | Marcus |
| Mar 20 | 3× | $20.40 | $0.21/oz | Davontae |

---

## Inventory Valuation

A dedicated sub-view (accessible from the "Current Inventory Value" summary card or as a tab):

### Valuation Table

| Product | Qty | Unit Cost | Total Value | Location | Category |
|---------|-----|-----------|------------|----------|----------|
| Tequila, 750 ml | 4 | $18.99 | $75.96 | Bar > Speed Rail | Liquor |
| Cholula Hot Sauce | 3 | $3.50 | $10.50 | Pantry > Shelf 2 | Condiments |
| Simple Syrup (batch) | 32 oz | $0.23 | $7.46 | Fridge > Main | Prep |

**Note:** Items without `last_unit_cost` show "No cost data" and are excluded from the total. The card shows: "Inventory value: $1,245.80 (38 of 42 items costed)."

**Valuation is always current** — not filtered by time period. It represents what's on hand right now.

---

## Data Model Touchpoints

| Entity | Operation | When |
|--------|-----------|------|
| [[Flow]] | Read | All layers — the primary data source for cost reporting |
| [[FlowPurchaseDetail]] | Read | Purchase cost, source/vendor |
| [[FlowAdjustmentDetail]] | Read | Adjustment cost impact |
| [[FlowPrepUsageDetail]] | Read | Batch cost context |
| [[WasteEvent]] | Read | Waste cost |
| [[InventoryItem]] | Read | Current valuation (qty × last_unit_cost) |
| [[Product]] | Read | Item display, category |
| [[Category]] | Read | Category breakdown |
| [[Space]] | Read | Space valuation, cost by location |
| [[Recipe]] | Read | Recipe cost analysis |
| [[RecipeVersion]] | Read | Ingredient breakdown for recipe costing |
| [[RecipeIngredient]] + child tables | Read | Individual ingredient costs |
| [[BatchEvent]] | Read | Batch history, batch cost totals |
| [[CrewMember]] | Read | Crew member filter |

> **Entirely read-only.** No writes. All data comes from Flows and their child tables.

---

## See Also

- [[Journey - Reviewing Waste History]] — waste-specific analytics (subset of cost reporting)
- [[Cost Data Flow]] — how cost propagates through the system (purchases → items → recipes → batches → waste)
- [[FlowPurchaseDetail]] — purchase cost capture
- [[Journey - Shopping Trip]] — where purchase costs are captured
- [[Journey - Cooking a Meal]] / [[Journey - Prepping for Storage]] — where batch costs are generated
- [[Journey - Logging Waste]] — where waste costs are captured
