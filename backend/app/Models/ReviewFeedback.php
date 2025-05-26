<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewFeedback extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'review_id',
        'user_id',
        'is_helpful',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_helpful' => 'boolean',
    ];

    /**
     * Get the review that owns this feedback.
     */
    public function review()
    {
        return $this->belongsTo(CompanyReview::class, 'review_id');
    }

    /**
     * Get the user who provided this feedback.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
