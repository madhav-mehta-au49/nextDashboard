<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanySpecialty extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'specialty',
    ];

    /**
     * Get the company that owns the specialty.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
