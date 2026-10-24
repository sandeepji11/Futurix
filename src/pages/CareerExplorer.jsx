import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Cpu,
  Code2,
  Bot,
  Stethoscope,
  Palette,
  BarChart3,
  Shield,
  Rocket,
  Briefcase,
  Megaphone,
  Search,
  Bookmark,
  Map,
  ScanSearch,
  GraduationCap,
  IndianRupee,
  TrendingUp,
  X,
  ChevronDown,
} from 'lucide-react'
import { careers } from '../data/careers'
import { GlassCard } from '../components/GlassCard'
import { PageHeader } from '../components/PageHeader'
import { useLanguage } from '../context/LanguageContext'
import { useStudent } from '../context/StudentContext'

const icons = {
  cpu: Cpu,
  code: Code2,
  bot: Bot,
  stethoscope: Stethoscope,
  palette: Palette,
  chart: BarChart3,
  shield: Shield,
  rocket: Rocket,
  briefcase: Briefcase,
  megaphone: Megaphone,
}

const categories = [
  'All',
  'Technology & AI',
  'Healthcare & Science',
  'Creative & Design',
  'Business & Management',
]

export function CareerExplorer() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { savedCareers, toggleSavedCareer } = useStudent()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('all') // 'all' | 'established' | 'emerging' | 'saved'
  const [expandedId, setExpandedId] = useState(null)

  const filteredCareers = useMemo(() => {
    return careers.filter((career) => {
      // Category filter
      if (selectedCategory !== 'All' && career.category !== selectedCategory) {
        return false
      }

      // Type filter
      if (selectedType === 'established' && career.type !== 'established') return false
      if (selectedType === 'emerging' && career.type !== 'emerging') return false
      if (selectedType === 'saved' && !savedCareers.includes(career.id)) return false

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase()
        const text = [
          career.name,
          career.description,
          career.education,
          career.category,
          career.exams || '',
          ...(career.skills || []),
        ]
          .join(' ')
          .toLowerCase()
        return text.includes(q)
      }

      return true
    })
  }, [search, selectedCategory, selectedType, savedCareers])

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Explore 50+ Modern Career Pathways"
        title={t.careers.title}
        intro="Browse high-demand tech, science, business, and creative careers in India. Filter by category or bookmark your favorites."
      />

      {/* Search & Category Filter Controls */}
      <GlassCard className="p-5 space-y-4">
        {/* Search input bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search careers by title, skill (e.g. Python, Figma), degree, or entrance exam..."
            className="pl-11 pr-10"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {/* Category Pills & Type Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-t border-white/5 pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl transition ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 font-semibold'
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border-white/10 bg-slate-900/90 text-white w-auto"
            >
              <option value="all">All Roles ({careers.length})</option>
              <option value="established">Established Core</option>
              <option value="emerging">Emerging 2026+</option>
              <option value="saved">Bookmarked Only ({savedCareers.length})</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong>{filteredCareers.length}</strong> career pathways
          {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
        </span>
        {selectedType === 'saved' && (
          <span className="text-cyan-300 font-medium">Viewing bookmarked favorites</span>
        )}
      </div>

      {/* Careers Grid */}
      {filteredCareers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCareers.map((career) => {
            const Icon = icons[career.icon] || Briefcase
            const isSaved = savedCareers.includes(career.id)
            const isExpanded = expandedId === career.id

            return (
              <GlassCard
                key={career.id}
                className="flex h-full flex-col justify-between p-6 transition duration-200 hover:-translate-y-1.5 hover:border-cyan-300/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
              >
                <div>
                  {/* Top Bar: Icon, Badges, Bookmark toggle */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 via-cyan-500/20 to-blue-500/20 text-cyan-300 border border-white/10">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`chip text-[10px] uppercase font-bold tracking-wider ${
                        career.type === 'emerging'
                          ? 'border-cyan-400/40 text-cyan-300 bg-cyan-950/40'
                          : 'border-violet-400/40 text-violet-300 bg-violet-950/40'
                      }`}>
                        {career.type === 'emerging' ? 'Emerging' : 'Established'}
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleSavedCareer(career.id)}
                        className={`p-2 rounded-xl border transition ${
                          isSaved
                            ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-300'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                        }`}
                        title={isSaved ? 'Remove from Bookmarks' : 'Bookmark this career'}
                      >
                        <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Career Title & Summary */}
                  <div className="mt-4">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {career.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{career.name}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      {career.description}
                    </p>
                  </div>

                  {/* Stats Tag Row: Salary & Growth */}
                  <div className="mt-4 grid grid-cols-2 gap-2 border-y border-white/5 py-3 text-xs">
                    <div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <IndianRupee className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Salary Range</span>
                      </div>
                      <p className="font-semibold text-white mt-0.5">{career.salaryRange || 'Competitive'}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Demand Growth</span>
                      </div>
                      <p className="font-semibold text-white mt-0.5">{career.growth || 'High Growth'}</p>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Key Skills Required
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {career.skills.map((skill) => (
                        <span key={skill} className="chip text-[11px]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expandable Details: Indian Education Path & Entrance Exams */}
                  {isExpanded ? (
                    <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3 space-y-2 text-xs animate-in fade-in duration-200">
                      <div>
                        <div className="flex items-center gap-1 text-cyan-300 font-semibold">
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>Educational Pathway in India:</span>
                        </div>
                        <p className="mt-1 text-slate-300 leading-relaxed">{career.education}</p>
                      </div>
                      {career.exams ? (
                        <div className="pt-2 border-t border-white/5">
                          <span className="text-violet-300 font-semibold">Key Entrance Exams: </span>
                          <span className="text-slate-300">{career.exams}</span>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {/* Card Actions: Expand toggle + Action Launchers */}
                <div className="mt-6 space-y-2 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : career.id)}
                    className="flex w-full items-center justify-center gap-1 text-[11px] font-medium text-slate-400 hover:text-cyan-300 py-1"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Education & Exam Info'}</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="btn-primary text-xs justify-center py-2.5"
                      onClick={() =>
                        navigate(`/roadmap?career=${encodeURIComponent(career.name)}`)
                      }
                      title="Generate Step-by-Step Learning Roadmap"
                    >
                      <Map className="h-3.5 w-3.5" />
                      <span>Roadmap</span>
                    </button>

                    <button
                      type="button"
                      className="btn-ghost text-xs justify-center py-2.5"
                      onClick={() =>
                        navigate(`/skills?career=${encodeURIComponent(career.name)}`)
                      }
                      title="Analyze your skill gap for this role"
                    >
                      <ScanSearch className="h-3.5 w-3.5" />
                      <span>Skill Gap</span>
                    </button>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      ) : (
        <GlassCard className="p-12 text-center text-slate-400">
          <Search className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-semibold text-white">No Matching Careers Found</h3>
          <p className="mt-2 text-xs max-w-sm mx-auto text-slate-300">
            No careers matched your current search filters. Try clearing your search keyword or switching categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setSelectedCategory('All')
              setSelectedType('all')
            }}
            className="btn-ghost mt-4 text-xs py-2"
          >
            Clear All Filters
          </button>
        </GlassCard>
      )}
    </div>
  )
}
