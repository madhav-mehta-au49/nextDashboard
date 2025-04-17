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
}
