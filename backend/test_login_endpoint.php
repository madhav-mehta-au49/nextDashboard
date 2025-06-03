<?php

// Test the login endpoint directly
$url = 'http://localhost:8000/login';

$data = json_encode([
    'email' => 'test.employer@example.com',
    'password' => 'password123'
]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n" .
                   "Accept: application/json\r\n" .
                   "X-Requested-With: XMLHttpRequest\r\n",
        'content' => $data
    ]
]);

echo "Testing login endpoint with test.employer@example.com...\n";
echo "URL: $url\n";
echo "Data: $data\n\n";

$response = file_get_contents($url, false, $context);

if ($response === false) {
    echo "Error: Failed to get response\n";
    if (isset($http_response_header)) {
        echo "Response headers:\n";
        foreach ($http_response_header as $header) {
            echo "  $header\n";
        }
    }
} else {
    echo "Response received:\n";
    echo $response . "\n\n";
    
    // Try to parse as JSON
    $data = json_decode($response, true);
    if ($data) {
        echo "Parsed JSON:\n";
        print_r($data);
        
        if (isset($data['status'])) {
            echo "\nLogin Status: " . $data['status'] . "\n";
            if (isset($data['data']['role'])) {
                echo "User Role: " . $data['data']['role'] . "\n";
            }
            if (isset($data['message'])) {
                echo "Message: " . $data['message'] . "\n";
            }
        }
    }
}
