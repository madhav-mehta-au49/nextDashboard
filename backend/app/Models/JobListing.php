<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'title',
        'description',
        'location',
        'is_remote',
        'type',
        'experience_level',
        'salary_min',
        'salary_max',
        'salary_currency',
        'posted_date',
        'application_deadline',
        'status',
        'applicants_count',
        'views_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_remote' => 'boolean',
        'posted_date' => 'date',
        'application_deadline' => 'date',
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
    ];

    /**
     * Get the company that owns the job listing.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the skills for the job listing.
     */
    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'job_skills')
                    ->withPivot('is_required')
                    ->withTimestamps();
    }

    /**
     * Get the applications for the job listing.
     */
    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    /**
     * Get the candidates who applied for the job listing.
     */
    public function applicants()
    {
        return $this->belongsToMany(Candidate::class, 'job_applications')
                    ->withPivot('status', 'cover_letter', 'resume_url')
                    ->withTimestamps();
    }

    /**
     * Get the users who saved the job listing.
     */
    public function savedBy()
    {
        return $this->belongsToMany(User::class, 'saved_jobs')
                    ->withTimestamps();
    }

    /**
     * Scope a query to only include active job listings.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'published')
                     ->where(function ($query) {
                         $query->whereNull('application_deadline')
                               ->orWhere('application_deadline', '>=', now());
                     });
    }
}
