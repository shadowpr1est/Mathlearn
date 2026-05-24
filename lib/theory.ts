import type { TheorySection } from "./types";

export const theorySections: TheorySection[] = [
  {
    id: "general",
    topicId: "basics",
    title: "Общий вид квадратного уравнения",
    content: [
      {
        type: "text",
        text: "Квадратным называют уравнение вида ax² + bx + c = 0, где a, b, c — действительные числа и a ≠ 0.",
      },
      { type: "formula", latex: "ax^2 + bx + c = 0, \\quad a \\neq 0", display: true },
      {
        type: "text",
        text: "Число a называют старшим коэффициентом, b — коэффициентом при x, c — свободным членом.",
      },
    ],
  },
  {
    id: "methods",
    topicId: "basics",
    title: "Какой метод выбрать",
    content: [
      {
        type: "list",
        items: [
          "Неполное уравнение (b = 0 или c = 0) — разложение на множители или изолирование x²",
          "Целые корни, a = 1 — теорема Виета",
          "Любое полное уравнение — дискриминант и формула корней",
          "Уравнение не в стандартном виде — сначала приведите к ax² + bx + c = 0",
        ],
      },
    ],
  },
  {
    id: "incomplete",
    topicId: "incomplete",
    title: "Неполные квадратные уравнения",
    content: [
      {
        type: "text",
        text: "Если хотя бы один из коэффициентов b или c равен нулю, уравнение называют неполным.",
      },
      { type: "formula", latex: "ax^2 + bx = 0", display: true },
      {
        type: "text",
        text: "Решение: вынесем x за скобки: x(ax + b) = 0. Отсюда x = 0 или x = −b/a.",
      },
      { type: "formula", latex: "ax^2 + c = 0", display: true },
      {
        type: "text",
        text: "Решение: ax² = −c, x² = −c/a. Корни существуют, если −c/a ≥ 0.",
      },
      { type: "formula", latex: "ax^2 = 0", display: true },
      { type: "text", text: "Единственный корень: x = 0." },
    ],
  },
  {
    id: "discriminant",
    topicId: "discriminant",
    title: "Дискриминант",
    content: [
      {
        type: "text",
        text: "Для полного квадратного уравнения вычисляют дискриминант D:",
      },
      { type: "formula", latex: "D = b^2 - 4ac", display: true },
      {
        type: "list",
        items: [
          "D > 0 — два различных действительных корня",
          "D = 0 — один корень (два совпадающих корня)",
          "D < 0 — действительных корней нет",
        ],
      },
    ],
  },
  {
    id: "formula",
    topicId: "discriminant",
    title: "Формула корней",
    content: [
      {
        type: "text",
        text: "Если D ≥ 0, корни находят по формуле:",
      },
      {
        type: "formula",
        latex: "x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}",
        display: true,
      },
      {
        type: "text",
        text: "При D = 0 формула даёт один корень: x = −b/(2a).",
      },
    ],
  },
  {
    id: "vieta",
    topicId: "vieta",
    title: "Теорема Виета",
    content: [
      {
        type: "text",
        text: "Если x₁ и x₂ — корни приведённого уравнения x² + px + q = 0, то:",
      },
      { type: "formula", latex: "x_1 + x_2 = -p", display: true },
      { type: "formula", latex: "x_1 \\cdot x_2 = q", display: true },
      {
        type: "text",
        text: "Для общего вида ax² + bx + c = 0 (при a ≠ 0):",
      },
      { type: "formula", latex: "x_1 + x_2 = -\\frac{b}{a}", display: true },
      { type: "formula", latex: "x_1 \\cdot x_2 = \\frac{c}{a}", display: true },
      {
        type: "text",
        text: "Теорема Виета удобна, когда корни целые и их легко подобрать.",
      },
    ],
  },
  {
    id: "reduction",
    topicId: "reduction",
    title: "Приведение к стандартному виду",
    content: [
      {
        type: "text",
        text: "Иногда уравнение дано не в виде ax² + bx + c = 0. Сначала перенесите все слагаемые в одну часть.",
      },
      { type: "formula", latex: "2x^2 = 8x - 6 \\quad \\Rightarrow \\quad 2x^2 - 8x + 6 = 0", display: true },
      {
        type: "text",
        text: "Если все коэффициенты делятся на одно число, упростите уравнение — так легче считать D.",
      },
      { type: "formula", latex: "2x^2 - 8x + 6 = 0 \\quad \\Rightarrow \\quad x^2 - 4x + 3 = 0", display: true },
      {
        type: "text",
        text: "После приведения решайте дискриминантом, через Виета или разложением — в зависимости от вида уравнения.",
      },
    ],
  },
  {
    id: "derivative-meaning",
    topicId: "derivatives",
    title: "Что показывает производная",
    content: [
      {
        type: "text",
        text: "Производная показывает, как быстро меняется функция. Геометрически это угловой коэффициент касательной к графику.",
      },
      { type: "formula", latex: "f'(x_0)=\\lim_{h\\to 0}\\frac{f(x_0+h)-f(x_0)}{h}", display: true },
      {
        type: "text",
        text: "Если производная положительна, функция возрастает; если отрицательна — убывает.",
      },
    ],
  },
  {
    id: "derivative-rules",
    topicId: "derivatives",
    title: "Базовые правила",
    content: [
      {
        type: "list",
        items: [
          "Константа: (c)' = 0",
          "Степень: (xⁿ)' = n·xⁿ⁻¹",
          "Сумма: (f + g)' = f' + g'",
          "Коэффициент можно вынести: (c·f)' = c·f'",
        ],
      },
      { type: "formula", latex: "(3x^2-5x+1)'=6x-5", display: true },
    ],
  },
  {
    id: "integral-meaning",
    topicId: "integrals",
    title: "Первообразная и интеграл",
    content: [
      {
        type: "text",
        text: "Интегрирование — действие, обратное нахождению производной. Если F'(x)=f(x), то F называют первообразной функции f.",
      },
      { type: "formula", latex: "\\int f(x)\\,dx = F(x)+C", display: true },
      {
        type: "text",
        text: "Постоянная C появляется потому, что производная любой константы равна нулю.",
      },
    ],
  },
  {
    id: "integral-rules",
    topicId: "integrals",
    title: "Первые формулы",
    content: [
      {
        type: "list",
        items: [
          "∫xⁿ dx = xⁿ⁺¹/(n+1) + C, если n ≠ −1",
          "∫c dx = cx + C",
          "∫(f + g) dx = ∫f dx + ∫g dx",
          "Постоянный множитель можно вынести за знак интеграла",
        ],
      },
      { type: "formula", latex: "\\int (2x+3)\\,dx=x^2+3x+C", display: true },
    ],
  },
  {
    id: "limit-meaning",
    topicId: "limits",
    title: "Идея предела",
    content: [
      {
        type: "text",
        text: "Предел описывает, к какому значению стремится функция, когда x приближается к заданной точке или бесконечности.",
      },
      { type: "formula", latex: "\\lim_{x\\to a}f(x)=L", display: true },
      {
        type: "text",
        text: "Важно не только значение функции в точке, а её поведение рядом с этой точкой.",
      },
    ],
  },
  {
    id: "limit-techniques",
    topicId: "limits",
    title: "Первые приёмы вычисления",
    content: [
      {
        type: "list",
        items: [
          "Если функция непрерывна, можно подставить значение x",
          "Если получается 0/0, попробуйте разложить на множители и сократить",
          "Для многочленов при бесконечности сравнивают старшие степени",
        ],
      },
      { type: "formula", latex: "\\lim_{x\\to 2}\\frac{x^2-4}{x-2}=\\lim_{x\\to 2}(x+2)=4", display: true },
    ],
  },
];

export function getTheoryForTopic(topicId: string, sectionIds: string[]) {
  return sectionIds
    .map((id) => theorySections.find((s) => s.id === id && s.topicId === topicId))
    .filter((s): s is TheorySection => s !== undefined);
}
