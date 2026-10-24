import { createContext, useContext, useMemo, useState } from 'react'

const PROFILE_KEY = 'futurix-profile'
const ROADMAP_KEY = 'futurix-roadmap'
const CHAT_KEY = 'futurix-chat'
const SKILLS_KEY = 'futurix-skills'
const SAVED_CAREERS_KEY = 'futurix-saved-careers'

const defaultProfile = {
  name: '',
  studentClass: 'Class 12',
  subjects: '',
  interests: '',
  strengths: '',
  aspirations: '',
  targetStream: '',
  recommendedCareers: [],
  lastStreamResult: '',
}

const defaultRoadmap = {
  career: '',
  result: '',
  milestones: [],
}

const StudentContext = createContext(null)

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

export function StudentProvider({ children }) {
  const [profile, setProfileState] = useState(() =>
    readJson(PROFILE_KEY, defaultProfile)
  )
  const [roadmap, setRoadmapState] = useState(() =>
    readJson(ROADMAP_KEY, defaultRoadmap)
  )
  const [chat, setChatState] = useState(() => {
    try {
      const raw = localStorage.getItem(CHAT_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [skillReport, setSkillReportState] = useState(() =>
    readJson(SKILLS_KEY, { career: '', existing: '', result: '', checkedSkills: [] })
  )
  const [savedCareers, setSavedCareersState] = useState(() => {
    try {
      const raw = localStorage.getItem(SAVED_CAREERS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const value = useMemo(() => {
    const saveProfile = (next) => {
      const merged = { ...profile, ...next }
      setProfileState(merged)
      localStorage.setItem(PROFILE_KEY, JSON.stringify(merged))
    }

    const saveRoadmap = (next) => {
      setRoadmapState(next)
      localStorage.setItem(ROADMAP_KEY, JSON.stringify(next))
    }

    const toggleMilestone = (id) => {
      const next = {
        ...roadmap,
        milestones: roadmap.milestones.map((item) =>
          item.id === id ? { ...item, done: !item.done } : item
        ),
      }
      saveRoadmap(next)
    }

    const addCustomMilestone = (title) => {
      if (!title || !title.trim()) return
      const newMilestone = {
        id: `custom-${Date.now()}`,
        title: title.trim(),
        done: false,
      }
      const next = {
        ...roadmap,
        milestones: [...(roadmap.milestones || []), newMilestone],
      }
      saveRoadmap(next)
    }

    const removeMilestone = (id) => {
      const next = {
        ...roadmap,
        milestones: roadmap.milestones.filter((item) => item.id !== id),
      }
      saveRoadmap(next)
    }

    const saveChat = (messages) => {
      setChatState(messages)
      localStorage.setItem(CHAT_KEY, JSON.stringify(messages))
    }

    const clearChat = () => {
      setChatState([])
      localStorage.removeItem(CHAT_KEY)
    }

    const saveSkillReport = (next) => {
      const merged = { ...skillReport, ...next }
      setSkillReportState(merged)
      localStorage.setItem(SKILLS_KEY, JSON.stringify(merged))
    }

    const toggleSkillCheck = (skillName) => {
      const list = skillReport.checkedSkills || []
      const updated = list.includes(skillName)
        ? list.filter((s) => s !== skillName)
        : [...list, skillName]
      saveSkillReport({ checkedSkills: updated })
    }

    const toggleSavedCareer = (careerId) => {
      const exists = savedCareers.includes(careerId)
      const next = exists
        ? savedCareers.filter((id) => id !== careerId)
        : [...savedCareers, careerId]
      setSavedCareersState(next)
      localStorage.setItem(SAVED_CAREERS_KEY, JSON.stringify(next))
    }

    const resetStudentProgress = () => {
      setProfileState(defaultProfile)
      setRoadmapState(defaultRoadmap)
      setChatState([])
      setSkillReportState({ career: '', existing: '', result: '', checkedSkills: [] })
      setSavedCareersState([])
      localStorage.removeItem(PROFILE_KEY)
      localStorage.removeItem(ROADMAP_KEY)
      localStorage.removeItem(CHAT_KEY)
      localStorage.removeItem(SKILLS_KEY)
      localStorage.removeItem(SAVED_CAREERS_KEY)
    }

    return {
      profile,
      saveProfile,
      roadmap,
      saveRoadmap,
      toggleMilestone,
      addCustomMilestone,
      removeMilestone,
      chat,
      saveChat,
      clearChat,
      skillReport,
      saveSkillReport,
      toggleSkillCheck,
      savedCareers,
      toggleSavedCareer,
      resetStudentProgress,
    }
  }, [profile, roadmap, chat, skillReport, savedCareers])

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  )
}

export function useStudent() {
  const context = useContext(StudentContext)
  if (!context) {
    throw new Error('useStudent must be used inside StudentProvider')
  }
  return context
}

export function milestonesFromText(text) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^(\d+[.)]|[-*•])\s+/.test(line))

  if (lines.length === 0) {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 8)
      .map((title, index) => ({
        id: `m-${index}`,
        title,
        done: false,
      }))
  }

  return lines.map((line, index) => ({
    id: `m-${index}`,
    title: line.replace(/^(\d+[.)]|[-*•])\s+/, ''),
    done: false,
  }))
}
