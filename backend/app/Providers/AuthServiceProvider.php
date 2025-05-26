<?php

namespace App\Providers;

use App\Models\Company;
use App\Models\CompanyReview;
use App\Models\JobListing;
use App\Models\JobApplication;
use App\Policies\CompanyPolicy;
use App\Policies\CompanyReviewPolicy;
use App\Policies\JobListingPolicy;
use App\Policies\JobApplicationPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Company::class => CompanyPolicy::class,
        CompanyReview::class => CompanyReviewPolicy::class,
        JobListing::class => JobListingPolicy::class,
        JobApplication::class => JobApplicationPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Define gates for user roles
        Gate::define('admin', function ($user) {
            return $user->isAdmin();
        });

        Gate::define('employer', function ($user) {
            return $user->isEmployer() || $user->isAdmin();
        });

        Gate::define('candidate', function ($user) {
            return $user->isCandidate() || $user->isAdmin();
        });

        Gate::define('hr', function ($user) {
            return $user->isHR() || $user->isAdmin();
        });
    }
}
