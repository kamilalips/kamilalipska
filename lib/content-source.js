import { readFile } from "node:fs/promises";
import { join } from "node:path";

const SITE_URL = "https://kamilalipska.com";
const WORDPRESS_API_BASE = "https://crypto-mum.com/wp-json/wp/v2";
const NOTION_API_VERSION = "2022-06-28";

function stripHtml(input = "") {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toSlug(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function pickEmoji(title = "", category = "") {
  const text = `${title} ${category}`.toLowerCase();
  if (text.includes("ai") || text.includes("artificial intelligence")) return "🤖";
  if (text.includes("web3") || text.includes("crypto") || text.includes("blockchain")) return "🌐";
  if (text.includes("saas") || text.includes("product")) return "🚀";
  if (text.includes("growth") || text.includes("marketing")) return "📈";
  if (text.includes("seo") || text.includes("search")) return "🔍";
  if (text.includes("data") || text.includes("analytics")) return "📊";
  if (text.includes("automation") || text.includes("workflow")) return "⚙️";
  if (text.includes("profit") || text.includes("revenue")) return "💰";
  return "📝";
}

function normalizeCategory(rawCategory = "") {
  const value = (rawCategory || "").toLowerCase();

  const clusterMap = [
    { cluster: "AI & Automation", keys: ["ai", "automation", "agent", "llm"] },
    { cluster: "SEO & Content", keys: ["seo", "search", "content", "serp"] },
    { cluster: "Data & Attribution", keys: ["analytics", "data", "attribution", "tracking"] },
    { cluster: "Web3 Growth", keys: ["web3", "crypto", "blockchain", "token"] },
    { cluster: "SaaS Growth", keys: ["saas", "b2b", "product-led", "product"] },
    { cluster: "Growth Strategy", keys: ["growth", "gtm", "marketing", "strategy"] },
  ];

  const match = clusterMap.find((entry) => entry.keys.some((key) => value.includes(key)));
  return match ? match.cluster : "Growth Strategy";
}

function normalizeImageUrl(imageUrl = "") {
  const fallback = `${SITE_URL}/avatar.svg`;
  if (!imageUrl) return fallback;

  try {
    const url = new URL(imageUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return fallback;

    // Signed DALL-E blob URLs expire quickly and break page visuals.
    if (url.hostname.includes("oaidalleapiprodscus.blob.core.windows.net")) return fallback;
    return url.toString();
  } catch {
    return fallback;
  }
}

function getNotionProperty(page, fieldName) {
  const properties = page.properties || {};
  if (properties[fieldName]) return properties[fieldName];

  const wanted = fieldName.toLowerCase();
  const key = Object.keys(properties).find((name) => name.toLowerCase() === wanted);
  return key ? properties[key] : null;
}

function notionToText(property) {
  if (!property) return "";

  if (property.type === "title") {
    return (property.title || []).map((item) => item.plain_text || "").join("").trim();
  }

  if (property.type === "rich_text") {
    return (property.rich_text || []).map((item) => item.plain_text || "").join("").trim();
  }

  if (property.type === "select") {
    return property.select?.name || "";
  }

  if (property.type === "url") {
    return property.url || "";
  }

  if (property.type === "status") {
    return property.status?.name || "";
  }

  return "";
}

function notionToDate(property) {
  if (!property || property.type !== "date" || !property.date) return "";
  return property.date.start || "";
}

function transformWordPressPosts(posts, categoryMap) {
  return posts.map((post) => {
    const wpCategoryId = Array.isArray(post.categories) ? post.categories[0] : null;
    const sourceCategory = wpCategoryId ? categoryMap.get(wpCategoryId) || "" : "";
    const category = normalizeCategory(sourceCategory);
    const slug = post.slug || toSlug(stripHtml(post.title?.rendered || ""));

    let image = "";
    if (post._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
      image = post._embedded["wp:featuredmedia"][0].source_url;
    }

    const title = stripHtml(post.title?.rendered || "");
    const excerpt = stripHtml(post.excerpt?.rendered || "").slice(0, 220);

    return {
      slug,
      title,
      excerpt: excerpt ? `${excerpt}${excerpt.endsWith(".") ? "" : "..."}` : "",
      llmsDescription: excerpt,
      sourceUrl: post.link,
      url: `${SITE_URL}/insights/${slug}`,
      image: normalizeImageUrl(image),
      emoji: pickEmoji(title, category),
      category,
      categorySlug: toSlug(category),
      publishedAt: post.date,
      updatedAt: post.modified || post.date,
    };
  });
}

async function fetchWordPressPosts(limit = 24) {
  const [postsResponse, categoriesResponse] = await Promise.all([
    fetch(`${WORDPRESS_API_BASE}/posts?per_page=${limit}&_embed=true&orderby=date&order=desc`),
    fetch(`${WORDPRESS_API_BASE}/categories?per_page=100`),
  ]);

  if (!postsResponse.ok) {
    throw new Error(`WordPress posts fetch failed: ${postsResponse.status}`);
  }

  if (!categoriesResponse.ok) {
    throw new Error(`WordPress categories fetch failed: ${categoriesResponse.status}`);
  }

  const [posts, categories] = await Promise.all([postsResponse.json(), categoriesResponse.json()]);
  const categoryMap = new Map(categories.map((category) => [category.id, category.name]));
  return transformWordPressPosts(posts, categoryMap);
}

async function fetchNotionPosts() {
  const notionKey = process.env.NOTION_API_KEY;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;

  if (!notionKey || !notionDatabaseId) return [];

  const results = [];
  let cursor;

  while (true) {
    const response = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionKey}`,
        "Notion-Version": NOTION_API_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_size: 100,
        start_cursor: cursor,
      }),
    });

    if (!response.ok) {
      throw new Error(`Notion query failed: ${response.status}`);
    }

    const payload = await response.json();
    results.push(...(payload.results || []));

    if (!payload.has_more || !payload.next_cursor) break;
    cursor = payload.next_cursor;
  }

  const filtered = results.filter((page) => {
    const stage = notionToText(getNotionProperty(page, "Stage")) || notionToText(getNotionProperty(page, "Status"));
    const destination =
      notionToText(getNotionProperty(page, "Destination website")) ||
      notionToText(getNotionProperty(page, "Destination Website")) ||
      notionToText(getNotionProperty(page, "Website"));
    return stage.toLowerCase() === "published" && destination.toLowerCase().includes("kamilalipska.com");
  });

  return filtered
    .map((page) => {
      const title = notionToText(getNotionProperty(page, "Title")) || notionToText(getNotionProperty(page, "Name"));
      const slug = notionToText(getNotionProperty(page, "Slug")) || toSlug(title);
      const categoryRaw =
        notionToText(getNotionProperty(page, "Category")) ||
        notionToText(getNotionProperty(page, "Tags")) ||
        notionToText(getNotionProperty(page, "Topic"));
      const category = normalizeCategory(categoryRaw);
      const llmsDescription =
        notionToText(getNotionProperty(page, "LLMs Description")) ||
        notionToText(getNotionProperty(page, "LLM Description"));
      const excerpt = notionToText(getNotionProperty(page, "Excerpt")) || llmsDescription;
      const sourceUrl = notionToText(getNotionProperty(page, "URL"));
      const image = notionToText(getNotionProperty(page, "Image"));
      const publishedAt = notionToDate(getNotionProperty(page, "Published At")) || page.created_time;
      const updatedAt = page.last_edited_time || publishedAt;

      return {
        slug,
        title,
        excerpt,
        llmsDescription,
        sourceUrl,
        url: `${SITE_URL}/insights/${slug}`,
        image,
        emoji: pickEmoji(title, category),
        category,
        categorySlug: toSlug(category),
        publishedAt,
        updatedAt,
      };
    })
    .filter((item) => item.slug && item.title)
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
}

async function readLocalInsightsPosts() {
  try {
    const filePath = join(process.cwd(), "insights", "posts.json");
    const raw = await readFile(filePath, "utf-8");
    const posts = JSON.parse(raw);

    if (!Array.isArray(posts)) return [];

    return posts
      .map((post) => {
        const title = stripHtml(post.title || "");
        const slug = post.slug || toSlug(title);
        const category = normalizeCategory(post.primaryKeyword || post.category || "Growth Strategy");
        const excerpt = stripHtml(post.excerpt || "");
        const publishedAt = post.date || new Date().toISOString();

        return {
          slug,
          title,
          excerpt,
          llmsDescription: excerpt,
          sourceUrl: "",
          url: `${SITE_URL}/insights/${slug}`,
          image: normalizeImageUrl(post.image),
          emoji: pickEmoji(title, category),
          category,
          categorySlug: toSlug(category),
          publishedAt,
          updatedAt: publishedAt,
        };
      })
      .filter((post) => post.slug && post.title);
  } catch {
    return [];
  }
}

export async function getPublishedArticles(limit = 24) {
  const localPosts = await readLocalInsightsPosts();

  try {
    const notionPosts = await fetchNotionPosts();
    if (notionPosts.length > 0) {
      const merged = [...localPosts, ...notionPosts];
      const deduped = Array.from(new Map(merged.map((post) => [post.slug, post])).values());
      return deduped.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)).slice(0, limit);
    }
  } catch (error) {
    console.error("Notion content source failed:", error.message);
  }

  const wpPosts = await fetchWordPressPosts(limit);
  const merged = [...localPosts, ...wpPosts];
  const deduped = Array.from(new Map(merged.map((post) => [post.slug, post])).values());
  return deduped.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)).slice(0, limit);
}

export function getStaticSiteUrls() {
  return [
    { url: `${SITE_URL}/`, priority: "1.0", changefreq: "weekly" },
    { url: `${SITE_URL}/insights`, priority: "0.9", changefreq: "daily" },
  ];
}

export function xmlEscape(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export { SITE_URL };
