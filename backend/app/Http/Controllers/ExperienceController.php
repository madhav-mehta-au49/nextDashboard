<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExperienceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // If user is a candidate, show only their experiences
        if ($user->isCandidate()) {
            $experiences = $user->candidate->experiences()->orderByDesc('start_date')->get();
            
            return response()->json([
                'status' => 'success',
                'data' => $experiences
            ]);
        }
        
        return response()->json([
            'status' => 'error',
            'message' => 'Unauthorized'
        ], 403);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Ensure user is a candidate
        if (!$user->isCandidate()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can add experiences'
            ], 403);
        }
        
        $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string'
        ]);
        
        $experience = $user->candidate->experiences()->create([
            'title' => $request->title,
            'company' => $request->company,
            'location' => $request->location,
            'start_date' => $request->start_date,
            'end_date' => $request->is_current ? null : $request->end_date,
            'is_current' => $request->is_current ?? false,
            'description' => $request->description
        ]);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Experience added successfully',
            'data' => $experience
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Experience $experience): JsonResponse
    {
        $user = request()->user();
        
        // Ensure user has permission to view this experience
        if ($user->isCandidate() && $user->candidate->id !== $experience->candidate_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to view this experience'
            ], 403);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $experience
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Experience $experience): JsonResponse
    {
        $user = $request->user();
        
        // Ensure user has permission to update this experience
        if ($user->isCandidate() && $user->candidate->id !== $experience->candidate_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to update this experience'
            ], 403);
        }
        
        $request->validate([
            'title' => 'string|max:255',
            'company' => 'string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string'
        ]);
        
        $experience->update([
            'title' => $request->title ?? $experience->title,
            'company' => $request->company ?? $experience->company,
            'location' => $request->location ?? $experience->location,
            'start_date' => $request->start_date ?? $experience->start_date,
            'end_date' => isset($request->is_current) && $request->is_current ? null : ($request->end_date ?? $experience->end_date),
            'is_current' => $request->is_current ?? $experience->is_current,
            'description' => $request->description ?? $experience->description
        ]);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Experience updated successfully',
            'data' => $experience
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Experience $experience): JsonResponse
    {
        $user = request()->user();
        
        // Ensure user has permission to delete this experience
        if ($user->isCandidate() && $user->candidate->id !== $experience->candidate_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to delete this experience'
            ], 403);
        }
        
        $experience->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Experience deleted successfully'
        ]);
    }
}
