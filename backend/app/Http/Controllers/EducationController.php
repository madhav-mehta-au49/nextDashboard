<?php

namespace App\Http\Controllers;

use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class EducationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isCandidate()) {
            $educations = $user->candidate->educations()->orderByDesc('start_date')->get();

            return response()->json([
                'status' => 'success',
                'data' => $educations
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

        if (!$user->isCandidate()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can add education'
            ], 403);
        }

        $validated = $request->validate([
            'institution' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'field_of_study' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string'
        ]);

        $education = $user->candidate->educations()->create([
            'institution' => $validated['institution'],
            'degree' => $validated['degree'],
            'field_of_study' => $validated['field_of_study'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['is_current'] ?? false ? null : ($validated['end_date'] ?? null),
            'is_current' => $validated['is_current'] ?? false,
            'description' => $validated['description'] ?? null
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Education added successfully',
            'data' => $education
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Education $education): JsonResponse
    {
        $user = request()->user();

        if ($user->isCandidate() && $user->candidate->id !== $education->candidate_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to view this education'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $education
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Education $education): JsonResponse
    {
        $user = $request->user();

        if ($user->isCandidate() && $user->candidate->id !== $education->candidate_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to update this education'
            ], 403);
        }

        $validated = $request->validate([
            'institution' => 'sometimes|required|string|max:255',
            'degree' => 'sometimes|required|string|max:255',
            'field_of_study' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string'
        ]);

        $education->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Education updated successfully',
            'data' => $education
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Education $education): JsonResponse
    {
        $user = request()->user();

        if ($user->isCandidate() && $user->candidate->id !== $education->candidate_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to delete this education'
            ], 403);
        }

        $education->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Education deleted successfully'
        ], Response::HTTP_NO_CONTENT);
    }
}
