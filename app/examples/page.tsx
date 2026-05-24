import Link from "next/link";
import { ExampleCard } from "@/components/ExampleCard";
import { getExamplesByTopic } from "@/lib/examples";
import { topics } from "@/lib/topics";

export default function ExamplesOverviewPage() {
  const sortedTopics = [...topics].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h1 className="page-title">Примеры</h1>
      <p className="page-subtitle mb-8">
        Разобранные задачи и короткие образцы решений по всем открытым темам.
      </p>

      <div className="space-y-8">
        {sortedTopics.map((topic) => {
          const examples = getExamplesByTopic(topic.id);

          return (
            <section key={topic.id}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[var(--primary)]">{topic.title}</p>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">
                    {examples.length} примеров
                  </h2>
                </div>
                <Link href={`/topics/${topic.id}/examples`} className="btn-secondary">
                  Все примеры темы
                </Link>
              </div>

              {examples.length === 0 ? (
                <p className="card p-5 text-sm text-[var(--muted)]">
                  Примеры для этой темы скоро появятся.
                </p>
              ) : (
                <div className="grid gap-4">
                  {examples.map((example) => (
                    <ExampleCard key={example.id} example={example} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
