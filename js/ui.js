import { getExamplesByTopic } from "./examples.js";
import { getProblemsByTopic, problems } from "./problems.js";
import { getTheoryForTopic } from "./theory.js";
import {
  getAccuracy,
  getSolvedByDifficulty,
  getSolvedCount,
  getTopicTrainerStats,
  loadProgress,
} from "./progress.js";
import { hasVisitedTopicSection } from "./topicVisit.js";
import { getTopic, topics } from "./topics.js";
import { asset } from "./layout.js";
import { renderMathInContainer } from "./math.js";

const LAST_TOPIC_KEY = "toha-last-topic";

export function markLastTopic(topicId, section) {
  localStorage.setItem(LAST_TOPIC_KEY, topicId);
  if (section) {
    import("./topicVisit.js").then(({ markTopicSectionVisited }) => markTopicSectionVisited(topicId, section));
  }
}

export function renderBreadcrumbs(topicId, current) {
  const topic = getTopic(topicId);
  if (!topic) return "";
  const base = asset("");
  const labels = { theory: "Теория", examples: "Примеры", trainer: "Тренажёр" };
  const tail =
    current && current !== "hub"
      ? `<span aria-hidden>/</span><span class="breadcrumbs-current">${labels[current]}</span>`
      : "";
  return `
    <nav class="breadcrumbs" aria-label="Навигация">
      <a href="${base}index.html">Главная</a>
      <span aria-hidden>/</span>
      <a href="${base}topics/${topicId}/index.html">${topic.title}</a>
      ${tail}
    </nav>
  `;
}

export function renderProgressPanel({ compact = false, topicId } = {}) {
  const progress = loadProgress();
  const scopeProblems = topicId ? getProblemsByTopic(topicId) : problems;
  const scopeIds = scopeProblems.map((p) => p.id);
  return renderProgressPanelSync(progress, scopeProblems, scopeIds, compact, topicId);
}

function renderProgressPanelSync(progress, scopeProblems, scopeIds, compact, topicId) {
  const solvedInScope = scopeIds.filter((id) => progress.tasks[id]?.solved).length;

  if (progress.totalAttempts === 0) {
    if (compact) return "";
    return `<div class="card card-pad text-sm text-muted">🎯 Пока нет попыток. Выберите тему и решите первую задачу в тренажёре!</div>`;
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

  const diffHtml = !compact
    ? `<div class="flex-row mt-4 text-xs text-muted">
        <span class="badge" style="background:#ecfdf5">Лёгкий ${easy.solved}/${easy.total}</span>
        <span class="badge" style="background:#fffbeb">Средний ${medium.solved}/${medium.total}</span>
        <span class="badge" style="background:#fff1f2">Сложный ${hard.solved}/${hard.total}</span>
      </div>`
    : "";

  return `
    <div class="card card-pad" data-progress-panel>
      <div class="flex-between mb-4">
        <h3 class="font-bold" style="margin:0">${topicId ? "Прогресс по теме" : "Ваш прогресс"}</h3>
        <span class="badge text-primary font-semibold">${pct}% пройдено</span>
      </div>
      <div class="progress-bar mb-4">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="grid-2" style="grid-template-columns:repeat(2,1fr)">
        ${stat("Решено", `${solved}/${scopeProblems.length}`)}
        ${stat("Попыток", String(attemptsInScope))}
        ${stat("Верно", String(correctInScope))}
        ${stat("Точность", `${accuracy}%`)}
      </div>
      ${diffHtml}
    </div>
  `;
}

function stat(label, value) {
  return `<div class="stat-card"><p class="text-xs text-muted" style="margin:0">${label}</p><p class="font-bold" style="margin:0;font-size:1.125rem">${value}</p></div>`;
}

export function renderTopicCard(topic, { comingSoon = false } = {}) {
  const base = asset("");
  const exampleCount = getExamplesByTopic(topic.id).length;
  const problemCount = getProblemsByTopic(topic.id).length;
  const theoryCount = getTheoryForTopic(topic.id, topic.theorySectionIds).length;
  const { solved } = getTopicTrainerStats(loadProgress(), topic.id);
  const progressPct = problemCount > 0 ? Math.round((solved / problemCount) * 100) : 0;
  const colorClass = topic.color.split(" ")[0];

  const progressHtml =
    problemCount > 0
      ? `<div class="mt-3">
          <div class="flex-between text-xs font-semibold" style="margin-bottom:0.25rem">
            <span class="text-muted">Тренажёр</span><span>${solved}/${problemCount}</span>
          </div>
          <div class="progress-bar"><div class="progress-bar-fill" style="width:${progressPct}%"></div></div>
        </div>`
      : "";

  return `
    <a href="${base}topics/${topic.id}/index.html" class="card topic-card ${comingSoon ? "opacity-90" : ""}">
      <div class="topic-card-head ${colorClass}">
        <div class="flex-between">
          <span style="font-size:1.5rem">${topic.icon}</span>
          ${comingSoon ? '<span class="badge-soon">Скоро</span>' : ""}
        </div>
        <h2>${topic.title}</h2>
        <p>${topic.shortDescription}</p>
      </div>
      <div class="topic-card-body">
        <div class="flex-row gap-2 text-xs text-muted">
          <span class="badge">${theoryCount} разделов</span>
          <span class="badge">${exampleCount} примеров</span>
          <span class="badge">${problemCount} задач</span>
        </div>
        ${progressHtml}
      </div>
    </a>
  `;
}

export function renderLearningPath(topic) {
  const base = asset("");
  const problemCount = getProblemsByTopic(topic.id).length;
  const progress = loadProgress();
  const stats = getTopicTrainerStats(progress, topic.id);

  const done = {
    theory: hasVisitedTopicSection(topic.id, "theory"),
    examples: hasVisitedTopicSection(topic.id, "examples"),
    trainer: stats.solved > 0 || stats.attempted > 0 || hasVisitedTopicSection(topic.id, "trainer"),
  };

  const nextHref = !done.theory
    ? "theory"
    : !done.examples
      ? "examples"
      : problemCount > 0
        ? "trainer"
        : null;

  const steps = [
    { section: "theory", step: 1, label: "Теория", href: "theory", hint: "Изучите правила" },
    { section: "examples", step: 2, label: "Примеры", href: "examples", hint: "Разбор задач" },
    { section: "trainer", step: 3, label: "Тренажёр", href: "trainer", hint: "Закрепите навык" },
  ];

  const items = steps
    .map(({ section, step, label, href, hint }) => {
      const isDone = done[section];
      const isNext = nextHref === href;
      const disabled = section === "trainer" && problemCount === 0;
      const numClass = isDone ? "path-num-done" : isNext ? "path-num-next" : "path-num-todo";
      const stepClass = disabled
        ? "path-step path-step-disabled"
        : isNext
          ? "path-step path-step-next"
          : "path-step";
      const hrefAttr = disabled ? "#" : `${base}topics/${topic.id}/${href}.html`;
      return `
        <li>
          <a href="${hrefAttr}" class="${stepClass}">
            <span class="path-num ${numClass}">${isDone ? "✓" : step}</span>
            <span>
              <strong>${label}</strong>
              <span class="text-xs text-muted" style="display:block;margin-top:0.125rem">
                ${disabled ? "Задачи скоро появятся" : hint}
                ${isNext && !disabled ? '<span class="text-primary font-semibold"> · далее</span>' : ""}
              </span>
            </span>
          </a>
        </li>
      `;
    })
    .join("");

  return `
    <section class="card card-pad mb-8">
      <p class="text-sm font-semibold text-primary" style="margin:0">Маршрут обучения</p>
      <p class="text-sm text-muted mt-4" style="margin-top:0.25rem">Рекомендуемый порядок: теория → примеры → тренажёр</p>
      <ol style="list-style:none;padding:0;margin:1rem 0 0;display:flex;flex-direction:column;gap:0.5rem">${items}</ol>
    </section>
  `;
}

export function renderSectionLinks(topic) {
  const base = asset("");
  const sections = [
    { href: "theory", label: "Теория", icon: "📖", description: "Формулы и правила" },
    { href: "examples", label: "Примеры", icon: "✏️", description: "Разобранные задачи" },
    { href: "trainer", label: "Тренажёр", icon: "🎯", description: "Практика с проверкой" },
  ];
  const problemCount = getProblemsByTopic(topic.id).length;

  return `
    <div class="grid-3">
      ${sections
        .map((s) => {
          const disabled = s.href === "trainer" && problemCount === 0;
          const href = disabled ? "#" : `${base}topics/${topic.id}/${s.href}.html`;
          return `
            <a href="${href}" class="card card-pad topic-card" style="transform:none" ${disabled ? 'aria-disabled="true"' : ""}>
              <span style="font-size:1.5rem">${s.icon}</span>
              <h2 class="font-bold mt-4" style="margin-top:0.75rem">${s.label}</h2>
              <p class="text-sm text-muted flex-1">${s.description}</p>
              <span class="text-sm font-semibold text-primary mt-4" style="display:block;margin-top:1rem">Открыть →</span>
            </a>
          `;
        })
        .join("")}
    </div>
  `;
}

export function bindProgressRefresh(root, renderFn) {
  const refresh = () => {
    renderFn();
    renderMathInContainer(root);
  };
  window.addEventListener("toha-progress", refresh);
  return () => window.removeEventListener("toha-progress", refresh);
}

export function sortedTopics() {
  return [...topics].sort((a, b) => a.order - b.order);
}
