<?php
// Check Google OAuth credentials

require_once 'backend/vendor/autoload.php';

// Load environment variables from .env if it exists
if (file_exists('backend/.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable('backend');
    $dotenv->load();
    
    echo "Reading Google OAuth configuration from backend/.env\n";
    echo "====================================================\n\n";
    
    $clientId = getenv('GOOGLE_CLIENT_ID');
    $clientSecret = getenv('GOOGLE_CLIENT_SECRET');
    $appUrl = getenv('APP_URL');
    
    echo "GOOGLE_CLIENT_ID: " . ($clientId ? substr($clientId, 0, 10) . '...' : 'NOT SET') . "\n";
    echo "GOOGLE_CLIENT_SECRET: " . ($clientSecret ? 'CONFIGURED' : 'NOT SET') . "\n";
    echo "APP_URL: " . ($appUrl ?: 'NOT SET') . "\n\n";
    
    if ($clientId && $clientSecret && $appUrl) {
        echo "✓ Google OAuth configuration appears to be complete.\n";
        echo "Full redirect URL should be: " . rtrim($appUrl, '/') . "/auth/google/callback\n\n";
        
        // Compare with the client_secret.json file
        $clientSecretFile = 'C:\Users\mehta\Downloads\client_secret_455773941890-a1vdqn0rouq10c82sqn5d26e8j7mbr37.apps.googleusercontent.com.json';
        if (file_exists($clientSecretFile)) {
            $googleConfig = json_decode(file_get_contents($clientSecretFile), true);
            
            if (isset($googleConfig['web'])) {
                echo "Checking against downloaded client_secret.json file:\n";
                echo "- Client ID: " . (substr($googleConfig['web']['client_id'], 0, 10) . '...') . "\n";
                
                if ($googleConfig['web']['client_id'] === $clientId) {
                    echo "✓ Client ID matches\n";
                } else {
                    echo "✗ Client IDs don't match\n";
                    echo "  .env: " . $clientId . "\n";
                    echo "  client_secret.json: " . $googleConfig['web']['client_id'] . "\n";
                }
                
                if ($googleConfig['web']['client_secret'] === $clientSecret) {
                    echo "✓ Client Secret matches\n";
                } else {
                    echo "✗ Client Secrets don't match\n";
                }
                
                // Check redirect URIs
                echo "\nAuthorized redirect URIs in client_secret.json:\n";
                if (isset($googleConfig['web']['redirect_uris'])) {
                    foreach ($googleConfig['web']['redirect_uris'] as $uri) {
                        echo "- $uri\n";
                    }
                }
            }
        } else {
            echo "Client secret file not found at expected location. Manual verification required.\n";
        }
    } else {
        echo "✗ Google OAuth configuration is incomplete.\n";
        echo "Please add the missing values to backend/.env file.\n";
    }
} else {
    echo "ERROR: .env file not found in the backend directory.\n";
    echo "Please create a .env file with your Google OAuth credentials.\n";
}
