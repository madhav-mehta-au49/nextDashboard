<?php

// Simple HTTP client to test the endpoint
$url = 'http://localhost:8000/api/test/company/dashboard';

$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => "Accept: application/json\r\n" .
                   "Content-Type: application/json\r\n"
    ]
]);

echo "Testing endpoint: $url\n";

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
    echo "Response:\n";
    echo $response . "\n";
    
    // Try to parse as JSON
    $data = json_decode($response, true);
    if ($data) {
        echo "\nParsed JSON:\n";
        print_r($data);
    }
}
