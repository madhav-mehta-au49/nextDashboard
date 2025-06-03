<?php

require_once __DIR__ . '/vendor/autoload.php';

// Load Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "Checking for test user...\n";

$user = User::where('email', 'test.employer@example.com')->first();

if ($user) {
    echo "✓ User found: {$user->email} (ID: {$user->id}, Role: {$user->role})\n";
    
    // Test password verification
    if (Hash::check('password123', $user->password)) {
        echo "✓ Password is correct\n";
    } else {
        echo "✗ Password is incorrect\n";
    }
    
    // Check company associations
    $companies = $user->administeredCompanies()->count();
    echo "✓ User administered companies: {$companies}\n";
    
} else {
    echo "✗ User NOT found\n";
    echo "Creating test user...\n";
    
    $user = User::create([
        'name' => 'Test Employer',
        'email' => 'test.employer@example.com',
        'password' => Hash::make('password123'),
        'role' => 'employer'
    ]);
    
    echo "✓ User created: {$user->email} (ID: {$user->id})\n";
}

echo "Total users in database: " . User::count() . "\n";
