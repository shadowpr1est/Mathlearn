import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RememberTopic } from "@/components/RememberTopic";
import { TrainerView } from "@/components/TrainerView";
import { getTopic, isTopicId } from "@/lib/topics";

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default async function TopicTrainerPage({ params }: PageProps) {
  const { topicId } = await params;
  if (!isTopicId(topicId)) notFound();

  const topic = getTopic(topicId);
  if (!topic) notFound();

  return (
    <div>
      <RememberTopic topicId={topicId} section="trainer" />
      <Breadcrumbs topicId={topicId} current="trainer" />
      <TrainerView topicId={topicId} topicTitle={topic.title} />
    </div>
  );
}
