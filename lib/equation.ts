/** Возвращает LaTeX для отображения без дублирования "= 0". */
export function getDisplayLatex(equationLatex: string): string {
  if (equationLatex.includes("=")) {
    return equationLatex;
  }
  return `${equationLatex} = 0`;
}

/** Проверяет, что коэффициенты a,b,c соответствуют стандартному виду ax²+bx+c=0. */
export function verifyCoefficients(
  a: number,
  b: number,
  c: number,
  answer: { type: "two" | "one" | "none"; x1?: number; x2?: number },
): boolean {
  const D = b * b - 4 * a * c;
  if (answer.type === "none") return D < 0;
  if (answer.type === "one") return Math.abs(D) < 1e-9;
  if (answer.x1 === undefined || answer.x2 === undefined) return false;
  const check = (x: number) => Math.abs(a * x * x + b * x + c) < 1e-6;
  return check(answer.x1) && check(answer.x2);
}
