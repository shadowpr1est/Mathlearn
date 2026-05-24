"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTopic } from "@/lib/topics";

const LAST_TOPIC_KEY = "toha-last-topic";

export function ContinueLearning() {
  const [topicId, setTopicId] = useState<string | null>(null);

  useEffect(() => {
    setTopicId(localStorage.getItem(LAST_TOPIC_KEY));
  }, []);

  if (!topicId) return null;

  const topic = getTopic(topicId);
  if (!topic) return null;

  return (
    <section className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50/70 px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--primary)]">Продолжить обучение</p>
          <h2 className="text-lg font-bold text-[var(--foreground)]">{topic.title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/topics/${topic.id}/theory`} className="btn-secondary">
            Теория
          </Link>
          <Link href={`/topics/${topic.id}/trainer`} className="btn-primary">
            Практика
          </Link>
        </div>
      </div>
    </section>
  );
}
