import { describe, expect, it } from "vitest";
import type { Problem } from "../lib/types";
import { formatAnswer, validateAnswer } from "../lib/validate";

const baseProblem: Problem = {
  id: "test",
  topicId: "discriminant",
  difficulty: "easy",
  equationLatex: "x^2 - 5x + 6 = 0",
  a: 1,
  b: -5,
  c: 6,
  answer: { type: "two", x1: 2, x2: 3 },
  method: "discriminant",
};

describe("validateAnswer", () => {
  it("accepts two roots in any order", () => {
    expect(validateAnswer(baseProblem, { mode: "two", x1: "3", x2: "2" }).correct).toBe(true);
  });

  it("accepts fractions and comma decimals", () => {
    const problem: Problem = {
      ...baseProblem,
      answer: { type: "two", x1: 0.5, x2: -1 / 3 },
    };

    expect(validateAnswer(problem, { mode: "two", x1: "1/2", x2: "-0,3333" }).correct).toBe(
      true,
    );
  });

  it("handles equations without real roots", () => {
    const problem: Problem = {
      ...baseProblem,
      answer: { type: "none" },
    };

    expect(validateAnswer(problem, { mode: "none", x1: "", x2: "" }).correct).toBe(true);
    expect(validateAnswer(problem, { mode: "two", x1: "1", x2: "2" }).correct).toBe(false);
  });
});

describe("formatAnswer", () => {
  it("formats no-root and fractional answers", () => {
    expect(formatAnswer({ type: "none" })).toBe("Действительных корней нет");
    expect(formatAnswer({ type: "two", x1: 0.5, x2: -1 / 3 })).toBe(
      "x₁ = 1/2, x₂ = -1/3",
    );
  });
});
