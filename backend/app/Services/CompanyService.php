<?php

namespace App\Services;

use App\Models\Company;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class CompanyService
{
    /**
     * Process and save company logo
     */
    public function processLogo($logoData, ?string $oldLogoPath = null): ?string
    {
        // If no new logo is provided, return the old one
        if (!$logoData) {
            return $oldLogoPath;
        }
        
        // Delete old logo if it exists
        if ($oldLogoPath && Storage::exists($oldLogoPath)) {
            Storage::delete($oldLogoPath);
        }
        
        // Handle base64 encoded image
        if (is_string($logoData) && Str::startsWith($logoData, 'data:image')) {
            return $this->saveBase64Image($logoData, 'company-logos');
        }
        
        // Handle uploaded file
        if ($logoData instanceof UploadedFile) {
            $path = $logoData->store('company-logos');
            return $path;
        }
        
        // If it's just a URL or path, return it as is
        return $logoData;
    }
    
    /**
     * Process and save company cover image
     */
    public function processCoverImage($coverData, ?string $oldCoverPath = null): ?string
    {
        // If no new cover is provided, return the old one
        if (!$coverData) {
            return $oldCoverPath;
        }
        
        // Delete old cover if it exists
        if ($oldCoverPath && Storage::exists($oldCoverPath)) {
            Storage::delete($oldCoverPath);
        }
        
        // Handle base64 encoded image
        if (is_string($coverData) && Str::startsWith($coverData, 'data:image')) {
            return $this->saveBase64Image($coverData, 'company-covers');
        }
        
        // Handle uploaded file
        if ($coverData instanceof UploadedFile) {
            $path = $coverData->store('company-covers');
            return $path;
        }
        
        // If it's just a URL or path, return it as is
        return $coverData;
    }
    
    /**
     * Save a base64 image and return the path
     */
    private function saveBase64Image(string $base64Image, string $directory): string
    {
        // Extract the image data from the base64 string
        $image = explode(',', $base64Image)[1];
        $decodedImage = base64_decode($image);
        
        // Generate a unique filename
        $filename = Str::uuid() . '.png';
        
        // Save the image to storage
        $path = $directory . '/' . $filename;
        Storage::put($path, $decodedImage);
        
        return $path;
    }
    
    /**
     * Update company locations
     */
    public function updateLocations(Company $company, array $locations): void
    {
        $company->locations()->delete();
        
        foreach ($locations as $location) {
            $company->locations()->create([
                'city' => $location['city'],
                'country' => $location['country'],
                'is_primary' => $location['is_primary'] ?? false
            ]);
        }
    }
    
    /**
     * Update company specialties
     */
    public function updateSpecialties(Company $company, array $specialties): void
    {
        $company->specialties()->delete();
        
        foreach ($specialties as $specialty) {
            $company->specialties()->create(['specialty' => $specialty]);
        }
    }
    
    /**
     * Update company social links
     */
    public function updateSocialLinks(Company $company, array $socialLinks): void
    {
        $company->socialLinks()->delete();
        
        foreach ($socialLinks as $platform => $url) {
            if (!empty($url)) {
                $company->socialLinks()->create([
                    'platform' => $platform,
                    'url' => $url
                ]);
            }
        }
    }
    
    /**
     * Get similar companies
     */
    public function getSimilarCompanies(Company $company, int $limit = 5): object
    {
        return Company::where('id', '!=', $company->id)
            ->where('industry', $company->industry)
            ->with(['locations', 'specialties'])
            ->limit($limit)
            ->get();
    }
}
