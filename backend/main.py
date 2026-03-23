from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import uvicorn # type: ignore
from pydantic import BaseModel
from typing import List, Dict, Any
from app.planner import generate_study_plan
from app.quiz import evaluate_quiz_submission, generate_quiz

app = FastAPI(title="Edwisely API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
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


class QuizRequest(BaseModel):
    topics: List[str]
    num_questions: int = 5


class QuizSubmitRequest(BaseModel):
    questions: List[Dict[str, Any]]
    answers: Dict[str, int]


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


@app.post("/api/generate-quiz")
def get_quiz(request: QuizRequest):
    try:
        questions = generate_quiz(request.topics, request.num_questions)
        return {"questions": questions}
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/submit-quiz")
def submit_quiz(request: QuizSubmitRequest):
    try:
        return evaluate_quiz_submission(request.questions, request.answers)
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))
