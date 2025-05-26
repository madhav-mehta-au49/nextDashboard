<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class CompanyFollowerController extends Controller
{
    /**
     * Display a listing of followed companies for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $companies = $user->followedCompanies()
            ->with(['locations', 'specialties', 'socialLinks'])
            ->withPivot(['relationship', 'notes', 'created_at'])
            ->paginate($request->per_page ?? 10);

        // Add is_saved flag
        $savedCompanyIds = $user->savedCompanies()->pluck('companies.id')->toArray();
        
        $companies->getCollection()->transform(function ($company) use ($savedCompanyIds) {
            $company->is_following = true; // Already following since this is the followed companies list
            $company->is_saved = in_array($company->id, $savedCompanyIds);
            return $company;
        });

        return response()->json([
            'status' => 'success',
            'data' => $companies
        ]);
    }

    /**
     * Update the relationship or notes for a followed company.
     */
    public function update(Request $request, Company $company): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'relationship' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000'
        ]);

        if (!$user->followedCompanies()->where('company_id', $company->id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not following this company'
            ], 404);
        }

        $user->followedCompanies()->updateExistingPivot($company->id, $validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Follow details updated successfully'
        ]);
    }
}
