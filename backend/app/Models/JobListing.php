<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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
        'category_id',
        'title',
        'description',
        'requirements',
        'benefits',
        'location',
        'location_type',
        'job_type',
        'experience_level',
        'salary_min',
        'salary_max',
        'currency',
        'required_skills',
        'preferred_skills',
        'application_deadline',
        'start_date',
        'is_remote_friendly',
        'status',
        'featured',
        'urgent',
        'applicants_count',
        'views_count',
        'published_at',
        'expires_at',
        'posted_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_remote_friendly' => 'boolean',
        'featured' => 'boolean',
        'urgent' => 'boolean',
        'posted_date' => 'date',
        'application_deadline' => 'date',
        'start_date' => 'date',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'requirements' => 'array',
        'benefits' => 'array',
        'required_skills' => 'array',
        'preferred_skills' => 'array',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'days_since_posted',
        'salary_range',
        'slug',
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
     * Get the job category that the job belongs to.
     */
    public function jobCategory()
    {
        return $this->belongsTo(JobCategory::class, 'category_id');
    }

    /**
     * Get the category for backward compatibility.
     */
    public function category()
    {
        return $this->jobCategory();
    }

    /**
     * Get the required skills for this job.
     */
    public function requiredSkills()
    {
        return $this->belongsToMany(Skill::class, 'job_skills')
                    ->wherePivot('is_required', true)
                    ->withPivot('years_experience')
                    ->withTimestamps();
    }

    /**
     * Get the optional skills for this job.
     */
    public function optionalSkills()
    {
        return $this->belongsToMany(Skill::class, 'job_skills')
                    ->wherePivot('is_required', false)
                    ->withPivot('years_experience')
                    ->withTimestamps();
    }

    /**
     * Scope a query to only include active job listings.
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['active', 'published'])
                     ->where(function ($query) {
                         $query->whereNull('application_deadline')
                               ->orWhere('application_deadline', '>=', now());
                     });
    }

    /**
     * Scope a query to include remote jobs.
     */
    public function scopeRemote($query)
    {
        return $query->where('is_remote_friendly', true);
    }

    /**
     * Scope a query to filter by job type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('job_type', $type);
    }

    /**
     * Scope a query to filter by experience level.
     */
    public function scopeExperienceLevel($query, $level)
    {
        return $query->where('experience_level', $level);
    }

    /**
     * Scope a query to filter by salary range.
     */
    public function scopeSalaryRange($query, $min = null, $max = null)
    {
        if ($min) {
            $query->where('salary_min', '>=', $min);
        }
        if ($max) {
            $query->where('salary_max', '<=', $max);
        }
        return $query;
    }

    /**
     * Scope a query to filter by posted within days.
     */
    public function scopePostedWithin($query, $days)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Scope a query to filter by company.
     */
    public function scopeForCompany($query, $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to search by keywords.
     */
    public function scopeSearch($query, $keyword)
    {
        return $query->where(function ($query) use ($keyword) {
            $query->where('title', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%")
                  ->orWhereHas('company', function ($q) use ($keyword) {
                      $q->where('name', 'like', "%{$keyword}%");
                  })
                  ->orWhereHas('skills', function ($q) use ($keyword) {
                      $q->where('name', 'like', "%{$keyword}%");
                  });
        });
    }

    /**
     * Get days since posted accessor.
     */
    public function getDaysSincePostedAttribute()
    {
        return $this->created_at ? now()->diffInDays($this->created_at) : null;
    }

    /**
     * Get salary range accessor.
     */
    public function getSalaryRangeAttribute()
    {
        if (!$this->salary_min && !$this->salary_max) {
            return null;
        }

        $currency = $this->currency ?? 'INR';
        $symbol = $this->getCurrencySymbol($currency);

        if ($this->salary_min && $this->salary_max) {
            return $symbol . number_format($this->salary_min) . ' - ' . $symbol . number_format($this->salary_max);
        } elseif ($this->salary_min) {
            return 'From ' . $symbol . number_format($this->salary_min);
        } else {
            return 'Up to ' . $symbol . number_format($this->salary_max);
        }
    }

    /**
     * Get slug accessor.
     */
    public function getSlugAttribute()
    {
        return Str::slug($this->title . '-' . $this->id);
    }

    /**
     * Get currency symbol for display.
     */
    private function getCurrencySymbol($currency)
    {
        $symbols = [
            'INR' => '₹',
            'USD' => '$',
            'EUR' => '€',
            'GBP' => '£',
            'JPY' => '¥',
            'CAD' => 'C$',
            'AUD' => 'A$',
            'SGD' => 'S$',
        ];

        return $symbols[$currency] ?? $currency . ' ';
    }
}
