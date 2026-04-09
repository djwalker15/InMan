# User Journey: Data Export

> Covers exporting all system data in CSV, Excel, and PDF formats from a centralized export page
> Referenced by [[InMan User Journeys]] #26

---

## Overview

Data Export provides a centralized page (`/admin/export`) where users can export any data set from InMan. Eight data sets are available, each with configurable filters, date ranges, and three output formats (CSV, Excel, PDF). This supports external analysis, backup, compliance reporting, and sharing data with people outside the system.

---

## Entry Point

| Entry Point | Context |
|-------------|---------|
| **Admin area** — "Export Data" | Centralized export page |

**Who can access:** Owner, Admins. Members and Viewers cannot export (configurable via permission overrides on [[CrewMember]]).

---

## The Export Page (`/admin/export`)

### Step 1 — Select Data Set

Eight exportable data sets, presented as tappable cards:

| Data Set | Description | Primary Data Source |
|----------|-------------|-------------------|
| **Inventory** | Current state of all items — product, quantity, location, cost, expiry, status | [[InventoryItem]] + [[Product]] + [[Space]] |
| **Transaction History** | All Flows — purchases, waste, consumption, transfers, prep usage, adjustments | [[Flow]] + child tables |
| **Waste Events** | Waste log with reason-specific details | [[WasteEvent]] + detail tables + [[Flow]] |
| **Recipes** | Recipe definitions — ingredients, steps, yield, cost estimate | [[Recipe]] + [[RecipeVersion]] + [[RecipeIngredient]] + child tables + [[RecipeStep]] |
| **Shopping Lists** | All lists with items, sources, and check-off status | [[ShoppingList]] + [[ShoppingListItem]] + child tables |
| **Batch History** | All completed batches — recipe, scale, inputs, outputs, cost | [[BatchEvent]] + [[BatchInput]] + [[BatchOutput]] |
| **Cost Report** | Unified cost data — spending, waste cost, recipe cost, valuation | [[Flow]] + [[WasteEvent]] + [[BatchEvent]] (aggregated) |
| **Spaces** | Hierarchy structure — all nodes with types, parent relationships, item counts | [[Space]] |

### Step 2 — Configure Filters

Each data set has relevant filters. Common filters across most data sets:

| Filter | Applies To | Type |
|--------|-----------|------|
| **Date range** | All except Inventory and Spaces (which are current-state) | Preset + custom |
| **Category** | Inventory, Transactions, Waste, Recipes, Cost | Multi-select |
| **Space** | Inventory, Transactions, Waste, Spaces | Tree dropdown |
| **Product** | Inventory, Transactions, Waste | Search/select |
| **Crew member** | Transactions, Waste, Batch History | Multi-select |

Data-set-specific filters:

| Data Set | Additional Filters |
|----------|-------------------|
| **Transaction History** | Flow type (purchase, waste, consumption, transfer, prep_usage, adjustment) |
| **Waste Events** | Waste reason (expired, spoiled, damaged, prep_failure, spilled, other) |
| **Recipes** | Include archived/deleted recipes toggle |
| **Shopping Lists** | List status (active, completed, archived) |
| **Batch History** | Batch intent (consume, store), Recipe filter |
| **Cost Report** | Source/vendor, Recipe |

### Step 3 — Select Format

| Format | Best For | Notes |
|--------|----------|-------|
| **CSV** | Data analysis, importing into other tools | Plain comma-separated values. One file per data set. |
| **Excel (.xlsx)** | Spreadsheet analysis, sharing with non-technical stakeholders | Formatted with headers, column widths, basic styling. One sheet per data set (or multiple sheets for data sets with child data). |
| **PDF** | Formal reports, printing, archival | Formatted report with title, date range, summary stats, and data tables. Includes chart visualizations for Cost Report and Waste Events. |

### Step 4 — Preview and Export

**Preview:** A sample of the first 10 rows in the selected format, so the user can verify the data looks right before generating the full export.

**Export:** User clicks "Export." The file is generated server-side (Supabase edge function for large data sets) and downloaded.

**Large data set handling:** For exports with thousands of rows, show a progress indicator: "Generating export... 2,400 of 8,100 rows." The file downloads when complete.

---

## Export Contents by Data Set

### Inventory Export

One row per [[InventoryItem]]:

| Column | Source |
|--------|--------|
| Product name | [[Product]] name |
| Brand | [[Product]] brand |
| Barcode | [[Product]] barcode |
| Category | Effective category |
| Quantity | Cached quantity |
| Unit | |
| Current location | [[Space]] full path |
| Home location | [[Space]] full path (or "Unsorted") |
| Displacement status | In place / Displaced / Unsorted |
| Last unit cost | |
| Total value | Quantity × last_unit_cost |
| Min stock | |
| Expiry date | |
| Expiry status | OK / Heads up / Warning / Urgent / Expired |
| Notes | |

### Transaction History Export

One row per [[Flow]]:

| Column | Source |
|--------|--------|
| Date | `performed_at` |
| Flow type | `flow_type` |
| Product name | Via [[InventoryItem]] → [[Product]] |
| Quantity | |
| Unit | |
| Unit cost | From [[FlowPurchaseDetail]] or item's `last_unit_cost` |
| Total cost | Quantity × unit cost |
| From location | [[FlowTransferDetail]] `from_space_id` path (transfers only) |
| To location | [[FlowTransferDetail]] `to_space_id` path (transfers only) |
| Source/vendor | [[FlowPurchaseDetail]] `source` (purchases only) |
| Batch reference | [[FlowPrepUsageDetail]] `batch_id` → Recipe name (prep usage only) |
| Adjustment type | [[FlowAdjustmentDetail]] `adjustment_type` (adjustments only) |
| Performed by | User display name |
| Notes | |

### Waste Events Export

One row per [[WasteEvent]], with reason-specific detail columns flattened:

| Column | Source |
|--------|--------|
| Date | [[Flow]] `performed_at` |
| Product name | Via Flow → InventoryItem → Product |
| Quantity | [[Flow]] quantity |
| Unit | |
| Reason | `waste_reason` |
| Total cost | `total_cost` |
| Location | Item's location at time of waste |
| Logged by | User display name |
| Notes | |
| Expiry date | From [[WasteExpiredDetail]] (if expired) |
| Days past expiry | (if expired) |
| How damaged | From [[WasteDamageDetail]] (if damaged) |
| What went wrong | From [[WastePrepFailureDetail]] (if prep failure) |
| How spilled | From [[WasteSpillDetail]] (if spilled) |
| Storage conditions | From [[WasteSpoilageDetail]] (if spoiled) |
| Description | From [[WasteOtherDetail]] (if other) |

### Recipes Export

**Excel/PDF:** Multi-sheet or multi-section. One section per [[Recipe]]:
- Recipe info (name, yield, times, cost estimate)
- Ingredients table (name, quantity, unit, type, cost)
- Steps table (number, instruction)

**CSV:** Flattened — one row per ingredient line, with recipe info repeated:

| Recipe name | Yield | Ingredient | Qty | Unit | Type | Step # | Step instruction |

### Shopping Lists Export

One row per [[ShoppingListItem]]:

| Column | Source |
|--------|--------|
| List name | [[ShoppingList]] name |
| List status | active / completed / archived |
| Product name | |
| Quantity needed | |
| Unit | |
| Source type | manual / low_stock / recipe / meal_plan |
| Source context | InventoryItem location, Recipe name, or Batch reference |
| Is checked | |
| Checked by | |
| Checked at | |
| Unit cost | (if captured) |

### Batch History Export

One row per [[BatchEvent]], with inputs summarized:

| Column | Source |
|--------|--------|
| Date | `completed_at` |
| Recipe name | [[Recipe]] name |
| Version | [[RecipeVersion]] version_number |
| Scale | |
| Batch intent | consume / store |
| Total cost | |
| Inputs count | Number of [[BatchInput]]s |
| Output product | (store intent only) |
| Output quantity | (store intent only) |
| Performed by | User display name |

**Excel/PDF:** Additional sheet/section with input detail — one row per [[BatchInput]] with product, quantity, unit cost.

### Cost Report Export

Aggregated data matching the current filters from [[Journey - Cost Reporting]]:

| Column | Source |
|--------|--------|
| Period | Time bucket (day/week/month) |
| Total spending | Sum of purchase Flows |
| Waste cost | Sum of WasteEvent total_cost |
| Waste % | |
| Batch count | |
| Avg batch cost | |
| Net consumption cost | Spending - inventory value change |

**Excel/PDF:** Includes charts (spending over time, by category, waste %).

### Spaces Export

One row per [[Space]]:

| Column | Source |
|--------|--------|
| Name | |
| Unit type | premises / area / zone / section / sub_section / container / shelf |
| Full path | Derived from hierarchy |
| Parent | Parent Space name |
| Depth level | |
| Item count | Number of InventoryItems at this Space |
| Total value | Sum of (quantity × last_unit_cost) for items at this Space |

---

## PDF Report Formatting

PDF exports include:
- **Header:** Crew name, report title, date range, generated date
- **Summary section:** Key metrics (same as dashboard summary cards)
- **Charts:** Embedded visualizations for Cost Report and Waste Events
- **Data tables:** Formatted with alternating row colors, column alignment, page breaks
- **Footer:** Page numbers, "Generated by InMan"

---

## Data Model Touchpoints

| Entity | Operation | When |
|--------|-----------|------|
| All entities | Read | Depending on selected data set |

> **Entirely read-only.** Exports read from existing data without modification.

---

## See Also

- [[Journey - Reviewing Waste History]] — has its own inline CSV export for waste data (subset of this journey)
- [[Journey - Cost Reporting]] — cost report data set mirrors the cost dashboard
- [[Journey - Inventory Audit]] — audit history could be exported via Transaction History (adjustment Flows)
- [[Journey - Crew Management]] — export access controlled by role/permissions
