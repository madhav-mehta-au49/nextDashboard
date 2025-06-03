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
        'cover_letter',
        'resume_url',
        'status',
        'applied_at',
        'status_updated_at',
        'status_notes',
        'withdrawal_reason',
        'expected_salary',
        'salary_currency',
        'availability_date',
        'notice_period',
        'willing_to_relocate',
        'visa_status',
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
    ];

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
