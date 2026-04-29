import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from './progress-bar'

describe('ProgressBar', () => {
  it('renders the default eyebrow label', () => {
    render(<ProgressBar step={2} total={5} />)
    expect(screen.getByText('STEP 2 OF 5')).toBeInTheDocument()
  })

  it('renders a custom label when provided', () => {
    render(<ProgressBar step={1} total={3} label="ALMOST THERE" />)
    expect(screen.getByText('ALMOST THERE')).toBeInTheDocument()
  })

  it('exposes step / max via the progressbar role', () => {
    render(<ProgressBar step={3} total={4} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '3')
    expect(bar).toHaveAttribute('aria-valuemax', '4')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
  })

  it('clamps width to [0, 100]', () => {
    const { rerender } = render(<ProgressBar step={-2} total={4} />)
    let inner = screen.getByRole('progressbar').firstElementChild as HTMLElement
    expect(inner.style.width).toBe('0%')

    rerender(<ProgressBar step={10} total={4} />)
    inner = screen.getByRole('progressbar').firstElementChild as HTMLElement
    expect(inner.style.width).toBe('100%')
  })
})
