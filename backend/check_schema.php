<?php

require_once __DIR__ . '/vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Database connection
$host = $_ENV['DB_HOST'];
$dbname = $_ENV['DB_DATABASE'];
$username = $_ENV['DB_USERNAME'];
$password = $_ENV['DB_PASSWORD'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Database connection successful\n\n";
    
    // Check the structure of the status column
    $stmt = $pdo->prepare("SHOW COLUMNS FROM job_listings WHERE Field = 'status'");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "Status column details:\n";
    echo json_encode($result, JSON_PRETTY_PRINT) . "\n\n";
    
    // Also check the current job listings and their statuses
    echo "Current job listings and their statuses:\n";
    $stmt = $pdo->prepare("SELECT id, title, status FROM job_listings LIMIT 10");
    $stmt->execute();
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($jobs as $job) {
        echo "ID: {$job['id']}, Title: {$job['title']}, Status: {$job['status']}\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
}
