import { ContinueLearning } from "@/components/ContinueLearning";
import { ProgressPanel } from "@/components/ProgressPanel";
import { TopicCard } from "@/components/TopicCard";
import { topics } from "@/lib/topics";

export default function HomePage() {
  const sortedTopics = [...topics].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="mb-10">
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

      <h2 className="mb-4 text-lg font-bold">Темы для изучения</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {sortedTopics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>

      <div className="mt-10">
        <ProgressPanel />
      </div>
    </div>
  );
}
