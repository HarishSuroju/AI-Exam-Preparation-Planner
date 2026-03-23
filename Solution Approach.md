# Solution Approach (Final)

## 1. Design Overview

The project is a full-stack AI-guided exam preparation planner, built with a ReactJS frontend and a Python FastAPI backend. The UI/UX strictly follows Edwisely.com guidelines for color, typography, and component style.

### Architecture
- **Frontend (ReactJS):**
  - Syllabus input and parsing (by units/topics)
  - Per-unit performance input (slider)
  - Study plan display with LLM-powered tips
  - Edwisely UI/UX compliance (color, font, cards, buttons)
- **Backend (Python/FastAPI):**
  - Syllabus parsing logic (if needed)
  - Study plan generation (weights by performance, topic hardness)
  - LLM integration for personalized study tips (OpenAI API)

## 2. Core Logic

### a. Syllabus Parsing & Input
- User pastes syllabus; app parses into units and topics.
- User rates their performance for each unit (1–5 scale).

### b. AI-Based Planning Engine
- Assigns weights to each topic/unit based on performance and (optionally) hardness.
- Distributes available days across all topics/units so the total matches user input.
- If topics > days, groups topics per day.
- Generates a day-wise plan (what to study, when to revise/practice).

### c. LLM Assistance
- For each topic/unit, backend calls OpenAI LLM to generate a personalized, actionable study tip.
- Tips are included in the plan and shown in the UI.

## 3. UI/UX Compliance
- Color palette, fonts, border radius, shadows, and button styles match Edwisely.com reference.
- Responsive, modern, and accessible design.

## 4. Summary
This approach ensures a transparent, actionable, and user-friendly system, leveraging both rule-based logic and LLMs to maximize student performance and engagement.