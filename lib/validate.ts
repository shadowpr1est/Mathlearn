import type { Problem, ProblemAnswer, UserAnswer, ValidationResult } from "./types";

const EPSILON = 1e-4;

function parseNumber(value: string): number | null {
  const trimmed = value.trim().replace(",", ".");
  if (trimmed === "") return null;

  const fractionMatch = trimmed.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (fractionMatch) {
    const num = Number(fractionMatch[1]) / Number(fractionMatch[2]);
    return Number.isFinite(num) ? num : null;
  }

  const num = Number(trimmed);
  return Number.isFinite(num) ? num : null;
}

function nearlyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < EPSILON;
}

function matchRoots(userX1: number | null, userX2: number | null, answer: ProblemAnswer): boolean {
  if (answer.type === "none") return false;

  if (answer.type === "one") {
    const root = answer.x1 ?? 0;
    const values = [userX1, userX2].filter((v): v is number => v !== null);
    if (values.length === 0) return false;
    return values.some((v) => nearlyEqual(v, root));
  }

  const { x1, x2 } = answer;
  if (x1 === undefined || x2 === undefined) return false;

  const values = [userX1, userX2].filter((v): v is number => v !== null);
  if (values.length < 2) return false;

  return (
    (nearlyEqual(values[0], x1) && nearlyEqual(values[1], x2)) ||
    (nearlyEqual(values[0], x2) && nearlyEqual(values[1], x1))
  );
}

function isEmpty(user: UserAnswer): boolean {
  if (user.mode === "none") return false;
  if (user.mode === "one") return user.x1.trim() === "";
  return user.x1.trim() === "" && user.x2.trim() === "";
}

export function validateAnswer(problem: Problem, user: UserAnswer): ValidationResult {
  if (isEmpty(user)) {
    return { correct: false, message: "Введите ответ перед проверкой." };
  }

  const userX1 = parseNumber(user.x1);
  const userX2 = parseNumber(user.x2);

  if (user.mode === "none") {
    if (problem.answer.type === "none") {
      return { correct: true, message: "Верно! Действительных корней нет." };
    }
    return { correct: false, message: "У этого уравнения есть действительные корни." };
  }

  if (problem.answer.type === "none") {
    return { correct: false, message: "Неверно. D < 0 — действительных корней нет." };
  }

  if (user.mode === "one") {
    if (userX1 === null) {
      return { correct: false, message: "Введите корректное число (можно дробь: -1/3)." };
    }
    if (problem.answer.type === "one") {
      return nearlyEqual(userX1, problem.answer.x1 ?? 0)
        ? { correct: true, message: "Верно! Отличная работа." }
        : { correct: false, message: "Неверно. Попробуйте ещё раз или откройте подсказку." };
    }
  }

  if (userX1 === null || userX2 === null) {
    return { correct: false, message: "Введите корректные числа (можно дроби: 1/2, -1/3)." };
  }

  if (matchRoots(userX1, userX2, problem.answer)) {
    return { correct: true, message: "Верно! Отличная работа." };
  }

  return { correct: false, message: "Неверно. Попробуйте ещё раз или откройте подсказку." };
}

function formatNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  if (nearlyEqual(n, 0.5)) return "1/2";
  if (nearlyEqual(n, -0.5)) return "-1/2";
  if (nearlyEqual(n, -1 / 3)) return "-1/3";
  if (nearlyEqual(n, 1 / 3)) return "1/3";
  if (nearlyEqual(n, -2.5)) return "-2.5";
  return String(Math.round(n * 1000) / 1000);
}

export function formatAnswer(answer: ProblemAnswer): string {
  if (answer.type === "none") return "Действительных корней нет";
  if (answer.type === "one") return `x = ${formatNum(answer.x1 ?? 0)}`;
  return `x₁ = ${formatNum(answer.x1!)}, x₂ = ${formatNum(answer.x2!)}`;
}

export function getDiscriminant(a: number, b: number, c: number): number {
  return b * b - 4 * a * c;
}
