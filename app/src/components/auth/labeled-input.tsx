import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface LabeledInputProps {
  label: string
  value: string
  onChange: (v: string) => void
  icon?: ReactNode
  trailing?: ReactNode
  helperText?: string
  className?: string
  type?: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
  inputMode?: 'text' | 'email' | 'tel' | 'numeric'
}

export function LabeledInput({
  label,
  value,
  onChange,
  icon,
  trailing,
  helperText,
  className,
  type = 'text',
  placeholder,
  autoComplete,
  required,
  inputMode,
}: LabeledInputProps) {
  return (
    <label className={cn('flex flex-col', className)}>
      <span className="px-1 text-[11px] font-bold uppercase tracking-[0.55px] text-ink-muted">
        {label}
      </span>
      <div className="relative mt-1">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-ink-muted">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          inputMode={inputMode}
          className={cn(
            'w-full rounded-lg bg-white py-4 font-sans text-base text-ink outline-none placeholder:text-ink-muted focus:ring-2 focus:ring-brand-500/40',
            icon ? 'pl-12' : 'pl-4',
            trailing ? 'pr-12' : 'pr-4',
          )}
        />
        {trailing && (
          <span className="absolute inset-y-0 right-4 flex items-center">
            {trailing}
          </span>
        )}
      </div>
      {helperText && (
        <span className="mt-2 px-1 text-xs italic text-ink-muted">
          {helperText}
        </span>
      )}
    </label>
  )
}
