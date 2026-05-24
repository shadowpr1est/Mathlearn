"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isTopics = pathname === "/" || pathname.startsWith("/topics");

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-bold text-[var(--foreground)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-sm text-white shadow-sm">
            ∑
          </span>
          <span>
            Математика
            <span className="mt-0.5 block text-xs font-medium text-[var(--muted)]">9 класс</span>
          </span>
        </Link>
        <nav className="flex flex-wrap gap-1" aria-label="Основное меню">
          <Link
            href="/"
            className={`nav-link ${isTopics ? "nav-link-active" : "nav-link-inactive"}`}
          >
            Темы
          </Link>
        </nav>
      </div>
    </header>
  );
}
