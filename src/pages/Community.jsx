import { posts } from '../data/community'
import { GlassCard } from '../components/GlassCard'
import { PageHeader } from '../components/PageHeader'
import { useLanguage } from '../context/LanguageContext'

export function Community() {
  const { t } = useLanguage()

  return (
    <div>
      <PageHeader
        eyebrow={t.community.badge}
        title={t.community.title}
        intro={t.community.intro}
      />

      <div className="grid gap-4">
        {posts.map((post) => (
          <GlassCard key={post.id} className="p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="chip">{t.community.badge}</span>
              <span className="chip">{post.tag}</span>
            </div>
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-cyan-200">{post.author}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{post.body}</p>
            <p className="mt-4 text-xs text-slate-500">{post.replies} replies</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
