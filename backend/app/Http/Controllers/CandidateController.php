<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\CandidateProfileView;
use App\Models\Interview;
use App\Models\JobListing;
use App\Http\Requests\StoreCandidateRequest;
use App\Http\Requests\UpdateCandidateRequest;
use App\Http\Resources\CandidateResource;
use App\Http\Resources\CandidateCollection;
use App\Http\Resources\InterviewResource;
use App\Http\Resources\ExperienceResource;
use App\Http\Resources\EducationResource;
use App\Http\Resources\CertificationResource;
use App\Http\Resources\JobApplicationResource; // Fixed import - replaced period with backslash
use App\Services\CandidateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class CandidateController extends Controller
{
    protected $candidateService;
    
    public function __construct(CandidateService $candidateService)
    {
        $this->candidateService = $candidateService;
    }

    /**
     * Get the current authenticated user's candidate profile
     */
    public function getCurrentUserProfile(): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        $candidate = $user->candidate;
        
        if (!$candidate) {
            return response()->json(['candidate' => null], 200);
        }
        
        return response()->json([
            'candidate' => new CandidateResource($candidate)
        ], 200);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Candidate::with(['skills', 'experiences', 'educations', 'certifications']);
        
        // Apply filters if provided
        if ($request->has('availability')) {
            $query->where('availability', $request->availability);
        }
        
        // Filter by work preference
        if ($request->has('work_type')) {
            $query->where('work_type_preference', $request->work_type);
        }
        
        // Filter by location
        if ($request->has('location')) {
            $query->where('desired_location', 'like', '%' . $request->location . '%');
        }
        
        // Filter by desired salary range
        if ($request->has('min_salary')) {
            $query->where('desired_salary', '>=', $request->min_salary);
        }
        
        if ($request->has('max_salary')) {
            $query->where('desired_salary', '<=', $request->max_salary);
        }
        
        // Search by candidate name or skills
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                  ->orWhereHas('skills', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
        }
        
        // Filter by specific skills
        if ($request->has('skills')) {
            $skills = explode(',', $request->skills);
            $query->whereHas('skills', function($q) use ($skills) {
                $q->whereIn('name', $skills);
            });
        }
        
        // Sort options
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'recent':
                    $query->orderBy('updated_at', 'desc');
                    break;
                case 'experience':
                    $query->withCount('experiences')->orderBy('experiences_count', 'desc');
                    break;
                case 'profile_completion':
                    $query->orderBy('profile_completed_percentage', 'desc');
                    break;
                default:
                    $query->orderBy('updated_at', 'desc');
            }
        } else {
            $query->orderBy('updated_at', 'desc');
        }
        
        $candidates = $query->paginate($request->per_page ?? 10);
        
        return response()->json([
            'status' => 'success',
            'data' => new CandidateCollection($candidates)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCandidateRequest $request): JsonResponse
    {
        // Begin transaction to ensure data consistency
        DB::beginTransaction();
        
        try {
            // Create candidate with validated basic data
            $validatedData = $request->validated();
            
            // Handle file uploads using CandidateService
            if ($request->hasFile('profile_picture')) {
                $validatedData['profile_picture'] = $this->candidateService->processProfilePicture(
                    $request->file('profile_picture')
                );
            } elseif ($request->has('profile_picture') && is_string($request->profile_picture)) {
                // Handle base64 profile picture
                $validatedData['profile_picture'] = $this->candidateService->processProfilePicture(
                    $request->profile_picture
                );
            }
            
            if ($request->hasFile('cover_image')) {
                $validatedData['cover_image'] = $this->candidateService->processCoverImage(
                    $request->file('cover_image')
                );
            } elseif ($request->has('cover_image') && is_string($request->cover_image)) {
                // Handle base64 cover image
                $validatedData['cover_image'] = $this->candidateService->processCoverImage(
                    $request->cover_image
                );
            }
            
            if ($request->hasFile('resume_url')) {
                $validatedData['resume_url'] = $this->candidateService->processResume(
                    $request->file('resume_url')
                );
            }
            
            // The slug will be auto-generated in the model's booted method
            
            $candidate = Candidate::create($validatedData);
            
            // Handle experiences - support both array and JSON string from FormData
            $experiences = $request->experiences;
            if (is_string($experiences)) {
                $experiences = json_decode($experiences, true);
            }
            if (is_array($experiences)) {
                foreach ($experiences as $experience) {
                    // Make sure both company and company_name fields are set
                    if (isset($experience['company']) && !isset($experience['company_name'])) {
                        $experience['company_name'] = $experience['company'];
                    } else if (isset($experience['company_name']) && !isset($experience['company'])) {
                        $experience['company'] = $experience['company_name'];
                    }
                    
                    // Create the experience record
                    $candidate->experiences()->create($experience);
                }
            }
            
            // Handle educations - support both array and JSON string from FormData
            $educations = $request->educations;
            if (is_string($educations)) {
                $educations = json_decode($educations, true);
            }
            if (is_array($educations)) {
                foreach ($educations as $education) {
                    $candidate->educations()->create($education);
                }
            }
            
            // Handle skills - support both array and JSON string from FormData
            $skills = $request->skills;
            if (is_string($skills)) {
                $skills = json_decode($skills, true);
            }
            if (is_array($skills)) {
                $skillIds = [];
                foreach ($skills as $skill) {
                    // If skill has an id, use it directly, otherwise create new skill
                    if (isset($skill['id'])) {
                        $skillIds[] = $skill['id'];
                    } else {
                        $newSkill = \App\Models\Skill::firstOrCreate(['name' => $skill['name']]);
                        $skillIds[] = $newSkill->id;
                    }
                }
                $candidate->skills()->sync($skillIds);
            }
            
            // Handle certifications - support both array and JSON string from FormData
            $certifications = $request->certifications;
            if (is_string($certifications)) {
                $certifications = json_decode($certifications, true);
            }
            if (is_array($certifications)) {
                foreach ($certifications as $index => $certification) {
                    // Handle certification file upload if present
                    $fileKey = "certification_files.{$index}";
                    if ($request->hasFile($fileKey)) {
                        $certification['file_path'] = $this->candidateService->processCertificationFile(
                            $request->file($fileKey)
                        );
                    }
                    
                    $candidate->certifications()->create($certification);
                }
            }
            
            // Calculate profile completion
            $profileCompletion = $this->candidateService->calculateProfileCompletion($candidate);
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Candidate profile created successfully',
                'data' => new CandidateResource($candidate),
                'profile_completion' => $profileCompletion
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create candidate profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Candidate $candidate): JsonResponse
    {
        // Track profile view if requested
        if ($request->has('track_view') && $request->track_view) {
            $this->trackProfileView($request, $candidate);
        }
        
        $candidate->load([
            'skills', 
            'experiences' => function($q) {
                $q->orderBy('end_date', 'desc')->orderBy('start_date', 'desc');
            }, 
            'educations' => function($q) {
                $q->orderBy('end_date', 'desc')->orderBy('start_date', 'desc');
            }, 
            'certifications' => function($q) {
                $q->orderBy('issue_date', 'desc');
            },
            'jobApplications' => function($q) {
                $q->with(['jobListing', 'jobListing.company'])->latest();
            }
        ]);
        
        // Calculate profile completion
        $profileCompletion = $candidate->calculateProfileCompletion();
        
        // Get profile insights data
        $insights = $this->getProfileInsights($candidate);
        
        return response()->json([
            'status' => 'success',
            'data' => new CandidateResource($candidate),
            'profile_completion' => $profileCompletion,
            'insights' => $insights
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCandidateRequest $request, Candidate $candidate): JsonResponse
    {
        \Log::info("=== CANDIDATE UPDATE METHOD CALLED ===");
        \Log::info("Request method: " . $request->method());
        \Log::info("Request URL: " . $request->url());
        \Log::info("Candidate ID: " . $candidate->id);
        \Log::info("Request data keys: " . implode(', ', array_keys($request->all())));
        
        // Begin transaction to ensure data consistency
        DB::beginTransaction();
        
        try {
            // Get validated data (JSON decoding is now handled in prepareForValidation)
            $validatedData = $request->validated();
            
            // Handle file uploads using CandidateService
            if ($request->hasFile('profile_picture')) {
                $validatedData['profile_picture'] = $this->candidateService->processProfilePicture(
                    $request->file('profile_picture'),
                    $candidate->profile_picture
                );
            } elseif ($request->has('profile_picture') && is_string($request->profile_picture)) {
                // Handle base64 profile picture
                $validatedData['profile_picture'] = $this->candidateService->processProfilePicture(
                    $request->profile_picture,
                    $candidate->profile_picture
                );
            }
            
            if ($request->hasFile('cover_image')) {
                $validatedData['cover_image'] = $this->candidateService->processCoverImage(
                    $request->file('cover_image'),
                    $candidate->cover_image
                );
            } elseif ($request->has('cover_image') && is_string($request->cover_image)) {
                // Handle base64 cover image
                $validatedData['cover_image'] = $this->candidateService->processCoverImage(
                    $request->cover_image,
                    $candidate->cover_image
                );
            }
            
            if ($request->hasFile('resume_url')) {
                $validatedData['resume_url'] = $this->candidateService->processResume(
                    $request->file('resume_url'),
                    $candidate->resume_url
                );
            }
            
            // Update basic candidate information
            $candidate->update($validatedData);
            
            // Handle experiences if provided
            if ($request->has('experiences') && is_array($request->experiences)) {
                // Get existing experience IDs to track what should be deleted
                $existingExperienceIds = $candidate->experiences->pluck('id')->toArray();
                $updatedExperienceIds = [];
                
                foreach ($request->experiences as $experienceData) {
                    if (isset($experienceData['id'])) {
                        // Update existing experience
                        $experience = $candidate->experiences()->find($experienceData['id']);
                        if ($experience) {
                            $experience->update($experienceData);
                            $updatedExperienceIds[] = $experience->id;
                        }
                    } else {
                        // Create new experience
                        $experience = $candidate->experiences()->create($experienceData);
                        $updatedExperienceIds[] = $experience->id;
                    }
                }
                
                // Delete experiences that weren't included in the update
                $experiencesToDelete = array_diff($existingExperienceIds, $updatedExperienceIds);
                if (!empty($experiencesToDelete)) {
                    $candidate->experiences()->whereIn('id', $experiencesToDelete)->delete();
                }
            }
            
            // Handle educations if provided
            if ($request->has('educations') && is_array($request->educations)) {
                // Get existing education IDs to track what should be deleted
                $existingEducationIds = $candidate->educations->pluck('id')->toArray();
                $updatedEducationIds = [];
                
                foreach ($request->educations as $educationData) {
                    if (isset($educationData['id'])) {
                        // Update existing education
                        $education = $candidate->educations()->find($educationData['id']);
                        if ($education) {
                            $education->update($educationData);
                            $updatedEducationIds[] = $education->id;
                        }
                    } else {
                        // Create new education
                        $education = $candidate->educations()->create($educationData);
                        $updatedEducationIds[] = $education->id;
                    }
                }
                
                // Delete educations that weren't included in the update
                $educationsToDelete = array_diff($existingEducationIds, $updatedEducationIds);
                if (!empty($educationsToDelete)) {
                    $candidate->educations()->whereIn('id', $educationsToDelete)->delete();
                }
            }
            
            // Handle certifications if provided - support both array and JSON string from FormData
            $certifications = $request->certifications;
            if (is_string($certifications)) {
                $certifications = json_decode($certifications, true);
            }
            if (is_array($certifications)) {
                // Get existing certification IDs to track what should be deleted
                $existingCertificationIds = $candidate->certifications->pluck('id')->toArray();
                $updatedCertificationIds = [];
                
                foreach ($certifications as $index => $certificationData) {
                    // Handle certification file upload if present
                    // Try both formats: certification_files[index] and certification_files.index
                    $fileKey1 = "certification_files[{$index}]";
                    $fileKey2 = "certification_files.{$index}";
                    \Log::info("Checking for certification file at keys: {$fileKey1} or {$fileKey2}");
                    \Log::info("Available files: " . implode(', ', array_keys($request->allFiles())));
                    
                    if ($request->hasFile($fileKey1)) {
                        \Log::info("Processing certification file for index {$index} with key {$fileKey1}");
                        $certificationData['file_path'] = $this->candidateService->processCertificationFile(
                            $request->file($fileKey1)
                        );
                        \Log::info("File processed successfully, path: " . $certificationData['file_path']);
                    } elseif ($request->hasFile($fileKey2)) {
                        \Log::info("Processing certification file for index {$index} with key {$fileKey2}");
                        $certificationData['file_path'] = $this->candidateService->processCertificationFile(
                            $request->file($fileKey2)
                        );
                        \Log::info("File processed successfully, path: " . $certificationData['file_path']);
                    } else {
                        \Log::info("No file found for either key: {$fileKey1} or {$fileKey2}");
                    }
                    
                    \Log::info("Processing certification data for index {$index}: " . json_encode($certificationData));
                    
                    if (isset($certificationData['id'])) {
                        // Update existing certification
                        $certification = $candidate->certifications()->find($certificationData['id']);
                        if ($certification) {
                            \Log::info("Updating existing certification ID {$certification->id} with data: " . json_encode($certificationData));
                            $certification->update($certificationData);
                            \Log::info("Certification updated. New file_path: " . $certification->file_path);
                            $updatedCertificationIds[] = $certification->id;
                        } else {
                            \Log::warning("Certification with ID {$certificationData['id']} not found for candidate {$candidate->id}");
                        }
                    } else {
                        // Create new certification
                        \Log::info("Creating new certification with data: " . json_encode($certificationData));
                        $certification = $candidate->certifications()->create($certificationData);
                        \Log::info("New certification created with ID {$certification->id} and file_path: " . $certification->file_path);
                        $updatedCertificationIds[] = $certification->id;
                    }
                }
                
                // Delete certifications that weren't included in the update
                $certificationsToDelete = array_diff($existingCertificationIds, $updatedCertificationIds);
                if (!empty($certificationsToDelete)) {
                    $candidate->certifications()->whereIn('id', $certificationsToDelete)->delete();
                }
            }
            
            // Handle skills if provided
            if ($request->has('skills') && is_array($request->skills)) {
                $skillIds = [];
                foreach ($request->skills as $skill) {
                    // If skill has an id, use it directly, otherwise create new skill
                    if (isset($skill['id'])) {
                        $skillIds[] = $skill['id'];
                    } else {
                        $newSkill = \App\Models\Skill::firstOrCreate(['name' => $skill['name']]);
                        $skillIds[] = $newSkill->id;
                    }
                }
                $candidate->skills()->sync($skillIds);
            }
            
            // Reload the candidate with all relationships
            $candidate->load([
                'skills', 
                'experiences' => function($q) {
                    $q->orderBy('end_date', 'desc')->orderBy('start_date', 'desc');
                }, 
                'educations' => function($q) {
                    $q->orderBy('end_date', 'desc')->orderBy('start_date', 'desc');
                }, 
                'certifications' => function($q) {
                    $q->orderBy('issue_date', 'desc');
                }
            ]);
            
            // Recalculate profile completion after updates
            $profileCompletion = $candidate->calculateProfileCompletion();
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Candidate profile updated successfully',
                'data' => new CandidateResource($candidate),
                'profile_completion' => $profileCompletion
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update candidate profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Candidate $candidate): JsonResponse
    {
        $candidate->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Candidate profile deleted successfully'
        ]);
    }
    
    /**
     * Get candidate's job applications
     */
    public function applications(Request $request, Candidate $candidate): JsonResponse
    {
        $query = $candidate->jobApplications()
            ->with(['jobListing', 'jobListing.company']);
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }
        
        if ($request->has('end_date')) {
            $query->where('created_at', '<=', $request->end_date);
        }
        
        // Sort options
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'oldest':
                    $query->oldest();
                    break;
                case 'status':
                    $query->orderBy('status');
                    break;
                default:
                    $query->latest();
            }
        } else {
            $query->latest();
        }
        
        $applications = $query->paginate($request->per_page ?? 10);
        
        return response()->json([
            'status' => 'success',
            'data' => JobApplicationResource::collection($applications)
        ]);
    }
    
    /**
     * Get candidate's saved jobs
     */
    public function savedJobs(Request $request, Candidate $candidate): JsonResponse
    {
        $query = $candidate->savedJobs()
            ->with(['jobListing', 'jobListing.company']);
        
        // Filter by date saved
        if ($request->has('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }
        
        if ($request->has('end_date')) {
            $query->where('created_at', '<=', $request->end_date);
        }
        
        $savedJobs = $query->paginate($request->per_page ?? 10);
        
        return response()->json([
            'status' => 'success',
            'data' => $savedJobs
        ]);
    }
    
    /**
     * Get job recommendations for candidate based on profile
     */
    public function recommendations(Candidate $candidate): JsonResponse
    {
        // Get candidate skills
        $candidateSkillIds = $candidate->skills()->pluck('skills.id');
        
        // Find jobs matching candidate skills
        $recommendedJobs = JobListing::whereHas('skills', function($query) use ($candidateSkillIds) {
            $query->whereIn('skills.id', $candidateSkillIds);
        })
        ->whereIn('status', ['active', 'published']) // Show both active and published jobs
        ->where(function($query) use ($candidate) {
            // Match location if specified
            if ($candidate->desired_location) {
                $query->where('location', 'like', '%' . $candidate->desired_location . '%');
            }
            
            // Match job title if specified
            if ($candidate->desired_job_title) {
                $query->where('title', 'like', '%' . $candidate->desired_job_title . '%');
            }
        })
        ->withCount(['skills' => function($query) use ($candidateSkillIds) {
            $query->whereIn('skills.id', $candidateSkillIds);
        }])
        ->with(['company'])
        ->orderBy('skills_count', 'desc')
        ->take(10)
        ->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $recommendedJobs
        ]);
    }
    
    /**
     * Get upcoming interviews for candidate
     */
    public function interviews(Candidate $candidate): JsonResponse
    {
        $interviews = $candidate->upcomingInterviews()
            ->with(['jobApplication', 'jobApplication.jobListing', 'jobApplication.jobListing.company'])
            ->orderBy('scheduled_at')
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => InterviewResource::collection($interviews)
        ]);
    }
    
    /**
     * Add a skill to candidate
     */
    public function addSkill(Request $request, Candidate $candidate): JsonResponse
    {
        $request->validate([
            'skill_id' => 'required|exists:skills,id',
            'endorsements' => 'nullable|integer'
        ]);
        
        $candidate->skills()->attach($request->skill_id, [
            'endorsements' => $request->endorsements ?? 0
        ]);
        
        // Recalculate profile completion
        $profileCompletion = $candidate->calculateProfileCompletion();
        
        $candidate->load('skills');
        
        return response()->json([
            'status' => 'success',
            'message' => 'Skill added successfully',
            'profile_completion' => $profileCompletion,
            'data' => new CandidateResource($candidate)
        ]);
    }
    
    /**
     * Remove a skill from candidate
     */
    public function removeSkill(Request $request, Candidate $candidate): JsonResponse
    {
        $request->validate([
            'skill_id' => 'required|exists:skills,id'
        ]);
        
        $candidate->skills()->detach($request->skill_id);
        
        // Recalculate profile completion
        $profileCompletion = $candidate->calculateProfileCompletion();
        
        $candidate->load('skills');
        
        return response()->json([
            'status' => 'success',
            'message' => 'Skill removed successfully',
            'profile_completion' => $profileCompletion,
            'data' => new CandidateResource($candidate)
        ]);
    }
    
    /**
     * Get candidate profile completion checklist
     */
    public function profileCompletionChecklist(Candidate $candidate): JsonResponse
    {
        $checklist = [
            'basic_info' => [
                'complete' => !empty($candidate->name) && !empty($candidate->headline),
                'message' => 'Add basic profile information',
            ],
            'about' => [
                'complete' => !empty($candidate->about),
                'message' => 'Add an about section to your profile',
            ],
            'resume' => [
                'complete' => !empty($candidate->resume_url),
                'message' => 'Upload your resume',
            ],
            'experience' => [
                'complete' => $candidate->experiences()->count() > 0,
                'message' => 'Add work experience',
            ],
            'education' => [
                'complete' => $candidate->educations()->count() > 0,
                'message' => 'Add education details',
            ],
            'skills' => [
                'complete' => $candidate->skills()->count() > 0,
                'message' => 'Add skills to your profile',
            ],
            'certifications' => [
                'complete' => $candidate->certifications()->count() > 0,
                'message' => 'Add professional certifications',
            ],
            'portfolio' => [
                'complete' => !empty($candidate->portfolio_url),
                'message' => 'Add a portfolio URL',
            ],
        ];
        
        // Calculate completion percentage
        $completed = collect($checklist)->filter(function ($item) {
            return $item['complete'] === true;
        })->count();
        
        $totalItems = count($checklist);
        $percentage = round(($completed / $totalItems) * 100);
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'checklist' => $checklist,
                'percentage' => $percentage,
                'completed' => $completed,
                'total' => $totalItems,
            ]
        ]);
    }
    
    /**
     * Get candidate dashboard data
     */
    public function dashboard(Candidate $candidate): JsonResponse
    {
        // Load necessary relationships
        $candidate->load([
            'skills',
            'jobApplications' => function($q) {
                $q->with(['jobListing', 'jobListing.company'])->latest()->take(5);
            },
            'savedJobs' => function($q) {
                $q->with(['jobListing', 'jobListing.company'])->latest()->take(5);
            }
        ]);

        // Get profile completion data
        $profileCompletion = $this->profileCompletionChecklist($candidate)->original['data'];
        
        // Get profile views insights
        $insights = $this->getProfileInsights($candidate);
        
        // Get upcoming interviews
        $upcomingInterviews = $candidate->upcomingInterviews()
            ->with(['jobApplication', 'jobApplication.jobListing', 'jobApplication.jobListing.company'])
            ->orderBy('scheduled_at')
            ->take(3)
            ->get();
            
        // Get job recommendations
        $recommendedJobs = JobListing::whereHas('skills', function($query) use ($candidate) {
                $query->whereIn('skills.id', $candidate->skills()->pluck('skills.id'));
            })
            ->whereIn('status', ['active', 'published']) // Show both active and published jobs
            ->with(['company'])
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        // Get recent activities
        $recentActivities = $this->getRecentActivities($candidate);

        return response()->json([
            'status' => 'success',
            'data' => [
                'candidate' => new CandidateResource($candidate),
                'profile_completion' => $profileCompletion,
                'insights' => $insights,
                'upcoming_interviews' => InterviewResource::collection($upcomingInterviews),
                'recent_applications' => JobApplicationResource::collection($candidate->jobApplications),
                'saved_jobs' => $candidate->savedJobs,
                'recommended_jobs' => $recommendedJobs,
                'recent_activities' => $recentActivities,
            ]
        ]);
    }
    
    /**
     * Track profile view
     */
    private function trackProfileView(Request $request, Candidate $candidate): void
    {
        $viewerId = null;
        $viewerType = 'guest';
        
        if (Auth::check()) {
            $viewerId = Auth::id();
            $viewerType = 'user';
            
            // Check if the user is a company admin
            $user = Auth::user();
            if ($user->companyAdmin) {
                $viewerType = 'company';
            }
        }
        
        // Record the view
        CandidateProfileView::create([
            'candidate_id' => $candidate->id,
            'viewer_id' => $viewerId,
            'viewer_type' => $viewerType,
            'viewer_ip' => $request->ip(),
            'viewed_at' => now(),
        ]);
    }
    
    /**
     * Get profile insights data
     */
    private function getProfileInsights(Candidate $candidate): array
    {
        // Get view counts
        $totalViews = $candidate->profileViews()->count();
        
        // Views in the last 30 days
        $lastMonthViews = $candidate->profileViews()
            ->where('viewed_at', '>=', Carbon::now()->subDays(30))
            ->count();
            
        // Views in the 30 days prior to that
        $previousMonthViews = $candidate->profileViews()
            ->whereBetween('viewed_at', [
                Carbon::now()->subDays(60), 
                Carbon::now()->subDays(30)
            ])
            ->count();
            
        // Calculate percentage change
        $percentageChange = 0;
        if ($previousMonthViews > 0) {
            $percentageChange = round((($lastMonthViews - $previousMonthViews) / $previousMonthViews) * 100);
        }
        
        // Get unique viewers
        $uniqueViewers = $candidate->profileViews()
            ->where('viewed_at', '>=', Carbon::now()->subDays(30))
            ->distinct('viewer_id')
            ->count('viewer_id');
            
        // Get views by company type
        $companyViews = $candidate->profileViews()
            ->where('viewer_type', 'company')
            ->where('viewed_at', '>=', Carbon::now()->subDays(30))
            ->count();
            
        // Get daily view trends for the past 14 days
        $dailyTrends = $candidate->profileViews()
            ->where('viewed_at', '>=', Carbon::now()->subDays(14))
            ->select(DB::raw('DATE(viewed_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date')
            ->map(function ($item) {
                return $item->count;
            });
            
        // Fill in missing days with zero
        $trendData = [];
        for ($i = 13; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $trendData[$date] = $dailyTrends[$date] ?? 0;
        }
        
        return [
            'total_views' => $totalViews,
            'last_month_views' => $lastMonthViews,
            'percentage_change' => $percentageChange,
            'unique_viewers' => $uniqueViewers,
            'company_views' => $companyViews,
            'daily_trends' => $trendData,
        ];
    }
    
    /**
     * Get recent activities for the candidate
     */
    private function getRecentActivities(Candidate $candidate): array
    {
        $activities = [];
        
        // Get recent job applications
        $recentApplications = $candidate->jobApplications()
            ->with(['jobListing', 'jobListing.company'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
            
        foreach ($recentApplications as $application) {
            $activities[] = [
                'type' => 'application',
                'message' => "Applied for {$application->jobListing->title} at {$application->jobListing->company->name}",
                'date' => $application->created_at,
                'data' => $application,
            ];
        }
        
        // Get recent profile views
        $recentViews = $candidate->profileViews()
            ->with(['viewer'])
            ->orderBy('viewed_at', 'desc')
            ->take(5)
            ->get();
            
        foreach ($recentViews as $view) {
            $viewerName = "Someone";
            
            if ($view->viewer_type === 'company' && $view->viewer) {
                $companyAdmin = $view->viewer->companyAdmin;
                if ($companyAdmin && $companyAdmin->company) {
                    $viewerName = $companyAdmin->company->name;
                }
            }
            
            $activities[] = [
                'type' => 'profile_view',
                'message' => "{$viewerName} viewed your profile",
                'date' => $view->viewed_at,
                'data' => $view,
            ];
        }
        
        // Get upcoming interviews
        $interviews = $candidate->upcomingInterviews()
            ->with(['jobApplication', 'jobApplication.jobListing', 'jobApplication.jobListing.company'])
            ->orderBy('scheduled_at')
            ->take(5)
            ->get();
            
        foreach ($interviews as $interview) {
            $activities[] = [
                'type' => 'interview',
                'message' => "Interview scheduled for {$interview->jobApplication->jobListing->title} at {$interview->jobApplication->jobListing->company->name}",
                'date' => $interview->created_at,
                'data' => $interview,
            ];
        }
        
        // Sort by date (newest first)
        usort($activities, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });
        
        return array_slice($activities, 0, 10);
    }
    
    /**
     * Display the candidate by slug.
     */
    public function showBySlug($slug)
    {
        \Log::info("Searching for candidate by slug: {$slug}");
        
        // Try to find a candidate with the matching slug directly
        $candidate = Candidate::where('slug', $slug)
            ->with([
                'skills', 
                'experiences' => function($q) {
                    $q->orderBy('end_date', 'desc')->orderBy('start_date', 'desc');
                }, 
                'educations' => function($q) {
                    $q->orderBy('end_date', 'desc')->orderBy('start_date', 'desc');
                }, 
                'certifications' => function($q) {
                    $q->orderBy('issue_date', 'desc');
                },
                'jobApplications' => function($q) {
                    $q->with(['jobListing', 'jobListing.company'])->latest();
                }
            ])
            ->first();
        
        if (!$candidate) {
            return response()->json([
                'status' => 'error',
                'message' => 'Candidate not found'
            ], 404);
        }

        // Track profile view
        $this->trackProfileView(request(), $candidate);
        
        // Calculate profile completion
        $profileCompletion = $candidate->calculateProfileCompletion();
        
        // Get profile insights data
        $insights = $this->getProfileInsights($candidate);

        return response()->json([
            'status' => 'success',
            'data' => new CandidateResource($candidate),
            'profile_completion' => $profileCompletion,
            'insights' => $insights
        ]);
    }
    
    /**
     * Handle resume file upload
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function handleResumeUpload($request)
    {
        if ($request->hasFile('resume_url')) {
            $file = $request->file('resume_url');
            
            \Log::info('Resume upload detected: ' . $file->getClientOriginalName());
            
            // Check if the storage directory exists, create if not
            $storagePath = storage_path('app/public/resumes');
            if (!file_exists($storagePath)) {
                mkdir($storagePath, 0755, true);
                \Log::info('Created resume storage directory: ' . $storagePath);
            }
            
            // Generate a unique filename with the original extension
            $filename = uniqid('resume_') . '.' . $file->getClientOriginalExtension();
            
            // Store the file in the resumes directory
            $path = $file->storeAs('public/resumes', $filename);
            \Log::info('Resume saved at: ' . $path);
            
            // Return the relative path for database storage
            return str_replace('public/', '', $path);
        }
        
        return null;
    }
}
