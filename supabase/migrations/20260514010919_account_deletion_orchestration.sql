-- ============================================================
-- Slice 2 of "Remove account" (ClickUp 86e1c0hnp, subtask 86e1cfwz4)
--
-- Atomic orchestration RPCs for user-account deletion and restore.
-- Builds on slice 1 (20260514000926_account_deletion_slice), which
-- landed users.deleted_at + users.deletion_requested_at + pg_cron.
--
-- Schema additions on crews:
--   is_ownerless          boolean not null default false
--   became_ownerless_at   timestamptz nullable
--
-- New RPCs (both SECURITY DEFINER, granted to authenticated):
--   request_account_deletion(p_transfer_to_user_id text default null)
--   restore_account()
--
-- Crew-branching contract for request_account_deletion:
--   - For each crew the caller OWNS (crews.owner_id = caller):
--       - If p_transfer_to_user_id is provided AND target is a
--         current admin of that crew → transfer ownership; the
--         caller's crew_members row is soft-deleted.
--       - Else if other active members exist (any role) → flip
--         crews.is_ownerless = true, crews.became_ownerless_at = now();
--         soft-delete caller's crew_members row. Downstream handoff
--         flow is tracked separately in ClickUp 86e1cey7j.
--       - Else (solo crew) → soft-delete the crew itself; soft-delete
--         caller's crew_members row.
--   - For each crew the caller is a member of but does NOT own →
--     soft-delete the crew_members row only.
--   - users.deleted_at and users.deletion_requested_at are set to now().
--
-- Immutable ledger tables (flows, waste_events, batch_events,
-- batch_inputs, batch_outputs, recipe_steps, recipe_ingredients,
-- intake_sessions, intake_session_items) are NEVER touched. Their
-- created_by / performed_by attribution persists indefinitely per
-- the decision record landing in docs/CLAUDE.md as part of this slice.
-- ============================================================

-- ------------------------------------------------------------
-- crews: ownerless flag
-- ------------------------------------------------------------
alter table public.crews
  add column if not exists is_ownerless        boolean not null default false,
  add column if not exists became_ownerless_at timestamptz;

create index if not exists crews_is_ownerless_idx
  on public.crews (crew_id)
  where is_ownerless = true and deleted_at is null;

-- ------------------------------------------------------------
-- request_account_deletion
-- Atomic. SECURITY DEFINER. Caller is identified via JWT sub.
-- Returns a single-row summary the calling edge function can pass
-- to the UI confirmation screen.
-- ------------------------------------------------------------
create or replace function public.request_account_deletion(
  p_transfer_to_user_id text default null
)
returns table (
  user_id                text,
  crews_transferred      int,
  crews_marked_ownerless int,
  crews_soft_deleted     int
)
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_caller            text;
  v_already_deleted   timestamptz;
  v_transferred       int := 0;
  v_marked_ownerless  int := 0;
  v_soft_deleted      int := 0;
  v_other_admins      int;
  v_other_members     int;
  v_transferee_role   text;
  r                   record;
begin
  v_caller := public.current_user_id();
  if v_caller is null then
    raise exception 'Not authenticated';
  end if;

  -- Idempotency: caller's user row must exist and not already be
  -- soft-deleted.
  select u.deleted_at into v_already_deleted
  from public.users u
  where u.user_id = v_caller;

  if not found then
    raise exception 'User not found' using errcode = 'no_data_found';
  end if;

  if v_already_deleted is not null then
    raise exception 'Account is already deleted' using errcode = 'invalid_parameter_value';
  end if;

  -- The caller cannot pass themselves as the transferee.
  if p_transfer_to_user_id is not null and p_transfer_to_user_id = v_caller then
    raise exception 'Cannot transfer ownership to yourself' using errcode = 'invalid_parameter_value';
  end if;

  -- ------------------------------------------------------------
  -- Branch 1: crews the caller OWNS.
  -- ------------------------------------------------------------
  for r in
    select c.crew_id
    from public.crews c
    where c.owner_id   = v_caller
      and c.deleted_at is null
    order by c.crew_id
  loop
    -- Count current admins on this crew, excluding the caller.
    select count(*)
      into v_other_admins
    from public.crew_members cm
    where cm.crew_id    = r.crew_id
      and cm.user_id    <> v_caller
      and cm.role       = 'admin'
      and cm.deleted_at is null;

    -- Count active members on this crew, excluding the caller.
    select count(*)
      into v_other_members
    from public.crew_members cm
    where cm.crew_id    = r.crew_id
      and cm.user_id    <> v_caller
      and cm.deleted_at is null;

    if p_transfer_to_user_id is not null then
      -- Transferee must be a current admin of THIS specific crew.
      select cm.role
        into v_transferee_role
      from public.crew_members cm
      where cm.crew_id    = r.crew_id
        and cm.user_id    = p_transfer_to_user_id
        and cm.deleted_at is null;

      if v_transferee_role is null then
        raise exception 'Transferee is not an active member of crew %', r.crew_id
          using errcode = 'invalid_parameter_value';
      end if;
      if v_transferee_role <> 'admin' then
        raise exception 'Transferee must be an Admin of crew % to receive ownership', r.crew_id
          using errcode = 'invalid_parameter_value';
      end if;

      update public.crews
        set owner_id = p_transfer_to_user_id
        where crew_id = r.crew_id;

      update public.crew_members
        set deleted_at = now()
        where crew_id    = r.crew_id
          and user_id    = v_caller
          and deleted_at is null;

      v_transferred := v_transferred + 1;

    elsif v_other_members > 0 then
      -- No transferee, but the crew has remaining members → ownerless.
      -- The downstream handoff/proposal flow (86e1cey7j) takes it from here.
      update public.crews
        set is_ownerless        = true,
            became_ownerless_at = now()
        where crew_id = r.crew_id;

      update public.crew_members
        set deleted_at = now()
        where crew_id    = r.crew_id
          and user_id    = v_caller
          and deleted_at is null;

      v_marked_ownerless := v_marked_ownerless + 1;

    else
      -- Solo crew → soft-delete the whole thing.
      update public.crews
        set deleted_at = now()
        where crew_id = r.crew_id;

      update public.crew_members
        set deleted_at = now()
        where crew_id    = r.crew_id
          and user_id    = v_caller
          and deleted_at is null;

      v_soft_deleted := v_soft_deleted + 1;
    end if;
  end loop;

  -- ------------------------------------------------------------
  -- Branch 2: crews the caller is a MEMBER of but does NOT own.
  -- Just soft-delete the membership.
  -- ------------------------------------------------------------
  update public.crew_members cm
    set deleted_at = now()
    where cm.user_id    = v_caller
      and cm.deleted_at is null
      and not exists (
        select 1
        from public.crews c
        where c.crew_id  = cm.crew_id
          and c.owner_id = v_caller
      );

  -- ------------------------------------------------------------
  -- Soft-delete the user row itself. Identifying fields stay intact
  -- so slice 3's restore-eligibility check can verify ownership of
  -- the row during the 30-day restore window.
  -- ------------------------------------------------------------
  update public.users
    set deleted_at            = now(),
        deletion_requested_at = now()
    where users.user_id = v_caller;

  user_id                := v_caller;
  crews_transferred      := v_transferred;
  crews_marked_ownerless := v_marked_ownerless;
  crews_soft_deleted     := v_soft_deleted;
  return next;
end;
$$;

revoke execute on function public.request_account_deletion(text) from public;
grant  execute on function public.request_account_deletion(text) to authenticated;

-- ------------------------------------------------------------
-- restore_account
-- Lifts the soft-delete if the caller is within the 30-day window.
-- Does NOT un-cascade crew memberships — the caller comes back with
-- whatever crew shape exists now. Crews that were transferred away,
-- flagged ownerless, or soft-deleted stay as they are.
-- ------------------------------------------------------------
create or replace function public.restore_account()
returns text
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_caller     text;
  v_deleted_at timestamptz;
begin
  v_caller := public.current_user_id();
  if v_caller is null then
    raise exception 'Not authenticated';
  end if;

  select u.deleted_at into v_deleted_at
  from public.users u
  where u.user_id = v_caller;

  if not found then
    raise exception 'User not found' using errcode = 'no_data_found';
  end if;

  if v_deleted_at is null then
    raise exception 'Account is not deleted' using errcode = 'invalid_parameter_value';
  end if;

  if v_deleted_at < now() - interval '30 days' then
    raise exception 'Restore window has expired' using errcode = 'invalid_parameter_value';
  end if;

  update public.users
    set deleted_at            = null,
        deletion_requested_at = null
    where users.user_id = v_caller;

  return v_caller;
end;
$$;

revoke execute on function public.restore_account() from public;
grant  execute on function public.restore_account() to authenticated;

-- ------------------------------------------------------------
-- Self-assertions — fail the migration loudly if shape is wrong.
-- ------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'crews'
      and column_name  = 'is_ownerless'
  ) then
    raise exception 'migration failed: crews.is_ownerless not created';
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'crews'
      and column_name  = 'became_ownerless_at'
  ) then
    raise exception 'migration failed: crews.became_ownerless_at not created';
  end if;

  if not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'request_account_deletion'
  ) then
    raise exception 'migration failed: request_account_deletion not created';
  end if;

  if not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'restore_account'
  ) then
    raise exception 'migration failed: restore_account not created';
  end if;
end $$;
