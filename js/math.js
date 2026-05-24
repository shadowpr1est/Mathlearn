import katex from "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.mjs";

export function renderLatex(el, latex, displayMode = false) {
  katex.render(latex, el, { throwOnError: false, displayMode });
}

export function renderMathInContainer(root) {
  root.querySelectorAll("[data-latex]").forEach((el) => {
    const latex = el.getAttribute("data-latex");
    if (!latex) return;
    renderLatex(el, latex, el.hasAttribute("data-display"));
  });
}

export function getDisplayLatex(equationLatex) {
  if (equationLatex.includes("=")) return equationLatex;
  return `${equationLatex} = 0`;
}
