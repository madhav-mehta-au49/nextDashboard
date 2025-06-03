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

    /**
     * Display a listing of the resource with advanced search.
     */
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

    /**
     * Search job listings with advanced filters.
     */
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

    /**
     * Get job recommendations for a candidate.
     */
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

    /**
     * Get similar jobs for a specific job listing.
     */
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobListingRequest $request): JsonResponse
    {
        $user = auth()->user();
        $validatedData = $request->validated();
        
        // Check if user can create jobs for this company
        if (!$user->isAdmin() && !$user->administeredCompanies()->where('companies.id', $validatedData['company_id'])->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to create jobs for this company'
            ], 403);
        }
        
        $validatedData['posted_date'] = now();
        
        $jobListing = JobListing::create($validatedData);
        
        // Attach skills if provided
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
        // Check if user has permission to update this job listing
        $user = Auth::user();
        if (!$user->isAdmin() && !$user->administeredCompanies()->where('company_id', $jobListing->company_id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to update this job listing'
            ], 403);
        }

        $jobListing->update($request->validated());
        
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
