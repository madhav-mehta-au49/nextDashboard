<?php

namespace App\Policies;

use App\Models\CompanyReview;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CompanyReviewPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true; // Anyone can view company reviews
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, CompanyReview $companyReview): bool
    {
        // If the review is approved, anyone can view it
        if ($companyReview->is_approved) {
            return true;
        }
        
        // If not approved, only the author or an admin can view it
        if (!$user) {
            return false;
        }
        
        return $user->id === $companyReview->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user can create a review
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CompanyReview $companyReview): bool
    {
        return $user->id === $companyReview->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CompanyReview $companyReview): bool
    {
        return $user->id === $companyReview->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CompanyReview $companyReview): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CompanyReview $companyReview): bool
    {
        return $user->isAdmin();
    }
    
    /**
     * Determine whether the user can approve the model.
     */
    public function approve(User $user, CompanyReview $companyReview): bool
    {
        return $user->isAdmin();
    }
}
