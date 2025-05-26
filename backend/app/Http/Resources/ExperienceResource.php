<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExperienceResource extends JsonResource
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
            'company_name' => $this->company_name,
            'position' => $this->title, // Map 'title' field to 'position' for frontend compatibility
            'location' => $this->location,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'is_current' => $this->is_current,
            'description' => $this->description,
            'skills_used' => $this->skills_used,
            'employment_type' => $this->employment_type,
            'company_logo' => $this->company_logo,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}