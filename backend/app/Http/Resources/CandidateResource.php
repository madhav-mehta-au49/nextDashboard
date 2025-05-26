<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CandidateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'website' => $this->website,
            'location' => $this->location,
            'profile_picture' => $this->profile_picture,
            'cover_image' => $this->cover_image,
            'headline' => $this->headline,
            'about' => $this->about,
            'resume_url' => $this->resume_url,
            'portfolio_url' => $this->portfolio_url,
            'availability' => $this->availability,
            'connections' => $this->connections,
            'desired_job_title' => $this->desired_job_title,
            'desired_salary' => $this->desired_salary,
            'desired_location' => $this->desired_location,
            'work_type_preference' => $this->work_type_preference,
            'visibility' => $this->visibility,
            'profile_completed_percentage' => $this->profile_completed_percentage,
            'slug' => $this->slug,
            'skills' => SkillResource::collection($this->whenLoaded('skills')),
            'experiences' => ExperienceResource::collection($this->whenLoaded('experiences')),
            'educations' => EducationResource::collection($this->whenLoaded('educations')),
            'certifications' => CertificationResource::collection($this->whenLoaded('certifications')),
            'job_applications_count' => $this->whenCounted('jobApplications'),
            'saved_jobs_count' => $this->whenCounted('savedJobs'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}