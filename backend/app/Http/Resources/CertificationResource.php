<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CertificationResource extends JsonResource
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
            'name' => $this->name,
            'issuing_organization' => $this->issuing_organization,
            'issue_date' => $this->issue_date,
            'expiration_date' => $this->expiration_date,
            'credential_id' => $this->credential_id,            'credential_url' => $this->credential_url,
            'file_path' => $this->getFileUrl($this->file_path),
            'description' => $this->description,
            'skills' => $this->skills,
            'organization_logo' => $this->organization_logo,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Get full URL for file path
     */
    private function getFileUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }
        
        // If it's already a full URL, return as is
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        
        // Generate storage URL
        return Storage::disk('public')->url($path);
    }
}