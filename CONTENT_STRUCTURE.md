# 📂 New Folder Structure

Your content folder has been reorganized for better management in both Obsidian and the blog:

## ✅ What Changed

### Before:
```
content/
├── 2025-12-20-retro-gaming-nostalgia-hits-different.md
├── 2025-12-22-modern-games-retro-aesthetic.md
├── GAMIFICATION_GUIDE.md
├── START_HERE.md
└── (everything mixed together)
```

### After:
```
content/
├── posts/                      📝 All blog posts
│   ├── 2025-12-20-retro-gaming-nostalgia-hits-different.md
│   ├── 2025-12-22-modern-games-retro-aesthetic.md
│   ├── 2025-12-24-learning-pixel-art-journey.md
│   ├── 2025-12-26-retro-games-that-live-rent-free.md
│   ├── 2025-12-28-why-pixel-art-slaps-different.md
│   └── 2025-12-30-gamification-test-page.md
│
├── pages/                      📄 Static pages & guides
│   ├── GAMIFICATION_GUIDE.md
│   ├── START_HERE.md
│   ├── DEPLOYMENT_CHECKLIST.md
│   └── (other documentation)
│
├── templates/                  📋 Obsidian templates
│   ├── blog-post.md           (Full blog post template)
│   ├── quick-post.md          (Quick post template)
│   └── README.md              (Template guide)
│
├── assets/                     🖼️ Images & media
│   └── (your images here)
│
├── index.md                    🏠 Homepage
└── README.md                   📖 Organization guide
```

## 🎯 How to Use in Obsidian

### Creating a New Blog Post
1. Navigate to `posts/` folder in Obsidian
2. Create new note: `YYYY-MM-DD-title.md` (e.g., `2025-12-31-my-post.md`)
3. Use Cmd/Ctrl+P → "Insert template" → Select `blog-post`
4. Fill in the frontmatter and write!

### Creating a Static Page
1. Navigate to `pages/` folder
2. Create new note with descriptive name (e.g., `about.md`, `projects.md`)
3. Write your content (no strict format required)

### Adding Images
1. Drop images into `assets/` folder
2. Reference in markdown:
   - Standard: `![Alt text](../assets/image.png)`
   - Obsidian: `![[image.png]]`

## ✨ Benefits

- **Organized**: Posts and pages are separated
- **Clean**: Easy to find what you need
- **Scalable**: Can add hundreds of posts without chaos
- **Obsidian-friendly**: Works perfectly with Obsidian's folder navigation
- **Build-ready**: Quartz automatically handles the new structure

## 🔗 Your Blog URLs

The folder structure doesn't change your URLs:
- `posts/2025-12-31-my-post.md` → `blog.420360.xyz/posts/2025-12-31-my-post`
- `pages/about.md` → `blog.420360.xyz/pages/about`

Everything is already committed and pushed to GitHub. Your site will deploy with the new structure automatically! 🚀
