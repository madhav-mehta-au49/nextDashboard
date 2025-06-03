<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplicationAnswer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'job_application_id',
        'question_id',
        'question_text',
        'answer',
        'question_type',
        'question_options',
        'is_required',
        'file_url',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'question_options' => 'array',
        'is_required' => 'boolean',
    ];

    /**
     * Get the job application that owns this answer.
     */
    public function jobApplication()
    {
        return $this->belongsTo(JobApplication::class);
    }

    /**
     * Scope to filter by question type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('question_type', $type);
    }

    /**
     * Scope to filter required questions.
     */
    public function scopeRequired($query)
    {
        return $query->where('is_required', true);
    }

    /**
     * Check if this answer has a file attachment.
     */
    public function hasFile()
    {
        return !empty($this->file_url);
    }

    /**
     * Get formatted answer based on question type.
     */
    public function getFormattedAnswerAttribute()
    {
        switch ($this->question_type) {
            case 'checkbox':
                if (is_array($this->answer)) {
                    return implode(', ', $this->answer);
                }
                break;
            case 'date':
                if ($this->answer) {
                    return \Carbon\Carbon::parse($this->answer)->format('M d, Y');
                }
                break;
            case 'file':
                return $this->hasFile() ? 'File uploaded' : 'No file';
            default:
                return $this->answer;
        }

        return $this->answer;
    }

    /**
     * Get question display text with required indicator.
     */
    public function getQuestionDisplayAttribute()
    {
        return $this->question_text . ($this->is_required ? ' *' : '');
    }
}
