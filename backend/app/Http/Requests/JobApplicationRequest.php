<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Add proper authorization logic here
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */    public function rules(): array
    {
        return [
            // Required fields
            'job_listing_id' => 'required|exists:job_listings,id',
            
            // Personal Information
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'current_location' => 'required|string|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'portfolio_url' => 'nullable|url|max:255',
            
            // Professional Details
            'current_job_title' => 'required|string|max:255',
            'current_company' => 'required|string|max:255',
            'total_experience' => 'nullable|string|max:50', // String to accept ranges like "1-3"
            'relevant_experience' => 'nullable|string|max:50',
            
            // Salary & Availability
            'current_salary' => 'nullable|numeric|min:0',
            'salary_expectation' => 'nullable|numeric|min:0',
            'expected_salary' => 'nullable|numeric|min:0', // Alternative field name
            'salary_currency' => 'nullable|string|size:3',
            'availability_date' => 'nullable|date|after_or_equal:today',
            'notice_period' => 'nullable|string', // Changed from 'integer' to 'string' to accept "immediate" etc.
            'work_type_preference' => 'nullable|string|in:remote,hybrid,onsite',
            'willing_to_relocate' => 'boolean',
            
            // Skills & Motivation
            'motivation_letter' => 'nullable|string|max:5000',
            'cover_letter' => 'nullable|string|max:5000', // Alternative field name
            'key_strengths' => 'nullable|array',
            'key_strengths.*' => 'string|max:255',
            
            // Documents
            'resume_url' => 'nullable|string', // Changed from 'url' to 'string' to accept filenames
            'resume_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240', // 10MB max
            'portfolio_url' => 'nullable|url',
            
            // Additional fields
            'candidate_id' => 'sometimes|exists:candidates,id', // Will be added by controller
            'visa_status' => 'nullable|in:citizen,permanent_resident,work_visa,student_visa,need_sponsorship',
            'additional_notes' => 'nullable|string|max:1000',
            'referral_source' => 'nullable|string|max:100',
            
            // Questions/Answers
            'questions' => 'nullable|array',
            'questions.*.question_id' => 'required_with:questions|integer',
            'questions.*.answer' => 'required_with:questions|string|max:1000',
            'answers' => 'nullable|array', // Frontend field name
            'answers.*.question_id' => 'required_with:answers|integer',
            'answers.*.answer' => 'required_with:answers|string|max:1000',
        ];
    }/**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'job_listing_id.required' => 'Job listing is required.',
            'job_listing_id.exists' => 'Selected job listing does not exist.',
            'candidate_id.required' => 'Candidate is required.',
            'candidate_id.exists' => 'Selected candidate does not exist.',
            'cover_letter.max' => 'Cover letter cannot exceed 5000 characters.',
            'resume_url.string' => 'Resume URL must be a valid string.',
            'resume_file.mimes' => 'Resume must be a PDF, DOC, or DOCX file.',
            'resume_file.max' => 'Resume file size cannot exceed 10MB.',
            'expected_salary.numeric' => 'Expected salary must be a number.',
            'expected_salary.min' => 'Expected salary must be greater than 0.',
            'availability_date.after_or_equal' => 'Availability date must be today or in the future.',
            'notice_period.string' => 'Notice period must be a valid value.',
            'visa_status.in' => 'Invalid visa status selected.',
            'additional_notes.max' => 'Additional notes cannot exceed 1000 characters.',
            'questions.*.answer.max' => 'Answer cannot exceed 1000 characters.',
        ];
    }    /**
     * Prepare the data for validation.
     */    protected function prepareForValidation(): void
    {
        // Transform data for field name mapping
        $this->transformData();
        
        // Handle key_strengths field
        if ($this->has('key_strengths')) {
            $keyStrengths = $this->input('key_strengths');
            $decodedStrengths = [];

            // If it's already an array from FormData (key_strengths[0], key_strengths[1], etc)
            if (is_array($keyStrengths)) {
                $decodedStrengths = array_values($keyStrengths);
            }
            // If it's a JSON string
            elseif (is_string($keyStrengths)) {
                $decoded = json_decode($keyStrengths, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $decodedStrengths = $decoded;
                } else {
                    // Split by comma if it contains commas, otherwise make it a single item array
                    $decodedStrengths = str_contains($keyStrengths, ',') 
                        ? array_map('trim', explode(',', $keyStrengths))
                        : [$keyStrengths];
                }
            }
            
            // Filter out empty values and reindex array
            $decodedStrengths = array_values(array_filter($decodedStrengths, function($value) {
                return !empty(trim($value));
            }));

            // Add detailed logging
            \Log::debug('Key Strengths Processing', [
                'raw_input' => $keyStrengths,
                'processed_array' => $decodedStrengths,
                'request_content_type' => $this->header('Content-Type')
            ]);
            
            // Update the key_strengths value
            $this->merge(['key_strengths' => $decodedStrengths]);
        }

        // Handle other array fields (questions/answers)
        $jsonFields = ['questions', 'answers'];
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
        }        // Debug log the prepared data
        \Log::debug('Prepared Data', [
            'key_strengths' => $this->input('key_strengths'),
            'input_data' => $this->all()
        ]);
    }

    /**
     * Transform the request data before validation
     */
    protected function transformData(): void
    {
        $data = [];
        
        // Log all input data for debugging
        \Log::debug('Job Application Raw Input', [
            'all_input' => $this->all(),
            'method' => $this->method(),
            'url' => $this->fullUrl()
        ]);
        
        // Map frontend field names to backend field names
        if ($this->has('salary_expectation')) {
            $data['expected_salary'] = $this->input('salary_expectation');
        }
        
        // Map answers to questions format
        if ($this->has('answers')) {
            $data['questions'] = $this->input('answers');
        }
          // Handle willing_to_relocate conversion
        if ($this->has('willing_to_relocate')) {
            $value = $this->input('willing_to_relocate');
            if (is_string($value)) {
                // Convert string values to boolean
                $data['willing_to_relocate'] = in_array(strtolower($value), ['true', 'yes', '1', 'depends'], true);
            } else {
                $data['willing_to_relocate'] = $this->boolean('willing_to_relocate');
            }
        }
        
        // Handle notice period conversion - convert strings like "immediate" to appropriate values
        if ($this->has('notice_period')) {
            $noticePeriod = $this->input('notice_period');
            if (is_string($noticePeriod)) {
                // Keep as string - we'll handle the business logic in the service layer
                $data['notice_period'] = $noticePeriod;
            }
        }
          // Handle resume URL - if it's just a filename, keep it as is for now
        if ($this->has('resume_url')) {
            $resumeUrl = $this->input('resume_url');
            if (is_string($resumeUrl)) {
                $data['resume_url'] = $resumeUrl;
            }
        }
        
        // Handle total experience - ensure it's processed as a string
        if ($this->has('total_experience')) {
            $totalExperience = $this->input('total_experience');
            // Keep the original string value
            $data['total_experience'] = $totalExperience;
            
            // Log the value for debugging
            \Log::debug('Total Experience Value', [
                'value' => $totalExperience,
                'type' => gettype($totalExperience)
            ]);
        }
        
        $this->merge($data);
    }
    
    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        \Log::error('Job Application Validation Failed', [
            'errors' => $validator->errors()->toArray(),
            'input_data' => $this->all(),
            'rules' => $this->rules(),
            'url' => $this->fullUrl(),
            'method' => $this->method()
        ]);
        
        parent::failedValidation($validator);
    }
}
