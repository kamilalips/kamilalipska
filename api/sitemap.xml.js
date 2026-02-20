import { getPublishedArticles, getStaticSiteUrls, xmlEscape } from "../lib/content-source.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const [staticUrls, posts] = await Promise.all([Promise.resolve(getStaticSiteUrls()), getPublishedArticles(500)]);

    const urls = [
      ...staticUrls.map((entry) => ({
        loc: entry.url,
        changefreq: entry.changefreq,
        priority: entry.priority,
        lastmod: new Date().toISOString(),
      })),
      ...posts.map((post) => ({
        loc: post.url,
        changefreq: "weekly",
        priority: "0.8",
        lastmod: new Date(post.updatedAt || post.publishedAt || Date.now()).toISOString(),
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${xmlEscape(entry.loc)}</loc>
    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400");
    return res.status(200).send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return res.status(500).send("Unable to generate sitemap");
  }
}
