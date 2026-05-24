import { MathBlock } from "./MathBlock";
import type { TheorySection as TheorySectionType } from "@/lib/types";

export function TheorySection({ section }: { section: TheorySectionType }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold text-[var(--foreground)]">{section.title}</h2>
      <div className="space-y-3 text-[var(--foreground)]">
        {section.content.map((block, i) => {
          if (block.type === "text") {
            return <p key={i}>{block.text}</p>;
          }
          if (block.type === "formula") {
            return <MathBlock key={i} latex={block.latex} display={block.display} />;
          }
          if (block.type === "list") {
            return (
              <ul key={i} className="list-disc space-y-1 pl-6">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          }
          return null;
        })}
      </div>
    </section>
  );
}
