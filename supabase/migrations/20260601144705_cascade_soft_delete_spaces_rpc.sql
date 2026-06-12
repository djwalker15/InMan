-- ============================================================
-- cascade_soft_delete_spaces — atomic soft-delete of a Space subtree
-- ============================================================
-- The inline tree action ("Delete" in the per-node action menu)
-- soft-deletes a Space and all its descendants. The direct UPDATE
-- on public.spaces from the client hit a PostgreSQL RLS quirk:
-- on UPDATE, PG implicitly checks that the NEW row still satisfies
-- the SELECT policy. spaces_select requires `deleted_at IS NULL`,
-- so the moment the UPDATE sets `deleted_at`, the new row fails
-- SELECT and PG aborts with 42501 "new row violates row-level
-- security policy for table 'spaces'". This shows up before any
-- WITH CHECK on the UPDATE policy could even matter.
--
-- The fix mirrors delete_space_with_items / merge_spaces: route
-- the soft-delete through a SECURITY DEFINER RPC that gates on
-- is_crew_admin_or_owner. The function bypasses RLS for the UPDATE
-- while still enforcing crew membership / role explicitly.
--
-- Contract: client passes the source space_id plus every descendant
-- it gathered locally (see app/src/routes/spaces.tsx softDelete).
-- The RPC verifies every space belongs to a crew the caller can
-- administer and rejects Premises (parent_id IS NULL) since those
-- must go through the dedicated owner-deletion flow.
-- ============================================================

create or replace function public.cascade_soft_delete_spaces(
  p_space_ids uuid[]
)
returns void
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_user_id text;
begin
  v_user_id := public.current_user_id();
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  if p_space_ids is null or array_length(p_space_ids, 1) is null then
    return;
  end if;

  -- Premises are root-level and must not be soft-deleted via this path.
  if exists (
    select 1 from public.spaces
    where space_id = any(p_space_ids)
      and parent_id is null
      and deleted_at is null
  ) then
    raise exception 'A Premises cannot be deleted via this action';
  end if;

  -- Every live target must sit in a crew the caller administers.
  if exists (
    select 1 from public.spaces s
    where s.space_id = any(p_space_ids)
      and s.deleted_at is null
      and not public.is_crew_admin_or_owner(s.crew_id)
  ) then
    raise exception 'Not authorized to delete one or more Spaces';
  end if;

  update public.spaces
  set deleted_at = now()
  where space_id = any(p_space_ids)
    and deleted_at is null;
end;
$$;

revoke execute on function public.cascade_soft_delete_spaces(uuid[]) from public;
grant  execute on function public.cascade_soft_delete_spaces(uuid[]) to authenticated;
