import { Link } from "react-router-dom";

const workflowSteps = [
  {
    title: "Add your syllabus",
    description:
      "Paste units and topics once, then let the planner break them into a study-ready structure.",
  },
  {
    title: "Set time and confidence",
    description:
      "Tell Edwisely how many days are left and where you feel strong or weak across each unit.",
  },
  {
    title: "Follow the daily plan",
    description:
      "Receive a clear sequence of study, practice, and revision slots that adapts to performance.",
  },
];

const audienceCards = [
  {
    title: "Students",
    description:
      "Turn a long syllabus into a focused schedule that is easier to trust and easier to follow.",
  },
  {
    title: "Educators",
    description:
      "Guide learners with a planner that makes weak areas visible and revision time intentional.",
  },
];

function normalizeCopy(value) {
  return typeof value === "string"
    ? value.replace(/\u00e2\u20ac\u201d/g, "-").replace(/\u2014/g, "-")
    : value;
}

export default function HomePage({ content, isConnected, status }) {
  const featureList =
    Array.isArray(content.features) && content.features.length > 0
      ? content.features
      : [];
  const stats =
    Array.isArray(content.stats) && content.stats.length > 0 ? content.stats : [];

  return (
    <main className="relative overflow-hidden bg-gray-soft text-text-primary">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_transparent_34%),radial-gradient(circle_at_82%_18%,_rgba(97,218,251,0.24),_transparent_24%),radial-gradient(circle_at_90%_80%,_rgba(27,117,188,0.16),_transparent_22%),linear-gradient(135deg,_#fefefe_0%,_#f5f6fa_52%,_#eef8ff_100%)]" />
      <div className="absolute left-[-5rem] top-24 h-64 w-64 rounded-full bg-white blur-3xl" />
      <div className="absolute right-[-8rem] top-52 h-80 w-80 rounded-full bg-primary/12 blur-3xl" />
      <div className="absolute bottom-16 right-12 h-48 w-48 rounded-full bg-accent/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-6 sm:px-10 lg:px-12">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-white/60 bg-white/70 px-5 py-4 shadow-[0_2px_8px_rgba(44,62,80,0.08)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,_#1b75bc_0%,_#61dafb_100%)] text-lg font-black text-white shadow-[0_8px_20px_rgba(27,117,188,0.25)]">
              E
            </div>
            <div>
              <p className="m-0 font-display text-sm font-semibold tracking-[0.22em] text-text-muted uppercase">
                Edwisely
              </p>
              <p className="m-0 text-sm text-text-muted">
                Intelligent exam preparation
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-text-muted">
            <a href="#features" className="transition hover:text-primary">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-primary">
              How it works
            </a>
            <Link
              to="/planner"
              className="rounded-xl border border-primary bg-white px-4 py-2 text-primary shadow-[0_2px_8px_rgba(44,62,80,0.08)] transition hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-[0_4px_16px_rgba(44,62,80,0.12)]"
            >
              Open Planner
            </Link>
          </nav>
        </header>

        <section className="grid min-h-[calc(100vh-8rem)] items-center gap-14 py-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)] lg:py-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-gray-border bg-white/90 px-5 py-3 text-sm font-semibold tracking-[0.24em] text-text-muted uppercase shadow-[0_2px_8px_rgba(44,62,80,0.08)] backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              Edwisely Platform
            </div>

            <div className="space-y-5">
              <p className="font-display text-sm font-semibold tracking-[0.34em] text-primary uppercase">
                {normalizeCopy(content.eyebrow)}
              </p>
              <h1 className="max-w-4xl font-display text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-[5.4rem]">
                {normalizeCopy(content.headline)}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-text-muted sm:text-xl">
                {normalizeCopy(content.description)}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/planner"
                className="rounded-2xl bg-primary px-7 py-3.5 text-base font-semibold text-white shadow-[0_10px_24px_rgba(27,117,188,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(27,117,188,0.32)]"
              >
                {normalizeCopy(content.ctaPrimary)}
              </Link>
              <a
                href="#how-it-works"
                className="rounded-2xl border border-primary bg-white px-7 py-3.5 text-base font-semibold text-primary shadow-[0_2px_8px_rgba(44,62,80,0.08)] transition hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-[0_4px_16px_rgba(44,62,80,0.12)]"
              >
                {normalizeCopy(content.ctaSecondary)}
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/85 px-4 py-2 text-sm text-text-muted shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isConnected ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {status}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/85 px-4 py-2 text-sm text-text-muted shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
                Built for high-focus exam prep
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-10 top-10 h-32 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.94)_0%,_rgba(245,246,250,0.98)_100%)] p-5 shadow-[0_24px_80px_rgba(34,43,69,0.12)]">
              <div className="rounded-[26px] border border-gray-border bg-surface-dark p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="m-0 text-xs font-semibold tracking-[0.28em] text-white/55 uppercase">
                      AI Study Planner
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                      Today's prep flow
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-white/8 px-4 py-3 text-right">
                    <p className="m-0 text-xs tracking-[0.18em] text-white/50 uppercase">
                      Days left
                    </p>
                    <p className="m-0 mt-2 text-2xl font-black">12</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {[
                    {
                      slot: "08:00 - 09:30",
                      title: "Unit 3: Probability",
                      meta: "Weak area focus",
                    },
                    {
                      slot: "10:15 - 11:00",
                      title: "Timed MCQ set",
                      meta: "Practice sprint",
                    },
                    {
                      slot: "18:00 - 18:45",
                      title: "Revision recap",
                      meta: "Spaced reinforcement",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/6 p-4 transition hover:-translate-y-0.5 hover:bg-white/10"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="m-0 text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                            {item.slot}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                        </div>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                          {item.meta}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {stats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/6 p-4"
                    >
                      <p className="m-0 text-xs tracking-[0.14em] text-white/50 uppercase">
                        {normalizeCopy(item.label)}
                      </p>
                      <p className="m-0 mt-3 text-base font-semibold text-white">
                        {normalizeCopy(item.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[24px] border border-gray-border bg-white p-5 shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
                  <p className="m-0 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                    AI Insight
                  </p>
                  <p className="mt-3 text-sm leading-7 text-text-muted">
                    Allocate the first session to high-weight topics, then shift to
                    practice and revision once confidence improves.
                  </p>
                </div>
                <div className="rounded-[24px] border border-primary/12 bg-[linear-gradient(135deg,_rgba(97,218,251,0.18)_0%,_rgba(27,117,188,0.08)_100%)] p-5 shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
                  <p className="m-0 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                    Readiness
                  </p>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/70">
                    <div className="h-full w-[72%] rounded-full bg-[linear-gradient(90deg,_#1b75bc_0%,_#61dafb_100%)]" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-text-primary">
                    72% syllabus confidence with targeted revision remaining.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="grid gap-4 rounded-[32px] border border-white/60 bg-white/72 p-6 shadow-[0_2px_8px_rgba(44,62,80,0.08)] backdrop-blur lg:grid-cols-[0.92fr_1.08fr]"
        >
          <div className="space-y-4 p-2">
            <p className="text-sm font-semibold tracking-[0.24em] text-primary uppercase">
              Why students stay on track
            </p>
            <h2 className="m-0 max-w-lg font-display text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              A softer, clearer interface for serious study planning.
            </h2>
            <p className="m-0 max-w-xl text-base leading-8 text-text-muted">
              The landing experience mirrors Edwisely's clean blue system: bright
              surfaces, rounded cards, subtle shadows, and a clear path into the
              planner.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featureList.map((feature, index) => (
              <article
                key={feature}
                className="rounded-[24px] border border-gray-border bg-[linear-gradient(180deg,_#ffffff_0%,_#f9fbff_100%)] p-5 shadow-[0_2px_8px_rgba(44,62,80,0.08)] transition hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(44,62,80,0.12)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                  0{index + 1}
                </div>
                <p className="mt-4 text-base font-semibold leading-7 text-text-primary">
                  {normalizeCopy(feature)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="grid gap-8 px-1 py-16 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-[0.24em] text-primary uppercase">
              How it works
            </p>
            <h2 className="m-0 max-w-lg font-display text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              A simple workflow from syllabus to day-wise action.
            </h2>
            <p className="m-0 max-w-xl text-base leading-8 text-text-muted">
              The page is designed to feel helpful before the user even clicks
              into the product: focused copy, fewer distractions, and motion used
              only where it adds emphasis.
            </p>
            <Link
              to="/planner"
              className="inline-flex rounded-2xl bg-surface-dark px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(34,43,69,0.16)] transition hover:-translate-y-0.5 hover:bg-primary"
            >
              Start planning now
            </Link>
          </div>

          <div className="grid gap-4">
            {workflowSteps.map((step, index) => (
              <article
                key={step.title}
                className="grid gap-5 rounded-[28px] border border-gray-border bg-white p-6 shadow-[0_2px_8px_rgba(44,62,80,0.08)] transition hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(44,62,80,0.12)] sm:grid-cols-[88px_1fr]"
              >
                <div className="flex items-center gap-3 sm:block">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,_#1b75bc_0%,_#61dafb_100%)] text-lg font-black text-white shadow-[0_10px_22px_rgba(27,117,188,0.24)]">
                    {index + 1}
                  </div>
                  <div className="hidden pt-4 text-xs font-semibold tracking-[0.2em] text-text-muted uppercase sm:block">
                    Step
                  </div>
                </div>
                <div>
                  <h3 className="m-0 text-xl font-semibold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-8 text-text-muted">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-surface-dark/8 bg-surface-dark p-8 text-white shadow-[0_24px_60px_rgba(34,43,69,0.18)]">
            <p className="text-sm font-semibold tracking-[0.24em] text-accent uppercase">
              Designed for confidence
            </p>
            <h2 className="m-0 mt-3 max-w-xl font-display text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Gentle visuals, decisive guidance, and a planner students can trust.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-[24px] bg-white/7 p-5">
                  <p className="m-0 text-xs tracking-[0.16em] text-white/55 uppercase">
                    {normalizeCopy(item.label)}
                  </p>
                  <p className="m-0 mt-3 text-lg font-semibold">
                    {normalizeCopy(item.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {audienceCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[28px] border border-gray-border bg-white p-6 shadow-[0_2px_8px_rgba(44,62,80,0.08)]"
              >
                <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                  {card.title}
                </p>
                <p className="m-0 mt-3 text-base leading-8 text-text-muted">
                  {card.description}
                </p>
              </article>
            ))}
            <article className="rounded-[28px] border border-primary/12 bg-[linear-gradient(145deg,_rgba(27,117,188,0.08)_0%,_rgba(97,218,251,0.18)_100%)] p-6 shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
              <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                Product path
              </p>
              <p className="m-0 mt-3 text-base leading-8 text-text-muted">
                The landing page now leads directly into the planner so the design
                feels like the beginning of the workflow, not a disconnected
                marketing screen.
              </p>
            </article>
          </div>
        </section>

        <section className="py-16">
          <div className="relative overflow-hidden rounded-[36px] border border-primary/10 bg-[linear-gradient(135deg,_#ffffff_0%,_#ecf7ff_50%,_#dff3ff_100%)] px-6 py-10 shadow-[0_20px_60px_rgba(27,117,188,0.12)] sm:px-10">
            <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold tracking-[0.24em] text-primary uppercase">
                  Ready to launch
                </p>
                <h2 className="m-0 mt-3 font-display text-3xl font-black tracking-[-0.04em] text-text-primary sm:text-4xl">
                  Give students a landing page that feels as smart as the planner behind it.
                </h2>
                <p className="m-0 mt-4 text-base leading-8 text-text-muted">
                  Open the planner, paste a syllabus, and turn exam prep into a
                  focused sequence of daily decisions.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/planner"
                  className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(27,117,188,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(27,117,188,0.32)]"
                >
                  Open the planner
                </Link>
                <a
                  href="#features"
                  className="rounded-2xl border border-primary bg-white px-6 py-3 text-sm font-semibold text-primary shadow-[0_2px_8px_rgba(44,62,80,0.08)] transition hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-[0_4px_16px_rgba(44,62,80,0.12)]"
                >
                  Review features
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
