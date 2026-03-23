import json
import os

import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

LLM_MODEL = os.getenv("OPENAI_MODEL", "gpt-5")


def _chat_completion(messages, max_tokens=500, temperature=0.4):
    if not openai.api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured")

    response = openai.ChatCompletion.create(
        model=LLM_MODEL,
        messages=messages,
        max_tokens=max_tokens,
        temperature=temperature,
    )
    return response.choices[0].message["content"].strip()


def _extract_json_payload(text):
    candidate = text.strip()

    if candidate.startswith("```"):
        parts = candidate.split("```")
        for part in parts:
            normalized = part.strip()
            if normalized.startswith("{") or normalized.startswith("["):
                candidate = normalized
                break

    return json.loads(candidate)


def get_study_tip(topic, performance):
    """
    Generate a personalized study tip for a topic and performance level using OpenAI LLM.
    performance: int (1=weak, 5=strong)
    """
    perf_label = "weak" if performance <= 2 else "average" if performance == 3 else "strong"
    prompt = (
        f"Give a concise, actionable study tip for a student who is {perf_label} in the topic: {topic}. "
        "Focus on practical advice, not generic encouragement."
    )
    return _chat_completion(
        [{"role": "user", "content": prompt}],
        max_tokens=80,
        temperature=0.7,
    )


def generate_quiz_with_llm(topics, num_questions=5):
    topic_lines = "\n".join(f"- {topic}" for topic in topics)
    prompt = f"""
You are creating a study quiz from a syllabus.

Syllabus topics:
{topic_lines}

Generate {num_questions} multiple choice questions that test actual understanding of the syllabus content.

Rules:
- Use only the syllabus topics as the source scope.
- Do not ask "which topic is in which unit" or "which unit contains this topic".
- Ask concept-focused, recall-focused, or application-style questions that a student could answer after studying the syllabus.
- Each question must have exactly 4 options.
- Exactly one option must be correct.
- Keep questions clear and student-friendly.
- Explanations must be brief and actionable.

Return valid JSON only with this shape:
{{
  "questions": [
    {{
      "question": "string",
      "options": ["a", "b", "c", "d"],
      "correct_index": 0,
      "explanation": "string",
      "topic_focus": "string"
    }}
  ]
}}
"""
    response_text = _chat_completion(
        [{"role": "user", "content": prompt}],
        max_tokens=1400,
        temperature=0.5,
    )
    payload = _extract_json_payload(response_text)
    questions = payload.get("questions", [])

    normalized_questions = []
    for index, question in enumerate(questions[:num_questions], start=1):
        options = question.get("options", [])
        correct_index = question.get("correct_index", 0)

        if (
            not question.get("question")
            or len(options) != 4
            or not isinstance(correct_index, int)
            or correct_index < 0
            or correct_index >= len(options)
        ):
            continue

        normalized_questions.append(
            {
                "id": index,
                "question": question["question"].strip(),
                "options": [str(option).strip() for option in options],
                "correct_index": correct_index,
                "explanation": str(question.get("explanation", "")).strip(),
                "topic_focus": str(question.get("topic_focus", "")).strip(),
            }
        )

    if not normalized_questions:
        raise ValueError("LLM did not return valid quiz questions")

    return normalized_questions


def summarize_quiz_result_with_llm(score, total, results):
    serialized_results = json.dumps(results, ensure_ascii=True)
    prompt = f"""
You are reviewing a student's MCQ quiz performance.

Score: {score}/{total}
Question results:
{serialized_results}

Write a short result summary for the student.

Rules:
- Mention the score.
- Highlight 1-2 strengths.
- Highlight 1-2 weak areas based on incorrect answers.
- End with a short next-step recommendation for revision.
- Keep it concise, clear, and supportive.
"""
    return _chat_completion(
        [{"role": "user", "content": prompt}],
        max_tokens=220,
        temperature=0.4,
    )
