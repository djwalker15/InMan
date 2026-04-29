interface SocialAuthButtonProps {
  provider: 'google' | 'facebook'
  label: string
  onClick: () => void
  disabled?: boolean
}

export function SocialAuthButton({
  provider,
  label,
  onClick,
  disabled,
}: SocialAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-paper-300 bg-white py-4 font-display text-base font-semibold text-ink-900 shadow-ambient-sm transition hover:bg-paper-50 disabled:opacity-60"
    >
      <img src={`/brand/${provider}.svg`} alt="" className="size-5" />
      <span>{label}</span>
    </button>
  )
}
