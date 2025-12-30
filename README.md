# Blog Setup Instructions

Your Jekyll blog is now ready! Here's how to get it running:

## Prerequisites

- Ruby 2.7 or higher
- Git
- GitHub account

## Local Setup

1. **Install dependencies:**
   ```bash
   cd blog420
   bundle install
   ```

2. **Run locally:**
   ```bash
   bundle exec jekyll serve
   ```
   
   Your blog will be available at `http://localhost:4000`

3. **View sample post:**
   Navigate to see the welcome post and explore the archive and tags pages.

## Deployment to GitHub Pages

1. **Initialize git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Jekyll blog setup"
   ```

2. **Create a GitHub repository:**
   - Go to [github.com](https://github.com) and create a new repository
   - Name it whatever you like (e.g., `my-blog` or `blog420`)

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages:**
   - Go to your repository settings
   - Under "Pages", select "GitHub Actions" as the deployment method
   - The workflow in `.github/workflows/pages.yml` will automatically build and deploy your site

5. **Access your blog:**
   - Your site will be published at `https://YOUR_USERNAME.github.io/YOUR_REPO`
   - Update the `url` and `baseurl` in `_config.yml` if needed

## Creating Posts

To add a new post:

1. Create a new file in `_posts/` with the format: `YYYY-MM-DD-post-title.md`
2. Add the YAML front matter (see the sample post for format)
3. Write your markdown content
4. Commit and push to GitHub
5. The site will automatically rebuild and deploy!

## Customization

- **`_config.yml`**: Edit site title, description, author, and other settings
- **`assets/css/style.css`**: Modify the styling
- **`_layouts/`**: Customize HTML templates
- **`_includes/`**: Add reusable template components

## File Structure

```
blog420/
├── _posts/                 # Your blog posts (markdown files)
├── _layouts/               # HTML templates for different page types
├── _includes/              # Reusable template components
├── assets/
│   └── css/               # Stylesheets
├── index.md               # Homepage (shows recent posts)
├── archive.md             # Archive page (browse by year)
├── tags.md                # Tags page (browse by tag)
├── _config.yml            # Jekyll configuration
├── Gemfile                # Ruby dependencies
└── .github/workflows/
    └── pages.yml          # GitHub Actions deployment workflow
```

## Need Help?

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Markdown Guide](https://www.markdownguide.org/)

Happy blogging!
