-- ============================================================
-- Phase 4 — record_transfer RPC
-- Atomic move of an inventory_item between Spaces. Inserts a transfer
-- flow + flow_transfer_details; the existing flow_transfer_apply_trigger
-- updates inventory_items.current_space_id when the detail row lands.
-- ============================================================

create or replace function public.record_transfer(
  p_inventory_item_id uuid,
  p_to_space_id       uuid,
  p_notes             text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_user_id    text;
  v_crew_id    uuid;
  v_from_space uuid;
  v_unit       text;
  v_flow_id    uuid;
begin
  v_user_id := public.current_user_id();
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  select i.crew_id, i.current_space_id, i.unit
    into v_crew_id, v_from_space, v_unit
  from public.inventory_items i
  where i.inventory_item_id = p_inventory_item_id
    and i.deleted_at        is null;
  if v_crew_id is null then raise exception 'Inventory item not found'; end if;
  if not public.is_crew_member(v_crew_id) then
    raise exception 'Not a member of this Crew';
  end if;

  -- The destination must belong to the same crew and be live.
  if not exists (
    select 1 from public.spaces
    where space_id    = p_to_space_id
      and crew_id     = v_crew_id
      and deleted_at  is null
  ) then
    raise exception 'Destination space not in this Crew';
  end if;

  if v_from_space = p_to_space_id then
    raise exception 'Source and destination spaces are the same';
  end if;

  -- Insert the parent flow first (transfer leaves quantity unchanged).
  insert into public.flows (
    crew_id, inventory_item_id, flow_type, quantity, unit, performed_by, notes
  )
  values (
    v_crew_id, p_inventory_item_id, 'transfer', 0, v_unit, v_user_id, p_notes
  )
  returning flow_id into v_flow_id;

  -- Detail row — its trigger updates inventory_items.current_space_id.
  insert into public.flow_transfer_details (flow_id, from_space_id, to_space_id)
  values (v_flow_id, v_from_space, p_to_space_id);

  return v_flow_id;
end;
$$;

revoke execute on function public.record_transfer(uuid, uuid, text) from public;
grant  execute on function public.record_transfer(uuid, uuid, text) to authenticated;
