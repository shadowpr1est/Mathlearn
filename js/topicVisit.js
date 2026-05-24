

function visitKey(topicId, sectionSection){
  return `toha-visited-${topicId}-${section}`;
}

export function markTopicSectionVisited(topicId, sectionSection){
  if (typeof window === "undefined") return;
  localStorage.setItem(visitKey(topicId, section), "1");
  window.dispatchEvent(new Event("toha-progress"));
}

export function hasVisitedTopicSection(topicId, sectionSection){
  if (typeof window === "undefined") return false;
  return localStorage.getItem(visitKey(topicId, section)) === "1";
}
