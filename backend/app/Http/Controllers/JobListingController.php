<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Http\Requests\StoreJobListingRequest;
use App\Http\Requests\UpdateJobListingRequest;
use App\Http\Requests\JobSearchRequest;
use App\Http\Resources\JobListingResource;
use App\Services\JobSearchService;
use App\Services\JobAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobListingController extends Controller
{
    protected $jobSearchService;
    protected $jobAnalyticsService;

    public function __construct(JobSearchService $jobSearchService, JobAnalyticsService $jobAnalyticsService)
    {
        $this->jobSearchService = $jobSearchService;
        $this->jobAnalyticsService = $jobAnalyticsService;
    }

    public function index(JobSearchRequest $request): JsonResponse
    {
        $results = $this->jobSearchService->searchJobs($request->validated());

        return response()->json([
            'status' => 'success',
            'data' => JobListingResource::collection($results['jobs']),
            'meta' => [
                'total' => $results['total'],
                'per_page' => $results['per_page'],
                'current_page' => $results['current_page'],
                'last_page' => $results['last_page'],
                'filters_applied' => $results['filters_applied'],
            ]
        ]);
    }

    public function search(JobSearchRequest $request): JsonResponse
    {
        $results = $this->jobSearchService->search($request);

        return response()->json([
            'status' => 'success',
            'data' => JobListingResource::collection($results->items()),
            'meta' => [
                'total' => $results->total(),
                'per_page' => $results->perPage(),
                'current_page' => $results->currentPage(),
                'last_page' => $results->lastPage(),
                'from' => $results->firstItem(),
                'to' => $results->lastItem(),
            ]
        ]);
    }

    public function recommendations(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isCandidate()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can get job recommendations'
            ], 403);
        }

        $recommendations = $this->jobSearchService->getJobRecommendations(
            $user->candidate,
            $request->input('limit', 10)
        );

        return response()->json([
            'status' => 'success',
            'data' => JobListingResource::collection($recommendations['jobs']),
            'meta' => [
                'recommendation_reasons' => $recommendations['reasons'],
                'total_found' => count($recommendations['jobs']),
            ]
        ]);
    }

    public function similar(JobListing $jobListing, Request $request): JsonResponse
    {
        $similarJobs = $this->jobSearchService->getSimilarJobs(
            $jobListing,
            $request->input('limit', 5)
        );

        return response()->json([
            'status' => 'success',
            'data' => JobListingResource::collection($similarJobs['jobs']),
            'meta' => [
                'similarity_factors' => $similarJobs['factors'],
                'total_found' => count($similarJobs['jobs']),
            ]
        ]);
    }

    public function store(StoreJobListingRequest $request): JsonResponse
    {
        \Log::debug('JobListingController::store - Request data', [
            'all' => $request->all(),
            'validated' => $request->validated()
        ]);

        try {
            $user = auth()->user();
            $validatedData = $request->validated();

            \Log::debug('JobListingController::store - Critical fields', [
                'experience_level' => $validatedData['experience_level'] ?? 'not set',
                'location_type' => $validatedData['location_type'] ?? 'not set',
                'category_id' => $validatedData['category_id'] ?? 'not set',
                'salary_min' => $validatedData['salary_min'] ?? 'not set',
                'salary_max' => $validatedData['salary_max'] ?? 'not set',
                'required_skills' => $validatedData['required_skills'] ?? 'not set',
            ]);

            if (!isset($validatedData['company_id'])) {
                $userCompany = $user->administeredCompanies()->first();
                if (!$userCompany) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'No company associated with your account'
                    ], 400);
                }
                $validatedData['company_id'] = $userCompany->id;
            }

            if (!$user->isAdmin() && !$user->administeredCompanies()->where('companies.id', $validatedData['company_id'])->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to create jobs for this company'
                ], 403);
            }

            $validatedData['posted_date'] = now();
            \Log::debug('JobListingController::store - Set posted_date', [
                'posted_date' => $validatedData['posted_date'],
                'format' => $validatedData['posted_date']->format('Y-m-d H:i:s')
            ]);

            foreach (['required_skills', 'preferred_skills'] as $key) {
                if (isset($validatedData[$key]) && is_string($validatedData[$key])) {
                    $parsed = json_decode($validatedData[$key], true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $validatedData[$key] = $parsed;
                    } else {
                        \Log::error("Failed to parse $key as JSON during creation", [
                            'value' => $validatedData[$key]
                        ]);
                    }
                }
            }

            $jobListing = JobListing::create($validatedData);

            \Log::debug('JobListingController::store - New job created', [
                'job' => $jobListing->toArray(),
                'posted_date' => $jobListing->posted_date,
                'experience_level' => $jobListing->experience_level,
                'location_type' => $jobListing->location_type,
                'required_skills' => $jobListing->required_skills,
                'category_id' => $jobListing->category_id
            ]);

            if ($request->has('skills')) {
                foreach ($request->skills as $skill) {
                    $jobListing->skills()->attach($skill['id'], [
                        'is_required' => $skill['is_required'] ?? false,
                        'years_experience' => $skill['years_experience'] ?? null,
                    ]);
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Job listing created successfully',
                'data' => new JobListingResource($jobListing->load(['company', 'skills']))
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating job listing', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create job listing: ' . $e->getMessage(),
                'debug' => config('app.debug') ? [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ] : null
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(JobListing $jobListing): JsonResponse
    {
        $jobListing->load(['company', 'skills', 'jobCategory']);
        
        // Increment views count
        $jobListing->increment('views_count');
        
        return response()->json([
            'status' => 'success',
            'data' => new JobListingResource($jobListing)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJobListingRequest $request, JobListing $jobListing): JsonResponse
    {
        try {
            // Debug what data we're receiving
            \Log::debug('JobListingController::update - Request data', [
                'all' => $request->all(),
                'validated' => $request->validated(),
                'job_before' => $jobListing->toArray()
            ]);
            
            // Check if user has permission to update this job listing
            $user = Auth::user();
            if (!$user->isAdmin() && !$user->administeredCompanies()->where('company_id', $jobListing->company_id)->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You do not have permission to update this job listing'
                ], 403);
            }

            // Get validated data
            $inputData = $request->validated();
            
            // Log critical fields before processing
            \Log::debug('JobListingController::update - Critical fields', [
                'experience_level' => $inputData['experience_level'] ?? 'not set',
                'location_type' => $inputData['location_type'] ?? 'not set',
                'category_id' => $inputData['category_id'] ?? 'not set',
                'salary_min' => $inputData['salary_min'] ?? 'not set',
                'salary_max' => $inputData['salary_max'] ?? 'not set',
            ]);
            
            // Format requirements and benefits if they're provided as JSON strings
            if (isset($inputData['requirements']) && is_string($inputData['requirements'])) {
                try {
                    json_decode($inputData['requirements']);
                } catch (\Exception $e) {
                    // If not valid JSON, leave as is
                }
            }
            
            if (isset($inputData['benefits']) && is_string($inputData['benefits'])) {
                try {
                    json_decode($inputData['benefits']);
                } catch (\Exception $e) {
                    // If not valid JSON, leave as is
                }
            }
            
            // Handle skills fields - ensure they're always JSON encoded for the database
            if (isset($inputData['required_skills'])) {
                if (is_array($inputData['required_skills'])) {
                    // No need to do anything, the casts in the model will handle conversion to JSON
                    \Log::debug('JobListingController::update - required_skills is an array', ['skills' => $inputData['required_skills']]);
                } else if (is_string($inputData['required_skills']) && !empty($inputData['required_skills'])) {
                    try {
                        // Try to parse it as JSON to make sure it's valid
                        $parsed = json_decode($inputData['required_skills'], true);
                        if (json_last_error() === JSON_ERROR_NONE) {
                            $inputData['required_skills'] = $parsed;
                            \Log::debug('JobListingController::update - parsed required_skills from JSON string', ['parsed' => $parsed]);
                        }
                    } catch (\Exception $e) {
                        \Log::error('Failed to parse required_skills as JSON', [
                            'error' => $e->getMessage(),
                            'value' => $inputData['required_skills']
                        ]);
                    }
                }
            } else {
                \Log::warning('JobListingController::update - required_skills not provided in request');
            }
            
            if (isset($inputData['preferred_skills'])) {
                if (is_array($inputData['preferred_skills'])) {
                    // No need to do anything, the casts in the model will handle conversion to JSON
                    \Log::debug('JobListingController::update - preferred_skills is an array', ['skills' => $inputData['preferred_skills']]);
                } else if (is_string($inputData['preferred_skills']) && !empty($inputData['preferred_skills'])) {
                    try {
                        // Try to parse it as JSON to make sure it's valid
                        $parsed = json_decode($inputData['preferred_skills'], true);
                        if (json_last_error() === JSON_ERROR_NONE) {
                            $inputData['preferred_skills'] = $parsed;
                            \Log::debug('JobListingController::update - parsed preferred_skills from JSON string', ['parsed' => $parsed]);
                        }
                    } catch (\Exception $e) {
                        \Log::error('Failed to parse preferred_skills as JSON', [
                            'error' => $e->getMessage(),
                            'value' => $inputData['preferred_skills']
                        ]);
                    }
                }
            } else {
                \Log::warning('JobListingController::update - preferred_skills not provided in request');
            }
            
            // Update the job listing
            $jobListing->update($inputData);
            
            // Log the job after update to verify changes were applied
            \Log::debug('JobListingController::update - Job after update', [
                'job' => $jobListing->toArray(),
                'experience_level' => $jobListing->experience_level,
                'location_type' => $jobListing->location_type,
                'required_skills' => $jobListing->required_skills,
                'category_id' => $jobListing->category_id
            ]);
            // Update skills if provided
            if ($request->has('skills')) {
                $jobListing->skills()->detach();
                
                foreach ($request->skills as $skill) {
                    $jobListing->skills()->attach($skill['id'], [
                        'is_required' => $skill['is_required'] ?? false,
                        'years_experience' => $skill['years_experience'] ?? null,
                    ]);
                }
            }
            
            return response()->json([
                'status' => 'success',
                'message' => 'Job listing updated successfully',
                'data' => new JobListingResource($jobListing->load(['company', 'skills']))
            ]);
        } catch (\Exception $e) {
            // Log the error
            \Log::error('Job update error: ' . $e->getMessage(), [
                'job_id' => $jobListing->id,
                'data' => $request->all()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update job listing: ' . $e->getMessage(),
                'debug' => [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobListing $jobListing): JsonResponse
    {
        // Check if user has permission to delete this job listing
        $user = Auth::user();
        if (!$user->isAdmin() && !$user->administeredCompanies()->where('company_id', $jobListing->company_id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to delete this job listing'
            ], 403);
        }

        $jobListing->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Job listing deleted successfully'
        ]);
    }

    /**
     * Get job analytics for a specific job listing.
     */
    public function analytics(JobListing $jobListing): JsonResponse
    {
        $analytics = $this->jobAnalyticsService->getJobPerformanceMetrics($jobListing);
        
        return response()->json([
            'status' => 'success',
            'data' => $analytics
        ]);
    }

    /**
     * Get market analytics for job postings.
     */
    public function marketAnalytics(Request $request): JsonResponse
    {
        $filters = $request->only(['location', 'category', 'experience_level', 'date_range']);
        $analytics = $this->jobAnalyticsService->getMarketOverview($filters);
        
        return response()->json([
            'status' => 'success',
            'data' => $analytics
        ]);
    }
    
    /**
     * Save a job for the authenticated user
     */
    public function saveJob(JobListing $jobListing): JsonResponse
    {
        $user = request()->user();
        
        // Check if already saved
        if ($user->savedJobs()->where('job_listing_id', $jobListing->id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Job already saved'
            ], 400);
        }
        
        $user->savedJobs()->attach($jobListing->id);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Job saved successfully'
        ]);
    }
    
    /**
     * Unsave a job for the authenticated user
     */
    public function unsaveJob(JobListing $jobListing): JsonResponse
    {
        $user = request()->user();
        
        // Check if saved
        if (!$user->savedJobs()->where('job_listing_id', $jobListing->id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Job not saved'
            ], 400);
        }
        
        $user->savedJobs()->detach($jobListing->id);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Job unsaved successfully'
        ]);
    }
}
