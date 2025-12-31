# Blog Enhancement Verification Script
# Run this in PowerShell to verify all enhancements are in place

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Blog Enhancement Verification" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

$baseDir = "c:\Users\Stephanus\Documents\New folder\blog420"
Set-Location $baseDir

Write-Host "Checking Gamification Files..." -ForegroundColor Cyan

# JavaScript Files
$jsFiles = @(
    "assets\js\gamification.js",
    "assets\js\bonus-features.js"
)

foreach ($file in $jsFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file MISSING!" -ForegroundColor Red
    }
}

Write-Host "`nChecking SEO Files..." -ForegroundColor Cyan

# SEO Files
$seoFiles = @(
    "_includes\seo.html",
    "_includes\social-share.html",
    "_includes\breadcrumbs.html",
    "robots.txt",
    "sitemap.xml",
    "feed.xml"
)

foreach ($file in $seoFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file MISSING!" -ForegroundColor Red
    }
}

Write-Host "`nChecking Documentation..." -ForegroundColor Cyan

# Documentation Files
$docFiles = @(
    "GAMIFICATION_GUIDE.md",
    "QUICK_REFERENCE.md",
    "IMPLEMENTATION_SUMMARY.md",
    "DEPLOYMENT_CHECKLIST.md",
    "SEO_ENHANCEMENTS.md",
    "COMPLETE_ENHANCEMENTS_SUMMARY.md",
    "gamification-demo.md"
)

foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file MISSING!" -ForegroundColor Red
    }
}

Write-Host "`nChecking Modified Files..." -ForegroundColor Cyan

# Check if files contain expected content
$defaultHtml = Get-Content "_layouts\default.html" -Raw
if ($defaultHtml -match "gamification.js" -and $defaultHtml -match "seo.html") {
    Write-Host "  ✓ _layouts\default.html (scripts integrated)" -ForegroundColor Green
} else {
    Write-Host "  ✗ _layouts\default.html (missing scripts)" -ForegroundColor Red
}

$postHtml = Get-Content "_layouts\post.html" -Raw
if ($postHtml -match "breadcrumbs.html" -and $postHtml -match "social-share.html") {
    Write-Host "  ✓ _layouts\post.html (SEO integrated)" -ForegroundColor Green
} else {
    Write-Host "  ✗ _layouts\post.html (missing SEO)" -ForegroundColor Red
}

$css = Get-Content "assets\css\style.css" -Raw
if ($css -match "GAMIFICATION STYLES") {
    Write-Host "  ✓ assets\css\style.css (gamification CSS added)" -ForegroundColor Green
} else {
    Write-Host "  ✗ assets\css\style.css (missing gamification CSS)" -ForegroundColor Red
}

Write-Host "`nChecking Required Image Directory..." -ForegroundColor Cyan

if (Test-Path "assets\images") {
    Write-Host "  ✓ assets\images\ directory exists" -ForegroundColor Green
    
    # Check for images
    $images = @(
        "favicon-16x16.png",
        "favicon-32x32.png",
        "apple-touch-icon.png",
        "logo.png",
        "social-share.png"
    )
    
    Write-Host "`n  Required images (create these):" -ForegroundColor Yellow
    foreach ($img in $images) {
        if (Test-Path "assets\images\$img") {
            Write-Host "    ✓ $img" -ForegroundColor Green
        } else {
            Write-Host "    ⚠ $img (needs to be created)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "  ✗ assets\images\ directory MISSING!" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Configuration Check" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

$config = Get-Content "_config.yml" -Raw

Write-Host "Checking _config.yml settings..." -ForegroundColor Cyan

if ($config -match "twitter:") {
    Write-Host "  ✓ Twitter settings present" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Twitter settings missing (optional)" -ForegroundColor Yellow
}

if ($config -match "social:") {
    Write-Host "  ✓ Social links present" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Social links missing (optional)" -ForegroundColor Yellow
}

if ($config -match "google_analytics") {
    Write-Host "  ✓ Analytics placeholder present" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Analytics settings missing (optional)" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Summary" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Core Features:" -ForegroundColor White
Write-Host "  • Gamification System: " -NoNewline
if ((Test-Path "assets\js\gamification.js") -and ($css -match "GAMIFICATION")) {
    Write-Host "READY ✓" -ForegroundColor Green
} else {
    Write-Host "INCOMPLETE ✗" -ForegroundColor Red
}

Write-Host "  • SEO Optimization: " -NoNewline
if ((Test-Path "_includes\seo.html") -and (Test-Path "sitemap.xml")) {
    Write-Host "READY ✓" -ForegroundColor Green
} else {
    Write-Host "INCOMPLETE ✗" -ForegroundColor Red
}

Write-Host "  • Social Sharing: " -NoNewline
if (Test-Path "_includes\social-share.html") {
    Write-Host "READY ✓" -ForegroundColor Green
} else {
    Write-Host "INCOMPLETE ✗" -ForegroundColor Red
}

Write-Host "  • Documentation: " -NoNewline
if ((Test-Path "GAMIFICATION_GUIDE.md") -and (Test-Path "SEO_ENHANCEMENTS.md")) {
    Write-Host "READY ✓" -ForegroundColor Green
} else {
    Write-Host "INCOMPLETE ✗" -ForegroundColor Red
}

Write-Host "`nNext Steps:" -ForegroundColor White
Write-Host "  1. Create favicon and social share images" -ForegroundColor Yellow
Write-Host "  2. Update _config.yml with your details" -ForegroundColor Yellow
Write-Host "  3. Test locally: bundle exec jekyll serve" -ForegroundColor Yellow
Write-Host "  4. Deploy to production" -ForegroundColor Yellow

Write-Host "`nFor detailed guides, see:" -ForegroundColor White
Write-Host "  • COMPLETE_ENHANCEMENTS_SUMMARY.md" -ForegroundColor Cyan
Write-Host "  • DEPLOYMENT_CHECKLIST.md" -ForegroundColor Cyan
Write-Host "  • assets\images\README.md (for image specs)" -ForegroundColor Cyan

Write-Host "`n========================================`n" -ForegroundColor Green
