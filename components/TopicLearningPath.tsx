"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getProblemsByTopic } from "@/lib/problems";
import { getTopicTrainerStats, loadProgress } from "@/lib/progress";
import { hasVisitedTopicSection } from "@/lib/topicVisit";
import type { Topic } from "@/lib/topics";

const steps = [
  { section: "theory" as const, step: 1, label: "Теория", href: "theory", hint: "Изучите правила" },
  { section: "examples" as const, step: 2, label: "Примеры", href: "examples", hint: "Разбор задач" },
  { section: "trainer" as const, step: 3, label: "Тренажёр", href: "trainer", hint: "Закрепите навык" },
];

export function TopicLearningPath({ topic }: { topic: Topic }) {
  const pathname = usePathname();
  const problemCount = getProblemsByTopic(topic.id).length;
  const [visited, setVisited] = useState({ theory: false, examples: false, trainer: false });
  const [trainerDone, setTrainerDone] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setVisited({
        theory: hasVisitedTopicSection(topic.id, "theory"),
        examples: hasVisitedTopicSection(topic.id, "examples"),
        trainer: hasVisitedTopicSection(topic.id, "trainer"),
      });
      const stats = getTopicTrainerStats(loadProgress(), topic.id);
      setTrainerDone(stats.solved > 0 || stats.attempted > 0);
    };
    refresh();
    window.addEventListener("toha-progress", refresh);
    return () => window.removeEventListener("toha-progress", refresh);
  }, [topic.id, pathname]);

  const done = {
    theory: visited.theory,
    examples: visited.examples,
    trainer: trainerDone || visited.trainer,
  };

  const nextHref =
    !done.theory
      ? "theory"
      : !done.examples
        ? "examples"
        : problemCount > 0
          ? "trainer"
          : null;

  return (
    <section className="mb-8 card p-5">
      <p className="text-sm font-semibold text-[var(--primary)]">Маршрут обучения</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Рекомендуемый порядок: теория → примеры → тренажёр
      </p>
      <ol className="mt-4 space-y-2">
        {steps.map(({ section, step, label, href, hint }) => {
          const isDone = done[section];
          const isNext = nextHref === href;
          const disabled = section === "trainer" && problemCount === 0;

          return (
            <li key={section}>
              <Link
                href={disabled ? `#` : `/topics/${topic.id}/${href}`}
                aria-disabled={disabled}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  disabled
                    ? "cursor-not-allowed border-[var(--border)] opacity-50"
                    : isNext
                      ? "border-indigo-300 bg-indigo-50/80"
                      : "border-[var(--border)] hover:border-indigo-200 hover:bg-indigo-50/40"
                }`}
                onClick={disabled ? (e) => e.preventDefault() : undefined}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isDone
                      ? "bg-emerald-100 text-emerald-700"
                      : isNext
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--surface)] text-[var(--muted)]"
                  }`}
                >
                  {isDone ? "✓" : step}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-semibold text-[var(--foreground)]">{label}</span>
                  <span className="mt-0.5 block text-xs text-[var(--muted)]">
                    {disabled ? "Задачи скоро появятся" : hint}
                    {isNext && !disabled && (
                      <span className="ml-1 font-medium text-[var(--primary)]">· далее</span>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
