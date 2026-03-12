import { readFile } from "node:fs/promises";
import { join } from "node:path";
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

function extractAndMergeReferences(html) {
  const refSectionRegex = /<section\s+class="references"\s*>[\s\S]*?<\/section>/gi;
  const linkRegex = /<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  const seenLinks = new Set();
  const seenText = new Set();
  const linkRefs = [];
  const textRefs = [];
  let match;
  while ((match = refSectionRegex.exec(html)) !== null) {
    const block = match[0];
    const blockText = block.replace(/<h2[\s\S]*?<\/h2>/gi, "");
    linkRegex.lastIndex = 0;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(blockText)) !== null) {
      const href = linkMatch[1].trim();
      const text = (linkMatch[2] || href).replace(/<[^>]+>/g, "").trim() || href;
      const key = href.toLowerCase();
      if (!seenLinks.has(key)) {
        seenLinks.add(key);
        linkRefs.push({ href, text });
      }
    }
    liRegex.lastIndex = 0;
    let liMatch;
    while ((liMatch = liRegex.exec(blockText)) !== null) {
      const inner = liMatch[1].trim();
      const hasLink = /<a\s+href=/i.test(inner);
      if (hasLink) continue;
      const text = inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (!text) continue;
      const key = text.toLowerCase().slice(0, 120);
      if (!seenText.has(key)) {
        seenText.add(key);
        textRefs.push(text);
      }
    }
  }
  const bodyWithoutRefs = html.replace(refSectionRegex, "").replace(/\n{3,}/g, "\n\n").trim();
  const allRefs = linkRefs.length + textRefs.length;
  if (allRefs === 0) return bodyWithoutRefs;
  const linkList = linkRefs
    .map(
      (r) =>
        `<li><a href="${xmlEscape(r.href)}" target="_blank" rel="noopener noreferrer">${xmlEscape(r.text)}</a></li>`
    )
    .join("\n");
  const textList = textRefs.map((t) => `<li>${xmlEscape(t)}</li>`).join("\n");
  const refList = [linkList, textList].filter(Boolean).join("\n");
  return (
    bodyWithoutRefs +
    '\n\n<section class="references">\n<h2>References</h2>\n<ul>\n' +
    refList +
    "\n</ul>\n</section>"
  );
}

function safeBodyHtml(contentHtml, pageTitle) {
  if (!contentHtml || typeof contentHtml !== "string") return "";
  let body = contentHtml.replace(/<\/script/gi, "<\\/script");
  body = extractAndMergeReferences(body);
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
  const imageAlt = xmlEscape(post.imageAlt || post.title || "");
  const emoji = xmlEscape(post.emoji || "📝");
  const sourceUrl = sanitizeHttpUrl(post.sourceUrl, "");
  const bodyHtml = safeBodyHtml(post.contentHtml, post.title);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${metaTitle || "Kamila Lipska Insights"}</title>
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
  <link rel="preload" href="${xmlEscape(image)}" as="image" />
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:16px;line-height:1.6;color:#000;background:#fff;-webkit-font-smoothing:antialiased}
    .header{position:fixed;top:0;left:0;right:0;height:80px;background:rgba(250,250,250,0.8);backdrop-filter:blur(20px);border-bottom:1px solid #e5e5e5;z-index:100}
    .header-container{max-width:1200px;margin:0 auto;padding:0 1.5rem;height:100%;display:flex;align-items:center;justify-content:space-between}
    .header-logo{display:flex;align-items:center;gap:0.75rem;text-decoration:none;color:#000}
    .logo-image{width:32px;height:32px;border-radius:6px}
    .logo-text{font-weight:600;font-size:18px}
    .header-nav{display:flex;align-items:center;gap:2rem}
    .nav-link{color:#666;text-decoration:none;font-weight:500;transition:color .2s ease}
    .nav-link:hover{color:#000}
    .header-actions{display:flex;align-items:center;gap:1rem}
    .btn{display:inline-flex;align-items:center;justify-content:center;padding:0.75rem 1.5rem;border-radius:8px;text-decoration:none;font-weight:500;font-size:14px;transition:all .2s ease;border:none;cursor:pointer}
    .btn-primary{background:#e91e63;color:#fafafa}
    .btn-primary:hover{background:#c2185b;transform:translateY(-1px)}
    .btn.btn-outline{background:transparent!important;color:#000!important;border:2px solid #e5e5e5!important}
    .btn.btn-outline:hover{border-color:#e5e5e5!important}
    .mobile-menu-toggle{display:none;flex-direction:column;justify-content:space-around;width:30px;height:30px;background:0 0;border:none;cursor:pointer;padding:0;z-index:1001}
    .hamburger-line{width:25px;height:3px;background:#000;transition:all .3s ease;transform-origin:1px}
    .mobile-menu-toggle.active .hamburger-line:first-child{transform:rotate(45deg)}
    .mobile-menu-toggle.active .hamburger-line:nth-child(2){opacity:0}
    .mobile-menu-toggle.active .hamburger-line:last-child{transform:rotate(-45deg)}
    .mobile-nav{position:fixed;top:0;right:-100%;width:280px;height:100vh;background:#fafafa;border-left:1px solid #e5e5e5;padding:80px 0 20px;transition:right .3s ease;z-index:1000;overflow-y:auto}
    .mobile-nav.active{right:0}
    .mobile-nav-link{display:block;padding:16px 24px;color:#666;text-decoration:none;font-weight:500;border-bottom:1px solid #e5e5e5;transition:all .2s ease}
    .mobile-nav-link:hover{color:#000;background:#f5f5f5}
    .mobile-nav-link.mobile-cta{background:#e91e63;color:#fff;margin:20px 24px;border-radius:8px;text-align:center;border:none}
    .mobile-nav-link.mobile-cta:hover{background:#c2185b;color:#fff}
    .insight-page{margin-top:110px;padding:0 20px 72px}
    .insight-wrap{max-width:860px;margin:0 auto}
    .insight-cover{margin-bottom:18px;border-radius:12px;overflow:hidden;height:280px;background:#fafafa}
    .insight-cover img{width:100%;height:280px;object-fit:cover;display:block}
    .insight-cover-placeholder{display:none;align-items:center;justify-content:center;height:280px;font-size:2.5rem;background:linear-gradient(135deg,#f5ecff,#eadcff);color:#5b259f}
    .insight-meta{color:#5b6168;font-size:14px;margin-bottom:18px}
    .insight-category{display:inline-block;padding:4px 10px;background:#f2ebff;border-radius:999px;font-size:12px;margin-bottom:16px;color:#5b259f;text-decoration:none}
    .insight-title{margin:0 0 10px;line-height:1.2}
    .insight-body{margin-top:24px;line-height:1.7;color:#1a1a1a}
    .insight-body h2{margin:1.75em 0 .5em;font-size:1.35rem;font-weight:600;line-height:1.3;color:#000}
    .insight-body h3{margin:1.5em 0 .4em;font-size:1.15rem;font-weight:600;line-height:1.35;color:#111}
    .insight-body p{margin:0 0 1em}
    .insight-body a{color:#c2185b;text-decoration:underline;text-underline-offset:2px}
    .insight-body a:hover{color:#e91e63}
    .insight-body ul,.insight-body ol{margin:0 0 1em;padding-left:1.75em;list-style-position:outside}
    .insight-body ul{list-style-type:disc}
    .insight-body ol{list-style-type:decimal}
    .insight-body li{margin:.4em 0;padding-left:.25em}
    .insight-body li p{margin:.35em 0 0}
    .insight-body li p:first-child{margin-top:0}
    .insight-body ul ul,.insight-body ol ol,.insight-body ul ol,.insight-body ol ul{margin:.35em 0;padding-left:1.5em}
    .insight-body .references{margin-top:2.5em;padding:1.5em 0 0;border-top:1px solid #e5e5e5}
    .insight-body .references h2{margin:0 0 .75em;font-size:1.1rem;font-weight:600;color:#555;text-transform:uppercase;letter-spacing:.04em}
    .insight-body .references ul{list-style:none;padding-left:0;margin:0}
    .insight-body .references li{margin:.5em 0;padding-left:1.25em;position:relative}
    .insight-body .references li::before{content:\"→\";position:absolute;left:0;color:#c2185b;font-weight:600}
    .insight-body .references a{display:inline-block}
    .insight-actions{margin-top:24px;display:flex;gap:12px;flex-wrap:wrap}
    @media (max-width:900px){.header-nav{display:none}.header-actions{display:none}.mobile-menu-toggle{display:flex}}
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
        <img src="${xmlEscape(image)}" alt="${imageAlt}" width="860" height="280" fetchpriority="high" decoding="async" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
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
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BlogPosting","headline":"${metaTitle}","description":"${metaDescription}","datePublished":"${publishedDate}","dateModified":"${publishedDate}","author":{"@type":"Person","name":"Kamila Lipska","url":"${SITE_URL}"},"publisher":{"@type":"Organization","name":"Kamila Lipska","url":"${SITE_URL}"},"image":"${xmlEscape(image)}","mainEntityOfPage":"${canonicalUrl}","articleSection":"${category}"}</script>
  <script>
    (function(){var r=function(c){if(typeof requestIdleCallback==="function")requestIdleCallback(c,{timeout:100});else setTimeout(c,100)};r(function(){var m=document.getElementById("mobileMenuToggle"),n=document.getElementById("mobileNav");if(!m||!n)return;m.addEventListener("click",function(){m.classList.toggle("active");n.classList.toggle("active");document.body.style.overflow=n.classList.contains("active")?"hidden":""});document.querySelectorAll(".mobile-nav-link").forEach(function(l){l.addEventListener("click",function(){m.classList.remove("active");n.classList.remove("active");document.body.style.overflow=""})})})})();
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

    // Load article body from file when not inline in posts.json
    if (!post.contentHtml && post.slug) {
      try {
        const filePath = join(process.cwd(), "insights", "posts", `${post.slug}.html`);
        post.contentHtml = await readFile(filePath, "utf8");
      } catch {
        // leave contentHtml empty
      }
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
