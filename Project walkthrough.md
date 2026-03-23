# Project Walkthrough

This project is an AI-guided exam preparation planner built for the Edwisely workflow. It combines a React frontend, a FastAPI backend, syllabus parsing, user performance input, and LLM-backed study-plan generation.

## Current Product Flow

### 1. Landing Page
- The `/` route is a landing page styled to match the Edwisely visual reference.
- It introduces the platform, explains the value proposition, and routes users into the planner.

### 2. Planner Workspace
- The `/planner` route is the working area for generating a study plan.
- Students paste their syllabus into the parser.
- The frontend extracts units and topic groups from the raw syllabus text.
- Students then enter:
  - days left before the exam
  - study start time
  - study end time
  - practice frequency
  - confidence/performance score for each unit on a 1-5 scale

### 3. Syllabus Parsing
- The frontend parser normalizes the pasted syllabus text.
- It detects unit labels like `UNIT - I`, `UNIT - II`, and so on.
- It separates each unit into topic chunks so the planner can work with structured content instead of one large block of text.

### 4. Study Plan Generation
- The backend receives:
  - the parsed topic list
  - number of days left
  - performance scores
  - time window
  - practice frequency
- The planner now uses the LLM as the primary plan generator.
- The prompt asks the LLM to:
  - create exactly the requested number of day entries
  - prioritize weak topics first
  - cover all provided topics
  - include study, practice, and revision where appropriate
  - return structured JSON for the frontend

### 5. Weak-Area Enforcement
- A key requirement is that weak areas must receive more attention.
- The backend explicitly identifies the weakest topics and passes that information into the LLM prompt.
- After receiving the LLM response, the backend validates whether weak topics were actually prioritized.
- If the LLM output is too generic or does not emphasize the weak topics enough, the backend falls back to a deterministic rule-based scheduler.

### 6. Study Plan Output
- The frontend displays the generated plan in a readable card-based format.
- Each day can show:
  - what to study
  - topic breakdown
  - activity type
  - study time
  - practice focus
  - LLM-generated tip

## Frontend Structure

- `frontend/src/components/HomePage.jsx`
  - landing page experience
- `frontend/src/components/PlannerPage.jsx`
  - planner inputs and submission flow
- `frontend/src/components/SyllabusInput.jsx`
  - syllabus paste and parsing UI
- `frontend/src/components/StudyPlan.jsx`
  - generated plan output
- `frontend/src/api/parseSyllabus.js`
  - syllabus parsing logic

## Backend Structure

- `backend/main.py`
  - FastAPI app and API routes
- `backend/app/planner.py`
  - planner orchestration, LLM-first with fallback validation
- `backend/app/llm.py`
  - OpenAI integration for tips and structured study-plan generation

## APIs in Use

- `GET /api/health`
  - backend health check
- `GET /api/landing`
  - landing-page content
- `POST /api/study-plan`
  - generates the personalized study plan

## Key Design Decisions

- LLM-first planning:
  - used to produce more natural and personalized schedules
- structured validation:
  - prevents vague or generic LLM outputs from degrading quality
- fallback planner:
  - ensures the app still works if the LLM fails or returns weak results
- Edwisely-aligned UI:
  - keeps the experience visually compatible with the reference style

## Current Scope

- Implemented:
  - landing page
  - syllabus parsing
  - performance-based planning inputs
  - LLM-backed study plan generation
  - weak-area prioritization checks
  - practice and revision support
  - responsive Edwisely-style frontend

- Not currently included:
  - quiz module
  - persistent storage for saved plans
  - authentication or user accounts

## Summary

The project is now centered around a structured, LLM-backed study-planning workflow. The user provides syllabus and performance data, the backend generates a personalized day-wise plan, and the UI presents the result in a clear, Edwisely-inspired interface.
