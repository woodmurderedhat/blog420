# Post Formatting Guide

Use this as a quick reference when drafting or importing posts so they match the site layout and Quartz expectations.

## Frontmatter

Each post starts with YAML frontmatter:

```
---
layout: post
title: "Post Title"
date: YYYY-MM-DD
author: Your Name
tags: [tag1, tag2]
excerpt: "Short preview copy under 160 characters."
draft: false
---
```

- `layout: post` is required for blog entries.
- `title` renders as the H1 on the page.
- `date` drives ordering and URL generation.
- `tags` are lowercase, comma-separated inside brackets.
- `excerpt` feeds previews/SEO; keep it tight.
- Set `draft: true` to hide from production builds.

## Structure

- Start with an immediate hook. Avoid throat-clearing.
- Break the body into clear sections using `##` headings. Keep a logical escalation from setup → examples → consequence → closing sting.
- Use paragraphs of 2–5 sentences. Avoid walls of text.
- End with a closing section that reflects the reader back at themselves without preaching.

## Callouts and Notes

Quartz supports Obsidian-style callouts:

```
> [!info] Title
> Supporting text.

> [!warning] Watch out
> Brief cautionary note.
```

Use sparingly to highlight definitions, warnings, or sidebars, not for routine paragraphs.

## Links and Media

- Internal links: `[[path/to-note]]` or standard markdown `[text](relative/path)`.
- Images: `![[image.png]]` for vault assets or `![Alt text](https://example.com/image.jpg)` for external.
- Keep alt text meaningful; avoid decorative empties.

## Styling Tips

- Avoid list dumps unless the section needs them; prefer narrative flow.
- Profanity is allowed when it reveals behavior, not as filler.
- Keep sentences in plain ASCII; avoid smart quotes unless copying existing text.
- Use code fences with language hints when needed (`js, `bash, etc.).
- Inline math: `$x + y$`; block math: `$$ x + y $$`.

## File Naming

- Posts: `content/posts/YYYY-MM-DD-title-slug.md`
- Pages: `content/pages/page-name.md`
- Templates: `content/templates/*.md`

## Pre-publish Checklist

- Frontmatter present and accurate.
- `draft` set correctly.
- Excerpt present and under 160 characters.
- Headings form a sensible outline.
- No orphaned TODOs or placeholder text.
- Links and images are relative and working.
