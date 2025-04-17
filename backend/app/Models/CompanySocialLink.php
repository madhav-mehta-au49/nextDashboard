<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanySocialLink extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'platform',
        'url',
    ];

    /**
     * Get the company that owns the social link.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
