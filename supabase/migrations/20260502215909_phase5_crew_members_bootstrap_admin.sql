-- ============================================================
-- Hotfix: align crew_members owner-bootstrap RLS with the P5.1
-- role CHECK constraint.
--
-- P5.1 ('20260502103231_phase5_crew_management') tightened the
-- crew_members.role CHECK to ('admin','member','viewer') because
-- ownership now lives on crews.owner_id. The original Phase 1
-- bootstrap policy (20260421000001_auth_slice) still required
-- role='owner', which is no longer a valid value — every crew
-- creation INSERT against crew_members now fails with 403.
--
-- Fix: the bootstrap policy now requires role='admin'. The caller
-- must still be the crew Owner (crews.owner_id matches the JWT)
-- and must be inserting their own user_id, so the security
-- envelope is unchanged.
-- ============================================================

drop policy if exists crew_members_insert_owner_bootstrap
  on public.crew_members;

create policy crew_members_insert_owner_bootstrap
on public.crew_members
for insert
to authenticated
with check (
  user_id = (select public.current_user_id())
  and role = 'admin'
  and public.is_crew_owner(crew_id)
);
