"use client";

import { useEffect, useState } from "react";
import { getProblemsByTopic, problems } from "@/lib/problems";
import {
  getAccuracy,
  getSolvedByDifficulty,
  getSolvedCount,
  loadProgress,
} from "@/lib/progress";
import type { Progress, TopicId } from "@/lib/types";

interface ProgressPanelProps {
  compact?: boolean;
  refreshKey?: number;
  topicId?: TopicId;
}

export function ProgressPanel({ compact = false, refreshKey = 0, topicId }: ProgressPanelProps) {
  const [progress, setProgress] = useState<Progress | null>(null);

  const scopeProblems = topicId ? getProblemsByTopic(topicId) : problems;
  const scopeIds = scopeProblems.map((p) => p.id);

  useEffect(() => {
    setProgress(loadProgress());
  }, [refreshKey]);

  const solvedInScope = progress
    ? scopeIds.filter((id) => progress.tasks[id]?.solved).length
    : 0;

  if (!progress || progress.totalAttempts === 0) {
    if (compact) return null;
    return (
      <div className="card p-5 text-sm text-[var(--muted)]">
        <span className="mr-2" aria-hidden>
          🎯
        </span>
        Пока нет попыток. Выберите тему и решите первую задачу в тренажёре!
      </div>
    );
  }

  const easyIds = scopeProblems.filter((p) => p.difficulty === "easy").map((p) => p.id);
  const mediumIds = scopeProblems.filter((p) => p.difficulty === "medium").map((p) => p.id);
  const hardIds = scopeProblems.filter((p) => p.difficulty === "hard").map((p) => p.id);

  const easy = getSolvedByDifficulty(progress, easyIds);
  const medium = getSolvedByDifficulty(progress, mediumIds);
  const hard = getSolvedByDifficulty(progress, hardIds);
  const solved = topicId ? solvedInScope : getSolvedCount(progress);
  const pct = scopeProblems.length > 0 ? Math.round((solved / scopeProblems.length) * 100) : 0;

  const attemptsInScope = topicId
    ? scopeIds.reduce((sum, id) => sum + (progress.tasks[id]?.attempts ?? 0), 0)
    : progress.totalAttempts;

  const correctInScope = topicId
    ? scopeIds.reduce((sum, id) => sum + (progress.tasks[id]?.correct ?? 0), 0)
    : progress.totalCorrect;

  const accuracy =
    topicId && attemptsInScope > 0
      ? Math.round((correctInScope / attemptsInScope) * 100)
      : getAccuracy(progress);

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-[var(--foreground)]">
          {topicId ? "Прогресс по теме" : "Ваш прогресс"}
        </h3>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          {pct}% пройдено
        </span>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-[var(--surface)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Решено" value={`${solved}/${scopeProblems.length}`} />
        <Stat label="Попыток" value={String(attemptsInScope)} />
        <Stat label="Верно" value={String(correctInScope)} />
        <Stat label="Точность" value={`${accuracy}%`} />
      </div>

      {!compact && (
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1">
            Лёгкий {easy.solved}/{easy.total}
          </span>
          <span className="rounded-full bg-amber-50 px-2.5 py-1">
            Средний {medium.solved}/{medium.total}
          </span>
          <span className="rounded-full bg-rose-50 px-2.5 py-1">
            Сложный {hard.solved}/{hard.total}
          </span>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
