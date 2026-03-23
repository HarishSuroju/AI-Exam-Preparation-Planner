# Solution Approach

## 1. Objective

The goal of the project is to help students generate a personalized exam-preparation plan from their syllabus, time availability, and self-assessed performance data. The system should produce a day-wise plan that is actionable, easy to follow, and especially attentive to weak areas.

## 2. Architecture

### Frontend
- React + Vite
- Responsibilities:
  - landing page presentation
  - syllabus input and parsing
  - performance sliders for each unit
  - schedule controls such as days left, study hours, and practice frequency
  - study-plan display

### Backend
- FastAPI + Python
- Responsibilities:
  - receive structured planner input
  - generate study plans
  - integrate with OpenAI for study-plan generation and tips
  - validate and return structured output to the frontend

## 3. Core Approach

### Step A: Convert Raw Syllabus Into Structured Topics
- The user pastes syllabus text in the planner.
- The frontend parser detects unit markers and breaks the text into topic groups.
- This creates a normalized topic list that the backend can use reliably.

### Step B: Collect Planning Inputs
- The planner gathers:
  - days left
  - study start and end time
  - practice frequency
  - per-unit performance score from 1 to 5

- These inputs describe:
  - what needs to be studied
  - how much time is available
  - where the student is weak or strong

### Step C: LLM-First Plan Generation
- The backend sends the structured topics and planner inputs to the LLM.
- The prompt instructs the model to:
  - generate exactly the requested number of day entries
  - prioritize weak topics first
  - cover all topics
  - include practice and revision appropriately
  - return structured JSON

- The planner also explicitly identifies:
  - weakest topics
  - strongest topics

- This is passed into the prompt so the model does not produce a vague generic plan.

### Step D: Validate the LLM Output
- The backend validates the returned plan before sending it to the frontend.
- It checks for:
  - correct number of day entries
  - valid structured fields
  - coverage of all topics
  - enough emphasis on weak topics

- If the LLM output fails those checks, the backend falls back to a rule-based planning engine.

### Step E: Rule-Based Fallback
- The fallback planner:
  - sorts topics by weakness
  - distributes them across available days
  - adds practice and revision emphasis
  - ensures the app still produces a usable result if the LLM is unavailable

## 4. Why This Hybrid Strategy Was Chosen

Using only fixed rules makes the output rigid. Using only the LLM can produce generic or inconsistent plans. The chosen approach combines both:

- LLM as the primary planner:
  - gives more natural and tailored schedules
- deterministic validation:
  - keeps the structure reliable
- fallback engine:
  - guarantees continuity and topic coverage

This creates a better balance between personalization and robustness.

## 5. Output Design

The study-plan output is designed to be readable and useful. Each day can include:
- topic summary
- topic breakdown
- activity type
- study time
- practice focus
- tip

This makes the result closer to a real study guide rather than a generic checklist.

## 6. UI/UX Alignment

The UI follows the Edwisely reference direction:
- blue-led palette
- white and soft-gray surfaces
- rounded cards and subtle shadows
- structured landing page
- clear planner workflow

The goal is to make the application feel like part of the Edwisely ecosystem rather than a disconnected prototype.

## 7. Current Scope

### Included
- Edwisely-style landing page
- syllabus parser
- planner workspace
- LLM-backed plan generation
- weak-topic prioritization enforcement
- rule-based fallback planner
- LLM-generated study tips

### Excluded
- quiz module
- user login/authentication
- database-backed plan persistence

## 8. Summary

The solution is built as a structured, AI-assisted planning system. The frontend collects syllabus and performance data, the backend uses the LLM to create a day-wise study plan, and validation plus fallback logic ensure the output remains focused, practical, and especially strong on weak-area prioritization.
