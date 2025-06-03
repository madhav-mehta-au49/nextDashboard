<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobSearchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'is_remote' => 'nullable|boolean',
            'type' => 'nullable|array',
            'type.*' => 'in:full-time,part-time,contract,freelance,internship',
            'experience_level' => 'nullable|array',
            'experience_level.*' => 'in:entry,junior,mid,senior,lead,executive',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'salary_currency' => 'nullable|string|size:3',
            'company_id' => 'nullable|exists:companies,id',
            'category' => 'nullable|array',
            'category.*' => 'string|max:100',
            'skills' => 'nullable|array',
            'skills.*' => 'exists:skills,id',
            'education_level' => 'nullable|array',
            'education_level.*' => 'in:high_school,associate,bachelor,master,phd',
            'visa_sponsorship' => 'nullable|boolean',
            'posted_within' => 'nullable|in:1,7,14,30,90', // days
            'sort_by' => 'nullable|in:relevance,date,salary_high,salary_low,company',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'radius' => 'nullable|integer|min:1|max:500', // km
            'lat' => 'nullable|numeric|between:-90,90',
            'lng' => 'nullable|numeric|between:-180,180',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'search.max' => 'Search query cannot exceed 255 characters.',
            'location.max' => 'Location cannot exceed 255 characters.',
            'type.*.in' => 'Invalid job type selected.',
            'experience_level.*.in' => 'Invalid experience level selected.',
            'salary_min.min' => 'Minimum salary must be greater than 0.',
            'salary_max.min' => 'Maximum salary must be greater than 0.',
            'company_id.exists' => 'Selected company does not exist.',
            'skills.*.exists' => 'One or more selected skills do not exist.',
            'education_level.*.in' => 'Invalid education level selected.',
            'posted_within.in' => 'Posted within must be 1, 7, 14, 30, or 90 days.',
            'sort_by.in' => 'Invalid sort option selected.',
            'per_page.max' => 'Cannot request more than 100 items per page.',
            'radius.max' => 'Search radius cannot exceed 500 km.',
            'lat.between' => 'Latitude must be between -90 and 90.',
            'lng.between' => 'Longitude must be between -180 and 180.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('is_remote')) {
            $this->merge(['is_remote' => $this->boolean('is_remote')]);
        }
        
        if ($this->has('visa_sponsorship')) {
            $this->merge(['visa_sponsorship' => $this->boolean('visa_sponsorship')]);
        }

        // Set defaults
        $this->merge([
            'sort_by' => $this->input('sort_by', 'relevance'),
            'page' => $this->input('page', 1),
            'per_page' => $this->input('per_page', 20),
        ]);
    }
}
