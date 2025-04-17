<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class CertificationController extends Controller
{
    /**
     * Display a listing of the certifications.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isCandidate()) {
            $certifications = $user->candidate->certifications()->orderByDesc('issued_date')->get();

            return response()->json([
                'status' => 'success',
                'data' => $certifications
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Unauthorized'
        ], 403);
    }

    /**
     * Store a newly created certification in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isCandidate()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can add certifications'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'organization' => 'required|string|max:255',
            'issued_date' => 'required|date',
            'expiry_date' => 'nullable|date|after_or_equal:issued_date',
            'credential_id' => 'nullable|string|max:255',
            'credential_url' => 'nullable|url'
        ]);

        $certification = $user->candidate->certifications()->create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Certification added successfully',
            'data' => $certification
        ], 201);
    }

    /**
     * Display the specified certification.
     */
    public function show(Certification $certification): JsonResponse
    {
        $user = request()->user();

        if ($user->isCandidate() && $user->candidate->id !== $certification->candidate_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to view this certification'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $certification
        ]);
    }

    /**
     * Update the specified certification in storage.
     */
    public function update(Request $request, Certification $certification): JsonResponse
    {
        $user = $request->user();

        if ($user->isCandidate() && $user->candidate->id !== $certification->candidate_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to update this certification'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'organization' => 'sometimes|required|string|max:255',
            'issued_date' => 'sometimes|required|date',
            'expiry_date' => 'nullable|date|after_or_equal:issued_date',
            'credential_id' => 'nullable|string|max:255',
            'credential_url' => 'nullable|url'
        ]);

        $certification->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Certification updated successfully',
            'data' => $certification
        ]);
    }

    /**
     * Remove the specified certification from storage.
     */
    public function destroy(Certification $certification): JsonResponse
    {
        $user = request()->user();

        if ($user->isCandidate() && $user->candidate->id !== $certification->candidate_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have permission to delete this certification'
            ], 403);
        }

        $certification->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Certification deleted successfully'
        ], Response::HTTP_NO_CONTENT);
    }
}
