<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobApplicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'candidate_id' => $this->candidate_id,
            'job_listing_id' => $this->job_listing_id,
            'status' => $this->status,
            'cover_letter' => $this->cover_letter,
            'resume_url' => $this->resume_url,
            'salary_expectation' => $this->salary_expectation,
            'availability_date' => $this->availability_date,
            'notes' => $this->notes,
            'applied_at' => $this->created_at,
            'match_score' => $this->when(isset($this->match_score), $this->match_score),
            
            // Candidate information
            'candidate' => $this->whenLoaded('candidate', function() {
                return [
                    'id' => $this->candidate->id,
                    'user_id' => $this->candidate->user_id,
                    'name' => $this->candidate->user->name ?? null,
                    'email' => $this->candidate->user->email ?? null,
                    'phone' => $this->candidate->phone,
                    'experience_level' => $this->candidate->experience_level,
                    'skills' => $this->candidate->skills,
                    'location' => $this->candidate->location,
                    'profile_image' => $this->candidate->user->profile_image ?? null,
                ];
            }),
            
            // Job listing information
            'job_listing' => $this->whenLoaded('jobListing', function() {
                return [
                    'id' => $this->jobListing->id,
                    'title' => $this->jobListing->title,
                    'location' => $this->jobListing->location,
                    'salary_range' => $this->jobListing->salary_range,
                    'job_type' => $this->jobListing->job_type,
                    'experience_level' => $this->jobListing->experience_level,
                    'required_skills' => $this->jobListing->required_skills,
                    'status' => $this->jobListing->status,
                    'company' => $this->whenLoaded('jobListing.company', function() {
                        return [
                            'id' => $this->jobListing->company->id,
                            'name' => $this->jobListing->company->name,
                            'logo' => $this->jobListing->company->logo,
                            'location' => $this->jobListing->company->location,
                        ];
                    }),
                ];
            }),
            
            // Application answers
            'answers' => $this->whenLoaded('answers', function() {
                return $this->answers->map(function($answer) {
                    return [
                        'id' => $answer->id,
                        'question_id' => $answer->question_id,
                        'question_text' => $answer->question->question_text ?? null,
                        'answer' => $answer->answer,
                        'question_type' => $answer->question->question_type ?? null,
                    ];
                });
            }),
            
            // Interviews
            'interviews' => $this->whenLoaded('interviews', function() {
                return $this->interviews->map(function($interview) {
                    return [
                        'id' => $interview->id,
                        'scheduled_at' => $interview->scheduled_at,
                        'type' => $interview->type,
                        'status' => $interview->status,
                        'feedback' => $interview->feedback,
                        'rating' => $interview->rating,
                    ];
                });
            }),
            
            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}