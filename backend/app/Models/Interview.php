<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Interview extends Model
{
    use HasFactory;    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'job_application_id',
        'interview_type',
        'scheduled_at',
        'duration_minutes',
        'location',
        'meeting_link',
        'interviewer_ids',
        'interview_notes',
        'status',
        'candidate_notes',
        'internal_notes',
        'timezone',
        'reminded_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'scheduled_at' => 'datetime',
        'duration_minutes' => 'integer',
        'interviewer_ids' => 'array',
        'reminded_at' => 'datetime',
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
    }    /**
     * Get the interviewer users if available.
     */
    public function interviewers()
    {
        return $this->belongsToMany(User::class, 'interview_interviewers', 'interview_id', 'user_id');
    }

    /**
     * Get the primary interviewer (first in the list).
     */
    public function primaryInterviewer()
    {
        if (empty($this->interviewer_ids)) {
            return null;
        }
        
        return User::find($this->interviewer_ids[0]);
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