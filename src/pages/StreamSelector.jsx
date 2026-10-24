import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Cpu,
  HeartPulse,
  LineChart,
  Palette,
  Wrench,
} from 'lucide-react'
import { askAI, aiEndpoints } from '../api'
import { AiResult } from '../components/AiResult'
import { ErrorBanner } from '../components/ErrorBanner'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { GlassCard } from '../components/GlassCard'
import { useLanguage } from '../context/LanguageContext'
import { useStudent } from '../context/StudentContext'

const presetSubjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Economics',
  'Business Studies',
  'Accountancy',
  'History',
  'Psychology',
  'English Literature',
  'Fine Arts',
]

const presetInterests = [
  'Coding & AI',
  'Medical & Life Sciences',
  'Building Hardware & Robots',
  'Finance & Stock Markets',
  'Graphic & UI/UX Design',
  'Writing & Journalism',
  'Entrepreneurship',
  'Psychology & Mind',
]

const streamMatrix = [
  {
    name: 'Science (PCM)',
    icon: Cpu,
    color: 'text-cyan-300',
    core: 'Physics, Chemistry, Mathematics',
    careers: 'Software, Aerospace, Robotics, Data Science, Architecture',
  },
  {
    name: 'Science (PCB)',
    icon: HeartPulse,
    color: 'text-emerald-300',
    core: 'Physics, Chemistry, Biology',
    careers: 'Medicine (MBBS), Biotechnology, Pharmacy, Nursing, Genetics',
  },
  {
    name: 'Commerce',
    icon: LineChart,
    color: 'text-violet-300',
    core: 'Accountancy, Business Studies, Economics (+/- Maths)',
    careers: 'CA, Investment Banking, FinTech, Corporate Law, Management',
  },
  {
    name: 'Arts / Humanities',
    icon: Palette,
    color: 'text-pink-300',
    core: 'History, Political Science, Psychology, Sociology',
    careers: 'Civil Services (UPSC), UI/UX Design, Journalism, Law, Public Policy',
  },
  {
    name: 'Vocational & Polytechnic',
    icon: Wrench,
    color: 'text-amber-300',
    core: 'Applied Engineering, Digital Media, Tourism, IT Skills',
    careers: 'Industrial Automation, Web Dev, Animation, Technical Specialist',
  },
]

export function StreamSelector() {
  const { t, language } = useLanguage()
  const { profile, saveProfile } = useStudent()

  const [form, setForm] = useState({
    studentClass: profile.studentClass || 'Class 10',
    subjects: profile.subjects || '',
    interests: profile.interests || '',
    strengths: profile.strengths || '',
    aspirations: profile.aspirations || '',
  })

  const [result, setResult] = useState(profile.lastStreamResult || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedStreamTag, setSelectedStreamTag] = useState(profile.targetStream || '')

  const update = (key) => (event) =>
    setForm({ ...form, [key]: event.target.value })

  // Quick tag toggles
  const toggleSubject = (sub) => {
    const list = form.subjects
      ? form.subjects.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    const updated = list.includes(sub)
      ? list.filter((s) => s !== sub)
      : [...list, sub]
    setForm({ ...form, subjects: updated.join(', ') })
  }

  const toggleInterest = (interest) => {
    const list = form.interests
      ? form.interests.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    const updated = list.includes(interest)
      ? list.filter((s) => s !== interest)
      : [...list, interest]
    setForm({ ...form, interests: updated.join(', ') })
  }

  async function onSubmit(event) {
    if (event) event.preventDefault()
    setLoading(true)
    setError('')

    const prompt = [
      'You are Futurix AI academic advisor. Recommend academic streams for this student in India after Class 10.',
      'Compare Science (PCM), Science (PCB), Commerce, Arts/Humanities and Vocational options.',
      'Rank the best 2-3 matching streams with match percentage, why it fits, subject combinations, and future careers.',
      `Class level: ${form.studentClass}`,
      `Favorite subjects: ${form.subjects}`,
      `Interests: ${form.interests}`,
      `Strengths: ${form.strengths}`,
      `Career aspirations: ${form.aspirations}`,
    ].join('\n')

    try {
      const text = await askAI(aiEndpoints.stream, prompt, language)
      setResult(text)
      saveProfile({
        ...form,
        lastStreamResult: text,
        recommendedCareers: form.aspirations
          ? form.aspirations.split(',').map((item) => item.trim()).filter(Boolean)
          : profile.recommendedCareers,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSetTargetStream = (streamName) => {
    setSelectedStreamTag(streamName)
    saveProfile({ targetStream: streamName })
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Class 8–12 Academic Guidance"
        title={t.stream.title}
        intro={t.stream.intro}
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">Student Assessment Form</h2>
                <p className="text-xs text-slate-300">
                  Select your current subjects and passions. Gemma 4 will evaluate compatibility.
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="field">
                  {t.stream.class}
                  <select
                    value={form.studentClass}
                    onChange={update('studentClass')}
                    required
                  >
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10 (Stream Selection Year)</option>
                    <option value="Class 11">Class 11 (Stream Adjustment)</option>
                    <option value="Class 12">Class 12 (College Stream)</option>
                  </select>
                </label>

                <label className="field">
                  Strengths & Aptitude
                  <input
                    value={form.strengths}
                    onChange={update('strengths')}
                    placeholder="e.g. Logical reasoning, fast calculations, creativity"
                    required
                  />
                </label>
              </div>

              {/* Subjects with quick chips */}
              <div className="space-y-2">
                <label className="field">
                  {t.stream.subjects}
                  <input
                    value={form.subjects}
                    onChange={update('subjects')}
                    placeholder="e.g. Mathematics, Physics, Computer Science"
                    required
                  />
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 self-center mr-1">Quick Add:</span>
                  {presetSubjects.map((sub) => {
                    const active = form.subjects.toLowerCase().includes(sub.toLowerCase())
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSubject(sub)}
                        className={`text-[11px] rounded-lg px-2.5 py-1 border transition ${
                          active
                            ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}{sub}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Interests with quick chips */}
              <div className="space-y-2">
                <label className="field">
                  {t.stream.interests}
                  <input
                    value={form.interests}
                    onChange={update('interests')}
                    placeholder="e.g. Artificial Intelligence, Robotics, Psychology"
                    required
                  />
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 self-center mr-1">Quick Add:</span>
                  {presetInterests.map((interest) => {
                    const active = form.interests.toLowerCase().includes(interest.toLowerCase())
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`text-[11px] rounded-lg px-2.5 py-1 border transition ${
                          active
                            ? 'bg-violet-500/20 text-violet-200 border-violet-400/40'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}{interest}
                      </button>
                    )
                  })}
                </div>
              </div>

              <label className="field">
                {t.stream.aspirations}
                <input
                  value={form.aspirations}
                  onChange={update('aspirations')}
                  placeholder="e.g. AI Engineer, Doctor, Financial Analyst, UI Designer"
                  required
                />
              </label>

              <button
                type="submit"
                className="btn-primary w-full justify-center py-3 text-sm font-semibold"
                disabled={loading}
              >
                <Sparkles className="h-4 w-4" />
                <span>{loading ? 'Consulting Gemma 4 AI...' : t.stream.submit}</span>
              </button>
            </form>
          </GlassCard>

          {/* Educational Stream Matrix Guide */}
          <GlassCard className="p-6">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-cyan-300" />
              Quick Stream Comparison Guide (India)
            </h3>
            <div className="space-y-3">
              {streamMatrix.map((item) => {
                const Icon = item.icon
                const isSelected = selectedStreamTag === item.name
                return (
                  <div
                    key={item.name}
                    className={`rounded-2xl border p-4 transition ${
                      isSelected
                        ? 'border-cyan-400/50 bg-cyan-950/30'
                        : 'border-white/5 bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-5 w-5 ${item.color}`} />
                        <span className="font-semibold text-white text-sm">{item.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSetTargetStream(item.name)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40 font-semibold'
                            : 'border-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ My Target Stream' : 'Set as Goal'}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">
                      <strong className="text-slate-200">Core Subjects:</strong> {item.core}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      <strong className="text-slate-300">Major Careers:</strong> {item.careers}
                    </p>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right Output: 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          {loading ? (
            <LoadingState
              label="Synthesizing Stream Recommendation"
              sublabel="Analyzing subject combinations, career demand, and aptitude alignment..."
            />
          ) : null}

          <ErrorBanner
            message={error}
            onRetry={onSubmit}
            onDismiss={() => setError('')}
          />

          {result ? (
            <div className="space-y-4">
              <AiResult title={t.stream.resultTitle} text={result} />

              <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-300">
                  <p className="font-semibold text-white">Happy with this guidance?</p>
                  <p>Explore verified career roles aligned with these streams.</p>
                </div>
                <Link to="/careers" className="btn-primary text-xs py-2 whitespace-nowrap">
                  Explore Careers
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 text-center text-slate-400">
              <Sparkles className="mx-auto h-12 w-12 text-slate-600 mb-3" />
              <h4 className="text-base font-semibold text-slate-200">No Stream Recommendation Yet</h4>
              <p className="mt-2 text-xs leading-relaxed max-w-sm mx-auto">
                Fill in your subjects and interests on the left, then click <strong>"{t.stream.submit}"</strong> to consult the Gemma 4 AI backend.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="chip text-[11px]">Science (PCM/PCB)</span>
                <span className="chip text-[11px]">Commerce</span>
                <span className="chip text-[11px]">Humanities</span>
                <span className="chip text-[11px]">Vocational</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
