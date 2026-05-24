"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isTopics = pathname.startsWith("/topics");
  const isTheory = pathname.startsWith("/theory");
  const isExamples = pathname.startsWith("/examples");
  const isTrainer = pathname.startsWith("/trainer");

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-[var(--foreground)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-sm text-white">
            x²
          </span>
          Квадратные уравнения
        </Link>
        <nav className="flex flex-wrap gap-1">
          <Link
            href="/"
            className={`nav-link ${isHome ? "nav-link-active" : "nav-link-inactive"}`}
          >
            <span className="mr-1" aria-hidden>
              🏠
            </span>
            Темы
          </Link>
          <Link
            href="/theory"
            className={`nav-link ${isTheory ? "nav-link-active" : "nav-link-inactive"}`}
          >
            Теория
          </Link>
          <Link
            href="/examples"
            className={`nav-link ${isExamples ? "nav-link-active" : "nav-link-inactive"}`}
          >
            Примеры
          </Link>
          <Link
            href="/trainer"
            className={`nav-link ${isTrainer ? "nav-link-active" : "nav-link-inactive"}`}
          >
            Тренажёр
          </Link>
          {!isHome && isTopics && (
            <span className="nav-link nav-link-inactive cursor-default opacity-70">
              <span className="mr-1" aria-hidden>
                📚
              </span>
              Изучение темы
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
