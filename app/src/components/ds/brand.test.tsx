import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Brand } from './brand'

describe('Brand', () => {
  it('renders the InMan wordmark image with accessible alt text', () => {
    render(<Brand />)
    const img = screen.getByAltText('InMan') as HTMLImageElement
    expect(img.tagName).toBe('IMG')
    expect(img.getAttribute('src')).toBe('/brand/logo.svg')
  })

  it('honors a custom size', () => {
    render(<Brand size={48} />)
    const img = screen.getByAltText('InMan') as HTMLImageElement
    expect(img.style.height).toBe('48px')
  })
})
