<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'availability',
        'resume_url',
        'connections',
    ];

    /**
     * Get the user that owns the candidate.
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
}
