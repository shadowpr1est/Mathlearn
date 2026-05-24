import { describe, expect, it } from "vitest";
import { getDisplayLatex, verifyCoefficients } from "../lib/equation";

describe("getDisplayLatex", () => {
  it("does not duplicate an existing equality", () => {
    expect(getDisplayLatex("x^2 = 5x - 4")).toBe("x^2 = 5x - 4");
    expect(getDisplayLatex("x^2 - 5x + 4")).toBe("x^2 - 5x + 4 = 0");
  });
});

describe("verifyCoefficients", () => {
  it("checks roots against coefficients", () => {
    expect(verifyCoefficients(1, -5, 6, { type: "two", x1: 2, x2: 3 })).toBe(true);
    expect(verifyCoefficients(1, 0, 1, { type: "none" })).toBe(true);
    expect(verifyCoefficients(1, -4, 4, { type: "one", x1: 2 })).toBe(true);
  });
});
