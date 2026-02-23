#!/usr/bin/env node
/**
 * Validates insights/posts.json before deploy.
 * Run: npm run validate-insights
 * - Ensures required fields (slug, title, excerpt, date) on each entry
 * - Warns if an entry lacks unifiedStatus: "Published" (it will not be published)
 * - Fails on duplicate slugs or invalid JSON
 */

const { readFileSync } = require("fs");
const { join } = require("path");

const path = join(process.cwd(), "insights", "posts.json");
const required = ["slug", "title", "excerpt", "date"];

function main() {
  let raw;
  try {
    raw = readFileSync(path, "utf-8");
  } catch (e) {
    console.error("Error: could not read insights/posts.json:", e.message);
    process.exit(1);
  }

  let posts;
  try {
    posts = JSON.parse(raw);
  } catch (e) {
    console.error("Error: insights/posts.json is not valid JSON:", e.message);
    process.exit(1);
  }

  if (!Array.isArray(posts)) {
    console.error("Error: insights/posts.json must be an array of post objects.");
    process.exit(1);
  }

  const slugs = new Set();
  let hasError = false;
  let hasWarning = false;

  posts.forEach((post, index) => {
    const prefix = `Post #${index + 1} (slug: ${post.slug || "(missing)"})`;

    for (const field of required) {
      const value = post[field];
      if (value === undefined || value === null || String(value).trim() === "") {
        console.error(`${prefix}: missing required field "${field}"`);
        hasError = true;
      }
    }

    const status = post.unifiedStatus ?? post.unified_status ?? "";
    const isPublished = String(status).toLowerCase().trim() === "published";
    if (!isPublished) {
      console.warn(`${prefix}: no unifiedStatus "Published" – this post will NOT appear on the site`);
      hasWarning = true;
    }

    const slug = post.slug && String(post.slug).trim();
    if (slug) {
      if (slugs.has(slug)) {
        console.error(`${prefix}: duplicate slug "${slug}"`);
        hasError = true;
      }
      slugs.add(slug);
    }
  });

  if (hasError) {
    console.error("\nValidation failed. Fix the errors above before deploying.");
    process.exit(1);
  }

  if (hasWarning) {
    console.warn("\nWarnings: some entries will not be published until unifiedStatus is set to \"Published\".");
  }

  console.log(`Validated ${posts.length} post(s) in insights/posts.json.`);
  const publishedCount = posts.filter(
    (p) => String(p.unifiedStatus ?? p.unified_status ?? "").toLowerCase().trim() === "published"
  ).length;
  if (publishedCount < posts.length) {
    console.log(`${publishedCount} will be published; ${posts.length - publishedCount} will be hidden (no Unified Status).`);
  }
}

main();
