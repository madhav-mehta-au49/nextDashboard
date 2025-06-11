<?php
// Test OAuth configuration

require_once __DIR__ . '/vendor/autoload.php';

// Load Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Testing OAuth Configuration ===\n\n";

// Check if the required packages are installed
echo "Checking Laravel Socialite: ";
if (class_exists('Laravel\Socialite\Facades\Socialite')) {
    echo "✅ INSTALLED\n";
} else {
    echo "❌ NOT INSTALLED - Please run: composer require laravel/socialite\n";
    exit(1);
}

// Check Google configuration
echo "\nGoogle OAuth Configuration:\n";
echo "GOOGLE_CLIENT_ID: ";
$googleClientId = config('services.google.client_id');
if ($googleClientId) {
    echo "✅ CONFIGURED";
    if ($googleClientId === env('GOOGLE_CLIENT_ID')) {
        echo " (using env value)";
    }
    echo "\n";
} else {
    echo "❌ MISSING - Please add GOOGLE_CLIENT_ID to your .env file\n";
}

echo "GOOGLE_CLIENT_SECRET: ";
$googleClientSecret = config('services.google.client_secret');
if ($googleClientSecret) {
    echo "✅ CONFIGURED";
    if ($googleClientSecret === env('GOOGLE_CLIENT_SECRET')) {
        echo " (using env value)";
    }
    echo "\n";
} else {
    echo "❌ MISSING - Please add GOOGLE_CLIENT_SECRET to your .env file\n";
}

echo "GOOGLE_REDIRECT_URI: " . config('services.google.redirect') . "\n";

// Check LinkedIn configuration
echo "\nLinkedIn OAuth Configuration:\n";
echo "LINKEDIN_CLIENT_ID: ";
$linkedinClientId = config('services.linkedin.client_id');
if ($linkedinClientId) {
    echo "✅ CONFIGURED";
    if ($linkedinClientId === env('LINKEDIN_CLIENT_ID')) {
        echo " (using env value)";
    }
    echo "\n";
} else {
    echo "❌ MISSING - Please add LINKEDIN_CLIENT_ID to your .env file\n";
}

echo "LINKEDIN_CLIENT_SECRET: ";
$linkedinClientSecret = config('services.linkedin.client_secret');
if ($linkedinClientSecret) {
    echo "✅ CONFIGURED";
    if ($linkedinClientSecret === env('LINKEDIN_CLIENT_SECRET')) {
        echo " (using env value)";
    }
    echo "\n";
} else {
    echo "❌ MISSING - Please add LINKEDIN_CLIENT_SECRET to your .env file\n";
}

echo "LINKEDIN_REDIRECT_URI: " . config('services.linkedin.redirect') . "\n";

// Check routes
echo "\nChecking OAuth Routes:\n";

$routes = app('router')->getRoutes();
$hasGoogleRedirectRoute = false;
$hasGoogleCallbackRoute = false;
$hasLinkedinRedirectRoute = false;
$hasLinkedinCallbackRoute = false;

foreach ($routes->getRoutes() as $route) {
    if ($route->uri() === 'auth/google') {
        $hasGoogleRedirectRoute = true;
    }
    if ($route->uri() === 'auth/google/callback') {
        $hasGoogleCallbackRoute = true;
    }
    if ($route->uri() === 'auth/linkedin') {
        $hasLinkedinRedirectRoute = true;
    }
    if ($route->uri() === 'auth/linkedin/callback') {
        $hasLinkedinCallbackRoute = true;
    }
}

echo "Google Redirect Route: " . ($hasGoogleRedirectRoute ? "✅ FOUND" : "❌ NOT FOUND") . "\n";
echo "Google Callback Route: " . ($hasGoogleCallbackRoute ? "✅ FOUND" : "❌ NOT FOUND") . "\n";
echo "LinkedIn Redirect Route: " . ($hasLinkedinRedirectRoute ? "✅ FOUND" : "❌ NOT FOUND") . "\n";
echo "LinkedIn Callback Route: " . ($hasLinkedinCallbackRoute ? "✅ FOUND" : "❌ NOT FOUND") . "\n";

// Check callback controller method
echo "\nChecking OAuth Controller Methods:\n";

$authController = new App\Http\Controllers\AuthController();
echo "redirectToProvider method: " . (method_exists($authController, 'redirectToProvider') ? "✅ FOUND" : "❌ NOT FOUND") . "\n";
echo "handleProviderCallback method: " . (method_exists($authController, 'handleProviderCallback') ? "✅ FOUND" : "❌ NOT FOUND") . "\n";

echo "\n=== OAuth Configuration Test Complete ===\n";
