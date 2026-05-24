"use client";

import { useEffect } from "react";
import type { TopicId } from "@/lib/types";

const LAST_TOPIC_KEY = "toha-last-topic";

export function RememberTopic({ topicId }: { topicId: TopicId }) {
  useEffect(() => {
    localStorage.setItem(LAST_TOPIC_KEY, topicId);
  }, [topicId]);

  return null;
}
