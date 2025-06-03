<?php

$url = 'http://localhost:8000/api/login';
$data = [
    'email' => 'test.employer@example.com',
    'password' => 'password123'
];

$options = [
    'http' => [
        'header' => "Content-Type: application/json\r\n" .
                   "Accept: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
echo "Testing login API: $url\n";
echo "Payload: " . json_encode($data) . "\n";

$result = file_get_contents($url, false, $context);

if ($result === false) {
    echo "Error: Failed to login\n";
    if (isset($http_response_header)) {
        echo "Response headers:\n";
        foreach ($http_response_header as $header) {
            echo "  $header\n";
        }
    }
} else {
    echo "Success!\n";
    echo "Response: $result\n";
    
    $data = json_decode($result, true);
    if ($data && isset($data['status'])) {
        echo "Login status: " . $data['status'] . "\n";
        if (isset($data['data']['role'])) {
            echo "User role: " . $data['data']['role'] . "\n";
        }
    }
}
