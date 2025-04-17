<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Http\Requests\StoreJobListingRequest;
use App\Http\Requests\UpdateJobListingRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobListingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = JobListing::with(['company', 'skills']);
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            $query->active(); // Use the scope defined in the model
        }
        
        // Filter by location
        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }
        
        // Filter by remote
        if ($request->has('is_remote')) {
            $query->where('is_remote', $request->is_remote);
        }
        
        // Filter by job type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        // Filter by experience level
        if ($request->has('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }
        
        // Filter by salary range
        if ($request->has('salary_min')) {
            $query->where('salary_min', '>=', $request->salary_min);
        }
        
        if ($request->has('salary_max')) {
            $query->where('salary_max', '<=', $request->salary_max);
        }
        
        // Filter by company
        if ($request->has('company_id')) {
            $query->where('company_id', $request->company_id);
        }
        
        // Search by title or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        
        // Filter by skills
        if ($request->has('skills')) {
            $skills = explode(',', $request->skills);
            $query->whereHas('skills', function($q) use ($skills) {
                $q->whereIn('skills.id', $skills);
            });
        }
        
        $jobListings = $query->paginate($request->per_page ?? 10);
        
        return response()->json([
            'status' => 'success',
            'data' => $jobListings
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobListingRequest $request): JsonResponse
    {
        $jobListing = JobListing::create($request->validated());
        
        // Attach skills if provided
        if ($request->has('skills')) {
            foreach ($request->skills as $skill) {
                $jobListing->skills()->attach($skill['id'], [
                    'is_required' => $skill['is_required'] ?? false
                ]);
            }
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Job listing created successfully',
            'data' => $jobListing->load('skills')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(JobListing $jobListing): JsonResponse
    {
        $jobListing->load(['company', 'skills', 'applications']);
        
        // Increment views count
        $jobListing->increment('views_count');
        
        return response()->json([
            'status' => 'success',
            'data' => $jobListing
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJobListingRequest $request, JobListing $jobListing): JsonResponse
    {
        $jobListing->update($request->validated());
        
        // Update skills if provided
        if ($request->has('skills')) {
            $jobListing->skills()->detach();
            
            foreach ($request->skills as $skill) {
                $jobListing->skills()->attach($skill['id'], [
                    'is_required' => $skill['is_required'] ?? false
                ]);
            }
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Job listing updated successfully',
            'data' => $jobListing->load('skills')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobListing $jobListing): JsonResponse
    {
        $jobListing->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Job listing deleted successfully'
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
    
    /**
     * Get similar job listings
     */
    public function similar(JobListing $jobListing): JsonResponse
    {
        // Get job listings with similar skills
        $skillIds = $jobListing->skills->pluck('id')->toArray();
        
        $similarJobs = JobListing::where('id', '!=', $jobListing->id)
            ->where('company_id', $jobListing->company_id)
            ->orWhereHas('skills', function($query) use ($skillIds) {
                $query->whereIn('skills.id', $skillIds);
            })
            ->active()
            ->with(['company', 'skills'])
            ->limit(5)
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => $similarJobs
        ]);
    }
}
