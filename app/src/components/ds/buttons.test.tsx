import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { PrimaryButton, SecondaryButton, TextButton } from './buttons'

describe('PrimaryButton', () => {
  it('renders children and a hidden arrow when arrow is set', () => {
    render(<PrimaryButton arrow>Continue</PrimaryButton>)
    const btn = screen.getByRole('button', { name: /continue/i })
    expect(btn).toBeInTheDocument()
    // arrow is decorative — count the SVG
    expect(btn.querySelectorAll('svg')).toHaveLength(1)
  })

  it('omits the arrow by default', () => {
    render(<PrimaryButton>Save</PrimaryButton>)
    const btn = screen.getByRole('button', { name: /save/i })
    expect(btn.querySelectorAll('svg')).toHaveLength(0)
  })

  it('uses the sage gradient + white text classes (skill rule: no flat sage)', () => {
    render(<PrimaryButton>Go</PrimaryButton>)
    const btn = screen.getByRole('button', { name: /go/i })
    expect(btn.className).toMatch(/from-sage-700/)
    expect(btn.className).toMatch(/to-sage-600/)
    expect(btn.className).toMatch(/text-white/)
  })

  it('forwards onClick', () => {
    const handler = vi.fn()
    render(<PrimaryButton onClick={handler}>Tap</PrimaryButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('respects disabled', () => {
    render(<PrimaryButton disabled>Tap</PrimaryButton>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})

describe('SecondaryButton', () => {
  it('renders with paper-250 background and sage text', () => {
    render(<SecondaryButton>Back</SecondaryButton>)
    const btn = screen.getByRole('button', { name: /back/i })
    expect(btn.className).toMatch(/bg-paper-250/)
    expect(btn.className).toMatch(/text-sage-700/)
  })
})

describe('TextButton', () => {
  it('renders as a low-emphasis button', () => {
    render(<TextButton>Skip for now</TextButton>)
    const btn = screen.getByRole('button', { name: /skip for now/i })
    expect(btn.className).toMatch(/text-ink-500/)
    expect(btn.className).toMatch(/hover:underline/)
  })
})
