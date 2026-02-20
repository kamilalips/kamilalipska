import { getPublishedArticles, SITE_URL } from "../lib/content-source.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const posts = await getPublishedArticles(500);

    const header = [
      "# Kamila Lipska - LLM Knowledge File",
      "",
      "This file lists published portfolio insights with concise descriptions for AI systems.",
      `Website: ${SITE_URL}`,
      "",
      "## Insights",
      "",
    ].join("\n");

    const lines = posts.map((post) => {
      const description = (post.llmsDescription || post.excerpt || "").replace(/\s+/g, " ").trim();
      return `- ${post.title} | ${post.url} | ${post.category} | ${description}`;
    });

    const content = `${header}${lines.join("\n")}\n`;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400");
    return res.status(200).send(content);
  } catch (error) {
    console.error("Error generating llms.txt:", error);
    return res.status(500).send("Unable to generate llms.txt");
  }
}
