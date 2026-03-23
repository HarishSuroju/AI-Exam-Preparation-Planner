# Test cases for the planner logic
import unittest
from app.planner import generate_study_plan

class TestPlanner(unittest.TestCase):
    def test_basic_plan(self):
        topics = ["Algebra", "Geometry", "Calculus"]
        days_left = 6
        performance = {"Algebra": 2, "Geometry": 4, "Calculus": 3}
        plan = generate_study_plan(topics, days_left, performance)
        self.assertEqual(len(plan), 6)
        self.assertEqual(plan[-1]["activity"], "Revision")

if __name__ == "__main__":
    unittest.main()
