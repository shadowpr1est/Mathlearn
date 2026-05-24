import Link from "next/link";
import { ProgressPanel } from "@/components/ProgressPanel";
import { getProblemsByTopic } from "@/lib/problems";
import { topics } from "@/lib/topics";

export default function TrainerOverviewPage() {
  const sortedTopics = [...topics].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h1 className="page-title">Тренажёр</h1>
      <p className="page-subtitle mb-8">
        Выберите тему для практики. Для новых разделов задачи появятся отдельным набором.
      </p>

      <ProgressPanel />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sortedTopics.map((topic) => {
          const count = getProblemsByTopic(topic.id).length;
          const disabled = count === 0;

          return (
            <Link
              key={topic.id}
              href={disabled ? `/topics/${topic.id}` : `/topics/${topic.id}/trainer`}
              className="card flex flex-col p-5 transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>
                {topic.icon}
              </span>
              <h2 className="mt-3 text-lg font-bold text-[var(--foreground)]">{topic.title}</h2>
              <p className="mt-1 flex-1 text-sm text-[var(--muted)]">
                {disabled ? "Задачи готовятся." : `${count} задач с проверкой.`}
              </p>
              <span className="mt-4 text-sm font-semibold text-[var(--primary)]">
                {disabled ? "Открыть материалы →" : "Начать практику →"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
