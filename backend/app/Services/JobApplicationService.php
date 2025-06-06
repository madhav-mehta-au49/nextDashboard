<?php

namespace App\Services;

use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\Candidate;
use App\Models\User;
use App\Models\ApplicationStatusHistory;
use App\Http\Requests\JobApplicationRequest;
use App\Mail\ApplicationReceived;
use App\Mail\ApplicationStatusChanged;
use App\Mail\InterviewScheduled;
use App\Mail\InterviewUpdated;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;

class JobApplicationService
{    /**
     * Submit a job application
     */    public function submitApplication(array $data): JobApplication
    {
        return DB::transaction(function () use ($data) {
            // Process notice period - Keep as string
            // No conversion needed as we've updated the migration to accept string values
            
            // Handle resume file upload if present
            if (isset($data['resume_file'])) {
                $data['resume_url'] = $this->uploadResume($data['resume_file'], $data['candidate_id']);
                unset($data['resume_file']);
            }            // Create the application            // Handle key_strengths - ensure it's an array
            if (isset($data['key_strengths'])) {
                if (is_string($data['key_strengths'])) {
                    // If it's a JSON string, decode it
                    $decoded = json_decode($data['key_strengths'], true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $data['key_strengths'] = $decoded;
                    } else {
                        // If not valid JSON, treat as a single item array
                        $data['key_strengths'] = [$data['key_strengths']];
                    }
                } elseif (!is_array($data['key_strengths'])) {
                    // If not an array or string, make it an array
                    $data['key_strengths'] = [$data['key_strengths']];
                }
                // Encode array to JSON for storage
                $data['key_strengths'] = json_encode($data['key_strengths']);
            }
            
            // Add debug logging for the data being saved
            \Log::debug('Creating job application with data', [
                'application_data' => $data
            ]);
            
            // Create the application record
            $application = JobApplication::create([
                ...$data,
                'status' => 'pending',
                'applied_at' => now(),
            ]);

            // Store application questions/answers if any
            if (isset($data['questions']) && count($data['questions']) > 0) {
                $this->storeApplicationAnswers($application, $data['questions']);
            }

            // Update job listing applicants count
            $this->incrementApplicantsCount($data['job_listing_id']);

            // Send notifications (implement as needed)
            $this->sendApplicationNotifications($application);

            return $application->load(['jobListing', 'candidate']);
        });
    }    /**
     * Update application status
     */
    public function updateApplicationStatus(JobApplication $application, string $status, ?string $notes = null, ?User $changedBy = null): JobApplication
    {
        $oldStatus = $application->status;
        
        // Only update and create history if status actually changed
        if ($oldStatus !== $status) {
            $application->update([
                'status' => $status,
                'status_updated_at' => now(),
                'status_notes' => $notes,
            ]);

            // Create status history record
            ApplicationStatusHistory::create([
                'job_application_id' => $application->id,
                'old_status' => $oldStatus,
                'new_status' => $status,
                'notes' => $notes,
                'changed_by' => $changedBy ? $changedBy->id : Auth::id(),
            ]);

            // Send status update notification
            $this->sendStatusUpdateNotification($application);
        }

        return $application;
    }

    /**
     * Get application analytics for a candidate
     */
    public function getCandidateApplicationAnalytics(Candidate $candidate): array
    {
        $applications = $candidate->jobApplications()->with('jobListing.company')->get();

        return [
            'total_applications' => $applications->count(),
            'status_breakdown' => $applications->groupBy('status')->map->count(),
            'applications_this_month' => $applications->where('applied_at', '>=', now()->startOfMonth())->count(),
            'response_rate' => $this->calculateResponseRate($applications),
            'average_response_time' => $this->calculateAverageResponseTime($applications),
            'top_companies_applied' => $this->getTopCompaniesApplied($applications),
            'application_timeline' => $this->getApplicationTimeline($applications),
        ];
    }

    /**
     * Get application analytics for a job listing
     */
    public function getJobApplicationAnalytics(JobListing $job): array
    {
        $applications = $job->applications()->with('candidate')->get();

        return [
            'total_applications' => $applications->count(),
            'status_breakdown' => $applications->groupBy('status')->map->count(),
            'applications_this_week' => $applications->where('applied_at', '>=', now()->startOfWeek())->count(),
            'top_skills' => $this->getTopSkillsFromApplications($applications),
            'experience_distribution' => $this->getExperienceDistribution($applications),
            'application_timeline' => $this->getApplicationTimeline($applications),
            'conversion_funnel' => $this->getConversionFunnel($applications),
        ];
    }

    /**
     * Withdraw an application
     */
    public function withdrawApplication(JobApplication $application, ?string $reason = null): JobApplication
    {
        $application->update([
            'status' => 'withdrawn',
            'status_updated_at' => now(),
            'withdrawal_reason' => $reason,
        ]);

        // Decrement job applicants count
        $this->decrementApplicantsCount($application->job_listing_id);

        return $application;
    }

    /**
     * Get similar candidates for a job application
     */
    public function getSimilarCandidates(JobApplication $application, int $limit = 5): array
    {
        $candidate = $application->candidate;
        $jobListing = $application->jobListing;

        $similarCandidates = Candidate::query()
            ->with(['skills', 'experiences', 'education'])
            ->where('id', '!=', $candidate->id)
            ->whereHas('jobApplications', function ($query) use ($jobListing) {
                $query->whereHas('jobListing', function ($jobQuery) use ($jobListing) {
                    $jobQuery->where('category', $jobListing->category)
                             ->orWhere('experience_level', $jobListing->experience_level);
                });
            })
            ->get();

        $scoredCandidates = $similarCandidates->map(function ($similarCandidate) use ($candidate) {
            $score = $this->calculateCandidateSimilarity($candidate, $similarCandidate);
            return [
                'candidate' => $similarCandidate,
                'score' => $score
            ];
        });

        return $scoredCandidates
            ->sortByDesc('score')
            ->take($limit)
            ->values()
            ->toArray();
    }

    /**
     * Upload resume file
     */
    private function uploadResume(UploadedFile $file, int $candidateId): string
    {
        $filename = 'resume_' . $candidateId . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('resumes', $filename, 'public');
        
        return Storage::url($path);
    }    /**
     * Store application answers
     */
    private function storeApplicationAnswers(JobApplication $application, array $questions): void
    {
        // Add debug logging
        \Log::debug('Storing application answers', [
            'application_id' => $application->id,
            'questions' => $questions
        ]);
        
        foreach ($questions as $question) {
            try {
                DB::table('job_application_answers')->insert([
                    'job_application_id' => $application->id,
                    'question_id' => $question['question_id'] ?? null,
                    'question_text' => $question['question_text'] ?? 'Question ' . ($question['question_id'] ?? 'unknown'),
                    'answer' => $question['answer'] ?? '',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } catch (\Exception $e) {
                \Log::error('Error storing application answer', [
                    'error' => $e->getMessage(),
                    'question' => $question
                ]);
            }
        }
    }

    /**
     * Increment job applicants count
     */
    private function incrementApplicantsCount(int $jobListingId): void
    {
        JobListing::where('id', $jobListingId)->increment('applicants_count');
    }

    /**
     * Decrement job applicants count
     */
    private function decrementApplicantsCount(int $jobListingId): void
    {
        JobListing::where('id', $jobListingId)->decrement('applicants_count');
    }    /**
     * Send application notifications
     */
    public function sendApplicationNotifications(JobApplication $application): void
    {
        try {
            // Send confirmation email to candidate
            if ($application->candidate && $application->candidate->user && $application->candidate->user->email) {
                Mail::to($application->candidate->user->email)
                    ->send(new ApplicationReceived($application));
            }
            
            // Send notification to company/HR (optional)
            // This could be implemented later if needed
            
        } catch (\Exception $e) {
            \Log::error('Failed to send application notifications', [
                'application_id' => $application->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Send status update notification
     */
    private function sendStatusUpdateNotification(JobApplication $application): void
    {
        try {
            // Get the previous status from the database
            $originalApplication = JobApplication::find($application->id);
            $oldStatus = $originalApplication?->getOriginal('status') ?? 'pending';
            
            // Only send if status actually changed
            if ($oldStatus !== $application->status) {
                // Send email to candidate
                if ($application->candidate && $application->candidate->user && $application->candidate->user->email) {
                    Mail::to($application->candidate->user->email)
                        ->send(new ApplicationStatusChanged($application, $oldStatus, $application->status));
                }
            }
            
        } catch (\Exception $e) {
            \Log::error('Failed to send status update notification', [
                'application_id' => $application->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Calculate response rate for applications
     */
    private function calculateResponseRate($applications): float
    {
        $totalApplications = $applications->count();
        if ($totalApplications === 0) return 0;

        $respondedApplications = $applications->whereNotIn('status', ['pending', 'withdrawn'])->count();
        
        return round(($respondedApplications / $totalApplications) * 100, 1);
    }

    /**
     * Calculate average response time
     */
    private function calculateAverageResponseTime($applications): ?float
    {
        $respondedApplications = $applications->whereNotNull('status_updated_at');
        
        if ($respondedApplications->isEmpty()) return null;

        $totalDays = $respondedApplications->sum(function ($app) {
            return $app->applied_at->diffInDays($app->status_updated_at);
        });

        return round($totalDays / $respondedApplications->count(), 1);
    }

    /**
     * Get top companies applied to
     */
    private function getTopCompaniesApplied($applications): array
    {
        return $applications
            ->groupBy('jobListing.company.name')
            ->map->count()
            ->sortDesc()
            ->take(5)
            ->toArray();
    }

    /**
     * Get application timeline
     */
    private function getApplicationTimeline($applications): array
    {
        return $applications
            ->groupBy(function ($app) {
                return $app->applied_at->format('Y-m-d');
            })
            ->map->count()
            ->sortKeys()
            ->toArray();
    }

    /**
     * Get top skills from applications
     */
    private function getTopSkillsFromApplications($applications): array
    {
        $skills = [];
        
        foreach ($applications as $application) {
            foreach ($application->candidate->skills as $skill) {
                $skills[] = $skill->name;
            }
        }

        return array_count_values($skills);
    }

    /**
     * Get experience distribution
     */
    private function getExperienceDistribution($applications): array
    {
        $experienceRanges = [
            '0-1 years' => 0,
            '1-3 years' => 0,
            '3-5 years' => 0,
            '5-10 years' => 0,
            '10+ years' => 0,
        ];

        foreach ($applications as $application) {
            $years = $this->getCandidateExperienceYears($application->candidate);
            
            if ($years <= 1) $experienceRanges['0-1 years']++;
            elseif ($years <= 3) $experienceRanges['1-3 years']++;
            elseif ($years <= 5) $experienceRanges['3-5 years']++;
            elseif ($years <= 10) $experienceRanges['5-10 years']++;
            else $experienceRanges['10+ years']++;
        }

        return $experienceRanges;
    }

    /**
     * Get conversion funnel data
     */
    private function getConversionFunnel($applications): array
    {
        $total = $applications->count();
        $statuses = $applications->groupBy('status')->map->count();

        return [
            'applied' => $total,
            'reviewed' => $statuses->get('reviewed', 0),
            'interviewed' => $statuses->get('interviewed', 0),
            'offered' => $statuses->get('offered', 0),
            'hired' => $statuses->get('hired', 0),
        ];
    }

    /**
     * Calculate candidate similarity score
     */
    private function calculateCandidateSimilarity(Candidate $candidate1, Candidate $candidate2): float
    {
        $score = 0;

        // Skills similarity
        $skills1 = $candidate1->skills->pluck('id')->toArray();
        $skills2 = $candidate2->skills->pluck('id')->toArray();
        $skillsOverlap = count(array_intersect($skills1, $skills2));
        $score += $skillsOverlap * 5;

        // Experience level similarity
        $exp1 = $this->getCandidateExperienceYears($candidate1);
        $exp2 = $this->getCandidateExperienceYears($candidate2);
        $expDiff = abs($exp1 - $exp2);
        $score += max(0, 10 - $expDiff);

        // Education similarity
        if ($candidate1->education->isNotEmpty() && $candidate2->education->isNotEmpty()) {
            $degree1 = $candidate1->education->first()->degree_level ?? '';
            $degree2 = $candidate2->education->first()->degree_level ?? '';
            if ($degree1 === $degree2) {
                $score += 5;
            }
        }

        return $score;
    }

    /**
     * Get candidate's total experience years
     */
    private function getCandidateExperienceYears(Candidate $candidate): int
    {
        return $candidate->experiences()
            ->sum(DB::raw('TIMESTAMPDIFF(YEAR, start_date, COALESCE(end_date, NOW()))'));
    }

    /**
     * Get applications for user with proper filtering
     */    public function getApplicationsForUser(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = JobApplication::with([
                'jobListing' => function ($query) {
                    $query->with('company');
                },
                'candidate.user'
            ])
            ->when($user->role === 'candidate', function ($q) use ($user) {
                // Candidates can only see their own applications
                $q->whereHas('candidate', function ($candidateQuery) use ($user) {
                    $candidateQuery->where('user_id', $user->id);
                });
            })
            ->when($user->role === 'employer', function ($q) use ($user) {
                // Employers can only see applications for their companies' jobs
                $administeredCompanyIds = $user->administeredCompanies()->pluck('companies.id');
                $q->whereHas('jobListing', function ($jobQuery) use ($administeredCompanyIds) {
                    $jobQuery->whereIn('company_id', $administeredCompanyIds);
                });
            });

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['job_id'])) {
            $query->where('job_listing_id', $filters['job_id']);
        }        if (isset($filters['company_id']) && $user->role === 'employer') {
            // Verify user has access to this company
            $administeredCompanyIds = $user->administeredCompanies()->pluck('companies.id');
            if ($administeredCompanyIds->contains($filters['company_id'])) {
                $query->whereHas('jobListing', function ($jobQuery) use ($filters) {
                    $jobQuery->where('company_id', $filters['company_id']);
                });
            } else {
                // User doesn't have access to the requested company - return empty result
                $query->whereRaw('1 = 0'); // This will return no results
            }
        }

        $perPage = $filters['per_page'] ?? 15;
        $page = $filters['page'] ?? 1;

        return $query->latest('applied_at')->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Check if user can view specific application
     */
    public function checkUserCanViewApplication(User $user, JobApplication $application): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'candidate') {
            // Candidates can only view their own applications
            return $application->candidate && $application->candidate->user_id === $user->id;
        }

        if ($user->role === 'employer') {
            // Employers can only view applications for their companies' jobs
            $administeredCompanyIds = $user->administeredCompanies()->pluck('companies.id');
            return $administeredCompanyIds->contains($application->jobListing->company_id);
        }

        return false;
    }

    /**
     * Update application with proper authorization
     */
    public function updateApplication(User $user, JobApplication $application, array $data): JobApplication
    {
        if (!$this->checkUserCanViewApplication($user, $application)) {
            throw new \Exception('Unauthorized to update this application');
        }

        // Different update permissions based on role
        if ($user->role === 'candidate') {
            // Candidates can only update certain fields and only if application is in certain states
            if (!in_array($application->status, ['pending', 'reviewing'])) {
                throw new \Exception('Cannot update application in current status');
            }
            
            $allowedFields = ['cover_letter', 'salary_expectation', 'availability_date'];
            $updateData = array_intersect_key($data, array_flip($allowedFields));        } else {
            // Employers can update status and notes
            $allowedFields = ['status', 'status_notes', 'notes'];
            $updateData = array_intersect_key($data, array_flip($allowedFields));
            
            // If status is being updated, use the dedicated updateApplicationStatus method
            if (isset($updateData['status'])) {
                $notes = $updateData['notes'] ?? $updateData['status_notes'] ?? null;
                return $this->updateApplicationStatus($application, $updateData['status'], $notes, $user);
            }
        }

        $application->update($updateData);

        // Send status update notification if status changed
        if (isset($updateData['status'])) {
            $this->sendStatusUpdateNotification($application);
        }

        return $application->load(['jobListing', 'candidate']);
    }

    /**
     * Delete application with proper authorization
     */
    public function deleteApplication(User $user, JobApplication $application): void
    {
        if ($user->role === 'candidate') {
            // Candidates can only delete their own applications
            if (!$application->candidate || $application->candidate->user_id !== $user->id) {
                throw new \Exception('Unauthorized to delete this application');
            }
        } elseif ($user->role === 'employer') {
            // Employers can delete applications for their companies' jobs
            $administeredCompanyIds = $user->administeredCompanies()->pluck('companies.id');
            if (!$administeredCompanyIds->contains($application->jobListing->company_id)) {
                throw new \Exception('Unauthorized to delete this application');
            }
        } elseif ($user->role !== 'admin') {
            throw new \Exception('Unauthorized to delete this application');
        }

        // Decrement job applicants count
        $this->decrementApplicantsCount($application->job_listing_id);

        $application->delete();
    }

    /**
     * Get user application analytics
     */
    public function getUserApplicationAnalytics(User $user): array
    {
        if ($user->role === 'candidate') {
            $candidate = $user->candidate;
            return $candidate ? $this->getCandidateApplicationAnalytics($candidate) : [];
        }

        if ($user->role === 'employer') {
            // Get analytics for all jobs in user's administered companies
            $administeredCompanyIds = $user->administeredCompanies()->pluck('companies.id');
            
            $applications = JobApplication::with(['jobListing.company', 'candidate'])
                ->whereHas('jobListing', function ($query) use ($administeredCompanyIds) {
                    $query->whereIn('company_id', $administeredCompanyIds);
                })
                ->get();

            return [
                'total_applications' => $applications->count(),
                'status_breakdown' => $applications->groupBy('status')->map->count(),
                'applications_this_month' => $applications->where('applied_at', '>=', now()->startOfMonth())->count(),
                'applications_this_week' => $applications->where('applied_at', '>=', now()->startOfWeek())->count(),
                'top_positions' => $this->getTopPositionsFromApplications($applications),
                'application_timeline' => $this->getApplicationTimeline($applications),
                'conversion_funnel' => $this->getConversionFunnel($applications),
            ];
        }

        return [];
    }

    /**
     * Get matching candidates for a job listing
     */
    public function getMatchingCandidates(User $user, JobListing $jobListing, array $options = []): array
    {
        // Verify user has access to this job listing
        if ($user->role === 'employer') {
            $administeredCompanyIds = $user->administeredCompanies()->pluck('companies.id');
            if (!$administeredCompanyIds->contains($jobListing->company_id)) {
                throw new \Exception('Unauthorized to access candidates for this job');
            }
        } elseif ($user->role !== 'admin') {
            throw new \Exception('Unauthorized to access matching candidates');
        }

        $limit = $options['limit'] ?? 10;
        $minScore = $options['min_score'] ?? 0;

        // Get candidates who have applied to similar positions
        $candidates = Candidate::with(['skills', 'experiences', 'education'])
            ->whereHas('jobApplications', function ($query) use ($jobListing) {
                $query->whereHas('jobListing', function ($jobQuery) use ($jobListing) {
                    $jobQuery->where('category', $jobListing->category)
                             ->orWhere('experience_level', $jobListing->experience_level);
                });
            })
            ->whereDoesntHave('jobApplications', function ($query) use ($jobListing) {
                $query->where('job_listing_id', $jobListing->id);
            })
            ->get();

        $scoredCandidates = $candidates->map(function ($candidate) use ($jobListing, $minScore) {
            $score = $this->calculateJobMatchScore($candidate, $jobListing);
            return [
                'candidate' => $candidate,
                'score' => $score
            ];
        })->filter(function ($item) use ($minScore) {
            return $item['score'] >= $minScore;
        });

        return $scoredCandidates
            ->sortByDesc('score')
            ->take($limit)
            ->values()
            ->toArray();
    }    /**
     * Bulk update application status
     */
    public function bulkUpdateApplicationStatus(User $user, array $applicationIds, string $status, ?string $notes = null): int
    {
        // Get applications and verify access
        $applications = JobApplication::with('jobListing')
            ->whereIn('id', $applicationIds)
            ->get();

        $accessibleApplicationIds = [];
        $accessibleApplications = [];

        foreach ($applications as $application) {
            if ($this->checkUserCanViewApplication($user, $application)) {
                $accessibleApplicationIds[] = $application->id;
                $accessibleApplications[] = $application;
            }
        }

        if (empty($accessibleApplicationIds)) {
            throw new \Exception('No accessible applications found');
        }

        $updatedCount = 0;

        // Update each application individually to create proper status history
        foreach ($accessibleApplications as $application) {
            $oldStatus = $application->status;
            
            // Only update if status is actually changing
            if ($oldStatus !== $status) {
                // Update the application
                $application->update([
                    'status' => $status,
                    'status_updated_at' => now(),
                ]);

                // Create status history record with proper notes
                $historyNotes = $notes ?: "Status updated to {$status} by employer via bulk action";
                
                ApplicationStatusHistory::create([
                    'job_application_id' => $application->id,
                    'old_status' => $oldStatus,
                    'new_status' => $status,
                    'changed_by' => $user->id,
                    'notes' => $historyNotes,
                ]);

                // Send notification
                $this->sendStatusUpdateNotification($application);
                
                $updatedCount++;
            }
        }

        return $updatedCount;
    }

    /**
     * Calculate job match score for a candidate
     */
    private function calculateJobMatchScore(Candidate $candidate, JobListing $job): float
    {
        $score = 0;

        // Skills matching
        $candidateSkills = $candidate->skills->pluck('id')->toArray();
        $jobSkills = $job->skills->pluck('id')->toArray();
        $skillsOverlap = count(array_intersect($candidateSkills, $jobSkills));
        $score += $skillsOverlap * 10;

        // Experience level matching
        $candidateExperience = $this->getCandidateExperienceYears($candidate);
        $jobExperienceLevel = $job->experience_level;
        
        $experienceMatch = $this->getExperienceMatch($candidateExperience, $jobExperienceLevel);
        $score += $experienceMatch * 15;

        // Location preference (if available)
        if ($candidate->preferred_location && $job->location) {
            if (str_contains(strtolower($candidate->preferred_location), strtolower($job->location))) {
                $score += 5;
            }
        }

        return $score;
    }

    /**
     * Get experience level match score
     */
    private function getExperienceMatch(int $years, string $level): float
    {
        $levelRanges = [
            'entry' => [0, 2],
            'mid' => [2, 5],
            'senior' => [5, 10],
            'lead' => [8, 15],
            'executive' => [10, 30]
        ];

        if (!isset($levelRanges[$level])) {
            return 0;
        }

        [$min, $max] = $levelRanges[$level];
        
        if ($years >= $min && $years <= $max) {
            return 1.0;
        } elseif ($years < $min) {
            return max(0, 1 - (($min - $years) / $min));
        } else {
            return max(0, 1 - (($years - $max) / $max));
        }
    }

    /**
     * Get top positions from applications
     */
    private function getTopPositionsFromApplications($applications): array
    {        return $applications
            ->groupBy('jobListing.title')
            ->map->count()
            ->sortDesc()
            ->take(5)
            ->toArray();
    }

    /**
     * Convert notice period string to integer (days)
     */    /**
     * Convert notice period string to integer (days)
     * Note: This is kept for backward compatibility but not used in new applications
     */    private function convertNoticePeriodToInteger($noticePeriod): string
    {
        if (!$noticePeriod) {
            return '0';
        }

        // If exact number of days is provided, return it
        if (is_numeric($noticePeriod)) {
            return (string) $noticePeriod;
        }

        // Convert words to days
        $noticePeriod = strtolower(trim($noticePeriod));
        
        switch ($noticePeriod) {
            case 'immediate':
            case 'immediately':
                return '0';
            case 'one week':
            case 'week':
                return '7';
            case 'two weeks':
            case '2 weeks':
                return '14';
            case 'one month':
            case 'month':
                return '30';
            case '2 months':
            case 'two months':
                return '60';
            case '3 months':
            case 'three months':
                return '90';
            default:
                // Try to extract number from string like "30 days", "2 weeks", etc.
                if (preg_match('/(\d+)\s*(day|days|week|weeks|month|months)/', $noticePeriod, $matches)) {
                    $number = (int) $matches[1];
                    $unit = $matches[2];
                    
                    switch ($unit) {
                        case 'day':
                        case 'days':
                            return (string) $number;
                        case 'week':
                        case 'weeks':
                            return (string) ($number * 7);
                        case 'month':
                        case 'months':
                            return (string) ($number * 30);
                        default:
                            return (string) $number;
                    }
                }
                return '0';
        }
    }
}
