import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RememberTopic } from "@/components/RememberTopic";
import { TopicSectionLinks } from "@/components/TopicSectionLinks";
import { getTopic, isTopicId } from "@/lib/topics";

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default async function TopicPage({ params }: PageProps) {
  const { topicId } = await params;
  if (!isTopicId(topicId)) notFound();

  const topic = getTopic(topicId);
  if (!topic) notFound();

  return (
    <div>
      <RememberTopic topicId={topicId} />
      <Breadcrumbs topicId={topicId} current="hub" />
      <div className={`mb-8 rounded-2xl bg-gradient-to-br ${topic.color} p-6 text-white sm:p-8`}>
        <span className="text-3xl" aria-hidden>
          {topic.icon}
        </span>
        <h1 className="mt-3 text-3xl font-bold">{topic.title}</h1>
        <p className="mt-2 max-w-xl text-white/90">{topic.shortDescription}</p>
      </div>

      <p className="mb-4 text-sm font-medium text-[var(--foreground)]">
        Выберите раздел для изучения:
      </p>
      <TopicSectionLinks topic={topic} />
    </div>
  );
}

export async function generateStaticParams() {
  const { topics } = await import("@/lib/topics");
  return topics.map((t) => ({ topicId: t.id }));
}
