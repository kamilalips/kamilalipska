/**
 * Serves insights/posts.json as JSON.
 * Used by other API routes (insight, blog-posts, sitemap, llms) so they can
 * fetch local posts without hitting the /insights/:slug rewrite (which would
 * treat /insights/posts.json as slug=posts.json and return 404).
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const path = join(process.cwd(), "insights", "posts.json");
    const raw = await readFile(path, "utf-8");
    const data = JSON.parse(raw);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).send(raw);
  } catch (e) {
    console.error("insights-posts:", e.message);
    return res.status(500).json({ error: "Failed to load posts" });
  }
}
