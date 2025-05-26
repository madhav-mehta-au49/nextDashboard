<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EducationResource extends JsonResource
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
            'institution' => $this->institution,
            'degree' => $this->degree,
            'field_of_study' => $this->field_of_study,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'is_current' => $this->is_current,
            'description' => $this->description,
            'grade' => $this->grade,
            'activities' => $this->activities,
            'institution_logo' => $this->institution_logo,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}