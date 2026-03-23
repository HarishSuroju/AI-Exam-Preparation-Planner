import React from "react";

export default function StudyPlan({ plan }) {
  if (!plan || plan.length === 0) return null;

  return (
    <div className="mt-8 rounded-[32px] border border-gray-border bg-white p-8 shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="m-0 text-sm font-semibold tracking-[0.22em] text-primary uppercase">
            Your result
          </p>
          <h2 className="m-0 mt-3 text-2xl font-black tracking-[-0.03em] text-text-primary">
            Personalized study plan
          </h2>
        </div>
        <div className="rounded-full bg-primary/8 px-4 py-2 text-sm font-medium text-primary">
          {plan.length} scheduled days
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {plan.map((item, idx) => (
          <article
            key={idx}
            className="rounded-[24px] border border-gray-border bg-gray-soft/60 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="m-0 text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                  Day {item.day}
                </p>
                <h3 className="m-0 mt-2 text-lg font-semibold text-text-primary">
                  {item.activity}
                </h3>
              </div>
              {item.study_time && (
                <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-text-muted shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
                  {item.study_time}
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[0.6fr_0.4fr]">
              <div>
                <p className="m-0 text-sm font-semibold text-text-primary">
                  What to study
                </p>
                <p className="m-0 mt-2 text-sm leading-7 text-text-muted">
                  {item.topic}
                </p>

                {Array.isArray(item.topic_breakdown) && item.topic_breakdown.length > 0 && (
                  <div className="mt-4">
                    <p className="m-0 text-sm font-semibold text-text-primary">
                      Topic breakdown
                    </p>
                    <ul className="mt-2 space-y-2 pl-5 text-sm leading-7 text-text-muted">
                      {item.topic_breakdown.map((topic, topicIndex) => (
                        <li key={`${item.day}-${topicIndex}`}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-[20px] bg-white p-4 shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
                  <p className="m-0 text-sm font-semibold text-text-primary">
                    Practice slot
                  </p>
                  <p className="m-0 mt-2 text-sm leading-7 text-text-muted">
                    {item.activity}
                  </p>
                </div>

                {Array.isArray(item.practice_focus) && item.practice_focus.length > 0 && (
                  <div className="rounded-[20px] bg-white p-4 shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
                    <p className="m-0 text-sm font-semibold text-text-primary">
                      Practice focus
                    </p>
                    <ul className="mt-2 space-y-2 pl-5 text-sm leading-7 text-text-muted">
                      {item.practice_focus.map((topic, practiceIndex) => (
                        <li key={`${item.day}-practice-${practiceIndex}`}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.tip && (
                  <div className="rounded-[20px] bg-white p-4 shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
                    <p className="m-0 text-sm font-semibold text-text-primary">
                      AI tip
                    </p>
                    <p className="m-0 mt-2 text-sm leading-7 text-text-muted">
                      {item.tip}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
