import Link from "next/link";
import { TheorySection } from "@/components/TheorySection";
import { getTheoryForTopic } from "@/lib/theory";
import { topics } from "@/lib/topics";

export default function TheoryOverviewPage() {
  const sortedTopics = [...topics].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h1 className="page-title">Теория</h1>
      <p className="page-subtitle mb-8">
        Все темы собраны в одном месте: от квадратных уравнений до первых понятий анализа.
      </p>

      <div className="space-y-6">
        {sortedTopics.map((topic) => {
          const sections = getTheoryForTopic(topic.id, topic.theorySectionIds);

          return (
            <section key={topic.id} className="card p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[var(--primary)]">{topic.title}</p>
                  <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">
                    {topic.shortDescription}
                  </h2>
                </div>
                <Link href={`/topics/${topic.id}/theory`} className="btn-secondary">
                  Открыть тему
                </Link>
              </div>

              <div className="divide-y divide-[var(--border)]">
                {sections.map((section) => (
                  <TheorySection key={section.id} section={section} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
