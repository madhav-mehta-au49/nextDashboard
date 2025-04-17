<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Company::with(['locations', 'specialties', 'socialLinks']);
        
        // Apply filters if provided
        if ($request->has('industry')) {
            $query->where('industry', $request->industry);
        }
        
        if ($request->has('size')) {
            $query->where('size', $request->size);
        }
        
        if ($request->has('verified')) {
            $query->where('verified', $request->verified);
        }
        
        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        
        $companies = $query->paginate($request->per_page ?? 10);
        
        return response()->json([
            'status' => 'success',
            'data' => $companies
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompanyRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        // Generate slug if not provided
        if (!isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        
        $company = Company::create($data);
        
        // Add locations if provided
        if ($request->has('locations')) {
            foreach ($request->locations as $location) {
                $company->locations()->create($location);
            }
        }
        
        // Add specialties if provided
        if ($request->has('specialties')) {
            foreach ($request->specialties as $specialty) {
                $company->specialties()->create(['specialty' => $specialty]);
            }
        }
        
        // Add social links if provided
        if ($request->has('social_links')) {
            foreach ($request->social_links as $link) {
                $company->socialLinks()->create($link);
            }
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Company created successfully',
            'data' => $company->load(['locations', 'specialties', 'socialLinks'])
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company): JsonResponse
    {
        $company->load(['locations', 'specialties', 'socialLinks', 'jobListings' => function($query) {
            $query->active();
        }]);
        
        return response()->json([
            'status' => 'success',
            'data' => $company
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCompanyRequest $request, Company $company): JsonResponse
    {
        $company->update($request->validated());
        
        // Update locations if provided
        if ($request->has('locations')) {
            $company->locations()->delete();
            foreach ($request->locations as $location) {
                $company->locations()->create($location);
            }
        }
        
        // Update specialties if provided
        if ($request->has('specialties')) {
            $company->specialties()->delete();
            foreach ($request->specialties as $specialty) {
                $company->specialties()->create(['specialty' => $specialty]);
            }
        }
        
        // Update social links if provided
        if ($request->has('social_links')) {
            $company->socialLinks()->delete();
            foreach ($request->social_links as $link) {
                $company->socialLinks()->create($link);
            }
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Company updated successfully',
            'data' => $company->load(['locations', 'specialties', 'socialLinks'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company): JsonResponse
    {
        $company->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Company deleted successfully'
        ]);
    }
    
    /**
     * Get company job listings
     */
    public function jobListings(Company $company, Request $request): JsonResponse
    {
        $query = $company->jobListings();
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            $query->active(); // Use the scope defined in the model
        }
        
        $jobListings = $query->with('skills')->paginate($request->per_page ?? 10);
        
        return response()->json([
            'status' => 'success',
            'data' => $jobListings
        ]);
    }
    
    /**
     * Follow a company
     */
    public function followCompany(Request $request, Company $company): JsonResponse
    {
        $request->validate([
            'is_candidate' => 'boolean',
            'relationship' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);
        
        $user = $request->user();
        
        // Check if already following
        if ($user->followedCompanies()->where('company_id', $company->id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are already following this company'
            ], 400);
        }
        
        $user->followedCompanies()->attach($company->id, [
            'is_candidate' => $request->is_candidate ?? true,
            'relationship' => $request->relationship,
            'notes' => $request->notes
        ]);
        
        // Increment followers count
        $company->increment('followers');
        
        return response()->json([
            'status' => 'success',
            'message' => 'Company followed successfully'
        ]);
    }
    
    /**
     * Unfollow a company
     */
    public function unfollowCompany(Company $company): JsonResponse
    {
        $user = request()->user();
        
        // Check if following
        if (!$user->followedCompanies()->where('company_id', $company->id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not following this company'
            ], 400);
        }
        
        $user->followedCompanies()->detach($company->id);
        
        // Decrement followers count
        $company->decrement('followers');
        
        return response()->json([
            'status' => 'success',
            'message' => 'Company unfollowed successfully'
        ]);
    }
}

