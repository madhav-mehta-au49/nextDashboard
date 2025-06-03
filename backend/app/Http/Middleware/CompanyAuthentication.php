<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CompanyAuthentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Authentication required'
            ], 401);
        }

        // Check if user is an employer or admin
        if (!$user->isEmployer() && !$user->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employer access required'
            ], 403);
        }        // Get user's administered companies
        $administeredCompanyIds = $user->administeredCompanies()->pluck('companies.id')->toArray();

        if (empty($administeredCompanyIds) && !$user->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No companies associated with your account'
            ], 403);
        }

        // Add company IDs to request for use in controllers
        $request->merge(['user_company_ids' => $administeredCompanyIds]);
        
        return $next($request);
    }
}
