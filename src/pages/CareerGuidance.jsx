import { useEffect, useRef, useState } from 'react'
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Lightbulb,
} from 'lucide-react'
import { askAI, aiEndpoints } from '../api'
import { ErrorBanner } from '../components/ErrorBanner'
import { PageHeader } from '../components/PageHeader'
import { GlassCard } from '../components/GlassCard'
import { useLanguage } from '../context/LanguageContext'
import { useStudent } from '../context/StudentContext'

const suggestionCategories = [
  {
    category: 'Stream & School',
    items: [
      'Which stream should I choose after Class 10 if I like both coding and biology?',
      'Is taking Commerce with Mathematics better than without Mathematics for FinTech?',
      'What are the advantages of Arts/Humanities for modern digital careers?',
    ],
  },
  {
    category: 'Tech & Emerging Roles',
    items: [
      'What are the core skills an AI Engineer needs before entering college?',
      'How does a UI/UX Designer career path look in India over the next 5 years?',
      'Can I become a Software Developer without an engineering (B.Tech) degree?',
    ],
  },
  {
    category: 'Practical Next Steps',
    items: [
      'What free projects can a high school or college student build to stand out?',
      'How should I prepare for entrance exams like JEE, NEET, or CUET alongside school?',
    ],
  },
]

export function CareerGuidance() {
  const { t, language } = useLanguage()
  const { profile, chat, saveChat, clearChat } = useStudent()

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [activeCategory, setActiveCategory] = useState(suggestionCategories[0].category)

  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat, loading])

  // Format bold inline inside message bubbles
  const formatBubbleText = (text) => {
    const lines = text.split('\n')
    return (
      <div className="space-y-1.5">
        {lines.map((line, idx) => {
          const trimmed = line.trim()
          if (!trimmed) return <div key={idx} className="h-1.5" />

          // Bullet point
          if (/^[-*•]\s+/.test(trimmed)) {
            const content = trimmed.replace(/^[-*•]\s+/, '')
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                <span>{renderBold(content)}</span>
              </div>
            )
          }

          // Numbered item
          const numMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/)
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="font-semibold text-cyan-300 shrink-0">{numMatch[1]}.</span>
                <span>{renderBold(numMatch[2])}</span>
              </div>
            )
          }

          return <p key={idx}>{renderBold(trimmed)}</p>
        })}
      </div>
    )
  }

  const renderBold = (str) => {
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

  async function send(text) {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg = { role: 'user', content, time: now }
    const updatedHistory = [...chat, userMsg]

    saveChat(updatedHistory)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const result = await askAI(aiEndpoints.chat, content, language)
      const assistantMsg = {
        role: 'assistant',
        content: result,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      saveChat([...updatedHistory, assistantMsg])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyChat = async () => {
    if (!chat.length) return
    const formatted = chat
      .map(
        (m) =>
          `[${m.role === 'user' ? profile.name || 'Student' : 'Futurix AI'} - ${m.time || ''}]\n${m.content}\n`
      )
      .join('\n')
    try {
      await navigator.clipboard.writeText(formatted)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col space-y-6">
      <PageHeader
        eyebrow="1-on-1 AI Career Mentorship"
        title={t.chat.title}
        intro="Have an honest conversation with the Gemma 4 AI mentor. Receive unbiased guidance about streams, degrees, skills, and industry trends."
      />

      {/* Suggested Questions Drawer */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Lightbulb className="h-4 w-4" />
            <span>Suggested Questions by Category</span>
          </div>

          <div className="flex gap-1">
            {suggestionCategories.map((cat) => (
              <button
                key={cat.category}
                type="button"
                onClick={() => setActiveCategory(cat.category)}
                className={`text-[11px] px-2.5 py-1 rounded-lg transition ${
                  activeCategory === cat.category
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestionCategories
            .find((c) => c.category === activeCategory)
            ?.items.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="chip text-left text-xs transition hover:border-cyan-300/40 hover:bg-white/10 hover:text-white"
              >
                “{q}”
              </button>
            ))}
        </div>
      </GlassCard>

      {/* Main Chat Window */}
      <section className="glass-card flex min-h-[520px] flex-col overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(2,6,23,0.6)]">
        {/* Chat Header Status Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/60 px-5 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-slate-950 font-bold">
                <Bot className="h-5 w-5" />
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">Futurix Mentor</span>
                <span className="chip text-[10px] text-cyan-300 bg-cyan-950/40 border-cyan-400/20">
                  Gemma 4 IT
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-medium">Online • Indian Education Specialist</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {chat.length > 0 ? (
              <>
                <button
                  type="button"
                  onClick={handleCopyChat}
                  className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white"
                  title="Copy chat transcript"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-cyan-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-400 hover:bg-rose-500/10 hover:text-rose-200"
                  title="Clear conversation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Clear Confirmation Prompt */}
        {showClearConfirm ? (
          <div className="bg-rose-950/70 border-b border-rose-500/30 px-5 py-2.5 text-xs text-rose-200 flex items-center justify-between">
            <span>Clear all chat history from this device?</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  clearChat()
                  setShowClearConfirm(false)
                }}
                className="font-bold underline hover:text-white"
              >
                Yes, Clear
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {/* Messages Stream */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {chat.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center text-slate-400">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-cyan-300 mb-3 border border-white/10">
                <Sparkles className="h-7 w-7" />
              </div>
              <h4 className="text-base font-semibold text-white">Ask Anything About Your Career</h4>
              <p className="mt-1 max-w-md text-xs leading-5 text-slate-300">
                Ask about Class 10/12 stream dilemmas, choosing between B.Tech vs BCA vs B.Des, entrance exams, or how to learn cutting-edge skills like AI.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => send('I want to work in Artificial Intelligence. What should I do right now?')}
                  className="chip hover:border-cyan-400/40 text-xs"
                >
                  “I want to work in AI. What should I do right now?”
                </button>
                <button
                  type="button"
                  onClick={() => send('What stream gives the most flexibility after Class 10?')}
                  className="chip hover:border-cyan-400/40 text-xs"
                >
                  “What stream gives the most flexibility after Class 10?”
                </button>
              </div>
            </div>
          ) : (
            chat.map((message, index) => {
              const isUser = message.role === 'user'
              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      isUser
                        ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white'
                        : 'bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950'
                    }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-slate-950 font-medium rounded-tr-sm'
                        : 'bg-slate-800/80 border border-white/10 text-slate-100 rounded-tl-sm'
                    }`}
                  >
                    {formatBubbleText(message.content)}
                    {message.time ? (
                      <div
                        className={`mt-1.5 text-[10px] text-right ${
                          isUser ? 'text-slate-900/70' : 'text-slate-400'
                        }`}
                      >
                        {message.time}
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })
          )}

          {/* Typing Indicator */}
          {loading ? (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-3xl rounded-tl-sm border border-cyan-400/30 bg-slate-800/80 px-4 py-3 text-xs text-cyan-200 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>Futurix AI is formulating your guidance...</span>
              </div>
            </div>
          ) : null}

          <div ref={endRef} />
        </div>

        {/* Error notification if backend fails */}
        {error ? (
          <div className="px-5 pb-3">
            <ErrorBanner
              message={error}
              onRetry={() => {
                const lastUser = [...chat].reverse().find((m) => m.role === 'user')
                if (lastUser) send(lastUser.content)
              }}
              onDismiss={() => setError('')}
            />
          </div>
        ) : null}

        {/* Input Bar */}
        <div className="border-t border-white/10 bg-slate-900/80 p-4">
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              send()
            }}
          >
            <input
              ref={inputRef}
              className="flex-1 py-3 text-sm"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about streams, colleges, career options, skills..."
              disabled={loading}
            />
            <button
              type="submit"
              className="btn-primary px-5 py-3 text-xs font-semibold"
              disabled={loading || !input.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">{t.chat.send}</span>
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Press Enter to send. Powered by Gemma 4.</span>
            <span>Language: {language}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
