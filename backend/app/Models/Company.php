<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'industry',
        'size',
        'founded',
        'website',
        'headquarters',
        'logo_url',
        'cover_image_url',
        'employees',
        'followers',
        'verified',
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Get the admins for the company.
     */
    public function admins()
    {
        return $this->belongsToMany(User::class, 'company_admins')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    /**
     * Get the job listings for the company.
     */
    public function jobListings()
    {
        return $this->hasMany(JobListing::class);
    }

    /**
     * Get the locations for the company.
     */
    public function locations()
    {
        return $this->hasMany(CompanyLocation::class);
    }

    /**
     * Get the specialties for the company.
     */
    public function specialties()
    {
        return $this->hasMany(CompanySpecialty::class);
    }

    /**
     * Get the social links for the company.
     */
    public function socialLinks()
    {
        return $this->hasMany(CompanySocialLink::class);
    }

    /**
     * Get the followers for the company.
     */
    public function followers()
    {
        return $this->belongsToMany(User::class, 'company_followers')
                    ->withPivot('is_candidate', 'relationship', 'notes')
                    ->withTimestamps();
    }

    /**
     * Get the candidate followers for the company.
     */
    public function candidateFollowers()
    {
        return $this->belongsToMany(User::class, 'company_followers')
                    ->wherePivot('is_candidate', true)
                    ->withPivot('relationship', 'notes')
                    ->withTimestamps();
    }

    /**
     * Get the reviews for the company.
     */

    public function reviews()
{
    return $this->hasMany(\App\Models\CompanyReview::class, 'company_id');
}
}
