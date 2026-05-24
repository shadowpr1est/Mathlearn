import { difficultyLabels, getProblemsByTopic } from "./problems.js";
import { getHintSteps } from "./hints.js";
import { recordAttempt, loadProgress, getTopicTrainerStats } from "./progress.js";
import { validateAnswer, formatAnswer } from "./validate.js";
import { getDisplayLatex, renderMathInContainer } from "./math.js";
import { getTopic } from "./topics.js";
import { markLastTopic, renderBreadcrumbs, renderProgressPanel } from "./ui.js";

const root = document.getElementById("trainer-root");
const topicId = root.dataset.topicId;
const topic = getTopic(topicId);
const topicProblems = getProblemsByTopic(topicId);

const diffClass = { easy: "diff-easy", medium: "diff-medium", hard: "diff-hard" };

let mode = "practice";
let filter = "all";
let currentIndex = 0;
let progress = loadProgress();
let quizProblems = [];
let quizStartedAt = null;
let quizFinishedAt = null;
let quizResults = {};
let quizMistakes = [];
let taskState = {};

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getFiltered() {
  return filter === "all" ? topicProblems : topicProblems.filter((p) => p.difficulty === filter);
}

function getMistakeProblems() {
  return topicProblems.filter((p) => {
    const t = progress.tasks[p.id];
    return t && t.attempts > t.correct;
  });
}

function getActiveProblems() {
  if (mode === "quiz") return quizProblems;
  if (mode === "mistakes") return getMistakeProblems();
  return getFiltered();
}

function resetTaskState(problemId) {
  taskState[problemId] = {
    mode: "two",
    x1: "",
    x2: "",
    result: null,
    hintCount: 0,
    wrongAttempts: 0,
    showAnswer: false,
    shake: false,
  };
}

function getTaskState(problemId) {
  if (!taskState[problemId]) resetTaskState(problemId);
  return taskState[problemId];
}

function elapsedSeconds() {
  if (!quizStartedAt) return 0;
  const end = quizFinishedAt ?? Date.now();
  return Math.max(0, Math.round((end - quizStartedAt) / 1000));
}

function render() {
  if (!topic) {
    root.innerHTML = "<p>Тема не найдена.</p>";
    return;
  }

  markLastTopic(topicId, "trainer");

  if (topicProblems.length === 0) {
    root.innerHTML = `
      ${renderBreadcrumbs(topicId, "trainer")}
      <h1 class="page-title">Тренажёр</h1>
      <p class="page-subtitle">Задачи для темы «${topic.title}» скоро появятся.</p>
    `;
    return;
  }

  const active = getActiveProblems();
  const current = active[currentIndex];
  const mistakeCount = getMistakeProblems().length;
  const solvedCount = active.filter((p) => progress.tasks[p.id]?.solved).length;
  const quizAnswered = Object.keys(quizResults).length;
  const quizCorrect = Object.values(quizResults).filter(Boolean).length;

  root.innerHTML = `
    ${renderBreadcrumbs(topicId, "trainer")}
    <div class="mb-6">
      <h1 class="page-title">Тренажёр</h1>
      <p class="page-subtitle">Тема: ${topic.title}</p>
    </div>
    <div class="mb-6" id="trainer-progress">${renderProgressPanel({ compact: true, topicId })}</div>
    <div class="card card-pad mb-6">
      <div class="flex-between mb-5">
        <div>
          <p class="text-sm font-semibold" style="margin:0">Режим</p>
          <div class="flex-row mt-4" style="margin-top:0.5rem">
            <button type="button" class="pill ${mode === "practice" ? "pill-active" : "pill-inactive"}" data-mode="practice">Практика</button>
            <button type="button" class="pill ${mode === "quiz" ? "pill-active" : "pill-inactive"}" data-mode="quiz">Контрольная 10</button>
            <button type="button" class="pill ${mode === "mistakes" ? "pill-active" : "pill-inactive"}" data-mode="mistakes" ${mistakeCount === 0 ? "disabled" : ""}>Ошибки (${mistakeCount})</button>
          </div>
        </div>
        <div class="text-sm text-muted" style="text-align:right">
          <p class="font-semibold" style="margin:0;color:var(--foreground)">
            ${mode === "quiz" ? `${quizAnswered} / ${quizProblems.length} отвечено` : `${solvedCount} / ${active.length} решено`}
          </p>
          ${mode === "quiz" ? `<p style="margin:0.25rem 0 0">Время: ${formatTime(elapsedSeconds())}</p>` : ""}
        </div>
      </div>
      ${
        mode !== "quiz"
          ? `<div>
          <p class="text-sm font-semibold" style="margin:0">Уровень сложности</p>
          <div class="flex-row mt-4" style="margin-top:0.5rem">
            ${["all", "easy", "medium", "hard"]
              .map(
                (key) =>
                  `<button type="button" class="pill ${filter === key ? "pill-active" : "pill-inactive"}" data-filter="${key}">${difficultyLabels[key]}</button>`,
              )
              .join("")}
          </div>
        </div>`
          : ""
      }
      <div class="mt-5">
        <div class="flex-between text-sm mb-2">
          <span class="font-semibold">Задачи</span>
          <span class="text-muted">${active.length ? currentIndex + 1 : 0} / ${active.length}</span>
        </div>
        <div class="stepper" role="tablist" aria-label="Навигация по задачам">
          ${active
            .map((task, i) => {
              const solved = progress.tasks[task.id]?.solved;
              const cls =
                i === currentIndex
                  ? "stepper-btn-current"
                  : solved
                    ? "stepper-btn-solved"
                    : "";
              return `<button type="button" class="stepper-btn ${cls}" data-step="${i}" role="tab" aria-selected="${i === currentIndex}">${solved && i !== currentIndex ? "✓" : i + 1}</button>`;
            })
            .join("")}
        </div>
      </div>
    </div>
    ${quizFinishedAt !== null ? renderQuizSummary(quizCorrect, quizProblems.length) : ""}
    ${current ? renderTask(current, currentIndex, active.length) : "<p class='text-muted'>Нет задач в этом режиме.</p>"}
  `;

  bindEvents(active);
  renderMathInContainer(root);

  if (mode === "quiz" && quizFinishedAt === null) {
    requestAnimationFrame(tickTimer);
  }
}

function renderQuizSummary(correct, total) {
  const mistakeNums = quizMistakes
    .map((id) => quizProblems.findIndex((p) => p.id === id) + 1)
    .filter((n) => n > 0);
  return `
    <section class="card card-pad mb-6">
      <p class="text-sm font-semibold text-primary" style="margin:0">Итог контрольной</p>
      <h2 class="font-bold" style="font-size:1.5rem;margin:0.25rem 0 0">${correct} из ${total} верно</h2>
      <p class="text-sm text-muted">Время: ${formatTime(elapsedSeconds())}</p>
      ${mistakeNums.length ? `<p class="text-sm text-muted mt-4">Ошибки в задачах: ${mistakeNums.join(", ")}</p>` : ""}
      <div class="flex-row mt-4">
        <button type="button" class="btn-primary" data-quiz-new>Новая контрольная</button>
        <button type="button" class="btn-secondary" data-quiz-repeat ${quizMistakes.length === 0 ? "disabled" : ""}>Повторить ошибки</button>
      </div>
    </section>
  `;
}

function renderTask(problem, index, total) {
  const st = getTaskState(problem.id);
  const solved = progress.tasks[problem.id]?.solved;
  const locked = st.result?.correct === true;
  const hints = getHintSteps(problem);

  const hintHtml =
    st.hintCount > 0
      ? `<div class="hint-box">
        <h4 class="text-sm font-bold text-primary" style="margin:0 0 0.75rem">💡 Подсказка — шаг ${st.hintCount} из ${hints.length}</h4>
        ${hints
          .slice(0, st.hintCount)
          .map(
            (step) =>
              `<div class="text-sm">${step.text ? `<p>${step.text}</p>` : ""}${step.latex ? `<div data-latex="${esc(step.latex)}" data-display></div>` : ""}</div>`,
          )
          .join("")}
      </div>`
      : "";

  const resultHtml = st.result
    ? `<div class="${st.result.correct ? "result-ok" : "result-bad"}" role="status">
        <p class="font-semibold" style="margin:0">${st.result.message}</p>
        ${!st.result.correct && st.showAnswer ? `<p class="text-sm mt-4">Правильный ответ: ${formatAnswer(problem.answer)}</p>` : ""}
      </div>`
    : "";

  return `
    <article class="card" id="task-card">
      <div class="trainer-header flex-between">
        <div class="flex-row gap-3">
          <span class="task-num">${index + 1}</span>
          <div>
            <p class="text-sm text-muted" style="margin:0">Задача ${index + 1} из ${total}</p>
            <span class="diff-badge ${diffClass[problem.difficulty]}">${difficultyLabels[problem.difficulty]}</span>
          </div>
        </div>
        ${solved ? '<span class="badge" style="background:#d1fae5;color:#047857;font-weight:600">✓ Решено ранее</span>' : ""}
      </div>
      <div class="card-pad">
        <div class="equation-display">
          <div data-latex="${esc(getDisplayLatex(problem.equationLatex))}" data-display></div>
        </div>
        <form class="mt-6" data-answer-form>
          <p class="text-sm font-semibold mb-2">Сколько корней?</p>
          <div class="mode-toggle mb-4">
            ${[
              ["two", "Два корня"],
              ["one", "Один корень"],
              ["none", "Нет корней"],
            ]
              .map(
                ([id, label]) =>
                  `<button type="button" data-answer-mode="${id}" class="${st.mode === id ? "active" : ""}" ${locked ? "disabled" : ""}>${label}</button>`,
              )
              .join("")}
          </div>
          ${
            st.mode !== "none"
              ? `<div class="flex-row gap-3">
              <label><span class="text-sm font-semibold">${st.mode === "one" ? "x" : "x₁"}</span><br/>
                <input class="input-field ${st.shake ? "animate-shake" : ""}" id="answer-x1" type="text" inputmode="decimal" value="${esc(st.x1)}" ${locked ? "disabled" : ""} placeholder="${st.mode === "one" ? "напр. 5" : "напр. 2"}" /></label>
              ${st.mode === "two" ? `<label><span class="text-sm font-semibold">x₂</span><br/><input class="input-field" type="text" inputmode="decimal" value="${esc(st.x2)}" ${locked ? "disabled" : ""} placeholder="напр. -3" data-x2 /></label>` : ""}
            </div>`
              : '<p class="answer-none-hint">D &lt; 0 — уравнение не имеет действительных корней.</p>'
          }
          <p class="text-xs text-muted mt-4">Можно вводить дроби: 1/2, -1/3. Порядок корней не важен.</p>
          <button type="submit" class="btn-primary mt-4" ${locked ? "disabled" : ""}>Проверить ответ</button>
        </form>
        <div class="flex-row mt-4">
          <button type="button" class="btn-secondary" data-hint ${st.hintCount >= hints.length ? "disabled" : ""}>
            ${st.hintCount === 0 ? "💡 Подсказка" : st.hintCount >= hints.length ? "Все подсказки показаны" : `💡 Ещё подсказка (${st.hintCount}/${hints.length})`}
          </button>
          ${st.wrongAttempts >= 2 && !locked ? '<button type="button" class="btn-secondary" data-show-answer>Показать ответ</button>' : ""}
        </div>
        ${hintHtml}
        ${resultHtml}
        <div class="flex-row mt-6">
          ${index > 0 ? '<button type="button" class="btn-secondary" data-prev>← Предыдущая</button>' : ""}
          ${locked && index < total - 1 ? '<button type="button" class="btn-primary" data-next>Следующая задача →</button>' : ""}
          ${!locked && index < total - 1 ? '<button type="button" class="btn-secondary" data-skip>Пропустить →</button>' : ""}
        </div>
      </div>
    </article>
  `;
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function bindEvents(active) {
  root.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      mode = btn.dataset.mode;
      if (mode === "quiz") startQuiz();
      else if (mode === "mistakes") {
        quizFinishedAt = null;
        currentIndex = 0;
        render();
      } else {
        quizFinishedAt = null;
        render();
      }
    });
  });

  root.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      currentIndex = 0;
      render();
    });
  });

  root.querySelectorAll("[data-step]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentIndex = Number(btn.dataset.step);
      render();
    });
  });

  root.querySelector("[data-quiz-new]")?.addEventListener("click", startQuiz);
  root.querySelector("[data-quiz-repeat]")?.addEventListener("click", repeatQuizMistakes);

  const problem = active[currentIndex];
  if (!problem) return;

  const st = getTaskState(problem.id);

  root.querySelectorAll("[data-answer-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      st.mode = btn.dataset.answerMode;
      if (st.mode === "none") {
        st.x1 = "";
        st.x2 = "";
      } else if (st.mode === "one") st.x2 = "";
      render();
    });
  });

  const x1 = root.querySelector("#answer-x1");
  const x2 = root.querySelector("[data-x2]");
  x1?.addEventListener("input", (e) => {
    st.x1 = e.target.value;
  });
  x2?.addEventListener("input", (e) => {
    st.x2 = e.target.value;
  });

  root.querySelector("[data-answer-form]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const validation = validateAnswer(problem, { mode: st.mode, x1: st.x1, x2: st.x2 });
    st.result = validation;
    progress = recordAttempt(problem.id, validation.correct);
    if (mode === "quiz" && quizResults[problem.id] === undefined) {
      quizResults[problem.id] = validation.correct;
      if (!validation.correct && !quizMistakes.includes(problem.id)) quizMistakes.push(problem.id);
      if (Object.keys(quizResults).length >= quizProblems.length) quizFinishedAt = Date.now();
    }
    if (!validation.correct) {
      st.wrongAttempts += 1;
      st.shake = true;
      setTimeout(() => {
        st.shake = false;
      }, 400);
      x1?.focus();
    }
    render();
  });

  root.querySelector("[data-hint]")?.addEventListener("click", () => {
    const hints = getHintSteps(problem);
    st.hintCount = Math.min(st.hintCount + 1, hints.length);
    render();
  });

  root.querySelector("[data-show-answer]")?.addEventListener("click", () => {
    st.showAnswer = true;
    render();
  });

  root.querySelector("[data-prev]")?.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    render();
  });
  root.querySelector("[data-next]")?.addEventListener("click", () => {
    currentIndex = Math.min(active.length - 1, currentIndex + 1);
    render();
  });
  root.querySelector("[data-skip]")?.addEventListener("click", () => {
    currentIndex = Math.min(active.length - 1, currentIndex + 1);
    render();
  });
}

function startQuiz() {
  const pool = getFiltered().length > 0 ? getFiltered() : topicProblems;
  quizProblems = shuffle(pool).slice(0, 10);
  quizResults = {};
  quizMistakes = [];
  quizStartedAt = Date.now();
  quizFinishedAt = null;
  currentIndex = 0;
  mode = "quiz";
  render();
}

function repeatQuizMistakes() {
  quizProblems = quizMistakes
    .map((id) => topicProblems.find((p) => p.id === id))
    .filter(Boolean);
  quizResults = {};
  quizMistakes = [];
  quizStartedAt = Date.now();
  quizFinishedAt = null;
  currentIndex = 0;
  mode = "quiz";
  render();
}

function tickTimer() {
  if (mode === "quiz" && quizFinishedAt === null) {
    const el = root.querySelector(".text-muted p:last-child");
    if (el) el.textContent = `Время: ${formatTime(elapsedSeconds())}`;
    setTimeout(tickTimer, 1000);
  }
}

window.addEventListener("toha-progress", () => {
  progress = loadProgress();
  const slot = document.getElementById("trainer-progress");
  if (slot) slot.innerHTML = renderProgressPanel({ compact: true, topicId });
});

if (topicProblems.length) {
  topicProblems.forEach((p) => resetTaskState(p.id));
}
render();
