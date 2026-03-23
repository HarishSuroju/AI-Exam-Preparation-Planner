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


def generate_study_plan_with_llm(
    topics,
    days_left,
    performance_data,
    study_start_time=None,
    study_end_time=None,
    practice_frequency=3,
    with_tips=True,
):
    weakest_score = min(performance_data.get(topic, 3) for topic in topics)
    strongest_score = max(performance_data.get(topic, 3) for topic in topics)
    weakest_topics = [
        topic for topic in topics if performance_data.get(topic, 3) == weakest_score
    ]
    strongest_topics = [
        topic for topic in topics if performance_data.get(topic, 3) == strongest_score
    ]
    topic_lines = "\n".join(
        f"- {topic} (student score: {performance_data.get(topic, 3)}/5)"
        for topic in topics
    )
    weak_topic_lines = "\n".join(f"- {topic}" for topic in weakest_topics)
    strong_topic_lines = "\n".join(f"- {topic}" for topic in strongest_topics)
    study_time = (
        f"{study_start_time} - {study_end_time}"
        if study_start_time and study_end_time
        else ""
    )
    prompt = f"""
You are generating a personalized day-wise study plan from a syllabus.

Inputs:
- Days left: {days_left}
- Study time window: {study_time or "Not specified"}
- Practice frequency: every {practice_frequency} day(s)
- Topics with student performance:
{topic_lines}
- Weakest topics that need maximum attention:
{weak_topic_lines}
- Strongest topics that should receive less time than weak topics:
{strong_topic_lines}

Requirements:
- Generate exactly {days_left} day entries.
- Prioritize weaker topics first.
- The weakest topics must appear in the first days of the plan.
- The weakest topics must receive more total focus than the strongest topics.
- Cover every provided topic at least once across the plan.
- You may group multiple topics into the same day if needed.
- Use the exact provided topic strings inside topic_breakdown.
- Include practice and revision days where appropriate.
- activity must be one of: Study, Study + Practice/Quiz, Practice/Quiz, Revision, Study + Revision.
- study_time must be "{study_time}" if a time window is provided.
- practice_focus should contain exact topic strings for practice/revision work, otherwise [].
- tip should be a concise actionable study tip if with_tips is true, otherwise an empty string.

Return valid JSON only with this shape:
{{
  "plan": [
    {{
      "day": 1,
      "topic": "short readable summary",
      "topic_breakdown": ["exact topic string"],
      "activity": "Study",
      "study_time": "{study_time}",
      "practice_focus": ["exact topic string"],
      "tip": "string"
    }}
  ]
}}
"""
    response_text = _chat_completion(
        [{"role": "user", "content": prompt}],
        max_tokens=2200,
        temperature=0.4,
    )
    payload = _extract_json_payload(response_text)
    plan = payload.get("plan", [])

    if not isinstance(plan, list) or len(plan) != days_left:
        raise ValueError("LLM did not return a valid day-wise plan")

    normalized_plan = []
    for day_index, entry in enumerate(plan, start=1):
        topic_breakdown = entry.get("topic_breakdown", [])
        if isinstance(topic_breakdown, str):
            topic_breakdown = [topic_breakdown]

        normalized_entry = {
            "day": day_index,
            "topic": str(entry.get("topic", "")).strip(),
            "topic_breakdown": [str(topic).strip() for topic in topic_breakdown if str(topic).strip()],
            "activity": str(entry.get("activity", "Study")).strip() or "Study",
            "study_time": study_time or entry.get("study_time") or None,
            "practice_focus": [
                str(topic).strip()
                for topic in entry.get("practice_focus", [])
                if str(topic).strip()
            ],
        }

        if with_tips:
            normalized_entry["tip"] = str(entry.get("tip", "")).strip()

        if not normalized_entry["topic"] or not normalized_entry["topic_breakdown"]:
            raise ValueError("LLM returned an incomplete study plan entry")

        normalized_plan.append(normalized_entry)

    covered_topics = {
        topic
        for entry in normalized_plan
        for topic in entry["topic_breakdown"]
    }
    missing_topics = [topic for topic in topics if topic not in covered_topics]
    if missing_topics:
        raise ValueError("LLM plan did not cover all topics")

    return normalized_plan
