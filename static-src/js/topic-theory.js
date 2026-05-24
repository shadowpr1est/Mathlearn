import { getTheoryForTopic } from "./theory.js";
import { getTopic } from "./topics.js";
import { renderMathInContainer } from "./math.js";
import { markLastTopic, renderBreadcrumbs } from "./ui.js";

const root = document.getElementById("topic-theory");
const topicId = root.dataset.topicId;
const topic = getTopic(topicId);

if (!topic) {
  root.innerHTML = "<p>Тема не найдена.</p>";
} else {
  markLastTopic(topicId, "theory");
  const sections = getTheoryForTopic(topicId, topic.theorySectionIds);

  const content = sections.length
    ? sections
        .map(
          (section) => `
        <section class="mb-10">
          <h2 class="font-bold" style="font-size:1.25rem;margin:0 0 1rem">${section.title}</h2>
          <div>
            ${section.content
              .map((block) => {
                if (block.type === "text") return `<p>${block.text}</p>`;
                if (block.type === "formula")
                  return `<div data-latex="${escapeAttr(block.latex)}" data-display></div>`;
                if (block.type === "list")
                  return `<ul style="list-style:disc;padding-left:1.5rem">${block.items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
                return "";
              })
              .join("")}
          </div>
        </section>
      `,
        )
        .join("")
    : `<p class="text-muted">Материалы для этой темы готовятся.</p>`;

  root.innerHTML = `
    ${renderBreadcrumbs(topicId, "theory")}
    <h1 class="page-title">Теория</h1>
    <p class="page-subtitle mb-8">Тема: ${topic.title}</p>
    ${content}
  `;
  renderMathInContainer(root);
}

function escapeAttr(s) {
  return s.replace(/"/g, "&quot;");
}
