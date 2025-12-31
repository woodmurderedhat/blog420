# GitHub Pages Setup Guide

Your blog is now configured to deploy to GitHub Pages automatically. Here's what was set up:

## Files Created/Modified

1. **`.github/workflows/deploy.yaml`** - GitHub Actions workflow that automatically builds and deploys your site
2. **`quartz/static/.nojekyll`** - Tells GitHub Pages not to use Jekyll processing
3. **`quartz/static/CNAME`** - Your custom domain configuration (blog.420360.xyz)

## Required GitHub Settings

To complete the setup, you need to configure your GitHub repository:

### 1. Enable GitHub Pages
1. Go to your repository: https://github.com/woodmurderedhat/blog420
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **GitHub Actions**

### 2. Custom Domain Configuration (Optional but Recommended)
Since you have `blog.420360.xyz` configured:

1. In the same Pages settings, under **Custom domain**, enter: `blog.420360.xyz`
2. Check **Enforce HTTPS**
3. In your domain registrar (where you bought 420360.xyz), add these DNS records:
   - **Type**: `CNAME`
   - **Name**: `blog` (or `@` if using the root domain)
   - **Value**: `woodmurderedhat.github.io`

   OR use A records pointing to GitHub Pages IPs:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

## How It Works

1. When you push to the `main` branch, GitHub Actions automatically:
   - Checks out your code
   - Installs dependencies
   - Builds your Quartz site (`npx quartz build`)
   - Deploys the `public/` folder to GitHub Pages

2. Your site will be available at:
   - Default: https://woodmurderedhat.github.io/blog420/
   - Custom domain: https://blog.420360.xyz (once DNS is configured)

## Deploy Your Site

To deploy your site, simply commit and push your changes:

```powershell
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

## Check Deployment Status

1. Go to the **Actions** tab in your repository
2. You'll see the "Deploy to GitHub Pages" workflow running
3. Once complete (green checkmark), your site is live!

## Troubleshooting

- **404 Not Found**: Make sure GitHub Pages source is set to "GitHub Actions" in Settings
- **CSS/JS not loading**: The `.nojekyll` file should fix this
- **Custom domain not working**: 
  - Verify DNS records are correct
  - Wait up to 24 hours for DNS propagation
  - Check that CNAME file exists in the deployed site

## Local Development

To preview locally before deploying:

```powershell
npx quartz build --serve
```

Then visit http://localhost:8080
