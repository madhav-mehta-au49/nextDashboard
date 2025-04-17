<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class CompanyFollowerController extends Controller
{
    /**
     * Display a listing of followed companies for the authenticated candidate.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isCandidate()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can view followed companies'
            ], 403);
        }

        $companies = $user->candidate->followedCompanies()->with('industry')->get();

        return response()->json([
            'status' => 'success',
            'data' => $companies
        ]);
    }

    /**
     * Follow a new company.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isCandidate()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can follow companies'
            ], 403);
        }

        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'relationship' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000'
        ]);

        $candidate = $user->candidate;

        if ($candidate->followedCompanies()->where('company_id', $validated['company_id'])->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You already follow this company'
            ], 409);
        }

        $candidate->followedCompanies()->attach($validated['company_id'], [
            'is_candidate' => true,
            'relationship' => $validated['relationship'] ?? null,
            'notes' => $validated['notes'] ?? null
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Company followed successfully'
        ], 201);
    }

    /**
     * Unfollow a company.
     */
    public function destroy(Request $request, Company $company): JsonResponse
    {
        $user = $request->user();

        if (!$user->isCandidate()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can unfollow companies'
            ], 403);
        }

        $user->candidate->followedCompanies()->detach($company->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Company unfollowed successfully'
        ], Response::HTTP_NO_CONTENT);
    }
}
