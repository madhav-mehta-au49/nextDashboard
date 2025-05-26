<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyReviewRequest;
use App\Models\Company;
use App\Models\CompanyReview;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompanyReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $companyId): JsonResponse
    {
        try {
            // Find company by ID or slug
            $company = is_numeric($companyId)
                ? Company::findOrFail($companyId)
                : Company::where('slug', $companyId)->firstOrFail();

            $query = $company->reviews()->with(['user' => function ($query) {
                $query->select('id', 'name');
            }]);

            // Only show approved reviews to non-admins
            if (!Auth::check() || !$this->isUserAdmin(Auth::user())) {
                $query->where('is_approved', true);
            }

            $reviews = $query->paginate($request->per_page ?? 10);

            // Hide user details for anonymous reviews or reviews with null user_id
            $reviews->getCollection()->transform(function ($review) {
                if ($review->is_anonymous || $review->user_id === null || $review->user === null) {
                    $review->user = null; // or: ['id' => null, 'name' => 'Anonymous']
                }
                return $review;
            });

            return response()->json([
                'status' => 'success',
                'data' => $reviews
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch company reviews: ' . $e->getMessage(), [
                'company_id' => $companyId,
                'exception' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch reviews: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompanyReviewRequest $request, $companyId): JsonResponse
    {
        try {
            Log::info('CompanyReviewController@store - Request data:', [
                'companyId' => $companyId,
                'requestData' => $request->validated()
            ]);

            // Find company by ID or slug
            $company = is_numeric($companyId)
                ? Company::findOrFail($companyId)
                : Company::where('slug', $companyId)->firstOrFail();

            Log::info('CompanyReviewController@store - Company found:', [
                'company_id' => $company->id,
                'company_name' => $company->name
            ]);

            // Get validated data
            $validated = $request->validated();

            // Check for authenticated user, but don't require it
            $user = Auth::user();
            $userId = $user ? $user->id : null;

            // If user is authenticated, check for existing review
            if ($user) {
                $existingReview = CompanyReview::where('company_id', $company->id)
                    ->where('user_id', $user->id)
                    ->first();

                if ($existingReview) {
                    Log::warning('CompanyReviewController@store - User already submitted review for this company', [
                        'review_id' => $existingReview->id
                    ]);

                    return response()->json([
                        'status' => 'error',
                        'message' => 'You have already reviewed this company'
                    ], 400);
                }
            }

            DB::beginTransaction();
            try {
                // Create new review
                $review = new CompanyReview();
                $review->company_id = $company->id;
                $review->user_id = $userId; // Can be null if user is not authenticated
                $review->rating = $validated['rating'];
                $review->title = $validated['title'] ?? null;
                $review->content = $validated['content'];
                $review->relationship = $validated['relationship'] ?? null;
                $review->is_anonymous = $validated['is_anonymous'] ?? true; // Default to anonymous for unauthenticated users
                $review->is_approved = false; // Reviews need approval by default
                // Remove helpful_count and unhelpful_count since those columns don't exist
                $review->save();

                // Update company rating
                $this->updateCompanyRating($company);

                DB::commit();

                Log::info('CompanyReviewController@store - Review created successfully', [
                    'review_id' => $review->id
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Review submitted successfully and pending approval',
                    'data' => $review
                ], 201);
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Error saving review: ' . $e->getMessage(), [
                    'exception' => $e->getTraceAsString()
                ]);
                throw $e;
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Company not found: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Company not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error creating review: ' . $e->getMessage(), [
                'exception' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to submit review: ' . $e->getMessage(),
                'debug' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => explode("\n", $e->getTraceAsString())
                ] : null
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $companyId, $reviewId): JsonResponse
    {
        try {
            // Find company by ID or slug
            $company = is_numeric($companyId)
                ? Company::findOrFail($companyId)
                : Company::where('slug', $companyId)->firstOrFail();

            $review = CompanyReview::findOrFail($reviewId);

            // Check if review belongs to the company
            if ($review->company_id !== $company->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Review not found for this company'
                ], 404);
            }

            // Only show approved reviews to non-admins
            if ((!Auth::check() || !$this->isUserAdmin(Auth::user())) && !$review->is_approved) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Review not approved yet'
                ], 403);
            }

            // Load user relationship
            $review->load(['user' => function ($query) {
                $query->select('id', 'name');
            }]);

            // Hide user details for anonymous reviews
            if ($review->is_anonymous) {
                $review->user = null;
            }

            return response()->json([
                'status' => 'success',
                'data' => $review
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching review: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $companyId, $reviewId): JsonResponse
    {
        try {
            // Find company by ID or slug
            $company = is_numeric($companyId)
                ? Company::findOrFail($companyId)
                : Company::where('slug', $companyId)->firstOrFail();

            $review = CompanyReview::findOrFail($reviewId);

            // Check if review belongs to the company
            if ($review->company_id !== $company->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Review not found for this company'
                ], 404);
            }

            $user = Auth::user();

            // Only the review author or an admin can update the review
            if ($review->user_id !== $user->id && !$this->isUserAdmin($user)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You are not authorized to update this review'
                ], 403);
            }

            // Validate request
            $validated = $request->validate([
                'rating' => 'sometimes|required|integer|min:1|max:5',
                'title' => 'sometimes|nullable|string|max:255',
                'content' => 'sometimes|required|string|min:10|max:2000',
                'relationship' => 'sometimes|nullable|string|max:255',
                'is_anonymous' => 'sometimes|boolean',
            ]);

            // Update review
            $review->update($validated);

            // If admin is updating, they can also update approval status
            if ($this->isUserAdmin($user) && $request->has('is_approved')) {
                $review->is_approved = $request->boolean('is_approved');
                $review->save();
            } else {
                // If user updates their review, reset approval status
                $review->is_approved = false;
                $review->save();
            }

            // Update company rating
            $this->updateCompanyRating($company);

            return response()->json([
                'status' => 'success',
                'message' => 'Review updated successfully' . (!$review->is_approved ? ' and pending approval' : ''),
                'data' => $review
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating review: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($companyId, $reviewId): JsonResponse
    {
        try {
            // Find company by ID or slug
            $company = is_numeric($companyId)
                ? Company::findOrFail($companyId)
                : Company::where('slug', $companyId)->firstOrFail();

            $review = CompanyReview::findOrFail($reviewId);

            // Check if review belongs to the company
            if ($review->company_id !== $company->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Review not found for this company'
                ], 404);
            }

            $user = Auth::user();

            // Only the review author or an admin can delete the review
            if ($review->user_id !== $user->id && !$this->isUserAdmin($user)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You are not authorized to delete this review'
                ], 403);
            }

            // Delete review
            $review->delete();

            // Update company rating
            $this->updateCompanyRating($company);

            return response()->json([
                'status' => 'success',
                'message' => 'Review deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting review: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve a review (admin only).
     */
    public function approve($companyId, $reviewId): JsonResponse
    {
        try {
            // Find company by ID or slug
            $company = is_numeric($companyId)
                ? Company::findOrFail($companyId)
                : Company::where('slug', $companyId)->firstOrFail();

            $review = CompanyReview::findOrFail($reviewId);

            // Check if review belongs to the company
            if ($review->company_id !== $company->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Review not found for this company'
                ], 404);
            }

            $user = Auth::user();

            // Only an admin can approve reviews
            if (!$this->isUserAdmin($user)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You are not authorized to approve reviews'
                ], 403);
            }

            // Approve review
            $review->is_approved = true;
            $review->save();

            // Update company rating
            $this->updateCompanyRating($company);

            return response()->json([
                'status' => 'success',
                'message' => 'Review approved successfully',
                'data' => $review
            ]);
        } catch (\Exception $e) {
            Log::error('Error approving review: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to approve review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark a review as helpful.
     */
    public function markHelpful(Request $request, $companyId, $reviewId): JsonResponse
    {
        try {
            // Find company by ID or slug
            $company = is_numeric($companyId)
                ? Company::findOrFail($companyId)
                : Company::where('slug', $companyId)->firstOrFail();

            $review = CompanyReview::findOrFail($reviewId);
            $user = Auth::user();

            // Check if review belongs to the company
            if ($review->company_id !== $company->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Review not found for this company'
                ], 404);
            }

            // Check if user has already marked this review
            $existingFeedback = $review->feedback()->where('user_id', $user->id)->first();

            if ($existingFeedback) {
                if ($existingFeedback->is_helpful) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'You have already marked this review as helpful'
                    ], 400);
                }

                // Update from unhelpful to helpful
                $existingFeedback->update(['is_helpful' => true]);
                $review->decrement('unhelpful_count');
                $review->increment('helpful_count');
            } else {
                // Create new feedback
                $review->feedback()->create([
                    'user_id' => $user->id,
                    'is_helpful' => true
                ]);

                $review->increment('helpful_count');
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Review marked as helpful',
                'data' => [
                    'helpful_count' => $review->helpful_count,
                    'unhelpful_count' => $review->unhelpful_count
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error marking review as helpful: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to mark review as helpful: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark a review as unhelpful.
     */
    public function markUnhelpful(Request $request, $companyId, $reviewId): JsonResponse
    {
        try {
            // Find company by ID or slug
            $company = is_numeric($companyId)
                ? Company::findOrFail($companyId)
                : Company::where('slug', $companyId)->firstOrFail();

            $review = CompanyReview::findOrFail($reviewId);
            $user = Auth::user();

            // Check if review belongs to the company
            if ($review->company_id !== $company->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Review not found for this company'
                ], 404);
            }

            // Check if user has already marked this review
            $existingFeedback = $review->feedback()->where('user_id', $user->id)->first();

            if ($existingFeedback) {
                if (!$existingFeedback->is_helpful) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'You have already marked this review as unhelpful'
                    ], 400);
                }

                // Update from helpful to unhelpful
                $existingFeedback->update(['is_helpful' => false]);
                $review->decrement('helpful_count');
                $review->increment('unhelpful_count');
            } else {
                // Create new feedback
                $review->feedback()->create([
                    'user_id' => $user->id,
                    'is_helpful' => false
                ]);

                $review->increment('unhelpful_count');
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Review marked as unhelpful',
                'data' => [
                    'helpful_count' => $review->helpful_count,
                    'unhelpful_count' => $review->unhelpful_count
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error marking review as unhelpful: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to mark review as unhelpful: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Report a review.
     */
    public function reportReview(Request $request, $companyId, $reviewId): JsonResponse
    {
        try {
            // Find company by ID or slug
            $company = is_numeric($companyId)
                ? Company::findOrFail($companyId)
                : Company::where('slug', $companyId)->firstOrFail();

            $review = CompanyReview::findOrFail($reviewId);
            $user = Auth::user();

            // Check if review belongs to the company
            if ($review->company_id !== $company->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Review not found for this company'
                ], 404);
            }

            // Validate request
            $validated = $request->validate([
                'reason' => 'required|string|max:500',
            ]);

            // Check if user has already reported this review
            $existingReport = $review->reports()->where('user_id', $user->id)->first();

            if ($existingReport) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You have already reported this review'
                ], 400);
            }

            // Create report
            $review->reports()->create([
                'user_id' => $user->id,
                'reason' => $validated['reason']
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Review reported successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error reporting review: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to report review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the company's average rating.
     */
    private function updateCompanyRating(Company $company): void
    {
        try {
            $averageRating = $company->reviews()
                ->where('is_approved', true)
                ->avg('rating');

            $company->rating = $averageRating ?: 0;
            $company->save();
        } catch (\Exception $e) {
            Log::error('Error updating company rating: ' . $e->getMessage());
            // Don't throw - we don't want to fail the entire operation if just the rating update fails
        }
    }

    /**
     * Check if a user is an admin.
     */
    private function isUserAdmin($user): bool
    {
        if (!$user) {
            return false;
        }

        // Check various ways a user might be an admin
        if (method_exists($user, 'isAdmin')) {
            return $user->isAdmin();
        }

        // Check if user has admin role/attribute
        if (isset($user->role) && $user->role === 'admin') {
            return true;
        }

        // Check if user is a member of admins table/relationship
        if (method_exists($user, 'hasRole') && $user->hasRole('admin')) {
            return true;
        }

        // For development purposes, enable this to bypass admin checks in local environment
        return config('app.env') === 'local';
    }
}
