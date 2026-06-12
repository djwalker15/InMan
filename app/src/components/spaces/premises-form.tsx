import { useState, type FormEvent } from 'react'
import { CtaTray, Field, PrimaryButton } from '@/components/ds'

interface PremisesFormProps {
  onCreate: (name: string) => Promise<void> | void
  submitting?: boolean
  error?: string | null
}

export function PremisesForm({ onCreate, submitting = false, error }: PremisesFormProps) {
  const [name, setName] = useState('')
  const trimmed = name.trim()
  const disabled = submitting || trimmed.length < 2 || trimmed.length > 64

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (disabled) return
    await onCreate(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-[28px] font-bold leading-[34px] tracking-[-0.4px] text-ink-900">
          Name your Premises
        </h1>
        <p className="font-body text-base leading-6 text-ink-700">
          The top of your hierarchy — your house, apartment, or business.
          Everything else lives inside it.
        </p>
      </header>

      <Field
        label="PREMISES NAME"
        placeholder="My House"
        hint="Examples: My House, The Apartment, Haywire Bar, Lake House."
        autoFocus
        required
        minLength={2}
        maxLength={64}
        value={name}
        onValueChange={setName}
        error={error ?? undefined}
      />

      <CtaTray sticky={false}>
        <PrimaryButton arrow type="submit" disabled={disabled}>
          {submitting ? 'Creating…' : 'Continue'}
        </PrimaryButton>
      </CtaTray>
    </form>
  )
}
