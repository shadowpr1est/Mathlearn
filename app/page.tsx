import { ContinueLearning } from "@/components/ContinueLearning";
import { ProgressPanel } from "@/components/ProgressPanel";
import { TopicCard } from "@/components/TopicCard";
import { getProblemsByTopic } from "@/lib/problems";
import { topics } from "@/lib/topics";

export default function HomePage() {
  const sortedTopics = [...topics].sort((a, b) => a.order - b.order);
  const readyTopics = sortedTopics.filter((t) => getProblemsByTopic(t.id).length > 0);
  const upcomingTopics = sortedTopics.filter((t) => getProblemsByTopic(t.id).length === 0);

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
          Математика · 9 класс
        </p>
        <h1 className="page-title text-4xl sm:text-5xl">Математика</h1>
        <p className="page-subtitle mt-4 text-lg">
          Выберите тему, изучите теорию, посмотрите примеры и закрепите навык в тренажёре — в
          удобном порядке, шаг за шагом.
        </p>
      </div>

      <ContinueLearning />

      <div className="mb-10">
        <ProgressPanel />
      </div>

      <h2 className="mb-4 text-lg font-bold">Темы для изучения</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {readyTopics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>

      {upcomingTopics.length > 0 && (
        <>
          <h2 className="mb-4 mt-10 text-lg font-bold text-[var(--muted)]">Скоро</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {upcomingTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} comingSoon />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
