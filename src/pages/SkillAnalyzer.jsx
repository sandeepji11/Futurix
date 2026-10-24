import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Sparkles,
  ScanSearch,
  CheckCircle2,
  Map,
  Award,
} from 'lucide-react'
import { askAI, aiEndpoints } from '../api'
import { AiResult } from '../components/AiResult'
import { ErrorBanner } from '../components/ErrorBanner'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { GlassCard } from '../components/GlassCard'
import { useLanguage } from '../context/LanguageContext'
import { useStudent } from '../context/StudentContext'

const presetSkills = [
  'Python',
  'JavaScript',
  'React',
  'SQL',
  'Machine Learning',
  'Data Analysis',
  'Figma & UI Design',
  'Git & GitHub',
  'Problem Solving',
  'Communication',
  'Biology Basics',
  'Math & Statistics',
]

const presetRoles = [
  'AI Engineer',
  'Software Developer',
  'Data Scientist',
  'UI/UX Designer',
  'Robotics Engineer',
  'Cybersecurity Analyst',
  'Doctor (Medical Specialist)',
  'Startup Founder',
]

export function SkillAnalyzer() {
  const { t, language } = useLanguage()
  const { skillReport, saveSkillReport, toggleSkillCheck } = useStudent()
  const [params] = useSearchParams()

  const initialCareer = params.get('career') || skillReport.career || 'AI Engineer'
  const [career, setCareer] = useState(initialCareer)
  const [level, setLevel] = useState('Beginner')
  const [existing, setExisting] = useState(skillReport.existing || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const checkedSkills = skillReport.checkedSkills || []

  // Quick skill chip toggle
  const toggleSkillTag = (skill) => {
    const list = existing
      ? existing.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    const updated = list.includes(skill)
      ? list.filter((s) => s !== skill)
      : [...list, skill]
    setExisting(updated.join(', '))
  }

  async function analyze(event) {
    if (event) event.preventDefault()
    if (!career.trim()) return

    setLoading(true)
    setError('')

    const prompt = [
      `Analyze the skill gap for becoming a: ${career}.`,
      `Student level: ${level}.`,
      `Skills the student already has: ${existing.trim() || 'Beginner with no technical skills yet'}.`,
      'Structure your response clearly with these 4 sections:',
      '1. Required Core Skills (Technical & Soft Skills)',
      '2. Skills the student already has that help',
      '3. Missing High-Priority Skills to develop next',
      '4. Recommended Free Resources and Practice Projects in India',
    ].join('\n')

    try {
      const result = await askAI(aiEndpoints.skills, prompt, language)
      saveSkillReport({
        career,
        level,
        existing,
        result,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Target Competency Evaluator"
        title={t.skillsPage.title}
        intro="Compare the skills you currently possess with the high-demand competencies required for your dream job. Discover exactly what to learn next."
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Form: 6 cols */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
                <ScanSearch className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">Skill Gap Assessment</h2>
                <p className="text-xs text-slate-300">
                  Select your target role and current toolkit.
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={analyze}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="field">
                  {t.skillsPage.career}
                  <input
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    placeholder="e.g. AI Engineer"
                    required
                  />
                </label>

                <label className="field">
                  Current Level
                  <select value={level} onChange={(e) => setLevel(e.target.value)}>
                    <option value="Beginner (Class 9-12)">Beginner (Class 9-12)</option>
                    <option value="Undergrad Student">Undergrad Student</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Career Switcher">Career Switcher</option>
                  </select>
                </label>
              </div>

              {/* Quick Pick Dream Job Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400">Popular Dream Jobs:</span>
                <div className="flex flex-wrap gap-1.5">
                  {presetRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setCareer(role)}
                      className={`text-[11px] rounded-lg px-2.5 py-1 border transition ${
                        career.toLowerCase() === role.toLowerCase()
                          ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50 font-semibold'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Existing Skills Input */}
              <div className="space-y-2">
                <label className="field">
                  {t.skillsPage.existing}
                  <textarea
                    rows="4"
                    value={existing}
                    onChange={(e) => setExisting(e.target.value)}
                    placeholder="List the skills, programming languages, or subjects you already know (e.g. Python basics, HTML, Math, Communication)..."
                  />
                </label>

                {/* Quick Add Skill Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 self-center mr-1">Quick Add:</span>
                  {presetSkills.map((skill) => {
                    const active = existing.toLowerCase().includes(skill.toLowerCase())
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkillTag(skill)}
                        className={`text-[11px] rounded-lg px-2.5 py-1 border transition ${
                          active
                            ? 'bg-violet-500/20 text-violet-200 border-violet-400/50'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}{skill}
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full justify-center py-3 text-sm font-semibold"
                disabled={loading || !career.trim()}
              >
                <Sparkles className="h-4 w-4" />
                <span>{loading ? 'Evaluating Skill Gap...' : t.skillsPage.analyze}</span>
              </button>
            </form>
          </GlassCard>

          {/* Quick Shortcuts to Roadmap */}
          <GlassCard className="p-5 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-white text-sm">Need a Step-by-Step Plan?</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Generate a learning roadmap for <strong className="text-cyan-300">{career}</strong>.
              </p>
            </div>
            <Link
              to={`/roadmap?career=${encodeURIComponent(career)}`}
              className="btn-ghost text-xs py-2 whitespace-nowrap"
            >
              <Map className="h-3.5 w-3.5" />
              <span>Open Roadmap</span>
            </Link>
          </GlassCard>
        </div>

        {/* Right Output: 6 cols */}
        <div className="lg:col-span-6 space-y-4">
          {loading ? (
            <LoadingState
              label="Comparing Target Skills"
              sublabel="Analyzing industry benchmarks, core competencies, and required prerequisites..."
            />
          ) : null}

          <ErrorBanner
            message={error}
            onRetry={analyze}
            onDismiss={() => setError('')}
          />

          {skillReport.result ? (
            <div className="space-y-4">
              <AiResult
                title={`Skill Gap Analysis: ${skillReport.career || career}`}
                text={skillReport.result}
              />

              <div className="glass-card p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                    <Award className="h-4 w-4 text-cyan-300" />
                    Interactive Skill Tracker
                  </h4>
                  <span className="chip text-[11px] text-cyan-300">
                    {checkedSkills.length} Mastered
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3">
                  Check off the skills as you learn them. Your progress updates your Student Dashboard in real-time.
                </p>
                <div className="flex flex-wrap gap-2">
                  {presetSkills.map((sk) => {
                    const checked = checkedSkills.includes(sk)
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => toggleSkillCheck(sk)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition ${
                          checked
                            ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/50 font-semibold'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <CheckCircle2 className={`h-3.5 w-3.5 ${checked ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span>{sk}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-400">
              <ScanSearch className="mx-auto h-12 w-12 text-slate-600 mb-3" />
              <h4 className="text-base font-semibold text-slate-200">No Skill Analysis Run Yet</h4>
              <p className="mt-2 text-xs leading-relaxed max-w-sm mx-auto">
                Enter your dream profession and existing skill set on the left, then click <strong>"{t.skillsPage.analyze}"</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
