<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidateSkill extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'candidate_id',
        'skill_id',
        'endorsements',
    ];

    /**
     * Get the candidate that has the skill.
     */
    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    /**
     * Get the skill that the candidate has.
     */
    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }
}
