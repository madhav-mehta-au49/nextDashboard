<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJobListingRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'requirements' => 'nullable',
            'benefits' => 'nullable',
            'location' => 'nullable|string|max:255',
            'location_type' => 'sometimes|in:remote,hybrid,onsite',
            'job_type' => 'sometimes|in:full-time,part-time,contract,freelance,internship',
            'experience_level' => 'sometimes|in:entry,mid,senior,lead,executive',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'currency' => 'nullable|string|size:3',
            'required_skills' => 'nullable|array',
            'required_skills.*' => 'string|max:100',
            'preferred_skills' => 'nullable|array',
            'preferred_skills.*' => 'string|max:100',
            'application_deadline' => 'nullable|date|after_or_equal:today',
            'start_date' => 'nullable|date',
            'is_remote_friendly' => 'boolean',
            'featured' => 'boolean',
            'urgent' => 'boolean',
            'category_id' => 'nullable|exists:job_categories,id',
            'status' => 'sometimes|in:draft,active,published,paused,closed,expired',
            'questions' => 'nullable|array',
            'questions.*.question' => 'required_with:questions|string|max:500',
            'questions.*.required' => 'boolean',
            
            // Legacy field mappings for backward compatibility
            'type' => 'sometimes|in:full-time,part-time,contract,freelance,internship',
            'is_remote' => 'boolean',
            'salary_currency' => 'nullable|string|size:3',
            'category' => 'nullable|string|max:100',
            'skills' => 'nullable|array',
            'skills.*.id' => 'required_with:skills|exists:skills,id',
            'skills.*.is_required' => 'boolean',
            'skills.*.years_experience' => 'nullable|integer|min:0|max:50',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.string' => 'Job title must be a string.',
            'description.string' => 'Job description must be a string.',
            'type.in' => 'Job type must be one of: full-time, part-time, contract, freelance, internship.',
            'experience_level.in' => 'Experience level must be one of: entry, junior, mid, senior, lead, executive.',
            'salary_max.gte' => 'Maximum salary must be greater than or equal to minimum salary.',
            'application_deadline.after' => 'Application deadline must be in the future.',
            'skills.*.id.exists' => 'One or more selected skills do not exist.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Handle boolean fields
        $booleanFields = ['is_remote', 'is_remote_friendly', 'featured', 'urgent', 'visa_sponsorship'];
        
        foreach ($booleanFields as $field) {
            if ($this->has($field)) {
                $this->merge([$field => $this->boolean($field)]);
            }
        }
        
        // Ensure requirements and benefits are properly formatted as JSON strings
        if ($this->has('requirements')) {
            $requirements = $this->requirements;
            if (is_array($requirements)) {
                $this->merge(['requirements' => json_encode($requirements)]);
            }
        }
        
        if ($this->has('benefits')) {
            $benefits = $this->benefits;
            if (is_array($benefits)) {
                $this->merge(['benefits' => json_encode($benefits)]);
            }
        }
    }
}
