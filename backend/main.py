import os

from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import uvicorn # type: ignore
from pydantic import BaseModel
from typing import List, Dict
from app.planner import generate_study_plan

try:
    from dotenv import load_dotenv
except ImportError:
    def load_dotenv():
        return None

load_dotenv()


def _get_allowed_origins():
    configured_origins = os.getenv("FRONTEND_ORIGINS", "")
    origins = [origin.strip() for origin in configured_origins.split(",") if origin.strip()]
    return origins or ["http://localhost:5173", "http://127.0.0.1:5173"]

app = FastAPI(title="Edwisely API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


LANDING_CONTENT = {
    "eyebrow": "AI-Guided Exam Preparation",
    "headline": "Personalized Study Plans Powered by AI",
    "description": (
        "Our platform helps students prepare smarter for exams with AI-driven, personalized study plans. "
        "Input your syllabus, available days, and performance data to receive a clear, actionable schedule. "
        "Maximize your performance, focus on your weak areas, and get tailored tips-all with the power of AI."
    ),
    "ctaPrimary": "Try the Planner",
    "ctaSecondary": "How It Works",
    "stats": [
        {"label": "AI-Powered Planning", "value": "Personalized for every student"},
        {"label": "Frontend Stack", "value": "React + Vite"},
        {"label": "Backend Stack", "value": "FastAPI + Python"},
    ],
    "features": [
        "AI analyzes your strengths and weaknesses",
        "Day-wise, actionable study schedules",
        "Practice and revision slots included",
        "LLM-powered tips and explanations",
        "Easy-to-use interface for students and educators",
    ],
}


@app.get("/")
def read_root():
    return {"message": "Edwisely backend is running"}


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "fastapi", "port": 8000}


@app.get("/api/landing")
def get_landing_content():
    return LANDING_CONTENT


class StudyPlanRequest(BaseModel):
    topics: List[str]
    days_left: int
    performance_data: Dict[str, int]  # topic: score (1=weak, 5=strong)
    study_start_time: str  # e.g., "18:00"
    study_end_time: str    # e.g., "21:00"
    practice_frequency: int = 3  # every N days (default: every 3 days)


@app.post("/api/study-plan")
def get_study_plan(request: StudyPlanRequest):
    print("Received study plan request:", request.dict())
    try:
        plan = generate_study_plan(
            request.topics,
            request.days_left,
            request.performance_data,
            with_tips=True,
            study_start_time=request.study_start_time,
            study_end_time=request.study_end_time,
            practice_frequency=request.practice_frequency
        )
        return {"plan": plan}
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))
