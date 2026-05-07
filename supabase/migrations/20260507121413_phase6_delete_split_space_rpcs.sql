-- ============================================================
-- Phase 6 · P6.4 — delete_space_with_items + split_space RPCs
-- ============================================================
-- Final two complex hierarchy operations from the Space Reorganization
-- journey, both atomic / SECURITY DEFINER and gated on crew membership.
--
--   delete_space_with_items(space_id, items_target_id, clear_homes)
--     - Soft-deletes the Space. Items at that Space move to
--       items_target_id with one transfer Flow + flow_transfer_details
--       row each (the existing flow_transfer_apply_trigger updates
--       current_space_id). home_space_id is either re-pointed to
--       items_target_id (when clear_homes = false) or cleared to NULL
--       (when clear_homes = true) for items whose home was the deleted
--       Space.
--     - Direct child Spaces of source are re-parented to source's
--       PARENT (so they become siblings of the deleted node) — same
--       compatibility check used by merge_spaces ensures each child
--       remains a legal child of the new parent. Recursive delete is
--       intentionally out of MVP scope; users delete leaves first.
--
--   split_space(space_id, new_name, item_ids[], child_space_ids[])
--     - Creates a NEW Space as a sibling of source (same parent_id,
--       same unit_type) with the given name. Items in item_ids that
--       currently sit at source move to the new Space with transfer
--       Flows + details. Items whose home was source AND that are in
--       the item_ids list have their home re-pointed to the new Space.
--     - Children in child_space_ids re-parent from source onto the
--       new Space. The pre-check verifies every moving child stays a
--       legal child of the new Space's unit_type (which equals
--       source's, so this should always pass — but the check makes
--       the contract explicit).
--     - Source is NOT deleted. The user picks which items / children
--       go where; everything not in the lists stays at source.
-- ============================================================

create or replace function public.delete_space_with_items(
  p_space_id        uuid,
  p_items_target_id uuid,
  p_clear_homes     boolean default false
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
  v_parent_type    text;
  v_item           record;
  v_flow_id        uuid;
begin
  v_user_id := public.current_user_id();
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  if p_space_id = p_items_target_id then
    raise exception 'Items target cannot be the Space being deleted';
  end if;

  select crew_id, unit_type, parent_id
    into v_source_crew, v_source_type, v_source_parent
  from public.spaces
  where space_id = p_space_id and deleted_at is null;
  if v_source_crew is null then raise exception 'Space not found'; end if;

  select crew_id into v_target_crew
  from public.spaces
  where space_id = p_items_target_id and deleted_at is null;
  if v_target_crew is null then raise exception 'Items target not found'; end if;

  if v_source_crew <> v_target_crew then
    raise exception 'Spaces are not in the same Crew';
  end if;
  if not public.is_crew_member(v_source_crew) then
    raise exception 'Not a member of this Crew';
  end if;

  if v_source_type = 'premises' then
    raise exception 'A Premises cannot be deleted';
  end if;

  -- Items target must not be in the source's subtree (would be deleted
  -- next time the user prunes that subtree, leaving items orphaned).
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
    select 1 from descendants where space_id = p_items_target_id
  ) then
    raise exception 'Items target cannot live inside the Space being deleted';
  end if;

  -- Children re-parent onto source's parent. Verify each child remains
  -- a legal child of that parent's unit_type.
  select unit_type into v_parent_type
  from public.spaces
  where space_id = v_source_parent and deleted_at is null;
  if v_parent_type is null then raise exception 'Parent Space not found'; end if;

  if exists (
    select 1
    from public.spaces s
    where s.parent_id = p_space_id
      and s.deleted_at is null
      and not public.space_parent_allows_child(v_parent_type, s.unit_type)
  ) then
    raise exception
      'Children would orphan: % does not accept one of the child types',
      v_parent_type;
  end if;

  -- 1. Move items at source → items_target via transfer Flow + detail.
  for v_item in
    select inventory_item_id, quantity, unit
    from public.inventory_items
    where current_space_id = p_space_id
      and crew_id           = v_source_crew
      and deleted_at        is null
  loop
    insert into public.flows (
      crew_id, inventory_item_id, flow_type, quantity, unit, performed_by, notes
    )
    values (
      v_source_crew, v_item.inventory_item_id, 'transfer',
      0, v_item.unit, v_user_id,
      'delete_space_with_items'
    )
    returning flow_id into v_flow_id;

    insert into public.flow_transfer_details (flow_id, from_space_id, to_space_id)
    values (v_flow_id, p_space_id, p_items_target_id);
  end loop;

  -- 2. Update home_space_id for items whose home was source.
  if p_clear_homes then
    update public.inventory_items
    set home_space_id = null
    where home_space_id = p_space_id
      and crew_id       = v_source_crew
      and deleted_at    is null;
  else
    update public.inventory_items
    set home_space_id = p_items_target_id
    where home_space_id = p_space_id
      and crew_id       = v_source_crew
      and deleted_at    is null;
  end if;

  -- 3. Re-parent live children onto source's parent.
  update public.spaces
  set parent_id = v_source_parent
  where parent_id = p_space_id
    and deleted_at is null;

  -- 4. Soft-delete source.
  update public.spaces
  set deleted_at = now()
  where space_id = p_space_id;
end;
$$;

revoke execute on function public.delete_space_with_items(uuid, uuid, boolean) from public;
grant  execute on function public.delete_space_with_items(uuid, uuid, boolean) to authenticated;

-- ============================================================
-- split_space — divide a Space into two siblings.
-- ============================================================
create or replace function public.split_space(
  p_space_id            uuid,
  p_new_name            text,
  p_item_ids            uuid[] default '{}',
  p_child_space_ids     uuid[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_user_id      text;
  v_source_crew  uuid;
  v_source_type  text;
  v_source_parent uuid;
  v_new_id       uuid;
  v_item         record;
  v_flow_id      uuid;
  v_trimmed_name text;
begin
  v_user_id := public.current_user_id();
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  v_trimmed_name := btrim(coalesce(p_new_name, ''));
  if length(v_trimmed_name) = 0 then
    raise exception 'New Space name is required';
  end if;
  if length(v_trimmed_name) > 64 then
    raise exception 'New Space name is too long';
  end if;

  select crew_id, unit_type, parent_id
    into v_source_crew, v_source_type, v_source_parent
  from public.spaces
  where space_id = p_space_id and deleted_at is null;
  if v_source_crew is null then raise exception 'Space not found'; end if;

  if not public.is_crew_member(v_source_crew) then
    raise exception 'Not a member of this Crew';
  end if;

  if v_source_type = 'premises' then
    raise exception 'A Premises cannot be split';
  end if;

  -- Every child id must be a live direct child of source.
  if exists (
    select 1
    from unnest(p_child_space_ids) as ids(child_id)
    where not exists (
      select 1 from public.spaces s
      where s.space_id   = ids.child_id
        and s.parent_id  = p_space_id
        and s.deleted_at is null
    )
  ) then
    raise exception 'A child id is not a live direct child of the source';
  end if;

  -- Every item id must currently sit at source.
  if exists (
    select 1
    from unnest(p_item_ids) as ids(item_id)
    where not exists (
      select 1 from public.inventory_items i
      where i.inventory_item_id = ids.item_id
        and i.current_space_id  = p_space_id
        and i.deleted_at        is null
    )
  ) then
    raise exception 'An item id is not currently at the source Space';
  end if;

  -- 1. Create the new sibling Space.
  insert into public.spaces (
    crew_id, parent_id, unit_type, name, created_by
  )
  values (
    v_source_crew, v_source_parent, v_source_type, v_trimmed_name, v_user_id
  )
  returning space_id into v_new_id;

  -- 2. Move selected items: transfer Flow + detail; re-home if home was source.
  for v_item in
    select i.inventory_item_id, i.quantity, i.unit, i.home_space_id
    from public.inventory_items i
    where i.inventory_item_id = any(p_item_ids)
      and i.deleted_at         is null
  loop
    insert into public.flows (
      crew_id, inventory_item_id, flow_type, quantity, unit, performed_by, notes
    )
    values (
      v_source_crew, v_item.inventory_item_id, 'transfer',
      0, v_item.unit, v_user_id,
      'split_space — moved to new sibling'
    )
    returning flow_id into v_flow_id;

    insert into public.flow_transfer_details (flow_id, from_space_id, to_space_id)
    values (v_flow_id, p_space_id, v_new_id);

    -- If this item's home was the source AND the item is moving, re-home
    -- it to the new Space. Items that stay keep their existing home.
    if v_item.home_space_id = p_space_id then
      update public.inventory_items
      set home_space_id = v_new_id
      where inventory_item_id = v_item.inventory_item_id;
    end if;
  end loop;

  -- 3. Re-parent selected child Spaces onto the new sibling.
  update public.spaces
  set parent_id = v_new_id
  where space_id = any(p_child_space_ids)
    and deleted_at is null;

  return v_new_id;
end;
$$;

revoke execute on function public.split_space(uuid, text, uuid[], uuid[]) from public;
grant  execute on function public.split_space(uuid, text, uuid[], uuid[]) to authenticated;
