import { useEffect, useRef, useState, type FormEvent } from 'react'
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser'
import { BarcodeFormat, DecodeHintType } from '@zxing/library'
import { Camera, Keyboard } from 'lucide-react'
import { PrimaryButton } from '@/components/ds'

// Hint the decoder toward retail product barcodes (1D) instead of letting it
// juggle every format (QR, Data Matrix, …). Far faster and more reliable.
const SCAN_HINTS = new Map<DecodeHintType, unknown>([
  [
    DecodeHintType.POSSIBLE_FORMATS,
    [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
    ],
  ],
  [DecodeHintType.TRY_HARDER, true],
])

// Try to decode ~6×/sec (default is every 500ms) for snappier reads.
const READER_OPTIONS = { delayBetweenScanAttempts: 150 }

// Prefer the rear camera at a high resolution — 1D barcodes need horizontal
// pixels and the selfie cam usually can't focus on a close label. `ideal`
// (not `exact`) so single-camera devices still work.
const VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    facingMode: { ideal: 'environment' },
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  },
}

interface BarcodeScannerProps {
  /** While true the camera runs; set false to pause (e.g. on a form step). */
  active: boolean
  /** Fires with the decoded value on each successful read. */
  onDetected: (code: string) => void
}

type Status = 'idle' | 'scanning' | 'denied' | 'unsupported' | 'error'

function cameraSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function'
  )
}

/**
 * Live camera barcode capture (Journey "Adding Inventory" — Method 3) backed by
 * ZXing. Decodes continuously while `active`. Always offers a manual-entry
 * fallback so the flow still works without a camera or when permission is
 * denied. Resolution of the code happens in the caller via `onDetected`.
 */
export function BarcodeScanner({ active, onDetected }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  // Derive the initial status from device support so the effect never has to
  // setState synchronously (it only does so inside async callbacks).
  const [status, setStatus] = useState<Status>(() =>
    cameraSupported() ? 'idle' : 'unsupported',
  )
  const [manualCode, setManualCode] = useState('')

  // Keep the latest callback without restarting the camera each render.
  const onDetectedRef = useRef(onDetected)
  useEffect(() => {
    onDetectedRef.current = onDetected
  }, [onDetected])

  useEffect(() => {
    if (!active || !cameraSupported()) return
    let cancelled = false
    let controls: IScannerControls | undefined
    const reader = new BrowserMultiFormatReader(SCAN_HINTS, READER_OPTIONS)
    // Defer the start past React StrictMode's synchronous mount → cleanup →
    // mount in dev. Starting synchronously opens two camera sessions on one
    // <video>; the first session's later teardown then clears the stream the
    // second one is using — a black screen plus "play() interrupted by a new
    // load request". Deferring lets the cleanup cancel the throwaway start
    // before it ever opens the camera, so only the surviving mount runs.
    const startTimer = setTimeout(() => {
      reader
        .decodeFromConstraints(VIDEO_CONSTRAINTS, videoRef.current ?? undefined, (result) => {
          if (result) onDetectedRef.current(result.getText())
        })
        .then((c) => {
          if (cancelled) {
            c.stop()
            return
          }
          controls = c
          setStatus('scanning')
        })
        .catch((err: unknown) => {
          if (cancelled) return
          const name = err instanceof Error ? err.name : ''
          setStatus(name === 'NotAllowedError' ? 'denied' : 'error')
        })
    }, 0)
    return () => {
      cancelled = true
      clearTimeout(startTimer)
      controls?.stop()
    }
  }, [active])

  function submitManual(e: FormEvent) {
    e.preventDefault()
    const code = manualCode.trim()
    if (!code) return
    setManualCode('')
    onDetected(code)
  }

  const liveCamera = status === 'idle' || status === 'scanning'

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-900">
        {/* Mounted while active so the ref exists for ZXing. */}
        {active && liveCamera && (
          <video
            ref={videoRef}
            className="size-full object-cover"
            muted
            playsInline
            aria-label="Barcode camera preview"
          />
        )}
        {liveCamera && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span className="h-1/3 w-2/3 rounded-xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]" />
          </div>
        )}
        {!liveCamera && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <Camera size={28} className="text-paper-200" aria-hidden />
            <p className="font-body text-sm text-paper-100">
              {status === 'denied'
                ? 'Camera permission was blocked. Allow access, or type the barcode below.'
                : status === 'unsupported'
                  ? "This device can't scan from the camera. Type the barcode below."
                  : "Couldn't start the camera. Type the barcode below."}
            </p>
          </div>
        )}
      </div>

      <p
        role="status"
        aria-live="polite"
        className="font-body text-xs text-ink-600"
      >
        {status === 'scanning'
          ? 'Scanning… hold steady on the barcode.'
          : 'You can also enter a barcode by hand.'}
      </p>

      <form onSubmit={submitManual} className="flex items-end gap-2">
        <label className="flex flex-1 flex-col gap-2">
          <span className="flex items-center gap-1.5 font-display text-sm font-bold uppercase tracking-[0.35px] text-ink-900">
            <Keyboard size={14} aria-hidden /> Enter barcode
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="012345678905"
            className="h-14 w-full rounded-xl bg-paper-100 px-3 font-body text-base text-ink-900 outline-none focus:bg-paper-250"
          />
        </label>
        <PrimaryButton type="submit" disabled={!manualCode.trim()}>
          Look up
        </PrimaryButton>
      </form>
    </div>
  )
}
