import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { StudentProvider } from './context/StudentContext'
import { AppLayout } from './layout/AppLayout'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { StreamSelector } from './pages/StreamSelector'
import { CareerGuidance } from './pages/CareerGuidance'
import { CareerExplorer } from './pages/CareerExplorer'
import { Roadmap } from './pages/Roadmap'
import { SkillAnalyzer } from './pages/SkillAnalyzer'
import { Simulator } from './pages/Simulator'
import { Mentorship } from './pages/Mentorship'
import { Community } from './pages/Community'
import { Language } from './pages/Language'

function App() {
  return (
    <LanguageProvider>
      <StudentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/stream" element={<StreamSelector />} />
              <Route path="/guidance" element={<CareerGuidance />} />
              <Route path="/careers" element={<CareerExplorer />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/skills" element={<SkillAnalyzer />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/mentorship" element={<Mentorship />} />
              <Route path="/community" element={<Community />} />
              <Route path="/language" element={<Language />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </StudentProvider>
    </LanguageProvider>
  )
}

export default App
