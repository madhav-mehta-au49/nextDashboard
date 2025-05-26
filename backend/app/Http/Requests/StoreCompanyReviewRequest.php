<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Any authenticated user can submit a review
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
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'content' => 'required|string|min:10|max:2000',
            'relationship' => 'nullable|string|max:255',
            'is_anonymous' => 'boolean',
        ];
    }
}
