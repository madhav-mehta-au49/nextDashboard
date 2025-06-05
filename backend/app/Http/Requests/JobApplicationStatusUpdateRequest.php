<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobApplicationStatusUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization logic will be handled in the controller/service
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => 'required|string|in:pending,reviewing,interview_scheduled,interviewed,rejected,accepted,withdrawn',
            'notes' => 'nullable|string|max:2000',
            'interviewer_notes' => 'nullable|string|max:2000',
            'rejection_reason' => 'nullable|string|max:1000',
            'interview_date' => 'nullable|date|after_or_equal:today',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'status.required' => 'Status is required.',
            'status.in' => 'Invalid status value. Must be one of: pending, reviewing, interview_scheduled, interviewed, rejected, accepted, withdrawn.',
            'notes.max' => 'Notes cannot exceed 2000 characters.',
            'interviewer_notes.max' => 'Interviewer notes cannot exceed 2000 characters.',
            'rejection_reason.max' => 'Rejection reason cannot exceed 1000 characters.',
            'interview_date.after_or_equal' => 'Interview date must be today or in the future.',
        ];
    }
}