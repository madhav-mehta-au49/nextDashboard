<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCandidateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Handle JSON strings for arrays when FormData is used (BEFORE validation)
        $jsonFields = ['experiences', 'educations', 'skills', 'certifications'];
        $mergeData = [];
        
        foreach ($jsonFields as $field) {
            if ($this->has($field) && is_string($this->$field)) {
                $decoded = json_decode($this->$field, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $mergeData[$field] = $decoded;
                }
            }
        }
        
        if (!empty($mergeData)) {
            $this->merge($mergeData);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:candidates,slug,' . $this->route('candidate')->id,
            'headline' => 'nullable|string|max:255',
            'about' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'email' => 'sometimes|string|email|max:255',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|string|max:255|url',
            'user_id' => 'sometimes|exists:users,id',
            'availability' => 'nullable|string|in:Actively looking,Open to opportunities,Not actively looking',
            'resume_url' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|string|max:10485760', // 10MB in base64 characters
            'cover_image' => 'nullable|string|max:10485760', // 10MB in base64 characters
            'connections' => 'nullable|integer',
            'desired_job_title' => 'nullable|string|max:255',
            'desired_salary' => 'nullable|numeric',
            'desired_location' => 'nullable|string|max:255',
            'work_type_preference' => 'nullable|string|in:remote,onsite,hybrid,flexible',
            'visibility' => 'nullable|string|in:public,private,connections',
            'profile_completed_percentage' => 'nullable|integer|min:0|max:100',
            'portfolio_url' => 'nullable|string|max:255|url',
            
            // Experience validation
            'experiences' => 'sometimes|array',
            'experiences.*.id' => 'sometimes|integer|exists:experiences,id',
            'experiences.*.title' => 'required_with:experiences|string|max:255',
            'experiences.*.company' => 'required_with:experiences|string|max:255',
            'experiences.*.company_name' => 'nullable|string|max:255',
            'experiences.*.location' => 'nullable|string|max:255',
            'experiences.*.employment_type' => 'nullable|string|max:255',
            'experiences.*.start_date' => 'required_with:experiences|date',
            'experiences.*.end_date' => 'nullable|date|after_or_equal:experiences.*.start_date',
            'experiences.*.current' => 'boolean',
            'experiences.*.description' => 'nullable|string',
            
            // Education validation
            'educations' => 'sometimes|array',
            'educations.*.id' => 'sometimes|integer|exists:educations,id',
            'educations.*.institution' => 'required_with:educations|string|max:255',
            'educations.*.degree' => 'required_with:educations|string|max:255',
            'educations.*.field_of_study' => 'nullable|string|max:255',
            'educations.*.start_date' => 'required_with:educations|date',
            'educations.*.end_date' => 'nullable|date|after_or_equal:educations.*.start_date',
            'educations.*.current' => 'boolean',
            'educations.*.description' => 'nullable|string',
            'educations.*.grade' => 'nullable|string|max:50',
            'educations.*.activities' => 'nullable|string',
            
            // Certification validation
            'certifications' => 'sometimes|array',
            'certifications.*.id' => 'sometimes|integer|exists:certifications,id',
            'certifications.*.name' => 'required_with:certifications|string|max:255',
            'certifications.*.issuing_organization' => 'required_with:certifications|string|max:255',
            'certifications.*.issue_date' => 'required_with:certifications|date',
            'certifications.*.expiration_date' => 'nullable|date|after_or_equal:certifications.*.issue_date',
            'certifications.*.credential_id' => 'nullable|string|max:255',
            'certifications.*.credential_url' => 'nullable|string|max:255|url',
            
            // Skill validation
            'skills' => 'sometimes|array',
            'skills.*.id' => 'sometimes|integer|exists:skills,id',
            'skills.*.name' => 'required_with:skills|string|max:255',
            
            // Certification file validation (support both formats from FormData)
            'certification_files' => 'sometimes|array',
            'certification_files.*' => 'sometimes|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240', // 10MB max
            
            // Also support bracket notation for FormData
            'certification_files.0' => 'sometimes|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
            'certification_files.1' => 'sometimes|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
            'certification_files.2' => 'sometimes|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
            'certification_files.3' => 'sometimes|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
            'certification_files.4' => 'sometimes|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
        ];
    }
    
    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'user_id' => 'user',
            'resume_url' => 'resume',
            'work_type_preference' => 'work type preference',
            'profile_completed_percentage' => 'profile completion percentage',
            'portfolio_url' => 'portfolio URL',
        ];
    }
    
    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'user_id.exists' => 'The selected user does not exist',
            'availability.in' => 'The availability must be one of: Actively looking, Open to opportunities, or Not actively looking',
            'work_type_preference.in' => 'The work type preference must be one of: remote, onsite, hybrid, or flexible',
            'desired_salary.numeric' => 'The desired salary must be a number',
            'portfolio_url.url' => 'The portfolio URL must be a valid URL',
            'profile_completed_percentage.min' => 'The profile completion percentage cannot be less than 0',
            'profile_completed_percentage.max' => 'The profile completion percentage cannot be greater than 100',
        ];
    }
}
