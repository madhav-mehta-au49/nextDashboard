<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'job_listing_id',
        'candidate_id',
        
        // Personal Information
        'first_name',
        'last_name',
        'email',
        'phone',
        'current_location',
        'linkedin_url',
        'portfolio_url',
        
        // Professional Information
        'current_job_title',
        'current_company',
        'total_experience',
        'relevant_experience',
        'current_salary',
        'work_type_preference',
        
        // Application Content
        'cover_letter',
        'motivation_letter',
        'key_strengths',
        'career_goals',
        'resume_url',
        'cover_letter_file_url',
        'additional_files_urls',
        
        // Salary & Availability
        'expected_salary',
        'salary_currency',
        'availability_date',
        'notice_period',
        'willing_to_relocate',
        'visa_status',
        
        // Status & Metadata
        'status',
        'applied_at',
        'status_updated_at',
        'status_notes',
        'withdrawal_reason',
        'additional_notes',
        'referral_source',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'applied_at' => 'datetime',
        'status_updated_at' => 'datetime',
        'availability_date' => 'date',
        'willing_to_relocate' => 'boolean',
        'expected_salary' => 'decimal:2',
        'current_salary' => 'decimal:2',
        'key_strengths' => 'array',
        'additional_files_urls' => 'array',
    ];
    
    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'full_name'
    ];

    /**
     * Get the full name attribute.
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Get the job listing that the application is for.
     */
    public function jobListing()
    {
        return $this->belongsTo(JobListing::class);
    }

    /**
     * Get the candidate that made the application.
     */
    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    /**
     * Get the answers for this application.
     */
    public function answers()
    {
        return $this->hasMany(JobApplicationAnswer::class);
    }

    /**
     * Get the interviews for this application.
     */
    public function interviews()
    {
        return $this->hasMany(Interview::class);
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to filter by date range.
     */
    public function scopeAppliedBetween($query, $startDate, $endDate)
    {
        return $query->whereBetween('applied_at', [$startDate, $endDate]);
    }

    /**
     * Scope a query to filter pending applications.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to filter active applications (not rejected or withdrawn).
     */
    public function scopeActive($query)
    {
        return $query->whereNotIn('status', ['rejected', 'withdrawn']);
    }

    /**
     * Check if application is in a final state.
     */
    public function isFinal()
    {
        return in_array($this->status, ['hired', 'rejected', 'withdrawn']);
    }

    /**
     * Check if application can be withdrawn.
     */
    public function canBeWithdrawn()
    {
        return !$this->isFinal();
    }

    /**
     * Get status label for display.
     */
    public function getStatusLabelAttribute()
    {
        $labels = [
            'pending' => 'Pending Review',
            'reviewed' => 'Under Review',
            'interviewing' => 'Interview Stage',
            'offered' => 'Offer Extended',
            'hired' => 'Hired',
            'rejected' => 'Rejected',
            'withdrawn' => 'Withdrawn',
        ];

        return $labels[$this->status] ?? ucfirst($this->status);
    }

    /**
     * Get status color for UI.
     */
    /**
     * Get the status history for this application.
     */
    public function statusHistory()
    {
        return $this->hasMany(ApplicationStatusHistory::class);
    }

    public function getStatusColorAttribute()
    {
        $colors = [
            'pending' => 'yellow',
            'reviewed' => 'blue',
            'interviewing' => 'purple',
            'offered' => 'green',
            'hired' => 'green',
            'rejected' => 'red',
            'withdrawn' => 'gray',
        ];

        return $colors[$this->status] ?? 'gray';
    }
}
