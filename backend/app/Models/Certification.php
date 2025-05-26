<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'candidate_id',
        'name',
        'issuing_organization',
        'credential_id',
        'credential_url',
        'issue_date',
        'expiration_date',
        'no_expiration',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'issue_date' => 'date',
        'expiration_date' => 'date',
        'no_expiration' => 'boolean',
    ];

    /**
     * Get the candidate that owns the certification.
     */
    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
