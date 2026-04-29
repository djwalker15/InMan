import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { mockClerk } from '@/test/clerk-mock'
import { makeSupabaseMock } from '@/test/supabase-mock'
import OnboardingSpacesPage from './spaces'
import { SPACES_EXPLAINER_DISMISSED_KEY } from '@/components/spaces/explainer-storage'

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function setupClerk() {
  mockClerk({ user: { id: 'user_1', firstName: 'Test' } })
}

describe('OnboardingSpacesPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    sessionStorage.removeItem(SPACES_EXPLAINER_DISMISSED_KEY)
    setupClerk()
  })

  it('renders without crashing', () => {
    makeSupabaseMock({
      crew_members: { maybeSingle: { data: null, error: null } },
    })
    renderWithRouter(<OnboardingSpacesPage />)
    expect(
      screen.getByRole('heading', { name: /set up spaces/i }),
    ).toBeInTheDocument()
  })

  it('shows ProgressBar at step 3 of 5', () => {
    makeSupabaseMock({
      crew_members: { maybeSingle: { data: null, error: null } },
    })
    renderWithRouter(<OnboardingSpacesPage />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '3')
    expect(bar).toHaveAttribute('aria-valuemax', '5')
    expect(screen.getByText('STEP 3 OF 5')).toBeInTheDocument()
  })

  it('close button routes to /dashboard', () => {
    makeSupabaseMock({
      crew_members: { maybeSingle: { data: null, error: null } },
    })
    renderWithRouter(<OnboardingSpacesPage />)
    fireEvent.click(screen.getByLabelText(/^close$/i))
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })

  it('shows the explainer by default', () => {
    makeSupabaseMock({
      crew_members: { maybeSingle: { data: null, error: null } },
    })
    renderWithRouter(<OnboardingSpacesPage />)
    expect(
      screen.getByRole('heading', { name: /how spaces work/i }),
    ).toBeInTheDocument()
  })

  it('hides the explainer after dismiss and persists the flag', () => {
    makeSupabaseMock({
      crew_members: { maybeSingle: { data: null, error: null } },
    })
    renderWithRouter(<OnboardingSpacesPage />)
    fireEvent.click(
      screen.getByRole('button', { name: /got it, let's build/i }),
    )
    expect(
      screen.queryByRole('heading', { name: /how spaces work/i }),
    ).not.toBeInTheDocument()
    expect(
      sessionStorage.getItem(SPACES_EXPLAINER_DISMISSED_KEY),
    ).toBe('1')
  })

  it('respects the persisted dismiss flag on remount', () => {
    sessionStorage.setItem(SPACES_EXPLAINER_DISMISSED_KEY, '1')
    makeSupabaseMock({
      crew_members: { maybeSingle: { data: null, error: null } },
    })
    renderWithRouter(<OnboardingSpacesPage />)
    expect(
      screen.queryByRole('heading', { name: /how spaces work/i }),
    ).not.toBeInTheDocument()
  })

  it('"?" button reopens the explainer after dismiss', () => {
    makeSupabaseMock({
      crew_members: { maybeSingle: { data: null, error: null } },
    })
    renderWithRouter(<OnboardingSpacesPage />)
    fireEvent.click(
      screen.getByRole('button', { name: /got it, let's build/i }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: /show the spaces explainer/i }),
    )
    expect(
      screen.getByRole('heading', { name: /how spaces work/i }),
    ).toBeInTheDocument()
  })

  it('shows the premises form once explainer is dismissed', () => {
    sessionStorage.setItem(SPACES_EXPLAINER_DISMISSED_KEY, '1')
    makeSupabaseMock({
      crew_members: { maybeSingle: { data: null, error: null } },
    })
    renderWithRouter(<OnboardingSpacesPage />)
    expect(
      screen.getByRole('heading', { name: /name your premises/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('PREMISES NAME')).toBeInTheDocument()
  })

  it('inserts a Premises with the active crew_id and renders it in the tree', async () => {
    sessionStorage.setItem(SPACES_EXPLAINER_DISMISSED_KEY, '1')
    const sb = makeSupabaseMock({
      crew_members: {
        maybeSingle: {
          data: { crew_id: 'crew_abc', role: 'owner' },
          error: null,
        },
      },
      spaces: {
        // Initial fetch: no spaces yet for this crew
        select: { data: [], error: null },
        // Insert returns the new premises row
        single: {
          data: {
            space_id: 'sp_1',
            parent_id: null,
            unit_type: 'premises',
            name: 'My House',
            deleted_at: null,
          },
          error: null,
        },
      },
    })
    renderWithRouter(<OnboardingSpacesPage />)

    // Wait for the crew lookup to settle
    await waitFor(() => {
      expect(sb.from).toHaveBeenCalledWith('crew_members')
    })

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'My House' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(sb.tables.spaces.insert).toHaveBeenCalledWith({
        crew_id: 'crew_abc',
        parent_id: null,
        unit_type: 'premises',
        name: 'My House',
        created_by: 'user_1',
      })
    })

    // After insert, phase advances past the form (handing off to the
    // guided / tree-editor phase) — the form heading disappears.
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /name your premises/i }),
      ).not.toBeInTheDocument()
    })
  })

  it('surfaces a Supabase error and stays on the form', async () => {
    sessionStorage.setItem(SPACES_EXPLAINER_DISMISSED_KEY, '1')
    makeSupabaseMock({
      crew_members: {
        maybeSingle: {
          data: { crew_id: 'crew_abc', role: 'owner' },
          error: null,
        },
      },
      spaces: {
        select: { data: [], error: null },
        single: {
          data: null,
          error: new Error('insert blocked by RLS'),
        },
      },
    })
    renderWithRouter(<OnboardingSpacesPage />)

    await waitFor(() => {
      expect(screen.getByText('PREMISES NAME')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'My House' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(screen.getByText('insert blocked by RLS')).toBeInTheDocument()
    })
    // Still on the premises form
    expect(
      screen.getByRole('heading', { name: /name your premises/i }),
    ).toBeInTheDocument()
  })
})
