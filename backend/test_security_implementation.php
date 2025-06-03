<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Bootstrap Laravel application
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing Company-Specific Security Implementation\n";
echo "==============================================\n\n";

// Test 1: Check if middleware is registered
echo "1. Testing Middleware Registration:\n";
try {
    // Check if middleware class exists
    if (class_exists('App\Http\Middleware\CompanyAuthentication')) {
        echo "✓ Company authentication middleware class exists\n";
        
        // Try to resolve middleware through container
        try {
            app()->make('App\Http\Middleware\CompanyAuthentication');
            echo "✓ Company authentication middleware can be resolved\n";
        } catch (Exception $e) {
            echo "✗ Company authentication middleware cannot be resolved: " . $e->getMessage() . "\n";
        }
    } else {
        echo "✗ Company authentication middleware class does NOT exist\n";
    }
} catch (Exception $e) {
    echo "✗ Error checking middleware: " . $e->getMessage() . "\n";
}

// Test 2: Check if routes are properly protected
echo "\n2. Testing Route Protection:\n";
$protectedRoutes = [
    'company/dashboard',
    'companies',
    'job-listings',
    'job-applications'
];

$routes = Route::getRoutes();
foreach ($protectedRoutes as $routePath) {
    $found = false;
    foreach ($routes as $route) {
        if (str_contains($route->uri(), $routePath)) {
            $middleware = $route->middleware();
            if (in_array('company.auth', $middleware)) {
                echo "✓ Route '{$routePath}' is protected with company.auth middleware\n";
                $found = true;
                break;
            }
        }
    }
    if (!$found) {
        echo "? Route '{$routePath}' protection status unclear\n";
    }
}

// Test 3: Check if controllers exist
echo "\n3. Testing Controller Existence:\n";
$controllers = [
    'App\Http\Controllers\CompanyDashboardController',
    'App\Http\Middleware\CompanyAuthentication',
    'App\Services\JobApplicationService'
];

foreach ($controllers as $controller) {
    if (class_exists($controller)) {
        echo "✓ {$controller} exists\n";
    } else {
        echo "✗ {$controller} does NOT exist\n";
    }
}

// Test 4: Check if policies are defined
echo "\n4. Testing Policy Registration:\n";
$policies = [
    'App\Policies\CompanyPolicy',
    'App\Policies\CompanyReviewPolicy'
];

foreach ($policies as $policy) {
    if (class_exists($policy)) {
        echo "✓ {$policy} exists\n";
    } else {
        echo "✗ {$policy} does NOT exist\n";
    }
}

// Test 5: Check User model methods
echo "\n5. Testing User Model Methods:\n";
try {
    $userClass = new ReflectionClass('App\Models\User');
    
    $methods = ['administeredCompanies', 'isEmployer', 'isAdmin'];
    foreach ($methods as $method) {
        if ($userClass->hasMethod($method)) {
            echo "✓ User model has '{$method}' method\n";
        } else {
            echo "✗ User model missing '{$method}' method\n";
        }
    }
} catch (Exception $e) {
    echo "✗ Error checking User model: " . $e->getMessage() . "\n";
}

echo "\n==============================================\n";
echo "Security Implementation Test Complete\n";
echo "==============================================\n";
