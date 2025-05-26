<?php

namespace App\Services;

use App\Models\Candidate;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class CandidateService
{
    /**
     * Process and save candidate profile picture
     */
    public function processProfilePicture($pictureData, ?string $oldPicturePath = null): ?string
    {
        // If no new picture is provided, return the old one
        if (!$pictureData) {
            return $oldPicturePath;
        }
        
        // Delete old picture if it exists
        if ($oldPicturePath && Storage::disk('public')->exists($oldPicturePath)) {
            Storage::disk('public')->delete($oldPicturePath);
        }
        
        // Handle base64 encoded image
        if (is_string($pictureData) && Str::startsWith($pictureData, 'data:image')) {
            return $this->saveBase64Image($pictureData, 'profiles');
        }
        
        // Handle uploaded file
        if ($pictureData instanceof UploadedFile) {
            $filename = 'profile_' . Str::uuid() . '.' . $pictureData->getClientOriginalExtension();
            $path = $pictureData->storeAs('profiles', $filename, 'public');
            return $path;
        }
        
        // If it's just a URL or path, return it as is
        return $pictureData;
    }
    
    /**
     * Process and save candidate cover image
     */
    public function processCoverImage($coverData, ?string $oldCoverPath = null): ?string
    {
        // If no new cover is provided, return the old one
        if (!$coverData) {
            return $oldCoverPath;
        }
        
        // Delete old cover if it exists
        if ($oldCoverPath && Storage::disk('public')->exists($oldCoverPath)) {
            Storage::disk('public')->delete($oldCoverPath);
        }
        
        // Handle base64 encoded image
        if (is_string($coverData) && Str::startsWith($coverData, 'data:image')) {
            return $this->saveBase64Image($coverData, 'covers');
        }
        
        // Handle uploaded file
        if ($coverData instanceof UploadedFile) {
            $filename = 'cover_' . Str::uuid() . '.' . $coverData->getClientOriginalExtension();
            $path = $coverData->storeAs('covers', $filename, 'public');
            return $path;
        }
        
        // If it's just a URL or path, return it as is
        return $coverData;
    }
    
    /**
     * Process and save candidate resume
     */
    public function processResume($resumeData, ?string $oldResumePath = null): ?string
    {
        // If no new resume is provided, return the old one
        if (!$resumeData) {
            return $oldResumePath;
        }
        
        // Delete old resume if it exists
        if ($oldResumePath && Storage::disk('public')->exists($oldResumePath)) {
            Storage::disk('public')->delete($oldResumePath);
        }
        
        // Handle uploaded file
        if ($resumeData instanceof UploadedFile) {
            // Validate file type
            $allowedExtensions = ['pdf', 'doc', 'docx'];
            $extension = $resumeData->getClientOriginalExtension();
            
            if (!in_array(strtolower($extension), $allowedExtensions)) {
                throw new \InvalidArgumentException('Invalid resume file type. Only PDF, DOC, and DOCX files are allowed.');
            }
            
            $filename = 'resume_' . Str::uuid() . '.' . $extension;
            $path = $resumeData->storeAs('resumes', $filename, 'public');
            return $path;
        }
        
        // If it's just a URL or path, return it as is
        return $resumeData;
    }
    
    /**
     * Save a base64 image and return the path
     */
    private function saveBase64Image(string $base64Image, string $directory): string
    {
        // Extract the image data from the base64 string
        $image = explode(',', $base64Image)[1];
        $decodedImage = base64_decode($image);
        
        // Determine file extension from base64 header
        $extension = 'png'; // default
        if (Str::contains($base64Image, 'data:image/jpeg')) {
            $extension = 'jpg';
        } elseif (Str::contains($base64Image, 'data:image/png')) {
            $extension = 'png';
        } elseif (Str::contains($base64Image, 'data:image/gif')) {
            $extension = 'gif';
        }
        
        // Generate a unique filename
        $filename = Str::uuid() . '.' . $extension;
        
        // Save the image to storage
        $path = $directory . '/' . $filename;
        Storage::disk('public')->put($path, $decodedImage);
        
        return $path;
    }
    
    /**
     * Get full URL for file path
     */
    public function getFileUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }
        
        // If it's already a full URL, return as is
        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }
        
        // Generate storage URL
        return Storage::disk('public')->url($path);
    }
    
    /**
     * Delete file from storage
     */
    public function deleteFile(?string $path): bool
    {
        if (!$path || !Storage::disk('public')->exists($path)) {
            return false;
        }
        
        return Storage::disk('public')->delete($path);
    }
    
    /**
     * Calculate profile completion percentage
     */
    public function calculateProfileCompletion(Candidate $candidate): int
    {
        $completionItems = [
            'name' => !empty($candidate->name),
            'headline' => !empty($candidate->headline),
            'about' => !empty($candidate->about),
            'email' => !empty($candidate->email),
            'phone' => !empty($candidate->phone),
            'location' => !empty($candidate->location),
            'profile_picture' => !empty($candidate->profile_picture),
            'resume_url' => !empty($candidate->resume_url),
            'has_experience' => $candidate->experiences()->count() > 0,
            'has_education' => $candidate->educations()->count() > 0,
            'has_skills' => $candidate->skills()->count() > 0,
        ];
        
        $completedItems = array_filter($completionItems);
        $totalItems = count($completionItems);
        
        return $totalItems > 0 ? round((count($completedItems) / $totalItems) * 100) : 0;
    }
}
