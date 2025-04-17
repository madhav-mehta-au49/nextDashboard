<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SkillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Skill::query();
        
        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        
        // Get popular skills (most used by candidates or job listings)
        if ($request->has('popular') && $request->popular) {
            $query->withCount(['candidates', 'jobListings'])
                  ->orderByDesc('candidates_count')
                  ->orderByDesc('job_listings_count');
        }
        
        $skills = $query->paginate($request->per_page ?? 20);
        
        return response()->json([
            'status' => 'success',
            'data' => $skills
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:skills,name'
        ]);
        
        $skill = Skill::create([
            'name' => $request->name
        ]);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Skill created successfully',
            'data' => $skill
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Skill $skill): JsonResponse
    {
        $skill->load(['candidates', 'jobListings']);
        
        return response()->json([
            'status' => 'success',
            'data' => $skill
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Skill $skill): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:skills,name,' . $skill->id
        ]);
        
        $skill->update([
            'name' => $request->name
        ]);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Skill updated successfully',
            'data' => $skill
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Skill $skill): JsonResponse
    {
        // Check if skill is in use
        if ($skill->candidates()->count() > 0 || $skill->jobListings()->count() > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete skill that is in use'
            ], 400);
        }
        
        $skill->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Skill deleted successfully'
        ]);
    }
    
    /**
     * Get trending skills
     */
    public function trending(): JsonResponse
    {
        $skills = Skill::withCount(['jobListings'])
                      ->orderByDesc('job_listings_count')
                      ->limit(10)
                      ->get();
                      
        return response()->json([
            'status' => 'success',
            'data' => $skills
        ]);
    }
}
