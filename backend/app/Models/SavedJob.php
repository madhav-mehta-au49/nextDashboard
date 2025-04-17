<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedJob extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'job_listing_id',
        'user_id',
    ];

    /**
     * Get the job listing that was saved.
     */
    public function jobListing()
    {
        return $this->belongsTo(JobListing::class);
    }

    /**
     * Get the user who saved the job.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
