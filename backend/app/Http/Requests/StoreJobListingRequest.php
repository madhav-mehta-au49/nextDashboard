<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobListingRequest extends FormRequest
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
            'company_id' => 'required|exists:companies,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'is_remote' => 'boolean',
            'type' => 'required|in:full-time,part-time,contract,freelance,internship',
            'experience_level' => 'required|in:entry,junior,mid,senior,lead,executive',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'salary_currency' => 'nullable|string|size:3',
            'application_deadline' => 'nullable|date|after:today',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'department' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:100',
            'skills' => 'nullable|array',
            'skills.*.id' => 'required_with:skills|exists:skills,id',
            'skills.*.is_required' => 'boolean',
            'skills.*.years_experience' => 'nullable|integer|min:0|max:50',
            'education_level' => 'nullable|in:high_school,associate,bachelor,master,phd',
            'languages' => 'nullable|array',
            'languages.*' => 'string|max:50',
            'work_schedule' => 'nullable|string|max:255',
            'travel_requirement' => 'nullable|string|max:255',
            'security_clearance' => 'nullable|string|max:100',
            'visa_sponsorship' => 'boolean',
            'status' => 'in:draft,active,paused,closed',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'company_id.required' => 'Company is required.',
            'company_id.exists' => 'Selected company does not exist.',
            'title.required' => 'Job title is required.',
            'description.required' => 'Job description is required.',
            'type.required' => 'Job type is required.',
            'type.in' => 'Job type must be one of: full-time, part-time, contract, freelance, internship.',
            'experience_level.required' => 'Experience level is required.',
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
        $this->merge([
            'is_remote' => $this->boolean('is_remote'),
            'visa_sponsorship' => $this->boolean('visa_sponsorship'),
            'status' => $this->input('status', 'draft'),
        ]);
    }
}
