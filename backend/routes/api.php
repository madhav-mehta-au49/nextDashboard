<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompanyAdminController;
use App\Http\Controllers\CompanyFollowerController;
use App\Http\Controllers\CompanyReviewController;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\SavedJobController;
use App\Http\Controllers\InterviewController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Public company routes
Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/companies/{company}', [CompanyController::class, 'show']);
Route::get('/companies/{company}/job-listings', [CompanyController::class, 'jobListings']);
Route::get('/companies/{company}/similar', [CompanyController::class, 'similarCompanies']);
Route::post('/companies', [CompanyController::class, 'store']);
Route::put('/companies/{company}', [CompanyController::class, 'update']);
Route::delete('/companies/{company}', [CompanyController::class, 'destroy']);

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

// Job listings
Route::get('/job-listings', [JobListingController::class, 'index']);
Route::get('/job-listings/{jobListing}', [JobListingController::class, 'show']);
Route::get('/job-listings/{jobListing}/similar', [JobListingController::class, 'similar']);
Route::post('/job-listings', [JobListingController::class, 'store']);
Route::put('/job-listings/{jobListing}', [JobListingController::class, 'update']);
Route::delete('/job-listings/{jobListing}', [JobListingController::class, 'destroy']);

// Company interactions
Route::post('/companies/{company}/follow', [CompanyController::class, 'followCompany']);
Route::delete('/companies/{company}/follow', [CompanyController::class, 'unfollowCompany']);
Route::post('/companies/{company}/save', [CompanyController::class, 'saveCompany']);
Route::delete('/companies/{company}/save', [CompanyController::class, 'unsaveCompany']);
Route::post('/companies/{company}/share', [CompanyController::class, 'shareCompany']);
Route::post('/companies/{company}/contact', [CompanyController::class, 'contactCompany']);
Route::get('/followed-companies', [CompanyFollowerController::class, 'index']);
Route::get('/saved-companies', [CompanyController::class, 'savedCompanies']);

// Company admins
Route::get('/administered-companies', [CompanyAdminController::class, 'index']);
Route::post('/company-admins', [CompanyAdminController::class, 'store']);
Route::delete('/companies/{company}/admins/{userId}', [CompanyAdminController::class, 'destroy']);

// Job applications
Route::get('/job-applications', [JobApplicationController::class, 'index']);
Route::post('/job-applications', [JobApplicationController::class, 'store']);
Route::get('/job-applications/{jobApplication}', [JobApplicationController::class, 'show']);
Route::put('/job-applications/{jobApplication}', [JobApplicationController::class, 'update']);
Route::delete('/job-applications/{jobApplication}', [JobApplicationController::class, 'destroy']);

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
//Route::get('candidates/{candidate}/dashboard', [CandidateController::class, 'dashboard']);

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
