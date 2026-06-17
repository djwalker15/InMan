-- ============================================================
-- Feedback slice — in-app feedback widget
-- ----------------------------------------------------------------
-- New enum:
--   feedback_type ('bug', 'idea', 'question')
-- New table:
--   feedback (mutable — clickup_* columns patched after the row is
--     created by the submit-feedback edge function)
-- New storage bucket:
--   feedback-screenshots (private) + owner-scoped object policies
--
-- Flow: the client uploads an optional screenshot to the bucket, then
-- calls the `submit-feedback` edge function. The function inserts the
-- feedback row (user-context client, RLS below), files a ClickUp task,
-- and patches clickup_task_id / clickup_task_url (or clickup_sync_error)
-- via the service-role client.
-- ============================================================

-- ------------------------------------------------------------
-- Enum
-- ------------------------------------------------------------
create type public.feedback_type as enum ('bug', 'idea', 'question');

-- ------------------------------------------------------------
-- feedback: app-meta table (not part of the inventory journey graph)
-- ------------------------------------------------------------
create table public.feedback (
  feedback_id        uuid        primary key default gen_random_uuid(),
  -- Nullable: a user may send feedback before/without an active crew.
  crew_id            uuid        null     references public.crews(crew_id),
  -- DB default mirrors the Clerk-sub pattern so the client never sends
  -- identity; RLS still pins it on insert.
  submitted_by       text        not null default (auth.jwt()->>'sub')
                                 references public.users(user_id),
  feedback_type      public.feedback_type not null,
  message            text        not null check (length(message) between 1 and 4000),
  contact_ok         boolean     not null default false,
  -- { route, user_agent, viewport: {w,h}, app_version }
  context            jsonb       null,
  -- Object path within the feedback-screenshots bucket.
  screenshot_path    text        null,
  -- Filled in by the edge function after the ClickUp task is created.
  clickup_task_id    text        null,
  clickup_task_url   text        null,
  clickup_sync_error text        null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index feedback_submitter_idx
  on public.feedback (submitted_by, created_at desc);

create index feedback_crew_idx
  on public.feedback (crew_id, created_at desc)
  where crew_id is not null;

create trigger feedback_set_updated_at
before update on public.feedback
for each row execute function public.set_updated_at();

alter table public.feedback enable row level security;

-- SELECT first (RLS RETURNING trap). Submitter sees their own; admin
-- triage happens in ClickUp, not the app.
create policy feedback_select
on public.feedback
for select
to authenticated
using (submitted_by = (select auth.jwt()->>'sub'));

create policy feedback_insert
on public.feedback
for insert
to authenticated
with check (
  submitted_by = (select auth.jwt()->>'sub')
  and (crew_id is null or public.is_crew_member(crew_id))
);

-- No UPDATE/DELETE policies for clients. The edge function patches the
-- clickup_* columns via the service-role client (bypasses RLS).

-- ------------------------------------------------------------
-- Storage: private bucket for optional screenshots. Objects are keyed
-- under the submitter's Clerk sub: `<sub>/<uuid>.<ext>`.
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('feedback-screenshots', 'feedback-screenshots', false)
on conflict (id) do nothing;

create policy feedback_screenshots_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'feedback-screenshots'
  and (storage.foldername(name))[1] = (select auth.jwt()->>'sub')
);

create policy feedback_screenshots_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'feedback-screenshots'
  and (storage.foldername(name))[1] = (select auth.jwt()->>'sub')
);

-- ============================================================
-- End feedback slice.
-- ============================================================
