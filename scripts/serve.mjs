import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..", "dist");
const port = Number(process.env.PORT) || 3000;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://localhost:${port}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";
    else if (!extname(pathname)) {
      const withHtml = `${pathname}.html`;
      const withIndex = join(pathname, "index.html");
      if (existsSync(join(root, withHtml))) pathname = withHtml;
      else if (existsSync(join(root, withIndex))) pathname = withIndex;
    }

    const filePath = join(root, pathname);
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const body = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mime[extname(filePath)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    try {
      const body = await readFile(join(root, "404.html"));
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  }
});

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
