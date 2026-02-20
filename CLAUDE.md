# Claude Rules for shivekkhurana.com

## Build Tools

**Always use bun:**
- Use `bun` instead of `npm` for all commands
- `bun run dev`, `bun run build`, `bun install`, etc.

## Code Style

**Imports:**
- Always use absolute imports with `@src/` prefix (e.g., `import Img from '@src/components/Img'`)
- Never use relative imports like `./` or `../`

## Writing Style

**Frontmatter format:**
```yaml
---
publishedOn: 2025-02-15T00:00:00.000Z
title: Title Here
subTitle: Optional subtitle
featured: false
heroImg: /img/content/posts/image-name.png
heroImgCaption: Photo credit or description for hero image
slug: url-slug-here
tags:
  - tag1
  - tag2
author: shivekkhurana
---
```

**Tags vs Slugs (important distinction):**
- **Tags**: Reusable categories for posts (e.g., `clojure`, `javascript`, `startup`). Defined in `content/tags/`. Used in the `tags:` array.
- **Slugs**: Unique URL identifiers for individual posts (e.g., `clojure-drug-dealer-part-1`). Each post has one `slug:` field. Never use slugs as tags.

**Tags:**
- Only use tags that exist in `content/tags/` (check the `slug` field in each tag file)
- If a new tag is needed, first create the tag file in `content/tags/`:
  ```yaml
  ---
  slug: tag-slug
  title: Tag Title
  featured: false
  ---
  ```

**Related posts:**
- Use `relatedSlugs` in frontmatter to link to related posts (renders as "Related Posts" section)
- Values are post slugs (the `slug` field from other posts), not tags
- Example: `relatedSlugs: [post-slug-1, post-slug-2]`

**Tone:**
- First-person, personal ("I", "we")
- Technical but conversational
- Real-world motivation/context before diving into code
- Direct, no fluff or filler phrases

**Structure:**
- Problem → Solution flow
- Clear `##` and `###` headings
- Extensive code blocks with language tags
- Blockquotes (`>`) for key insights
- `*Caption*` format for images

**Avoid:**
- Emojis (unless user requests them)
- Excessive adjectives and superlatives
- "Let me explain" or "In this article we will" phrases
- Over-engineering explanations

## Vega-Lite Charts

The blog supports Vega-Lite charts rendered from markdown code blocks.

**Usage:**
````markdown
```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Chart Title",
  "width": 800,
  "height": 400,
  "data": {
    "values": [
      {"x": 1, "y": 10, "category": "A"},
      {"x": 2, "y": 20, "category": "B"}
    ]
  },
  "encoding": {
    "x": {"field": "x", "type": "quantitative"},
    "y": {"field": "y", "type": "quantitative"}
  },
  "mark": "bar"
}
```
````

**Key patterns:**
- Always include `"$schema": "https://vega.github.io/schema/vega-lite/v5.json"`
- Set explicit `width` and `height` for consistent rendering
- Use `"type": "ordinal"` for categorical x-axes, `"quantitative"` for numeric
- Use `layer` array for multiple marks (e.g., bars + lines + labels)
- Use `resolve: { scale: { y: "independent" } }` for dual-axis charts
- Add tooltips with `"tooltip": true` in mark or explicit tooltip encoding

**Best for:**
- Bar charts, line charts, scatter plots
- Comparing metrics across categories
- Time series data
- Statistical visualizations
- Architecture/node-link diagrams (use manual coordinates with `rule` and `circle` marks)
