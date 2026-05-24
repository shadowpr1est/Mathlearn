"use client";

import { MathBlock } from "./MathBlock";
import type { HintStep } from "@/lib/types";

interface HintPanelProps {
  steps: HintStep[];
  visibleCount: number;
}

export function HintPanel({ steps, visibleCount }: HintPanelProps) {
  if (visibleCount === 0) return null;

  return (
    <div className="mt-4 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-indigo-700">
        <span aria-hidden>💡</span> Подсказка — шаг {visibleCount} из {steps.length}
      </h4>
      <div className="space-y-3">
        {steps.slice(0, visibleCount).map((step, i) => (
          <div
            key={i}
            className={`text-sm ${i === visibleCount - 1 ? "animate-in fade-in" : ""}`}
          >
            {step.text && <p className="text-[var(--foreground)]">{step.text}</p>}
            {step.latex && <MathBlock latex={step.latex} display />}
          </div>
        ))}
      </div>
    </div>
  );
}
