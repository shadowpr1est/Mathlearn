import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const build = spawnSync(process.execPath, ["scripts/build.mjs"], { cwd: root, stdio: "inherit" });
if (build.status !== 0) process.exit(build.status ?? 1);

const dist = (path) => import(`file://${join(root, "dist", "js", path).replace(/\\/g, "/")}`);

const { validateAnswer, getDiscriminant } = await dist("validate.js");
const { getDisplayLatex, verifyCoefficients } = await dist("equation.js");
const { problems } = await dist("problems.js");
const { getHintSteps } = await dist("hints.js");
const { getTheoryForTopic } = await dist("theory.js");
const { topics } = await dist("topics.js");

let failed = 0;

function assert(name, condition) {
  if (!condition) {
    console.error(`FAIL: ${name}`);
    failed += 1;
  } else {
    console.log(`ok: ${name}`);
  }
}

const b1 = problems.find((p) => p.id === "b1");
assert("validate correct two roots", validateAnswer(b1, { mode: "two", x1: "3", x2: "2" }).correct);
assert("validate wrong roots", !validateAnswer(b1, { mode: "two", x1: "1", x2: "2" }).correct);
assert("validate order independent", validateAnswer(b1, { mode: "two", x1: "2", x2: "3" }).correct);

const h1 = problems.find((p) => p.id === "h1");
assert("validate none", validateAnswer(h1, { mode: "none", x1: "", x2: "" }).correct);

assert("discriminant", getDiscriminant(1, 4, 7) < 0);
assert("display latex", getDisplayLatex("x^2-1").includes("= 0"));
assert("hints steps", getHintSteps(b1).length >= 3);
assert("theory sections", getTheoryForTopic("basics", topics[0].theorySectionIds).length === 2);
assert("coefficients", verifyCoefficients(b1.a, b1.b, b1.c, b1.answer));

if (failed > 0) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}

console.log("\nAll smoke checks passed.");
