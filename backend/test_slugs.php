<?php
// Simple test script to check user slug generation

// Include the autoloader
require __DIR__ . '/vendor/autoload.php';

// Load .env
$dotenv = \Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Load application
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Test slug generation
$user = new \App\Models\User();
$user->name = "Test User " . rand(1000, 9999);
$user->email = "test" . rand(1000, 9999) . "@example.com";
$user->password = \Illuminate\Support\Facades\Hash::make('password');
$user->save();

echo "Created user: {$user->name} (ID: {$user->id})\n";
echo "Generated slug: {$user->slug}\n";

// Test slug uniqueness
$user2 = new \App\Models\User();
$user2->name = $user->name; // Same name should generate unique slug
$user2->email = "test" . rand(1000, 9999) . "@example.com";
$user2->password = \Illuminate\Support\Facades\Hash::make('password');
$user2->save();

echo "Created second user: {$user2->name} (ID: {$user2->id})\n";
echo "Generated slug: {$user2->slug}\n";

// Create a candidate for the first user
$candidate = new \App\Models\Candidate();
$candidate->user_id = $user->id;
$candidate->headline = "Test Candidate";
$candidate->about = "This is a test candidate profile";
$candidate->desired_job_title = "Software Developer";
$candidate->save();

echo "Created candidate for {$user->name} (Candidate ID: {$candidate->id})\n";
echo "Candidate profile should be available at URL: /user/candidate/{$user->slug}\n";
