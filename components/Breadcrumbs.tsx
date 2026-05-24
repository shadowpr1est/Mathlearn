import Link from "next/link";
import { getTopic } from "@/lib/topics";

interface BreadcrumbsProps {
  topicId: string;
  current: "hub" | "theory" | "examples" | "trainer";
}

const currentLabels = {
  hub: "",
  theory: "Теория",
  examples: "Примеры",
  trainer: "Тренажёр",
};

export function Breadcrumbs({ topicId, current }: BreadcrumbsProps) {
  const topic = getTopic(topicId);
  if (!topic) return null;

  return (
    <nav aria-label="Навигация" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
      <Link href="/" className="hover:text-[var(--primary)]">
        Главная
      </Link>
      <span aria-hidden>/</span>
      <Link href={`/topics/${topicId}`} className="hover:text-[var(--primary)]">
        {topic.title}
      </Link>
      {current !== "hub" && (
        <>
          <span aria-hidden>/</span>
          <span className="font-medium text-[var(--foreground)]">{currentLabels[current]}</span>
        </>
      )}
    </nav>
  );
}
