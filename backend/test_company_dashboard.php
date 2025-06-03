<?php

require_once __DIR__ . '/vendor/autoload.php';

// Load Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Company;

echo "Setting up test data for company dashboard...\n";

// Create a test user with employer role
$user = User::firstOrCreate(
    ['email' => 'test.employer@example.com'],
    [
        'name' => 'Test Employer',
        'password' => bcrypt('password123'),
        'role' => 'employer'
    ]
);

echo "Test user: {$user->email} (ID: {$user->id})\n";

// Create a test company
$company = Company::firstOrCreate(
    ['slug' => 'test-company'],
    [
        'name' => 'Test Company',
        'description' => 'A test company for dashboard testing',
        'website' => 'https://testcompany.com',
        'headquarters' => 'Test City',
        'industry' => 'Technology',
        'size' => '50-100'
    ]
);

echo "Test company: {$company->name} (ID: {$company->id})\n";

// Associate user with company (check if relationship exists)
if (!$user->administeredCompanies()->where('company_id', $company->id)->exists()) {
    $user->administeredCompanies()->attach($company->id);
    echo "User associated with company\n";
} else {
    echo "User already associated with company\n";
}

// Check the association
$adminCompanies = $user->administeredCompanies()->count();
echo "User administered companies count: {$adminCompanies}\n";

// Test the pluck functionality that was causing issues
$companyIds = $user->administeredCompanies()->pluck('id')->toArray();
echo "Company IDs from relationship: " . implode(', ', $companyIds) . "\n";

echo "Test data setup complete!\n";
echo "You can now test login with: test.employer@example.com / password123\n";
