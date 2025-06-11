$ErrorActionPreference = "Stop"

# Check if js-cookie is installed
$packageJson = Get-Content -Path "./package.json" | ConvertFrom-Json

$jsookieInstalled = $false
if ($packageJson.dependencies.'js-cookie') {
    $jsookieInstalled = $true
    Write-Host "js-cookie is already installed"
} else {
    Write-Host "Installing js-cookie..."
    npm install js-cookie @types/js-cookie --legacy-peer-deps
}

# Apply the fixes
Write-Host "Applying fixes to login page and middleware..."

# Backup existing files
if (Test-Path -Path "./app/login/page.tsx") {
    Copy-Item -Path "./app/login/page.tsx" -Destination "./app/login/page.tsx.bak" -Force
    Write-Host "Backed up login page to ./app/login/page.tsx.bak"
}

# New OAuth-specific fixes
Write-Host "`nApplying Google OAuth authentication fixes..." -ForegroundColor Green

# 1. Clear Laravel caches
Write-Host "Clearing Laravel caches..." -ForegroundColor Cyan
Set-Location -Path "C:\Users\mehta\OneDrive\Desktop\office_work\nextdashboard\backend"
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# 2. Verify Google OAuth configuration
Write-Host "Verifying Google OAuth configuration..." -ForegroundColor Cyan
php test_oauth_callback.php

# 3. Display important information
Write-Host "`nImportant OAuth Fixes Applied:" -ForegroundColor Yellow
Write-Host "1. Added detailed logging to OAuth controllers"
Write-Host "2. Fixed session configuration for cross-domain cookies"
Write-Host "3. Improved role handling in OAuth flow"
Write-Host "4. Enhanced error reporting for OAuth issues"

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Verify that your Google OAuth Redirect URIs are properly configured in Google Developer Console"
Write-Host "   - http://localhost:8000/auth/google/callback"
Write-Host "   - http://localhost:3000/api/auth/callback/google"
Write-Host "2. Restart your Laravel backend server"
Write-Host "3. Restart your Next.js frontend server"
Write-Host "4. Test the Google OAuth login flow"

Write-Host "`nTo restart servers:" -ForegroundColor Cyan
Write-Host "Backend: cd backend && php artisan serve"
Write-Host "Frontend: npm run dev"

Write-Host "`nOAuth Debug Mode is now enabled. Check Laravel logs at:" -ForegroundColor Green
Write-Host "backend/storage/logs/laravel.log"

if (Test-Path -Path "./middleware.ts") {
    Copy-Item -Path "./middleware.ts" -Destination "./middleware.ts.bak" -Force
    Write-Host "Backed up middleware to ./middleware.ts.bak"
}

# Apply the new files
if (Test-Path -Path "./app/login/page.tsx.new") {
    Move-Item -Path "./app/login/page.tsx.new" -Destination "./app/login/page.tsx" -Force
    Write-Host "Updated login page successfully"
}

if (Test-Path -Path "./middleware.ts.new") {
    Move-Item -Path "./middleware.ts.new" -Destination "./middleware.ts" -Force
    Write-Host "Updated middleware successfully"
}

Write-Host "All fixes applied! Please test the login functionality now."
