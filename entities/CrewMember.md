# CrewMember

> Part of [[Feature 1 - Multi-Organization Tenancy]]

Join table linking [[User]]s to [[Crew]]s. Carries role and permission data.

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `crew_member_id` | PK | |
| `crew_id` | FK → [[Crew]] | |
| `user_id` | text FK → [[User]] | Clerk user ID |
| `role` | enum | Admin \| Member \| Viewer (default permissions) |
| `permission_overrides` | JSON | Per-feature granular overrides |
| `kiosk_pin` | text (hashed) | Nullable — used for [[KioskSession]] identification |
| `joined_at` | timestamp | |
| `updated_at` | timestamp | Auto-maintained by trigger |
| `deleted_at` | timestamp | Nullable — soft delete. Former members still appear in historical attribution. |

## Key Decisions

- Roles provide sensible defaults; per-feature overrides allow fine-grained control (e.g., a Member who can edit inventory but not recipes)
- `kiosk_pin` is optional — only needed if the [[Crew]] uses PIN-based kiosk identification
- `user_id` is a text field matching Clerk's string-based user ID, not a UUID or integer
- **Soft delete:** A member who leaves should still appear in historical `performed_by` / `logged_by` attribution

## Relationships

- Belongs to [[Crew]]
- Belongs to [[User]]
- `kiosk_pin` used by [[KioskSession]] for PIN-based identification
