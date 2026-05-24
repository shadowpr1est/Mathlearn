"use client";

import { useEffect, useState } from "react";
import { AnswerForm } from "./AnswerForm";
import { HintPanel } from "./HintPanel";
import { MathBlock } from "./MathBlock";
import { getDisplayLatex } from "@/lib/equation";
import { getHintSteps } from "@/lib/hints";
import { difficultyLabels } from "@/lib/problems";
import { recordAttempt } from "@/lib/progress";
import type { Problem, UserAnswer } from "@/lib/types";
import { formatAnswer, validateAnswer } from "@/lib/validate";

interface TrainerTaskProps {
  problem: Problem;
  taskNumber: number;
  totalTasks: number;
  solved: boolean;
  onProgressUpdate: () => void;
  onAnswered?: (correct: boolean, problem: Problem) => void;
  onNext?: () => void;
  hasNext: boolean;
}

const emptyAnswer = (): UserAnswer => ({ mode: "two", x1: "", x2: "" });

const difficultyColors: Record<Problem["difficulty"], string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

export function TrainerTask({
  problem,
  taskNumber,
  totalTasks,
  solved,
  onProgressUpdate,
  onAnswered,
  onNext,
  hasNext,
}: TrainerTaskProps) {
  const [answer, setAnswer] = useState<UserAnswer>(emptyAnswer);
  const [result, setResult] = useState<{ correct: boolean; message: string } | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const hints = getHintSteps(problem);

  useEffect(() => {
    setAnswer(emptyAnswer());
    setResult(null);
    setHintCount(0);
    setWrongAttempts(0);
    setShowAnswer(false);
  }, [problem.id]);

  const handleCheck = () => {
    const validation = validateAnswer(problem, answer);
    setResult(validation);
    recordAttempt(problem.id, validation.correct);
    onProgressUpdate();
    onAnswered?.(validation.correct, problem);
    if (!validation.correct) {
      setWrongAttempts((n) => n + 1);
    }
  };

  const handleHint = () => {
    setHintCount((c) => Math.min(c + 1, hints.length));
  };

  const locked = result?.correct === true;

  return (
    <article className="card overflow-hidden">
      <div className="border-b border-[var(--border)] bg-gradient-to-r from-indigo-50/80 to-violet-50/50 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
              {taskNumber}
            </span>
            <div>
              <p className="text-sm text-[var(--muted)]">
                Задача {taskNumber} из {totalTasks}
              </p>
              <span className={`mt-0.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyColors[problem.difficulty]}`}>
                {difficultyLabels[problem.difficulty]}
              </span>
            </div>
          </div>
          {solved && (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span aria-hidden>✓</span> Решено ранее
            </span>
          )}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="equation-display">
          <MathBlock latex={getDisplayLatex(problem.equationLatex)} display />
        </div>

        <div className="mt-6">
          <AnswerForm
            value={answer}
            onChange={setAnswer}
            onSubmit={handleCheck}
            disabled={locked}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleHint}
            disabled={hintCount >= hints.length}
            className="btn-secondary"
          >
            {hintCount === 0
              ? "💡 Подсказка"
              : hintCount >= hints.length
                ? "Все подсказки показаны"
                : `💡 Ещё подсказка (${hintCount}/${hints.length})`}
          </button>
          {wrongAttempts >= 2 && !locked && (
            <button type="button" onClick={() => setShowAnswer(true)} className="btn-secondary">
              Показать ответ
            </button>
          )}
        </div>

        <HintPanel steps={hints} visibleCount={hintCount} />

        {result && (
          <div
            className={`mt-5 rounded-xl p-4 ${
              result.correct
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-red-200 bg-red-50 text-red-800"
            }`}
            role="status"
          >
            <p className="font-medium">{result.message}</p>
            {!result.correct && showAnswer && (
              <p className="mt-2 text-sm">Правильный ответ: {formatAnswer(problem.answer)}</p>
            )}
          </div>
        )}

        {locked && hasNext && onNext && (
          <button type="button" onClick={onNext} className="btn-primary mt-5 w-full sm:w-auto">
            Следующая задача →
          </button>
        )}
      </div>
    </article>
  );
}
