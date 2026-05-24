"use client";

import { useEffect } from "react";
import { markTopicSectionVisited, type TopicSection } from "@/lib/topicVisit";
import type { TopicId } from "@/lib/types";

const LAST_TOPIC_KEY = "toha-last-topic";

export function RememberTopic({
  topicId,
  section,
}: {
  topicId: TopicId;
  section?: TopicSection;
}) {
  useEffect(() => {
    localStorage.setItem(LAST_TOPIC_KEY, topicId);
    if (section) markTopicSectionVisited(topicId, section);
  }, [topicId, section]);

  return null;
}
