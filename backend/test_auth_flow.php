<?php

// Test the complete authentication flow
$testEmail = 'test.employer@example.com';
$testPassword = 'password123';

echo "Testing complete authentication flow...\n";

// Step 1: Login
$loginData = json_encode([
    'email' => $testEmail,
    'password' => $testPassword
]);

$loginContext = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n" .
                   "Accept: application/json\r\n",
        'content' => $loginData
    ]
]);

echo "1. Testing login...\n";
$loginResponse = file_get_contents('http://localhost:8000/api/login', false, $loginContext);

if ($loginResponse) {
    $loginData = json_decode($loginResponse, true);
    echo "   ✓ Login successful: " . $loginData['status'] . "\n";
    echo "   ✓ User role: " . $loginData['data']['role'] . "\n";
    
    // Extract cookies from the response headers
    $cookies = [];
    foreach ($http_response_header as $header) {
        if (strpos($header, 'Set-Cookie:') === 0) {
            $cookies[] = trim(substr($header, 11));
        }
    }
    
    if (!empty($cookies)) {
        echo "   ✓ Session cookies received\n";
        
        // Step 2: Test protected endpoint with session
        echo "2. Testing company dashboard with session...\n";
        
        $cookieHeader = 'Cookie: ' . implode('; ', $cookies);
        $dashboardContext = stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => "Accept: application/json\r\n" . $cookieHeader . "\r\n"
            ]
        ]);
        
        $dashboardResponse = file_get_contents('http://localhost:8000/api/company/dashboard', false, $dashboardContext);
        
        if ($dashboardResponse) {
            $dashboardData = json_decode($dashboardResponse, true);
            echo "   ✓ Dashboard access successful: " . $dashboardData['status'] . "\n";
            echo "   ✓ Companies accessible: " . count($dashboardData['data']['companies']) . "\n";
            echo "   ✓ Total jobs: " . $dashboardData['data']['stats']['total_jobs'] . "\n";
        } else {
            echo "   ✗ Dashboard access failed\n";
        }
    } else {
        echo "   ✗ No session cookies received\n";
    }
} else {
    echo "   ✗ Login failed\n";
}

echo "\nAuthentication flow test complete!\n";
