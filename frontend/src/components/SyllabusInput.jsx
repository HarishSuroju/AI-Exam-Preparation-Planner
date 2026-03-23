import React, { useState } from "react";
import { parseSyllabus } from "../api/parseSyllabus";

export default function SyllabusInput({ onParsed }) {
  const [syllabus, setSyllabus] = useState("");
  const [units, setUnits] = useState([]);

  const handleParse = () => {
    const parsed = parseSyllabus(syllabus);
    setUnits(parsed);
    onParsed(parsed);
  };

  return (
    <div className="mt-8 rounded-[32px] border border-gray-border bg-white p-8 shadow-[0_2px_8px_rgba(44,62,80,0.08)]">
      <div className="space-y-3">
        <p className="m-0 text-sm font-semibold tracking-[0.22em] text-primary uppercase">
          Step 1
        </p>
        <h2 className="m-0 text-2xl font-black tracking-[-0.03em] text-text-primary">
          Paste your syllabus
        </h2>
        <p className="m-0 max-w-2xl text-base leading-8 text-text-muted">
          Add unit headings and topics in plain text. The parser will group them
          so you can rate each unit before generating the plan.
        </p>
      </div>
      <textarea
        value={syllabus}
        onChange={(e) => setSyllabus(e.target.value)}
        rows={10}
        className="mt-6 w-full rounded-[24px] border border-gray-border bg-gray-soft px-4 py-4 font-mono text-sm text-text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        placeholder="Paste syllabus here..."
      />
      <button
        type="button"
        onClick={handleParse}
        className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(27,117,188,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(27,117,188,0.32)] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!syllabus.trim()}
      >
        Parse Syllabus
      </button>
      {units.length > 0 && (
        <div className="mt-2 rounded-[28px] border border-gray-border bg-gray-soft/70 p-6">
          <h3 className="m-0 text-lg font-semibold text-text-primary">
            Detected units and topics
          </h3>
          <ul className="mt-4 space-y-4 pl-5">
            {units.map((u, idx) => (
              <li key={idx} className="text-text-primary">
                <span className="font-bold">{u.unit}:</span> {u.topics.length} topics
                <ul className="mt-2 list-decimal pl-6 text-sm leading-7 text-text-muted">
                  {u.topics.map((topic, tIdx) => (
                    <li key={tIdx}>{topic}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
