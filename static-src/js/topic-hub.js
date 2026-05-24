import { getTopic } from "./topics.js";
import { renderMathInContainer } from "./math.js";
import {
  markLastTopic,
  renderBreadcrumbs,
  renderLearningPath,
  renderSectionLinks,
} from "./ui.js";

const root = document.getElementById("topic-hub");
const topicId = root.dataset.topicId;
const topic = getTopic(topicId);

if (!topic) {
  root.innerHTML = "<p>Тема не найдена.</p>";
} else {
  markLastTopic(topicId);
  const colorClass = topic.color.split(" ")[0];
  root.innerHTML = `
    ${renderBreadcrumbs(topicId, "hub")}
    <div class="topic-hero ${colorClass}">
      <span style="font-size:1.875rem">${topic.icon}</span>
      <h1>${topic.title}</h1>
      <p style="margin:0.5rem 0 0;opacity:0.9;max-width:36rem">${topic.shortDescription}</p>
    </div>
    ${renderLearningPath(topic)}
    <p class="text-sm font-semibold mb-4">Все разделы темы:</p>
    ${renderSectionLinks(topic)}
  `;
  renderMathInContainer(root);
}
