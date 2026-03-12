/**
 * One-off: inline insights/posts/multi-agent-system.html into posts.json
 * so the live page works without relying on file read in the API.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = join(process.cwd());
const POSTS_JSON = join(ROOT, "insights", "posts.json");
const HTML_FILE = join(ROOT, "insights", "posts", "multi-agent-system.html");

async function main() {
  const html = await readFile(HTML_FILE, "utf8");
  const posts = JSON.parse(await readFile(POSTS_JSON, "utf8"));
  const post = posts.find((p) => p.slug === "multi-agent-system");
  if (!post) {
    console.error("multi-agent-system post not found in posts.json");
    process.exit(1);
  }
  post.contentHtml = html.trim();
  await writeFile(POSTS_JSON, JSON.stringify(posts, null, 2) + "\n", "utf8");
  console.log("Inlined multi-agent-system content into posts.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
