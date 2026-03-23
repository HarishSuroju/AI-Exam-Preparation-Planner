import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudyPlan from "./StudyPlan";
import SyllabusInput from "./SyllabusInput";

const QUIZ_STORAGE_KEY = "edwisely-quiz-topics";

export default function PlannerPage() {
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [daysLeft, setDaysLeft] = useState(7);
  const [performance, setPerformance] = useState({});
  const [studyStartTime, setStudyStartTime] = useState("18:00");
  const [studyEndTime, setStudyEndTime] = useState("21:00");
  const [practiceFrequency, setPracticeFrequency] = useState(3);

  const handleSyllabusParsed = (parsedUnits) => {
    setUnits(parsedUnits);
    const perf = {};

    parsedUnits.forEach((unit) => {
      perf[unit.unit] = 3;
    });

    setPerformance(perf);
  };

  const handlePerformanceChange = (unit, value) => {
    setPerformance((prev) => ({ ...prev, [unit]: Number(value) }));
  };

  const flattenedTopics = units.flatMap((unit) =>
    unit.topics.map((topic) => `${unit.unit}: ${topic}`),
  );

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const perfData = {};

      units.forEach((unit) => {
        unit.topics.forEach((topic) => {
          perfData[`${unit.unit}: ${topic}`] = performance[unit.unit] || 3;
        });
      });

      const response = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          days_left: daysLeft,
          topics: flattenedTopics,
          performance_data: perfData,
          study_start_time: studyStartTime,
          study_end_time: studyEndTime,
          practice_frequency: practiceFrequency,
        }),
      });
      const data = await response.json();
      setPlan(data.plan);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = () => {
    if (flattenedTopics.length === 0) {
      return;
    }

    sessionStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(flattenedTopics));
    navigate("/quiz", { state: { topics: flattenedTopics } });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-soft text-text-primary">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(97,218,251,0.16),_transparent_24%),linear-gradient(180deg,_#f5f6fa_0%,_#ffffff_100%)]" />
      <div className="relative mx-auto max-w-6xl px-6 py-8 sm:px-10">
        <Link
          to="/"
          className="inline-flex items-center rounded-full border border-gray-border bg-white px-4 py-2 text-sm font-medium text-text-muted shadow-[0_2px_8px_rgba(44,62,80,0.08)] transition hover:text-primary"
        >
          Back to landing page
        </Link>

        <section className="grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-[0.24em] text-primary uppercase">
              AI planner workspace
            </p>
            <h1 className="m-0 font-display text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              Build a day-wise study plan from your syllabus.
            </h1>
            <p className="m-0 max-w-xl text-lg leading-8 text-text-muted">
              Paste your units, rate your confidence, and generate a study
              schedule that prioritizes weak areas without losing revision time.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Paste syllabus and parse units",
                "Rate each unit from weak to strong",
                "Generate a focused plan in one step",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-gray-border bg-white p-4 text-sm font-medium text-text-primary shadow-[0_2px_8px_rgba(44,62,80,0.08)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-primary/10 bg-[linear-gradient(135deg,_rgba(27,117,188,0.08)_0%,_rgba(97,218,251,0.12)_100%)] p-6 shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
            <p className="m-0 text-sm font-semibold tracking-[0.22em] text-primary uppercase">
              Tips before you start
            </p>
            <ul className="m-0 mt-4 space-y-4 pl-5 text-base leading-7 text-text-muted">
              <li>Use clear unit headings so the parser can separate topics cleanly.</li>
              <li>Keep the day count realistic so revision space stays useful.</li>
              <li>Mark weaker units lower to let the planner rebalance your schedule.</li>
            </ul>
          </div>
        </section>

        <SyllabusInput onParsed={handleSyllabusParsed} />

        {units.length > 0 && (
          <form
            onSubmit={handleFormSubmit}
            className="mt-8 rounded-[32px] border border-gray-border bg-white p-8 shadow-[0_2px_8px_rgba(44,62,80,0.08)]"
          >
            <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
              <div className="space-y-5">
                <div>
                  <p className="m-0 text-sm font-semibold tracking-[0.22em] text-primary uppercase">
                    Plan controls
                  </p>
                  <h2 className="m-0 mt-3 text-2xl font-black tracking-[-0.03em] text-text-primary">
                    Tune the schedule before generating.
                  </h2>
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-text-primary">
                    Number of days left
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={daysLeft}
                    onChange={(event) => setDaysLeft(Number(event.target.value))}
                    className="w-full rounded-2xl border border-gray-border bg-gray-soft px-4 py-3 text-base text-text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    required
                  />
                </label>

                <label className="block mt-4">
                  <span className="mb-2 block text-sm font-semibold text-text-primary">
                    Study start time
                  </span>
                  <input
                    type="time"
                    value={studyStartTime}
                    onChange={(event) => setStudyStartTime(event.target.value)}
                    className="w-full rounded-2xl border border-gray-border bg-gray-soft px-4 py-3 text-base text-text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    required
                  />
                </label>

                <label className="block mt-4">
                  <span className="mb-2 block text-sm font-semibold text-text-primary">
                    Study end time
                  </span>
                  <input
                    type="time"
                    value={studyEndTime}
                    onChange={(event) => setStudyEndTime(event.target.value)}
                    className="w-full rounded-2xl border border-gray-border bg-gray-soft px-4 py-3 text-base text-text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    required
                  />
                </label>

                <label className="block mt-4">
                  <span className="mb-2 block text-sm font-semibold text-text-primary">
                    Practice frequency (days)
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={practiceFrequency}
                    onChange={(event) => setPracticeFrequency(Number(event.target.value))}
                    className="w-full rounded-2xl border border-gray-border bg-gray-soft px-4 py-3 text-base text-text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary">
                  Rate your performance for each unit
                </label>
                <div className="mt-4 space-y-4">
                  {units.map((unit) => {
                    const score = performance[unit.unit] || 3;
                    const strengthLabel =
                      score <= 2 ? "Needs focus" : score >= 4 ? "Strong" : "Balanced";

                    return (
                      <div
                        key={unit.unit}
                        className="rounded-[24px] border border-gray-border bg-gray-soft/70 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="m-0 text-base font-semibold text-text-primary">
                              {unit.unit}
                            </p>
                            <p className="m-0 mt-1 text-sm text-text-muted">
                              {unit.topics.length} topics detected
                            </p>
                          </div>
                          <div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-text-muted">
                            Score {score} - {strengthLabel}
                          </div>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={score}
                          onChange={(event) =>
                            handlePerformanceChange(unit.unit, event.target.value)
                          }
                          className="mt-4 w-full accent-primary"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(27,117,188,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(27,117,188,0.32)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Generating plan..." : "Generate plan"}
              </button>
              <p className="m-0 text-sm text-text-muted">
                The planner will cover all detected topics, grouping multiple topics into a day when needed.
              </p>
            </div>
          </form>
        )}

        <StudyPlan plan={plan} />

        {plan && flattenedTopics.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-[32px] border border-gray-border bg-white p-6 shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
            <div className="flex-1">
              <p className="m-0 text-sm font-semibold tracking-[0.22em] text-primary uppercase">
                Quiz mode
              </p>
              <p className="m-0 mt-2 text-sm leading-7 text-text-muted">
                Generate a quick multiple choice quiz from your parsed syllabus topics and test yourself on a separate page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateQuiz}
              className="rounded-2xl bg-surface-dark px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(34,43,69,0.16)] transition hover:-translate-y-0.5 hover:bg-primary"
            >
              Generate quiz
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
