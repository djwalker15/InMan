export type UnitType =
  | 'premises'
  | 'area'
  | 'zone'
  | 'section'
  | 'sub_section'
  | 'container'
  | 'shelf'

export interface SpaceNode {
  space_id: string
  parent_id: string | null
  unit_type: UnitType
  name: string
  deleted_at?: string | null
}

export const UNIT_TYPE_GLYPH: Record<UnitType, string> = {
  premises: '🏠',
  area: '🏷️',
  zone: '📍',
  section: '📐',
  sub_section: '🔩',
  container: '📦',
  shelf: '📏',
}

export const UNIT_TYPE_LABEL: Record<UnitType, string> = {
  premises: 'Premises',
  area: 'Area',
  zone: 'Zone',
  section: 'Section',
  sub_section: 'Sub-section',
  container: 'Container',
  shelf: 'Shelf',
}
