<?php

// Simple script to check OAuth configuration
require __DIR__ . '/vendor/autoload.php';

// Load Laravel's environment
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

echo "=== OAuth Configuration Check ===\n";
echo "Google Client ID: " . ($_ENV['GOOGLE_CLIENT_ID'] ?? 'NOT_SET') . "\n";
echo "Google Client Secret: " . (isset($_ENV['GOOGLE_CLIENT_SECRET']) ? 'SET (' . strlen($_ENV['GOOGLE_CLIENT_SECRET']) . ' chars)' : 'NOT_SET') . "\n";
echo "App URL: " . ($_ENV['APP_URL'] ?? 'NOT_SET') . "\n";
echo "Frontend URL: " . ($_ENV['FRONTEND_URL'] ?? 'NOT_SET') . "\n";
echo "Session HTTP Only: " . ($_ENV['SESSION_HTTP_ONLY'] ?? 'NOT_SET') . "\n";
echo "Session Same Site: " . ($_ENV['SESSION_SAME_SITE'] ?? 'NOT_SET') . "\n";

// Check if redirect URI would match Google OAuth configuration
$expectedRedirectUri = ($_ENV['APP_URL'] ?? 'http://localhost:8000') . '/auth/google/callback';
echo "\nExpected Google OAuth Redirect URI: " . $expectedRedirectUri . "\n";

// Check SSL settings
echo "\nSSL Configuration:\n";
echo "CURLOPT_SSL_VERIFYPEER: " . ($_ENV['CURLOPT_SSL_VERIFYPEER'] ?? 'NOT_SET') . "\n";
echo "CURLOPT_SSL_VERIFYHOST: " . ($_ENV['CURLOPT_SSL_VERIFYHOST'] ?? 'NOT_SET') . "\n";

echo "\n=== End Configuration Check ===\n";
