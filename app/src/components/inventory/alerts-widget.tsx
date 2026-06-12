import { Link } from 'react-router-dom'
import { ArrowRight, Bell } from 'lucide-react'
import { Chip } from '@/components/ds'
import {
  ALERT_LABEL,
  type InventoryAlert,
} from './inventory-status'

interface AlertsWidgetProps {
  counts: Record<InventoryAlert, number>
  loading?: boolean
}

const PRIORITIZED: InventoryAlert[] = [
  'out_of_stock',
  'expired',
  'low_stock',
  'expiring_soon',
  'displaced',
]

function chipVariant(
  alert: InventoryAlert,
): 'error' | 'warn' | 'default' {
  if (alert === 'out_of_stock' || alert === 'expired') return 'error'
  if (alert === 'low_stock' || alert === 'expiring_soon') return 'warn'
  return 'default'
}

/**
 * Compact inventory-alerts summary card. Shipped on the dashboard.
 * Tapping any count navigates to /alerts pre-filtered by that alert.
 */
export function AlertsWidget({ counts, loading }: AlertsWidgetProps) {
  const total = PRIORITIZED.reduce((sum, a) => sum + counts[a], 0)

  if (loading) {
    return (
      <section
        aria-label="Inventory alerts"
        className="flex items-center gap-3 rounded-2xl bg-paper-100 p-4"
      >
        <Bell size={18} className="text-ink-500" />
        <p className="font-body text-sm text-ink-600">Loading alerts…</p>
      </section>
    )
  }

  if (total === 0) {
    return (
      <section
        aria-label="Inventory alerts"
        className="flex items-center gap-3 rounded-2xl bg-paper-100 p-4"
      >
        <Bell size={18} className="text-sage-700" />
        <p className="font-body text-sm text-ink-700">
          Nothing to flag right now.
        </p>
      </section>
    )
  }

  return (
    <section
      aria-label="Inventory alerts"
      className="flex flex-col gap-3 rounded-2xl bg-paper-100 p-4"
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-sage-700" />
          <h2 className="font-display text-base font-bold text-ink-900">
            Needs attention
          </h2>
        </div>
        <Link
          to="/alerts"
          className="flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-[0.55px] text-sage-700 hover:underline"
        >
          See all
          <ArrowRight size={12} strokeWidth={2.5} />
        </Link>
      </header>
      <ul className="flex flex-wrap gap-1.5">
        {PRIORITIZED.filter((a) => counts[a] > 0).map((a) => (
          <li key={a}>
            <Link
              to={`/alerts?focus=${encodeURIComponent(a)}`}
              aria-label={`${counts[a]} ${ALERT_LABEL[a]}`}
            >
              <Chip variant={chipVariant(a)}>
                <span className="font-numeric font-bold">{counts[a]}</span>
                <span className="ml-1">{ALERT_LABEL[a]}</span>
              </Chip>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
