# Project Walkthrough (Final)

Hello! Here’s a walkthrough of our completed AI-Guided Exam Preparation Planner.

## Problem Understanding
Students struggle to prepare for exams efficiently. They often don’t know what to focus on, how to allocate time, or how to leverage their strengths and address weaknesses. Our challenge: **How can we use available data to create a smart, personalized study plan that maximizes performance?**

## Features Implemented

### 1. Syllabus Input & Parsing
- Users paste their syllabus (any format).
- The app parses it into units and topics for clarity and structure.

### 2. Per-Unit Performance Input
- Users rate their performance for each unit (slider, 1–5 scale).
- This data is used to personalize the plan.

### 3. AI-Based Study Plan Generation
- The backend distributes available days across all topics/units, weighted by performance and topic hardness.
- If there are more topics than days, multiple topics are grouped per day.
- The plan always matches the user’s available days.

### 4. LLM-Powered Tips
- For each topic/unit, the backend uses OpenAI LLM to generate a personalized, actionable study tip.
- Tips are shown alongside each plan entry in the UI.

### 5. Edwisely UI/UX Compliance
- The entire UI follows Edwisely.com’s color palette, fonts, card/button style, and layout guidelines.
- The result is a modern, accessible, and visually consistent experience.

## Conclusion
This project combines data-driven logic, LLM-powered advice, and best-in-class UI/UX to help students prepare smarter, not just harder. The final product is transparent, actionable, and tailored to each student’s needs.
