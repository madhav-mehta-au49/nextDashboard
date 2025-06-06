<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InterviewResource extends JsonResource
{    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'job_application_id' => $this->job_application_id,
            'interview_type' => $this->interview_type,
            'scheduled_at' => $this->scheduled_at,
            'duration_minutes' => $this->duration_minutes,
            'location' => $this->location,
            'meeting_link' => $this->meeting_link,
            'interviewer_ids' => $this->interviewer_ids,
            'interview_notes' => $this->interview_notes,
            'status' => $this->status,
            'candidate_notes' => $this->candidate_notes,
            'internal_notes' => $this->internal_notes,
            'timezone' => $this->timezone,
            'reminded_at' => $this->reminded_at,
            'primary_interviewer' => $this->whenLoaded('primaryInterviewer', function() {
                return [
                    'id' => $this->primaryInterviewer->id,
                    'name' => $this->primaryInterviewer->name,
                    'email' => $this->primaryInterviewer->email,
                ];
            }),
            'job_application' => $this->whenLoaded('jobApplication', function() {
                return [
                    'id' => $this->jobApplication->id,
                    'status' => $this->jobApplication->status,
                    'candidate' => $this->whenLoaded('jobApplication.candidate', function() {
                        return [
                            'id' => $this->jobApplication->candidate->id,
                            'name' => $this->jobApplication->candidate->name,
                            'email' => $this->jobApplication->candidate->email,
                        ];
                    }),
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
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}