import React, { useState } from "react";

export default function InputForm({ onSubmit, loading }) {
  const [daysLeft, setDaysLeft] = useState(7);
  const [topics, setTopics] = useState([""]);
  const [performance, setPerformance] = useState({});

  const handlePerformanceChange = (topic, value) => {
    setPerformance((prev) => ({ ...prev, [topic]: Number(value) }));
  };

  const handleTopicChange = (idx, value) => {
    const newTopics = [...topics];
    newTopics[idx] = value;
    setTopics(newTopics);
    if (!(value in performance)) {
      setPerformance((prev) => ({ ...prev, [value]: 3 }));
    }
  };

  const addTopic = () => {
    setTopics([...topics, ""]);
  };

  const removeTopic = (idx) => {
    const newTopics = topics.filter((_, i) => i !== idx);
    setTopics(newTopics);
    // Optionally remove performance entry
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredTopics = topics.filter((t) => t.trim() !== "");
    const perf = {};
    filteredTopics.forEach((t) => {
      perf[t] = performance[t] || 3;
    });
    onSubmit({
      days_left: daysLeft,
      topics: filteredTopics,
      performance_data: perf,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-8 max-w-xl mx-auto space-y-6"
      style={{ fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif" }}
    >
      <h2 className="text-2xl font-bold text-primary mb-2">Get Your Personalized Study Plan</h2>
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-1">Number of days left</label>
        <input
          type="number"
          min={1}
          value={daysLeft}
          onChange={(e) => setDaysLeft(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-1">Topics & Performance</label>
        <div className="space-y-2">
          {topics.map((topic, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => handleTopicChange(idx, e.target.value)}
                placeholder={`Topic ${idx + 1}`}
                className="border border-gray-300 rounded-lg px-2 py-1 w-32"
                required
              />
              <input
                type="range"
                min={1}
                max={5}
                value={performance[topic] || 3}
                onChange={(e) => handlePerformanceChange(topic, e.target.value)}
                className="flex-1 accent-primary"
                disabled={!topic.trim()}
              />
              <span className="w-8 text-center">{performance[topic] || 3}</span>
              <button type="button" onClick={() => removeTopic(idx)} className="text-red-500 text-xs px-2">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addTopic} className="mt-2 px-3 py-1 bg-accent text-white rounded">+ Add Topic</button>
        </div>
      </div>
      <button
        type="submit"
        className="btn bg-primary text-white rounded-lg px-6 py-2 font-semibold shadow transition hover:scale-105 hover:shadow-lg disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Plan"}
      </button>
    </form>
  );
}
