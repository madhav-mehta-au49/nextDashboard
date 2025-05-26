<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'headline',
        'about',
        'location',
        'profile_picture',
        'cover_image',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the candidate associated with the user.
     */
    public function candidate()
    {
        return $this->hasOne(Candidate::class);
    }

    /**
     * Get the company admins for the user.
     */
    public function companyAdmins()
    {
        return $this->hasMany(CompanyAdmin::class);
    }

    /**
     * Get the companies administered by the user.
     */
    public function administeredCompanies()
    {
        return $this->belongsToMany(Company::class, 'company_admins')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    /**
     * Get the companies followed by the user.
     */
    public function followedCompanies()
    {
        return $this->belongsToMany(Company::class, 'company_followers')
                    ->withPivot('is_candidate', 'relationship', 'notes')
                    ->withTimestamps();
    }

    /**
 * Get the companies saved by the user.
 */
public function savedCompanies()
{
    return $this->belongsToMany(Company::class, 'saved_companies')
                ->withTimestamps();
}


/**
 * Get the company reviews written by the user.
 */
public function companyReviews()
{
    return $this->hasMany(CompanyReview::class);
}

    /**
     * Get the saved jobs for the user.
     */
    public function savedJobs()
    {
        return $this->belongsToMany(JobListing::class, 'saved_jobs')
                    ->withTimestamps();
    }

    /**
     * Check if the user is a candidate.
     */
    public function isCandidate()
    {
        return $this->role === 'candidate';
    }

    /**
     * Check if the user is an employer.
     */
    public function isEmployer()
    {
        return $this->role === 'employer';
    }

    /**
     * Check if the user is HR.
     */
    public function isHR()
    {
        return $this->role === 'hr';
    }

    /**
     * Check if the user is an admin.
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }
}
