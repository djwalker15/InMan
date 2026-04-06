# User Journey: Expiry Management

> Covers the full expiry lifecycle — setting dates, proactive FIFO planning, and triage of expiring/expired items
> Referenced by [[InMan User Journeys]] #8

---

## Overview

Expiry Management is a dedicated workflow for managing item shelf life across three concerns:

1. **Set expiry dates** — get dates onto items that don't have them (batch update + prompted during intake)
2. **Proactive planning (FIFO)** — surface which items should be used first based on nearest expiry
3. **Triage** — review expiring/expired items and decide: use it, waste it, extend the date, or ignore

The dedicated Expiry Management page (`/expiry`) provides a comprehensive view that goes beyond the Checking Stock alerts summary. The alerts summary surfaces counts ("3 expiring, 1 expired"), while this page is the full management workflow.

---

## Entry Points

| Entry Point | What Happens |
|-------------|-------------|
| **Nav item** — "Expiry" in the main navigation | Opens the dedicated Expiry Management page |
| **Dashboard widget** — expiry alert counts | Links to the Expiry Management page, pre-filtered to the relevant urgency tier |
| **Checking Stock alerts** — "Expiring Soon" or "Expired" groups | Links to the Expiry Management page, pre-filtered |

---

## Tiered Expiry Thresholds

Expiry urgency is tiered, not binary. Thresholds are **configurable per [[Crew]]** via `settings` JSON:

| Tier | Default Threshold | Visual | Meaning |
|------|-------------------|--------|---------|
| 🔴 **Expired** | Past `expiry_date` | Red | Already expired — triage immediately |
| 🟠 **Urgent** | Within 3 days | Orange | Expiring very soon — use or waste |
| 🟡 **Warning** | Within 7 days | Yellow | Expiring soon — plan to use |
| 🔵 **Heads Up** | Within 30 days | Blue | Approaching expiry — be aware |
| ✅ **OK** | More than 30 days | Green/none | No action needed |

Admins/Owners configure these thresholds in [[Journey - Crew Management]] → Crew Settings. The thresholds apply to all [[InventoryItem]]s within the [[Crew]].

**Configuration stored in:** [[Crew]] `settings` JSON:
```json
{
  "expiry_thresholds": {
    "urgent_days": 3,
    "warning_days": 7,
    "heads_up_days": 30
  }
}
```

No new database fields needed — thresholds are applied at query time by comparing `expiry_date` against the current date.

---

## The Expiry Management Page (`/expiry`)

Three tabs/sections:

### Tab 1 — Triage (items needing attention)

Shows all [[InventoryItem]]s in the 🔴 Expired, 🟠 Urgent, and 🟡 Warning tiers, sorted by urgency (most urgent first, then by date within each tier).

Each item row shows:

| Column | Data |
|--------|------|
| Product name + brand | From [[Product]] |
| Quantity | Current cached quantity + unit |
| Expiry date | With relative label ("Expired 2 days ago", "Expires tomorrow", "Expires in 5 days") |
| Urgency tier | 🔴 🟠 🟡 badge |
| Location | `current_space_id` path |
| FIFO indicator | ⚠️ if a newer item of the same Product exists with a later expiry (see FIFO section) |

**Triage actions per item:**

| Action | What It Does | Links To |
|--------|-------------|----------|
| **Use it** | Log a consumption [[Flow]]. Quantity deducted from inventory. | Quick inline — just confirm quantity consumed. |
| **Waste it** | Opens waste logging with item pre-selected, reason pre-set to `expired` | [[Journey - Logging Waste]] (expired entry point) |
| **Extend date** | Update `expiry_date` to a new date. For items that are still usable past the printed date. | Inline date picker. No [[Flow]] — metadata update only. |
| **Dismiss** | Remove from triage view for this session (item stays in inventory, expiry unchanged). Reappears next time. | No data change — UI-only dismissal. |

**Batch triage:** Select multiple items via checkboxes, then:
- **"Waste all selected"** → opens [[Journey - Logging Waste]] with all selected items queued, reason = expired for each
- **"Extend all selected"** → set a single new expiry date applied to all

### Tab 2 — FIFO Planning (use these first)

Shows all [[InventoryItem]]s that have an `expiry_date` set, grouped by [[Product]]. Within each Product group, items are sorted by **nearest expiry first** — this is the FIFO order.

**Key insight:** When a [[Crew]] has multiple [[InventoryItem]]s for the same [[Product]] (e.g., two bottles of olive oil), FIFO highlights which one should be used first.

| Product | Items | Nearest Expiry | FIFO Alert |
|---------|-------|----------------|------------|
| **Olive Oil, 16 oz** | | | |
| → Pantry > Shelf 2 | 1 bottle | Apr 15, 2026 | ✅ Use this first |
| → Back > Above > Cabinet 1 | 1 bottle | Jun 22, 2026 | |
| **Cholula Hot Sauce, 5 oz** | | | |
| → Pantry > Shelf 2 | 1 bottle | May 3, 2026 | ✅ Use this first |
| → Countertop | 1 bottle | Jul 10, 2026 | |
| **Heavy Cream, 16 oz** | | | |
| → Fridge > Main | 1 carton | Apr 8, 2026 (🟠 Urgent) | ⚠️ Use immediately |

**FIFO alert levels:**
- **⚠️ Use immediately** — nearest-expiry item is in the 🔴 or 🟠 tier
- **✅ Use this first** — nearest-expiry item has a closer date than others of the same Product
- No alert if there's only one item of that Product (no FIFO decision to make)

**Actions from FIFO view:**
- **Use it** → consumption Flow, quantity deducted
- **Move to front** → if the nearest-expiry item is in a less accessible location, trigger a move to bring it forward (links to [[Journey - Moving Items]] single item move)

### Tab 3 — Missing Dates (items without expiry)

Shows all [[InventoryItem]]s where `expiry_date` is null, so the user can set dates in bulk.

| Product | Quantity | Location | Set Expiry |
|---------|----------|----------|------------|
| Tony Chachere's Seasoning | 2 count | Pantry > Shelf 4 | [Date picker] |
| Jasmine Rice, 2 lb | 1 pkg | Pantry > Shelf 1 | [Date picker] |
| Olive Oil, 16 oz | 1 bottle | Back > Above > Cabinet 1 | [Date picker] |

**Batch update:** "Select all" → "Set expiry for all" → single date picker applied to all selected items.

**Skip option:** Not all items need expiry dates (salt doesn't expire). A "No expiry needed" toggle per item marks it as intentionally without a date and removes it from this list. This could be stored as a flag on [[InventoryItem]] or as a convention (`expiry_date` set to a far-future sentinel value).

**Save:** Updates `expiry_date` on each [[InventoryItem]] where a date was entered. No [[Flow]] — this is metadata, not a movement or quantity change.

---

## Prompted During Intake

In addition to the dedicated page, the system prompts for expiry dates during [[Journey - Adding Inventory]] and [[Journey - Intake Session]]:

- In the **inventory details form** (Adding Inventory Step 2), the `expiry_date` field is always visible and labeled: "Expiry date (if applicable)"
- In the **Intake Session** item processing, each row includes an optional expiry date column
- If a [[Product]] has previously had expiry dates set on its [[InventoryItem]]s, the system can suggest: "Previous items of this product had expiry dates. Add one?"

This is a gentle prompt, not a requirement — the user can always skip.

---

## FIFO in Other Journeys

The FIFO concept extends beyond this page. When other journeys need to pick which [[InventoryItem]] to consume from (and multiple items of the same [[Product]] exist):

- **[[Journey - Cooking a Meal]]** — when deducting ingredients, suggest the nearest-expiry item first
- **[[Journey - Logging Waste]]** — when selecting an item to waste, show expiry dates to help the user pick the right one
- **[[Journey - Checking Stock]]** — in the item detail expansion, if multiple items of the same Product exist, show a FIFO note: "You have another [Product] expiring sooner in [location]"

These are UX suggestions, not enforced — the user always chooses.

---

## Data Model Touchpoints

| Entity | Operation | When |
|--------|-----------|------|
| [[InventoryItem]] | Read | All tabs — listing items with expiry info |
| [[InventoryItem]] | Update (`expiry_date`) | Extend date (Tab 1), set missing dates (Tab 3) |
| [[InventoryItem]] | Update (cached quantity) | "Use it" action (consumption Flow) |
| [[Flow]] | Insert (consumption) | "Use it" action |
| [[Flow]] | Insert (waste) | "Waste it" action (via [[Journey - Logging Waste]]) |
| [[WasteEvent]] | Insert | "Waste it" action |
| [[Product]] | Read | Grouping by product for FIFO (Tab 2) |
| [[Space]] | Read | Location display |
| [[Crew]] | Read (`settings`) | Expiry threshold configuration |

> **No new entities introduced.** Tiered thresholds live in [[Crew]] `settings` JSON. All operations use existing tables. FIFO ordering is a query-time calculation, not stored data.

---

## See Also

- [[Journey - Checking Stock]] — alerts summary surfaces expiry counts; this page is the full management workflow
- [[Journey - Logging Waste]] — "Waste it" action from triage links here with reason = expired
- [[Journey - Adding Inventory]] — prompted for expiry date during item creation
- [[Journey - Intake Session]] — prompted for expiry date during intake
- [[Journey - Cooking a Meal]] — FIFO suggestions when picking ingredients
- [[Journey - Crew Management]] — expiry threshold configuration in Crew settings
- [[Feature 4 - Inventory Level Tracking]] — expiry alerts as part of inventory level monitoring
