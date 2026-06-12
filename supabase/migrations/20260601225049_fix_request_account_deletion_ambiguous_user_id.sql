-- ============================================================
-- Fix request_account_deletion: "column reference user_id is ambiguous"
--
-- The function declares a `user_id text` OUT parameter (in the
-- `returns table(...)` shape) AND iterates over public.crew_members
-- which also has a `user_id` column. The inner UPDATE statements in
-- the loop reference `user_id` without a table qualifier, so plpgsql
-- can't tell whether the unqualified `user_id` means the OUT param
-- or the table column and aborts with "ambiguous reference."
--
-- This never tripped during slice-3 verification because the function
-- was only invoked from the delete-account edge function, which was
-- gated behind verify_jwt at the gateway level until v5. With the
-- gateway open, the first real call surfaced the bug as a 500.
--
-- Fix: alias the table in every loop-local UPDATE so each `user_id`
-- column reference is fully qualified.
-- ============================================================

create or replace function public.request_account_deletion(
  p_transfer_to_user_id text default null,
  p_target_user_id      text default null
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
  v_target            text;
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

  if p_target_user_id is null then
    if v_caller is null then
      raise exception 'Not authenticated';
    end if;
    v_target := v_caller;
  else
    if v_caller is not null then
      raise exception 'Only the service role may delete a user other than themselves'
        using errcode = 'insufficient_privilege';
    end if;
    v_target := p_target_user_id;
  end if;

  select u.deleted_at into v_already_deleted
  from public.users u
  where u.user_id = v_target;

  if not found then
    raise exception 'User not found' using errcode = 'no_data_found';
  end if;

  if v_already_deleted is not null then
    raise exception 'Account is already deleted' using errcode = 'invalid_parameter_value';
  end if;

  if p_transfer_to_user_id is not null and p_transfer_to_user_id = v_target then
    raise exception 'Cannot transfer ownership to yourself' using errcode = 'invalid_parameter_value';
  end if;

  for r in
    select c.crew_id
    from public.crews c
    where c.owner_id   = v_target
      and c.deleted_at is null
    order by c.crew_id
  loop
    select count(*) into v_other_admins
    from public.crew_members cm
    where cm.crew_id    = r.crew_id
      and cm.user_id    <> v_target
      and cm.role       = 'admin'
      and cm.deleted_at is null;

    select count(*) into v_other_members
    from public.crew_members cm
    where cm.crew_id    = r.crew_id
      and cm.user_id    <> v_target
      and cm.deleted_at is null;

    if p_transfer_to_user_id is not null then
      select cm.role into v_transferee_role
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

      update public.crew_members cm
        set deleted_at = now()
        where cm.crew_id    = r.crew_id
          and cm.user_id    = v_target
          and cm.deleted_at is null;

      v_transferred := v_transferred + 1;

    elsif v_other_members > 0 then
      update public.crews
        set is_ownerless        = true,
            became_ownerless_at = now()
        where crew_id = r.crew_id;

      update public.crew_members cm
        set deleted_at = now()
        where cm.crew_id    = r.crew_id
          and cm.user_id    = v_target
          and cm.deleted_at is null;

      v_marked_ownerless := v_marked_ownerless + 1;

    else
      update public.crews
        set deleted_at = now()
        where crew_id = r.crew_id;

      update public.crew_members cm
        set deleted_at = now()
        where cm.crew_id    = r.crew_id
          and cm.user_id    = v_target
          and cm.deleted_at is null;

      v_soft_deleted := v_soft_deleted + 1;
    end if;
  end loop;

  update public.crew_members cm
    set deleted_at = now()
    where cm.user_id    = v_target
      and cm.deleted_at is null
      and not exists (
        select 1
        from public.crews c
        where c.crew_id  = cm.crew_id
          and c.owner_id = v_target
      );

  update public.users u
    set deleted_at            = now(),
        deletion_requested_at = now()
    where u.user_id = v_target;

  user_id                := v_target;
  crews_transferred      := v_transferred;
  crews_marked_ownerless := v_marked_ownerless;
  crews_soft_deleted     := v_soft_deleted;
  return next;
end;
$$;

revoke execute on function public.request_account_deletion(text, text) from public;
grant  execute on function public.request_account_deletion(text, text) to authenticated;
