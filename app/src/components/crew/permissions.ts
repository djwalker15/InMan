export type OverrideValue = 'allow' | 'deny'

export interface PermissionFeature {
  id: string
  label: string
  /**
   * Per-role default. Members and Viewers fall through here when the
   * override map omits the feature.
   */
  defaultByRole: Record<'admin' | 'member' | 'viewer', OverrideValue>
}

/**
 * MVP feature catalogue. Intentionally small — only the capabilities
 * that map to shipped journeys (inventory, spaces, members) are listed.
 * Recipes / waste / shopping land alongside their own phases (v1.1+)
 * and will extend this list rather than relying on a vague "edit
 * content" permission.
 */
export const PERMISSION_FEATURES: PermissionFeature[] = [
  {
    id: 'view_inventory',
    label: 'View inventory',
    defaultByRole: { admin: 'allow', member: 'allow', viewer: 'allow' },
  },
  {
    id: 'edit_inventory',
    label: 'Edit inventory',
    defaultByRole: { admin: 'allow', member: 'allow', viewer: 'deny' },
  },
  {
    id: 'manage_spaces',
    label: 'Manage spaces',
    defaultByRole: { admin: 'allow', member: 'allow', viewer: 'deny' },
  },
  {
    id: 'manage_members',
    label: 'Manage members',
    defaultByRole: { admin: 'allow', member: 'deny', viewer: 'deny' },
  },
]
