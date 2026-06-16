# Feedback

> Part of [[Feature 13 - In-App Feedback]]

A piece of feedback submitted from inside the app via the "Send feedback" entry in the sidenav. App-meta table — it is **not** part of the inventory journey graph. Every submission is persisted here for an audit trail and then auto-filed as a task in the ClickUp **InMan → 📥 Inbox** list by the `submit-feedback` edge function.

Mutable: the `clickup_*` columns are patched by the edge function (service role) after the ClickUp task is created, so the table carries `updated_at`.

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `feedback_id` | PK (uuid) | |
| `crew_id` | FK → [[Crew]] | Nullable — user may submit with no active crew |
| `submitted_by` | text FK → [[User]] | Clerk `sub`; DB-defaulted from `auth.jwt()->>'sub'`, pinned by RLS |
| `feedback_type` | enum | `bug` \| `idea` \| `question` |
| `message` | text | 1–4000 chars |
| `contact_ok` | boolean | "OK to follow up with me about this" consent |
| `context` | jsonb | `{ route, user_agent, viewport: {w,h}, app_version }` — captured silently |
| `screenshot_path` | text | Nullable — object path in the private `feedback-screenshots` bucket |
| `clickup_task_id` | text | Nullable — set after the ClickUp task is filed |
| `clickup_task_url` | text | Nullable — link to the filed task |
| `clickup_sync_error` | text | Nullable — set if the ClickUp call failed (row is still kept) |
| `created_at` | timestamp | |
| `updated_at` | timestamp | Auto-maintained |

## Lifecycle

1. User opens the feedback sheet, picks a type, writes a message, optionally attaches a screenshot, optionally consents to follow-up.
2. Client uploads any screenshot to `feedback-screenshots/<submitted_by>/<uuid>.<ext>` (storage RLS scopes uploads to the user's own prefix).
3. Client calls the `submit-feedback` edge function, which inserts this row (user-context client → RLS enforced).
4. The function files a ClickUp task (token server-side only) and patches `clickup_task_id` / `clickup_task_url`, or records `clickup_sync_error` and still returns success so the submission is never lost.

## Key Decisions

- **ClickUp token never reaches the browser** — it lives only as a Supabase function secret (`CLICKUP_API_TOKEN`); the Inbox list id defaults to `901714372658` (overridable via `CLICKUP_FEEDBACK_LIST_ID`).
- **Submissions are durable** — a ClickUp outage records `clickup_sync_error` rather than failing the user's submit.
- **Submitter-scoped visibility** — RLS SELECT exposes only the caller's own rows; triage happens in ClickUp, not the app.

## Relationships

- Optionally belongs to [[Crew]]
- Submitted by [[User]] (`submitted_by`)
