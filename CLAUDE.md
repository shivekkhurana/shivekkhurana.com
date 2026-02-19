# Claude Rules for shivekkhurana.com

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
slug: url-slug-here
tags:
  - tag1
  - tag2
author: shivekkhurana
---
```

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
