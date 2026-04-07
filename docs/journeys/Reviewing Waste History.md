# User Journey: Reviewing Waste History

> Covers the waste analytics dashboard — reviewing patterns, costs, and trends in waste data
> Referenced by [[InMan User Journeys]] #14

---

## Overview

Reviewing Waste History is the analytical counterpart to [[Journey - Logging Waste]]. While logging captures what happened, this journey helps users understand **why it keeps happening** and **how much it's costing**.

The dedicated Waste History page (`/waste`) provides a full analytics dashboard with three layers: summary cards at the top, charts in the middle, and a detailed event log at the bottom. All layers respond to the same set of filters, so narrowing by time period, reason, category, space, product, or crew member updates everything at once.

---

## Entry Points

| Entry Point | Pre-applied Filters |
|-------------|-------------------|
| **Nav item** — "Waste" in main navigation | None (shows all time, current month by default) |
| **Dashboard widget** — waste cost summary | Current month pre-selected |
| **Checking Stock alerts** — waste-related alerts | Reason filter pre-applied |
| **Expiry Management triage** — "View waste history for this item" | Product filter pre-applied |

---

## Filters

A persistent filter bar at the top of the page. All filters stack and apply to all three layers (summary, charts, log) simultaneously.

| Filter | Type | Options |
|--------|------|---------|
| **Time period** | Preset + custom range | This week, This month, Last month, Last 3 months, Last 6 months, This year, Custom date range |
| **Waste reason** | Multi-select chips | Expired, Spoiled, Damaged, Prep failure, Spilled, Other |
| **Category** | Multi-select dropdown | All [[Category]]s (system + crew-custom) |
| **Space** | Tree dropdown | [[Space]] node, with "Include children" toggle |
| **Product** | Search/select | Search by [[Product]] name/brand |
| **Crew member** | Multi-select dropdown | All [[CrewMember]]s (including soft-deleted for historical data) |

**Default state:** Current month, all reasons, all categories, all spaces, all products, all members.

**Clear all:** One-tap reset to defaults.

---

## Layer 1 — Summary Cards

Top of the page. At-a-glance metrics for the filtered data:

| Card | Value | Subtext |
|------|-------|---------|
| **Total Waste Cost** | $142.50 | Sum of `total_cost` across filtered [[WasteEvent]]s |
| **Events Logged** | 23 | Count of waste events in the filtered set |
| **Items Wasted** | 19 | Distinct [[InventoryItem]]s (some items may have multiple events) |
| **Top Reason** | Expired (12 events) | Most frequent `waste_reason` in the filtered set |
| **Most Wasted Product** | Heavy Cream (4 events, $18.40) | [[Product]] with highest event count or cost |
| **Worst Location** | Fridge > Crisper (6 events) | [[Space]] with highest waste event count |

Each card is tappable — tapping applies that dimension as a filter (e.g., tapping "Top Reason: Expired" filters everything to reason = expired).

---

## Layer 2 — Charts

Middle of the page. Visual breakdowns of the filtered data.

### Chart A — Waste Over Time

Line or bar chart showing waste cost (or event count, toggleable) over the selected time period. X-axis = time buckets (days, weeks, or months depending on range). Y-axis = cost or count.

Useful for: spotting trends ("waste spiked in March"), seasonal patterns, measuring improvement after process changes.

### Chart B — Breakdown by Reason

Pie or donut chart showing the proportion of waste events by `waste_reason`.

| Reason | Events | Cost | % of Total |
|--------|--------|------|-----------|
| Expired | 12 | $67.20 | 47% |
| Spoiled | 5 | $32.10 | 23% |
| Spilled | 3 | $22.50 | 16% |
| Prep failure | 2 | $15.70 | 11% |
| Damaged | 1 | $5.00 | 3% |

Clicking a segment filters to that reason.

### Chart C — Breakdown by Category

Horizontal bar chart showing waste cost per [[Category]].

Useful for: identifying which product categories have the most waste ("we're losing $67 in produce every month").

### Chart D — Breakdown by Space (optional, shown when useful)

Treemap or bar chart showing waste by [[Space]].

Useful for: identifying problem storage areas ("items in the Crisper drawer expire 2x more than items on Shelf 2").

---

## Layer 3 — Detailed Event Log

Bottom of the page. A full log of every [[WasteEvent]] matching the current filters, sorted newest first.

### Collapsed Row

| Column | Source |
|--------|--------|
| Date | [[Flow]] `performed_at` (derived via WasteEvent → Flow join) |
| Product name + brand | [[Product]] via [[InventoryItem]] via [[Flow]] |
| Quantity wasted | [[Flow]] `quantity` + `unit` |
| Reason | [[WasteEvent]] `waste_reason` with badge/icon |
| Cost | [[WasteEvent]] `total_cost` |
| Logged by | [[Flow]] `performed_by` → [[User]] display name (from Clerk) |
| Photo indicator | 📷 icon if `photo_url` is set |

### Expanded Detail (tap to expand)

Clicking a row expands it inline to show the full waste event context:

**Waste Event Info:**
- Reason with full label (e.g., "Spoiled — went bad before expiry")
- Total cost (with note if derived from batch: "Cost includes recipe inputs")
- Notes (from [[WasteEvent]])
- Photo (displayed inline if captured, tappable to view full size)

**Reason-Specific Detail:**

Displayed based on `waste_reason`, pulling from the appropriate detail table:

| Reason | Fields Shown |
|--------|-------------|
| **Expired** ([[WasteExpiredDetail]]) | Expiry date, days past expiry, where stored, was opened |
| **Spoiled** ([[WasteSpoilageDetail]]) | Expiry date, where stored, container type, days since opened, storage conditions |
| **Damaged** ([[WasteDamageDetail]]) | How damaged, where it happened, packaging issue (yes/no) |
| **Prep failure** ([[WastePrepFailureDetail]]) | Which [[Recipe]], which [[BatchEvent]], what went wrong, who was prepping |
| **Spilled** ([[WasteSpillDetail]]) | Where spilled, how spilled, during what activity |
| **Other** ([[WasteOtherDetail]]) | Freeform description |

**Flow Context:**
- When it was logged (date + time)
- Who logged it (name, avatar from Clerk)
- Item's location at time of waste

---

## Export

A persistent "Export" button in the filter bar. Exports the currently filtered waste data as a CSV or Excel file.

### Export Contents

One row per waste event, columns include:

| Column | Source |
|--------|--------|
| Date | Flow `performed_at` |
| Product name | Product name |
| Brand | Product brand |
| Category | Effective category |
| Quantity | Flow quantity + unit |
| Reason | WasteEvent `waste_reason` |
| Cost | WasteEvent `total_cost` |
| Location | Space path at time of waste |
| Logged by | User display name |
| Notes | WasteEvent notes |
| Reason-specific fields | Flattened from the detail table (columns vary by reason — empty for non-applicable reasons) |

### Use Case

At Haywire, a manager exports monthly waste data: filter to "Last month" → Export → opens in Excel → reviews with the team → identifies that spoilage in the walk-in cooler spiked → investigates the cooler temperature.

---

## Data Model Touchpoints

| Entity | Operation | When |
|--------|-----------|------|
| [[WasteEvent]] | Read | All layers — summary, charts, log |
| [[Flow]] | Read (join from WasteEvent) | Deriving quantity, cost, user, timestamp, item |
| [[InventoryItem]] | Read (join from Flow) | Product and location context |
| [[Product]] | Read | Product name, brand, category |
| [[Category]] | Read | Category filter and breakdown |
| [[Space]] | Read | Location filter and breakdown |
| [[User]] | Read (via Clerk API) | Display name for "logged by" and crew member filter |
| [[CrewMember]] | Read | Crew member filter (including soft-deleted for historical) |
| [[WasteExpiredDetail]] | Read | Expanded detail for expired events |
| [[WasteSpoilageDetail]] | Read | Expanded detail for spoiled events |
| [[WasteDamageDetail]] | Read | Expanded detail for damaged events |
| [[WastePrepFailureDetail]] | Read | Expanded detail for prep failure events |
| [[WasteSpillDetail]] | Read | Expanded detail for spilled events |
| [[WasteOtherDetail]] | Read | Expanded detail for other events |
| [[Recipe]] | Read | Prep failure detail — recipe name |
| [[BatchEvent]] | Read | Prep failure detail — batch reference |

> **No new entities, no writes.** This journey is entirely read-only. All data was created by [[Journey - Logging Waste]].

---

## See Also

- [[Journey - Logging Waste]] — where waste data is captured (this journey consumes that data)
- [[Journey - Expiry Management]] — triage tab links to waste history for pattern analysis
- [[Journey - Cost Reporting]] — waste costs are a component of the broader cost reporting journey (#23)
- [[WasteEvent]] — slim entity, joins to [[Flow]] for most fields
- [[Cost Data Flow]] — waste cost includes derived costs for batch-produced items
- [[Feature 6 - Waste Tracking]] — feature-level overview
