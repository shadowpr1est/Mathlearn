"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ProgressPanel } from "@/components/ProgressPanel";
import { TaskStepper } from "@/components/TaskStepper";
import { TrainerTask } from "@/components/TrainerTask";
import { difficultyLabels, getProblemsByTopic } from "@/lib/problems";
import { loadProgress } from "@/lib/progress";
import type { Difficulty, Problem, Progress, TopicId } from "@/lib/types";

type Filter = Difficulty | "all";
type TrainerMode = "practice" | "quiz" | "mistakes";

interface TrainerViewProps {
  topicId: TopicId;
  topicTitle: string;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function TrainerView({ topicId, topicTitle }: TrainerViewProps) {
  const topicProblems = getProblemsByTopic(topicId);
  const [mode, setMode] = useState<TrainerMode>("practice");
  const [filter, setFilter] = useState<Filter>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [refreshKey, setRefreshKey] = useState(0);
  const [quizProblems, setQuizProblems] = useState<Problem[]>([]);
  const [quizStartedAt, setQuizStartedAt] = useState<number | null>(null);
  const [quizFinishedAt, setQuizFinishedAt] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});
  const [quizMistakes, setQuizMistakes] = useState<string[]>([]);
  const [now, setNow] = useState(Date.now());

  const refreshProgress = useCallback(() => {
    setProgress(loadProgress());
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  useEffect(() => {
    if (mode !== "quiz" || quizFinishedAt !== null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [mode, quizFinishedAt]);

  const filtered = useMemo(
    () => (filter === "all" ? topicProblems : topicProblems.filter((p) => p.difficulty === filter)),
    [filter, topicProblems],
  );

  const mistakeProblems = useMemo(
    () =>
      topicProblems.filter((p) => {
        const task = progress.tasks[p.id];
        return task && task.attempts > task.correct;
      }),
    [progress.tasks, topicProblems],
  );

  const activeProblems =
    mode === "quiz" ? quizProblems : mode === "mistakes" ? mistakeProblems : filtered;

  useEffect(() => {
    setCurrentIndex(0);
  }, [filter, mode, topicId]);

  const currentProblem = activeProblems[currentIndex];
  const solvedCount = activeProblems.filter((p) => progress.tasks[p.id]?.solved).length;

  const quizAnswered = Object.keys(quizResults).length;
  const quizCorrect = Object.values(quizResults).filter(Boolean).length;
  const elapsedSeconds =
    quizStartedAt === null
      ? 0
      : Math.max(0, Math.round(((quizFinishedAt ?? now) - quizStartedAt) / 1000));

  const goNext = () => {
    if (currentIndex < activeProblems.length - 1) setCurrentIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const startPractice = () => {
    setMode("practice");
    setQuizFinishedAt(null);
  };

  const startQuiz = () => {
    const pool = filtered.length > 0 ? filtered : topicProblems;
    setQuizProblems(shuffle(pool).slice(0, 10));
    setQuizResults({});
    setQuizMistakes([]);
    setQuizStartedAt(Date.now());
    setQuizFinishedAt(null);
    setCurrentIndex(0);
    setMode("quiz");
  };

  const startMistakes = () => {
    setMode("mistakes");
    setQuizFinishedAt(null);
    setCurrentIndex(0);
  };

  const handleAnswered = (correct: boolean, problem: Problem) => {
    if (mode !== "quiz" || quizResults[problem.id] !== undefined) return;

    const nextResults = { ...quizResults, [problem.id]: correct };
    setQuizResults(nextResults);

    if (!correct) {
      setQuizMistakes((ids) => (ids.includes(problem.id) ? ids : [...ids, problem.id]));
    }

    if (Object.keys(nextResults).length >= quizProblems.length) {
      setQuizFinishedAt(Date.now());
    }
  };

  const repeatQuizMistakes = () => {
    const problems = quizMistakes
      .map((id) => topicProblems.find((problem) => problem.id === id))
      .filter((problem): problem is Problem => problem !== undefined);

    setQuizProblems(problems);
    setQuizResults({});
    setQuizMistakes([]);
    setQuizStartedAt(Date.now());
    setQuizFinishedAt(null);
    setCurrentIndex(0);
    setMode("quiz");
  };

  if (topicProblems.length === 0) {
    return (
      <div>
        <h1 className="page-title">Тренажёр</h1>
        <p className="page-subtitle mt-2">Задачи для темы «{topicTitle}» скоро появятся.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Тренажёр</h1>
        <p className="page-subtitle">Тема: {topicTitle}</p>
      </div>

      <ProgressPanel compact refreshKey={refreshKey} topicId={topicId} />

      <div className="card p-4 sm:p-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">Режим</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={startPractice}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    mode === "practice"
                      ? "bg-[var(--primary)] text-white shadow-md shadow-indigo-200"
                      : "bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Практика
                </button>
                <button
                  type="button"
                  onClick={startQuiz}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    mode === "quiz"
                      ? "bg-[var(--primary)] text-white shadow-md shadow-indigo-200"
                      : "bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Контрольная 10
                </button>
                <button
                  type="button"
                  onClick={startMistakes}
                  disabled={mistakeProblems.length === 0}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                    mode === "mistakes"
                      ? "bg-[var(--primary)] text-white shadow-md shadow-indigo-200"
                      : "bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Ошибки ({mistakeProblems.length})
                </button>
              </div>
            </div>

            <div className="text-left text-sm text-[var(--muted)] sm:text-right">
              <p className="font-semibold text-[var(--foreground)]">
                {mode === "quiz"
                  ? `${quizAnswered} / ${quizProblems.length} отвечено`
                  : `${solvedCount} / ${activeProblems.length} решено`}
              </p>
              {mode === "quiz" && <p>Время: {formatTime(elapsedSeconds)}</p>}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">Уровень сложности</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["all", "easy", "medium", "hard"] as Filter[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    filter === key
                      ? "bg-[var(--primary)] text-white shadow-md shadow-indigo-200"
                      : "bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {difficultyLabels[key]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto px-1 py-2">
          <TaskStepper
            tasks={activeProblems}
            currentIndex={currentIndex}
            progress={progress}
            onSelect={setCurrentIndex}
          />
        </div>
      </div>

      {quizFinishedAt !== null && (
        <section className="card p-5">
          <p className="text-sm font-semibold text-[var(--primary)]">Итог контрольной</p>
          <h2 className="mt-1 text-2xl font-bold">
            {quizCorrect} из {quizProblems.length} верно
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Время: {formatTime(elapsedSeconds)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={startQuiz} className="btn-primary">
              Новая контрольная
            </button>
            <button
              type="button"
              onClick={repeatQuizMistakes}
              disabled={quizMistakes.length === 0}
              className="btn-secondary"
            >
              Повторить ошибки
            </button>
          </div>
        </section>
      )}

      {currentProblem && (
        <>
          <TrainerTask
            key={`${mode}-${currentProblem.id}`}
            problem={currentProblem}
            taskNumber={currentIndex + 1}
            totalTasks={activeProblems.length}
            solved={progress.tasks[currentProblem.id]?.solved ?? false}
            onProgressUpdate={refreshProgress}
            onAnswered={handleAnswered}
            onNext={goNext}
            hasNext={currentIndex < activeProblems.length - 1}
          />

          <div className="flex justify-between gap-3">
            <button type="button" onClick={goPrev} disabled={currentIndex === 0} className="btn-secondary">
              ← Предыдущая
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={currentIndex >= activeProblems.length - 1}
              className="btn-secondary"
            >
              Следующая →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
