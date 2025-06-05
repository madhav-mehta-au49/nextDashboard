<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\JobListing;
use App\Http\Requests\JobApplicationRequest;
use App\Http\Requests\JobApplicationStatusUpdateRequest;
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
            $request->only(['status', 'per_page', 'page', 'company_id', 'search', 'job_id'])
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
            // Debug logging for request data
            \Log::debug('Job Application Request Data', [
                'all_data' => $request->all(),
                'validated_data' => $request->validated(),
                'headers' => $request->headers->all(),
                'method' => $request->method(),
                'url' => $request->fullUrl()
            ]);
            
            // Get the user's candidate record
            $user = $request->user();
            $candidate = $user->candidate;
            
            if (!$candidate) {
                // Use firstOrCreate to handle the case where a candidate with the same email exists
                $candidate = \App\Models\Candidate::firstOrCreate(
                    ['email' => $user->email], // Check if a candidate with this email already exists
                    [
                        'user_id' => $user->id,
                        'name' => $user->name ?? 'User',
                        'slug' => \Illuminate\Support\Str::slug($user->name ?? 'user-' . $user->id) . '-' . uniqid(),
                        'phone' => null,
                        'location' => null,
                        'headline' => 'Job Seeker',
                        'about' => null,
                        'availability' => 'Actively looking',
                        'visibility' => 'public',
                    ]
                );
            }
            
            // Add candidate_id to validated data
            $validatedData = $request->validated();
            $validatedData['candidate_id'] = $candidate->id;
            
            $application = $this->jobApplicationService->submitApplication($validatedData);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Application submitted successfully',
                'data' => new JobApplicationResource($application)
            ], 201);
        } catch (\Exception $e) {
            // Log the error with detailed information
            \Log::error('Job Application Submission Error', [
                'error_message' => $e->getMessage(),
                'error_trace' => $e->getTraceAsString(),
                'error_code' => $e->getCode(),
                'validation_data' => $request->validated()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Application submission failed: ' . $e->getMessage(),
                'error_details' => config('app.debug') ? $e->getTrace() : null
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
    }    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobApplication $jobApplication): JsonResponse
    {
        try {
            // Check if this is a status update (only contains status-related fields)
            $isStatusUpdate = $this->isStatusUpdate($request);
            
            if ($isStatusUpdate) {
                // Validate using status update rules directly
                $validatedData = $request->validate([
                    'status' => 'required|string|in:pending,reviewing,interview_scheduled,interviewed,rejected,offered,hired,withdrawn',
                    'notes' => 'nullable|string|max:2000',
                    'interviewer_notes' => 'nullable|string|max:2000',
                    'rejection_reason' => 'nullable|string|max:1000',
                    'interview_date' => 'nullable|date|after_or_equal:today',
                ]);
            } else {
                // For full application updates, use the JobApplicationRequest
                $applicationRequest = new JobApplicationRequest();
                $applicationRequest->replace($request->all());
                $applicationRequest->setContainer(app());
                $applicationRequest->setRedirector(app()->make('redirect'));
                $validatedData = $applicationRequest->validated();
            }
            
            $updatedApplication = $this->jobApplicationService->updateApplication(
                $request->user(),
                $jobApplication,
                $validatedData
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
     * Determine if the request is a status update or full application update
     */
    private function isStatusUpdate(Request $request): bool
    {
        $statusFields = ['status', 'notes', 'interviewer_notes', 'rejection_reason', 'interview_date'];
        $middlewareFields = ['user_company_ids']; // Fields added by middleware that should be ignored
        $allowedFields = array_merge($statusFields, $middlewareFields);
        $requestFields = array_keys($request->all());
        
        // If only status-related fields and middleware fields are present, it's a status update
        $nonStatusFields = array_diff($requestFields, $allowedFields);
        return empty($nonStatusFields);
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

