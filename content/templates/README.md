# Blog Post Templates

## How to Use Templates in Obsidian

1. **Enable Templates Plugin:**
   - Open Settings (Ctrl/Cmd + ,)
   - Go to Core Plugins
   - Enable "Templates"

2. **Configure Template Folder:**
   - Settings → Core Plugins → Templates
   - Set "Template folder location" to: `templates`
   - Set date format: `YYYY-MM-DD` (optional)
   - Set time format: `HH:mm` (optional)

3. **Use a Template:**
   - Create a new note
   - Click the "Insert template" button (or use hotkey)
   - Select your template
   - Fill in the frontmatter fields

## Available Templates

### blog-post.md
Full-featured blog post template with:
- Complete frontmatter
- Section structure
- Examples of callouts, links, images
- Common markdown features

### quick-post.md
Minimal template for quick thoughts and short posts.

## File Naming Convention

For blog posts in the `posts/` folder, use:
`YYYY-MM-DD-post-title-slug.md`

Example: `posts/2025-12-31-my-awesome-post.md`

For pages in the `pages/` folder, use descriptive names:
`about.md`, `contact.md`, `gaming-guide.md`, etc.

## Frontmatter Fields

- **layout**: Always use `post`
- **title**: Your post title (will appear as H1)
- **date**: Publication date (YYYY-MM-DD format)
- **author**: Your name or pen name
- **tags**: Array of tags `[tag1, tag2, tag3]`
- **excerpt**: Short description for previews/SEO
- **draft**: Set to `true` to exclude from build

## Tips

- Use `{{date}}` placeholder - Obsidian will replace with current date
- Use `{{title}}` placeholder - Obsidian will prompt you for title
- Tags help organize and make content discoverable
- Keep excerpts under 160 characters for SEO
