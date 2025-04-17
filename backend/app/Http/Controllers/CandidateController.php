<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Http\Requests\StoreCandidateRequest;
use App\Http\Requests\UpdateCandidateRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Candidate::with(['user', 'skills', 'experiences', 'educations', 'certifications']);
        
        // Apply filters if provided
        if ($request->has('availability')) {
            $query->where('availability', $request->availability);
        }
        
        // Search by user name or skills
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('skills', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }
        
        $candidates = $query->paginate($request->per_page ?? 10);
        
        return response()->json([
            'status' => 'success',
            'data' => $candidates
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCandidateRequest $request): JsonResponse
    {
        $candidate = Candidate::create($request->validated());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Candidate profile created successfully',
            'data' => $candidate
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Candidate $candidate): JsonResponse
    {
        $candidate->load(['user', 'skills', 'experiences', 'educations', 'certifications', 'jobApplications']);
        
        return response()->json([
            'status' => 'success',
            'data' => $candidate
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCandidateRequest $request, Candidate $candidate): JsonResponse
    {
        $candidate->update($request->validated());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Candidate profile updated successfully',
            'data' => $candidate
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Candidate $candidate): JsonResponse
    {
        $candidate->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Candidate profile deleted successfully'
        ]);
    }
    
    /**
     * Get candidate's job applications
     */
    public function applications(Candidate $candidate): JsonResponse
    {
        $applications = $candidate->jobApplications()
            ->with(['jobListing', 'jobListing.company'])
            ->paginate(10);
            
        return response()->json([
            'status' => 'success',
            'data' => $applications
        ]);
    }
    
    /**
     * Add a skill to candidate
     */
    public function addSkill(Request $request, Candidate $candidate): JsonResponse
    {
        $request->validate([
            'skill_id' => 'required|exists:skills,id',
            'endorsements' => 'nullable|integer'
        ]);
        
        $candidate->skills()->attach($request->skill_id, [
            'endorsements' => $request->endorsements ?? 0
        ]);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Skill added successfully'
        ]);
    }
    
    /**
     * Remove a skill from candidate
     */
    public function removeSkill(Request $request, Candidate $candidate): JsonResponse
    {
        $request->validate([
            'skill_id' => 'required|exists:skills,id'
        ]);
        
        $candidate->skills()->detach($request->skill_id);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Skill removed successfully'
        ]);
    }
}
