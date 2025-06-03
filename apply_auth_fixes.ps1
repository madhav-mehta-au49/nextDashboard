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
