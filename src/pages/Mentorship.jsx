import { mentors, sessions } from '../data/mentors'
import { GlassCard } from '../components/GlassCard'
import { PageHeader } from '../components/PageHeader'
import { useLanguage } from '../context/LanguageContext'

export function Mentorship() {
  const { t } = useLanguage()

  return (
    <div>
      <PageHeader
        eyebrow={t.mentorship.badge}
        title={t.mentorship.title}
        intro={t.mentorship.intro}
      />

      <h2 className="mb-4 text-lg font-semibold">{t.mentorship.sessions}</h2>
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {sessions.map((session) => (
          <GlassCard key={session.id} className="p-5">
            <span className="chip mb-3 inline-flex">{t.mentorship.badge}</span>
            <h3 className="text-lg font-semibold">{session.title}</h3>
            <p className="mt-2 text-sm text-cyan-200">{session.host}</p>
            <p className="mt-1 text-sm text-slate-400">{session.when}</p>
            <p className="mt-1 text-sm text-slate-400">{session.seats}</p>
          </GlassCard>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold">{t.mentorship.mentors}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {mentors.map((mentor) => (
          <GlassCard key={mentor.id} className="p-6">
            <span className="chip mb-3 inline-flex">{t.mentorship.badge}</span>
            <h3 className="text-xl font-semibold">{mentor.name}</h3>
            <p className="mt-1 text-sm text-cyan-200">{mentor.role}</p>
            <p className="mt-2 text-sm text-slate-300">{mentor.focus}</p>
            <p className="mt-4 text-sm italic text-slate-400">“{mentor.quote}”</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
