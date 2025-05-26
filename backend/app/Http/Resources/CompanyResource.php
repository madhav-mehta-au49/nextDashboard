<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'industry' => $this->industry,
            'size' => $this->size,
            'founded' => $this->founded,
            'website' => $this->website,
            'headquarters' => $this->headquarters,
            'logo_url' => $this->logo_url ? url('storage/' . $this->logo_url) : null,
            'cover_image_url' => $this->cover_image_url ? url('storage/' . $this->cover_image_url) : null,
            'employees' => $this->employees,
            'followers' => $this->followers,
            'verified' => $this->verified,
            'rating' => $this->rating,
            'job_count' => $this->job_count,
            'locations' => $this->whenLoaded('locations', function() {
                return $this->locations->map(function($location) {
                    return [
                        'id' => $location->id,
                        'city' => $location->city,
                        'country' => $location->country,
                        'is_primary' => $location->is_primary,
                    ];
                });
            }),
            'specialties' => $this->whenLoaded('specialties', function() {
                return $this->specialties->pluck('specialty');
            }),
            'social_links' => $this->whenLoaded('socialLinks', function() {
                $links = [];
                foreach ($this->socialLinks as $link) {
                    $links[$link->platform] = $link->url;
                }
                return $links;
            }),
            'is_following' => $this->when(isset($this->is_following), $this->is_following),
            'is_saved' => $this->when(isset($this->is_saved), $this->is_saved),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
