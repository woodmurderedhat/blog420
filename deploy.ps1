Write-Host "Building Quartz site..."
npx quartz build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deploying to gh-pages..."
    npx gh-pages -d public
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deployment successful!"
    } else {
        Write-Host "Deployment failed."
    }
} else {
    Write-Host "Build failed."
}