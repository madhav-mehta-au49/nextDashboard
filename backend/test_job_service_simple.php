<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Initialize Laravel app
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Simple JobSearchService Test ===\n";

try {
    // Test 1: Direct query to verify status filtering works
    echo "1. Testing direct database query...\n";
    $activeOrPublishedJobs = \App\Models\JobListing::whereIn('status', ['active', 'published'])->count();
    echo "✅ Jobs with 'active' OR 'published' status: {$activeOrPublishedJobs}\n\n";

    // Test 2: Test JobSearchService with simple array data
    echo "2. Testing JobSearchService with array parameters...\n";
    $jobSearchService = new \App\Services\JobSearchService();
    
    // Test searchJobs method with array
    $searchJobsResults = $jobSearchService->searchJobs(['per_page' => 5, 'page' => 1]);
    $jobCount = count($searchJobsResults['jobs']);
    echo "✅ SearchJobs method executed successfully, returned {$jobCount} jobs\n";
    
    // Check what statuses are returned
    $returnedStatuses = collect($searchJobsResults['jobs'])->pluck('status')->unique()->toArray();
    echo "Statuses in searchJobs results: " . implode(', ', $returnedStatuses) . "\n\n";

    // Test 3: Test search method with array data
    echo "3. Testing search method with array parameters...\n";
    $searchResults = $jobSearchService->search(['per_page' => 5, 'page' => 1]);
    $resultCount = $searchResults->count();
    echo "✅ Search method executed successfully, returned {$resultCount} jobs\n";
    
    // Check what statuses are returned
    $returnedStatuses = $searchResults->pluck('status')->unique()->toArray();
    echo "Statuses in search results: " . implode(', ', $returnedStatuses) . "\n\n";

    // Test 4: Verify actual job data
    echo "4. Sample job data from search results...\n";
    $sampleJobs = $searchResults->take(3);
    foreach ($sampleJobs as $job) {
        echo "- Job ID: {$job->id}, Title: {$job->title}, Status: {$job->status}, Company: {$job->company->name}\n";
    }

    echo "\n=== All Tests Completed Successfully! ===\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
