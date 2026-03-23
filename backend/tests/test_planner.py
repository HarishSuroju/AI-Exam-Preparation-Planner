# Test cases for the planner logic
import unittest
from unittest.mock import patch

from app.planner import generate_study_plan


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

    @patch("app.planner.generate_study_plan_with_llm")
    def test_prefers_llm_generated_plan_when_available(self, mock_llm_plan):
        mock_llm_plan.return_value = [
            {
                "day": 1,
                "topic": "LLM topic summary",
                "topic_breakdown": ["UNIT - I: Topic A"],
                "activity": "Study",
                "study_time": "18:00 - 21:00",
                "practice_focus": [],
                "tip": "Use active recall.",
            }
        ]

        plan = generate_study_plan(
            ["UNIT - I: Topic A"],
            1,
            {"UNIT - I: Topic A": 2},
            with_tips=True,
            study_start_time="18:00",
            study_end_time="21:00",
        )

        self.assertEqual(plan[0]["topic"], "LLM topic summary")
        mock_llm_plan.assert_called_once()

    @patch("app.planner.generate_study_plan_with_llm")
    def test_falls_back_when_llm_plan_does_not_prioritize_weak_topics(self, mock_llm_plan):
        mock_llm_plan.return_value = [
            {
                "day": 1,
                "topic": "Strong topic first",
                "topic_breakdown": ["UNIT - I: Strong Topic"],
                "activity": "Study",
                "study_time": "18:00 - 21:00",
                "practice_focus": [],
                "tip": "Tip",
            },
            {
                "day": 2,
                "topic": "Another strong topic",
                "topic_breakdown": ["UNIT - II: Strong Topic"],
                "activity": "Study",
                "study_time": "18:00 - 21:00",
                "practice_focus": [],
                "tip": "Tip",
            },
            {
                "day": 3,
                "topic": "Weak topic too late",
                "topic_breakdown": ["UNIT - V: Weak Topic"],
                "activity": "Study",
                "study_time": "18:00 - 21:00",
                "practice_focus": [],
                "tip": "Tip",
            },
        ]

        topics = [
            "UNIT - I: Strong Topic",
            "UNIT - II: Strong Topic",
            "UNIT - V: Weak Topic",
        ]
        performance = {
            "UNIT - I: Strong Topic": 5,
            "UNIT - II: Strong Topic": 5,
            "UNIT - V: Weak Topic": 1,
        }

        plan = generate_study_plan(
            topics,
            3,
            performance,
            with_tips=False,
            study_start_time="18:00",
            study_end_time="21:00",
        )

        first_day_topics = set(plan[0]["topic_breakdown"])
        self.assertIn("UNIT - V: Weak Topic", first_day_topics)


if __name__ == "__main__":
    unittest.main()
