<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyReview extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'user_id',
        'rating',
        'title',
        'content',
        'relationship',
        'is_anonymous',
        'is_approved',
        'helpful_count',
        'unhelpful_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'integer',
        'is_anonymous' => 'boolean',
        'is_approved' => 'boolean',
        'helpful_count' => 'integer',
        'unhelpful_count' => 'integer',
    ];

    /**
     * Get the company that owns the review.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the user who wrote the review.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the feedback for the review.
     */
    public function feedback()
    {
        return $this->hasMany(ReviewFeedback::class, 'review_id');
    }

    /**
     * Get the reports for the review.
     */
    public function reports()
    {
        return $this->hasMany(ReviewReport::class, 'review_id');
    }
}
