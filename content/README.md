# 📁 Content Organization

This folder contains all the content for your blog. Here's how it's organized:

## Folder Structure

```
content/
├── posts/          📝 Blog posts (dated articles)
├── pages/          📄 Static pages (guides, documentation)
├── templates/      📋 Post templates for Obsidian
├── assets/         🖼️ Images, files, and media
├── index.md        🏠 Homepage
└── README.md       📖 This file
```

## 📝 Posts (`posts/`)
All your blog articles go here. Use the naming convention:
- Format: `YYYY-MM-DD-post-title.md`
- Example: `posts/2025-12-31-my-awesome-post.md`

## 📄 Pages (`pages/`)
Static pages that aren't dated blog posts:
- Guides and tutorials
- Documentation
- About pages
- Any permanent content

## 📋 Templates (`templates/`)
Reusable templates for creating new content in Obsidian:
- `blog-post.md` - Full blog post template
- `quick-post.md` - Quick post template

## 🖼️ Assets (`assets/`)
Media files and resources:
- Images
- Downloads
- Other static files

---

## 🚀 Quick Start in Obsidian

### Create a New Blog Post
1. Right-click `posts/` folder → New note
2. Name it: `YYYY-MM-DD-your-title.md`
3. Insert template: `blog-post`
4. Write and save!

### Create a New Page
1. Right-click `pages/` folder → New note
2. Name it descriptively (e.g., `about.md`)
3. Write your content
4. Save!

### Add Images
1. Drag images to `assets/` folder
2. Reference in posts: `![Alt text](../assets/image.png)`
3. Or use Obsidian syntax: `![[image.png]]`

---

## 🔗 Internal Linking

Link between posts and pages using wikilinks:
- `[[posts/2025-12-31-my-post]]` - Links to a post
- `[[pages/about]]` - Links to a page
- `[[posts/my-post|Custom Text]]` - Link with custom text

Quartz will automatically handle these links when building your site.

---

## 🛠️ Building & Deploying

See [GITHUB_PAGES_SETUP.md](../GITHUB_PAGES_SETUP.md) for deployment instructions.

To build locally:
```powershell
npx quartz build --serve
```

Then visit http://localhost:8080

