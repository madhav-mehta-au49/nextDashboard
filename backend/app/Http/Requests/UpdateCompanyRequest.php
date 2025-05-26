<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateCompanyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $company = $this->route('company');
        $user = Auth::user();
        
        if (!$user) {
            return false;
        }
        
        // Admin can update any company
        if ($user->isAdmin()) {
            return true;
        }
        
        // Company admin can update their company
        return $user->administeredCompanies()->where('companies.id', $company->id)->exists();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $company = $this->route('company');
        
        return [
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|nullable|string|max:255|unique:companies,slug,' . $company->id,
            'description' => 'sometimes|required|string|min:100',
            'industry' => 'sometimes|required|string|max:255',
            'size' => 'sometimes|required|string|max:255',
            'founded' => 'sometimes|required|integer|min:1800|max:' . date('Y'),
            'website' => 'sometimes|required|url|max:255',
            'headquarters' => 'sometimes|required|string|max:255',
            'logo_url' => 'sometimes|nullable|string',
            'cover_image_url' => 'sometimes|nullable|string',
            'employees' => 'sometimes|required|integer|min:1',
            'locations' => 'sometimes|nullable|array',
            'locations.*.city' => 'required|string|max:255',
            'locations.*.country' => 'required|string|max:255',
            'locations.*.is_primary' => 'boolean',
            'specialties' => 'sometimes|nullable|array',
            'specialties.*' => 'string|max:255',
            'social_links' => 'sometimes|nullable|array',
            'social_links.linkedin' => 'nullable|url|max:255',
            'social_links.twitter' => 'nullable|url|max:255',
            'social_links.facebook' => 'nullable|url|max:255',
            'social_links.instagram' => 'nullable|url|max:255',
        ];
    }
}
