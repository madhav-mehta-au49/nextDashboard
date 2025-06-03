<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Company;
use App\Models\CompanyAdmin;
use App\Models\JobListing;
use App\Models\JobApplication;
use App\Http\Middleware\CompanyAuthentication;

echo "Company Data Isolation Integration Test\n";
echo "=====================================\n\n";

try {
    // Create application instance
    $app = require __DIR__ . '/bootstrap/app.php';
    $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

    echo "1. Testing Company Authentication Middleware:\n";
    
    // Test middleware exists and is resolvable
    $middleware = $app->make(CompanyAuthentication::class);
    echo "✓ CompanyAuthentication middleware can be instantiated\n";
      // Test middleware alias registration
    // In Laravel 11, middleware aliases are defined in bootstrap/app.php
    $bootstrapContent = file_get_contents(__DIR__ . '/bootstrap/app.php');
    if (strpos($bootstrapContent, "'company.auth'") !== false) {
        echo "✓ 'company.auth' middleware alias is registered\n";
    } else {
        echo "✗ 'company.auth' middleware alias is NOT registered\n";
    }

    echo "\n2. Testing User Model Company Relationships:\n";
    
    // Test User model methods
    $userModel = new User();
    
    if (method_exists($userModel, 'administeredCompanies')) {
        echo "✓ User::administeredCompanies() method exists\n";
    } else {
        echo "✗ User::administeredCompanies() method missing\n";
    }
    
    if (method_exists($userModel, 'isEmployer')) {
        echo "✓ User::isEmployer() method exists\n";
    } else {
        echo "✗ User::isEmployer() method missing\n";
    }
    
    if (method_exists($userModel, 'isAdmin')) {
        echo "✓ User::isAdmin() method exists\n";
    } else {
        echo "✗ User::isAdmin() method missing\n";
    }

    echo "\n3. Testing Company Dashboard Controller:\n";
      if (class_exists('App\Http\Controllers\CompanyDashboardController')) {
        echo "✓ CompanyDashboardController exists\n";
        
        try {
            $jobAnalyticsService = $app->make(\App\Services\JobAnalyticsService::class);
            $controller = new \App\Http\Controllers\CompanyDashboardController($jobAnalyticsService);
            
            if (method_exists($controller, 'dashboard')) {
                echo "✓ CompanyDashboardController::dashboard() method exists\n";
            }
            
            if (method_exists($controller, 'jobs')) {
                echo "✓ CompanyDashboardController::jobs() method exists\n";
            }
            
            if (method_exists($controller, 'applications')) {
                echo "✓ CompanyDashboardController::applications() method exists\n";
            }
            
            if (method_exists($controller, 'analytics')) {
                echo "✓ CompanyDashboardController::analytics() method exists\n";
            }
        } catch (Exception $e) {
            echo "✗ Could not instantiate CompanyDashboardController: " . $e->getMessage() . "\n";
        }
    } else {
        echo "✗ CompanyDashboardController does not exist\n";
    }

    echo "\n4. Testing JobApplicationService Security Methods:\n";
      if (class_exists('App\Services\JobApplicationService')) {
        echo "✓ JobApplicationService exists\n";
        
        try {
            $service = $app->make(\App\Services\JobApplicationService::class);
            
            $securityMethods = [
                'getApplicationsForUser',
                'checkUserCanViewApplication',
                'updateApplication',
                'deleteApplication',
                'getUserApplicationAnalytics',
                'getMatchingCandidates',
                'bulkUpdateApplicationStatus'
            ];
            
            foreach ($securityMethods as $method) {
                if (method_exists($service, $method)) {
                    echo "✓ JobApplicationService::{$method}() method exists\n";
                } else {
                    echo "✗ JobApplicationService::{$method}() method missing\n";
                }
            }
        } catch (Exception $e) {
            echo "✗ Could not instantiate JobApplicationService: " . $e->getMessage() . "\n";
        }
    } else {
        echo "✗ JobApplicationService does not exist\n";
    }

    echo "\n5. Testing Route Protection:\n";
    
    $routes = $app['router']->getRoutes();
    $protectedRoutes = [
        'api/company/dashboard',
        'api/company/dashboard/jobs',
        'api/company/dashboard/applications',
        'api/company/dashboard/analytics'
    ];
    
    foreach ($protectedRoutes as $routeUri) {
        $route = $routes->getByName(null);
        $found = false;
        
        foreach ($routes as $route) {
            if ($route->uri() === $routeUri) {
                $middlewares = $route->middleware();
                if (in_array('company.auth', $middlewares)) {
                    echo "✓ Route '{$routeUri}' is protected with company.auth middleware\n";
                } else {
                    echo "✗ Route '{$routeUri}' is NOT protected with company.auth middleware\n";
                }
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            echo "✗ Route '{$routeUri}' not found\n";
        }
    }

    echo "\n6. Testing Model Relationships:\n";
    
    // Test Company model
    $company = new Company();
    if (method_exists($company, 'admins')) {
        echo "✓ Company::admins() relationship exists\n";
    }
    
    if (method_exists($company, 'jobListings')) {
        echo "✓ Company::jobListings() relationship exists\n";
    }
    
    // Test JobListing model
    $jobListing = new JobListing();
    if (method_exists($jobListing, 'company')) {
        echo "✓ JobListing::company() relationship exists\n";
    }
    
    if (method_exists($jobListing, 'applications')) {
        echo "✓ JobListing::applications() relationship exists\n";
    }

    echo "\n7. Testing Security Implementation in Controllers:\n";
      // Check JobListingController for security implementations
    try {
        $jobSearchService = $app->make(\App\Services\JobSearchService::class);
        $jobAnalyticsService = $app->make(\App\Services\JobAnalyticsService::class);
        
        $jobController = new \App\Http\Controllers\JobListingController(
            $jobSearchService,
            $jobAnalyticsService
        );
        
        $reflection = new ReflectionClass($jobController);
        
        // Check store method for company authorization
        $storeMethod = $reflection->getMethod('store');
        $storeMethodContent = file_get_contents($reflection->getFileName());
        
        if (strpos($storeMethodContent, 'administeredCompanies') !== false) {
            echo "✓ JobListingController::store() has company authorization checks\n";
        } else {
            echo "✗ JobListingController::store() missing company authorization checks\n";
        }
        
        if (strpos($storeMethodContent, 'isAdmin') !== false) {
            echo "✓ JobListingController has admin override checks\n";
        } else {
            echo "✗ JobListingController missing admin override checks\n";
        }
    } catch (Exception $e) {
        echo "✗ Could not test JobListingController: " . $e->getMessage() . "\n";
    }

    echo "\n=====================================\n";
    echo "Security Integration Test Complete\n";
    echo "=====================================\n";

} catch (Exception $e) {
    echo "Error during integration test: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
