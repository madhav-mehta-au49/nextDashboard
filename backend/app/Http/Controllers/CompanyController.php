<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyFollower;
use App\Models\SavedCompany;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Company::query();

            // Apply filters if provided
            if ($request->has('industry')) {
                $industries = explode(',', $request->industry);
                $query->whereIn('industry', $industries);
            }

            if ($request->has('size')) {
                $sizes = explode(',', $request->size);
                $query->whereIn('size', $sizes);
            }

            if ($request->has('location')) {
                $query->whereHas('locations', function ($q) use ($request) {
                    $q->where('city', 'like', "%{$request->location}%")
                        ->orWhere('country', 'like', "%{$request->location}%");
                });
            }

            if ($request->has('verified')) {
                $query->where('verified', $request->verified);
            }

            // Search by name, description, or industry
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('industry', 'like', "%{$search}%");
                });
            }

            // Sort results
            if ($request->has('sort')) {
                $sort = $request->sort;

                switch ($sort) {
                    case 'name_asc':
                        $query->orderBy('name', 'asc');
                        break;
                    case 'name_desc':
                        $query->orderBy('name', 'desc');
                        break;
                    case 'followers_desc':
                        $query->orderBy('followers', 'desc');
                        break;
                    case 'rating_desc':
                        $query->orderBy('rating', 'desc');
                        break;
                    case 'newest':
                        $query->orderBy('created_at', 'desc');
                        break;
                    default:
                        $query->orderBy('name', 'asc');
                }
            } else {
                $query->orderBy('name', 'asc');
            }

            // If user is authenticated, check if they're following or saved each company
            if (Auth::check()) {
                $userId = Auth::id();

                $query->with(['followers' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                }]);

                $query->with(['savedBy' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                }]);
            }

            // Load relationships but handle potential errors
            try {
                $companies = $query->with(['locations', 'specialties', 'socialLinks'])
                    ->paginate($request->per_page ?? 10);
            } catch (\Exception $e) {
                // If loading relationships fails, try without them
                $companies = $query->paginate($request->per_page ?? 10);
            }

            // Add is_following and is_saved flags
            $companies->getCollection()->transform(function ($company) {
                $company->is_following = Auth::check() ? $company->followers->isNotEmpty() : false;
                $company->is_saved = Auth::check() ? $company->savedBy->isNotEmpty() : false;

                // Remove the relationships to clean up the response
                unset($company->followers);
                unset($company->savedBy);

                return $company;
            });

            return response()->json([
                'status' => 'success',
                'data' => $companies
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch companies',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:companies',
                'description' => 'required|string',
                'industry' => 'required|string|max:255',
                'size' => 'required|string|max:255',
                'founded' => 'nullable|integer|min:1800|max:' . date('Y'),
                'website' => 'required|url|max:255',
                'headquarters' => 'required|string|max:255',
                'logo_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'cover_image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'employees' => 'nullable|integer|min:1',
                'verified' => 'boolean',
                'locations' => 'nullable|array',
                'specialties' => 'nullable|array',
                'social_links' => 'nullable|array',
            ]);

            // Handle logo file upload
            if ($request->hasFile('logo_file')) {
                $logoPath = $request->file('logo_file')->store('logos', 'public');
                $validated['logo_url'] = config('app.url') . '/storage/' . $logoPath;
            }
            // Handle cover image file upload
            if ($request->hasFile('cover_file')) {
                $coverPath = $request->file('cover_file')->store('covers', 'public');
                $validated['cover_image_url'] = config('app.url') . '/storage/' . $coverPath;
            }

            // Generate slug if not provided
            if (!isset($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['name']);
            }

            // Set default values
            $validated['followers'] = $validated['followers'] ?? 0;
            $validated['employees'] = $validated['employees'] ?? 0;
            $validated['verified'] = $validated['verified'] ?? false;

            $company = Company::create($validated);

            // Add current user as company admin if authenticated
            if (Auth::check()) {
                $company->admins()->attach(Auth::id(), [
                    'role' => 'owner',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            // Add locations if provided
            if ($request->has('locations')) {
                foreach ($request->locations as $location) {
                    $company->locations()->create($location);
                }
            }

            // Add specialties if provided
            if ($request->has('specialties')) {
                foreach ($request->specialties as $specialty) {
                    if (is_string($specialty)) {
                        $company->specialties()->create(['specialty' => $specialty]);
                    } else if (is_array($specialty) && isset($specialty['specialty'])) {
                        $company->specialties()->create(['specialty' => $specialty['specialty']]);
                    }
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
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create company',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company): JsonResponse
    {
        try {
            $company->load(['locations', 'specialties', 'socialLinks', 'jobListings' => function ($query) {
                $query->where('status', 'published')
                    ->where(function ($q) {
                        $q->whereNull('application_deadline')
                            ->orWhere('application_deadline', '>=', now());
                    });
            }]);

            // Check if user is following this company
            $isFollowing = false;
            $isSaved = false;

            if (Auth::check()) {
                $user = Auth::user();
                $isFollowing = $user->followedCompanies()->where('company_id', $company->id)->exists();
                $isSaved = $user->savedCompanies()->where('company_id', $company->id)->exists();
            }

            return response()->json([
                'status' => 'success',
                'data' => [
                    'company' => $company,
                    'is_following' => $isFollowing,
                    'is_saved' => $isSaved
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch company details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Company $company): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'string|max:255|unique:companies,name,' . $company->id,
                'description' => 'string',
                'industry' => 'string|max:255',
                'size' => 'string|max:255',
                'founded' => 'nullable|integer|min:1800|max:' . date('Y'),
                'website' => 'url|max:255',
                'headquarters' => 'string|max:255',
                'logo_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'cover_image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'employees' => 'nullable|integer|min:1',
                'verified' => 'boolean',
            ]);

            // Update slug if name has changed
            if ($request->has('name') && $request->name !== $company->name) {
                $company->slug = Str::slug($request->name);
            }

            $company->update($validated);

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
                    if (is_string($specialty)) {
                        $company->specialties()->create(['specialty' => $specialty]);
                    } else if (is_array($specialty) && isset($specialty['specialty'])) {
                        $company->specialties()->create(['specialty' => $specialty['specialty']]);
                    }
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
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update company',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company): JsonResponse
    {
        try {
            $company->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Company deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete company',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Follow a company.
     */
    public function followCompany($id): JsonResponse
    {
        try {
            $company = is_numeric($id)
                ? Company::findOrFail($id)
                : Company::where('slug', $id)->firstOrFail();

            $userId = Auth::check() ? Auth::id() : 1;

            $existingFollow = CompanyFollower::where('company_id', $company->id)
                ->where('user_id', $userId)
                ->first();

            if ($existingFollow) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Already following this company'
                ], 400);
            }

            $follow = new CompanyFollower();
            $follow->company_id = $company->id;
            $follow->user_id = $userId;
            $follow->save();

            $company->increment('followers');

            return response()->json([
                'status' => 'success',
                'message' => 'Company followed successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in CompanyController@followCompany: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to follow company',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Unfollow a company.
     */
    public function unfollowCompany($id): JsonResponse
    {
        try {
            $company = is_numeric($id)
                ? Company::findOrFail($id)
                : Company::where('slug', $id)->firstOrFail();

            $userId = Auth::check() ? Auth::id() : 1;

            $follow = CompanyFollower::where('company_id', $company->id)
                ->where('user_id', $userId)
                ->first();

            if (!$follow) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Not following this company'
                ], 400);
            }

            $follow->delete();

            if ($company->followers > 0) {
                $company->decrement('followers');
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Company unfollowed successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in CompanyController@unfollowCompany: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to unfollow company',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save a company.
     */
    public function saveCompany($id): JsonResponse
    {
        try {
            $company = is_numeric($id)
                ? Company::findOrFail($id)
                : Company::where('slug', $id)->firstOrFail();

            $userId = Auth::check() ? Auth::id() : 1;

            $existingSave = SavedCompany::where('company_id', $company->id)
                ->where('user_id', $userId)
                ->first();

            // If already saved, just return success instead of error
            if ($existingSave) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Company is already saved to favorites'
                ]);
            }

            $save = new SavedCompany();
            $save->company_id = $company->id;
            $save->user_id = $userId;
            $save->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Company saved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in CompanyController@saveCompany: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to save company',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Unsave a company.
     */
    public function unsaveCompany($id): JsonResponse
    {
        try {
            $company = is_numeric($id)
                ? Company::findOrFail($id)
                : Company::where('slug', $id)->firstOrFail();

            $userId = Auth::check() ? Auth::id() : 1;

            $save = SavedCompany::where('company_id', $company->id)
                ->where('user_id', $userId)
                ->first();

            if (!$save) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Not saved this company'
                ], 400);
            }

            $save->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Company unsaved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in CompanyController@unsaveCompany: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to unsave company',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
