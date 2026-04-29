import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { NavHeader } from './nav-header'

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderInRouter(ui: React.ReactElement) {
  return render(
    <MemoryRouter initialEntries={['/start']}>
      <Routes>
        <Route path="/*" element={ui} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('NavHeader', () => {
  it('renders the menu (default) leading button', () => {
    renderInRouter(<NavHeader title="Welcome" />)
    expect(screen.getByLabelText(/open menu/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /welcome/i }),
    ).toBeInTheDocument()
  })

  it('renders a back button and calls navigate(-1) on click', () => {
    mockNavigate.mockClear()
    renderInRouter(<NavHeader leading="back" title="" />)
    fireEvent.click(screen.getByLabelText(/back/i))
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  it('renders a close button and routes to leadingTo', () => {
    mockNavigate.mockClear()
    renderInRouter(<NavHeader leading="close" leadingTo="/dashboard" title="" />)
    fireEvent.click(screen.getByLabelText(/close/i))
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })

  it('renders a trailing slot', () => {
    renderInRouter(
      <NavHeader title="t" trailing={<span data-testid="t">x</span>} />,
    )
    expect(screen.getByTestId('t')).toBeInTheDocument()
  })

  it('omits the leading control when leading="none"', () => {
    renderInRouter(<NavHeader leading="none" title="t" />)
    expect(screen.queryByLabelText(/open menu|back|close/i)).toBeNull()
  })
})
