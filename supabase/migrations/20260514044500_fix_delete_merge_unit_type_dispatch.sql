-- ============================================================
-- Fix · delete_space_with_items + merge_spaces enum dispatch
-- ============================================================
-- ClickUp 86e163q9z: Reorganize → Delete failed with
--   `function public.space_parent_allows_child(text, unit_type)
--    does not exist`.
--
-- Root cause: space_parent_allows_child is defined as (text, text),
-- but spaces.unit_type is an enum. PL/pgSQL implicitly casts when
-- assigning into a `text` local (so move_space, which only passes
-- locals, works fine). In a SQL EXISTS subquery the column is
-- referenced directly — and Postgres function dispatch does NOT
-- coerce enum → text in that context, so the helper lookup fails.
--
-- delete_space_with_items and merge_spaces both compute children-
-- compatibility via that pattern. Splice in `::text` casts at the
-- two broken call sites; helper signature, move_space, split_space
-- and the client mirror (tree-helpers.ts) are untouched.
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

  select unit_type into v_parent_type
  from public.spaces
  where space_id = v_source_parent and deleted_at is null;
  if v_parent_type is null then raise exception 'Parent Space not found'; end if;

  if exists (
    select 1
    from public.spaces s
    where s.parent_id = p_space_id
      and s.deleted_at is null
      and not public.space_parent_allows_child(v_parent_type, s.unit_type::text)
  ) then
    raise exception
      'Children would orphan: % does not accept one of the child types',
      v_parent_type;
  end if;

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

  update public.spaces
  set parent_id = v_source_parent
  where parent_id = p_space_id
    and deleted_at is null;

  update public.spaces
  set deleted_at = now()
  where space_id = p_space_id;
end;
$$;

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

  if exists (
    select 1
    from public.spaces s
    where s.parent_id = p_source_id
      and s.deleted_at is null
      and not public.space_parent_allows_child(v_target_type, s.unit_type::text)
  ) then
    raise exception
      'Merge would orphan child Spaces — % does not accept their types',
      v_target_type;
  end if;

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

  update public.inventory_items
  set home_space_id = p_target_id
  where home_space_id = p_source_id
    and crew_id       = v_source_crew
    and deleted_at    is null;

  update public.spaces
  set parent_id = p_target_id
  where parent_id = p_source_id
    and deleted_at is null;

  update public.spaces
  set deleted_at = now()
  where space_id = p_source_id;
end;
$$;
