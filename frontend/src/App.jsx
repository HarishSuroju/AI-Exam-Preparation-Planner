import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import PlannerPage from "./components/PlannerPage";

const fallbackContent = {
  eyebrow: "AI-Guided Exam Preparation",
  headline: "Personalized Study Plans Powered by AI",
  description:
    "Our platform helps students prepare smarter for exams with AI-driven, personalized study plans. Input your syllabus, available days, and performance data to receive a clear, actionable schedule. Maximize your performance, focus on your weak areas, and get tailored tips-all with the power of AI.",
  ctaPrimary: "Try the Planner",
  ctaSecondary: "How It Works",
  stats: [
    { label: "Planning style", value: "Day-wise and exam-ready" },
    { label: "Experience", value: "Built for students and educators" },
    { label: "Stack", value: "React + FastAPI" },
  ],
  features: [
    "AI analyzes your strengths and weaknesses",
    "Day-wise, actionable study schedules",
    "Practice and revision slots included",
    "LLM-powered tips and explanations",
    "Easy-to-use interface for students and educators",
  ],
};

function normalizeCopy(value) {
  return typeof value === "string"
    ? value.replace(/\u00e2\u20ac\u201d/g, "-").replace(/\u2014/g, "-")
    : value;
}

export default function App() {
  const [content, setContent] = useState(fallbackContent);
  const [status, setStatus] = useState("Connecting to FastAPI...");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadLandingPage() {
      try {
        const [landingResponse, healthResponse] = await Promise.all([
          fetch("/api/landing"),
          fetch("/api/health"),
        ]);

        if (!landingResponse.ok || !healthResponse.ok) {
          throw new Error("Backend request failed");
        }

        const landingData = await landingResponse.json();
        const healthData = await healthResponse.json();

        if (!isMounted) {
          return;
        }

        setContent({
          ...landingData,
          eyebrow: normalizeCopy(landingData.eyebrow),
          headline: normalizeCopy(landingData.headline),
          description: normalizeCopy(landingData.description),
        });
        setIsConnected(true);
        setStatus(`${healthData.service} status: ${healthData.status}`);
      } catch {
        if (!isMounted) {
          return;
        }

        setIsConnected(false);
        setStatus("FastAPI not reachable yet. Start the backend to connect this page.");
      }
    }

    loadLandingPage();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage content={content} isConnected={isConnected} status={status} />
          }
        />
        <Route path="/planner" element={<PlannerPage />} />
      </Routes>
    </Router>
  );
}
