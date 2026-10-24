import { useState } from 'react'
import { Check, Copy, Sparkles } from 'lucide-react'

export function AiResult({ title, text }) {
  const [copied, setCopied] = useState(false)

  if (!text) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  // Format bold inline: **word** -> styled span
  const formatInline = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-cyan-200">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })
  }

  // Format lines nicely
  const lines = text.split('\n')

  return (
    <article className="glass-card-glow relative overflow-hidden p-6">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-slate-950">
            <Sparkles className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-semibold text-white">
            {title || 'AI Recommendation'}
          </h2>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 transition hover:border-cyan-300/40 hover:text-white"
          title="Copy response"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-cyan-300">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-2.5 text-sm leading-relaxed text-slate-200">
        {lines.map((line, idx) => {
          const trimmed = line.trim()
          if (!trimmed) {
            return <div key={idx} className="h-2" />
          }

          // Headers
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="mt-4 text-base font-semibold text-cyan-300">
                {trimmed.replace('### ', '')}
              </h4>
            )
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="mt-5 text-lg font-bold text-white">
                {trimmed.replace('## ', '')}
              </h3>
            )
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h2 key={idx} className="mt-6 text-xl font-bold text-white">
                {trimmed.replace('# ', '')}
              </h2>
            )
          }

          // Bullet list items
          if (/^[-*•]\s+/.test(trimmed)) {
            const content = trimmed.replace(/^[-*•]\s+/, '')
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                <span>{formatInline(content)}</span>
              </div>
            )
          }

          // Numbered list items
          const numMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/)
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-semibold text-cyan-300">
                  {numMatch[1]}
                </span>
                <span className="pt-0.5">{formatInline(numMatch[2])}</span>
              </div>
            )
          }

          return <p key={idx}>{formatInline(trimmed)}</p>
        })}
      </div>
    </article>
  )
}

