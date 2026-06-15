import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { mockClerk } from '@/test/clerk-mock'
import { makeSupabaseMock } from '@/test/supabase-mock'
import AddMethodPickerPage from './index'

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const crewMembers = {
  crew_members: {
    select: {
      data: [
        {
          crew_id: 'crew_abc',
          role: 'admin',
          crews: { name: 'Test', owner_id: 'user_1' },
        },
      ],
      error: null,
    },
  },
}

describe('AddMethodPickerPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockClerk({ user: { id: 'user_1' } })
  })

  it('renders all four add methods', async () => {
    makeSupabaseMock(crewMembers)
    renderWithRouter(<AddMethodPickerPage />)
    await waitFor(() => {
      expect(screen.getByText(/quick add/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/search & add/i)).toBeInTheDocument()
    expect(screen.getByText(/scan a barcode/i)).toBeInTheDocument()
    expect(screen.getByText(/bulk import/i)).toBeInTheDocument()
  })

  it('navigates to quick add and manual; coming-soon tiles stay disabled', async () => {
    makeSupabaseMock(crewMembers)
    renderWithRouter(<AddMethodPickerPage />)

    const quick = await screen.findByRole('radio', { name: /quick add/i })
    fireEvent.click(quick)
    expect(mockNavigate).toHaveBeenCalledWith('/inventory/add/quick')

    fireEvent.click(screen.getByRole('radio', { name: /search & add/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/inventory/add/manual')

    // Scan + bulk import are not built yet on this branch.
    const scan = screen.getByRole('radio', { name: /scan a barcode/i })
    expect(scan).toBeDisabled()
    mockNavigate.mockClear()
    fireEvent.click(scan)
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('back-arrow routes to /inventory', async () => {
    makeSupabaseMock(crewMembers)
    renderWithRouter(<AddMethodPickerPage />)
    const back = await screen.findByLabelText(/back to inventory/i)
    fireEvent.click(back)
    expect(mockNavigate).toHaveBeenCalledWith('/inventory')
  })
})
