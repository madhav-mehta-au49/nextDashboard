<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyAdmin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class CompanyAdminController extends Controller
{
    /**
     * Display a listing of companies administered by the user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isEmployer() && !$user->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $companies = $user->administeredCompanies()->with('industry')->get();

        return response()->json([
            'status' => 'success',
            'data' => $companies
        ]);
    }

    /**
     * Add a new admin to a company.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isEmployer() && !$user->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|max:255'
        ]);

        $exists = CompanyAdmin::where('company_id', $validated['company_id'])
            ->where('user_id', $validated['user_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'status' => 'error',
                'message' => 'This user is already an admin of the company'
            ], 409);
        }

        CompanyAdmin::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Company admin added successfully'
        ], 201);
    }

    /**
     * Remove an admin from a company.
     */
    public function destroy(Request $request, Company $company, $userId): JsonResponse
    {
        $user = $request->user();

        if (!$user->isEmployer() && !$user->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $company->admins()->detach($userId);

        return response()->json([
            'status' => 'success',
            'message' => 'Admin removed from company'
        ], Response::HTTP_NO_CONTENT);
    }
}
