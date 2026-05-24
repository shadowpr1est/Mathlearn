import Link from "next/link";
import type { Topic } from "@/lib/topics";

const sections = [
  { href: "theory", label: "Теория", icon: "📖", description: "Формулы и правила" },
  { href: "examples", label: "Примеры", icon: "✏️", description: "Разобранные задачи" },
  { href: "trainer", label: "Тренажёр", icon: "🎯", description: "Практика с проверкой" },
] as const;

export function TopicSectionLinks({ topic }: { topic: Topic }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {sections.map((section) => (
        <Link
          key={section.href}
          href={`/topics/${topic.id}/${section.href}`}
          className="card flex flex-col p-5 transition-transform hover:-translate-y-1 hover:shadow-md"
        >
          <span className="text-2xl" aria-hidden>
            {section.icon}
          </span>
          <h2 className="mt-3 text-lg font-bold text-[var(--foreground)]">{section.label}</h2>
          <p className="mt-1 flex-1 text-sm text-[var(--muted)]">{section.description}</p>
          <span className="mt-4 text-sm font-semibold text-[var(--primary)]">Открыть →</span>
        </Link>
      ))}
    </div>
  );
}
