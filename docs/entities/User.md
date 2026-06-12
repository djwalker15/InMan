# User

> Part of [[Feature 1 - Multi-Organization Tenancy]]

A local reference to an authenticated individual managed by **Clerk**. Clerk handles email, display name, avatar, password, social login, MFA, and session management. This table exists only to anchor foreign keys and store app-specific data that Clerk doesn't manage.

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `user_id` | text PK | Clerk's string-based user ID (e.g., `user_2abc123...`). Matches the `sub` claim in the JWT. |
| `created_at` | timestamp | When this user first appeared in InMan |
| `deletion_requested_at` | timestamp, nullable | When the user clicked "Delete account" in Settings (set before the soft-delete commits). |
| `deleted_at` | timestamp, nullable | Soft-delete commit timestamp. Set by `request_account_deletion()`. Restore is allowed within 30 days of this value. |

> **What lives in Clerk (not stored here):** email, display_name, avatar_url, password, MFA settings, social login providers, session tokens.

## Deletion Lifecycle

User-account deletion is a **soft-delete with a 30-day restore window**, mirroring the 48-hour crew-deletion pattern but extended for "undo delete" UX.

1. User clicks **Delete account** in Settings → reauth via Clerk → confirms in the UI (Slice 4 of ClickUp 86e1c0hnp).
2. Edge function `delete-account` (Slice 3) calls `request_account_deletion(transfer_to_user_id)` (Slice 2). The RPC sets `users.deleted_at = now()`, cascades soft-deletes across `crew_members`, handles the three crew-ownership branches (transfer / ownerless flag / solo soft-delete), and commits atomically.
3. Edge function then calls Clerk's `users.deleteUser()` — Clerk-side PII (email, display name, avatar, sessions) is purged.
4. **Restore window — 30 days.** If the same Clerk `sub` re-authenticates inside the window, `check_restore_eligibility()` (Slice 3) detects via `deleted_at`, and `restore_account()` (Slice 2) clears `deleted_at` / `deletion_requested_at`. Note: restored accounts do *not* un-cascade their crew memberships — those crews may have already been transferred, marked ownerless, or soft-deleted.
5. After 30 days, the daily `process_due_user_deletions()` pg_cron job reports the row as past the cool-down. **The `users` row itself stays as a tombstone** — it has no PII (those live in Clerk) and 12+ immutable ledger tables (`flows.performed_by`, `batch_events.performed_by`, etc.) FK to `user_id`. Per the resolved decision in [[CLAUDE]] §"User Account Deletion," immutable-ledger `created_by` / `performed_by` attribution is preserved indefinitely — no anonymization.
6. Re-signup with the same email post-cool-down gets a fresh tenant because Clerk does not reuse `sub` values.

## Auth Integration

InMan uses **Clerk** as a third-party authentication provider with **Supabase**. Clerk issues JWTs containing the user's ID as the `sub` claim. Supabase verifies these tokens and makes the ID available via `auth.jwt()->>'sub'` in RLS policies. Since Clerk uses string-based IDs (not UUIDs), `auth.uid()` cannot be used — all RLS policies must reference `auth.jwt()->>'sub'` instead.

## Relationships

- Has many [[CrewMember]] records (one per [[Crew]] they belong to)
- Referenced as `performed_by` (text FK) on [[Flow]], [[BatchEvent]]
- Referenced as `created_by` (text FK) on [[Recipe]], [[RecipeVersion]], [[ShoppingList]], [[ShoppingListItem]], [[Crew]], [[Product]], [[SpaceTemplate]], [[KioskSession]]
- Referenced as `checked_by` (text FK) on [[ShoppingListItem]]
- Referenced as `prepped_by` (text FK) on [[WastePrepFailureDetail]]

> **Note:** [[WasteEvent]] no longer directly references User. The `logged_by` attribution is derived by joining WasteEvent → [[Flow]] → `performed_by`.

## See Also

- [[User Attribution]] — every state-changing action captures `performed_by`
- [[KioskSession]] — lightweight identification via PIN or name select
