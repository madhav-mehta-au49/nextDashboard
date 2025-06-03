<?php

echo "Testing company dashboard API endpoint...\n";

// First, test the login endpoint
$loginData = [
    'email' => 'test.employer@example.com',
    'password' => 'password123'
];

$loginOptions = [
    'http' => [
        'header' => "Content-Type: application/json\r\nAccept: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($loginData)
    ]
];

$loginContext = stream_context_create($loginOptions);
$loginResponse = file_get_contents('http://localhost:8000/login', false, $loginContext);

if ($loginResponse === false) {
    echo "Failed to call login endpoint\n";
    exit(1);
}

echo "Login response: " . $loginResponse . "\n";

// Parse the response
$loginResult = json_decode($loginResponse, true);

if (!$loginResult || $loginResult['status'] !== 'success') {
    echo "Login failed\n";
    exit(1);
}

echo "Login successful!\n";

// Get session cookie from headers
$sessionCookie = null;
foreach ($http_response_header as $header) {
    if (strpos($header, 'Set-Cookie:') === 0) {
        $sessionCookie = substr($header, 12);
        break;
    }
}

if (!$sessionCookie) {
    echo "No session cookie found\n";
    exit(1);
}

echo "Session cookie: " . $sessionCookie . "\n";

// Now test the company dashboard endpoint
$dashboardOptions = [
    'http' => [
        'header' => "Accept: application/json\r\nCookie: " . $sessionCookie . "\r\n",
        'method' => 'GET'
    ]
];

$dashboardContext = stream_context_create($dashboardOptions);
$dashboardResponse = file_get_contents('http://localhost:8000/api/company/dashboard', false, $dashboardContext);

if ($dashboardResponse === false) {
    echo "Failed to call dashboard endpoint\n";
    foreach ($http_response_header as $header) {
        echo "Header: $header\n";
    }
    exit(1);
}

echo "Dashboard response: " . $dashboardResponse . "\n";

// Parse the dashboard response
$dashboardResult = json_decode($dashboardResponse, true);

if ($dashboardResult && $dashboardResult['status'] === 'success') {
    echo "✅ Company dashboard endpoint working!\n";
    echo "Stats: " . json_encode($dashboardResult['data']['stats'], JSON_PRETTY_PRINT) . "\n";
} else {
    echo "❌ Company dashboard returned error\n";
    if ($dashboardResult) {
        echo "Error: " . ($dashboardResult['message'] ?? 'Unknown error') . "\n";
    }
}

echo "Test complete!\n";
