import { getProblemsByTopic } from "./problems.js";
import { renderMathInContainer } from "./math.js";
import {
  bindProgressRefresh,
  renderProgressPanel,
  renderTopicCard,
  sortedTopics,
} from "./ui.js";
import { asset } from "./layout.js";

const root = document.getElementById("home-root");
const LAST_TOPIC_KEY = "toha-last-topic";

function renderContinue() {
  const topicId = localStorage.getItem(LAST_TOPIC_KEY);
  if (!topicId) return "";

  return import("./topics.js").then(({ getTopic }) => {
    const topic = getTopic(topicId);
    if (!topic) return "";
    const base = asset("");
    return `
      <section class="continue-box">
        <div class="flex-between">
          <div>
            <p class="text-sm font-semibold text-primary" style="margin:0">Продолжить обучение</p>
            <h2 class="font-bold" style="margin:0.25rem 0 0">${topic.title}</h2>
          </div>
          <div class="flex-row">
            <a href="${base}topics/${topic.id}/theory.html" class="btn-secondary">Теория</a>
            <a href="${base}topics/${topic.id}/${getProblemsByTopic(topic.id).length ? "trainer" : "index"}.html" class="btn-primary">Практика</a>
          </div>
        </div>
      </section>
    `;
  });
}

function render() {
  const all = sortedTopics();
  const ready = all.filter((t) => getProblemsByTopic(t.id).length > 0);
  const upcoming = all.filter((t) => getProblemsByTopic(t.id).length === 0);

  const upcomingHtml =
    upcoming.length > 0
      ? `
        <h2 class="section-title mt-10 text-muted">Скоро</h2>
        <div class="grid-2">${upcoming.map((t) => renderTopicCard(t, { comingSoon: true })).join("")}</div>
      `
      : "";

  root.innerHTML = `
    <div class="mb-8">
      <p class="eyebrow">Математика · 9 класс</p>
      <h1 class="page-title page-title-lg">Математика</h1>
      <p class="page-subtitle text-lg" style="margin-top:1rem;font-size:1.125rem">
        Выберите тему, изучите теорию, посмотрите примеры и закрепите навык в тренажёре — в удобном порядке, шаг за шагом.
      </p>
    </div>
    <div id="continue-slot"><div class="continue-skeleton" aria-hidden></div></div>
    <div class="mb-10" id="progress-slot">${renderProgressPanel()}</div>
    <h2 class="section-title">Темы для изучения</h2>
    <div class="grid-2">${ready.map((t) => renderTopicCard(t)).join("")}</div>
    ${upcomingHtml}
  `;

  renderContinue().then((html) => {
    const slot = document.getElementById("continue-slot");
    if (slot) slot.innerHTML = html || "";
  });

  renderMathInContainer(root);
}

render();
bindProgressRefresh(root, render);
