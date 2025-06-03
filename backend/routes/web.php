<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Here is where you can register API routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them
| will be assigned to the "api" middleware group.
*/

Route::get('/test-web', function() {
    return response()->json(['message' => 'Web route is working']);
});

// 🔓 Public Routes (Accessible without login)
Route::get('/jobs', [JobListingController::class, 'index']);
Route::get('/jobs/{job}', [JobListingController::class, 'show']);

Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/companies/{company}', [CompanyController::class, 'show']);

Route::get('/candidates/{candidate}', [CandidateController::class, 'showPublic']);
Route::get('/users/{user}/profile', [UserController::class, 'publicProfile']);

// OAuth Routes (need to stay in web.php for redirects)
Route::get('/auth/{provider}', [AuthController::class, 'redirectToProvider']);
Route::get('/auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);

// Authenticated routes
Route::middleware('auth')->group(function () {
    // ✅ User Profile
    Route::put('/user', [UserController::class, 'update']);

    // ✅ Candidate personal info
    Route::apiResource('/educations', EducationController::class);
    Route::apiResource('/certifications', CertificationController::class);
    Route::apiResource('/experiences', ExperienceController::class);
    // Skills routes moved to api.php to avoid conflicts

    // ✅ Job Applications
    Route::post('/job-applications', [JobApplicationController::class, 'store']);
    Route::get('/my-applications', [JobApplicationController::class, 'myApplications']);
    Route::delete('/job-applications/{jobApplication}', [JobApplicationController::class, 'destroy']);

    // ✅ Job Listings (for employers)
    Route::post('/jobs', [JobListingController::class, 'store']);
    Route::put('/jobs/{job}', [JobListingController::class, 'update']);
    Route::delete('/jobs/{job}', [JobListingController::class, 'destroy']);

    // ✅ Company (for admins or company users)
    Route::post('/companies', [CompanyController::class, 'store']);
    Route::put('/companies/{company}', [CompanyController::class, 'update']);
    Route::delete('/companies/{company}', [CompanyController::class, 'destroy']);
});

// 🔒 Optional Admin Routes
Route::middleware(['auth', 'is_admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return response()->json(['message' => 'Welcome to admin dashboard']);
    });
});