<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        \App\Models\User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );
        
        $this->call([
            CompanySeeder::class,
            CompanyLocationSeeder::class,
            CompanySpecialtySeeder::class,
            CompanySocialLinkSeeder::class,
            CompanyAdminSeeder::class,
            CompanyFollowerSeeder::class,
            CompanyReviewSeeder::class,
            SavedCompanySeeder::class,
            CandidateSeeder::class, // Add the CandidateSeeder
        ]);
    }
}
