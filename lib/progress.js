import { getProblemsByTopic } from "./problems.js";

const STORAGE_KEY = "quadratic-trainer-progress";

const emptyProgress = () => ({
  tasks: {},
  totalAttempts: 0,
  totalCorrect: 0,
});

export function loadProgress() {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    return JSON.parse(raw);
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event("toha-progress"));
}

export function recordAttempt(taskId, correct) {
  const progress = loadProgress();
  const task = progress.tasks[taskId] ?? { attempts: 0, correct: 0, solved: false };

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

export function getAccuracy(progress) {
  if (progress.totalAttempts === 0) return 0;
  return Math.round((progress.totalCorrect / progress.totalAttempts) * 100);
}

export function getSolvedCount(progress) {
  return Object.values(progress.tasks).filter((t) => t.solved).length;
}

export function getSolvedByDifficulty(progress, taskIds) {
  const solved = taskIds.filter((id) => progress.tasks[id]?.solved).length;
  return { solved, total: taskIds.length };
}

export function getTopicTrainerStats(progress, topicId) {
  const problems = getProblemsByTopic(topicId);
  const ids = problems.map((p) => p.id);
  const solved = ids.filter((id) => progress.tasks[id]?.solved).length;
  const attempted = ids.filter((id) => (progress.tasks[id]?.attempts ?? 0) > 0).length;
  return { solved, total: problems.length, attempted };
}
