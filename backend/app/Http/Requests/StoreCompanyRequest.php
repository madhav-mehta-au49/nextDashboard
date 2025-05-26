<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow authorized users to create companies
        return true; // Or any other authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'description' => 'required|string|min:100',
            'website' => 'required|url',
            'headquarters' => 'required|string|max:255',
            'founded' => 'required|integer|min:1800|max:' . date('Y'),
            'employees' => 'required|string',
            'logo_file' => 'nullable|image|max:2048',
            'cover_file' => 'nullable|image|max:2048',
            'specialties' => 'nullable|array',
            'specialties.*' => 'string|max:255',
            'locations' => 'nullable|array',
            'locations.*.city' => 'required|string|max:255',
            'locations.*.country' => 'required|string|max:255',
            'locations.*.is_primary' => 'boolean',
            'social_links' => 'nullable|array',
            'social_links.linkedin' => 'nullable|url',
            'social_links.twitter' => 'nullable|url',
            'social_links.facebook' => 'nullable|url',
            'social_links.instagram' => 'nullable|url',
        ];
    }
}
