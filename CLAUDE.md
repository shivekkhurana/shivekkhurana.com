# Claude Rules for shivekkhurana.com

## Build Tools

**Always use bun:**
- Use `bun` instead of `npm` for all commands
- `bun run dev`, `bun run build`, `bun install`, etc.

## Code Style

**Imports:**
- Always use absolute imports only - never use relative imports (`../` or `./`)
- Use the `@src/*` path alias for all source files (e.g., `@src/config`, `@src/domain/location.types`)
- Use `@contentlayer/generated` for contentlayer generated types

```typescript
// Correct
import config from '@src/config';
import type { LocationData } from '@src/domain/location.types';
import { allPosts } from '@contentlayer/generated';

// Incorrect
import config from '../config';
import type { LocationData } from './location.types';
```

**Type Definitions:**
- Always define types in corresponding `.types.ts` files - never define types inline in implementation files
- Each domain module should have a corresponding `*.types.ts` file (e.g., `location.ts` → `location.types.ts`)
- All type definitions should be exported from the types file
- File naming: `domain-name.ts` for implementation, `domain-name.types.ts` for types (same directory)

## Commit Messages

**Format:** `[emoji] [Description]`

**Emoji guidelines:**
- 📊 Data/Charts/Visualization
- 🩺 Health/Medical
- 📝 Documentation, README, comments, spelling fixes
- 🪛 Fixes/Bugfixes, typing issues, corrections
- ✨ New Features, components, functionality
- 🗑️ Removal, deleting files
- 🎨 Styling/UI, CSS
- ⚡ Performance optimizations
- 🔧 Configuration, settings, tooling
- 📍 Location/Geography, maps
- ✈️ Travel
- ☁️ Infrastructure, deployment, hosting
- 🏞️ Images/Media
- 📐 Rules/Guidelines
- 🪪 About/Profile
- 🎆 Optimization (image/asset)
- ⬅️ Layout/Positioning
- 🛫 Travel Details

**Best practices:**
- Keep descriptions concise but descriptive
- Use present tense ("Add" not "Added")
- Capitalize the first letter after the emoji
- No period at the end
- Never include Anthropic signatures (Co-Authored-By lines)

**Examples:** `📊 Add health snapshots on home page`, `🪛 Fix typing issues`, `✨ Add new feature`

## Writing Style

**Frontmatter format:**
```yaml
---
publishedOn: 2025-02-15T00:00:00.000Z
title: "Title Here"
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

**Title rules:**
- Always wrap titles in double quotes `"..."` to avoid parsing issues with colons (`:`)
- Never use raw colons in unquoted titles

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
