# Feature 13 — In-App Feedback

> **Status:** Implemented (app + schema + edge function). Built to support sharing the released build with clients.

## Problem

The released build is being shared with clients, but there's no way to report a bug or suggest an idea from inside the app. Feedback happens out-of-band (email, verbal), which is slow and loses context — what screen, which crew, what browser. We want a low-friction in-app widget so feedback turns into actionable, well-contextualized tasks with minimal effort for both the client and the maintainer.

## Solution

A **"Send feedback"** entry in the signed-in sidenav opens a bottom [[Sheet]] form. The client picks a **type** (bug / idea / question), writes a message, optionally attaches a **screenshot**, and optionally ticks an **"OK to follow up"** consent box. On submit:

1. Page **context** is captured silently (route, crew_id, user id, browser, viewport).
2. Any screenshot is uploaded to the private `feedback-screenshots` storage bucket.
3. The `submit-feedback` edge function persists a [[Feedback]] row and **auto-files a task into the ClickUp InMan → 📥 Inbox list**, reusing the existing issue-intake triage workflow.
4. A success toast confirms; the row is kept even if the ClickUp call fails.

## Entities

- [[Feedback]] — submission record + ClickUp sync state.

## Where it lives in code

- **Migration:** `supabase/migrations/20260615000000_feedback_slice.sql` — `feedback_type` enum, `feedback` table + RLS, `feedback-screenshots` private bucket + owner-scoped object policies.
- **Edge function:** `supabase/functions/submit-feedback/index.ts` (`verify_jwt = false`, mirrors `delete-account`).
- **Frontend:** `app/src/lib/feedback.ts`, `app/src/components/feedback/feedback-sheet.tsx`, wired through `signed-in-layout.tsx` + `sidenav-content.tsx`.

## Key Decisions

- **ClickUp token is server-side only** — Supabase function secret `CLICKUP_API_TOKEN`; Inbox list id defaults to `901714372658`, overridable via `CLICKUP_FEEDBACK_LIST_ID`.
- **Submissions are durable** — a ClickUp failure records `clickup_sync_error` on the row instead of failing the user's submit.
- **Submitter-scoped RLS** — clients see only their own feedback; triage is done in ClickUp.
- **App-meta, not journey data** — deliberately excluded from the ERD / journey canvas.

## Operator setup (one-time)

1. `supabase secrets set CLICKUP_API_TOKEN=<token>` and deploy `submit-feedback`.
2. Confirm the Inbox list id is current (see [[Feature 1 - Multi-Organization Tenancy]] / project notes for the ClickUp structure).
