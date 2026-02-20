import { getPublishedArticles } from "../lib/content-source.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const posts = await getPublishedArticles(24);
    res.setHeader("Cache-Control", "public, max-age=900, s-maxage=900, stale-while-revalidate=3600");
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return res.status(500).json({ error: "Unable to fetch published articles" });
  }
}
