<?php

require_once __DIR__ . '/vendor/autoload.php';

// Load Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Company;

echo "Listing existing companies:\n";
foreach(Company::all() as $company) {
    echo $company->id . ': ' . $company->name . "\n";
}

echo "\nTesting relationship with existing company...\n";

// Create/get test user
$user = User::firstOrCreate(
    ['email' => 'test.employer@example.com'],
    [
        'name' => 'Test Employer',
        'password' => bcrypt('password123'),
        'role' => 'employer'
    ]
);

echo "Test user: {$user->email} (ID: {$user->id})\n";

// Use the first existing company
$company = Company::first();
if ($company) {
    echo "Using existing company: {$company->name} (ID: {$company->id})\n";
    
    // Associate user with company (check if relationship exists)
    if (!$user->administeredCompanies()->where('companies.id', $company->id)->exists()) {
        $user->administeredCompanies()->attach($company->id);
        echo "User associated with company\n";
    } else {
        echo "User already associated with company\n";
    }
    
    // Test the relationship without pluck first
    $adminCompanies = $user->administeredCompanies;
    echo "User administered companies count: {$adminCompanies->count()}\n";
    
    foreach($adminCompanies as $adminCompany) {
        echo "- Company: {$adminCompany->name} (ID: {$adminCompany->id})\n";
    }
} else {
    echo "No companies found in database\n";
}

echo "Test data setup complete!\n";
echo "You can now test login with: test.employer@example.com / password123\n";
