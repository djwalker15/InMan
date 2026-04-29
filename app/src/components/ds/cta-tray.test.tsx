import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CtaTray } from './cta-tray'

describe('CtaTray', () => {
  it('renders children and applies sticky glassmorphism by default', () => {
    render(
      <CtaTray>
        <button>Continue</button>
      </CtaTray>,
    )
    const wrapper = screen.getByRole('button', { name: /continue/i }).parentElement!
    expect(wrapper.className).toMatch(/sticky/)
    expect(wrapper.className).toMatch(/backdrop-blur-md/)
  })

  it('renders in flow when sticky=false', () => {
    render(
      <CtaTray sticky={false}>
        <button>Done</button>
      </CtaTray>,
    )
    const wrapper = screen.getByRole('button', { name: /done/i }).parentElement!
    expect(wrapper.className).not.toMatch(/sticky/)
  })
})
