<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InterviewResource extends JsonResource
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
            'job_application_id' => $this->job_application_id,
            'job_application' => $this->whenLoaded('jobApplication', function() {
                return [
                    'id' => $this->jobApplication->id,
                    'status' => $this->jobApplication->status,
                    'job_listing' => $this->whenLoaded('jobApplication.jobListing', function() {
                        return [
                            'id' => $this->jobApplication->jobListing->id,
                            'title' => $this->jobApplication->jobListing->title,
                            'company' => $this->whenLoaded('jobApplication.jobListing.company', function() {
                                return [
                                    'id' => $this->jobApplication->jobListing->company->id,
                                    'name' => $this->jobApplication->jobListing->company->name,
                                    'logo' => $this->jobApplication->jobListing->company->logo,
                                ];
                            }),
                        ];
                    }),
                ];
            }),
            'scheduled_at' => $this->scheduled_at,
            'duration_minutes' => $this->duration_minutes,
            'type' => $this->type,
            'status' => $this->status,
            'notes' => $this->notes,
            'location' => $this->location,
            'meeting_link' => $this->meeting_link,
            'interviewer_id' => $this->interviewer_id,
            'interviewer_name' => $this->interviewer_name,
            'feedback' => $this->feedback,
            'outcome' => $this->outcome,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}