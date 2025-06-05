<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\JobApplication;
use App\Models\Company;
use App\Http\Resources\JobListingResource;
use App\Http\Resources\JobApplicationResource;
use App\Services\JobAnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CompanyDashboardController extends Controller
{
    protected $jobAnalyticsService;

    public function __construct(JobAnalyticsService $jobAnalyticsService)
    {
        $this->jobAnalyticsService = $jobAnalyticsService;
    }    /**
     * Get company dashboard data - only for authenticated company users
     */
    public function dashboard(Request $request): JsonResponse
    {
        $user = Auth::user();
        $companyIds = $request->get('user_company_ids', []);
        $companyId = $request->get('company_id');

        // Admin users can see all data
        if ($user->isAdmin()) {
            $companyIds = Company::pluck('id')->toArray();
        }

        if (empty($companyIds)) {
            return response()->json([
                'status' => 'error',
                'message' => 'No companies associated with your account'
            ], 403);
        }

        // If a specific company ID is provided, check access and use only that company
        if ($companyId) {
            if (!in_array($companyId, $companyIds)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You do not have access to this company'
                ], 403);
            }
            // Use only the specified company
            $companyIds = [$companyId];
        }

        // Get dashboard statistics
        $stats = $this->getDashboardStats($companyIds);
        
        // Get recent applications
        $recentApplications = $this->getRecentApplications($companyIds, 10);
        
        // Get active job listings
        $activeJobs = $this->getActiveJobs($companyIds, 10);
        
        // Get companies user manages
        $companies = Company::whereIn('id', $companyIds)
            ->select('id', 'name', 'slug', 'logo_url')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'stats' => $stats,
                'recent_applications' => JobApplicationResource::collection($recentApplications),
                'active_jobs' => JobListingResource::collection($activeJobs),
                'companies' => $companies,
                'user_role' => $user->role,
                'is_admin' => $user->isAdmin(),
            ]
        ]);
    }    /**
     * Get company-specific job listings
     */
    public function jobs(Request $request): JsonResponse
    {
        $user = Auth::user();
        $companyIds = $request->get('user_company_ids', []);

        if ($user->isAdmin()) {
            $companyIds = Company::pluck('id')->toArray();
        }

        if (empty($companyIds)) {
            return response()->json([
                'status' => 'error',
                'message' => 'No companies associated with your account'
            ], 403);
        }

        $perPage = $request->get('per_page', 15);
        $status = $request->get('status');
        $search = $request->get('search');
        $companyId = $request->get('company_id'); // Add company_id filter

        $query = JobListing::with(['company', 'skills']);
        
        // If specific company_id is provided, filter by that company
        if ($companyId) {
            // Verify user has access to this company
            if (!in_array($companyId, $companyIds)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You do not have access to this company'
                ], 403);
            }
            $query->where('company_id', $companyId);
        } else {
            // Otherwise, show jobs from all user's companies
            $query->whereIn('company_id', $companyIds);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        $jobs = $query->orderBy('created_at', 'desc')
                     ->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => JobListingResource::collection($jobs),
            'meta' => [
                'current_page' => $jobs->currentPage(),
                'last_page' => $jobs->lastPage(),
                'per_page' => $jobs->perPage(),
                'total' => $jobs->total(),
            ]
        ]);
    }    /**
     * Get company-specific job applications
     */
    public function applications(Request $request): JsonResponse
    {
        $user = Auth::user();
        $companyIds = $request->get('user_company_ids', []);
        $companyId = $request->get('company_id');

        if ($user->isAdmin()) {
            $companyIds = Company::pluck('id')->toArray();
        }

        if (empty($companyIds)) {
            return response()->json([
                'status' => 'error',
                'message' => 'No companies associated with your account'
            ], 403);
        }

        // If a specific company ID is provided, check access and use only that company
        if ($companyId) {
            if (!in_array($companyId, $companyIds)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You do not have access to this company'
                ], 403);
            }
            // Use only the specified company
            $companyIds = [$companyId];
        }

        $perPage = $request->get('per_page', 15);
        $status = $request->get('status');
        $jobId = $request->get('job_id');

        $query = JobApplication::with(['candidate.user', 'jobListing.company'])
            ->whereHas('jobListing', function($q) use ($companyIds) {
                $q->whereIn('company_id', $companyIds);
            });

        if ($status) {
            $query->where('status', $status);
        }

        if ($jobId) {
            $query->where('job_listing_id', $jobId);
        }

        $applications = $query->orderBy('applied_at', 'desc')
                             ->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => JobApplicationResource::collection($applications),
            'meta' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'per_page' => $applications->perPage(),
                'total' => $applications->total(),
            ]
        ]);
    }    /**
     * Get analytics for company jobs
     */
    public function analytics(Request $request): JsonResponse
    {
        $user = Auth::user();
        $companyIds = $request->get('user_company_ids', []);
        $companyId = $request->get('company_id');

        if ($user->isAdmin()) {
            $companyIds = Company::pluck('id')->toArray();
        }

        if (empty($companyIds)) {
            return response()->json([
                'status' => 'error',
                'message' => 'No companies associated with your account'
            ], 403);
        }

        // If a specific company ID is provided, check access and use only that company
        if ($companyId) {
            if (!in_array($companyId, $companyIds)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You do not have access to this company'
                ], 403);
            }
            // Use only the specified company
            $companyIds = [$companyId];
        }

        $analytics = [];

        foreach ($companyIds as $id) {
            $company = Company::find($id);
            if ($company) {
                $analytics[$company->name] = $this->jobAnalyticsService->getCompanyJobAnalytics($company);
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => $analytics
        ]);
    }

    /**
     * Get dashboard statistics for company
     */
    private function getDashboardStats(array $companyIds): array
    {
        $totalJobs = JobListing::whereIn('company_id', $companyIds)->count();
        $activeJobs = JobListing::whereIn('company_id', $companyIds)
                                ->where('status', 'active')
                                ->count();
        
        $totalApplications = JobApplication::whereHas('jobListing', function($q) use ($companyIds) {
            $q->whereIn('company_id', $companyIds);
        })->count();
        
        $pendingApplications = JobApplication::whereHas('jobListing', function($q) use ($companyIds) {
            $q->whereIn('company_id', $companyIds);
        })->where('status', 'pending')->count();

        $viewsThisMonth = JobListing::whereIn('company_id', $companyIds)
                                   ->whereMonth('created_at', now()->month)
                                   ->sum('views_count');

        $applicationsThisMonth = JobApplication::whereHas('jobListing', function($q) use ($companyIds) {
            $q->whereIn('company_id', $companyIds);
        })->whereMonth('applied_at', now()->month)->count();

        return [
            'total_jobs' => $totalJobs,
            'active_jobs' => $activeJobs,
            'total_applications' => $totalApplications,
            'pending_applications' => $pendingApplications,
            'views_this_month' => $viewsThisMonth,
            'applications_this_month' => $applicationsThisMonth,
        ];
    }

    /**
     * Get recent applications for company
     */
    private function getRecentApplications(array $companyIds, int $limit = 10)
    {
        return JobApplication::with(['candidate', 'candidate.user', 'jobListing'])
            ->whereHas('jobListing', function($q) use ($companyIds) {
                $q->whereIn('company_id', $companyIds);
            })
            ->orderBy('applied_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get active jobs for company
     */
    private function getActiveJobs(array $companyIds, int $limit = 10)
    {
        return JobListing::with(['company'])
            ->whereIn('company_id', $companyIds)
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
