import { AlertCircle, RotateCcw, X } from 'lucide-react'

export function ErrorBanner({ message, onRetry, onDismiss }) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="relative flex flex-col gap-2 rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 text-sm leading-6 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.15)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
        <div>
          <p className="font-medium text-rose-200">{message}</p>
          <p className="mt-0.5 text-xs text-rose-300/80">
            Note: The Python FastAPI backend at <code className="rounded bg-rose-950 px-1 py-0.5 text-rose-200">http://localhost:8000</code> must be running to receive live Gemma 4 AI responses.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1 rounded-xl border border-rose-400/30 bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-100 transition hover:bg-rose-500/30"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry
          </button>
        ) : null}
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg p-1 text-rose-300 transition hover:bg-rose-500/20 hover:text-white"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  )
}

