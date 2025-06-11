<?php

// Test OAuth configuration and SSL bypass
require_once 'vendor/autoload.php';

use Laravel\Socialite\Facades\Socialite;
use GuzzleHttp\Client;

echo "=== OAuth Configuration Test ===\n";

// Test 1: Check environment variables
echo "\n1. Environment Variables:\n";
echo "APP_ENV: " . env('APP_ENV', 'not_set') . "\n";
echo "GOOGLE_CLIENT_ID: " . (env('GOOGLE_CLIENT_ID') ? 'Set (' . strlen(env('GOOGLE_CLIENT_ID')) . ' chars)' : 'Not set') . "\n";
echo "GOOGLE_CLIENT_SECRET: " . (env('GOOGLE_CLIENT_SECRET') ? 'Set (' . strlen(env('GOOGLE_CLIENT_SECRET')) . ' chars)' : 'Not set') . "\n";
echo "GOOGLE_REDIRECT_URI: " . env('GOOGLE_REDIRECT_URI', 'not_set') . "\n";
echo "CURLOPT_SSL_VERIFYPEER: " . env('CURLOPT_SSL_VERIFYPEER', 'not_set') . "\n";
echo "CURLOPT_SSL_VERIFYHOST: " . env('CURLOPT_SSL_VERIFYHOST', 'not_set') . "\n";

// Test 2: Test SSL bypass with direct cURL
echo "\n2. Testing SSL bypass with cURL:\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://oauth2.googleapis.com/token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=authorization_code&code=invalid');

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

echo "HTTP Code: " . $http_code . "\n";
echo "cURL Error: " . ($curl_error ?: 'None') . "\n";
echo "Response length: " . strlen($response) . " bytes\n";

// Test 3: Test Guzzle HTTP client with SSL bypass
echo "\n3. Testing Guzzle HTTP client with SSL bypass:\n";
try {
    $client = new Client([
        'verify' => false,
        'timeout' => 10,
        'connect_timeout' => 5,
        'curl' => [
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
        ],
    ]);
    
    $response = $client->post('https://oauth2.googleapis.com/token', [
        'form_params' => [
            'grant_type' => 'authorization_code',
            'code' => 'invalid',
        ]
    ]);
    
    echo "Guzzle HTTP Code: " . $response->getStatusCode() . "\n";
    echo "Guzzle Response: Success (SSL bypass working)\n";
    
} catch (\GuzzleHttp\Exception\ClientException $e) {
    echo "Guzzle HTTP Code: " . $e->getResponse()->getStatusCode() . "\n";
    echo "Guzzle Response: " . $e->getMessage() . "\n";
    echo "SSL bypass working (expected 400 error for invalid code)\n";
} catch (\Exception $e) {
    echo "Guzzle Error: " . $e->getMessage() . "\n";
    if (strpos($e->getMessage(), 'SSL') !== false) {
        echo "SSL bypass NOT working\n";
    }
}

// Test 4: Check Laravel configuration
echo "\n4. Laravel Configuration:\n";
if (function_exists('config')) {
    echo "Services Google Config: " . json_encode(config('services.google')) . "\n";
    echo "App Environment: " . config('app.env') . "\n";
    echo "App Debug: " . (config('app.debug') ? 'true' : 'false') . "\n";
} else {
    echo "Laravel config function not available (run this from Laravel context)\n";
}

echo "\n=== Test Complete ===\n";
