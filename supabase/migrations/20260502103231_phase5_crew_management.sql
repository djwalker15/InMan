-- ============================================================
-- Phase 5 — Crew Management slice
-- ----------------------------------------------------------------
-- Schema additions (most fields already exist from earlier slices —
-- this migration fills the gaps and tightens types):
--   crews.deletion_requested_by text     (pairs with deletion_requested_at)
--   crew_members.role            tightened via CHECK constraint
--   invites.role                 tightened via CHECK constraint
--
-- New RPCs (all SECURITY DEFINER, granted to authenticated):
--   change_member_role(crew_member_id, new_role)
--   remove_crew_member(crew_member_id)
--   transfer_crew_ownership(crew_id, new_owner_user_id)
--   request_crew_deletion(crew_id)
--   cancel_crew_deletion(crew_id)
--   process_due_crew_deletions()
-- ============================================================

-- ------------------------------------------------------------
-- crews: add deletion_requested_by (already had deletion_requested_at)
-- ------------------------------------------------------------
alter table public.crews
  add column if not exists deletion_requested_by text references public.users(user_id);

-- ------------------------------------------------------------
-- crew_members.role + invites.role: tighten to a small set
-- ('owner' is reserved for the crews.owner_id slot — members are
-- 'admin' / 'member' / 'viewer'.)
-- ------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where constraint_schema = 'public'
      and constraint_name = 'crew_members_role_check'
  ) then
    alter table public.crew_members drop constraint crew_members_role_check;
  end if;
end $$;

-- The legacy 'owner' role rows from Phase 1 / P1.3 should map to 'admin'
-- since ownership lives in crews.owner_id now.
update public.crew_members set role = 'admin' where role = 'owner';

alter table public.crew_members
  add constraint crew_members_role_check
    check (role in ('admin', 'member', 'viewer'));

do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where constraint_schema = 'public'
      and constraint_name = 'invites_role_check'
  ) then
    alter table public.invites drop constraint invites_role_check;
  end if;
end $$;

alter table public.invites
  add constraint invites_role_check
    check (role in ('admin', 'member', 'viewer'));

-- ------------------------------------------------------------
-- Helper: is the caller the OWNER of the given crew?
-- ------------------------------------------------------------
create or replace function public.is_crew_owner(target_crew_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.crews c
    where c.crew_id    = target_crew_id
      and c.owner_id   = public.current_user_id()
      and c.deleted_at is null
  );
$$;

revoke execute on function public.is_crew_owner(uuid) from public;
grant  execute on function public.is_crew_owner(uuid) to authenticated;

-- ------------------------------------------------------------
-- change_member_role
-- Owner: can change anyone except themselves (their role is virtual).
-- Admin: can change Members and Viewers; cannot touch other Admins or
--        the Owner.
-- Last-admin protection: cannot demote the only remaining admin (the
--   Owner is always counted as an effective admin, so this only matters
--   if the Owner is also the only admin slot).
-- ------------------------------------------------------------
create or replace function public.change_member_role(
  p_crew_member_id uuid,
  p_new_role       text
)
returns void
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_user_id    text;
  v_crew_id    uuid;
  v_member_uid text;
  v_old_role   text;
  v_owner_uid  text;
  v_admin_count int;
begin
  if p_new_role not in ('admin', 'member', 'viewer') then
    raise exception 'role must be admin / member / viewer';
  end if;

  v_user_id := public.current_user_id();
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  select cm.crew_id, cm.user_id, cm.role
    into v_crew_id, v_member_uid, v_old_role
  from public.crew_members cm
  where cm.crew_member_id = p_crew_member_id
    and cm.deleted_at     is null;
  if v_crew_id is null then raise exception 'Member not found'; end if;

  select c.owner_id into v_owner_uid
  from public.crews c
  where c.crew_id = v_crew_id and c.deleted_at is null;
  if v_owner_uid is null then raise exception 'Crew not found'; end if;

  -- Cannot change the Owner's role record (they don't have one — owner_id is the source).
  if v_member_uid = v_owner_uid then
    raise exception 'Cannot change the Owner''s role; transfer ownership first';
  end if;

  -- Permission gate
  if v_user_id = v_owner_uid then
    -- Owner can change anyone (except themselves, handled above).
    null;
  elsif v_old_role = 'admin' or p_new_role = 'admin' then
    -- Promoting/demoting an Admin: Owner only.
    raise exception 'Only the Owner can promote to or demote from Admin';
  else
    -- Admin can change Members <-> Viewers.
    if not public.is_crew_admin_or_owner(v_crew_id) then
      raise exception 'Not authorized';
    end if;
  end if;

  -- Last-admin protection: if the new role is not 'admin' and we'd be
  -- left with zero admins (excluding the Owner), block.
  if v_old_role = 'admin' and p_new_role <> 'admin' then
    select count(*) into v_admin_count
    from public.crew_members
    where crew_id    = v_crew_id
      and role       = 'admin'
      and deleted_at is null
      and user_id    <> v_owner_uid;
    if v_admin_count <= 1 then
      raise exception 'Cannot demote the last remaining Admin';
    end if;
  end if;

  update public.crew_members
  set role = p_new_role
  where crew_member_id = p_crew_member_id;
end;
$$;

revoke execute on function public.change_member_role(uuid, text) from public;
grant  execute on function public.change_member_role(uuid, text) to authenticated;

-- ------------------------------------------------------------
-- remove_crew_member — soft-delete, guards same as change_member_role.
-- Cannot remove the Owner (must transfer first) or yourself (use leave
-- instead).
-- ------------------------------------------------------------
create or replace function public.remove_crew_member(
  p_crew_member_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_user_id    text;
  v_crew_id    uuid;
  v_member_uid text;
  v_member_role text;
  v_owner_uid  text;
begin
  v_user_id := public.current_user_id();
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  select cm.crew_id, cm.user_id, cm.role
    into v_crew_id, v_member_uid, v_member_role
  from public.crew_members cm
  where cm.crew_member_id = p_crew_member_id
    and cm.deleted_at     is null;
  if v_crew_id is null then raise exception 'Member not found'; end if;

  select c.owner_id into v_owner_uid
  from public.crews c
  where c.crew_id = v_crew_id and c.deleted_at is null;
  if v_owner_uid is null then raise exception 'Crew not found'; end if;

  if v_member_uid = v_owner_uid then
    raise exception 'Cannot remove the Owner; transfer ownership first';
  end if;
  if v_member_uid = v_user_id then
    raise exception 'Use leave_crew to leave a Crew';
  end if;

  if v_user_id = v_owner_uid then
    null; -- Owner can remove anyone.
  elsif v_member_role = 'admin' then
    raise exception 'Only the Owner can remove an Admin';
  else
    if not public.is_crew_admin_or_owner(v_crew_id) then
      raise exception 'Not authorized';
    end if;
  end if;

  update public.crew_members
  set deleted_at = now()
  where crew_member_id = p_crew_member_id;
end;
$$;

revoke execute on function public.remove_crew_member(uuid) from public;
grant  execute on function public.remove_crew_member(uuid) to authenticated;

-- ------------------------------------------------------------
-- leave_crew — caller leaves a crew they're a member of. Owner cannot
-- leave (must transfer ownership first).
-- ------------------------------------------------------------
create or replace function public.leave_crew(p_crew_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_user_id   text;
  v_owner_uid text;
begin
  v_user_id := public.current_user_id();
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  select c.owner_id into v_owner_uid
  from public.crews c
  where c.crew_id = p_crew_id and c.deleted_at is null;
  if v_owner_uid is null then raise exception 'Crew not found'; end if;

  if v_user_id = v_owner_uid then
    raise exception 'Owner cannot leave the Crew. Transfer ownership first.';
  end if;

  update public.crew_members
  set deleted_at = now()
  where crew_id    = p_crew_id
    and user_id    = v_user_id
    and deleted_at is null;
end;
$$;

revoke execute on function public.leave_crew(uuid) from public;
grant  execute on function public.leave_crew(uuid) to authenticated;

-- ------------------------------------------------------------
-- transfer_crew_ownership
-- Owner-only. New Owner must already be an Admin of the crew.
-- ------------------------------------------------------------
create or replace function public.transfer_crew_ownership(
  p_crew_id          uuid,
  p_new_owner_user_id text
)
returns void
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_user_id    text;
  v_old_owner  text;
  v_target_role text;
begin
  v_user_id := public.current_user_id();
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  select c.owner_id into v_old_owner
  from public.crews c
  where c.crew_id = p_crew_id and c.deleted_at is null;
  if v_old_owner is null then raise exception 'Crew not found'; end if;
  if v_old_owner <> v_user_id then
    raise exception 'Only the Owner can transfer ownership';
  end if;
  if p_new_owner_user_id = v_user_id then
    raise exception 'Already the Owner';
  end if;

  select role into v_target_role
  from public.crew_members
  where crew_id    = p_crew_id
    and user_id    = p_new_owner_user_id
    and deleted_at is null;
  if v_target_role is null then
    raise exception 'Target must already be a member of the Crew';
  end if;
  if v_target_role <> 'admin' then
    raise exception 'Target must be an Admin to become Owner';
  end if;

  -- Promote / demote in two steps so the old owner stays as an Admin.
  update public.crews
  set owner_id = p_new_owner_user_id
  where crew_id = p_crew_id;

  -- Ensure the old owner (if they had a crew_members row) is at least Admin.
  insert into public.crew_members (crew_id, user_id, role)
  values (p_crew_id, v_user_id, 'admin')
  on conflict do nothing;
end;
$$;

revoke execute on function public.transfer_crew_ownership(uuid, text) from public;
grant  execute on function public.transfer_crew_ownership(uuid, text) to authenticated;

-- ------------------------------------------------------------
-- request_crew_deletion / cancel_crew_deletion / process_due
-- ------------------------------------------------------------
create or replace function public.request_crew_deletion(p_crew_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_user_id text;
  v_owner   text;
begin
  v_user_id := public.current_user_id();
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  select owner_id into v_owner
  from public.crews where crew_id = p_crew_id and deleted_at is null;
  if v_owner is null then raise exception 'Crew not found'; end if;
  if v_owner <> v_user_id then
    raise exception 'Only the Owner can request deletion';
  end if;

  update public.crews
  set deletion_requested_at = now(),
      deletion_requested_by = v_user_id
  where crew_id = p_crew_id;
end;
$$;

revoke execute on function public.request_crew_deletion(uuid) from public;
grant  execute on function public.request_crew_deletion(uuid) to authenticated;

create or replace function public.cancel_crew_deletion(p_crew_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_user_id text;
  v_owner   text;
begin
  v_user_id := public.current_user_id();
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  select owner_id into v_owner
  from public.crews where crew_id = p_crew_id and deleted_at is null;
  if v_owner is null then raise exception 'Crew not found'; end if;
  if v_owner <> v_user_id then
    raise exception 'Only the Owner can cancel deletion';
  end if;

  update public.crews
  set deletion_requested_at = null,
      deletion_requested_by = null
  where crew_id = p_crew_id;
end;
$$;

revoke execute on function public.cancel_crew_deletion(uuid) from public;
grant  execute on function public.cancel_crew_deletion(uuid) to authenticated;

-- Cron-fire processor: cascades soft delete to spaces, inventory_items,
-- crew_members, invites, space_templates (crew-owned only). Immutable
-- entities (flows, flow_*_details) are NOT touched — they retain their
-- audit trail; RLS becomes inaccessible because the parent crew is
-- soft-deleted.
create or replace function public.process_due_crew_deletions()
returns int
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_count int := 0;
  r       record;
begin
  for r in
    select crew_id
    from public.crews
    where deletion_requested_at is not null
      and deletion_requested_at + interval '48 hours' < now()
      and deleted_at             is null
  loop
    update public.crews            set deleted_at = now() where crew_id = r.crew_id;
    update public.spaces           set deleted_at = now() where crew_id = r.crew_id and deleted_at is null;
    update public.inventory_items  set deleted_at = now() where crew_id = r.crew_id and deleted_at is null;
    update public.crew_members     set deleted_at = now() where crew_id = r.crew_id and deleted_at is null;
    update public.invites          set deleted_at = now() where crew_id = r.crew_id and deleted_at is null;
    update public.space_templates  set deleted_at = now() where crew_id = r.crew_id and deleted_at is null;
    update public.products         set deleted_at = now() where crew_id = r.crew_id and deleted_at is null;
    update public.categories       set deleted_at = now() where crew_id = r.crew_id and deleted_at is null;
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

revoke execute on function public.process_due_crew_deletions() from public;
-- This one is for cron / service role only; do NOT grant to authenticated.
