import { useState } from 'react'
import { careers, scenarios } from '../data/careers'
import { askAI, aiEndpoints } from '../api'
import { AiResult } from '../components/AiResult'
import { ErrorBanner } from '../components/ErrorBanner'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { GlassCard } from '../components/GlassCard'
import { useLanguage } from '../context/LanguageContext'

export function Simulator() {
  const { t, language } = useLanguage()
  const [career, setCareer] = useState(careers[0].name)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function runScenario(scenario) {
    setLoading(true)
    setError('')
    const prompt = `Career: ${career}. Scenario: ${scenario.title}. ${scenario.prompt}`

    try {
      const text = await askAI(aiEndpoints.simulation, prompt, language)
      setResult(text)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow={t.brand}
        title={t.simulator.title}
        intro={t.simulator.intro}
      />

      <GlassCard className="mb-6 p-6">
        <label className="field">
          {t.simulator.pick}
          <select
            value={career}
            onChange={(event) => setCareer(event.target.value)}
          >
            {careers.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </GlassCard>

      <h2 className="mb-4 text-lg font-semibold">{t.simulator.scenarios}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            className="glass-card p-5 text-left transition hover:-translate-y-1 hover:border-cyan-300/30"
            onClick={() => runScenario(scenario)}
            disabled={loading}
          >
            <h3 className="text-lg font-semibold">{scenario.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {scenario.prompt}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? <LoadingState /> : null}
        <ErrorBanner message={error} />
        <AiResult text={result} />
      </div>
    </div>
  )
}
