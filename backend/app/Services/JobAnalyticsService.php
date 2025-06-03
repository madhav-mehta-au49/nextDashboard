<?php

namespace App\Services;

use App\Models\JobListing;
use App\Models\JobApplication;
use App\Models\Company;
use App\Models\Candidate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class JobAnalyticsService
{
    /**
     * Get comprehensive job market analytics
     */
    public function getJobMarketAnalytics(array $filters = []): array
    {
        return [
            'overview' => $this->getMarketOverview($filters),
            'trending_skills' => $this->getTrendingSkills($filters),
            'salary_trends' => $this->getSalaryTrends($filters),
            'location_analysis' => $this->getLocationAnalysis($filters),
            'company_insights' => $this->getCompanyInsights($filters),
            'demand_forecast' => $this->getDemandForecast($filters),
        ];
    }

    /**
     * Get analytics for a specific company's job postings
     */
    public function getCompanyJobAnalytics(Company $company): array
    {
        $jobs = $company->jobListings()->with(['applications.candidate', 'skills'])->get();

        return [
            'job_metrics' => $this->getJobMetrics($jobs),
            'application_analytics' => $this->getApplicationAnalytics($jobs),
            'performance_metrics' => $this->getPerformanceMetrics($jobs),
            'candidate_insights' => $this->getCandidateInsights($jobs),
            'time_to_fill' => $this->getTimeToFillAnalytics($jobs),
            'cost_per_hire' => $this->getCostPerHireAnalytics($jobs),
            'source_effectiveness' => $this->getSourceEffectiveness($jobs),
        ];
    }

    /**
     * Get job listing performance analytics
     */
    public function getJobListingAnalytics(JobListing $job): array
    {
        return [
            'basic_metrics' => $this->getBasicJobMetrics($job),
            'application_flow' => $this->getApplicationFlow($job),
            'candidate_quality' => $this->getCandidateQuality($job),
            'engagement_metrics' => $this->getEngagementMetrics($job),
            'benchmarking' => $this->getBenchmarkingData($job),
            'optimization_suggestions' => $this->getOptimizationSuggestions($job),
        ];
    }

    /**
     * Get market overview statistics
     */
    private function getMarketOverview(array $filters): array
    {
        $query = JobListing::query();
        $this->applyFilters($query, $filters);

        $totalJobs = $query->count();
        $activeJobs = $query->where('status', 'active')->count();
        $remoteJobs = $query->where('is_remote', true)->count();
        
        $applicationsQuery = JobApplication::query()
            ->whereHas('jobListing', function ($q) use ($filters) {
                $this->applyFilters($q, $filters);
            });

        return [
            'total_jobs' => $totalJobs,
            'active_jobs' => $activeJobs,
            'remote_jobs' => $remoteJobs,
            'remote_percentage' => $totalJobs > 0 ? round(($remoteJobs / $totalJobs) * 100, 1) : 0,
            'total_applications' => $applicationsQuery->count(),
            'avg_applications_per_job' => $activeJobs > 0 ? round($applicationsQuery->count() / $activeJobs, 1) : 0,
            'jobs_posted_this_week' => $query->where('posted_date', '>=', now()->startOfWeek())->count(),
            'jobs_posted_this_month' => $query->where('posted_date', '>=', now()->startOfMonth())->count(),
        ];
    }

    /**
     * Get trending skills analytics
     */
    private function getTrendingSkills(array $filters): array
    {
        $query = DB::table('job_skills')
            ->join('skills', 'job_skills.skill_id', '=', 'skills.id')
            ->join('job_listings', 'job_skills.job_listing_id', '=', 'job_listings.id')
            ->where('job_listings.status', 'active');

        if (isset($filters['date_from'])) {
            $query->where('job_listings.posted_date', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->where('job_listings.posted_date', '<=', $filters['date_to']);
        }

        $skillDemand = $query
            ->select('skills.name', DB::raw('COUNT(*) as demand_count'))
            ->groupBy('skills.id', 'skills.name')
            ->orderByDesc('demand_count')
            ->limit(20)
            ->get();

        // Calculate growth rate compared to previous period
        $skillsWithGrowth = $skillDemand->map(function ($skill) use ($filters) {
            $previousPeriodDemand = $this->getPreviousPeriodSkillDemand($skill->name, $filters);
            $growthRate = $previousPeriodDemand > 0 
                ? round((($skill->demand_count - $previousPeriodDemand) / $previousPeriodDemand) * 100, 1)
                : 0;

            return [
                'skill' => $skill->name,
                'current_demand' => $skill->demand_count,
                'previous_demand' => $previousPeriodDemand,
                'growth_rate' => $growthRate,
            ];
        });

        return $skillsWithGrowth->toArray();
    }

    /**
     * Get salary trends analytics
     */
    private function getSalaryTrends(array $filters): array
    {
        $query = JobListing::query()
            ->where('status', 'active')
            ->whereNotNull('salary_min')
            ->whereNotNull('salary_max');

        $this->applyFilters($query, $filters);

        $salaryData = $query->get();

        $byExperienceLevel = $salaryData->groupBy('experience_level')->map(function ($jobs) {
            return [
                'avg_min' => round($jobs->avg('salary_min'), 0),
                'avg_max' => round($jobs->avg('salary_max'), 0),
                'median_min' => $this->calculateMedian($jobs->pluck('salary_min')),
                'median_max' => $this->calculateMedian($jobs->pluck('salary_max')),
                'count' => $jobs->count(),
            ];
        });

        $byJobType = $salaryData->groupBy('type')->map(function ($jobs) {
            return [
                'avg_min' => round($jobs->avg('salary_min'), 0),
                'avg_max' => round($jobs->avg('salary_max'), 0),
                'count' => $jobs->count(),
            ];
        });

        return [
            'overall' => [
                'avg_min' => round($salaryData->avg('salary_min'), 0),
                'avg_max' => round($salaryData->avg('salary_max'), 0),
                'median_min' => $this->calculateMedian($salaryData->pluck('salary_min')),
                'median_max' => $this->calculateMedian($salaryData->pluck('salary_max')),
            ],
            'by_experience_level' => $byExperienceLevel,
            'by_job_type' => $byJobType,
            'salary_distribution' => $this->getSalaryDistribution($salaryData),
        ];
    }

    /**
     * Get location-based analytics
     */
    private function getLocationAnalysis(array $filters): array
    {
        $query = JobListing::query()->where('status', 'active');
        $this->applyFilters($query, $filters);

        $locationData = $query
            ->whereNotNull('location')
            ->where('location', '!=', '')
            ->get()
            ->groupBy(function ($job) {
                // Extract city from location (simplified)
                return explode(',', $job->location)[0] ?? $job->location;
            })
            ->map(function ($jobs) {
                return [
                    'job_count' => $jobs->count(),
                    'avg_salary_min' => round($jobs->whereNotNull('salary_min')->avg('salary_min'), 0),
                    'avg_salary_max' => round($jobs->whereNotNull('salary_max')->avg('salary_max'), 0),
                    'remote_percentage' => round(($jobs->where('is_remote', true)->count() / $jobs->count()) * 100, 1),
                ];
            })
            ->sortByDesc('job_count')
            ->take(15);

        return $locationData->toArray();
    }

    /**
     * Get company insights
     */
    private function getCompanyInsights(array $filters): array
    {
        $query = Company::query()
            ->withCount(['jobListings' => function ($q) use ($filters) {
                $q->where('status', 'active');
                $this->applyFilters($q, $filters);
            }])
            ->having('job_listings_count', '>', 0)
            ->orderByDesc('job_listings_count');

        return [
            'top_hiring_companies' => $query->take(10)->get()->map(function ($company) {
                return [
                    'name' => $company->name,
                    'job_count' => $company->job_listings_count,
                    'avg_rating' => $company->rating,
                ];
            }),
            'company_size_distribution' => $this->getCompanySizeDistribution($filters),
            'industry_distribution' => $this->getIndustryDistribution($filters),
        ];
    }

    /**
     * Get demand forecast
     */
    private function getDemandForecast(array $filters): array
    {
        // This is a simplified forecast - in production you'd use ML models
        $monthlyData = JobListing::query()
            ->where('status', 'active')
            ->where('posted_date', '>=', now()->subMonths(12))
            ->get()
            ->groupBy(function ($job) {
                return $job->posted_date->format('Y-m');
            })
            ->map->count()
            ->sortKeys();

        // Simple trend calculation
        $values = $monthlyData->values()->toArray();
        $trend = $this->calculateTrend($values);

        return [
            'monthly_posting_trend' => $monthlyData->toArray(),
            'trend_direction' => $trend > 0 ? 'increasing' : ($trend < 0 ? 'decreasing' : 'stable'),
            'trend_percentage' => round(abs($trend), 1),
            'forecast_next_month' => $this->forecastNextMonth($values),
        ];
    }

    /**
     * Apply filters to query
     */
    private function applyFilters($query, array $filters): void
    {
        if (isset($filters['location'])) {
            $query->where('location', 'like', "%{$filters['location']}%");
        }

        if (isset($filters['job_type'])) {
            $query->whereIn('type', (array) $filters['job_type']);
        }

        if (isset($filters['experience_level'])) {
            $query->whereIn('experience_level', (array) $filters['experience_level']);
        }

        if (isset($filters['date_from'])) {
            $query->where('posted_date', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->where('posted_date', '<=', $filters['date_to']);
        }
    }

    /**
     * Calculate median of a collection
     */
    private function calculateMedian(Collection $values): float
    {
        $sorted = $values->filter()->sort()->values();
        $count = $sorted->count();
        
        if ($count === 0) return 0;
        
        if ($count % 2 === 0) {
            return ($sorted[$count / 2 - 1] + $sorted[$count / 2]) / 2;
        }
        
        return $sorted[intval($count / 2)];
    }

    /**
     * Get salary distribution
     */
    private function getSalaryDistribution($salaryData): array
    {
        $ranges = [
            '0-30k' => 0,
            '30k-50k' => 0,
            '50k-75k' => 0,
            '75k-100k' => 0,
            '100k-150k' => 0,
            '150k+' => 0,
        ];

        foreach ($salaryData as $job) {
            $avgSalary = ($job->salary_min + $job->salary_max) / 2;
            
            if ($avgSalary < 30000) $ranges['0-30k']++;
            elseif ($avgSalary < 50000) $ranges['30k-50k']++;
            elseif ($avgSalary < 75000) $ranges['50k-75k']++;
            elseif ($avgSalary < 100000) $ranges['75k-100k']++;
            elseif ($avgSalary < 150000) $ranges['100k-150k']++;
            else $ranges['150k+']++;
        }

        return $ranges;
    }

    /**
     * Calculate trend from time series data
     */
    private function calculateTrend(array $values): float
    {
        if (count($values) < 2) return 0;
        
        $n = count($values);
        $x = range(1, $n);
        
        $sumX = array_sum($x);
        $sumY = array_sum($values);
        $sumXY = array_sum(array_map(function ($i, $val) { return $i * $val; }, $x, $values));
        $sumXX = array_sum(array_map(function ($i) { return $i * $i; }, $x));
        
        $slope = ($n * $sumXY - $sumX * $sumY) / ($n * $sumXX - $sumX * $sumX);
        
        return $slope;
    }

    /**
     * Forecast next month's job postings
     */
    private function forecastNextMonth(array $values): int
    {
        if (count($values) < 3) return end($values) ?: 0;
        
        // Simple moving average forecast
        $lastThree = array_slice($values, -3);
        return round(array_sum($lastThree) / count($lastThree));
    }

    /**
     * Get previous period skill demand for growth calculation
     */
    private function getPreviousPeriodSkillDemand(string $skillName, array $filters): int
    {
        // Implementation would calculate demand for previous period
        // This is a placeholder
        return rand(1, 50);
    }

    /**
     * Get additional analytics methods for completeness
     */
    private function getJobMetrics($jobs): array
    {
        return [
            'total_jobs' => $jobs->count(),
            'active_jobs' => $jobs->where('status', 'active')->count(),
            'draft_jobs' => $jobs->where('status', 'draft')->count(),
            'closed_jobs' => $jobs->where('status', 'closed')->count(),
        ];
    }

    private function getApplicationAnalytics($jobs): array
    {
        $applications = $jobs->flatMap->applications;
        
        return [
            'total_applications' => $applications->count(),
            'avg_applications_per_job' => $jobs->count() > 0 ? round($applications->count() / $jobs->count(), 1) : 0,
            'application_status_breakdown' => $applications->groupBy('status')->map->count(),
        ];
    }

    private function getPerformanceMetrics($jobs): array
    {
        return [
            'jobs_with_applications' => $jobs->filter(function ($job) {
                return $job->applications->count() > 0;
            })->count(),
            'avg_time_to_first_application' => $this->calculateAvgTimeToFirstApplication($jobs),
        ];
    }

    private function getCandidateInsights($jobs): array
    {
        $candidates = $jobs->flatMap->applications->pluck('candidate')->unique('id');
        
        return [
            'unique_candidates' => $candidates->count(),
            'top_candidate_skills' => $this->getTopCandidateSkills($candidates),
        ];
    }

    private function getTimeToFillAnalytics($jobs): array
    {
        // Implementation for time-to-fill analytics
        return ['avg_days' => 0]; // Placeholder
    }

    private function getCostPerHireAnalytics($jobs): array
    {
        // Implementation for cost-per-hire analytics
        return ['avg_cost' => 0]; // Placeholder
    }

    private function getSourceEffectiveness($jobs): array
    {
        // Implementation for source effectiveness analytics
        return []; // Placeholder
    }

    private function getBasicJobMetrics(JobListing $job): array
    {
        return [
            'views' => $job->views_count,
            'applications' => $job->applicants_count,
            'view_to_application_rate' => $job->views_count > 0 ? round(($job->applicants_count / $job->views_count) * 100, 1) : 0,
        ];
    }

    private function getApplicationFlow(JobListing $job): array
    {
        return $job->applications->groupBy('status')->map->count()->toArray();
    }

    private function getCandidateQuality(JobListing $job): array
    {
        // Implementation for candidate quality metrics
        return []; // Placeholder
    }

    private function getEngagementMetrics(JobListing $job): array
    {
        // Implementation for engagement metrics
        return []; // Placeholder
    }

    private function getBenchmarkingData(JobListing $job): array
    {
        // Implementation for benchmarking against similar jobs
        return []; // Placeholder
    }

    private function getOptimizationSuggestions(JobListing $job): array
    {
        // Implementation for AI-powered optimization suggestions
        return []; // Placeholder
    }

    private function getCompanySizeDistribution(array $filters): array
    {
        // Implementation for company size distribution
        return []; // Placeholder
    }

    private function getIndustryDistribution(array $filters): array
    {
        // Implementation for industry distribution
        return []; // Placeholder
    }

    private function calculateAvgTimeToFirstApplication($jobs): float
    {
        // Implementation for calculating average time to first application
        return 0; // Placeholder
    }

    private function getTopCandidateSkills($candidates): array
    {
        // Implementation for getting top candidate skills
        return []; // Placeholder
    }
}
