# Test cases for the planner and quiz logic
import unittest
from unittest.mock import patch

from app.planner import generate_study_plan
from app.quiz import evaluate_quiz_submission, generate_quiz


class TestPlanner(unittest.TestCase):
    def test_basic_plan_uses_all_days(self):
        topics = ["Algebra", "Geometry", "Calculus"]
        days_left = 6
        performance = {"Algebra": 2, "Geometry": 4, "Calculus": 3}

        plan = generate_study_plan(
            topics,
            days_left,
            performance,
            with_tips=False,
            study_start_time="18:00",
            study_end_time="21:00",
        )

        self.assertEqual(len(plan), 6)
        self.assertEqual(plan[0]["study_time"], "18:00 - 21:00")
        self.assertIn("activity", plan[-1])

    def test_plan_covers_all_units_when_topics_exceed_days(self):
        topics = [
            "UNIT - I: Topic A",
            "UNIT - I: Topic B",
            "UNIT - II: Topic A",
            "UNIT - II: Topic B",
            "UNIT - III: Topic A",
            "UNIT - IV: Topic A",
            "UNIT - V: Topic A",
        ]
        performance = {topic: 3 for topic in topics}

        plan = generate_study_plan(
            topics,
            5,
            performance,
            with_tips=False,
            study_start_time="18:00",
            study_end_time="21:00",
        )

        self.assertEqual(len(plan), 5)

        covered_units = set()
        for day in plan:
            for topic in day["topic_breakdown"]:
                if topic.startswith("UNIT - "):
                    covered_units.add(topic.split(":")[0])

        self.assertEqual(
            covered_units,
            {"UNIT - I", "UNIT - II", "UNIT - III", "UNIT - IV", "UNIT - V"},
        )

    def test_practice_frequency_changes_practice_days(self):
        topics = [
            "UNIT - I: Topic A",
            "UNIT - I: Topic B",
            "UNIT - II: Topic A",
            "UNIT - III: Topic A",
            "UNIT - IV: Topic A",
        ]
        performance = {topic: 3 for topic in topics}

        plan_every_2 = generate_study_plan(
            topics,
            5,
            performance,
            with_tips=False,
            study_start_time="18:00",
            study_end_time="21:00",
            practice_frequency=2,
        )
        plan_every_4 = generate_study_plan(
            topics,
            5,
            performance,
            with_tips=False,
            study_start_time="18:00",
            study_end_time="21:00",
            practice_frequency=4,
        )

        practice_days_every_2 = [
            entry["day"] for entry in plan_every_2 if "Practice/Quiz" in entry["activity"]
        ]
        practice_days_every_4 = [
            entry["day"] for entry in plan_every_4 if "Practice/Quiz" in entry["activity"]
        ]

        self.assertNotEqual(practice_days_every_2, practice_days_every_4)
        self.assertTrue(any(entry.get("practice_focus") for entry in plan_every_2))

    @patch("app.quiz.generate_quiz_with_llm")
    def test_generate_quiz_prefers_llm_questions(self, mock_generate_quiz_with_llm):
        mock_generate_quiz_with_llm.return_value = [
            {
                "id": 1,
                "question": "What does the syllabus emphasize for Topic A?",
                "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                "correct_index": 1,
                "explanation": "Because Topic A focuses on Option 2.",
                "topic_focus": "Topic A",
            }
        ]

        questions = generate_quiz(["UNIT - I: Topic A", "UNIT - II: Topic B"], num_questions=1)

        self.assertEqual(len(questions), 1)
        self.assertEqual(
            questions[0]["question"],
            "What does the syllabus emphasize for Topic A?",
        )

    @patch("app.quiz.summarize_quiz_result_with_llm")
    def test_evaluate_quiz_submission_returns_score_and_summary(self, mock_summary):
        mock_summary.return_value = "You scored well overall. Revise Topic B next."
        questions = [
            {
                "id": 1,
                "question": "Q1",
                "options": ["A", "B", "C", "D"],
                "correct_index": 2,
                "explanation": "Because C is correct.",
                "topic_focus": "Topic B",
            },
            {
                "id": 2,
                "question": "Q2",
                "options": ["A", "B", "C", "D"],
                "correct_index": 0,
                "explanation": "Because A is correct.",
                "topic_focus": "Topic C",
            },
        ]
        answers = {"1": 2, "2": 1}

        result = evaluate_quiz_submission(questions, answers)

        self.assertEqual(result["score"], 1)
        self.assertEqual(result["total"], 2)
        self.assertEqual(len(result["results"]), 2)
        self.assertEqual(result["summary"], "You scored well overall. Revise Topic B next.")
        self.assertFalse(result["results"][1]["is_correct"])


if __name__ == "__main__":
    unittest.main()
