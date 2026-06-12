import { useEffect } from 'react'

export interface ToastProps {
  message: string
  onDismiss: () => void
  durationMs?: number
  tone?: 'success' | 'error'
}

export function Toast({
  message,
  onDismiss,
  durationMs = 3500,
  tone = 'success',
}: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, durationMs)
    return () => clearTimeout(t)
  }, [message, durationMs, onDismiss])

  const toneClasses =
    tone === 'success'
      ? 'bg-sage-700 text-white'
      : 'bg-red-600 text-white'

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto fixed bottom-24 left-1/2 z-50 max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-xl px-4 py-3 font-display text-sm font-bold shadow-ambient-lg ${toneClasses}`}
    >
      {message}
    </div>
  )
}
