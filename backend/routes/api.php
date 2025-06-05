<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompanyAdminController;
use App\Http\Controllers\CompanyFollowerController;
use App\Http\Controllers\CompanyReviewController;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\JobCategoryController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\CompanyDashboardController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\SavedJobController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Authentication routes (no CSRF protection in API)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// OAuth Routes (these might need to stay in web.php for redirects)
Route::get('/auth/{provider}', [AuthController::class, 'redirectToProvider']);
Route::get('/auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);

// Authenticated user routes
Route::middleware('auth:api')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Public company routes
Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/companies/{company}', [CompanyController::class, 'show']);
Route::get('/companies/{company}/job-listings', [CompanyController::class, 'jobListings']);
Route::get('/companies/{company}/similar', [CompanyController::class, 'similarCompanies']);

// Public job listings routes
Route::get('/job-listings', [JobListingController::class, 'index']);
Route::get('/job-listings/search', [JobListingController::class, 'search']);
Route::get('/job-listings/recommendations', [JobListingController::class, 'recommendations']);
Route::get('/job-listings/analytics', [JobListingController::class, 'analytics']);
Route::get('/job-listings/{jobListing}', [JobListingController::class, 'show']);
Route::get('/job-listings/{jobListing}/similar', [JobListingController::class, 'similar']);

// Job categories (public)
Route::get('/job-categories', [JobCategoryController::class, 'index']);

// Authentication required routes
Route::middleware('auth:api')->group(function () {
    // Company interactions (candidates and general users)
    Route::post('/companies/{company}/follow', [CompanyController::class, 'followCompany']);
    Route::delete('/companies/{company}/follow', [CompanyController::class, 'unfollowCompany']);
    Route::post('/companies/{company}/save', [CompanyController::class, 'saveCompany']);
    Route::delete('/companies/{company}/save', [CompanyController::class, 'unsaveCompany']);
    Route::post('/companies/{company}/share', [CompanyController::class, 'shareCompany']);
    Route::post('/companies/{company}/contact', [CompanyController::class, 'contactCompany']);
    Route::get('/followed-companies', [CompanyFollowerController::class, 'index']);
    Route::get('/saved-companies', [CompanyController::class, 'savedCompanies']);

    // Job interactions for candidates
    Route::post('/job-listings/{jobListing}/save', [JobListingController::class, 'saveJob']);
    Route::delete('/job-listings/{jobListing}/save', [JobListingController::class, 'unsaveJob']);
    
    // Job applications for candidates
    Route::post('/job-applications', [JobApplicationController::class, 'store']);
    
    // Get current user's candidate profile (requires authentication)
    Route::get('candidates/me', [CandidateController::class, 'getCurrentUserProfile']);
});

// Company dashboard and management routes (require company authentication)
Route::middleware(['auth:api', 'company.auth'])->group(function () {
    // Company dashboard routes
    Route::get('/company/dashboard', [CompanyDashboardController::class, 'dashboard']);
    Route::get('/company/dashboard/jobs', [CompanyDashboardController::class, 'jobs']);
    Route::get('/company/dashboard/applications', [CompanyDashboardController::class, 'applications']);
    Route::get('/company/dashboard/analytics', [CompanyDashboardController::class, 'analytics']);
    
    // Company management routes
    Route::post('/companies', [CompanyController::class, 'store']);
    Route::put('/companies/{company}', [CompanyController::class, 'update']);
    Route::delete('/companies/{company}', [CompanyController::class, 'destroy']);
    
    // Job listing management for companies
    Route::post('/job-listings', [JobListingController::class, 'store']);
    Route::put('/job-listings/{jobListing}', [JobListingController::class, 'update']);
    Route::delete('/job-listings/{jobListing}', [JobListingController::class, 'destroy']);    
    // Company-specific job application management
    Route::get('/job-applications', [JobApplicationController::class, 'index']);
    Route::get('/job-applications/analytics', [JobApplicationController::class, 'analytics']);
    Route::post('/job-applications/bulk-status', [JobApplicationController::class, 'bulkUpdateStatus']);
    Route::get('/job-applications/{jobApplication}', [JobApplicationController::class, 'show']);
    Route::put('/job-applications/{jobApplication}', [JobApplicationController::class, 'update']);
    Route::delete('/job-applications/{jobApplication}', [JobApplicationController::class, 'destroy']);
    Route::get('/job-listings/{jobListing}/matching-candidates', [JobApplicationController::class, 'matchingCandidates']);
    
    // Company admin management
    Route::get('/administered-companies', [CompanyAdminController::class, 'index']);
    Route::post('/company-admins', [CompanyAdminController::class, 'store']);
    Route::delete('/companies/{company}/admins/{userId}', [CompanyAdminController::class, 'destroy']);
});

// Company reviews
Route::get('/companies/{company}/reviews', [CompanyReviewController::class, 'index']);
Route::get('/companies/{company}/reviews/{review}', [CompanyReviewController::class, 'show']);
Route::post('/companies/{company}/reviews', [CompanyReviewController::class, 'store']);
Route::put('/companies/{company}/reviews/{review}', [CompanyReviewController::class, 'update']);
Route::delete('/companies/{company}/reviews/{review}', [CompanyReviewController::class, 'destroy']);
Route::patch('/companies/{company}/reviews/{review}/approve', [CompanyReviewController::class, 'approve']);
Route::post('/companies/{company}/reviews/{review}/helpful', [CompanyReviewController::class, 'markHelpful']);
Route::post('/companies/{company}/reviews/{review}/unhelpful', [CompanyReviewController::class, 'markUnhelpful']);
Route::post('/companies/{company}/reviews/{review}/report', [CompanyReviewController::class, 'reportReview']);

// Fetch candidate by slug (name) - Important: This must be defined BEFORE the resource route to avoid conflicts
Route::get('candidates/slug/{slug}', [CandidateController::class, 'showBySlug']);

// Candidate module routes
Route::apiResource('candidates', CandidateController::class);

// Enhanced Candidate endpoints
Route::get('candidates/{candidate}/applications', [CandidateController::class, 'applications']);
Route::get('candidates/{candidate}/saved-jobs', [CandidateController::class, 'savedJobs']);
Route::get('candidates/{candidate}/recommendations', [CandidateController::class, 'recommendations']);
Route::get('candidates/{candidate}/interviews', [CandidateController::class, 'interviews']);
Route::get('candidates/{candidate}/profile-completion', [CandidateController::class, 'profileCompletionChecklist']);

// Candidate skills management
Route::post('candidates/{candidate}/skills', [CandidateController::class, 'addSkill']);
Route::delete('candidates/{candidate}/skills', [CandidateController::class, 'removeSkill']);

// Candidate related resources
Route::apiResource('candidates.experiences', ExperienceController::class);
Route::apiResource('candidates.educations', EducationController::class);
Route::apiResource('candidates.certifications', CertificationController::class);
Route::apiResource('candidates.saved-jobs', SavedJobController::class);

// Skills (for listing/searching skills)
Route::apiResource('skills', SkillController::class)->only(['index', 'show']);

// Interview routes
Route::apiResource('interviews', InterviewController::class);
Route::get('candidates/{candidate}/interviews', [InterviewController::class, 'candidateInterviews']);
Route::post('interviews/{interview}/feedback', [InterviewController::class, 'addFeedback']);
Route::post('interviews/{interview}/reschedule', [InterviewController::class, 'reschedule']);
Route::post('interviews/{interview}/cancel', [InterviewController::class, 'cancel']);
Route::get('interviews-calendar', [InterviewController::class, 'calendar']);

// TEMPORARY: Test route to verify JobApplicationResource fix
Route::get('/test/recent-applications', function() {
    $recentApplications = \App\Models\JobApplication::with(['candidate', 'candidate.user', 'jobListing'])
        ->orderBy('applied_at', 'desc')
        ->limit(5)
        ->get();
    
    return response()->json([
        'status' => 'success',
        'data' => \App\Http\Resources\JobApplicationResource::collection($recentApplications)
    ]);
});
