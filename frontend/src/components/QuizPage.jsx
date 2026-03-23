import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const QUIZ_STORAGE_KEY = "edwisely-quiz-topics";

function readStoredTopics() {
  try {
    const stored = sessionStorage.getItem(QUIZ_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function QuizPage() {
  const location = useLocation();
  const initialTopics = useMemo(() => {
    const stateTopics = location.state?.topics;
    return Array.isArray(stateTopics) && stateTopics.length > 0
      ? stateTopics
      : readStoredTopics();
  }, [location.state]);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(initialTopics.length > 0);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!Array.isArray(initialTopics) || initialTopics.length === 0) {
      setLoading(false);
      setError("Generate a study plan first, then launch the quiz from the planner.");
      return;
    }

    sessionStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(initialTopics));

    async function loadQuiz() {
      try {
        const response = await fetch("/api/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topics: initialTopics,
            num_questions: Math.min(5, initialTopics.length),
          }),
        });

        if (!response.ok) {
          throw new Error("Quiz generation failed");
        }

        const data = await response.json();
        setQuestions(data.questions || []);
      } catch {
        setError("Unable to generate quiz right now. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [initialTopics]);

  const handleAnswerChange = (questionId, optionIndex) => {
    if (result) {
      return;
    }

    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/submit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error("Quiz submission failed");
      }

      const data = await response.json();
      setResult(data);
    } catch {
      setError("Unable to evaluate quiz right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resultByQuestionId = result
    ? Object.fromEntries(result.results.map((item) => [item.id, item]))
    : {};

  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-soft text-text-primary">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(97,218,251,0.16),_transparent_24%),linear-gradient(180deg,_#f5f6fa_0%,_#ffffff_100%)]" />
      <div className="relative mx-auto max-w-5xl px-6 py-8 sm:px-10">
        <Link
          to="/planner"
          className="inline-flex items-center rounded-full border border-gray-border bg-white px-4 py-2 text-sm font-medium text-text-muted shadow-[0_2px_8px_rgba(44,62,80,0.08)] transition hover:text-primary"
        >
          Back to planner
        </Link>

        <section className="mt-8 rounded-[32px] border border-gray-border bg-white p-8 shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
          <p className="m-0 text-sm font-semibold tracking-[0.22em] text-primary uppercase">
            LLM quiz mode
          </p>
          <h1 className="m-0 mt-3 font-display text-4xl font-black tracking-[-0.04em] text-text-primary">
            Test your understanding with syllabus-based MCQs.
          </h1>
          <p className="m-0 mt-4 max-w-2xl text-base leading-8 text-text-muted">
            The quiz is generated from your syllabus topics. After you submit your answers, the system will score them and return an LLM-based result summary.
          </p>
        </section>

        {loading && (
          <div className="mt-8 rounded-[32px] border border-gray-border bg-white p-8 shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
            Generating quiz...
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-[32px] border border-amber-200 bg-white p-8 text-text-primary shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
            {error}
          </div>
        )}

        {!loading && !error && questions.length > 0 && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {questions.map((question) => {
              const selectedIndex = answers[question.id];
              const evaluated = resultByQuestionId[question.id];

              return (
                <article
                  key={question.id}
                  className="rounded-[28px] border border-gray-border bg-white p-6 shadow-[0_2px_8px_rgba(44,62,80,0.08)]"
                >
                  <p className="m-0 text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                    Question {question.id}
                  </p>
                  <h2 className="m-0 mt-3 text-xl font-semibold text-text-primary">
                    {question.question}
                  </h2>

                  {question.topic_focus && (
                    <p className="m-0 mt-3 text-sm leading-7 text-text-muted">
                      Focus area: {question.topic_focus}
                    </p>
                  )}

                  <div className="mt-5 space-y-3">
                    {question.options.map((option, optionIndex) => {
                      const checked = selectedIndex === optionIndex;
                      const showCorrect = result && evaluated?.correct_index === optionIndex;
                      const showIncorrect =
                        result &&
                        checked &&
                        evaluated?.correct_index !== optionIndex;

                      return (
                        <label
                          key={`${question.id}-${optionIndex}`}
                          className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                            showCorrect
                              ? "border-emerald-300 bg-emerald-50"
                              : showIncorrect
                                ? "border-rose-300 bg-rose-50"
                                : "border-gray-border bg-gray-soft/60"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={checked}
                            onChange={() => handleAnswerChange(question.id, optionIndex)}
                            disabled={Boolean(result)}
                            className="mt-1 accent-primary"
                          />
                          <span className="text-sm leading-7 text-text-primary">{option}</span>
                        </label>
                      );
                    })}
                  </div>

                  {result && evaluated && (
                    <div className="mt-5 rounded-[20px] bg-gray-soft/70 p-4">
                      <p className="m-0 text-sm font-semibold text-text-primary">
                        {evaluated.is_correct ? "Correct" : "Correct answer"}
                      </p>
                      <p className="m-0 mt-2 text-sm leading-7 text-text-muted">
                        {evaluated.correct_option}
                      </p>
                      <p className="m-0 mt-2 text-sm leading-7 text-text-muted">
                        {evaluated.explanation}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(27,117,188,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(27,117,188,0.32)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={
                  Boolean(result) ||
                  submitting ||
                  Object.keys(answers).length !== questions.length
                }
              >
                {submitting ? "Evaluating..." : "Submit answers"}
              </button>

              {result && (
                <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
                  Score: {result.score}/{result.total}
                </div>
              )}
            </div>

            {result?.summary && (
              <div className="rounded-[28px] border border-primary/12 bg-[linear-gradient(145deg,_rgba(27,117,188,0.08)_0%,_rgba(97,218,251,0.18)_100%)] p-6 shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
                <p className="m-0 text-sm font-semibold tracking-[0.22em] text-primary uppercase">
                  LLM result
                </p>
                <p className="m-0 mt-3 text-sm leading-8 text-text-muted">
                  {result.summary}
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
