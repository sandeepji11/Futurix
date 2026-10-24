import { createContext, useContext, useMemo, useState } from 'react'
import { LANGUAGES, translations } from '../data/translations'

const STORAGE_KEY = 'futurix-language'
const LanguageContext = createContext(null)

function readLanguage() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return LANGUAGES.includes(saved) ? saved : 'English'
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readLanguage)

  const value = useMemo(() => {
    const setLanguage = (next) => {
      if (!LANGUAGES.includes(next)) return
      setLanguageState(next)
      localStorage.setItem(STORAGE_KEY, next)
    }

    return {
      language,
      setLanguage,
      t: translations[language],
      languages: LANGUAGES,
    }
  }, [language])

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }
  return context
}
