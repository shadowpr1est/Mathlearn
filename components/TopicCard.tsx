import Link from "next/link";
import type { Topic } from "@/lib/topics";
import { getExamplesByTopic } from "@/lib/examples";
import { getProblemsByTopic } from "@/lib/problems";
import { getTheoryForTopic } from "@/lib/theory";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const exampleCount = getExamplesByTopic(topic.id).length;
  const problemCount = getProblemsByTopic(topic.id).length;
  const theoryCount = getTheoryForTopic(topic.id, topic.theorySectionIds).length;

  return (
    <Link
      href={`/topics/${topic.id}`}
      className="group card overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={`bg-gradient-to-br ${topic.color} px-5 py-4 text-white`}>
        <span className="text-2xl" aria-hidden>
          {topic.icon}
        </span>
        <h2 className="mt-2 text-lg font-bold">{topic.title}</h2>
        <p className="mt-1 text-sm text-white/85">{topic.shortDescription}</p>
      </div>
      <div className="flex flex-wrap gap-2 px-5 py-3 text-xs text-[var(--muted)]">
        <span className="rounded-full bg-[var(--surface)] px-2.5 py-1">{theoryCount} разделов</span>
        <span className="rounded-full bg-[var(--surface)] px-2.5 py-1">{exampleCount} примеров</span>
        <span className="rounded-full bg-[var(--surface)] px-2.5 py-1">{problemCount} задач</span>
      </div>
    </Link>
  );
}
