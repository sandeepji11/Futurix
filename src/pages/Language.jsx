import { Check } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useLanguage } from '../context/LanguageContext'

const copy = {
  English: 'Interface in English. AI answers will also request English.',
  Hindi: 'इंटरफ़ेस हिंदी में। एआई उत्तर भी हिंदी में माँगे जाएँगे।',
  Marathi: 'इंटरफेस मराठीत. एआय उत्तरेही मराठीत मागवली जातील.',
}

export function Language() {
  const { t, language, setLanguage, languages } = useLanguage()

  return (
    <div>
      <PageHeader
        eyebrow={t.language.current}
        title={t.language.title}
        intro={t.language.intro}
      />

      <p className="mb-6 text-sm text-cyan-200">
        {t.language.current}: {language}
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {languages.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLanguage(item)}
            className={`glass-card p-6 text-left transition hover:-translate-y-1 ${
              language === item ? 'border-cyan-300/50' : ''
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{item}</h2>
              {language === item ? <Check className="h-5 w-5 text-cyan-300" /> : null}
            </div>
            <p className="text-sm leading-6 text-slate-300">{copy[item]}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
