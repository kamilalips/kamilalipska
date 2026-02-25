import { getArticleBySlug, SITE_URL, xmlEscape } from "../lib/content-source.js";

function sanitizeHttpUrl(value, fallback) {
  if (!value) return fallback;
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
    return fallback;
  } catch {
    return fallback;
  }
}

function normalizeForCompare(text) {
  return (text || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function isRedundantH2(h2InnerHtml, pageTitle) {
  const stripTags = (s) => (s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const a = normalizeForCompare(stripTags(h2InnerHtml));
  const b = normalizeForCompare(pageTitle);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  const aWords = a.split(/\s+/).filter((w) => w.length > 1);
  const bWords = b.split(/\s+/).filter((w) => w.length > 1);
  const overlap = aWords.filter((w) => bWords.includes(w)).length;
  return overlap >= Math.min(3, aWords.length, bWords.length);
}

function safeBodyHtml(contentHtml, pageTitle) {
  if (!contentHtml || typeof contentHtml !== "string") return "";
  let body = contentHtml.replace(/<\/script/gi, "<\\/script");
  const h2Open = body.indexOf("<h2");
  if (h2Open !== -1) {
    const afterOpen = body.indexOf(">", h2Open) + 1;
    const h2Close = body.indexOf("</h2>", afterOpen);
    if (afterOpen > 0 && h2Close !== -1) {
      const h2Text = body.slice(afterOpen, h2Close);
      if (isRedundantH2(h2Text, pageTitle)) {
        body = (body.slice(0, h2Open) + body.slice(h2Close + 5)).replace(/^\s+/, "");
      }
    }
  }
  return "<div class=\"insight-body\">" + body + "</div>";
}

function renderInsightPage(post) {
  const title = xmlEscape(post.title);
  const metaTitle = xmlEscape(post.metaTitle || post.title || "");
  const metaDescription = xmlEscape(
    post.metaDescription || post.llmsDescription || post.excerpt || ""
  );
  const category = xmlEscape(post.category || "Growth Strategy");
  const canonicalUrl = `${SITE_URL}/insights/${post.slug}`;
  const publishedDate = post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString();
  const image = sanitizeHttpUrl(post.image, `${SITE_URL}/avatar.svg`);
  const emoji = xmlEscape(post.emoji || "📝");
  const sourceUrl = sanitizeHttpUrl(post.sourceUrl, "");
  const bodyHtml = safeBodyHtml(post.contentHtml, post.title);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${metaTitle || "Kamila Lipska Insights"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="/avatar.svg" />
  <link rel="icon" type="image/png" href="/avatar.svg" />
  <link rel="apple-touch-icon" href="/avatar.svg" />
  <meta name="description" content="${metaDescription}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${metaTitle}" />
  <meta property="og:description" content="${metaDescription}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${xmlEscape(image)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${metaTitle}" />
  <meta name="twitter:description" content="${metaDescription}" />
  <meta name="twitter:image" content="${xmlEscape(image)}" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="preload" href="${xmlEscape(image)}" as="image" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${metaTitle}",
    "description": "${metaDescription}",
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
    "image": "${xmlEscape(image)}",
    "mainEntityOfPage": "${canonicalUrl}",
    "articleSection": "${category}"
  }
  </script>
  <style>
    body { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .insight-page { margin-top: 110px; padding: 0 20px 72px; }
    .insight-wrap { max-width: 860px; margin: 0 auto; }
    .insight-cover { margin-bottom: 18px; border-radius: 12px; overflow: hidden; height: 280px; background: #fafafa; }
    .insight-cover img { width: 100%; height: 280px; object-fit: cover; display: block; }
    .insight-cover-placeholder { display: none; align-items: center; justify-content: center; height: 280px; font-size: 2.5rem; background: linear-gradient(135deg, #f5ecff, #eadcff); color: #5b259f; }
    .insight-meta { color: #5b6168; font-size: 14px; margin-bottom: 18px; }
    .insight-category { display: inline-block; padding: 4px 10px; background: #f2ebff; border-radius: 999px; font-size: 12px; margin-bottom: 16px; color: #5b259f; text-decoration: none; }
    .insight-title { margin: 0 0 10px; line-height: 1.2; }
    .insight-body { margin-top: 24px; line-height: 1.6; }
    .insight-body h2 { margin: 1.5em 0 0.5em; font-size: 1.25rem; }
    .insight-body h3 { margin: 1.25em 0 0.5em; font-size: 1.1rem; }
    .insight-body p { margin: 0 0 0.75em; }
    .insight-body ul, .insight-body ol { margin: 0 0 0.75em; padding-left: 1.5em; list-style-position: inside; }
    .insight-body li { margin: 0.25em 0; }
    .insight-body li p { margin: 0.25em 0 0; }
    .insight-body li p:first-child { margin-top: 0; }
    .insight-body ul ul, .insight-body ol ol, .insight-body ul ol, .insight-body ol ul { margin: 0.25em 0; padding-left: 1.25em; }
    .insight-actions { margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap; }
    .header-logo { text-decoration: none; }
    @media (max-width: 900px) {
      .header-nav { display: none; }
      .header-actions { display: none; }
      .mobile-menu-toggle { display: inline-flex; }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-container">
      <a href="/" class="header-logo logo-home-link" aria-label="Go to homepage">
        <img src="/avatar.svg" alt="Kamila Lipska" class="logo-image" width="32" height="32">
        <span class="logo-text">Kamila Lipska</span>
      </a>
      <nav class="header-nav">
        <a href="/" class="nav-link">Home</a>
        <a href="/#about" class="nav-link">About</a>
        <a href="/#services" class="nav-link">Core Competencies</a>
        <a href="/#systems" class="nav-link">Systems</a>
        <a href="/#stack" class="nav-link">Stack</a>
        <a href="/#testimonials" class="nav-link">Testimonials</a>
        <a href="/insights" class="nav-link">Insights</a>
        <a href="/#contact" class="nav-link">Contact</a>
      </nav>
      <div class="header-actions">
        <a href="mailto:kamila.lipska@gmail.com" class="btn btn-primary">Let's Talk</a>
      </div>
      <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle mobile menu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
      <nav class="mobile-nav" id="mobileNav">
        <a href="/" class="mobile-nav-link">Home</a>
        <a href="/#about" class="mobile-nav-link">About</a>
        <a href="/#services" class="mobile-nav-link">Core Competencies</a>
        <a href="/#systems" class="mobile-nav-link">Systems</a>
        <a href="/#stack" class="mobile-nav-link">Stack</a>
        <a href="/#testimonials" class="mobile-nav-link">Testimonials</a>
        <a href="/insights" class="mobile-nav-link">Insights</a>
        <a href="/#contact" class="mobile-nav-link">Contact</a>
        <a href="mailto:kamila.lipska@gmail.com" class="mobile-nav-link mobile-cta">Let's Talk</a>
      </nav>
    </div>
  </header>

  <main class="insight-page">
    <article class="insight-wrap">
      <a class="insight-category" href="/insights?category=${encodeURIComponent(post.category || "Growth Strategy")}">${category}</a>
      <h1 class="insight-title">${title}</h1>
      <div class="insight-cover" style="position:relative">
        <img src="${xmlEscape(image)}" alt="${title}" width="860" height="280" fetchpriority="high" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="insight-cover-placeholder">${emoji}</div>
      </div>
      <p class="insight-meta">Published: ${new Date(publishedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      ${bodyHtml}
      <div class="insight-actions">
        <a class="btn btn-outline" href="/insights">Browse all insights</a>
        ${sourceUrl ? `<a class="btn btn-primary" href="${xmlEscape(sourceUrl)}" target="_blank" rel="noopener noreferrer">Read full article</a>` : ""}
      </div>
    </article>
  </main>
  <script>
    (function () {
      const menuToggle = document.getElementById("mobileMenuToggle");
      const mobileNav = document.getElementById("mobileNav");
      if (!menuToggle || !mobileNav) return;

      menuToggle.addEventListener("click", function () {
        menuToggle.classList.toggle("active");
        mobileNav.classList.toggle("active");
        document.body.style.overflow = mobileNav.classList.contains("active") ? "hidden" : "";
      });

      document.querySelectorAll(".mobile-nav-link").forEach(function (link) {
        link.addEventListener("click", function () {
          menuToggle.classList.remove("active");
          mobileNav.classList.remove("active");
          document.body.style.overflow = "";
        });
      });
    })();
  </script>
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
    const post = await getArticleBySlug(slug);
    if (!post) {
      return res.status(404).send("Insight not found");
    }

    // Legacy Crypto Mum references should resolve externally.
    if (post.isReference && post.sourceUrl) {
      return res.redirect(302, post.sourceUrl);
    }

    const html = renderInsightPage(post);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(html);
  } catch (error) {
    console.error("Error rendering insight page:", error);
    return res.status(500).send("Unable to render insight page");
  }
}
