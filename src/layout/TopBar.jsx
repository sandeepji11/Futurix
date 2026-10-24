import { Menu, Globe2, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useStudent } from '../context/StudentContext'

export function TopBar({ onMenu }) {
  const { t, language, setLanguage, languages } = useLanguage()
  const { profile } = useStudent()

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-[#080b18]/85 px-4 py-3 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl border border-white/10 p-2 text-slate-200 hover:bg-white/5 lg:hidden"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-1.5 transition hover:border-cyan-400/30"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-slate-950 text-xs font-bold">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs text-slate-300">
              {profile.name || t.dashboard.guest}
            </span>
            <span className="chip text-[10px] text-cyan-300 bg-cyan-950/40 border-cyan-400/20 py-0.5 px-2">
              {profile.studentClass || 'Class 12'}
            </span>
          </Link>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Language Switcher */}
        <div className="flex items-center gap-1.5">
          <Globe2 className="h-4 w-4 text-cyan-400 shrink-0" />
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900/90 px-3 py-1.5 text-xs text-white"
          >
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}
