"use client";

import { useEffect, useRef } from "react";
import type { Problem, Progress } from "@/lib/types";

interface TaskStepperProps {
  tasks: Problem[];
  currentIndex: number;
  progress: Progress;
  onSelect: (index: number) => void;
}

export function TaskStepper({ tasks, currentIndex, progress, onSelect }: TaskStepperProps) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    itemRefs.current[currentIndex]?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [currentIndex]);

  return (
    <div
      className="flex flex-nowrap items-center gap-1"
      role="tablist"
      aria-label="Навигация по задачам"
    >
      {tasks.map((task, i) => {
        const solved = progress.tasks[task.id]?.solved ?? false;
        const isCurrent = i === currentIndex;

        return (
          <button
            key={task.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isCurrent}
            aria-current={isCurrent ? "step" : undefined}
            onClick={() => onSelect(i)}
            title={`Задача ${i + 1}${solved ? " (решена)" : ""}`}
            aria-label={`Задача ${i + 1}${solved ? ", решена" : ""}${isCurrent ? ", текущая" : ""}`}
            className={`box-border flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full border-2 px-1 text-xs font-semibold transition-all ${
              isCurrent
                ? "border-[var(--primary)] bg-indigo-50 text-[var(--primary)]"
                : solved
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-transparent text-[var(--muted)] hover:border-gray-200 hover:bg-gray-50"
            }`}
          >
            {solved && !isCurrent ? (
              <span aria-hidden>✓</span>
            ) : (
              <span>{i + 1}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
