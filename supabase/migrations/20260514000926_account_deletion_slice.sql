-- ============================================================
-- Slice 1 of "Remove account" (ClickUp 86e1c0hnp, subtask 86e1cfwyd)
--
-- Adds user-level soft-delete + restore-window infrastructure that
-- mirrors the existing 48-hour crew-deletion pattern landed in
-- 20260502103231_phase5_crew_management.sql.
--
-- Lifecycle (slices 2-4 will wire the orchestration / Clerk / UI):
--   1. User clicks "Delete account" in Settings (slice 4).
--   2. Edge function (slice 3) invokes request_account_deletion()
--      (slice 2) which sets users.deleted_at = now() and cascades
--      soft-deletes across crew_members + sole-owner crews.
--   3. Outbound call to Clerk's delete-user API purges PII Clerk-side.
--   4. Restore window: 30 days. If the same Clerk sub re-auths,
--      slice 3 detects via deleted_at and lifts the soft-delete.
--   5. After 30 days, process_due_user_deletions() reports the row
--      as past-cool-down. The row itself stays as a tombstone.
--
-- Schema additions:
--   users.deleted_at            timestamptz  -- soft-delete commit
--   users.deletion_requested_at timestamptz  -- UI click timestamp
--
-- New RPCs:
--   process_due_user_deletions()  -- daily cron; returns count of
--                                    users past the 30-day cool-down
--
-- pg_cron schedules (this migration enables the extension and also
-- wires the previously-unscheduled process_due_crew_deletions()):
--   daily 03:00 UTC   process_due_user_deletions()
--   daily 03:00 UTC   process_due_crew_deletions()
--
-- Design choice — tombstone vs. hard-delete:
--   The parent task spec uses "hard-purge" language. We deliberately
--   ship the tombstone variant, matching decision #16 in
--   docs/CLAUDE.md (crew deletion uses tombstone, not hard-delete).
--   Reasoning:
--     - The users table is a slim local ref (user_id + created_at);
--       it carries no PII. PII deletion happens Clerk-side via the
--       outbound delete-user call in slice 3.
--     - 12+ immutable tables FK to users(user_id) (flows.performed_by,
--       batch_events.performed_by, etc.) and per the resolved decision
--       "immutable rows retain created_by — no anonymization," those
--       FKs must keep pointing to a valid users row.
--     - Clerk does not reuse `sub` values, so "fresh tenant on
--       re-signup" works naturally without the row being deleted.
--   If true row-level DELETE is required later, that's a follow-up
--   migration to drop FK constraints on the immutable ledger tables.
-- ============================================================

-- ------------------------------------------------------------
-- pg_cron extension
-- ------------------------------------------------------------
create extension if not exists pg_cron;

-- ------------------------------------------------------------
-- users: soft-delete + deletion-request columns
-- ------------------------------------------------------------
alter table public.users
  add column if not exists deleted_at            timestamptz,
  add column if not exists deletion_requested_at timestamptz;

-- Indexes the cron scan and the restore-eligibility lookups.
create index if not exists users_deleted_at_idx
  on public.users (deleted_at)
  where deleted_at is not null;

-- Note on RLS: the existing users_select_self policy intentionally
-- has no `deleted_at is null` filter, so a user can still SELECT
-- their own row within the 30-day restore window. App-layer queries
-- that want the active-user view should filter `.is('deleted_at', null)`
-- explicitly; the restore-detection path (slice 3) omits that filter.

-- ------------------------------------------------------------
-- process_due_user_deletions
-- Cron-fire processor. Tombstone pattern: returns the count of
-- users whose 30-day restore window has elapsed; performs no
-- mutations on the users table. Slice 2 will not touch this RPC;
-- a future hard-delete migration can extend the body if/when the
-- immutable-table FK strategy is revisited.
-- ------------------------------------------------------------
create or replace function public.process_due_user_deletions()
returns int
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_count int := 0;
begin
  select count(*)
    into v_count
  from public.users
  where deleted_at is not null
    and deleted_at < now() - interval '30 days';
  return v_count;
end;
$$;

revoke execute on function public.process_due_user_deletions() from public;
-- Cron / service role only; do NOT grant to authenticated.

-- ------------------------------------------------------------
-- pg_cron schedules
-- Both purge jobs run at 03:00 UTC daily. Idempotent — re-running
-- the migration replaces the schedules in place.
-- ------------------------------------------------------------
do $$
begin
  -- Drop existing schedules with these names, if any.
  if exists (select 1 from cron.job where jobname = 'process_due_user_deletions') then
    perform cron.unschedule('process_due_user_deletions');
  end if;
  if exists (select 1 from cron.job where jobname = 'process_due_crew_deletions') then
    perform cron.unschedule('process_due_crew_deletions');
  end if;
end $$;

select cron.schedule(
  'process_due_user_deletions',
  '0 3 * * *',
  $cron$select public.process_due_user_deletions();$cron$
);

select cron.schedule(
  'process_due_crew_deletions',
  '0 3 * * *',
  $cron$select public.process_due_crew_deletions();$cron$
);

-- ------------------------------------------------------------
-- Self-assertions — fail the migration loudly if shape is wrong.
-- ------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'users'
      and column_name  = 'deleted_at'
  ) then
    raise exception 'migration failed: users.deleted_at not created';
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'users'
      and column_name  = 'deletion_requested_at'
  ) then
    raise exception 'migration failed: users.deletion_requested_at not created';
  end if;

  if not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'process_due_user_deletions'
  ) then
    raise exception 'migration failed: process_due_user_deletions() not created';
  end if;

  if not exists (
    select 1 from cron.job where jobname = 'process_due_user_deletions'
  ) then
    raise exception 'migration failed: cron job process_due_user_deletions not scheduled';
  end if;

  if not exists (
    select 1 from cron.job where jobname = 'process_due_crew_deletions'
  ) then
    raise exception 'migration failed: cron job process_due_crew_deletions not scheduled';
  end if;
end $$;
