Write-Host "🚀 Building React App..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Build failed! Fix errors and try again." -ForegroundColor Red
  exit 1
}

Write-Host "☁️ Uploading build to S3 bucket: photo-frontend-pranit..." -ForegroundColor Cyan
aws s3 sync build/ s3://photo-frontend-pranit --delete

if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ S3 upload failed! Check your AWS CLI configuration." -ForegroundColor Red
  exit 1
}

Write-Host "🧹 Creating CloudFront cache invalidation..." -ForegroundColor Cyan
aws cloudfront create-invalidation --distribution-id E2BPJRH3GUIOSG --paths "/*"

if ($LASTEXITCODE -ne 0) {
  Write-Host "⚠️ Cache invalidation failed — check CloudFront permissions." -ForegroundColor Yellow
} else {
  Write-Host "✅ Cache invalidation successful!" -ForegroundColor Green
}

Write-Host "`n🌐 Deployment complete!"
Write-Host "Your live site: https://dzewjfie62mf2.cloudfront.net" -ForegroundColor Green
