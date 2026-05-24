import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExampleCard } from "@/components/ExampleCard";
import { RememberTopic } from "@/components/RememberTopic";
import { getExamplesByTopic } from "@/lib/examples";
import { getTopic, isTopicId } from "@/lib/topics";

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default async function TopicExamplesPage({ params }: PageProps) {
  const { topicId } = await params;
  if (!isTopicId(topicId)) notFound();

  const topic = getTopic(topicId);
  if (!topic) notFound();

  const examples = getExamplesByTopic(topicId);

  return (
    <div>
      <RememberTopic topicId={topicId} />
      <Breadcrumbs topicId={topicId} current="examples" />
      <h1 className="page-title">Примеры</h1>
      <p className="page-subtitle mb-8">Тема: {topic.title}</p>

      {examples.length === 0 ? (
        <p className="text-[var(--muted)]">Примеры для этой темы скоро появятся.</p>
      ) : (
        <div className="space-y-5">
          {examples.map((example) => (
            <ExampleCard key={example.id} example={example} />
          ))}
        </div>
      )}
    </div>
  );
}
