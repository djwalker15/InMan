export type CrewRole = 'owner' | 'admin' | 'member'

export interface User {
  user_id: string
  created_at: string
}

export interface Crew {
  crew_id: string
  name: string
  owner_id: string
  created_by: string
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
  deleted_at: string | null
  deletion_requested_at: string | null
}

export interface CrewMember {
  crew_member_id: string
  crew_id: string
  user_id: string
  role: CrewRole
  permission_overrides: Record<string, unknown>
  kiosk_pin: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}
