<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Candidate extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'headline',
        'location',
        'about',
        'email',
        'phone',
        'website',
        'resume_url',
        'profile_picture',
        'cover_image',
        'profile_completed_percentage',
        'availability',
        'connections',
        'desired_job_title',
        'desired_salary',
        'desired_location',
        'work_type_preference',
        'visibility',
        'portfolio_url',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'profile_completed_percentage' => 'integer',
    ];

    /**
     * Get the user that owns the candidate profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the experiences for the candidate.
     */
    public function experiences()
    {
        return $this->hasMany(Experience::class);
    }

    /**
     * Get the educations for the candidate.
     */
    public function educations()
    {
        return $this->hasMany(Education::class);
    }

    /**
     * Get the certifications for the candidate.
     */
    public function certifications()
    {
        return $this->hasMany(Certification::class);
    }

    /**
     * Get the skills for the candidate.
     */
    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'candidate_skills')
                    ->withPivot('endorsements')
                    ->withTimestamps();
    }

    /**
     * Get the job applications for the candidate.
     */
    public function jobApplications()
    {
        return $this->hasMany(JobApplication::class);
    }

    /**
     * Get the applied jobs for the candidate.
     */
    public function appliedJobs()
    {
        return $this->belongsToMany(JobListing::class, 'job_applications')
                    ->withPivot('status', 'cover_letter', 'resume_url')
                    ->withTimestamps();
    }
    
    /**
     * Get the saved jobs for the candidate.
     */
    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class);
    }
    
    /**
     * Get saved job listings
     */
    public function savedJobListings()
    {
        return $this->belongsToMany(JobListing::class, 'saved_jobs')
                    ->withTimestamps();
    }
    
    /**
     * Get the profile views for the candidate.
     */
    public function profileViews()
    {
        return $this->hasMany(CandidateProfileView::class);
    }
    
    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::creating(function ($candidate) {
            if (!$candidate->slug) {
                $candidate->slug = self::generateUniqueSlug($candidate->name);
            }
        });

        static::updating(function ($candidate) {
            // If name changed and slug hasn't been manually set, update slug
            if ($candidate->isDirty('name') && !$candidate->isDirty('slug')) {
                $candidate->slug = self::generateUniqueSlug($candidate->name);
            }
        });
    }

    /**
     * Generate a unique slug based on the candidate's name.
     *
     * @param string $name
     * @return string
     */
    public static function generateUniqueSlug($name)
    {
        $baseSlug = \Str::slug($name);
        $slug = $baseSlug;
        $count = 1;

        // Check if the slug already exists
        while (self::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $count++;
        }

        return $slug;
    }
    
    /**
     * Calculate profile completion percentage
     */
    public function calculateProfileCompletion()
    {
        $score = 0;
        $totalItems = 7; // Base number of profile items to check

        // Basic info (name and email are required)
        if ($this->name && $this->email && $this->headline) {
            $score += 1;
        }
        
        // About
        if ($this->about) {
            $score += 1;
        }
        
        // Resume
        if ($this->resume_url) {
            $score += 1;
        }
        
        // Experiences
        if ($this->experiences()->count() > 0) {
            $score += 1;
        }
        
        // Education
        if ($this->educations()->count() > 0) {
            $score += 1;
        }
        
        // Skills
        if ($this->skills()->count() > 0) {
            $score += 1;
        }
        
        // Certifications
        if ($this->certifications()->count() > 0) {
            $score += 1;
        }
        
        $percentage = round(($score / $totalItems) * 100);
        
        $this->profile_completed_percentage = $percentage;
        $this->save();
        
        return $percentage;
    }
}
