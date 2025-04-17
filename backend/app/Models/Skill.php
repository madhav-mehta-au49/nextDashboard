<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];

    /**
     * Get the candidates that have this skill.
     */
    public function candidates()
    {
        return $this->belongsToMany(Candidate::class, 'candidate_skills')
                    ->withPivot('endorsements')
                    ->withTimestamps();
    }

    /**
     * Get the job listings that require this skill.
     */
    public function jobListings()
    {
        return $this->belongsToMany(JobListing::class, 'job_skills')
                    ->withPivot('is_required')
                    ->withTimestamps();
    }
}
