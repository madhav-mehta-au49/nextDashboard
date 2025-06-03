<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobListingResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'location' => $this->location,
            'is_remote' => $this->is_remote,
            'type' => $this->type,
            'experience_level' => $this->experience_level,
            'salary' => [
                'min' => $this->salary_min,
                'max' => $this->salary_max,
                'currency' => $this->salary_currency,
                'display' => $this->formatSalaryRange(),
            ],
            'requirements' => $this->requirements,
            'benefits' => $this->benefits,
            'department' => $this->department,
            'category' => $this->category,
            'education_level' => $this->education_level,
            'work_schedule' => $this->work_schedule,
            'travel_requirement' => $this->travel_requirement,
            'security_clearance' => $this->security_clearance,
            'visa_sponsorship' => $this->visa_sponsorship,
            'status' => $this->status,
            'posted_date' => $this->posted_date?->format('Y-m-d'),
            'application_deadline' => $this->application_deadline?->format('Y-m-d'),
            'applicants_count' => $this->applicants_count,
            'views_count' => $this->views_count,
            'company' => new CompanyResource($this->whenLoaded('company')),
            'skills' => SkillResource::collection($this->whenLoaded('skills')),
            'applications' => JobApplicationResource::collection($this->whenLoaded('applications')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
              // Computed fields
            'days_since_posted' => $this->posted_date?->diffInDays(now()),
            'is_expired' => $this->application_deadline && $this->application_deadline->isPast(),
            'urgency_level' => $this->getUrgencyLevel(),
            'application_url' => url("/api/job-applications?job_listing_id={$this->id}"),
            'share_url' => url("/jobs/{$this->id}"),
            
            // SEO fields
            'slug' => $this->generateSlug(),
            'meta_title' => $this->generateMetaTitle(),
            'meta_description' => $this->generateMetaDescription(),
        ];
    }

    /**
     * Format salary range for display
     */
    private function formatSalaryRange(): ?string
    {
        if (!$this->salary_min && !$this->salary_max) {
            return null;
        }

        $currency = $this->salary_currency ?? 'USD';
        $symbol = $this->getCurrencySymbol($currency);

        if ($this->salary_min && $this->salary_max) {
            return "{$symbol}{$this->formatNumber($this->salary_min)} - {$symbol}{$this->formatNumber($this->salary_max)}";
        } elseif ($this->salary_min) {
            return "From {$symbol}{$this->formatNumber($this->salary_min)}";
        } else {
            return "Up to {$symbol}{$this->formatNumber($this->salary_max)}";
        }
    }

    /**
     * Get currency symbol
     */
    private function getCurrencySymbol(string $currency): string
    {
        $symbols = [
            'USD' => '$',
            'EUR' => '€',
            'GBP' => '£',
            'INR' => '₹',
            'CAD' => 'C$',
            'AUD' => 'A$',
        ];

        return $symbols[$currency] ?? $currency . ' ';
    }

    /**
     * Format number for display
     */
    private function formatNumber(float $number): string
    {
        if ($number >= 1000000) {
            return number_format($number / 1000000, 1) . 'M';
        } elseif ($number >= 1000) {
            return number_format($number / 1000, 0) . 'K';
        }

        return number_format($number, 0);
    }

    /**
     * Get urgency level based on application deadline
     */
    private function getUrgencyLevel(): string
    {
        if (!$this->application_deadline) {
            return 'low';
        }

        $daysUntilDeadline = now()->diffInDays($this->application_deadline, false);

        if ($daysUntilDeadline < 0) {
            return 'expired';
        } elseif ($daysUntilDeadline <= 3) {
            return 'high';
        } elseif ($daysUntilDeadline <= 7) {
            return 'medium';
        }

        return 'low';
    }

    /**
     * Generate SEO-friendly slug
     */
    private function generateSlug(): string
    {
        $slug = strtolower($this->title);
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/\s+/', '-', $slug);
        $slug = trim($slug, '-');
        
        return $slug . '-' . $this->id;
    }

    /**
     * Generate meta title for SEO
     */
    private function generateMetaTitle(): string
    {
        $company = $this->company?->name ?? 'Company';
        return "{$this->title} at {$company} | Job Portal";
    }

    /**
     * Generate meta description for SEO
     */
    private function generateMetaDescription(): string
    {
        $company = $this->company?->name ?? 'a leading company';
        $location = $this->is_remote ? 'Remote' : ($this->location ?? 'Multiple locations');
        
        $description = "Join {$company} as a {$this->title} in {$location}. ";
        
        if ($this->salary_min || $this->salary_max) {
            $description .= "Competitive salary: " . $this->formatSalaryRange() . ". ";
        }
        
        $description .= "Apply now and advance your career!";
        
        return substr($description, 0, 160);
    }
}
