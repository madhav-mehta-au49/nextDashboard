<?php

namespace App\Http\Controllers;

use App\Models\SavedJob;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class SavedJobController extends Controller
{
    /**
     * Display a listing of the saved jobs for the candidate.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isCandidate()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can view saved jobs'
            ], 403);
        }

        $savedJobs = $user->candidate->savedJobs()->with('jobListing')->get();

        return response()->json([
            'status' => 'success',
            'data' => $savedJobs
        ]);
    }

    /**
     * Store a newly saved job.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isCandidate()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can save jobs'
            ], 403);
        }

        $validated = $request->validate([
            'job_listing_id' => 'required|exists:job_listings,id'
        ]);

        $candidate = $user->candidate;

        // Avoid duplicates
        if ($candidate->savedJobs()->where('job_listing_id', $validated['job_listing_id'])->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Job already saved'
            ], 409);
        }

        $candidate->savedJobs()->attach($validated['job_listing_id']);

        return response()->json([
            'status' => 'success',
            'message' => 'Job saved successfully'
        ], 201);
    }

    /**
     * Remove a saved job.
     */
    public function destroy(Request $request, JobListing $jobListing): JsonResponse
    {
        $user = $request->user();

        if (!$user->isCandidate()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can remove saved jobs'
            ], 403);
        }

        $user->candidate->savedJobs()->detach($jobListing->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Saved job removed successfully'
        ], Response::HTTP_NO_CONTENT);
    }
}
