"use client";

import { useState } from "react";
import { MathBlock } from "./MathBlock";
import { getDisplayLatex } from "@/lib/equation";
import type { Example } from "@/lib/types";

export function ExampleCard({ example }: { example: Example }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="card overflow-hidden">
      <div className="p-5">
        <h3 className="text-lg font-bold">{example.title}</h3>
        <p className="mt-2">
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
            {example.method}
          </span>
        </p>
        <div className="equation-display mt-4">
          <MathBlock latex={getDisplayLatex(example.equationLatex)} display />
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`mt-4 ${open ? "btn-secondary" : "btn-primary"}`}
        >
          {open ? "Скрыть решение" : "Показать решение"}
        </button>
      </div>
      {open && (
        <div className="space-y-3 border-t border-[var(--border)] bg-[var(--surface)]/50 px-5 py-4">
          {example.steps.map((step, i) => (
            <div key={i}>
              {step.text && <p className="text-sm">{step.text}</p>}
              {step.latex && <MathBlock latex={step.latex} display />}
            </div>
          ))}
          <p className="font-semibold text-[var(--primary)]">
            Ответ: <MathBlock latex={example.answerLatex} />
          </p>
        </div>
      )}
    </article>
  );
}
