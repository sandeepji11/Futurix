import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Compass,
  Sparkles,
  MessagesSquare,
  Map,
  ScanSearch,
  Gamepad2,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Globe2,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export function Landing() {
  const { t, language, setLanguage, languages } = useLanguage()

  const journeySteps = [
    {
      num: '01',
      title: t.nav.stream,
      desc: t.landing.feature1Body,
      icon: Sparkles,
      to: '/stream',
      badge: 'Step 1',
    },
    {
      num: '02',
      title: t.nav.careers,
      desc: t.careers.intro,
      icon: Cpu,
      to: '/careers',
      badge: 'Step 2',
    },
    {
      num: '03',
      title: t.nav.guidance,
      desc: t.landing.feature2Body,
      icon: MessagesSquare,
      to: '/guidance',
      badge: 'Step 3',
    },
    {
      num: '04',
      title: t.nav.roadmap,
      desc: t.landing.feature3Body,
      icon: Map,
      to: '/roadmap',
      badge: 'Step 4',
    },
    {
      num: '05',
      title: t.nav.skills,
      desc: t.skillsPage.intro,
      icon: ScanSearch,
      to: '/skills',
      badge: 'Step 5',
    },
  ]

  const metrics = [
    { value: '50+', label: 'Modern & Emerging Careers', sub: 'AI, Robotics, MedTech, Design' },
    { value: '10+', label: 'Stream Combinations', sub: 'PCM, PCB, Commerce, Arts, Vocational' },
    { value: '3', label: 'Supported Languages', sub: 'English, हिंदी, मराठी' },
    { value: '100%', label: 'Free & Privacy First', sub: 'Data saved on your device' },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080b18] text-white">
      {/* Background Futuristic Glow Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute right-0 top-32 h-[32rem] w-[32rem] rounded-full bg-cyan-500/20 blur-[130px]" />
        <div className="absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-indigo-600/20 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)] transition group-hover:scale-105">
            <Compass className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-base font-bold tracking-[0.25em] text-white">
              {t.brand}
            </span>
            <span className="block text-xs text-cyan-300/80 font-medium tracking-wider">{t.tagline}</span>
          </span>
        </Link>

        {/* Desktop Quick Nav */}
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link to="/stream" className="transition hover:text-cyan-300">{t.nav.stream}</Link>
          <Link to="/careers" className="transition hover:text-cyan-300">{t.nav.careers}</Link>
          <Link to="/guidance" className="transition hover:text-cyan-300">{t.nav.guidance}</Link>
          <Link to="/roadmap" className="transition hover:text-cyan-300">{t.nav.roadmap}</Link>
          <Link to="/skills" className="transition hover:text-cyan-300">{t.nav.skills}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative hidden items-center sm:flex">
            <Globe2 className="absolute left-3 h-4 w-4 text-cyan-300" />
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="rounded-xl border border-white/10 bg-slate-900/80 pl-9 pr-3 py-2 text-xs text-white"
            >
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <Link to="/dashboard" className="btn-primary text-xs sm:text-sm py-2 sm:py-2.5">
            {t.nav.dashboard}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Main Hero */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-12 md:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Futuristic Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Hacktoberfest 2026 • Powered by Gemma 4 AI</span>
          </div>

          <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Discover Your Path.{' '}
            <span className="text-gradient">Experience Your Future.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
            {t.landing.subtitle} Navigate high school streams, master future-ready skills, and simulate real careers with honest AI guidance.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/dashboard" className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base">
              {t.landing.start}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/careers" className="btn-ghost w-full sm:w-auto px-8 py-3.5 text-base">
              {t.landing.explore}
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              100% Free for Students
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              No Account Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              Multi-Language Support
            </span>
          </div>
        </div>

        {/* Platform Metrics */}
        <section className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="glass-card p-6 text-center transition hover:-translate-y-1 hover:border-cyan-300/30"
            >
              <div className="text-3xl font-extrabold text-cyan-300 md:text-4xl">
                {metric.value}
              </div>
              <div className="mt-1 text-sm font-semibold text-white">{metric.label}</div>
              <div className="mt-1 text-xs text-slate-400">{metric.sub}</div>
            </div>
          ))}
        </section>

        {/* The 5-Step Student Journey */}
        <section className="mt-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              The Journey
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
              From School Confusion to Career Clarity
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-300">
              Follow a personalized 5-step roadmap tailored specifically for Indian students and aspiring professionals.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {journeySteps.map((step) => {
              const Icon = step.icon
              return (
                <Link
                  key={step.num}
                  to={step.to}
                  className="glass-card group flex flex-col justify-between p-6 transition hover:-translate-y-2 hover:border-cyan-300/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-cyan-400/40 group-hover:text-cyan-300">
                        {step.num}
                      </span>
                      <span className="chip text-[10px] text-cyan-300 bg-cyan-950/40 border-cyan-400/20">
                        {step.badge}
                      </span>
                    </div>
                    <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-cyan-300 transition group-hover:bg-cyan-400/10">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-cyan-200">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      {step.desc}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-cyan-400">
                    <span>Explore</span>
                    <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Why FUTURIX Grid */}
        <section className="mt-24">
          <div className="glass-card-glow p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-3">
              <div>
                <span className="chip mb-3 inline-flex bg-cyan-950/40 text-cyan-300 border-cyan-400/20">
                  Built for Hacktoberfest 2026
                </span>
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  Why Students Trust FUTURIX
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Unlike traditional coaching institutes that push students into generic molds, FUTURIX uses honest Gemma 4 AI reasoning to highlight real strengths, genuine options, and practical pathways.
                </p>
                <div className="mt-6">
                  <Link to="/stream" className="btn-primary">
                    Find Your Stream Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="space-y-4 lg:col-span-2">
                <div className="glass-card p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Honest, Non-Commercial Guidance</h4>
                      <p className="mt-1 text-sm text-slate-300">
                        We never sell courses, guarantee unrealistic salaries, or push coaching centres. You receive transparent advice with pros, cons, and realistic roadmaps.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Emerging 2026–2030 Career Fields</h4>
                      <p className="mt-1 text-sm text-slate-300">
                        Explore next-gen careers like Prompt Engineering, AI Alignment, Drone Mechanics, Green Energy, and Bio-Informatics alongside traditional STEM and Arts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Privacy First Local Storage</h4>
                      <p className="mt-1 text-sm text-slate-300">
                        All your profile details, stream results, roadmap progress, and AI mentor conversations stay saved securely in your browser's localStorage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Member 3 Collaboration Teaser */}
        <section className="mt-20 grid gap-6 md:grid-cols-3">
          <Link
            to="/simulator"
            className="glass-card p-6 transition hover:-translate-y-1 hover:border-cyan-300/30"
          >
            <Gamepad2 className="mb-3 h-6 w-6 text-cyan-300" />
            <h3 className="text-lg font-semibold text-white">{t.nav.simulator}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-300">{t.simulator.intro}</p>
          </Link>
          <Link
            to="/mentorship"
            className="glass-card p-6 transition hover:-translate-y-1 hover:border-cyan-300/30"
          >
            <Compass className="mb-3 h-6 w-6 text-violet-300" />
            <h3 className="text-lg font-semibold text-white">{t.nav.mentorship}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-300">{t.mentorship.intro}</p>
          </Link>
          <Link
            to="/community"
            className="glass-card p-6 transition hover:-translate-y-1 hover:border-cyan-300/30"
          >
            <MessagesSquare className="mb-3 h-6 w-6 text-emerald-300" />
            <h3 className="text-lg font-semibold text-white">{t.nav.community}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-300">{t.community.intro}</p>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#060813] py-8 text-center text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-widest">{t.brand}</span>
            <span>•</span>
            <span>Hacktoberfest 2026</span>
          </div>
          <p>
            Member 1 (Frontend) & Member 3 • Built with React 19, Vite & Gemma 4
          </p>
          <Link to="/language" className="text-cyan-300 hover:underline">
            {language} ({t.nav.language})
          </Link>
        </div>
      </footer>
    </div>
  )
}
