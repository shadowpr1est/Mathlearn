import type { Progress, TaskProgress } from "./types";

const STORAGE_KEY = "quadratic-trainer-progress";

const emptyProgress = (): Progress => ({
  tasks: {},
  totalAttempts: 0,
  totalCorrect: 0,
});

export function loadProgress(): Progress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    return JSON.parse(raw) as Progress;
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function recordAttempt(taskId: string, correct: boolean): Progress {
  const progress = loadProgress();
  const task: TaskProgress = progress.tasks[taskId] ?? { attempts: 0, correct: 0, solved: false };

  task.attempts += 1;
  if (correct) {
    task.correct += 1;
    task.solved = true;
    progress.totalCorrect += 1;
  }
  progress.totalAttempts += 1;
  progress.tasks[taskId] = task;
  saveProgress(progress);
  return progress;
}

export function getAccuracy(progress: Progress): number {
  if (progress.totalAttempts === 0) return 0;
  return Math.round((progress.totalCorrect / progress.totalAttempts) * 100);
}

export function getSolvedCount(progress: Progress): number {
  return Object.values(progress.tasks).filter((t) => t.solved).length;
}

export function getSolvedByDifficulty(
  progress: Progress,
  taskIds: string[],
): { solved: number; total: number } {
  const solved = taskIds.filter((id) => progress.tasks[id]?.solved).length;
  return { solved, total: taskIds.length };
}
