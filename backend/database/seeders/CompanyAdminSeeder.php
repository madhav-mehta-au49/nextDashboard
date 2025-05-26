<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use App\Models\CompanyAdmin;
use Illuminate\Database\Seeder;

class CompanyAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create employer users if they don't exist
        $employers = [
            [
                'name' => 'John Smith',
                'email' => 'john.smith@example.com',
                'password' => bcrypt('password'),
                'role' => 'employer',
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@example.com',
                'password' => bcrypt('password'),
                'role' => 'employer',
            ],
            [
                'name' => 'Michael Brown',
                'email' => 'michael.brown@example.com',
                'password' => bcrypt('password'),
                'role' => 'employer',
            ],
        ];

        foreach ($employers as $employer) {
            User::firstOrCreate(
                ['email' => $employer['email']],
                $employer
            );
        }

        // Assign companies to employers
        $companyAssignments = [
            'john.smith@example.com' => [
                ['company' => 'TechCorp Solutions', 'role' => 'owner'],
                ['company' => 'EduTech Innovations', 'role' => 'admin'],
            ],
            'sarah.johnson@example.com' => [
                ['company' => 'HealthPlus Medical', 'role' => 'owner'],
                ['company' => 'GreenEarth Sustainability', 'role' => 'admin'],
            ],
            'michael.brown@example.com' => [
                ['company' => 'FinanceWise Advisors', 'role' => 'owner'],
            ],
        ];

        foreach ($companyAssignments as $email => $assignments) {
            $user = User::where('email', $email)->first();
            
            if ($user) {
                foreach ($assignments as $assignment) {
                    $company = Company::where('name', $assignment['company'])->first();
                    
                    if ($company) {
                        // Check if the relationship already exists using CompanyAdmin model directly
                        $exists = CompanyAdmin::where('company_id', $company->id)
                                              ->where('user_id', $user->id)
                                              ->exists();
                        
                        if (!$exists) {
                            CompanyAdmin::create([
                                'company_id' => $company->id,
                                'user_id' => $user->id,
                                'role' => $assignment['role']
                            ]);
                        }
                    }
                }
            }
        }
    }
}
