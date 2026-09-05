// Zero-dependency static server for local preview: `npm run dev`
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".json": "application/json", ".ico": "image/x-icon", ".pdf": "application/pdf" };

createServer((req, res) => {
  let url;
  try { url = decodeURIComponent((req.url || "/").split("?")[0]); }
  catch { res.writeHead(400); return res.end("Invalid URL"); }
  let file = resolve(root, "." + url);
  if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403); return res.end(); }
  if (url.split("/").some((part) => part.startsWith("."))) { res.writeHead(403); return res.end(); }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    return createReadStream(join(root, "404.html")).pipe(res);
  }
  if (req.method === "HEAD") { res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" }); return res.end(); }
  res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
  createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => console.log(`Preview: http://127.0.0.1:${port}`));
