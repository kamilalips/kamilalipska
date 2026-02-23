# Insights Publishing Instructions (Dynamic Only)

Use this guide when publishing any new insight on `kamilalipska.com`.

## 1) Publishing rule (mandatory)

- Do **not** create static files like `insights/some-post.html`.
- All posts are rendered dynamically at:
  - `/insights/{slug}`
  - legacy links `/insights/{slug}.html` also resolve dynamically

## 2) Where to publish content

Preferred source of truth:
- Notion database (Stage = `Published`, Destination website contains `kamilalipska.com`)

Fallback/local source:
- `insights/posts.json`

## 3) Required post fields

Each post must include:
- `slug` (kebab-case, unique)
- `title`
- `excerpt` (1-2 clear sentences)
- `date` (ISO date format)

Optional:
- `primaryKeyword`
- `image` (stable public image URL; avoid signed temporary URLs)

## 4) Category and tagging rules

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

## 5) Legacy reference content rules (Crypto Mum)

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

## 6) SEO rules (automatic, do not duplicate in visible text)

Dynamic pages automatically include:
- self-canonical URL
- `meta robots: index, follow`
- Open Graph + Twitter metadata
- structured data (`BlogPosting`)

Important:
- Do not print meta-description notes in the visible article body.

## 7) Visual/content quality standards

- Keep headlines concise and specific.
- Excerpts should be human-readable, not keyword-stuffed.
- Use stable images only; if image fails, system falls back automatically.
- Ensure content is scannable with headings (`h2`, `h3`) and short paragraphs.
- For publishing updates, change text/content fields only unless a visual change was explicitly requested.

## 8) QA checklist before publish

- URL opens at `/insights/{slug}` without errors.
- Post appears on `/insights` listing.
- Category chip is clickable and filters correctly.
- Mobile view works (menu, spacing, typography, image).
- `sitemap.xml` and `llms.txt` include the post after publish.
- For legacy references, clicking `Read` opens the external Crypto Mum article.

## 9) Example `insights/posts.json` entry

```json
{
  "slug": "example-growth-framework",
  "title": "Example Growth Framework for SaaS Teams",
  "excerpt": "A practical framework for prioritizing growth experiments across acquisition, activation, and retention.",
  "date": "2026-02-20T12:00:00.000Z",
  "primaryKeyword": "saas growth framework",
  "image": "https://your-cdn.com/images/example-growth-framework.png"
}
```
