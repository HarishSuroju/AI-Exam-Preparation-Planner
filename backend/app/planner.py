# Main planning logic for generating personalized study plans

import math
from app.llm import get_study_tip


def _unique_topics(topics):
    seen = set()
    ordered = []

    for topic in topics:
        normalized = topic.strip()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        ordered.append(normalized)

    return ordered


def _activity_for_day(day_number, total_days, is_reinforcement_day, practice_frequency):
    if is_reinforcement_day:
        if practice_frequency > 0 and day_number % practice_frequency == 0:
            return "Practice/Quiz"
        return "Revision"

    if practice_frequency > 0 and day_number % practice_frequency == 0:
        return "Study + Practice/Quiz"

    if day_number == total_days:
        return "Study + Revision"

    return "Study"


def _topic_summary(topics_for_day):
    if len(topics_for_day) == 1:
        return topics_for_day[0]

    preview = "; ".join(topics_for_day[:2])
    remaining = len(topics_for_day) - 2

    if remaining > 0:
        return f"{preview}; +{remaining} more topics"

    return preview


def _build_practice_focus(studied_topics, current_topics, limit=3):
    review_pool = _unique_topics(studied_topics + current_topics)

    if not review_pool:
        return []

    return review_pool[-limit:]


def generate_study_plan(
    topics,
    days_left,
    performance_data,
    with_tips=True,
    study_start_time=None,
    study_end_time=None,
    practice_frequency=3
):
    """
    topics: list of topic names
    days_left: int
    performance_data: dict {topic: performance_score (1=weak, 5=strong)}
    with_tips: bool, whether to include LLM tips
    study_start_time: str, start time of study session
    study_end_time: str, end time of study session
    practice_frequency: int, frequency of practice/revision slots
    Returns: list of dicts for a day-wise study plan
    """
    if days_left <= 0:
        return []

    ordered_topics = _unique_topics(topics)

    if not ordered_topics:
        return []

    weighted_topics = sorted(
        enumerate(ordered_topics),
        key=lambda item: (performance_data.get(item[1], 3), item[0]),
    )
    ranked_topics = [topic for _, topic in weighted_topics]
    weak_focus_topics = [
        topic for topic in ranked_topics if performance_data.get(topic, 3) <= 3
    ] or ranked_topics

    day_buckets = [[] for _ in range(days_left)]

    if len(ranked_topics) >= days_left:
        for index, topic in enumerate(ranked_topics):
            day_index = min((index * days_left) // len(ranked_topics), days_left - 1)
            day_buckets[day_index].append(topic)
        coverage_days = days_left
    else:
        for index, topic in enumerate(ranked_topics):
            day_buckets[index].append(topic)

        coverage_days = len(ranked_topics)
        remaining_days = days_left - coverage_days

        for offset in range(remaining_days):
            day_buckets[coverage_days + offset].append(
                weak_focus_topics[offset % len(weak_focus_topics)]
            )

    plan = []
    studied_so_far = []

    for day_index, topics_for_day in enumerate(day_buckets):
        if not topics_for_day:
            topics_for_day = ["Revision"]

        day_number = day_index + 1
        is_reinforcement_day = day_index >= coverage_days and len(ranked_topics) < days_left
        focus_topic = topics_for_day[0]
        weakest_score = min(performance_data.get(topic, 3) for topic in topics_for_day)

        entry = {
            "day": day_number,
            "topic": _topic_summary(topics_for_day),
            "topic_breakdown": topics_for_day,
            "activity": _activity_for_day(
                day_number,
                days_left,
                is_reinforcement_day,
                practice_frequency,
            ),
            "study_time": (
                f"{study_start_time} - {study_end_time}"
                if study_start_time and study_end_time
                else None
            ),
        }

        if "Practice/Quiz" in entry["activity"] or entry["activity"] == "Revision":
            entry["practice_focus"] = _build_practice_focus(
                studied_so_far,
                topics_for_day if focus_topic != "Revision" else [],
            )

        if with_tips and focus_topic != "Revision":
            try:
                entry["tip"] = get_study_tip(focus_topic, weakest_score)
            except Exception:
                entry["tip"] = "(Tip unavailable)"

        plan.append(entry)
        if focus_topic != "Revision":
            studied_so_far.extend(topics_for_day)

    return plan
