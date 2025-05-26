<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidateProfileView extends Model
{
    use HasFactory;    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'candidate_id',
        'viewer_id',
        'viewer_type', // 'user', 'company', 'recruiter', 'guest'
        'viewer_ip',
        'viewed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    /**
     * Get the candidate that was viewed.
     */
    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }    /**
     * Get the viewer if it's a user.
     */
    public function viewer()
    {
        return $this->morphTo();
    }
}