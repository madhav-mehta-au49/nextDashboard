<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Interview extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'job_application_id',
        'scheduled_at',
        'duration_minutes',
        'type',  // 'phone', 'video', 'in-person', 'technical', 'hr'
        'status', // 'scheduled', 'completed', 'cancelled', 'rescheduled'
        'notes',
        'location',
        'meeting_link',
        'interviewer_id',
        'interviewer_name',
        'feedback',
        'outcome',  // 'passed', 'failed', 'pending'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'scheduled_at' => 'datetime',
        'duration_minutes' => 'integer',
    ];

    /**
     * Get the job application associated with this interview.
     */
    public function jobApplication()
    {
        return $this->belongsTo(JobApplication::class);
    }

    /**
     * Get the candidate associated with this interview through job application.
     */
    public function candidate()
    {
        return $this->belongsTo(Candidate::class, 'id', 'candidate_id')
                    ->withDefault();
    }

    /**
     * Get the interviewer user if available.
     */
    public function interviewer()
    {
        return $this->belongsTo(User::class, 'interviewer_id');
    }

    /**
     * Get the job listing associated with this interview through job application.
     */
    public function jobListing()
    {
        return $this->jobApplication->jobListing;
    }

    /**
     * Get the company associated with this interview through job listing.
     */
    public function company()
    {
        return $this->jobApplication->jobListing->company;
    }
}