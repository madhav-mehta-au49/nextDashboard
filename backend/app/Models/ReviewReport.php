<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewReport extends Model
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
        'reason',
        'resolved',
        'resolution_notes',
    ];

        /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'resolved' => 'boolean',
    ];

    /**
     * Get the review that was reported.
     */
    public function review()
    {
        return $this->belongsTo(CompanyReview::class, 'review_id');
    }

    /**
     * Get the user who reported the review.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
