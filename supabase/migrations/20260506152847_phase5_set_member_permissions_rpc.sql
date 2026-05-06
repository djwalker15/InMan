-- ============================================================
-- Phase 5 · P5.5 — set_member_permissions RPC
-- ============================================================
-- crew_members has no UPDATE policy (mutations route through
-- SECURITY DEFINER RPCs only). This adds the RPC that powers the
-- Permissions tab on /crew/settings: replace a member's
-- permission_overrides JSON with the supplied object.
--
-- Permission gating mirrors change_member_role:
--   - Authenticated users only.
--   - Cannot edit the Owner's row (Owner privileges are derived from
--     crews.owner_id and not constrained by overrides).
--   - Cannot edit your own row (use another admin / the owner to fix).
--   - Owner can edit any other row.
--   - Admins can edit Members and Viewers, but not other Admins.
--
-- The function validates that p_overrides is a flat JSON object whose
-- values are exactly the strings 'allow' or 'deny'. Empty {} means
-- "no overrides — fall through to role defaults".
-- ============================================================

create or replace function public.set_member_permissions(
  p_crew_member_id uuid,
  p_overrides      jsonb
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
  v_key        text;
  v_value      text;
begin
  v_user_id := public.current_user_id();
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  -- Validate shape: must be a JSON object.
  if jsonb_typeof(p_overrides) <> 'object' then
    raise exception 'permission_overrides must be a JSON object';
  end if;

  -- Validate values: each entry must be 'allow' or 'deny'.
  for v_key, v_value in
    select key, value::text
    from jsonb_each_text(p_overrides)
  loop
    if v_value not in ('allow', 'deny') then
      raise exception
        'permission_overrides values must be "allow" or "deny" (got % for %)',
        v_value, v_key;
    end if;
  end loop;

  -- Resolve the target row.
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

  -- Cannot manage overrides on the Owner row.
  if v_member_uid = v_owner_uid then
    raise exception 'Cannot set permissions on the Owner';
  end if;

  -- Cannot manage own overrides — prevents accidental self-lockout.
  if v_member_uid = v_user_id then
    raise exception 'Cannot change your own permissions; ask another admin';
  end if;

  -- Permission gate.
  if v_user_id = v_owner_uid then
    null; -- Owner can edit anyone (other than themselves, handled above).
  elsif v_member_role = 'admin' then
    raise exception 'Only the Owner can set permissions on an Admin';
  else
    if not public.is_crew_admin_or_owner(v_crew_id) then
      raise exception 'Not authorized';
    end if;
  end if;

  update public.crew_members
  set permission_overrides = p_overrides
  where crew_member_id = p_crew_member_id;
end;
$$;

revoke execute on function public.set_member_permissions(uuid, jsonb) from public;
grant  execute on function public.set_member_permissions(uuid, jsonb) to authenticated;
