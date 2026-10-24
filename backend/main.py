import os

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(
    title="Futurix Backend",
    description="AI-powered career guidance API",
    version="1.0.0",
)

# Allow the React frontend to communicate with FastAPI.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = os.getenv(
    "OLLAMA_URL",
    "http://localhost:11434/api/chat",
)

GEMMA_MODEL = os.getenv("GEMMA_MODEL", "")


class AIRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=10000)
    language: str = "English"


SYSTEM_PROMPT = """
You are Futurix, a helpful AI career guidance assistant.

Your purpose is to help students explore education,
careers, skills, and learning pathways.

Guidelines:
- Give practical, student-friendly advice.
- Explain career options clearly.
- Avoid presenting career predictions as guarantees.
- Consider multiple educational pathways.
- Do not make decisions on behalf of students.
- Encourage students to consult teachers, counselors,
  and family when making important decisions.
- Never invent personal knowledge about the student.
"""


FEATURE_PROMPTS = {
    "stream": """
Recommend suitable educational streams based on
the student's interests, strengths, and subjects.

Include:
1. Recommended streams
2. Reasons for each recommendation
3. Suitable subject combinations
4. Possible career paths
5. Alternative options
""",

    "chat": """
Act as a supportive career guidance mentor.

Answer the student's career-related question
with clear, practical steps.
""",

    "roadmap": """
Create a personalized career learning roadmap.

Use numbered milestones.

For each milestone, explain:
- What to learn
- Suggested activities
- How to measure progress

Avoid guaranteeing employment or admission.
""",

    "skills": """
Analyze the student's existing skills in relation
to their dream career.

Include:
1. Important skills for the career
2. Skills the student already has
3. Skills to develop
4. Practical next steps

Do not invent skill proficiency percentages.
""",

    "simulation": """
You are an educational career simulator.

Evaluate the student's response to a
professional scenario.

Provide:
1. Constructive feedback
2. Strengths of the response
3. Areas for improvement
4. An example of a stronger approach

Keep scenarios educational and age-appropriate.
""",
}


@app.get("/")
def home():
    return {
        "message": "Futurix backend is running",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {
        "status": "running",
        "model": GEMMA_MODEL or "not configured",
    }


async def generate_ai_response(
    feature: str,
    request: AIRequest,
):
    if not GEMMA_MODEL:
        raise HTTPException(
            status_code=503,
            detail=(
                "GEMMA_MODEL is not configured. "
                "Set it to an installed Ollama model."
            ),
        )

    system_message = (
        SYSTEM_PROMPT
        + "\n"
        + FEATURE_PROMPTS[feature]
        + "\nRespond in "
        + request.language
        + "."
    )

    payload = {
        "model": GEMMA_MODEL,
        "stream": False,
        "messages": [
            {
                "role": "system",
                "content": system_message,
            },
            {
                "role": "user",
                "content": request.prompt,
            },
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=180) as client:
            response = await client.post(
                OLLAMA_URL,
                json=payload,
            )
            response.raise_for_status()

            data = response.json()

            result = (
                data.get("message", {})
                .get("content", "")
            )

            if not isinstance(result, str) or not result.strip():
                raise ValueError(
                    "The AI model returned an empty response."
                )

            return {"result": result}

    except httpx.HTTPStatusError as error:
        raise HTTPException(
            status_code=502,
            detail=(
                f"Ollama returned status "
                f"{error.response.status_code}: "
                f"{error.response.text[:500]}"
            ),
        )

    except httpx.RequestError as error:
        raise HTTPException(
            status_code=502,
            detail=f"Cannot connect to Ollama: {error}",
        )

    except (ValueError, KeyError, TypeError) as error:
        raise HTTPException(
            status_code=502,
            detail=f"Invalid AI response: {error}",
        )


@app.post("/api/ai/{feature}")
async def ai_endpoint(
    feature: str,
    request: AIRequest,
):
    if feature not in FEATURE_PROMPTS:
        raise HTTPException(
            status_code=404,
            detail="Unknown AI feature",
        )

    return await generate_ai_response(
        feature,
        request,
    )