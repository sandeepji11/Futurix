import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  MessagesSquare,
  Briefcase,
  Map,
  ScanSearch,
  Gamepad2,
  CheckCircle2,
  Award,
  BookOpen,
  ArrowRight,
  Bookmark,
  RotateCcw,
  Zap,
} from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { PageHeader } from '../components/PageHeader'
import { useLanguage } from '../context/LanguageContext'
import { useStudent } from '../context/StudentContext'

export function Dashboard() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const {
    profile,
    saveProfile,
    roadmap,
    toggleMilestone,
    skillReport,
    savedCareers,
    resetStudentProgress,
  } = useStudent()

  const [form, setForm] = useState({
    name: profile.name || '',
    studentClass: profile.studentClass || 'Class 12',
    subjects: profile.subjects || '',
    interests: profile.interests || '',
    aspirations: profile.aspirations || '',
    targetStream: profile.targetStream || '',
  })
  const [saved, setSaved] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Calculations
  const doneCount = (roadmap.milestones || []).filter((item) => item.done).length
  const totalMilestones = (roadmap.milestones || []).length
  const roadmapProgress = totalMilestones
    ? Math.round((doneCount / totalMilestones) * 100)
    : 0

  const checkedSkillsCount = (skillReport.checkedSkills || []).length

  const quickActions = [
    {
      to: '/stream',
      label: t.nav.stream,
      desc: 'Discover your ideal academic stream',
      icon: Sparkles,
      color: 'from-violet-500 to-indigo-500',
    },
    {
      to: '/careers',
      label: t.nav.careers,
      desc: 'Browse 50+ high-demand professions',
      icon: Briefcase,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      to: '/guidance',
      label: t.nav.guidance,
      desc: '1-on-1 career chat with Gemma 4',
      icon: MessagesSquare,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      to: '/roadmap',
      label: t.nav.roadmap,
      desc: 'Milestone learning roadmap generator',
      icon: Map,
      color: 'from-purple-500 to-pink-500',
    },
    {
      to: '/skills',
      label: t.nav.skills,
      desc: 'Identify and bridge your skill gaps',
      icon: ScanSearch,
      color: 'from-amber-500 to-orange-500',
    },
    {
      to: '/simulator',
      label: t.nav.simulator,
      desc: 'Simulate a day-in-the-life scenario',
      icon: Gamepad2,
      color: 'from-rose-500 to-red-500',
    },
  ]

  const handleProfileSubmit = (event) => {
    event.preventDefault()
    saveProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    resetStudentProgress()
    setForm({
      name: '',
      studentClass: 'Class 12',
      subjects: '',
      interests: '',
      aspirations: '',
      targetStream: '',
    })
    setShowResetConfirm(false)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Futuristic GPS for Students"
        title={`${t.dashboard.welcome}, ${profile.name || t.dashboard.guest} ✨`}
        intro="Track your educational streams, monitor learning milestones, and evolve your skill stack all in one place."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowResetConfirm(!showResetConfirm)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Data</span>
            </button>
            <Link to="/stream" className="btn-primary text-xs py-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Stream Advisor</span>
            </Link>
          </div>
        }
      />

      {/* Reset Confirmation Alert */}
      {showResetConfirm ? (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-950/50 p-4 text-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm">
            Are you sure you want to reset all locally saved progress (profile, roadmap, chat, skills)?
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
            >
              Confirm Reset
            </button>
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="rounded-xl border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {/* Quick Status Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stream Recommendation */}
        <div className="glass-card p-5 transition hover:-translate-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Target Stream</span>
            <BookOpen className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {profile.targetStream || (profile.lastStreamResult ? 'Analyzed' : 'Not Chosen')}
          </div>
          <p className="mt-1 text-xs text-slate-300">
            {profile.lastStreamResult
              ? 'Recommendation generated'
              : 'Complete the quiz to unlock'}
          </p>
          <Link
            to="/stream"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:underline"
          >
            {profile.lastStreamResult ? 'View Stream Advice' : 'Take Stream Quiz'} →
          </Link>
        </div>

        {/* Roadmap Milestones */}
        <div className="glass-card p-5 transition hover:-translate-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Learning Roadmap</span>
            <Award className="h-4 w-4 text-violet-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {roadmap.career ? `${roadmapProgress}%` : '0%'}
          </div>
          <p className="mt-1 text-xs text-slate-300">
            {roadmap.career
              ? `${doneCount} of ${totalMilestones} milestones completed`
              : 'No roadmap generated yet'}
          </p>
          <Link
            to="/roadmap"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-violet-400 hover:underline"
          >
            {roadmap.career ? `Continue: ${roadmap.career}` : 'Generate Roadmap'} →
          </Link>
        </div>

        {/* Skill Gap Readiness */}
        <div className="glass-card p-5 transition hover:-translate-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Skills Analyzed</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {checkedSkillsCount > 0 ? `${checkedSkillsCount} Mastered` : 'Check Skills'}
          </div>
          <p className="mt-1 text-xs text-slate-300">
            {skillReport.career
              ? `Target: ${skillReport.career}`
              : 'Compare skills with dream job'}
          </p>
          <Link
            to="/skills"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-400 hover:underline"
          >
            Analyze Skill Gap →
          </Link>
        </div>

        {/* Saved Careers */}
        <div className="glass-card p-5 transition hover:-translate-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Bookmarked Roles</span>
            <Bookmark className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {savedCareers.length} Saved
          </div>
          <p className="mt-1 text-xs text-slate-300">
            {savedCareers.length ? 'Roles in your shortlist' : 'Bookmark roles to review'}
          </p>
          <Link
            to="/careers"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:underline"
          >
            Explore Career Library →
          </Link>
        </div>
      </div>

      {/* Main Grid: Student Profile + Roadmap & Skills */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Profile Card */}
        <GlassCard className="p-6 xl:col-span-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div>
              <h2 className="text-xl font-bold text-white">{t.dashboard.profile}</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Saved locally on your browser. AI recommendations will be tailored to these details.
              </p>
            </div>
            <span className="chip text-xs bg-cyan-950/50 text-cyan-300 border-cyan-400/20">
              {form.studentClass || 'Class 12'}
            </span>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleProfileSubmit}>
            <label className="field">
              {t.dashboard.name}
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Aarav Sharma"
              />
            </label>

            <label className="field">
              {t.dashboard.class}
              <select
                value={form.studentClass}
                onChange={(e) => setForm({ ...form, studentClass: e.target.value })}
              >
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
                <option value="College 1st/2nd Year">College 1st/2nd Year</option>
                <option value="College 3rd/4th Year">College 3rd/4th Year</option>
                <option value="Graduate / Job Seeker">Graduate / Job Seeker</option>
              </select>
            </label>

            <label className="field">
              Favorite Subjects
              <input
                value={form.subjects}
                onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                placeholder="e.g. Mathematics, Computer Science, Physics"
              />
            </label>

            <label className="field">
              Target Stream
              <select
                value={form.targetStream}
                onChange={(e) => setForm({ ...form, targetStream: e.target.value })}
              >
                <option value="">-- Select or let AI suggest --</option>
                <option value="Science (PCM - Physics, Chemistry, Maths)">Science (PCM)</option>
                <option value="Science (PCB - Physics, Chemistry, Biology)">Science (PCB)</option>
                <option value="Commerce (with Mathematics)">Commerce (with Maths)</option>
                <option value="Commerce (without Mathematics)">Commerce (General)</option>
                <option value="Arts / Humanities">Arts / Humanities</option>
                <option value="Vocational / Polytechnic / ITI">Vocational / Skill-based</option>
              </select>
            </label>

            <label className="field md:col-span-2">
              {t.dashboard.interests}
              <input
                value={form.interests}
                onChange={(e) => setForm({ ...form, interests: e.target.value })}
                placeholder="e.g. Artificial Intelligence, Robotics, Game Design, Solving Logic Puzzles"
              />
            </label>

            <label className="field md:col-span-2">
              {t.stream.aspirations}
              <input
                value={form.aspirations}
                onChange={(e) => setForm({ ...form, aspirations: e.target.value })}
                placeholder="e.g. AI Engineer, Software Architect, Data Scientist"
              />
            </label>

            <div className="flex items-center gap-3 md:col-span-2 pt-2">
              <button type="submit" className="btn-primary">
                {t.dashboard.save}
              </button>
              {saved ? (
                <span className="flex items-center gap-1.5 text-xs font-medium text-cyan-300">
                  <CheckCircle2 className="h-4 w-4" />
                  {t.dashboard.saved}
                </span>
              ) : null}
            </div>
          </form>
        </GlassCard>

        {/* Current Roadmap Quick Tracker */}
        <GlassCard className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="font-bold text-white">{t.dashboard.roadmap}</h3>
              {roadmap.career ? (
                <span className="chip text-[11px] text-cyan-300 bg-cyan-950/40">
                  {doneCount}/{totalMilestones} Done
                </span>
              ) : null}
            </div>

            {roadmap.career ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400">Target Role</p>
                  <p className="text-lg font-bold text-cyan-300">{roadmap.career}</p>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span>Progress</span>
                    <span>{roadmapProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${roadmapProgress}%` }}
                    />
                  </div>
                </div>

                {/* Next 3 Milestones checklist preview */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Upcoming Milestones
                  </p>
                  {(roadmap.milestones || []).slice(0, 3).map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-white/5 bg-white/5 p-2.5 text-xs text-slate-200 hover:bg-white/10"
                    >
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleMilestone(item.id)}
                        className="mt-0.5"
                      />
                      <span className={item.done ? 'line-through text-slate-500' : ''}>
                        {item.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <Map className="mx-auto h-10 w-10 text-slate-600 mb-2" />
                <p className="text-sm text-slate-300 font-medium">No roadmap active</p>
                <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
                  {t.dashboard.emptyRoadmap}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 mt-6">
            <Link
              to={roadmap.career ? '/roadmap' : '/careers'}
              className="btn-ghost w-full text-xs justify-center py-2.5"
            >
              {roadmap.career ? 'Open Full Roadmap' : 'Generate from Careers'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </GlassCard>
      </div>

      {/* Recommended Careers & Shortcuts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recommended Careers */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h3 className="font-bold text-white">{t.dashboard.recommended}</h3>
            <Link to="/careers" className="text-xs text-cyan-300 hover:underline">
              View All Careers →
            </Link>
          </div>

          {(profile.recommendedCareers || []).length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Based on your interests in <span className="text-cyan-300 font-medium">{profile.interests || 'technology and science'}</span>:
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.recommendedCareers.map((cName) => (
                  <button
                    key={cName}
                    type="button"
                    onClick={() => navigate(`/roadmap?career=${encodeURIComponent(cName)}`)}
                    className="flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-3.5 py-1.5 text-xs text-cyan-200 transition hover:bg-cyan-500/20 hover:scale-105"
                  >
                    <Sparkles className="h-3 w-3 text-cyan-400" />
                    <span>{cName}</span>
                    <ArrowRight className="h-3 w-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-slate-300">
                {t.dashboard.emptyRecs}
              </p>
              <Link to="/stream" className="btn-primary mt-4 text-xs py-2">
                Take AI Stream Quiz
              </Link>
            </div>
          )}
        </GlassCard>

        {/* Saved Careers / Shortlist */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h3 className="font-bold text-white">Your Bookmarked Roles</h3>
            <span className="chip text-xs">{savedCareers.length} saved</span>
          </div>

          {savedCareers.length > 0 ? (
            <div className="space-y-2">
              {savedCareers.map((careerId) => (
                <div
                  key={careerId}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs"
                >
                  <span className="font-medium text-white capitalize">{careerId.replace('-', ' ')}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/roadmap?career=${encodeURIComponent(careerId.replace('-', ' '))}`}
                      className="text-cyan-300 hover:underline"
                    >
                      Roadmap
                    </Link>
                    <span>•</span>
                    <Link
                      to={`/skills?career=${encodeURIComponent(careerId.replace('-', ' '))}`}
                      className="text-violet-300 hover:underline"
                    >
                      Skills
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-xs text-slate-400">
                No roles bookmarked yet. Visit the Career Explorer to save roles that interest you.
              </p>
              <Link to="/careers" className="btn-ghost mt-4 text-xs py-2">
                Browse Careers
              </Link>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Quick Launchers Grid */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">All Modules & Launchers</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map(({ to, label, desc, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="glass-card group flex items-start gap-4 p-5 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-slate-950 shadow-md group-hover:scale-105 transition`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white group-hover:text-cyan-200">
                    {label}
                  </h4>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
                </div>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed truncate">
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
