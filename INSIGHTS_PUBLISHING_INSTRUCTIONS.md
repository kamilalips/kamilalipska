# Insights Publishing Instructions (Dynamic Only)

Use this guide when publishing any new insight on `kamilalipska.com`.

## 1) Deployment process (one deployment per new native insight)

For **every** new native insight (not legacy references), follow this so the post appears on the site, sitemap, and llms.txt:

1. **Add the post to the source of truth**
   - **Notion:** Set `Unified Status` = `Published`, `Destination website` = `kamilalipska.com`, and fill Slug, Title, Excerpt, etc.  
   - **Or local:** Add a full entry to `insights/posts.json` (see section 9). **Mandatory:** include `"unifiedStatus": "Published"` or the post will not be published.

2. **If using `insights/posts.json`**
   - Append one new object to the `posts.json` array with all required fields and `unifiedStatus: "Published"`.
   - Run validation before pushing: `npm run validate-insights` (see section 10).

3. **Single commit per new post (recommended)**
   - Commit message pattern: `content: add insight <slug>` or `content: update insights index <slug>`.
   - Push to trigger deployment. One deployment per new post keeps the deployment list clear and avoids missing a post.

4. **Verify after deploy**
   - Post appears on `/insights`.
   - `/insights/{slug}` opens without error.
   - Post is included in `/sitemap.xml` and `/llms.txt`.

If a new post does not appear, check: (a) `unifiedStatus` is exactly `"Published"` for local posts, or (b) Notion row has `Unified Status` = Published and Destination = kamilalipska.com, and Notion env vars are set.

## 2) Publishing rule (mandatory)

- Do **not** create static files like `insights/some-post.html`.
- All posts are rendered dynamically at:
  - `/insights/{slug}`
  - legacy links `/insights/{slug}.html` also resolve dynamically

## 3) Where to publish content

Preferred source of truth:
- Notion database:
  - `Unified Status` must be exactly `Published`
  - Destination website contains `kamilalipska.com`

Fallback/local source:
- `insights/posts.json`
- For local posts, include `unifiedStatus: "Published"` or the post will not be published.

## 4) Required post fields

Each post must include:
- `slug` (kebab-case, unique)
- `title`
- `excerpt` (1-2 clear sentences)
- `date` (ISO date format)

Optional:
- `primaryKeyword`
- `image` (stable public image URL; avoid signed temporary URLs)

## 5) Category and tagging rules

- One post = one category cluster.
- Reuse category clusters; do not create one-off tags.
- Reuse existing tags/categories only; do not invent new labels unless explicitly approved.
- Current clusters are normalized automatically:
  - `AI & Automation`
  - `SEO & Content`
  - `Data & Attribution`
  - `Web3 Growth`
  - `SaaS Growth`
  - `Growth Strategy`

## 6) Legacy reference content rules (Crypto Mum)

- Imported Crypto Mum posts are **references**, not new native posts.
- Keep their existing visual template and system styling; do not redesign cards/layout for legacy references.
- Allowed edits for references:
  - text cleanup (title/excerpt punctuation, encoding fixes)
  - category/tag normalization using existing categories
  - link corrections to the original Crypto Mum URL
- Not allowed for references:
  - custom visual redesign per post
  - creating static HTML article files
  - replacing shared components

## 7) SEO rules (automatic, do not duplicate in visible text)

Dynamic pages automatically include:
- self-canonical URL
- `meta robots: index, follow`
- Open Graph + Twitter metadata
- structured data (`BlogPosting`)

Important:
- Do not print meta-description notes in the visible article body.

## 8) Visual/content quality standards

- Keep headlines concise and specific.
- Excerpts should be human-readable, not keyword-stuffed.
- Use stable images only; if image fails, system falls back automatically.
- Ensure content is scannable with headings (`h2`, `h3`) and short paragraphs.
- For publishing updates, change text/content fields only unless a visual change was explicitly requested.

## 9) QA checklist before publish

- URL opens at `/insights/{slug}` without errors.
- Post appears on `/insights` listing.
- Category chip is clickable and filters correctly.
- Mobile view works (menu, spacing, typography, image).
- `sitemap.xml` and `llms.txt` include the post after publish.
- For legacy references, clicking `Read` opens the external Crypto Mum article.

## 10) Example `insights/posts.json` entry

**Always include `unifiedStatus: "Published"`** for local posts or they will not appear on the site.

```json
{
  "slug": "example-growth-framework",
  "title": "Example Growth Framework for SaaS Teams",
  "excerpt": "A practical framework for prioritizing growth experiments across acquisition, activation, and retention.",
  "date": "2026-02-20T12:00:00.000Z",
  "primaryKeyword": "saas growth framework",
  "unifiedStatus": "Published",
  "image": "https://your-cdn.com/images/example-growth-framework.png"
}
```

Optional for full article body on the detail page: `llmsDescription` (for meta/llms.txt), `contentHtml` (full article HTML).

## 11) Validate before deploy

Run before pushing when you changed `insights/posts.json`:

```bash
npm run validate-insights
```

This checks: required fields (slug, title, excerpt, date), no duplicate slugs, and warns about entries without `unifiedStatus: "Published"` (they will not be published).
