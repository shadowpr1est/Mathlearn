import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RememberTopic } from "@/components/RememberTopic";
import { TheorySection } from "@/components/TheorySection";
import { getTheoryForTopic } from "@/lib/theory";
import { getTopic, isTopicId } from "@/lib/topics";

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default async function TopicTheoryPage({ params }: PageProps) {
  const { topicId } = await params;
  if (!isTopicId(topicId)) notFound();

  const topic = getTopic(topicId);
  if (!topic) notFound();

  const sections = getTheoryForTopic(topicId, topic.theorySectionIds);

  return (
    <div>
      <RememberTopic topicId={topicId} section="theory" />
      <Breadcrumbs topicId={topicId} current="theory" />
      <h1 className="page-title">Теория</h1>
      <p className="page-subtitle mb-8">Тема: {topic.title}</p>

      {sections.length === 0 ? (
        <p className="text-[var(--muted)]">Материалы для этой темы готовятся.</p>
      ) : (
        <div className="card divide-y divide-[var(--border)] p-6 sm:p-8">
          {sections.map((section) => (
            <TheorySection key={section.id} section={section} />
          ))}
        </div>
      )}
    </div>
  );
}
