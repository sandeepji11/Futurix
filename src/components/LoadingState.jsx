import { Loader2, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export function LoadingState({ label, sublabel }) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-violet-950/40 via-cyan-950/30 to-violet-950/40 p-6 text-center shadow-[0_0_30px_rgba(34,211,238,0.15)]">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-12 w-12 rounded-full bg-cyan-400/20 blur-md animate-ping" />
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-slate-900/90 text-cyan-300">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-center gap-1.5 font-medium text-cyan-200">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span>{label || t.common.loading}</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          {sublabel || 'Gemma 4 AI model is synthesizing recommendations...'}
        </p>
      </div>
    </div>
  )
}

