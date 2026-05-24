import { mkdirSync, readFileSync, writeFileSync, cpSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");

function stripTs(content) {
  return content
    .replace(/^import .* from .*;\r?\n/gm, "")
    .replace(/import type .* from .*;\r?\n/gm, "")
    .replace(/export interface [\s\S]*?\n\}\r?\n/gm, "")
    .replace(/export type [\s\S]*?;\r?\n/gm, "")
    .replace(/: (Problem|Example|TheorySection|TopicId|Progress|TaskProgress|HintStep|UserAnswer|ValidationResult|ProblemAnswer|Topic)(\[\])?/g, "")
    .replace(/: Record<[^>]+>/g, "")
    .replace(/(\w+): string/g, "$1")
    .replace(/\)\s*:\s*[^{]+(?=\s*\{)/g, ")")
    .replace(/\)\s*\|\s*undefined\s*(?=\s*\{)/g, ")")
    .replace(/ as Progress/g, "")
    .replace(/filter\(\(s\): s is TheorySection =>/g, "filter((s) =>")
    .replace(/from "\.\/([^"]+)"/g, 'from "./$1.js"');
}

function convertLib(name) {
  const src = readFileSync(join(root, "lib", `${name}.ts`), "utf8");
  let js = stripTs(src);
  if (name === "progress") {
    js = `import { getProblemsByTopic } from "./problems.js";\n${js}`;
  }
  if (name === "hints") {
    js = `import { getDiscriminant } from "./validate.js";\n${js}`;
  }
  mkdirSync(join(out, "js"), { recursive: true });
  writeFileSync(join(out, "js", `${name}.js`), js);
}

function prefix(depth) {
  return depth === 0 ? "" : "../".repeat(depth);
}

function shell({ title, depth, body, scripts = [] }) {
  const p = prefix(depth);
  const scriptTags = scripts.map((s) => `  <script type="module" src="${p}js/${s}"></script>`).join("\n");
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="Образовательный сайт для 9 класса: теория, примеры и тренажёр по математике." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css" />
  <link rel="stylesheet" href="${p}css/main.css" />
</head>
<body>
  <header class="site-header" id="site-header"></header>
  <main class="site-main">${body}</main>
  <script type="module" src="${p}js/layout.js"></script>
${scriptTags}
</body>
</html>
`;
}

function writePage(relPath, html) {
  const full = join(out, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
}

// lib → js
["topics", "problems", "examples", "theory", "validate", "hints", "equation", "topicVisit", "progress"].forEach(
  convertLib,
);

// UI scripts
cpSync(join(root, "static-src", "js"), join(out, "js"), { recursive: true });

// CSS
mkdirSync(join(out, "css"), { recursive: true });
cpSync(join(root, "static-src", "main.css"), join(out, "css", "main.css"));

const { topics } = await import(`file://${join(out, "js", "topics.js").replace(/\\/g, "/")}`);
const { problems } = await import(`file://${join(out, "js", "problems.js").replace(/\\/g, "/")}`);

const getProblemsByTopic = (id) => problems.filter((p) => p.topicId === id);

writePage(
  "index.html",
  shell({
    title: "Математика — теория, примеры, тренажёр",
    depth: 0,
    body: `<div id="home-root"></div>`,
    scripts: ["home.js"],
  }),
);

for (const topic of topics) {
  const d = 2;
  const hasTrainer = getProblemsByTopic(topic.id).length > 0;

  writePage(
    `topics/${topic.id}/index.html`,
    shell({
      title: `${topic.title} — Математика`,
      depth: d,
      body: `<div id="topic-hub" data-topic-id="${topic.id}"></div>`,
      scripts: ["topic-hub.js"],
    }),
  );

  writePage(
    `topics/${topic.id}/theory.html`,
    shell({
      title: `Теория: ${topic.title}`,
      depth: d,
      body: `<div id="topic-theory" data-topic-id="${topic.id}"></div>`,
      scripts: ["topic-theory.js"],
    }),
  );

  writePage(
    `topics/${topic.id}/examples.html`,
    shell({
      title: `Примеры: ${topic.title}`,
      depth: d,
      body: `<div id="topic-examples" data-topic-id="${topic.id}"></div>`,
      scripts: ["topic-examples.js"],
    }),
  );

  if (hasTrainer) {
    writePage(
      `topics/${topic.id}/trainer.html`,
      shell({
        title: `Тренажёр: ${topic.title}`,
        depth: d,
        body: `<div id="trainer-root" data-topic-id="${topic.id}"></div>`,
        scripts: ["trainer.js"],
      }),
    );
  }
}

writePage(
  "404.html",
  shell({
    title: "Страница не найдена",
    depth: 0,
    body: `<h1 class="page-title">404</h1><p class="page-subtitle"><a href="index.html">На главную</a></p>`,
  }),
);

console.log(`Built static site: ${topics.length} topics, ${problems.length} problems`);
