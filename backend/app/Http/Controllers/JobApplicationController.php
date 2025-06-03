<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\JobListing;
use App\Http\Requests\JobApplicationRequest;
use App\Http\Resources\JobApplicationResource;
use App\Services\JobApplicationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    protected $jobApplicationService;

    public function __construct(JobApplicationService $jobApplicationService)
    {
        $this->jobApplicationService = $jobApplicationService;
    }    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $applications = $this->jobApplicationService->getApplicationsForUser(
            $request->user(),
            $request->only(['status', 'per_page', 'page'])
        );
        
        return response()->json([
            'status' => 'success',
            'data' => JobApplicationResource::collection($applications),
            'meta' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'per_page' => $applications->perPage(),
                'total' => $applications->total()
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(JobApplicationRequest $request): JsonResponse
    {
        try {
            $application = $this->jobApplicationService->submitApplication(
                $request->user(),
                $request->validated()
            );
            
            return response()->json([
                'status' => 'success',
                'message' => 'Application submitted successfully',
                'data' => new JobApplicationResource($application)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(JobApplication $jobApplication): JsonResponse
    {
        try {
            if (!$this->jobApplicationService->checkUserCanViewApplication(
                request()->user(),
                $jobApplication
            )) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to view this application'
                ], 403);
            }
            
            return response()->json([
                'status' => 'success',
                'data' => new JobApplicationResource($jobApplication->load([
                    'jobListing', 
                    'candidate', 
                    'jobListing.company',
                    'answers.question'
                ]))
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 403);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(JobApplicationRequest $request, JobApplication $jobApplication): JsonResponse
    {
        try {
            $updatedApplication = $this->jobApplicationService->updateApplication(
                $request->user(),
                $jobApplication,
                $request->validated()
            );
            
            return response()->json([
                'status' => 'success',
                'message' => 'Application updated successfully',
                'data' => new JobApplicationResource($updatedApplication)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobApplication $jobApplication): JsonResponse
    {
        try {
            $this->jobApplicationService->deleteApplication(
                request()->user(),
                $jobApplication
            );
            
            return response()->json([
                'status' => 'success',
                'message' => 'Application deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 403);
        }
    }

    /**
     * Get application analytics for the authenticated user
     */
    public function analytics(Request $request): JsonResponse
    {
        $analytics = $this->jobApplicationService->getUserApplicationAnalytics(
            $request->user()
        );
        
        return response()->json([
            'status' => 'success',
            'data' => $analytics
        ]);
    }

    /**
     * Get matching candidates for a job listing
     */
    public function matchingCandidates(Request $request, JobListing $jobListing): JsonResponse
    {
        try {
            $candidates = $this->jobApplicationService->getMatchingCandidates(
                $request->user(),
                $jobListing,
                $request->only(['limit', 'min_score'])
            );
            
            return response()->json([
                'status' => 'success',
                'data' => $candidates
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 403);
        }
    }

    /**
     * Bulk update application statuses
     */
    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $request->validate([
            'application_ids' => 'required|array',
            'application_ids.*' => 'required|integer|exists:job_applications,id',
            'status' => 'required|string|in:pending,reviewing,interviewed,offered,hired,rejected'
        ]);

        try {
            $updatedCount = $this->jobApplicationService->bulkUpdateApplicationStatus(
                $request->user(),
                $request->application_ids,
                $request->status
            );
            
            return response()->json([
                'status' => 'success',
                'message' => "Successfully updated {$updatedCount} applications",
                'data' => ['updated_count' => $updatedCount]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 403);
        }
    }
}

