function visitKey(topicId, section) {
  return `toha-visited-${topicId}-${section}`;
}

export function markTopicSectionVisited(topicId, section) {
  if (typeof window === "undefined") return;
  localStorage.setItem(visitKey(topicId, section), "1");
  window.dispatchEvent(new Event("toha-progress"));
}

export function hasVisitedTopicSection(topicId, section) {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(visitKey(topicId, section)) === "1";
}
