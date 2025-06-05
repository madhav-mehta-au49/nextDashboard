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
    {        return [
            'id' => $this->id,
            'candidate_id' => $this->candidate_id,
            'job_listing_id' => $this->job_listing_id,            'status' => $this->status,
            'cover_letter' => $this->cover_letter,
            'resume_url' => $this->resume_url,
            'salary_expectation' => $this->expected_salary,
            'expected_salary' => $this->expected_salary,
            'availability_date' => $this->availability_date,
            'notes' => $this->notes,
            'applied_at' => $this->created_at,
            'status_updated_at' => $this->status_updated_at,
            'match_score' => $this->when(isset($this->match_score), $this->match_score),
              // Application form fields
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'current_location' => $this->current_location,
            'linkedin_url' => $this->linkedin_url,
            'portfolio_url' => $this->portfolio_url,
            'current_job_title' => $this->current_job_title,
            'current_company' => $this->current_company,
            'total_experience' => $this->total_experience,
            'relevant_experience' => $this->relevant_experience,
            'current_salary' => $this->current_salary,
            'work_type_preference' => $this->work_type_preference,
            'motivation_letter' => $this->motivation_letter,
            'key_strengths' => $this->key_strengths,
            'career_goals' => $this->career_goals,
            'cover_letter_file_url' => $this->cover_letter_file_url,
            'additional_files_urls' => $this->additional_files_urls,
            'expected_salary' => $this->expected_salary,
            'salary_currency' => $this->salary_currency,
            'notice_period' => $this->notice_period,
            'willing_to_relocate' => $this->willing_to_relocate,
            'visa_status' => $this->visa_status,
            'additional_notes' => $this->additional_notes,
            'referral_source' => $this->referral_source,
            'linkedin_url' => $this->linkedin_url,
            'portfolio_url' => $this->portfolio_url,
            
            // Professional Information
            'relevant_experience' => $this->relevant_experience,
            'current_salary' => $this->current_salary,
            'work_type_preference' => $this->work_type_preference,
            'notice_period' => $this->notice_period,
            
            // Application Content
            'motivation_letter' => $this->motivation_letter,
            'key_strengths' => $this->key_strengths,
            'career_goals' => $this->career_goals,
            'cover_letter_file_url' => $this->cover_letter_file_url,
            'additional_files_urls' => $this->additional_files_urls,
            
            // Salary & Availability
            'expected_salary' => $this->expected_salary,
            'salary_currency' => $this->salary_currency,
            'willing_to_relocate' => $this->willing_to_relocate,
            'visa_status' => $this->visa_status,
            
            // Additional Information
            'additional_notes' => $this->additional_notes,
            'referral_source' => $this->referral_source,            // Candidate information (basic identification only)
            'candidate' => $this->whenLoaded('candidate', function() {
                $candidate = $this->candidate;
                $user = $candidate->relationLoaded('user') ? $candidate->user : null;
                
                return [
                    'id' => $candidate->id,
                    'user_id' => $candidate->user_id,
                    'name' => $user ? $user->name : $candidate->name, // Fallback to candidate.name
                    'email' => $user ? $user->email : $candidate->email, // Fallback to candidate.email
                ];
            }),
              // Job listing information
            'job_listing' => $this->whenLoaded('jobListing', function() {
                $jobListing = $this->jobListing;
                return [
                    'id' => $jobListing->id,
                    'title' => $jobListing->title,
                    'location' => $jobListing->location,
                    'salary_range' => $jobListing->salary_range,
                    'job_type' => $jobListing->job_type,
                    'experience_level' => $jobListing->experience_level,
                    'required_skills' => $jobListing->required_skills,
                    'status' => $jobListing->status,
                    'company' => $jobListing->relationLoaded('company') && $jobListing->company ? [
                        'id' => $jobListing->company->id,
                        'name' => $jobListing->company->name,
                        'logo' => $jobListing->company->logo,
                        'location' => $jobListing->company->location,
                    ] : null,
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