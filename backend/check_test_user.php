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
    echo "✓ User found: {$user->email}\n";
    echo "  ID: {$user->id}\n";
    echo "  Name: {$user->name}\n";
    echo "  Role: {$user->role}\n";
    echo "  Created: {$user->created_at}\n";
    
    // Test password verification
    $passwordTest = Hash::check('password123', $user->password);
    echo "  Password test: " . ($passwordTest ? "✓ CORRECT" : "✗ INCORRECT") . "\n";
    
    // Check company associations
    $companies = $user->administeredCompanies()->count();
    echo "  Administered companies: {$companies}\n";
    
} else {
    echo "✗ User NOT found\n";
    echo "Creating test user...\n";
    
    // Create the user
    $user = User::create([
        'name' => 'Test Employer',
        'email' => 'test.employer@example.com',
        'password' => Hash::make('password123'),
        'role' => 'employer'
    ]);
    
    echo "✓ Test user created: {$user->email} (ID: {$user->id})\n";
}

echo "\nTotal users in database: " . User::count() . "\n";

// List all employer users
echo "\nAll employer users:\n";
$employers = User::where('role', 'employer')->get();
foreach ($employers as $emp) {
    echo "  - {$emp->email} (ID: {$emp->id})\n";
}
