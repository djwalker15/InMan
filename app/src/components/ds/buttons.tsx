import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

interface PrimaryButtonProps extends ButtonProps {
  arrow?: boolean
  height?: 'sm' | 'md' | 'lg'
}

const heightClass: Record<NonNullable<PrimaryButtonProps['height']>, string> = {
  sm: 'h-12',
  md: 'h-14',
  lg: 'h-[60px]',
}

export function PrimaryButton({
  children,
  arrow = false,
  height = 'md',
  className,
  type = 'button',
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      {...rest}
      className={cn(
        'flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-br from-sage-700 to-sage-600',
        'font-display text-lg font-bold text-white shadow-cta',
        'transition active:scale-[0.98] hover:brightness-105',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100',
        heightClass[height],
        className,
      )}
    >
      {children}
      {arrow && <ArrowRight size={18} strokeWidth={2.5} />}
    </button>
  )
}

export function SecondaryButton({
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      {...rest}
      className={cn(
        'flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-paper-250',
        'font-display text-lg font-bold text-sage-700',
        'transition active:scale-[0.98] hover:bg-paper-300',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-paper-250',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function TextButton({
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      {...rest}
      className={cn(
        'inline-flex items-center justify-center px-1 py-3 font-body text-sm text-ink-500',
        'transition hover:text-ink-700 hover:underline',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      {children}
    </button>
  )
}
