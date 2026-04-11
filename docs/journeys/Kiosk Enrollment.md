# User Journey: Kiosk Enrollment

> Covers the full device enrollment lifecycle — initial setup, multi-device management, re-enrollment, and token architecture
> Referenced by [[InMan User Journeys]] #20

---

## Overview

Kiosk Enrollment sets up a physical device (tablet, iPad) as an unattended InMan terminal. The device operates independently of any Clerk session using a token-based auth mechanism (Path B). A [[Crew]] can have **multiple kiosks** enrolled simultaneously, each with different allowed actions and scoped to a specific Premises.

The basic enrollment flow is covered in [[Journey - Onboarding]] Path C. This journey covers the full depth: multi-device management, the allowed actions vocabulary, re-enrollment after device wipe, and the token lifecycle.

---

## Entry Points

| Entry Point | Context |
|-------------|---------|
| **Kiosk management page** (`/admin/kiosks`) — "Enroll New Device" | Full enrollment flow |
| **Onboarding Path C** (`/kiosk/enroll`) | First-time kiosk setup (simplified) |

---

## Enrollment Flow

### Step 1 — Admin Authenticates

The admin navigates to the enrollment URL **on the target device** and signs in via Clerk. Must be an Owner or Admin of at least one [[Crew]].

### Step 2 — Select Crew

If the admin belongs to multiple Crews, they select which one this kiosk is for. Single-Crew admins skip this step.

### Step 3 — Select Premises

Pick which [[Space]] (unit_type = `premises`) this kiosk is bound to. If the Crew has one Premises, it's pre-selected. If multiple (e.g., Haywire has a main bar and a patio bar), the admin chooses.

### Step 4 — Name the Device

| Field | Required | Notes |
|-------|----------|-------|
| Device name | Yes | e.g., "Bar Tablet", "Kitchen iPad", "Host Stand" |

The name is used in the kiosk management list and in activity attribution ("Logged from Bar Tablet").

### Step 5 — Configure Allowed Actions

The admin selects which actions this kiosk can perform. Presented as **categories with expandable individual actions**:

#### Action Vocabulary

| Category | Actions | Description |
|----------|---------|-------------|
| **Inventory** | `check_inventory` | View stock levels, search items, browse by Space |
| | `add_inventory` | Add new items or restock existing ones |
| | `move_items` | Move items between Spaces |
| | `put_back` | Put displaced items back to their home locations |
| **Waste** | `log_waste` | Log waste events with reason-specific details |
| | `expiry_triage` | Review and act on expiring/expired items |
| **Cooking & Prep** | `start_batch` | Start a consume or store-intent batch from a recipe |
| **Shopping** | `view_shopping_list` | View shopping lists (read-only) |
| | `intake_session` | Start or continue an intake session (receiving deliveries) |

**Category-level toggles:** Enable/disable an entire category at once. Individual action toggles allow fine-tuning (e.g., enable all Inventory actions except `add_inventory`).

**Presets:** Quick-start configurations:
- **Bar kiosk** — log_waste, check_inventory, put_back, start_batch, view_shopping_list
- **Kitchen kiosk** — all actions enabled
- **View-only kiosk** — check_inventory, view_shopping_list only
- **Custom** — start from scratch

### Step 6 — Confirm and Enroll

Summary screen:

| Field | Value |
|-------|-------|
| Crew | Haywire Bar |
| Premises | Main Bar |
| Device name | Bar Tablet |
| Allowed actions | 6 of 9 enabled |
| Auth method | Name select → PIN confirm (always) |

Admin taps "Enroll Device."

### On Enrollment

1. System generates a unique kiosk token (cryptographically random)
2. Token is **hashed** and stored in [[KioskSession]] (`token_hash`)
3. Raw token is stored in the **device's local storage** (never sent to or stored on the server)
4. [[KioskSession]] created: `crew_id`, `premises_id`, `device_name`, `allowed_actions` JSON, `token_hash`, `is_active` = true, `created_by` = admin's user_id
5. Admin's Clerk session is **no longer needed** — the kiosk token takes over
6. Device immediately enters kiosk mode (boot sequence detects the token)

---

## Boot Sequence

On every app load, the device checks for kiosk mode:

1. Check local storage for a kiosk token
2. If found → send token to a Supabase edge function
3. Edge function hashes the received token, queries `kiosk_sessions` for a match where `is_active = true`
4. **Valid** → return kiosk config (crew_id, premises_id, allowed_actions) → render kiosk UI
5. **Invalid** (no match, or `is_active = false`) → clear local storage → fall through to normal Clerk login
6. **Network error** → show offline message, retry on reconnect

---

## Multi-Device Management

A Crew can have multiple active kiosks. The kiosk management page (`/admin/kiosks`) shows all enrolled devices:

| Device | Premises | Status | Actions | Enrolled | Enrolled By |
|--------|----------|--------|---------|----------|-------------|
| Bar Tablet | Main Bar | 🟢 Active | 6 of 9 | Mar 15 | Davontae |
| Kitchen iPad | Main Bar | 🟢 Active | 9 of 9 | Mar 15 | Davontae |
| Host Stand | Patio | 🔴 Inactive | 3 of 9 | Mar 20 | Marcus |

Each row has actions: Edit, Deactivate/Reactivate, Delete (covered in [[Journey - Kiosk Administration]]).

---

## Re-Enrollment

If a device's local storage is cleared (factory reset, browser cache cleared, app reinstall), the kiosk stops working — the token is gone. Re-enrollment:

1. Admin navigates to the enrollment URL on the device
2. Admin authenticates via Clerk
3. Two options:
   - **Re-enroll as existing** — select the old KioskSession from the device list → generates a new token, updates the `token_hash`, old token is invalidated
   - **Enroll as new** — creates a fresh KioskSession (old one should be deactivated separately)
4. New token stored in device local storage
5. Kiosk mode resumes

---

## Token Security

| Aspect | Implementation |
|--------|---------------|
| **Token format** | Cryptographically random string (UUID v4 or similar) |
| **Storage on device** | Local storage (browser) or secure storage (native app) |
| **Storage on server** | Only the hash (`token_hash`). Raw token never stored server-side. |
| **Validation** | Edge function hashes received token, compares to `token_hash` |
| **Rotation** | Re-enrollment generates a new token and invalidates the old one |
| **Revocation** | Set `is_active = false` — immediate, no device interaction needed |
| **Brute force** | Rate limiting on the validation edge function |

---

## Data Model Touchpoints

| Entity | Operation | When |
|--------|-----------|------|
| [[KioskSession]] | Insert | New enrollment |
| [[KioskSession]] | Update (`token_hash`) | Re-enrollment |
| [[KioskSession]] | Read | Boot sequence validation, management list |
| [[Crew]] | Read | Crew selection |
| [[Space]] | Read | Premises selection |
| [[User]] | Read (Clerk) | Admin authentication |

---

## See Also

- [[KioskSession]] — entity definition with full token architecture
- [[Journey - Onboarding]] Path C — simplified first-time enrollment
- [[Journey - Kiosk Daily Use]] — what happens after enrollment
- [[Journey - Kiosk Administration]] — managing enrolled devices
