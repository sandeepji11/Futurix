import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Sparkles,
  Map,
  CheckCircle2,
  Plus,
  Trash2,
  Copy,
  Check,
  Award,
  ScanSearch,
} from 'lucide-react'
import { askAI, aiEndpoints } from '../api'
import { AiResult } from '../components/AiResult'
import { ErrorBanner } from '../components/ErrorBanner'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { GlassCard } from '../components/GlassCard'
import { useLanguage } from '../context/LanguageContext'
import { milestonesFromText, useStudent } from '../context/StudentContext'

const popularCareers = [
  'AI Engineer',
  'Software Developer',
  'Data Scientist',
  'UI/UX Designer',
  'Robotics Engineer',
  'Doctor (Medical Specialist)',
  'Cybersecurity Analyst',
  'Startup Founder',
]

const studentLevels = [
  { id: 'school', label: 'High School (Class 9–12)' },
  { id: 'college', label: 'College Undergrad (1st–4th Year)' },
  { id: 'graduate', label: 'Graduate / Job Seeker' },
]

export function Roadmap() {
  const { t, language } = useLanguage()
  const {
    roadmap,
    saveRoadmap,
    toggleMilestone,
    addCustomMilestone,
    removeMilestone,
  } = useStudent()

  const [params] = useSearchParams()
  const initialCareer = params.get('career') || roadmap.career || ''
  const [career, setCareer] = useState(initialCareer)
  const [level, setLevel] = useState('High School (Class 9–12)')
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const milestones = roadmap.milestones || []
  const doneCount = useMemo(
    () => milestones.filter((item) => item.done).length,
    [milestones]
  )
  const total = milestones.length
  const progressPercent = total ? Math.round((doneCount / total) * 100) : 0

  async function generate(event) {
    if (event) event.preventDefault()
    if (!career.trim()) return

    setLoading(true)
    setError('')

    const prompt = [
      `Create a beginner-friendly learning roadmap for becoming a ${career}.`,
      `Student current level: ${level}.`,
      'Use a numbered list of 7 sequential milestones covering foundations, core skills, projects, degrees/certifications in India, and internships.',
      'For each milestone, give a realistic estimated duration (e.g. 3 weeks, 2 months) and practical free learning resources.',
    ].join('\n')

    try {
      const result = await askAI(aiEndpoints.roadmap, prompt, language)
      saveRoadmap({
        career,
        level,
        result,
        milestones: milestonesFromText(result),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMilestone = (e) => {
    e.preventDefault()
    if (!newMilestoneTitle.trim()) return
    addCustomMilestone(newMilestoneTitle.trim())
    setNewMilestoneTitle('')
  }

  const handleCopyRoadmap = async () => {
    if (!milestones.length) return
    const text = `Roadmap for ${roadmap.career} (${progressPercent}% Complete)\n\n` +
      milestones.map((m, i) => `${i + 1}. [${m.done ? 'X' : ' '}] ${m.title}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const handleToggleAll = (targetState) => {
    saveRoadmap({
      ...roadmap,
      milestones: milestones.map((m) => ({ ...m, done: targetState })),
    })
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Milestone Learning System"
        title={t.roadmap.title}
        intro={t.roadmap.intro}
      />

      {/* Generator Control Card */}
      <GlassCard className="p-6">
        <form className="space-y-4" onSubmit={generate}>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="field">
                Target Profession / Dream Job
                <input
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                  placeholder={t.roadmap.placeholder}
                  required
                />
              </label>
            </div>

            <div>
              <label className="field">
                Your Current Level
                <select value={level} onChange={(e) => setLevel(e.target.value)}>
                  {studentLevels.map((lvl) => (
                    <option key={lvl.id} value={lvl.label}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Quick-Pick Popular Career Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 self-center mr-1">Popular:</span>
            {popularCareers.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCareer(c)}
                className={`text-[11px] rounded-lg px-2.5 py-1 border transition ${
                  career.toLowerCase() === c.toLowerCase()
                    ? 'bg-violet-500/20 text-violet-200 border-violet-400/50 font-semibold'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto px-6"
              disabled={loading || !career.trim()}
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? 'Synthesizing...' : t.roadmap.generate}</span>
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Loading & Error States */}
      {loading ? (
        <LoadingState
          label="Generating Learning Milestones"
          sublabel="Organizing skills, educational certifications, practical projects, and internships into a logical sequence..."
        />
      ) : null}

      <ErrorBanner
        message={error}
        onRetry={generate}
        onDismiss={() => setError('')}
      />

      {/* Active Roadmap Display */}
      {milestones.length > 0 ? (
        <div className="space-y-6">
          {/* Progress Overview Header */}
          <GlassCard className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
              <div>
                <span className="chip text-[11px] text-cyan-300 bg-cyan-950/40 border-cyan-400/20">
                  {roadmap.level || 'Beginner'}
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  {roadmap.career} Roadmap
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Check off milestones as you master skills and finish projects. Saved automatically on this device.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyRoadmap}
                  className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-cyan-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Export'}</span>
                </button>

                <Link
                  to={`/skills?career=${encodeURIComponent(roadmap.career)}`}
                  className="flex items-center gap-1 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/20"
                >
                  <ScanSearch className="h-3.5 w-3.5" />
                  <span>Analyze Skills</span>
                </Link>
              </div>
            </div>

            {/* Progress Bar & Badges */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                <span className="font-semibold text-white">Overall Roadmap Completion</span>
                <span className="font-bold text-cyan-300">{doneCount} of {total} Milestones ({progressPercent}%)</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* 100% Completion Celebration Badge */}
            {progressPercent === 100 ? (
              <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-200 flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Outstanding Achievement!</strong> You have completed all milestones for becoming a <strong>{roadmap.career}</strong>!
                </span>
              </div>
            ) : null}

            {/* Quick Bulk Action Links */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-white/5 pt-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleAll(true)}
                  className="hover:text-cyan-300 underline"
                >
                  Mark all complete
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleToggleAll(false)}
                  className="hover:text-slate-200 underline"
                >
                  Uncheck all
                </button>
              </div>
              <span>Click checkbox to toggle progress</span>
            </div>
          </GlassCard>

          {/* Interactive Milestones Timeline List */}
          <div className="space-y-3">
            {milestones.map((item, index) => (
              <div
                key={item.id}
                className={`glass-card relative flex items-start gap-4 p-4 transition duration-200 ${
                  item.done
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'hover:border-cyan-300/30'
                }`}
              >
                {/* Step Number Circle */}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition ${
                    item.done
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-white/10 text-cyan-300 border border-white/10'
                  }`}
                >
                  {index + 1}
                </span>

                {/* Checkbox and Title */}
                <label className="flex flex-1 cursor-pointer items-start gap-3 select-none">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleMilestone(item.id)}
                    className="mt-1 h-4 w-4 rounded text-cyan-500 focus:ring-0"
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm leading-relaxed transition ${
                        item.done
                          ? 'line-through text-slate-500'
                          : 'text-slate-100 font-medium'
                      }`}
                    >
                      {item.title}
                    </p>
                    {item.done ? (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </span>
                    ) : null}
                  </div>
                </label>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeMilestone(item.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                  title="Remove this milestone"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Custom Milestone Form */}
          <GlassCard className="p-4">
            <form onSubmit={handleAddMilestone} className="flex gap-2">
              <input
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="Add your own custom milestone (e.g. Build personal portfolio, pass JEE Main)..."
                className="text-xs py-2.5"
              />
              <button
                type="submit"
                className="btn-ghost text-xs px-4 py-2.5 shrink-0"
                disabled={!newMilestoneTitle.trim()}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Milestone</span>
              </button>
            </form>
          </GlassCard>

          {/* AI Result Transcript Card */}
          {roadmap.result ? (
            <div className="pt-2">
              <AiResult
                title={`Detailed Breakdown: ${roadmap.career}`}
                text={roadmap.result}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <GlassCard className="p-12 text-center text-slate-400">
          <Map className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-semibold text-white">No Roadmap Generated Yet</h3>
          <p className="mt-2 text-xs max-w-sm mx-auto text-slate-300">
            {t.roadmap.empty} Enter a dream job title above or pick one of the popular options to generate an interactive timeline.
          </p>
        </GlassCard>
      )}
    </div>
  )
}
