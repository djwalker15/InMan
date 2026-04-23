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
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#e5e7eb] bg-white py-4 font-display text-base font-semibold text-ink shadow-[0_4px_12px_0_rgba(0,0,0,0.05)] transition hover:bg-surface-raised disabled:opacity-60"
    >
      <img src={`/brand/${provider}.svg`} alt="" className="size-5" />
      <span>{label}</span>
    </button>
  )
}
