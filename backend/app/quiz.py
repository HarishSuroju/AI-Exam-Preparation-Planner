from app.llm import generate_quiz_with_llm, summarize_quiz_result_with_llm


def _unique_strings(values):
    seen = set()
    ordered = []

    for value in values:
        normalized = value.strip()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        ordered.append(normalized)

    return ordered


def _parse_topic(topic):
    if ":" in topic:
        unit, detail = topic.split(":", 1)
        return {"unit": unit.strip(), "detail": detail.strip()}

    return {"unit": "General", "detail": topic.strip()}


def _fallback_generate_quiz(topics, num_questions=5):
    parsed_topics = [_parse_topic(topic) for topic in _unique_strings(topics)]
    details = [item["detail"] for item in parsed_topics]
    units = _unique_strings(item["unit"] for item in parsed_topics)

    if len(details) < 2:
        return []

    questions = []

    for index, item in enumerate(parsed_topics[:num_questions], start=1):
        distractor_pool = [detail for detail in details if detail != item["detail"]]
        while len(distractor_pool) < 3:
            distractor_pool.extend(details)
            distractor_pool = [detail for detail in distractor_pool if detail != item["detail"]]

        options = [item["detail"], *distractor_pool[:3]]
        topic_focus = item["detail"]
        questions.append(
            {
                "id": index,
                "question": f"A student wants to revise the syllabus area most closely related to '{topic_focus}'. Which option should they choose?",
                "options": options,
                "correct_index": 0,
                "explanation": f"The best match is '{item['detail']}' from {item['unit']}.",
                "topic_focus": topic_focus,
            }
        )

    return questions


def generate_quiz(topics, num_questions=5):
    if len(_unique_strings(topics)) < 2:
        return []

    try:
        return generate_quiz_with_llm(topics, num_questions)
    except Exception:
        return _fallback_generate_quiz(topics, num_questions)


def _fallback_result_summary(score, total, results):
    incorrect = [item for item in results if not item["is_correct"]]
    if not incorrect:
        return f"Score: {score}/{total}. Strong work-you answered every question correctly. Keep revising the same topics to maintain retention."

    weak_areas = ", ".join(
        item["topic_focus"] or item["question"] for item in incorrect[:2]
    )
    return (
        f"Score: {score}/{total}. You are doing well, but revisit these areas next: {weak_areas}. "
        "Focus on those topics first, then attempt another quiz."
    )


def evaluate_quiz_submission(questions, answers):
    results = []
    score = 0

    for question in questions:
        question_id = str(question.get("id"))
        selected_index = answers.get(question_id)

        if selected_index is None and question.get("id") in answers:
            selected_index = answers.get(question.get("id"))

        try:
            selected_index = int(selected_index) if selected_index is not None else None
        except (TypeError, ValueError):
            selected_index = None

        correct_index = int(question["correct_index"])
        is_correct = selected_index == correct_index

        if is_correct:
            score += 1

        results.append(
            {
                "id": question["id"],
                "question": question["question"],
                "selected_index": selected_index,
                "selected_option": (
                    question["options"][selected_index]
                    if selected_index is not None and 0 <= selected_index < len(question["options"])
                    else None
                ),
                "correct_index": correct_index,
                "correct_option": question["options"][correct_index],
                "is_correct": is_correct,
                "explanation": question.get("explanation", ""),
                "topic_focus": question.get("topic_focus", ""),
            }
        )

    try:
        summary = summarize_quiz_result_with_llm(score, len(questions), results)
    except Exception:
        summary = _fallback_result_summary(score, len(questions), results)

    return {
        "score": score,
        "total": len(questions),
        "results": results,
        "summary": summary,
    }
