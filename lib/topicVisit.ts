import type { TopicId } from "./types";

export type TopicSection = "theory" | "examples" | "trainer";

function visitKey(topicId: TopicId, section: TopicSection): string {
  return `toha-visited-${topicId}-${section}`;
}

export function markTopicSectionVisited(topicId: TopicId, section: TopicSection): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(visitKey(topicId, section), "1");
  window.dispatchEvent(new Event("toha-progress"));
}

export function hasVisitedTopicSection(topicId: TopicId, section: TopicSection): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(visitKey(topicId, section)) === "1";
}
