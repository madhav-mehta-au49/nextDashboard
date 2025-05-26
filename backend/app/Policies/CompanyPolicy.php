<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CompanyPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Anyone can view companies
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Company $company): bool
    {
        return true; // Anyone can view a company
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isEmployer() || $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Company $company): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        
        return $user->administeredCompanies()->where('companies.id', $company->id)->exists();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Company $company): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        
        return $user->administeredCompanies()
            ->where('companies.id', $company->id)
            ->wherePivot('role', 'owner')
            ->exists();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Company $company): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Company $company): bool
    {
        return $user->isAdmin();
    }
}
