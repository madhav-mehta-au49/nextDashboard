<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;

class CompanyFollowerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create candidate users if they don't exist
        $candidates = [
            [
                'name' => 'Alex Wilson',
                'email' => 'alex.wilson@example.com',
                'password' => bcrypt('password'),
                'role' => 'candidate',
            ],
            [
                'name' => 'Emily Davis',
                'email' => 'emily.davis@example.com',
                'password' => bcrypt('password'),
                'role' => 'candidate',
            ],
            [
                'name' => 'David Lee',
                'email' => 'david.lee@example.com',
                'password' => bcrypt('password'),
                'role' => 'candidate',
            ],
            [
                'name' => 'Jessica Taylor',
                'email' => 'jessica.taylor@example.com',
                'password' => bcrypt('password'),
                'role' => 'candidate',
            ],
        ];

        foreach ($candidates as $candidate) {
            User::firstOrCreate(
                ['email' => $candidate['email']],
                $candidate
            );
        }

        // Get all companies
        $companies = Company::all();
        
        // Get candidate users
        $candidateUsers = User::where('role', 'candidate')->get();
        
        // Relationships
        $relationships = ['interested', 'applied', 'interviewed', 'hired', 'former_employee'];
        
        // For each candidate, follow some companies
        foreach ($candidateUsers as $user) {
            // Follow 2-4 random companies
            $companiesToFollow = $companies->random(rand(2, 4));
            
            foreach ($companiesToFollow as $company) {
                // Check if already following
                if (!$user->followedCompanies()->where('company_id', $company->id)->exists()) {
                    $relationship = $relationships[array_rand($relationships)];
                    $notes = "Notes about {$company->name}";
                    
                    $user->followedCompanies()->attach($company->id, [
                        'is_candidate' => true,
                        'relationship' => $relationship,
                        'notes' => $notes,
                    ]);
                    
                    // Update the followers count for the company
                    $company->increment('followers');
                }
            }
        }
    }
}
