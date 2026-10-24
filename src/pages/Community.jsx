import { useState, useEffect, useRef } from 'react'
import {
  MessageSquare,
  MessageCircle,
  PlusCircle,
  ArrowLeft,
  Send,
  User,
  Calendar,
  Tag,
  X,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { posts as defaultPosts } from '../data/community'
import { GlassCard } from '../components/GlassCard'
import { PageHeader } from '../components/PageHeader'
import { useLanguage } from '../context/LanguageContext'
import { useStudent } from '../context/StudentContext'

const STORAGE_KEY = 'futurix-community-discussions'

function loadInitialDiscussions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // fallback
  }

  // Fallback to default community posts with formatted reply arrays
  return defaultPosts.map((post) => ({
    ...post,
    createdAt: post.createdAt || 'Recent',
    repliesList: post.repliesList || [],
    replies: post.repliesList ? post.repliesList.length : post.replies || 0,
  }))
}

export function Community() {
  const { t } = useLanguage()
  const { profile } = useStudent()

  // Persistent discussions list
  const [discussions, setDiscussions] = useState(loadInitialDiscussions)

  // Currently opened discussion for the complete detail view
  const [selectedDiscussionId, setSelectedDiscussionId] = useState(null)

  // Category filter
  const [activeTag, setActiveTag] = useState('All')

  // Create discussion modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [newTag, setNewTag] = useState('Streams')
  const [newAuthor, setNewAuthor] = useState('')
  const [createError, setCreateError] = useState('')

  // Reply form state (inside detailed view)
  const [replyText, setReplyText] = useState('')
  const [replyAuthor, setReplyAuthor] = useState('')
  const [replyError, setReplyError] = useState('')
  const [replySuccess, setReplySuccess] = useState(false)

  const replyInputRef = useRef(null)

  // Save discussions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(discussions))
    } catch {
      // ignore
    }
  }, [discussions])

  // Handle escape key to close create modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showCreateModal) {
        setShowCreateModal(false)
        setCreateError('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showCreateModal])

  // Extract unique tags for filtering
  const allTags = ['All', ...new Set(discussions.map((d) => d.tag).filter(Boolean))]

  // Find currently active discussion
  const currentDiscussion = discussions.find((d) => d.id === selectedDiscussionId)

  // Open a discussion
  const handleOpenDiscussion = (id) => {
    setSelectedDiscussionId(id)
    setReplyText('')
    setReplyError('')
    setReplySuccess(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Return to list
  const handleBackToList = () => {
    setSelectedDiscussionId(null)
    setReplyText('')
    setReplyError('')
    setReplySuccess(false)
  }

  // Handle creating a new discussion
  const handleCreateDiscussion = (e) => {
    e.preventDefault()
    setCreateError('')

    const trimmedTitle = newTitle.trim()
    const trimmedMessage = newMessage.trim()

    if (!trimmedTitle) {
      setCreateError('Please enter a discussion title.')
      return
    }

    if (!trimmedMessage) {
      setCreateError('Please enter your message or question.')
      return
    }

    const authorDisplayName =
      newAuthor.trim() || profile?.name?.trim() || 'Student Explorer'

    const newPost = {
      id: `p-${Date.now()}`,
      author: authorDisplayName,
      title: trimmedTitle,
      body: trimmedMessage,
      tag: newTag.trim() || 'General',
      createdAt: 'Just now',
      replies: 0,
      repliesList: [],
    }

    const updated = [newPost, ...discussions]
    setDiscussions(updated)
    setShowCreateModal(false)
    setNewTitle('')
    setNewMessage('')
    setNewAuthor('')
    setCreateError('')

    // Open newly created discussion directly
    setSelectedDiscussionId(newPost.id)
  }

  // Handle posting a reply to the current discussion
  const handlePostReply = (e) => {
    e.preventDefault()
    setReplyError('')
    setReplySuccess(false)

    const trimmedReply = replyText.trim()
    if (!trimmedReply) {
      setReplyError('Reply cannot be empty. Please type your response.')
      return
    }

    const authorDisplayName =
      replyAuthor.trim() || profile?.name?.trim() || 'Student Explorer'

    const newReply = {
      id: `r-${Date.now()}`,
      author: authorDisplayName,
      text: trimmedReply,
      createdAt: 'Just now',
    }

    const updated = discussions.map((d) => {
      if (d.id === currentDiscussion.id) {
        const nextReplies = [...(d.repliesList || []), newReply]
        return {
          ...d,
          repliesList: nextReplies,
          replies: nextReplies.length,
        }
      }
      return d
    })

    setDiscussions(updated)
    setReplyText('')
    setReplyAuthor('')
    setReplySuccess(true)
    setTimeout(() => setReplySuccess(false), 3000)
  }

  // Filtered discussions by active tag
  const filteredDiscussions =
    activeTag === 'All'
      ? discussions
      : discussions.filter((d) => d.tag.toLowerCase() === activeTag.toLowerCase())

  // ==========================================
  // DETAIL VIEW: Complete Discussion + Replies
  // ==========================================
  if (currentDiscussion) {
    const replies = currentDiscussion.repliesList || []

    return (
      <div className="mx-auto flex max-w-4xl flex-col space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={handleBackToList}
            className="btn-ghost text-sm py-2 px-3.5 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Discussions</span>
          </button>

          <span className="chip border-cyan-400/40 bg-cyan-500/15 text-cyan-200 text-xs">
            {currentDiscussion.tag}
          </span>
        </div>

        {/* Local prototype disclaimer */}
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-950/20 px-4 py-2.5 text-xs text-slate-300 flex items-center gap-2">
          <Info className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-cyan-200">Local Prototype Notice: </strong>
            Discussions and replies are saved locally in your browser. They do not synchronize across different users.
          </span>
        </div>

        {/* Complete Discussion Card */}
        <GlassCard className="p-6 sm:p-8 border-cyan-400/30 shadow-[0_0_35px_rgba(34,211,238,0.12)]">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-cyan-300">
              <User className="h-3.5 w-3.5" />
              <span>{currentDiscussion.author}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{currentDiscussion.createdAt || 'Recent'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
              <span>{replies.length} replies</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
            {currentDiscussion.title}
          </h1>

          <div className="mt-4 border-t border-white/10 pt-4 text-sm sm:text-base leading-relaxed text-slate-200 whitespace-pre-line">
            {currentDiscussion.body}
          </div>
        </GlassCard>

        {/* Existing Replies List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-cyan-400" />
              <span>Replies ({replies.length})</span>
            </h2>
            <span className="text-xs text-slate-400">Join the discussion below</span>
          </div>

          {replies.length === 0 ? (
            /* Empty State */
            <GlassCard className="p-8 text-center border-dashed border-white/15">
              <MessageSquare className="mx-auto h-8 w-8 text-slate-500 mb-2" />
              <p className="text-sm font-medium text-slate-300">No replies yet</p>
              <p className="mt-1 text-xs text-slate-400">
                Be the first peer or mentor to share advice and thoughts on this topic!
              </p>
            </GlassCard>
          ) : (
            /* Replies Rendered */
            <div className="space-y-3">
              {replies.map((reply, index) => (
                <GlassCard
                  key={reply.id || index}
                  className="p-5 border-white/10 bg-slate-900/70 backdrop-blur-md transition hover:border-cyan-400/30"
                >
                  <div className="flex items-center justify-between gap-3 text-xs mb-2">
                    <div className="flex items-center gap-2 font-semibold text-cyan-200">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-[10px]">
                        {reply.author?.charAt(0) || 'U'}
                      </div>
                      <span>{reply.author}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {reply.createdAt || 'Recent'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-200 pl-8 whitespace-pre-line">
                    {reply.text}
                  </p>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* Add Reply Form */}
        <GlassCard className="p-6 border-cyan-400/25 bg-slate-900/90 shadow-[0_0_25px_rgba(34,211,238,0.1)]">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Send className="h-4 w-4 text-cyan-400" />
            <span>Leave a Reply</span>
          </h3>

          <form onSubmit={handlePostReply} className="space-y-4">
            {replyError && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-200">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{replyError}</span>
              </div>
            )}

            {replySuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Your reply has been added and saved locally!</span>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="field">
                Your Display Name
                <input
                  type="text"
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value)}
                  placeholder={profile?.name || 'e.g. Sana, Class 11'}
                  className="text-sm"
                />
              </label>
            </div>

            <label className="field">
              Your Reply
              <textarea
                ref={replyInputRef}
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Share your advice, relevant experience, or friendly perspective..."
                className="text-sm resize-none"
              />
            </label>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-slate-400">
                Replies are saved immediately to local storage.
              </p>
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>Post Reply</span>
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    )
  }

  // ==========================================
  // LIST VIEW: All Community Discussions Feed
  // ==========================================
  return (
    <div>
      <PageHeader
        eyebrow={t.community.badge}
        title={t.community.title}
        intro="Engage with peer students and explore shared challenges across stream selection, internship applications, entrance prep, and career crossroads. Click any discussion to read the thread or post replies."
      />

      {/* Top Action Bar & Local Prototype Badge */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Prototype disclaimer pill */}
        <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-950/30 px-3.5 py-2 text-xs text-slate-300">
          <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-cyan-200">Local Prototype: </strong>
            Discussions & replies persist on this device via browser storage.
          </span>
        </div>

        {/* Create Discussion Button */}
        <button
          type="button"
          onClick={() => {
            setShowCreateModal(true)
            setCreateError('')
          }}
          className="btn-primary py-2.5 px-4 text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Start Discussion</span>
        </button>
      </div>

      {/* Filter Tags */}
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-cyan-400" />
          <span>Topic:</span>
        </span>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={`text-xs px-3 py-1.5 rounded-full transition font-medium ${
              activeTag === tag
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                : 'text-slate-400 hover:text-white border border-white/10 bg-white/5'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Discussions Grid/List */}
      <div className="grid gap-4">
        {filteredDiscussions.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <p className="text-slate-300 font-medium">No discussions found in this topic</p>
            <p className="text-xs text-slate-400 mt-1">
              Be the first to create a discussion under "{activeTag}"!
            </p>
          </GlassCard>
        ) : (
          filteredDiscussions.map((post) => {
            const repliesCount = post.repliesList ? post.repliesList.length : post.replies || 0

            return (
              <GlassCard
                key={post.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenDiscussion(post.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleOpenDiscussion(post.id)
                  }
                }}
                className="group cursor-pointer p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)] focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip text-[11px]">{t.community.badge}</span>
                    <span className="chip text-[11px] border-cyan-400/40 bg-cyan-500/10 text-cyan-200">
                      {post.tag}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 group-hover:text-cyan-300 transition flex items-center gap-1">
                    <span>View discussion & replies</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white transition group-hover:text-cyan-300">
                  {post.title}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-medium text-cyan-200">{post.author}</span>
                  {post.createdAt && (
                    <>
                      <span>•</span>
                      <span>{post.createdAt}</span>
                    </>
                  )}
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-300 line-clamp-2">
                  {post.body}
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-cyan-300">
                    <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
                    <span>
                      {repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}
                    </span>
                  </span>

                  <span className="text-xs text-slate-400 group-hover:text-slate-200 transition">
                    Click to read full thread
                  </span>
                </div>
              </GlassCard>
            )
          })
        )}
      </div>

      {/* ========================================== */}
      {/* CREATE DISCUSSION MODAL                    */}
      {/* ========================================== */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-discussion-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false)
              setCreateError('')
            }
          }}
        >
          <div className="relative w-full max-w-xl rounded-3xl border border-cyan-400/30 bg-slate-900/95 p-6 sm:p-8 shadow-[0_0_50px_rgba(34,211,238,0.2)] my-8 backdrop-blur-xl text-left">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false)
                setCreateError('')
              }}
              className="absolute right-5 top-5 rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-400 text-slate-950">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 id="create-discussion-title" className="text-xl font-bold text-white">
                Start a New Discussion
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Ask a question or share advice. Your discussion will be saved immediately to this device's community feed.
            </p>

            {createError && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-200">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateDiscussion} className="space-y-4">
              <label className="field">
                Discussion Title *
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How to prepare for CUET while managing Class 12 board exams?"
                  className="text-sm"
                  autoFocus
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="field">
                  Category / Topic Tag
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="text-sm"
                  >
                    <option value="Streams">Streams</option>
                    <option value="Careers">Careers</option>
                    <option value="Internships">Internships</option>
                    <option value="Balance">Balance & Habits</option>
                    <option value="Exams">Exams & Entrance</option>
                    <option value="General">General</option>
                  </select>
                </label>

                <label className="field">
                  Your Display Name
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder={profile?.name || 'e.g. Rohan, Class 11'}
                    className="text-sm"
                  />
                </label>
              </div>

              <label className="field">
                Discussion Message / Details *
                <textarea
                  rows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Describe your question, dilemma, or thoughts in detail..."
                  className="text-sm resize-none"
                />
              </label>

              <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setCreateError('')
                  }}
                  className="btn-ghost py-2.5 px-4 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Publish Discussion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
