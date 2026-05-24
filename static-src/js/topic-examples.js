import { getExamplesByTopic } from "./examples.js";
import { getTopic } from "./topics.js";
import { getDisplayLatex, renderMathInContainer } from "./math.js";
import { markLastTopic, renderBreadcrumbs } from "./ui.js";

const root = document.getElementById("topic-examples");
const topicId = root.dataset.topicId;
const topic = getTopic(topicId);

function renderExample(example) {
  const stepsHtml = example.steps
    .map(
      (step) =>
        `<div>${step.text ? `<p class="text-sm">${step.text}</p>` : ""}${step.latex ? `<div data-latex="${escapeAttr(step.latex)}" data-display></div>` : ""}</div>`,
    )
    .join("");

  return `
    <article class="card mb-4" data-example-id="${example.id}">
      <div class="card-pad">
        <h3 class="font-bold" style="font-size:1.125rem;margin:0">${example.title}</h3>
        <p class="mt-4"><span class="badge text-primary font-semibold">${example.method}</span></p>
        <div class="equation-display mt-4">
          <div data-latex="${escapeAttr(getDisplayLatex(example.equationLatex))}" data-display></div>
        </div>
        <button type="button" class="btn-primary mt-4" data-toggle-solution>Показать решение</button>
      </div>
      <div class="solution-panel" hidden style="border-top:1px solid var(--border);background:rgb(238 242 255 / 0.5);padding:1rem 1.25rem">
        ${stepsHtml}
        <p class="font-semibold text-primary">Ответ: <span data-latex="${escapeAttr(example.answerLatex)}"></span></p>
      </div>
    </article>
  `;
}

if (!topic) {
  root.innerHTML = "<p>Тема не найдена.</p>";
} else {
  markLastTopic(topicId, "examples");
  const examples = getExamplesByTopic(topicId);

  root.innerHTML = `
    ${renderBreadcrumbs(topicId, "examples")}
    <h1 class="page-title">Примеры</h1>
    <p class="page-subtitle mb-8">Тема: ${topic.title}</p>
    ${examples.length ? examples.map(renderExample).join("") : "<p class='text-muted'>Примеры скоро появятся.</p>"}
  `;

  root.querySelectorAll("[data-toggle-solution]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const article = btn.closest("article");
      const panel = article.querySelector(".solution-panel");
      const open = panel.hidden;
      panel.hidden = !open;
      btn.textContent = open ? "Скрыть решение" : "Показать решение";
      btn.className = open ? "btn-secondary mt-4" : "btn-primary mt-4";
      if (open) renderMathInContainer(panel);
    });
  });

  renderMathInContainer(root);
}

function escapeAttr(s) {
  return s.replace(/"/g, "&quot;");
}
