import { Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "cyrillic-ext"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Математика — теория, примеры, тренажёр",
  description:
    "Образовательный сайт для 9 класса: теория, разобранные примеры и интерактивный тренажёр по математике.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${jakarta.className} min-h-screen antialiased`}>
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
