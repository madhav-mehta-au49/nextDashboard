<?php

require_once __DIR__ . '/vendor/autoload.php';

// Load Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Auth;

echo "Testing company dashboard endpoint...\n";

// Get the test user
$user = User::where('email', 'test.employer@example.com')->first();

if (!$user) {
    echo "Test user not found. Run test_simple_setup.php first.\n";
    exit(1);
}

echo "Found test user: {$user->email} (Role: {$user->role})\n";

// Simulate authentication
Auth::login($user);
echo "User authenticated\n";

// Test the administered companies relationship
$administeredCompanies = $user->administeredCompanies;
echo "Administered companies count: {$administeredCompanies->count()}\n";

// Test the pluck that was causing issues
try {
    $companyIds = $user->administeredCompanies()->pluck('companies.id')->toArray();
    echo "Company IDs from qualified pluck: " . implode(', ', $companyIds) . "\n";
} catch (Exception $e) {
    echo "Error with qualified pluck: " . $e->getMessage() . "\n";
    
    // Try alternative approaches
    try {
        $companyIds = $user->administeredCompanies()->select('companies.id')->pluck('id')->toArray();
        echo "Company IDs from select+pluck: " . implode(', ', $companyIds) . "\n";
    } catch (Exception $e2) {
        echo "Error with select+pluck: " . $e2->getMessage() . "\n";
        
        // Try the collection approach
        $companyIds = $user->administeredCompanies->pluck('id')->toArray();
        echo "Company IDs from collection pluck: " . implode(', ', $companyIds) . "\n";
    }
}

echo "Test complete!\n";
