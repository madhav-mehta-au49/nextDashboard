<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;

class SavedCompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all companies
        $companies = Company::all();
        
        // Get all users
        $users = User::all();
        
        // For each user, save some companies
        foreach ($users as $user) {
            // Save 1-3 random companies
            $companiesToSave = $companies->random(rand(1, 3));
            
            foreach ($companiesToSave as $company) {
                // Check if already saved
                if (!$user->savedCompanies()->where('company_id', $company->id)->exists()) {
                    $notes = rand(0, 1) ? "Notes about {$company->name}" : null;
                    
                    $user->savedCompanies()->attach($company->id, [
                        'notes' => $notes,
                    ]);
                }
            }
        }
    }
}
