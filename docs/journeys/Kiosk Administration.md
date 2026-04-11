# User Journey: Kiosk Administration

> Covers managing enrolled kiosk devices — editing config, deactivating, re-enrolling, and viewing activity
> Referenced by [[InMan User Journeys]] #22

---

## Overview

Kiosk Administration is the admin-facing management of enrolled devices. It lives on a dedicated page (`/admin/kiosks`) accessible by Owners and Admins. From here, admins can edit kiosk configurations, deactivate/reactivate devices, delete kiosk sessions, and view activity logs showing what each device (and which staff member) has been doing.

---

## Entry Point

| Entry Point | Context |
|-------------|---------|
| **Admin area** — "Kiosks" | Kiosk management page |
| **Crew Settings** — "Kiosk Devices" tab | Link to kiosk management |

---

## Kiosk Management Page (`/admin/kiosks`)

### Device List

Shows all [[KioskSession]]s for the current [[Crew]]:

| Device | Premises | Status | Actions Enabled | Last Activity | Enrolled By | Enrolled |
|--------|----------|--------|----------------|---------------|-------------|----------|
| Bar Tablet | Main Bar | 🟢 Active | 6 of 9 | 5 min ago | Davontae | Mar 15 |
| Kitchen iPad | Main Bar | 🟢 Active | 9 of 9 | 2 hours ago | Davontae | Mar 15 |
| Host Stand | Patio | 🔴 Inactive | 3 of 9 | Mar 25 | Marcus | Mar 20 |
| Old Tablet | Main Bar | 🗑️ Deleted | — | Mar 10 | Davontae | Feb 1 |

Deleted kiosks are shown with a toggle ("Show deleted") for audit purposes. They appear grayed out.

---

## Admin Actions

### Edit Configuration

Change a kiosk's settings without re-enrolling the device.

**Editable fields:**
| Field | Notes |
|-------|-------|
| Device name | Rename the device |
| Premises | Change which Premises this kiosk is bound to (rare — usually means the device physically moved) |
| Allowed actions | Add or remove actions using the same category + individual toggle UI from enrollment |

**On save:** [[KioskSession]] updated. Changes take effect on the device's **next action** (the edge function reads the config from the DB on every call). No device-side action needed.

### Deactivate

Immediately revokes the kiosk's access without deleting it. The device can be reactivated later.

**Flow:**
1. Confirmation: "Deactivate [Device name]? The device will stop working immediately."
2. Confirm

**On confirm:**
- [[KioskSession]] `is_active` = false
- Next time the device makes any request, the edge function rejects it
- Device falls through to the Clerk login screen (or shows "This kiosk has been deactivated — contact an admin")
- The token remains in device local storage but is now invalid

**Use cases:** Suspected security issue, temporary shutdown, device no longer in use.

### Reactivate

Restore a deactivated kiosk.

**Flow:**
1. Confirmation: "Reactivate [Device name]? It will resume with its current configuration."
2. Confirm

**On confirm:**
- [[KioskSession]] `is_active` = true
- If the device still has the token in local storage, it resumes working on next app load
- If the token was cleared (device was reset), re-enrollment is needed

### Delete

Permanently remove the kiosk session. Soft-deletes the record.

**Flow:**
1. Confirmation: "Delete [Device name]? This cannot be undone. The device will need to be re-enrolled to use kiosk mode again."
2. Confirm

**On confirm:**
- [[KioskSession]] soft-deleted (`deleted_at` set)
- Token is permanently invalidated
- Historical activity attributed to this kiosk remains in Flows and other records

### Re-Enroll

Generate a new token for an existing kiosk (when the device's local storage was cleared).

**Flow:**
1. Admin navigates to the enrollment URL **on the target device**
2. Authenticates via Clerk
3. Selects "Re-enroll existing device" → picks the KioskSession from the list
4. System generates a new token, hashes it, updates `token_hash` on the KioskSession
5. Old token is immediately invalidated
6. New token stored in device local storage
7. Kiosk resumes with existing configuration

**Data touched:** [[KioskSession]] update (`token_hash`). All other config stays the same.

---

## Activity Log

Each kiosk has an activity log showing what's been done on that device.

### Device Activity View

Tap a device → "View Activity"

| Time | User | Action | Detail |
|------|------|--------|--------|
| 10:32 AM | Marcus | Log waste | Lime Juice, 4 oz, spilled |
| 10:15 AM | Sarah | Put back | 3 items returned to home |
| 9:48 AM | Marcus | Check stock | Searched "tequila" |
| 9:30 AM | Davontae | Start batch | Margaritas, 3× |

**Filters:**
- Date range
- Crew member
- Action type

**Data source:** [[Flow]]s and other action records where `performed_by` matches crew members who identified on this kiosk. Attribution is per-user, not per-device — the device is inferred from the kiosk token used in the edge function call.

> **Note:** Activity attribution tracks *who* did *what*, but the kiosk device context is not stored on the Flow itself. To reconstruct "what happened on the Bar Tablet," the system would need to log the kiosk session alongside each action. This could be a `kiosk_session_id` on Flow (future enhancement) or derived from edge function logs.

### Cross-Device Activity View

"View all kiosk activity" — combined log across all devices, filterable by device, user, action type, and date.

---

## Kiosk Health Dashboard (Future Enhancement)

A summary view showing:
- **Active devices:** count and status
- **Last activity per device:** detect stale/unused kiosks
- **Action volume:** how many actions per day/week per kiosk
- **Identification frequency:** how often each crew member uses kiosk mode
- **Error rate:** failed token validations, PIN lockouts

---

## Data Model Touchpoints

| Entity | Operation | When |
|--------|-----------|------|
| [[KioskSession]] | Read | Device list, activity context |
| [[KioskSession]] | Update | Edit config, deactivate/reactivate, re-enroll (token_hash) |
| [[KioskSession]] | Soft delete | Delete device |
| [[Flow]] | Read | Activity log (actions performed through this kiosk) |
| [[WasteEvent]] | Read | Activity log (waste details) |
| [[BatchEvent]] | Read | Activity log (batch details) |
| [[CrewMember]] | Read | Activity log (user display names) |
| [[User]] | Read (Clerk) | Display names in activity log |

---

## See Also

- [[Journey - Kiosk Enrollment]] — how devices get enrolled (this journey manages them after enrollment)
- [[Journey - Kiosk Daily Use]] — the staff-facing experience on enrolled devices
- [[KioskSession]] — entity definition with token architecture and allowed_actions
- [[Journey - Crew Management]] — broader admin context
