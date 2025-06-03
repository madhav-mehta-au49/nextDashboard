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
     */
    public function rules(): array
    {
        return [
            'job_listing_id' => 'required|exists:job_listings,id',
            'candidate_id' => 'required|exists:candidates,id',
            'cover_letter' => 'nullable|string|max:5000',
            'resume_url' => 'nullable|url',
            'resume_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240', // 10MB max
            'portfolio_url' => 'nullable|url',
            'expected_salary' => 'nullable|numeric|min:0',
            'salary_currency' => 'nullable|string|size:3',
            'availability_date' => 'nullable|date|after_or_equal:today',
            'notice_period' => 'nullable|integer|min:0|max:365', // days
            'willing_to_relocate' => 'boolean',
            'visa_status' => 'nullable|in:citizen,permanent_resident,work_visa,student_visa,need_sponsorship',
            'additional_notes' => 'nullable|string|max:1000',
            'referral_source' => 'nullable|string|max:100',
            'questions' => 'nullable|array',
            'questions.*.question_id' => 'required_with:questions|integer',
            'questions.*.answer' => 'required_with:questions|string|max:1000',
        ];
    }

    /**
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
            'resume_file.mimes' => 'Resume must be a PDF, DOC, or DOCX file.',
            'resume_file.max' => 'Resume file size cannot exceed 10MB.',
            'expected_salary.numeric' => 'Expected salary must be a number.',
            'expected_salary.min' => 'Expected salary must be greater than 0.',
            'availability_date.after_or_equal' => 'Availability date must be today or in the future.',
            'notice_period.max' => 'Notice period cannot exceed 365 days.',
            'visa_status.in' => 'Invalid visa status selected.',
            'additional_notes.max' => 'Additional notes cannot exceed 1000 characters.',
            'questions.*.answer.max' => 'Answer cannot exceed 1000 characters.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'willing_to_relocate' => $this->boolean('willing_to_relocate'),
        ]);
    }
}
