<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\JobListing;
use App\Http\Requests\StoreJobApplicationRequest;
use App\Http\Requests\UpdateJobApplicationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = JobApplication::with(['jobListing', 'candidate', 'jobListing.company']);
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // If user is a candidate, show only their applications
        if ($user->isCandidate()) {
            $query->whereHas('candidate', function($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }
        
        // If user is an employer, show only applications for their company's jobs
        if ($user->isEmployer() || $user->isHR()) {
            $query->whereHas('jobListing.company', function($q) use ($user) {
                $q->whereHas('admins', function($q2) use ($user) {
                    $q2->where('users.id', $user->id);
                });
            });
        }
        
        $applications = $query->paginate($request->per_page ?? 10);
        
        return response()->json([
            'status' => 'success',
            'data' => $applications
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobApplicationRequest $request): JsonResponse
    {
        $user = $request->user();
        
        // Ensure user is a candidate
        if (!$user->isCandidate()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can apply for jobs'
            ], 403);
        }
        
        $candidate = $user->candidate;
        
        // Check if already applied
        $jobListing = JobListing::findOrFail($request->job_listing_id);
        if ($candidate->appliedJobs()->where('job_listing_id', $jobListing->id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You have already applied for this job'
            ], 400);
        }
        
        // Create application
        $application = JobApplication::create([
            'job_listing_id' => $request->job_listing_id,
            'candidate_id' => $candidate->id,
            'cover_letter' => $request->cover_letter,
            'resume_url' => $request->resume_url ?? $candidate->resume_url,
            'status' => 'pending'
        ]);
        
        // Increment applicants count
        $jobListing->increment('applicants_count');
        
        return response()->json([
            'status' => 'success',
            'message' => 'Application submitted successfully',
            'data' => $application
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(JobApplication $jobApplication): JsonResponse
    {
        $user = request()->user();
        
        // Ensure user has permission to view this application
        if ($user->isCandidate() && $user->candidate->id !== $jobApplication->candidate_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to view this application'
            ], 403);
        }
        
        if (($user->isEmployer() || $user->isHR()) && 
            !$user->administeredCompanies()->where('companies.id', $jobApplication->jobListing->company_id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to view this application'
            ], 403);
        }
        
        $jobApplication->load(['jobListing', 'candidate', 'jobListing.company']);
        
        return response()->json([
            'status' => 'success',
            'data' => $jobApplication
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJobApplicationRequest $request, JobApplication $jobApplication): JsonResponse
    {
        $user = $request->user();
        
        // Ensure user has permission to update this application
        if ($user->isCandidate() && $user->candidate->id !== $jobApplication->candidate_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to update this application'
            ], 403);
        }
        
        if (($user->isEmployer() || $user->isHR()) && 
            !$user->administeredCompanies()->where('companies.id', $jobApplication->jobListing->company_id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to update this application'
            ], 403);
        }
        
        // Candidates can only update cover letter and resume
        if ($user->isCandidate()) {
            $jobApplication->update([
                'cover_letter' => $request->cover_letter ?? $jobApplication->cover_letter,
                'resume_url' => $request->resume_url ?? $jobApplication->resume_url
            ]);
        } else {
            // Employers/HR can update status
            $jobApplication->update([
                'status' => $request->status ?? $jobApplication->status
            ]);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Application updated successfully',
            'data' => $jobApplication
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobApplication $jobApplication): JsonResponse
    {
        $user = request()->user();
        
        // Ensure user has permission to delete this application
        if ($user->isCandidate() && $user->candidate->id !== $jobApplication->candidate_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to delete this application'
            ], 403);
        }
        
        if (($user->isEmployer() || $user->isHR()) && 
            !$user->administeredCompanies()->where('companies.id', $jobApplication->jobListing->company_id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to delete this application'
            ], 403);
        }
        
        // Decrement applicants count
        $jobApplication->jobListing->decrement('applicants_count');
        
        $jobApplication->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Application deleted successfully'
        ]);
    }
}

