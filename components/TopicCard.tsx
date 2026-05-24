"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getExamplesByTopic } from "@/lib/examples";
import { getProblemsByTopic } from "@/lib/problems";
import { getTopicTrainerStats, loadProgress } from "@/lib/progress";
import { getTheoryForTopic } from "@/lib/theory";
import type { Topic } from "@/lib/topics";

interface TopicCardProps {
  topic: Topic;
  comingSoon?: boolean;
}

export function TopicCard({ topic, comingSoon = false }: TopicCardProps) {
  const exampleCount = getExamplesByTopic(topic.id).length;
  const problemCount = getProblemsByTopic(topic.id).length;
  const theoryCount = getTheoryForTopic(topic.id, topic.theorySectionIds).length;
  const [solved, setSolved] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const { solved: s } = getTopicTrainerStats(loadProgress(), topic.id);
      setSolved(s);
    };
    refresh();
    window.addEventListener("toha-progress", refresh);
    return () => window.removeEventListener("toha-progress", refresh);
  }, [topic.id]);

  const progressPct =
    problemCount > 0 ? Math.round((solved / problemCount) * 100) : 0;

  return (
    <Link
      href={`/topics/${topic.id}`}
      className={`group card overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg ${
        comingSoon ? "opacity-90" : ""
      }`}
    >
      <div className={`bg-gradient-to-br ${topic.color} px-5 py-4 text-white`}>
        <div className="flex items-start justify-between gap-2">
          <span className="text-2xl" aria-hidden>
            {topic.icon}
          </span>
          {comingSoon && (
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
              Скоро
            </span>
          )}
        </div>
        <h2 className="mt-2 text-lg font-bold">{topic.title}</h2>
        <p className="mt-1 text-sm text-white/85">{topic.shortDescription}</p>
      </div>
      <div className="px-5 py-3">
        <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
          <span className="rounded-full bg-[var(--surface)] px-2.5 py-1">
            {theoryCount} разделов
          </span>
          <span className="rounded-full bg-[var(--surface)] px-2.5 py-1">
            {exampleCount} примеров
          </span>
          <span className="rounded-full bg-[var(--surface)] px-2.5 py-1">
            {problemCount} задач
          </span>
        </div>
        {problemCount > 0 && (
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs font-medium text-[var(--muted)]">
              <span>Тренажёр</span>
              <span className="text-[var(--foreground)]">
                {solved}/{problemCount}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
