-- ============================================================
-- Phase 6 · P6.3 — move_space + merge_spaces RPCs
-- ============================================================
-- The Space Reorganization journey adds four complex hierarchy ops.
-- This slice ships the first two:
--
--   * move_space(space_id, new_parent_id) — re-parent a Space.
--     No Flows are created; the items at the moved Space stay
--     attached to it (the Space moved, not the items).
--
--   * merge_spaces(source_id, target_id) — combine two Spaces.
--     - Inventory items where current_space_id = source get a
--       transfer Flow + flow_transfer_details row each (the
--       existing flow_transfer_apply_trigger updates current_space_id).
--     - Inventory items where home_space_id = source have their
--       home re-pointed to target (no Flow — home is a designation,
--       not a location).
--     - Child Spaces of source are re-parented to target, after
--       checking that target's unit_type accepts each child's type.
--     - Source Space is soft-deleted.
--
-- Both RPCs gate on crew membership and reuse the existing
-- ALLOWED_CHILD_TYPES rule (codified server-side as
-- space_parent_allows_child) so the UI's compat checks have a
-- matching DB-level guarantee. Cycle detection runs via recursive
-- CTE — neither op can move / merge a node into its own subtree.
-- ============================================================

-- ------------------------------------------------------------
-- Helper: rank of a unit_type in the hierarchy. Lower = closer to
-- the root. Mirrors LEVEL_RANK in app/src/components/spaces/tree-helpers.ts.
-- ------------------------------------------------------------
create or replace function public.space_unit_rank(t text)
returns int
language sql
immutable
as $$
  select case t
    when 'premises'    then 0
    when 'area'        then 1
    when 'zone'        then 2
    when 'section'     then 3
    when 'sub_section' then 4
    when 'container'   then 5
    when 'shelf'       then 6
    else 99 end;
$$;

-- ------------------------------------------------------------
-- Helper: parent unit_type accepts child unit_type. Mirrors
-- ALLOWED_CHILD_TYPES on the client. The rule is structural:
-- shelves are leaves, premises is the root, and otherwise
-- children must sit at a strictly deeper rank than their parent.
-- ------------------------------------------------------------
create or replace function public.space_parent_allows_child(
  parent_type text, child_type text
)
returns boolean
language sql
immutable
as $$
  select parent_type <> 'shelf'
     and child_type  <> 'premises'
     and public.space_unit_rank(child_type) > public.space_unit_rank(parent_type);
$$;

-- ============================================================
-- move_space — re-parent a Space (and implicitly its subtree).
-- ============================================================
create or replace function public.move_space(
  p_space_id       uuid,
  p_new_parent_id  uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_user_id        text;
  v_source_crew    uuid;
  v_source_type    text;
  v_source_parent  uuid;
  v_target_crew    uuid;
  v_target_type    text;
begin
  v_user_id := public.current_user_id();
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  select crew_id, unit_type, parent_id
    into v_source_crew, v_source_type, v_source_parent
  from public.spaces
  where space_id = p_space_id and deleted_at is null;
  if v_source_crew is null then raise exception 'Space not found'; end if;

  select crew_id, unit_type
    into v_target_crew, v_target_type
  from public.spaces
  where space_id = p_new_parent_id and deleted_at is null;
  if v_target_crew is null then raise exception 'New parent not found'; end if;

  if v_source_crew <> v_target_crew then
    raise exception 'Spaces are not in the same Crew';
  end if;
  if not public.is_crew_member(v_source_crew) then
    raise exception 'Not a member of this Crew';
  end if;

  -- Premises are root nodes — they never move.
  if v_source_parent is null or v_source_type = 'premises' then
    raise exception 'A Premises cannot be moved';
  end if;

  -- No-op fast path: already at the requested parent.
  if v_source_parent = p_new_parent_id then
    return;
  end if;

  -- Cycle protection: the new parent must not live in the source's subtree.
  if exists (
    with recursive descendants(space_id) as (
      select s.space_id
      from public.spaces s
      where s.parent_id = p_space_id and s.deleted_at is null
      union all
      select s.space_id
      from public.spaces s
      join descendants d on s.parent_id = d.space_id
      where s.deleted_at is null
    )
    select 1 from descendants where space_id = p_new_parent_id
  ) then
    raise exception 'Cannot move a Space into its own subtree';
  end if;

  -- Unit-type compatibility: new parent must accept this node's type.
  if not public.space_parent_allows_child(v_target_type, v_source_type) then
    raise exception
      'Unit type % is not a valid child of %', v_source_type, v_target_type;
  end if;

  update public.spaces
  set parent_id = p_new_parent_id
  where space_id = p_space_id;
end;
$$;

revoke execute on function public.move_space(uuid, uuid) from public;
grant  execute on function public.move_space(uuid, uuid) to authenticated;

-- ============================================================
-- merge_spaces — fold source into target atomically.
-- ============================================================
create or replace function public.merge_spaces(
  p_source_id uuid,
  p_target_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_user_id     text;
  v_source_crew uuid;
  v_source_type text;
  v_target_crew uuid;
  v_target_type text;
  v_item        record;
  v_flow_id     uuid;
begin
  v_user_id := public.current_user_id();
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  if p_source_id = p_target_id then
    raise exception 'Source and target must differ';
  end if;

  select crew_id, unit_type
    into v_source_crew, v_source_type
  from public.spaces
  where space_id = p_source_id and deleted_at is null;
  if v_source_crew is null then raise exception 'Source Space not found'; end if;

  select crew_id, unit_type
    into v_target_crew, v_target_type
  from public.spaces
  where space_id = p_target_id and deleted_at is null;
  if v_target_crew is null then raise exception 'Target Space not found'; end if;

  if v_source_crew <> v_target_crew then
    raise exception 'Spaces are not in the same Crew';
  end if;
  if not public.is_crew_member(v_source_crew) then
    raise exception 'Not a member of this Crew';
  end if;

  if v_source_type = 'premises' then
    raise exception 'A Premises cannot be merged';
  end if;

  -- Cycle: target must not be inside source's subtree.
  if exists (
    with recursive descendants(space_id) as (
      select s.space_id
      from public.spaces s
      where s.parent_id = p_source_id and s.deleted_at is null
      union all
      select s.space_id
      from public.spaces s
      join descendants d on s.parent_id = d.space_id
      where s.deleted_at is null
    )
    select 1 from descendants where space_id = p_target_id
  ) then
    raise exception 'Cannot merge a Space into its own subtree';
  end if;

  -- Each child of source must remain a legal child after reparent.
  if exists (
    select 1
    from public.spaces s
    where s.parent_id = p_source_id
      and s.deleted_at is null
      and not public.space_parent_allows_child(v_target_type, s.unit_type)
  ) then
    raise exception
      'Merge would orphan child Spaces — % does not accept their types',
      v_target_type;
  end if;

  -- 1. Items at the source: one transfer flow + detail per item. The
  --    flow_transfer_apply_trigger updates inventory_items.current_space_id
  --    when the detail row lands.
  for v_item in
    select inventory_item_id, quantity, unit
    from public.inventory_items
    where current_space_id = p_source_id
      and crew_id           = v_source_crew
      and deleted_at        is null
  loop
    insert into public.flows (
      crew_id, inventory_item_id, flow_type, quantity, unit, performed_by, notes
    )
    values (
      v_source_crew, v_item.inventory_item_id, 'transfer',
      0, v_item.unit, v_user_id,
      'merge_spaces — folded source into target'
    )
    returning flow_id into v_flow_id;

    insert into public.flow_transfer_details (flow_id, from_space_id, to_space_id)
    values (v_flow_id, p_source_id, p_target_id);
  end loop;

  -- 2. Items whose *home* was the source — re-point home, no flow.
  update public.inventory_items
  set home_space_id = p_target_id
  where home_space_id = p_source_id
    and crew_id       = v_source_crew
    and deleted_at    is null;

  -- 3. Re-parent live children of source onto target.
  update public.spaces
  set parent_id = p_target_id
  where parent_id = p_source_id
    and deleted_at is null;

  -- 4. Soft-delete the source.
  update public.spaces
  set deleted_at = now()
  where space_id = p_source_id;
end;
$$;

revoke execute on function public.merge_spaces(uuid, uuid) from public;
grant  execute on function public.merge_spaces(uuid, uuid) to authenticated;
