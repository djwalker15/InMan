import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AlertsWidget } from './alerts-widget'
import type { InventoryAlert } from './inventory-status'

const ZERO: Record<InventoryAlert, number> = {
  out_of_stock: 0,
  low_stock: 0,
  expiring_soon: 0,
  expired: 0,
  displaced: 0,
}

function renderWidget(counts: Record<InventoryAlert, number>) {
  return render(
    <MemoryRouter>
      <AlertsWidget counts={counts} />
    </MemoryRouter>,
  )
}

describe('AlertsWidget', () => {
  it('shows the all-clear message when nothing is flagged', () => {
    renderWidget(ZERO)
    expect(
      screen.getByText(/nothing to flag right now/i),
    ).toBeInTheDocument()
  })

  it('renders one chip per non-zero alert with the count', () => {
    renderWidget({ ...ZERO, out_of_stock: 1, low_stock: 3, displaced: 2 })
    expect(screen.getByLabelText(/1 out of stock/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/3 low stock/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/2 displaced/i)).toBeInTheDocument()
  })

  it('chip links target /alerts with the alert as the focus query', () => {
    renderWidget({ ...ZERO, low_stock: 1 })
    const link = screen.getByRole('link', { name: /1 low stock/i })
    expect(link).toHaveAttribute('href', '/alerts?focus=low_stock')
  })

  it('shows a See all link to /alerts when there is anything to show', () => {
    renderWidget({ ...ZERO, expired: 1 })
    expect(
      screen.getByRole('link', { name: /see all/i }),
    ).toHaveAttribute('href', '/alerts')
  })

  it('renders a loading state when loading is true', () => {
    render(
      <MemoryRouter>
        <AlertsWidget counts={ZERO} loading />
      </MemoryRouter>,
    )
    expect(screen.getByText(/loading alerts/i)).toBeInTheDocument()
  })
})
