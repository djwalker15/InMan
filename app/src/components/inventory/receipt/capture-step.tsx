import { useRef } from 'react'
import { Camera, Receipt } from 'lucide-react'

interface ReceiptCaptureStepProps {
  busy: boolean
  error: string | null
  onCapture: (file: File) => void
}

export function ReceiptCaptureStep({
  busy,
  error,
  onCapture,
}: ReceiptCaptureStepProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-paper-300 bg-paper-100 p-10 text-center transition hover:bg-paper-150 disabled:opacity-60"
      >
        <span
          aria-hidden
          className="flex size-14 items-center justify-center rounded-full bg-paper-50 text-sage-700"
        >
          {busy ? <Receipt size={26} /> : <Camera size={26} />}
        </span>
        <span className="font-display text-base font-bold text-ink-900">
          {busy ? 'Reading your receipt…' : 'Photograph a receipt'}
        </span>
        <span className="font-body text-sm text-ink-600">
          Snap a photo or pick an image of a receipt or invoice. We'll pull out
          the items for you to confirm.
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        aria-label="Receipt photo"
        onChange={(e) => {
          const file = e.target.files?.[0]
          // Reset so re-choosing the same file re-fires onChange.
          e.target.value = ''
          if (file) onCapture(file)
        }}
      />
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
