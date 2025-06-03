<?php

require_once __DIR__ . '/vendor/autoload.php';

// Load Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\CompanyDashboardController;
use App\Services\JobAnalyticsService;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;

echo "Testing CompanyDashboardController directly...\n";

try {
    // Create the service
    $jobAnalyticsService = new JobAnalyticsService();
    echo "✓ JobAnalyticsService created successfully\n";
    
    // Create the controller
    $controller = new CompanyDashboardController($jobAnalyticsService);
    echo "✓ CompanyDashboardController created successfully\n";
    
    // Get a test user
    $user = User::where('role', 'employer')->first();
    if (!$user) {
        echo "✗ No employer user found\n";
        exit(1);
    }
    echo "✓ Found employer user: {$user->email}\n";
    
    // Authenticate the user
    auth()->login($user);
    echo "✓ User authenticated\n";
      // Get user's companies
    $companyIds = $user->administeredCompanies()->pluck('companies.id')->toArray();
    echo "✓ User administered companies: " . implode(', ', $companyIds) . "\n";
    
    // Create a mock request with company IDs
    $request = new Request();
    $request->merge(['user_company_ids' => $companyIds]);
    echo "✓ Request created with company IDs\n";
    
    // Call the dashboard method
    echo "Calling dashboard method...\n";
    $response = $controller->dashboard($request);
    echo "✓ Dashboard method executed successfully\n";
    
    $responseData = $response->getData(true);
    echo "Response status: " . $responseData['status'] . "\n";
    
    if (isset($responseData['data']['stats'])) {
        echo "Stats found:\n";
        foreach ($responseData['data']['stats'] as $key => $value) {
            echo "  $key: $value\n";
        }
    }
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
