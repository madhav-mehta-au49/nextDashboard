<?php
// filepath: c:\Users\mehta\OneDrive\Desktop\office_work\nextdashboard\backend\test_oauth_callback.php
// Simple script to verify OAuth configuration

require __DIR__.'/vendor/autoload.php';

// Load the .env file directly
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Just testing OAuth configuration
echo "OAuth Configuration Test\n";
echo "=======================\n\n";

echo "APP_URL: " . $_ENV['APP_URL'] . "\n";
echo "FRONTEND_URL: " . $_ENV['FRONTEND_URL'] . "\n";
echo "Google Client ID: " . $_ENV['GOOGLE_CLIENT_ID'] . "\n";
echo "Google Client Secret: " . substr($_ENV['GOOGLE_CLIENT_SECRET'], 0, 5) . "...[hidden]\n";

echo "\nRedirect URLs:\n";
echo "Laravel redirect URL: " . $_ENV['APP_URL'] . "/auth/google/callback\n";
echo "Frontend callback URL: " . $_ENV['FRONTEND_URL'] . "/api/auth/callback/google\n";

echo "\nSession Settings:\n";
echo "SESSION_DRIVER: " . $_ENV['SESSION_DRIVER'] . "\n";
echo "SESSION_LIFETIME: " . $_ENV['SESSION_LIFETIME'] . "\n";
echo "SESSION_ENCRYPT: " . $_ENV['SESSION_ENCRYPT'] . "\n";
echo "SESSION_DOMAIN: " . $_ENV['SESSION_DOMAIN'] . "\n";
echo "SESSION_SECURE_COOKIE: " . $_ENV['SESSION_SECURE_COOKIE'] . "\n";
echo "SESSION_HTTP_ONLY: " . $_ENV['SESSION_HTTP_ONLY'] . "\n";
echo "SESSION_SAME_SITE: " . $_ENV['SESSION_SAME_SITE'] . "\n";

echo "\nImportant Note:\n";
echo "Make sure these URLs match what you've configured in the Google OAuth Console:\n";
echo "- " . $_ENV['APP_URL'] . "/auth/google/callback\n";
echo "- " . $_ENV['FRONTEND_URL'] . "/api/auth/callback/google\n";

// Check for Google OAuth credentials JSON file
$googleCredentialsPath = __DIR__ . '/../client_secret_455773941890-a1vdqn0rouq10c82sqn5d26e8j7mbr37.apps.googleusercontent.com.json';
if (file_exists($googleCredentialsPath)) {
    $credentials = json_decode(file_get_contents($googleCredentialsPath), true);
    if (isset($credentials['web'])) {
        echo "\nGoogle OAuth JSON Credentials Found:\n";
        echo "Client ID: " . $credentials['web']['client_id'] . "\n";
        echo "Authorized Redirect URIs:\n";
        foreach ($credentials['web']['redirect_uris'] as $uri) {
            echo "- " . $uri . "\n";
        }
    }
}
