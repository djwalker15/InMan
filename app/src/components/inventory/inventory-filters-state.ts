import type { InventoryAlert } from './inventory-status'

export interface InventoryFiltersState {
  query: string
  categoryIds: Set<string>
  spaceId: string
  spaceIncludeChildren: boolean
  alerts: Set<InventoryAlert>
}

export const EMPTY_FILTERS: InventoryFiltersState = {
  query: '',
  categoryIds: new Set(),
  spaceId: '',
  spaceIncludeChildren: true,
  alerts: new Set(),
}
