<?php

namespace App\Services;

use App\Models\JobListing;
use App\Models\Candidate;
use App\Http\Requests\JobSearchRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class JobSearchService
{    /**
     * Search for jobs based on criteria (for API compatibility)
     */    public function searchJobs(array $filters): array
    {
        $query = JobListing::query()
            ->with(['company', 'jobCategory'])
            ->whereIn('status', ['active', 'published']); // Show both active and published jobs

        // Apply filters
        $this->applyFilters($query, $filters);
        $this->applySortingFromFilters($query, $filters);

        $perPage = $filters['per_page'] ?? 15;
        $page = $filters['page'] ?? 1;

        $results = $query->paginate($perPage, ['*'], 'page', $page);

        return [
            'jobs' => $results->items(),
            'total' => $results->total(),
            'per_page' => $results->perPage(),
            'current_page' => $results->currentPage(),
            'last_page' => $results->lastPage(),
            'filters_applied' => $filters,
        ];
    }    /**
     * Search for jobs based on criteria
     */
    public function search($request): LengthAwarePaginator
    {
        $query = JobListing::query()
            ->with(['company', 'skills'])
            ->whereIn('status', ['active', 'published']); // Show both active and published jobs

        // Apply filters
        $this->applySearchFilters($query, $request);
        $this->applySorting($query, $request);

        // Handle both request objects and arrays
        if (is_array($request)) {
            $perPage = $request['per_page'] ?? 15;
            $page = $request['page'] ?? 1;
        } else {
            $perPage = $request->per_page ?? 15;
            $page = $request->page ?? 1;
        }

        return $query->paginate($perPage, ['*'], 'page', $page);
    }/**
     * Get recommended jobs for a candidate
     */    public function getRecommendations(Candidate $candidate, int $limit = 10): array
    {
        $jobs = JobListing::query()
            ->with(['company', 'skills'])
            ->whereIn('status', ['active', 'published']) // Show both active and published jobs
            ->get();

        $scoredJobs = $jobs->map(function ($job) use ($candidate) {
            $score = $this->calculateJobScore($job, $candidate);
            return [
                'job' => $job,
                'score' => $score,
                'reasons' => $this->getMatchReasons($job, $candidate)
            ];
        });

        return $scoredJobs
            ->sortByDesc('score')
            ->take($limit)
            ->values()
            ->toArray();
    }    /**
     * Get similar jobs based on a job listing
     */    public function getSimilarJobs(JobListing $job, int $limit = 5): array
    {
        $similarJobs = JobListing::query()
            ->with(['company', 'skills'])
            ->whereIn('status', ['active', 'published']) // Show both active and published jobs
            ->where('id', '!=', $job->id)
            ->get();

        $scoredJobs = $similarJobs->map(function ($similarJob) use ($job) {
            $score = $this->calculateSimilarityScore($job, $similarJob);
            return [
                'job' => $similarJob,
                'score' => $score
            ];
        });

        return $scoredJobs
            ->sortByDesc('score')
            ->take($limit)
            ->values()
            ->toArray();
    }    /**
     * Apply search filters to the query
     */
    private function applySearchFilters(Builder $query, $request): void
    {
        // Helper function to get value from request (either array or object)
        $getValue = function($key) use ($request) {
            if (is_array($request)) {
                return $request[$key] ?? null;
            }
            return $request->$key ?? null;
        };

        $hasValue = function($key) use ($request) {
            if (is_array($request)) {
                return isset($request[$key]);
            }
            return $request->has($key);
        };

        // Text search
        $search = $getValue('search');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('company', function ($companyQuery) use ($search) {
                      $companyQuery->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('skills', function ($skillQuery) use ($search) {
                      $skillQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Location filter
        $location = $getValue('location');
        if ($location) {
            $query->where(function ($q) use ($location) {
                $q->where('location', 'like', "%{$location}%")
                  ->orWhere('is_remote', true);
            });
        }

        // Remote filter
        if ($hasValue('is_remote')) {
            $query->where('is_remote', $getValue('is_remote'));
        }

        // Job type filter
        $type = $getValue('type');
        if ($type && is_array($type) && count($type) > 0) {
            $query->whereIn('type', $type);
        }

        // Experience level filter
        $experienceLevel = $getValue('experience_level');
        if ($experienceLevel && is_array($experienceLevel) && count($experienceLevel) > 0) {
            $query->whereIn('experience_level', $experienceLevel);
        }

        // Salary filter
        $salaryMin = $getValue('salary_min');
        if ($salaryMin) {
            $query->where('salary_max', '>=', $salaryMin);
        }

        $salaryMax = $getValue('salary_max');
        if ($salaryMax) {
            $query->where('salary_min', '<=', $salaryMax);
        }

        // Company filter
        $companyId = $getValue('company_id');
        if ($companyId) {
            $query->where('company_id', $companyId);
        }

        // Category filter
        $category = $getValue('category');
        if ($category && is_array($category) && count($category) > 0) {
            $query->whereIn('category', $category);
        }

        // Skills filter
        $skills = $getValue('skills');
        if ($skills && is_array($skills) && count($skills) > 0) {
            $query->whereHas('skills', function ($q) use ($skills) {
                $q->whereIn('skills.id', $skills);
            });
        }

        // Education level filter
        $educationLevel = $getValue('education_level');
        if ($educationLevel && is_array($educationLevel) && count($educationLevel) > 0) {
            $query->whereIn('education_level', $educationLevel);
        }

        // Visa sponsorship filter
        if ($hasValue('visa_sponsorship')) {
            $query->where('visa_sponsorship', $getValue('visa_sponsorship'));
        }

        // Posted within filter
        $postedWithin = $getValue('posted_within');
        if ($postedWithin) {
            $query->where('posted_date', '>=', now()->subDays($postedWithin));
        }

        // Geographic search
        $lat = $getValue('lat');
        $lng = $getValue('lng');
        $radius = $getValue('radius');
        if ($lat && $lng && $radius) {
            $this->applyGeographicFilter($query, $lat, $lng, $radius);
        }
    }    /**
     * Apply sorting to the query
     */
    private function applySorting(Builder $query, $request): void
    {
        // Helper function to get value from request (either array or object)
        $getValue = function($key) use ($request) {
            if (is_array($request)) {
                return $request[$key] ?? null;
            }
            return $request->$key ?? null;
        };

        $sortBy = $getValue('sort_by') ?? 'date';
        
        switch ($sortBy) {
            case 'date':
                $query->orderBy('posted_date', 'desc');
                break;
            case 'salary_high':
                $query->orderBy('salary_max', 'desc');
                break;
            case 'salary_low':
                $query->orderBy('salary_min', 'asc');
                break;
            case 'company':
                $query->join('companies', 'job_listings.company_id', '=', 'companies.id')
                      ->orderBy('companies.name', 'asc');
                break;
            case 'relevance':
            default:
                // For relevance, we could implement a scoring system
                $query->orderBy('posted_date', 'desc');
                break;
        }
    }

    /**
     * Apply geographic filter for location-based search
     */
    private function applyGeographicFilter(Builder $query, float $lat, float $lng, int $radius): void
    {
        // This is a simplified implementation
        // In production, you'd want to use proper geographic calculations
        $query->whereRaw("
            (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
            sin(radians(latitude)))) <= ?
        ", [$lat, $lng, $lat, $radius]);
    }

    /**
     * Calculate job score for recommendations
     */
    private function calculateJobScore(JobListing $job, Candidate $candidate): float
    {
        $score = 0;

        // Skills match
        $candidateSkills = $candidate->skills->pluck('id')->toArray();
        $jobSkills = $job->skills->pluck('id')->toArray();
        $skillsMatch = count(array_intersect($candidateSkills, $jobSkills));
        $score += $skillsMatch * 10;

        // Experience level match
        $candidateExperience = $this->getExperienceYears($candidate);
        $experienceMatch = $this->matchExperienceLevel($job->experience_level, $candidateExperience);
        $score += $experienceMatch * 15;

        // Location preference
        if ($job->is_remote || $this->matchesLocation($job->location, $candidate)) {
            $score += 5;
        }

        // Recent posting bonus
        $daysSincePosted = now()->diffInDays($job->posted_date);
        $score += max(0, 10 - $daysSincePosted);

        return $score;
    }

    /**
     * Calculate similarity score between two jobs
     */
    private function calculateSimilarityScore(JobListing $job1, JobListing $job2): float
    {
        $score = 0;

        // Same company
        if ($job1->company_id === $job2->company_id) {
            $score += 20;
        }

        // Similar title
        similar_text(strtolower($job1->title), strtolower($job2->title), $titleSimilarity);
        $score += $titleSimilarity / 4; // Max 25 points

        // Same job type
        if ($job1->type === $job2->type) {
            $score += 15;
        }

        // Same experience level
        if ($job1->experience_level === $job2->experience_level) {
            $score += 10;
        }

        // Skills overlap
        $job1Skills = $job1->skills->pluck('id')->toArray();
        $job2Skills = $job2->skills->pluck('id')->toArray();
        $skillsOverlap = count(array_intersect($job1Skills, $job2Skills));
        $score += $skillsOverlap * 5;

        // Same category
        if ($job1->category === $job2->category) {
            $score += 10;
        }

        return $score;
    }

    /**
     * Get match reasons for recommendation
     */
    private function getMatchReasons(JobListing $job, Candidate $candidate): array
    {
        $reasons = [];

        // Check skills match
        $candidateSkills = $candidate->skills->pluck('name')->toArray();
        $jobSkills = $job->skills->pluck('name')->toArray();
        $matchingSkills = array_intersect($candidateSkills, $jobSkills);
        
        if (count($matchingSkills) > 0) {
            $reasons[] = 'Skills match: ' . implode(', ', array_slice($matchingSkills, 0, 3));
        }

        // Check experience level
        $candidateExperience = $this->getExperienceYears($candidate);
        if ($this->matchExperienceLevel($job->experience_level, $candidateExperience) > 0) {
            $reasons[] = 'Experience level matches your background';
        }

        // Check location
        if ($job->is_remote) {
            $reasons[] = 'Remote work available';
        }

        // Check recent posting
        if (now()->diffInDays($job->posted_date) <= 7) {
            $reasons[] = 'Recently posted';
        }

        return $reasons;
    }

    /**
     * Get candidate's total experience in years
     */
    private function getExperienceYears(Candidate $candidate): int
    {
        return $candidate->experiences()
            ->sum(DB::raw('TIMESTAMPDIFF(YEAR, start_date, COALESCE(end_date, NOW()))'));
    }

    /**
     * Match experience level with years of experience
     */
    private function matchExperienceLevel(string $jobLevel, int $candidateYears): int
    {
        $levelMap = [
            'entry' => [0, 2],
            'junior' => [1, 3],
            'mid' => [3, 7],
            'senior' => [5, 12],
            'lead' => [7, 15],
            'executive' => [10, 30]
        ];

        if (!isset($levelMap[$jobLevel])) {
            return 0;
        }

        [$minYears, $maxYears] = $levelMap[$jobLevel];
        
        if ($candidateYears >= $minYears && $candidateYears <= $maxYears) {
            return 10; // Perfect match
        } elseif (abs($candidateYears - $minYears) <= 2 || abs($candidateYears - $maxYears) <= 2) {
            return 5; // Close match
        }

        return 0;
    }

    /**
     * Check if job location matches candidate preferences
     */
    private function matchesLocation(string $jobLocation, Candidate $candidate): bool
    {
        // This is a simplified implementation
        // You'd want to implement proper location matching logic
        return true;
    }

    /**
     * Apply filters from array to the query
     */
    private function applyFilters(Builder $query, array $filters): void
    {
        // Text search
        if (!empty($filters['query'])) {
            $searchTerm = $filters['query'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%")
                  ->orWhereHas('company', function ($companyQuery) use ($searchTerm) {
                      $companyQuery->where('name', 'like', "%{$searchTerm}%");
                  });
            });
        }

        // Location filter
        if (!empty($filters['location'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('location', 'like', "%{$filters['location']}%")
                  ->orWhere('is_remote_friendly', true);
            });
        }

        // Remote filter
        if (isset($filters['is_remote_friendly'])) {
            $query->where('is_remote_friendly', $filters['is_remote_friendly']);
        }

        // Job type filter
        if (!empty($filters['job_type'])) {
            if (is_array($filters['job_type'])) {
                $query->whereIn('job_type', $filters['job_type']);
            } else {
                $query->where('job_type', $filters['job_type']);
            }
        }

        // Experience level filter
        if (!empty($filters['experience_level'])) {
            if (is_array($filters['experience_level'])) {
                $query->whereIn('experience_level', $filters['experience_level']);
            } else {
                $query->where('experience_level', $filters['experience_level']);
            }
        }

        // Salary filter
        if (!empty($filters['salary_min'])) {
            $query->where('salary_min', '>=', $filters['salary_min']);
        }

        if (!empty($filters['salary_max'])) {
            $query->where('salary_max', '<=', $filters['salary_max']);
        }

        // Company filter
        if (!empty($filters['company_id'])) {
            $query->where('company_id', $filters['company_id']);
        }

        // Category filter
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Skills filter
        if (!empty($filters['skills'])) {
            $skills = is_array($filters['skills']) ? $filters['skills'] : [$filters['skills']];
            $query->where(function ($q) use ($skills) {
                foreach ($skills as $skill) {
                    $q->orWhereJsonContains('required_skills', $skill);
                }
            });
        }
    }

    /**
     * Apply sorting from filters array
     */
    private function applySortingFromFilters(Builder $query, array $filters): void
    {
        $sortBy = $filters['sort'] ?? 'created_at';
        $sortOrder = $filters['order'] ?? 'desc';

        switch ($sortBy) {
            case 'title':
                $query->orderBy('title', $sortOrder);
                break;
            case 'company':
                $query->join('companies', 'job_listings.company_id', '=', 'companies.id')
                      ->orderBy('companies.name', $sortOrder);
                break;
            case 'location':
                $query->orderBy('location', $sortOrder);
                break;
            case 'salary':
                $query->orderBy('salary_min', $sortOrder);
                break;
            case 'date':
            default:
                $query->orderBy('created_at', $sortOrder);
                break;
        }
    }
}
