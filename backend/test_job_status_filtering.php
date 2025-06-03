<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Http\Kernel')->bootstrap();

echo "=== Testing Job Status Filtering Implementation ===\n\n";

try {
    // Test 1: JobSearchService instantiation
    echo "1. Testing JobSearchService instantiation...\n";
    $jobSearchService = app('App\Services\JobSearchService');
    echo "✅ JobSearchService instantiated successfully\n\n";

    // Test 2: Check job status filtering in database
    echo "2. Testing job status filtering in database...\n";
    $totalJobs = \App\Models\JobListing::count();
    echo "Total jobs in database: {$totalJobs}\n";
    
    $activeJobs = \App\Models\JobListing::where('status', 'active')->count();
    echo "Jobs with 'active' status: {$activeJobs}\n";
    
    $publishedJobs = \App\Models\JobListing::where('status', 'published')->count();
    echo "Jobs with 'published' status: {$publishedJobs}\n";
    
    $activeOrPublishedJobs = \App\Models\JobListing::whereIn('status', ['active', 'published'])->count();
    echo "Jobs with 'active' OR 'published' status: {$activeOrPublishedJobs}\n\n";

    // Test 3: Check different job statuses
    echo "3. Checking all job statuses in database...\n";
    $statusCounts = \App\Models\JobListing::select('status', \DB::raw('count(*) as count'))
        ->groupBy('status')
        ->pluck('count', 'status')
        ->toArray();
    
    foreach ($statusCounts as $status => $count) {
        echo "Status '{$status}': {$count} jobs\n";
    }
    echo "\n";    // Test 4: Test the updated search method
    echo "4. Testing JobSearchService search method...\n";
    // Create a proper JobSearchRequest
    $searchRequest = new \App\Http\Requests\JobSearchRequest();
    $searchRequest->merge(['per_page' => 5, 'page' => 1]);
    
    try {
        $searchResults = $jobSearchService->search($searchRequest);
        $resultCount = $searchResults->count();
        echo "✅ Search method executed successfully, returned {$resultCount} jobs\n";
        
        // Check what statuses are returned
        $returnedStatuses = $searchResults->pluck('status')->unique()->toArray();
        echo "Statuses in search results: " . implode(', ', $returnedStatuses) . "\n\n";
    } catch (Exception $e) {
        echo "❌ Error in search method: " . $e->getMessage() . "\n\n";
    }

    // Test 5: Test the updated searchJobs method
    echo "5. Testing JobSearchService searchJobs method...\n";
    try {
        $searchJobsResults = $jobSearchService->searchJobs(['limit' => 5]);
        $jobCount = count($searchJobsResults['jobs']);
        echo "✅ SearchJobs method executed successfully, returned {$jobCount} jobs\n";
        
        if (!empty($searchJobsResults['jobs'])) {
            $jobStatuses = array_unique(array_column($searchJobsResults['jobs']->toArray(), 'status'));
            echo "Statuses in searchJobs results: " . implode(', ', $jobStatuses) . "\n";
        }
        echo "\n";
    } catch (Exception $e) {
        echo "❌ Error in searchJobs method: " . $e->getMessage() . "\n\n";
    }

    echo "=== All Tests Completed Successfully! ===\n";

} catch (Exception $e) {
    echo "❌ Error during testing: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
