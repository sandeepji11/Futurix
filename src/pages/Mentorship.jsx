import { useState, useEffect, useRef } from 'react'
import {
  Sparkles,
  Bot,
  User,
  X,
  Send,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  Copy,
  Check,
  Trash2,
  MessageSquare,
  GraduationCap,
  Lightbulb,
} from 'lucide-react'
import { mentors, sessions } from '../data/mentors'
import { GlassCard } from '../components/GlassCard'
import { PageHeader } from '../components/PageHeader'
import { ErrorBanner } from '../components/ErrorBanner'
import { useLanguage } from '../context/LanguageContext'
import { askAI, aiEndpoints } from '../api'

function getStorageKey(mentorId) {
  return `futurix-mentorship-chat-${mentorId}`
}

function loadChatHistory(mentor) {
  try {
    const raw = localStorage.getItem(getStorageKey(mentor.id))
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // fallback to default greeting
  }
  return [
    {
      id: `welcome-${mentor.id}`,
      role: 'assistant',
      content: `Hello! I am **${mentor.name}**, your AI Career Mentor specializing in **${mentor.specialization}**.\n\nI can help you evaluate school streams, explore research vs industry pathways, prepare for internships, or structure your learning goals. How can I assist you today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]
}

export function Mentorship() {
  const { t, language } = useLanguage()

  // Selected mentor for the details modal
  const [selectedMentor, setSelectedMentor] = useState(null)
  // Active mentor for the interactive chat interface
  const [activeChatMentor, setActiveChatMentor] = useState(null)

  // Chat state
  const [chatMessages, setChatMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastPrompt, setLastPrompt] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  const messagesEndRef = useRef(null)
  const chatInputRef = useRef(null)

  // Scroll to bottom when messages update or loading changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, loading])

  // Focus input when entering chat mode
  useEffect(() => {
    if (activeChatMentor) {
      chatInputRef.current?.focus()
    }
  }, [activeChatMentor])

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedMentor) {
        setSelectedMentor(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedMentor])

  // Open modal
  const handleOpenProfile = (mentor) => {
    setSelectedMentor(mentor)
  }

  // Start mentorship: switch to chat interface
  const handleStartMentorship = (mentor) => {
    setSelectedMentor(null)
    setActiveChatMentor(mentor)
    setChatMessages(loadChatHistory(mentor))
    setError('')
    setInput('')
  }

  // Back to mentor list
  const handleBackToList = () => {
    setActiveChatMentor(null)
    setError('')
    setInput('')
  }

  // Clear chat history for active mentor
  const handleClearChat = () => {
    if (!activeChatMentor) return
    const defaultGreeting = [
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Conversation reset. Hello! I am **${activeChatMentor.name}**, your AI mentor for **${activeChatMentor.specialization}**. What would you like to discuss?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]
    setChatMessages(defaultGreeting)
    try {
      localStorage.setItem(getStorageKey(activeChatMentor.id), JSON.stringify(defaultGreeting))
    } catch {
      // ignore
    }
  }

  // Send message to AI
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend ?? input).trim()
    if (!text || loading || !activeChatMentor) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      time: now,
    }

    const nextHistory = [...chatMessages, userMessage]
    setChatMessages(nextHistory)
    setInput('')
    setLoading(true)
    setError('')
    setLastPrompt(text)

    try {
      localStorage.setItem(getStorageKey(activeChatMentor.id), JSON.stringify(nextHistory))
    } catch {
      // ignore
    }

    // Include mentor persona and specialization in the prompt sent to backend
    const prompt = `[Mentor Persona: ${activeChatMentor.name} | Specialization: ${activeChatMentor.specialization} | Background: ${activeChatMentor.background} | Focus: ${activeChatMentor.focus}]

Student Question:
${text}

Instructions:
Reply in the persona of ${activeChatMentor.name}. Leverage your specialized domain knowledge in ${activeChatMentor.specialization} to provide empathetic, structured, and realistic advice for high school and undergraduate students. Outline clear next steps.`

    try {
      const response = await askAI(aiEndpoints.chat, prompt, language)
      const assistantMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      const finalHistory = [...nextHistory, assistantMessage]
      setChatMessages(finalHistory)
      try {
        localStorage.setItem(getStorageKey(activeChatMentor.id), JSON.stringify(finalHistory))
      } catch {
        // ignore
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to the FUTURIX AI backend. Please verify that the backend is running at http://localhost:8000.')
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    if (lastPrompt) {
      handleSendMessage(lastPrompt)
    }
  }

  const handleCopyMessage = async (msgId, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(msgId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // fallback
    }
  }

  // Format bold and lists nicely inside chat bubbles
  const renderFormattedText = (text) => {
    if (!text) return null
    const lines = text.split('\n')
    return (
      <div className="space-y-1.5 leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim()
          if (!trimmed) return <div key={idx} className="h-1.5" />

          // Bullet point
          if (/^[-*•]\s+/.test(trimmed)) {
            const content = trimmed.replace(/^[-*•]\s+/, '')
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                <span>{renderInlineBold(content)}</span>
              </div>
            )
          }

          // Numbered item
          const numMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/)
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="font-semibold text-cyan-300 shrink-0">{numMatch[1]}.</span>
                <span>{renderInlineBold(numMatch[2])}</span>
              </div>
            )
          }

          return <p key={idx}>{renderInlineBold(trimmed)}</p>
        })}
      </div>
    )
  }

  const renderInlineBold = (str) => {
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

  // If activeChatMentor is selected, display the Interactive Mentorship Chat Interface
  if (activeChatMentor) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col space-y-6">
        {/* Navigation bar returning to mentor list */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={handleBackToList}
            className="btn-ghost text-sm py-2 px-3.5 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Mentors</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenProfile(activeChatMentor)}
              className="text-xs px-3 py-1.5 rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition flex items-center gap-1.5"
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>View Profile</span>
            </button>
            <button
              type="button"
              onClick={handleClearChat}
              className="text-xs px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-rose-300 hover:border-rose-400/30 transition flex items-center gap-1.5"
              title="Reset conversation"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>
        </div>

        {/* Mentor Chat Header Card */}
        <GlassCard className="p-5 border-cyan-400/30 bg-gradient-to-r from-slate-900/90 via-violet-950/30 to-slate-900/90 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 text-slate-950 font-bold text-lg shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                {activeChatMentor.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-white">{activeChatMentor.name}</h1>
                  <span className="chip text-[11px] border-cyan-400/40 bg-cyan-500/15 text-cyan-200">
                    AI Mentor · Demo Persona
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-cyan-300 font-medium">
                  {activeChatMentor.specialization}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {activeChatMentor.role}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-slate-300 max-w-xs">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-0.5">
                <Sparkles className="h-3 w-3" />
                <span>Simulated Mentorship</span>
              </div>
              Powered by Gemma 4 AI for interactive career exploration.
            </div>
          </div>
        </GlassCard>

        {/* Suggested Quick Questions */}
        {activeChatMentor.suggestedQuestions && activeChatMentor.suggestedQuestions.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-md">
            <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
              <Lightbulb className="h-3.5 w-3.5" />
              <span>Suggested Questions for {activeChatMentor.name}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeChatMentor.suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(question)}
                  disabled={loading}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-left text-xs text-slate-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white disabled:opacity-50"
                >
                  "{question}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages Log */}
        <div className="space-y-4 min-h-[350px]">
          {chatMessages.map((msg) => {
            const isUser = msg.role === 'user'

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-400 text-slate-950 font-bold text-xs shadow-md mt-1">
                    <Bot className="h-4 w-4 text-slate-950" />
                  </div>
                )}

                <div
                  className={`relative max-w-2xl rounded-2xl p-4 shadow-lg transition ${
                    isUser
                      ? 'rounded-tr-sm border border-cyan-400/30 bg-gradient-to-r from-violet-600/90 to-cyan-600/90 text-white shadow-[0_4px_20px_rgba(124,58,237,0.25)]'
                      : 'rounded-tl-sm border border-white/10 bg-slate-900/80 text-slate-200 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  {/* Top metadata inside bubble */}
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                    <span className={`font-semibold ${isUser ? 'text-cyan-100' : 'text-cyan-300'}`}>
                      {isUser ? 'You (Student)' : activeChatMentor.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {msg.time && (
                        <span className={`text-[10px] ${isUser ? 'text-cyan-200/70' : 'text-slate-400'}`}>
                          {msg.time}
                        </span>
                      )}
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="text-slate-400 hover:text-cyan-300 transition"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3.5 w-3.5 text-cyan-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bubble Content */}
                  <div className="text-sm">
                    {renderFormattedText(msg.content)}
                  </div>
                </div>

                {isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 mt-1">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            )
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-400 text-slate-950 font-bold text-xs shadow-md mt-1">
                <Bot className="h-4 w-4 text-slate-950" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-cyan-400/30 bg-slate-900/90 p-4 text-slate-200 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                <div className="flex items-center gap-2.5">
                  <div className="flex space-x-1">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" />
                  </div>
                  <span className="text-xs text-cyan-300 font-medium">
                    {activeChatMentor.name} is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Banner */}
        {error && (
          <ErrorBanner
            message={error}
            onRetry={handleRetry}
            onDismiss={() => setError('')}
          />
        )}

        {/* Message Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="relative sticky bottom-4 rounded-2xl border border-white/15 bg-slate-950/90 p-2 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-2">
            <input
              ref={chatInputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${activeChatMentor.name} about ${activeChatMentor.specialization}...`}
              disabled={loading}
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none focus:ring-0 border-0"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="btn-primary py-2.5 px-4 text-sm shrink-0 flex items-center gap-1.5"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </div>
        </form>

        {/* Modal if user clicks View Profile from inside chat */}
        {selectedMentor && renderProfileModal(selectedMentor)}
      </div>
    )
  }

  // Profile Modal Renderer
  function renderProfileModal(mentor) {
    if (!mentor) return null

    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mentor-profile-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedMentor(null)
        }}
      >
        <div className="relative w-full max-w-2xl rounded-3xl border border-cyan-400/30 bg-slate-900/95 p-6 sm:p-8 shadow-[0_0_50px_rgba(34,211,238,0.2)] my-8 backdrop-blur-xl text-left">
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setSelectedMentor(null)}
            className="absolute right-5 top-5 rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close mentor profile modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Persona Disclaimer & Badge */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="chip border-cyan-400/40 bg-cyan-500/15 text-cyan-200 font-semibold">
              AI Mentor · Demo Persona
            </span>
            <span className="text-xs text-slate-400">
              Interactive career guidance simulation
            </span>
          </div>

          {/* Mentor Profile Header */}
          <div className="flex items-start gap-4 pb-5 border-b border-white/10">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-400 text-slate-950 font-bold text-2xl shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              {mentor.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <h2 id="mentor-profile-title" className="text-2xl font-bold text-white">
                {mentor.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-cyan-200">
                {mentor.role}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/20 bg-cyan-950/40 px-2.5 py-1 text-xs text-cyan-300">
                <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
                <span>Specialization: {mentor.specialization}</span>
              </div>
            </div>
          </div>

          {/* Modal Content Sections */}
          <div className="mt-6 space-y-5 text-sm">
            {/* Professional Background */}
            <div>
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">
                <Briefcase className="h-3.5 w-3.5" />
                <span>Professional Background</span>
              </h3>
              <p className="leading-relaxed text-slate-300">
                {mentor.background}
              </p>
            </div>

            {/* Areas of Expertise */}
            <div>
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Areas of Expertise</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((item, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Mentorship Topics */}
            <div>
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Mentorship Discussion Topics</span>
              </h3>
              <ul className="space-y-1.5 pl-1">
                {mentor.mentorshipTopics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-xs sm:text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guiding Quote */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 italic text-slate-300 text-sm">
              “{mentor.quote}”
            </div>

            {/* AI Persona Notice */}
            <div className="rounded-xl border border-cyan-400/20 bg-cyan-950/20 p-3 text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-cyan-200">Note: </span>
              {mentor.name} is a fictional demo persona modeled for simulated career counselling powered by the Futurix backend. Conversations are simulated using the Gemma 4 AI model and do not represent a real-time human booking.
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setSelectedMentor(null)}
              className="btn-ghost py-2.5 px-4 text-sm"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => handleStartMentorship(mentor)}
              className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Start Mentorship</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Mentor List View (Main Page)
  return (
    <div>
      <PageHeader
        eyebrow={t.mentorship.badge}
        title={t.mentorship.title}
        intro="Connect with simulated AI mentors across medical sciences, software engineering, product design, and entrepreneurship. Click any mentor profile to review their background and initiate 1-on-1 career mentorship."
      />

      {/* Demo Group Sessions */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{t.mentorship.sessions}</h2>
          <p className="text-xs text-slate-400 mt-0.5">Explore scheduled interactive group cohort sessions</p>
        </div>
      </div>
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {sessions.map((session) => {
          const linkedMentor = mentors.find(
            (m) => m.id === session.mentorId || m.name === session.host
          )

          return (
            <GlassCard
              key={session.id}
              className="p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="chip text-[11px]">{t.mentorship.badge}</span>
                  {session.topic && (
                    <span className="text-[10px] text-cyan-300 font-medium">
                      {session.topic.split(' ')[0]}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-white">{session.title}</h3>
                
                {/* Clickable Host Link */}
                <button
                  type="button"
                  onClick={() => linkedMentor && handleOpenProfile(linkedMentor)}
                  className="mt-2 text-left text-sm text-cyan-300 hover:text-cyan-200 hover:underline flex items-center gap-1.5"
                  title="View host mentor profile"
                >
                  <Users className="h-3.5 w-3.5 shrink-0" />
                  <span>Host: {session.host}</span>
                </button>

                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{session.when}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{session.seats}</span>
                  </div>
                </div>
              </div>

              {linkedMentor && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => handleStartMentorship(linkedMentor)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20 transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Ask {session.host.split(' ')[0]} via AI</span>
                  </button>
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>

      {/* Mentor Cards Section */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{t.mentorship.mentors}</h2>
          <p className="text-xs text-slate-400 mt-0.5">Click any mentor card or name to inspect their background and start simulated mentorship</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {mentors.map((mentor) => (
          <GlassCard
            key={mentor.id}
            role="button"
            tabIndex={0}
            onClick={() => handleOpenProfile(mentor)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleOpenProfile(mentor)
              }
            }}
            className="group cursor-pointer p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)] focus:outline-none focus:ring-2 focus:ring-cyan-400/50 flex flex-col justify-between"
          >
            <div>
              {/* Header Badges */}
              <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
                <span className="chip text-[11px] border-cyan-400/40 bg-cyan-500/10 text-cyan-200">
                  AI Mentor · Demo Persona
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:text-cyan-300 transition">
                  <span>Click to view profile</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>

              {/* Mentor Identity */}
              <div className="flex items-start gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 text-slate-950 font-bold text-lg shadow-[0_0_15px_rgba(34,211,238,0.25)]">
                  {mentor.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenProfile(mentor)
                    }}
                    className="text-xl font-bold text-white transition group-hover:text-cyan-300 hover:underline"
                  >
                    {mentor.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-cyan-200">{mentor.role}</p>
                </div>
              </div>

              {/* Specialization & Focus */}
              <div className="mt-4 rounded-xl border border-white/5 bg-white/5 p-3">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-cyan-300 mb-1">
                  Specialization
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  {mentor.specialization}
                </p>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  {mentor.focus}
                </p>
              </div>

              {/* Areas of Expertise Tags */}
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {mentor.expertise.slice(0, 3).map((item, i) => (
                  <span
                    key={i}
                    className="text-[11px] rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-slate-300"
                  >
                    {item}
                  </span>
                ))}
                {mentor.expertise.length > 3 && (
                  <span className="text-[11px] rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-cyan-300">
                    +{mentor.expertise.length - 3} more
                  </span>
                )}
              </div>

              {/* Philosophy Quote */}
              <p className="mt-4 text-xs italic text-slate-400 border-l-2 border-cyan-400/40 pl-3">
                “{mentor.quote}”
              </p>
            </div>

            {/* Actions Bar */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenProfile(mentor)
                }}
                className="btn-ghost py-2 px-3 text-xs"
              >
                View Profile
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleStartMentorship(mentor)
                }}
                className="btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Start Mentorship</span>
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Render Profile Modal if selected */}
      {selectedMentor && renderProfileModal(selectedMentor)}
    </div>
  )
}
