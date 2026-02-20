import { getPublishedArticles, SITE_URL, xmlEscape } from "../lib/content-source.js";

function renderInsightPage(post) {
  const title = xmlEscape(post.title);
  const description = xmlEscape(post.llmsDescription || post.excerpt || "");
  const canonicalUrl = `${SITE_URL}/insights/${post.slug}`;
  const publishedDate = post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString();
  const image = post.image || `${SITE_URL}/avatar.svg`;
  const sourceUrl = post.sourceUrl || canonicalUrl;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Kamila Lipska Insights</title>
  <link rel="icon" type="image/svg+xml" href="/avatar.svg" />
  <link rel="icon" type="image/png" href="/avatar.svg" />
  <link rel="apple-touch-icon" href="/avatar.svg" />
  <meta name="description" content="${description}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${xmlEscape(image)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <link rel="stylesheet" href="/styles.css" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${title}",
    "description": "${description}",
    "datePublished": "${publishedDate}",
    "dateModified": "${publishedDate}",
    "author": {
      "@type": "Person",
      "name": "Kamila Lipska",
      "url": "${SITE_URL}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Kamila Lipska",
      "url": "${SITE_URL}"
    },
    "mainEntityOfPage": "${canonicalUrl}",
    "articleSection": "${xmlEscape(post.category || "Growth Strategy")}"
  }
  </script>
  <style>
    .insight-page { margin-top: 110px; padding: 0 20px 72px; }
    .insight-wrap { max-width: 860px; margin: 0 auto; }
    .insight-meta { color: #5b6168; font-size: 14px; margin-bottom: 18px; }
    .insight-category { display: inline-block; padding: 4px 10px; background: #f2ebff; border-radius: 999px; font-size: 12px; margin-bottom: 16px; color: #5b259f; text-decoration: none; }
    .insight-title { margin-bottom: 10px; }
    .insight-description { line-height: 1.7; }
    .insight-actions { margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap; }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-container">
      <div class="header-logo">
        <img src="/avatar.svg" alt="Kamila Lipska" class="logo-image">
        <span class="logo-text">Kamila Lipska</span>
      </div>
      <nav class="header-nav">
        <a href="/" class="nav-link">Home</a>
        <a href="/insights" class="nav-link">Insights</a>
      </nav>
    </div>
  </header>

  <main class="insight-page">
    <article class="insight-wrap">
      <p><a href="/insights">← Back to Insights</a></p>
      <a class="insight-category" href="/insights?category=${encodeURIComponent(post.category || "Growth Strategy")}">${xmlEscape(post.category || "Growth Strategy")}</a>
      <h1 class="insight-title">${title}</h1>
      <p class="insight-meta">Published: ${new Date(publishedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      <p class="insight-description">${description}</p>
      <div class="insight-actions">
        <a class="btn btn-outline" href="/insights">Browse all insights</a>
        <a class="btn btn-primary" href="${xmlEscape(sourceUrl)}" target="_blank" rel="noopener noreferrer">Read full article</a>
      </div>
    </article>
  </main>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  const slug = (req.query?.slug || "").toString().trim();
  if (!slug) {
    return res.status(400).send("Missing slug");
  }

  try {
    const posts = await getPublishedArticles(500);
    const post = posts.find((item) => item.slug === slug);

    if (!post) {
      return res.status(404).send("Insight not found");
    }

    const html = renderInsightPage(post);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=900, s-maxage=900, stale-while-revalidate=3600");
    return res.status(200).send(html);
  } catch (error) {
    console.error("Error rendering insight page:", error);
    return res.status(500).send("Unable to render insight page");
  }
}
