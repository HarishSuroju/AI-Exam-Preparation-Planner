# Main planning logic for generating personalized study plans

from app.llm import generate_study_plan_with_llm, get_study_tip


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


def _topic_coverage_count(plan, topics):
    tracked_topics = set(topics)
    count = 0

    for entry in plan:
        for topic in entry.get("topic_breakdown", []):
            if topic in tracked_topics:
                count += 1
        for topic in entry.get("practice_focus", []):
            if topic in tracked_topics:
                count += 1

    return count


def _llm_plan_prioritizes_weak_topics(plan, performance_data):
    scored_topics = {
        topic: score
        for topic, score in performance_data.items()
        if isinstance(score, (int, float))
    }

    if not scored_topics:
        return True

    weakest_score = min(scored_topics.values())
    strongest_score = max(scored_topics.values())

    if weakest_score == strongest_score:
        return True

    weak_topics = [topic for topic, score in scored_topics.items() if score == weakest_score]
    strong_topics = [topic for topic, score in scored_topics.items() if score == strongest_score]

    first_days = plan[: max(1, min(2, len(plan)))]
    early_focus = {
        topic
        for entry in first_days
        for topic in entry.get("topic_breakdown", [])
    }
    weak_seen_early = any(topic in early_focus for topic in weak_topics)

    weak_mentions = _topic_coverage_count(plan, weak_topics)
    strong_mentions = _topic_coverage_count(plan, strong_topics)

    return weak_seen_early and weak_mentions > strong_mentions


def _generate_rule_based_plan(
    topics,
    days_left,
    performance_data,
    with_tips=True,
    study_start_time=None,
    study_end_time=None,
    practice_frequency=3,
):
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
    Generate a personalized study plan. Primary path uses the LLM, with a
    rule-based fallback if the LLM is unavailable or returns invalid output.
    """
    if days_left <= 0:
        return []

    ordered_topics = _unique_topics(topics)

    if not ordered_topics:
        return []

    try:
        llm_plan = generate_study_plan_with_llm(
            ordered_topics,
            days_left,
            performance_data,
            study_start_time=study_start_time,
            study_end_time=study_end_time,
            practice_frequency=practice_frequency,
            with_tips=with_tips,
        )
        if not _llm_plan_prioritizes_weak_topics(llm_plan, performance_data):
            raise ValueError("LLM plan did not prioritize weak topics enough")
        return llm_plan
    except Exception:
        return _generate_rule_based_plan(
            ordered_topics,
            days_left,
            performance_data,
            with_tips=with_tips,
            study_start_time=study_start_time,
            study_end_time=study_end_time,
            practice_frequency=practice_frequency,
        )
