import { NavLink } from 'react-router-dom'
import {
  Compass,
  LayoutDashboard,
  MessagesSquare,
  Route,
  Sparkles,
  Briefcase,
  Map,
  ScanSearch,
  Gamepad2,
  Users,
  Globe,
  X,
  Cpu,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const coreLinks = [
  { to: '/dashboard', key: 'dashboard', icon: LayoutDashboard },
  { to: '/stream', key: 'stream', icon: Sparkles },
  { to: '/guidance', key: 'guidance', icon: MessagesSquare },
  { to: '/careers', key: 'careers', icon: Briefcase },
  { to: '/roadmap', key: 'roadmap', icon: Map },
  { to: '/skills', key: 'skills', icon: ScanSearch },
]

const collabLinks = [
  { to: '/simulator', key: 'simulator', icon: Gamepad2 },
  { to: '/mentorship', key: 'mentorship', icon: Users },
  { to: '/community', key: 'community', icon: Route },
]

export function Sidebar({ open, onClose }) {
  const { t } = useLanguage()

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-[#070b16]/95 p-4 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-between px-2 pt-1">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={onClose}>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.35)] transition group-hover:scale-105">
              <Compass className="h-5 w-5" />
            </span>
            <div>
              <span className="block text-sm font-bold tracking-[0.22em] text-white">
                {t.brand}
              </span>
              <span className="block text-[10px] text-cyan-300/80 font-medium tracking-wider">
                {t.tagline}
              </span>
            </div>
          </NavLink>
          <button
            type="button"
            className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto pr-1">
          {/* Core Modules (Member 1) */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/70 mb-2">
              Core Modules
            </p>
            {coreLinks.map(({ to, key, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-medium transition duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/20 text-white border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.15)] font-semibold'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0 text-cyan-400" />
                <span>{t.nav[key]}</span>
              </NavLink>
            ))}
          </div>

          {/* Peer & Hands-on Modules (Member 3) */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
              Exploration & Peer
            </p>
            {collabLinks.map(({ to, key, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-medium transition duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/20 text-white border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.15)] font-semibold'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0 text-violet-400" />
                <span>{t.nav[key]}</span>
              </NavLink>
            ))}
          </div>

          {/* Preferences */}
          <div className="space-y-1 pt-2 border-t border-white/5">
            <NavLink
              to="/language"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-medium transition duration-150 ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/20 font-semibold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Globe className="h-4 w-4 shrink-0 text-slate-400" />
              <span>{t.nav.language}</span>
            </NavLink>
          </div>
        </nav>

        {/* AI Engine Status Footer */}
        <div className="mt-auto border-t border-white/10 pt-4 px-2">
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-slate-900/60 p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-300">
                <Cpu className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white">Gemma 4 AI</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-400 truncate">FastAPI • Localhost:8000</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
