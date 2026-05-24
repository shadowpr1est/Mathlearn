"use client";

import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

interface MathBlockProps {
  latex: string;
  display?: boolean;
  className?: string;
}

export function MathBlock({ latex, display = false, className = "" }: MathBlockProps) {
  try {
    if (display) {
      return (
        <div className={`my-3 overflow-x-auto ${className}`}>
          <BlockMath math={latex} />
        </div>
      );
    }
    return (
      <span className={className}>
        <InlineMath math={latex} />
      </span>
    );
  } catch {
    return <span className="text-[var(--error)]">Ошибка формулы</span>;
  }
}
