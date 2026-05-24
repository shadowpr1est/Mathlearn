import { getDiscriminant } from "./validate.js";
﻿
export function getHintSteps(problem) {
  const { a, b, c } = problem;
  const D = getDiscriminant(a, b, c);
  const steps = [
    {
      text: "Запишите коэффициенты:",
      latex: `a = ${a}, \\; b = ${b}, \\; c = ${c}`,
    },
  ];

  if (problem.method === "factoring" && c === 0) {
    steps.push(
      { text: "Уравнение неполное: вынесите x за скобки." },
      { latex: "x(ax + b) = 0", text: "" },
      { text: "Приравняйте каждый множитель к нулю." },
    );
  } else if (problem.method === "incomplete" && b === 0) {
    steps.push(
      { text: "Перенесите c вправо и разделите на a:" },
      { latex: `x^2 = ${(-c / a).toFixed(4).replace(/\\.?0+$/, "")}`, text: "" },
    );
  } else {
    steps.push({
      text: "Вычислите дискриминант:",
      latex: `D = b^2 - 4ac = ${b}^2 - 4 \\cdot ${a} \\cdot ${c} = ${D}`,
    });

    if (D < 0) {
      steps.push({ text: "D < 0 — действительных корней нет." });
      return steps;
    }

    if (D === 0) {
      steps.push(
        { text: "D = 0 — один корень." },
        { latex: `x = \\frac{-b}{2a} = \\frac{${-b}}{${2 * a}}`, text: "" },
      );
    } else {
      steps.push(
        { text: "D > 0 — два корня. Примените формулу:" },
        { latex: `x_{1,2} = \\frac{${-b} \\pm \\sqrt{${D}}}{${2 * a}}`, text: "" },
      );
    }
  }

  if (problem.answer.type === "none") {
    steps.push({ text: "Ответ: действительных корней нет." });
  } else if (problem.answer.type === "one") {
    steps.push({ latex: `x = ${problem.answer.x1}`, text: "Ответ:" });
  } else {
    steps.push({
      latex: `x_1 = ${problem.answer.x1}, \\quad x_2 = ${problem.answer.x2}`,
      text: "Ответ:",
    });
  }

  return steps;
}
