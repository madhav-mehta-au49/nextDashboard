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
            'applied_at' => $this->created_at,
            'job_listing' => $this->whenLoaded('jobListing', function() {
                return [
                    'id' => $this->jobListing->id,
                    'title' => $this->jobListing->title,
                    'location' => $this->jobListing->location,
                    'salary_range' => $this->jobListing->salary_range,
                    'job_type' => $this->jobListing->job_type,
                    'company' => $this->whenLoaded('jobListing.company', function() {
                        return [
                            'id' => $this->jobListing->company->id,
                            'name' => $this->jobListing->company->name,
                            'logo' => $this->jobListing->company->logo,
                        ];
                    }),
                ];
            }),
            'interviews' => InterviewResource::collection($this->whenLoaded('interviews')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}