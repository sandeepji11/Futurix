const API_BASE = 'http://localhost:8000'

function connectionError() {
  return new Error(
    `Cannot connect to the FUTURIX backend at ${API_BASE}. Start the backend, then try again. If it is running, the browser may be blocking the request (CORS).`
  )
}

export async function askAI(path, prompt, language = 'English') {
  let response

  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        language,
      }),
    })
  } catch {
    throw connectionError()
  }

  if (!response.ok) {
    throw new Error(
      `The backend at ${API_BASE}${path} returned status ${response.status}. Check that the API is running.`
    )
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('The backend sent a response that was not valid JSON.')
  }

  if (typeof data.result !== 'string' || !data.result.trim()) {
    throw new Error('The backend did not return a result string.')
  }

  return data.result
}

export const aiEndpoints = {
  stream: '/api/ai/stream',
  chat: '/api/ai/chat',
  roadmap: '/api/ai/roadmap',
  skills: '/api/ai/skills',
  simulation: '/api/ai/simulation',
}
