import { CheckCircle2 } from 'lucide-react'
import { CtaTray, PrimaryButton, TextButton } from '@/components/ds'

export interface ImportError {
  index: number
  message: string
}

interface ImportResultStepProps {
  imported: number
  errors: ImportError[]
  /** Rows dropped before the RPC (failed local validation). */
  skippedLocal: number
  onDone: () => void
  onAnother: () => void
  /** Label for the secondary "start over" action. */
  anotherLabel?: string
}

export function ImportResultStep({
  imported,
  errors,
  skippedLocal,
  onDone,
  onAnother,
  anotherLabel = 'Import another file',
}: ImportResultStepProps) {
  const skipped = skippedLocal + errors.length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3 rounded-2xl bg-sage-100/40 p-4">
        <span
          aria-hidden
          className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-sage-700 text-white"
        >
          <CheckCircle2 size={20} />
        </span>
        <div className="flex flex-col">
          <p className="font-display text-base font-bold text-ink-900">
            Imported {imported} item{imported === 1 ? '' : 's'}.
          </p>
          {skipped > 0 && (
            <p className="font-body text-sm text-ink-700">
              {skipped} row{skipped === 1 ? '' : 's'} skipped.
            </p>
          )}
        </div>
      </div>

      {errors.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.35px] text-ink-900">
            Skipped rows
          </h2>
          <ul className="flex flex-col gap-1">
            {errors.map((e) => (
              <li
                key={e.index}
                className="rounded-lg bg-paper-100 px-3 py-2 font-body text-xs text-ink-700"
              >
                Row {e.index + 1}: {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <CtaTray sticky={false}>
        <PrimaryButton arrow type="button" onClick={onDone}>
          Go to inventory
        </PrimaryButton>
        <TextButton type="button" onClick={onAnother}>
          {anotherLabel}
        </TextButton>
      </CtaTray>
    </div>
  )
}
