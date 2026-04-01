# KioskSession

> Part of [[Feature 11 - Kiosk Mode]]

A device-level session that allows [[CrewMember]]s to interact with the system without full authentication. The device stays logged in to the [[Crew]]; individuals identify via PIN or name selection.

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `session_id` | PK | |
| `crew_id` | FK → [[Crew]] | |
| `premises_id` | FK → [[Space]] | Which Premises this kiosk serves |
| `device_name` | text | |
| `auth_method` | enum | pin \| name_select |
| `allowed_actions` | JSON | Admin-configured whitelist of actions |
| `is_active` | bool | |
| `created_by` | text FK → [[User]] | Clerk user ID — admin who set it up |
| `created_at` | timestamp | |
| `updated_at` | timestamp | Auto-maintained by trigger |
| `deleted_at` | timestamp | Nullable — soft delete |

## Key Decisions

- Kiosk is scoped to a [[Crew]] and a specific Premises ([[Space]])
- Auth method (PIN vs. name tap) is configurable per [[Crew]]
- Allowed actions are configurable per kiosk
- All actions still capture `performed_by` on [[Flow]]s, [[WasteEvent]]s, etc.
- **Soft delete:** Uses `deleted_at`.

## See Also

- [[User Attribution]]
- [[CrewMember]] — `kiosk_pin` field for PIN-based identification
