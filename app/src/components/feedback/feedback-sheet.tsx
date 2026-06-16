import { useId, useState, type FormEvent } from 'react'
import { Bug, ImagePlus, Lightbulb, MessageCircleQuestion, X } from 'lucide-react'
import { PrimaryButton, Sheet, TextButton } from '@/components/ds'
import { useSupabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import {
  gatherContext,
  submitFeedback,
  uploadFeedbackScreenshot,
  type FeedbackType,
} from '@/lib/feedback'

interface FeedbackSheetProps {
  open: boolean
  onClose: () => void
  /** Called after a successful submit — parent shows a toast + closes. */
  onSubmitted: () => void
  crewId: string | null
  userId: string | null
}

const TYPE_OPTIONS: {
  value: FeedbackType
  label: string
  icon: typeof Bug
}[] = [
  { value: 'bug', label: 'Bug', icon: Bug },
  { value: 'idea', label: 'Idea', icon: Lightbulb },
  { value: 'question', label: 'Question', icon: MessageCircleQuestion },
]

const MAX_MESSAGE = 4000

export function FeedbackSheet({
  open,
  onClose,
  onSubmitted,
  crewId,
  userId,
}: FeedbackSheetProps) {
  const supabase = useSupabase()
  const messageId = useId()
  const [type, setType] = useState<FeedbackType>('bug')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [contactOk, setContactOk] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trimmed = message.trim()
  const valid = trimmed.length >= 1 && trimmed.length <= MAX_MESSAGE

  function reset() {
    setType('bug')
    setMessage('')
    setFile(null)
    setContactOk(false)
    setError(null)
  }

  function handleClose() {
    if (submitting) return
    reset()
    onClose()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!valid || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      let screenshotPath: string | null = null
      if (file && userId) {
        screenshotPath = await uploadFeedbackScreenshot(supabase, userId, file)
      }
      await submitFeedback(supabase, {
        feedback_type: type,
        message: trimmed,
        contact_ok: contactOk,
        context: gatherContext(),
        crew_id: crewId,
        screenshot_path: screenshotPath,
      })
      reset()
      onSubmitted()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not send your feedback. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onClose={handleClose} ariaLabel="Send feedback" title="Send feedback">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <p className="font-body text-sm text-ink-600">
          Spotted a bug or have an idea? Tell us what’s on your mind — we read
          every note.
        </p>

        {/* Type selector */}
        <fieldset>
          <legend className="font-display text-sm font-bold uppercase tracking-[0.35px] text-ink-900">
            Type
          </legend>
          <div className="mt-2 flex gap-2">
            {TYPE_OPTIONS.map((opt) => {
              const Icon = opt.icon
              const selected = type === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setType(opt.value)}
                  className={cn(
                    'inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 font-body text-sm transition',
                    selected
                      ? 'bg-sage-100 font-semibold text-sage-700'
                      : 'bg-paper-100 text-ink-600 hover:bg-paper-200',
                  )}
                >
                  <Icon size={16} aria-hidden />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </fieldset>

        {/* Message */}
        <div className="flex flex-col">
          <label
            htmlFor={messageId}
            className="font-display text-sm font-bold uppercase tracking-[0.35px] text-ink-900"
          >
            Message
          </label>
          <textarea
            id={messageId}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={MAX_MESSAGE}
            required
            placeholder="What happened, or what would you like to see?"
            className={cn(
              'mt-2 w-full resize-y rounded-xl border-b-2 border-transparent bg-paper-100 px-4 py-3',
              'font-body text-base text-ink-900 outline-none transition placeholder:text-ink-500',
              'focus:border-sage-700 focus:bg-paper-250',
            )}
          />
        </div>

        {/* Screenshot */}
        <div className="flex flex-col">
          <span className="font-display text-sm font-bold uppercase tracking-[0.35px] text-ink-900">
            Screenshot <span className="font-body lowercase text-ink-500">(optional)</span>
          </span>
          {file ? (
            <div className="mt-2 flex items-center justify-between rounded-xl bg-paper-100 px-4 py-3">
              <span className="truncate font-body text-sm text-ink-700">
                {file.name}
              </span>
              <button
                type="button"
                aria-label="Remove screenshot"
                onClick={() => setFile(null)}
                className="ml-3 flex size-7 shrink-0 items-center justify-center rounded-full text-ink-600 transition hover:bg-paper-200"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label
              className={cn(
                'mt-2 flex cursor-pointer items-center gap-2 rounded-xl bg-paper-100 px-4 py-3',
                'font-body text-sm text-ink-600 transition hover:bg-paper-200',
              )}
            >
              <ImagePlus size={16} aria-hidden />
              Attach an image
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          )}
        </div>

        {/* Contact consent */}
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={contactOk}
            onChange={(e) => setContactOk(e.target.checked)}
            className="mt-0.5 size-4 accent-sage-700"
          />
          <span className="font-body text-sm text-ink-600">
            It’s OK to follow up with me about this.
          </span>
        </label>

        {error && (
          <p role="alert" className="font-body text-sm text-error">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <PrimaryButton type="submit" disabled={!valid || submitting}>
            {submitting ? 'Sending…' : 'Send feedback'}
          </PrimaryButton>
          <TextButton type="button" onClick={handleClose} disabled={submitting}>
            Cancel
          </TextButton>
        </div>
      </form>
    </Sheet>
  )
}
