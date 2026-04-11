# User Journey: Kiosk Daily Use

> Covers the day-to-day kiosk experience — identification, performing allowed actions, and session management
> Referenced by [[InMan User Journeys]] #21

---

## Overview

Kiosk Daily Use is the staff-facing experience on an enrolled device. The device is always in kiosk mode — no Clerk login, no full app access. Staff identify themselves via name + PIN (two-step), then perform only the actions the admin has enabled for this kiosk.

All kiosk actions go through **Supabase edge functions** using the kiosk token. The edge function validates the token, executes the operation using the service role key, and sets `performed_by` from the identified crew member.

---

## Identification Flow

Every kiosk interaction starts with identification. After a configurable inactivity timeout, the kiosk returns to this screen.

### Step 1 — Select Your Name

A list of all active [[CrewMember]]s in this [[Crew]]:

```
Who are you?

[Davontae]  [Marcus]  [Sarah]  [Alex]
```

Displayed as large, tappable buttons — optimized for quick selection during busy service.

### Step 2 — Enter Your PIN

```
Hi Davontae! Enter your PIN:

[• • • •]    [1] [2] [3]
              [4] [5] [6]
              [7] [8] [9]
              [    0    ]
```

4+ digit PIN matched against `kiosk_pin` on [[CrewMember]] (hashed comparison via edge function).

**On incorrect PIN:** "Incorrect PIN. Try again." with retry limit (configurable, default 5 attempts before lockout for that member for 5 minutes).

**On correct PIN:** Kiosk home screen renders with the user's name displayed. All subsequent actions attribute `performed_by` = this user.

### Inactivity Timeout

After a configurable period of no interaction (default 2 minutes), the kiosk returns to the "Select your name" screen. The previous user's session context is cleared. This prevents one person's identification from carrying over to another person's actions.

---

## Kiosk Home Screen

After identification, the home screen shows only the **allowed actions** for this kiosk, displayed as large tappable tiles:

```
Haywire Bar · Bar Tablet                     Davontae ✓

[📦 Check Stock]  [🗑️ Log Waste]  [📍 Put Back]

[👨‍🍳 Start Batch]  [📋 Shopping List]  [📅 Expiry Check]
```

Only enabled actions appear. The layout adapts to how many actions are configured (2 actions = 2 large tiles, 9 actions = 3×3 grid).

**Persistent header:** Device name, Crew name, identified user. "Switch user" button returns to the identification screen.

---

## Kiosk Action Flows

Each action uses the same journey logic as the full app, but with a **simplified, touch-optimized UI** scoped to the kiosk's Premises. Key differences from the full app:

### General Kiosk Adaptations

- **Premises-scoped:** All Space browsers/dropdowns are pre-filtered to this kiosk's Premises (and its descendants). No access to other Premises.
- **Touch-optimized:** Larger buttons, simplified forms, fewer optional fields
- **No navigation away:** Each action completes and returns to the home screen. No deep app navigation.
- **Attribution:** Every operation sets `performed_by` = the identified crew member, routed through edge functions
- **Offline resilience (future):** Queue actions locally if network drops, sync when reconnected

### Action: Check Inventory (`check_inventory`)

Simplified version of [[Journey - Checking Stock]]:
- Search by name or browse by Space (within this Premises)
- View item detail: quantity, location, expiry, stock status
- **No inline edit actions** (unless those specific actions are also enabled on this kiosk)
- If `log_waste` is also enabled: "Log waste" appears on items
- If `put_back` is also enabled: "Put back" appears on displaced items

### Action: Add Inventory (`add_inventory`)

Simplified version of [[Journey - Adding Inventory]]:
- Search or scan product → set quantity → assign location (within this Premises)
- Stay-in-flow for multiple items
- Product creation limited to crew-private (no master catalog submissions from kiosk)

### Action: Move Items (`move_items`)

Simplified version of [[Journey - Moving Items]] Scenario 1:
- Select item → pick new location (within this Premises)
- Single-item moves only — no bulk reassign or reorganize from kiosk

### Action: Put Back (`put_back`)

Simplified version of [[Journey - Moving Items]] Scenario 2:
- Shows all displaced items at this Premises
- Checklist: select items that have been put back → confirm
- Batch transfer Flows created via edge function

### Action: Log Waste (`log_waste`)

Simplified version of [[Journey - Logging Waste]]:
- Select item (search or browse within Premises)
- Select reason (6 options)
- Reason-specific detail form (simplified — fewer optional fields)
- Quantity (smart defaults)
- Photo (optional)
- Confirmation step
- Stay-in-flow for multiple waste events

### Action: Expiry Triage (`expiry_triage`)

Simplified version of [[Journey - Expiry Management]] Tab 1:
- Shows expired and urgent items at this Premises
- Per-item actions: Use it, Waste it (→ log_waste flow), Extend date
- No FIFO planning or missing dates tabs (those are admin tasks)

### Action: Start Batch (`start_batch`)

Simplified version of [[Journey - Cooking a Meal]]:
- Select recipe → scale → review ingredients → cook with progressive deduction → complete
- Recipes filtered to this Crew
- Ingredient sources scoped to this Premises where possible
- Store-intent batching also available if [[Journey - Prepping for Storage]] makes sense for the context

### Action: View Shopping List (`view_shopping_list`)

Read-only version of [[Journey - Building a Shopping List]]:
- View active shopping lists for this Crew
- See items, quantities, check-off status
- **Cannot add or modify** — view only (shopping list management is a full-app task)

### Action: Intake Session (`intake_session`)

Simplified version of [[Journey - Intake Session]]:
- Start from a shopping list or from scratch
- Sequential processing (scan/search items one at a time)
- Location assignment scoped to this Premises
- Complete session → atomic edge function processes all items

---

## Edge Function Architecture

Every kiosk action is routed through Supabase edge functions:

```
Device → Edge Function (with kiosk token in header)
  1. Hash token, validate against kiosk_sessions (is_active = true)
  2. Extract crew_id, premises_id, allowed_actions from session
  3. Verify the requested action is in allowed_actions
  4. Execute the operation using service role key (bypasses RLS)
  5. Set performed_by = identified crew member's user_id
  6. Return result to device
```

**Why edge functions?** The kiosk has no Clerk JWT, so it can't make direct Supabase queries (RLS would block everything). The edge function acts as a trusted intermediary, validating the kiosk token and executing operations on behalf of the identified user.

---

## Data Model Touchpoints

| Entity | Operation | When |
|--------|-----------|------|
| [[KioskSession]] | Read | Boot sequence, token validation on every action |
| [[CrewMember]] | Read | Name list for identification, PIN validation |
| All action-relevant entities | Read/Write | Depends on which action is performed — same entities as the full-app journey, routed through edge functions |

---

## See Also

- [[Journey - Kiosk Enrollment]] — how the device gets set up
- [[Journey - Kiosk Administration]] — managing devices, changing actions, viewing activity
- [[KioskSession]] — token architecture, allowed_actions schema
- [[CrewMember]] — `kiosk_pin` for identification
- All referenced journeys (Checking Stock, Adding Inventory, Moving Items, Logging Waste, Expiry Management, Cooking a Meal, Building a Shopping List, Intake Session) — kiosk versions are simplified adaptations of these
