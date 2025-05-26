<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyReview;
use App\Models\User;
use Illuminate\Database\Seeder;

class CompanyReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all companies
        $companies = Company::all();
        
        // Get candidate users
        $users = User::where('role', 'candidate')->get();
        
        // If we don't have enough users, create some
        if ($users->count() < 3) {
            // Create some candidate users
            $newUsers = [
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

            foreach ($newUsers as $userData) {
                User::firstOrCreate(
                    ['email' => $userData['email']],
                    $userData
                );
            }
            
            // Refresh the users collection
            $users = User::where('role', 'candidate')->get();
        }
        
        // Relationships
        $relationships = ['Current Employee', 'Former Employee', 'Interviewed', 'Contractor'];
        
        // Review titles
        $positiveTitles = [
            'Great place to work',
            'Excellent company culture',
            'Highly recommend',
            'Amazing growth opportunities',
            'Supportive management',
        ];
        
        $neutralTitles = [
            'Decent workplace',
            'Good but has room for improvement',
            'Mixed experience',
            'Average company',
            'Okay work environment',
        ];
        
        $negativeTitles = [
            'Disappointing experience',
            'Poor management',
            'Toxic work environment',
            'Not recommended',
            'High turnover rate',
        ];
        
        // Review content templates
        $positiveContent = 'I had a wonderful experience at %s. The company offers %s and has a great culture that emphasizes %s. Management is %s and the work-life balance is %s. Would definitely recommend to others looking for opportunities in this field.';
        
        $neutralContent = 'My experience at %s was mixed. On the positive side, %s. However, %s could use improvement. The company has potential but needs to address issues with %s. Work-life balance is %s.';
        
        $negativeContent = 'Unfortunately, my time at %s was not positive. The company struggles with %s and the culture is %s. Management is %s and work-life balance is %s. I would not recommend this company to others.';
        
        // Positive attributes
        $positiveAttributes = [
            'competitive salaries',
            'excellent benefits',
            'flexible working hours',
            'remote work options',
            'professional development opportunities',
        ];
        
        $culturePros = [
            'teamwork',
            'innovation',
            'diversity and inclusion',
            'employee well-being',
            'social responsibility',
        ];
        
        $managementPros = [
            'supportive',
            'transparent',
            'approachable',
            'empowering',
            'visionary',
        ];
        
        $workLifeBalancePros = [
            'excellent',
            'well-maintained',
            'prioritized',
            'respected',
            'healthy',
        ];
        
        // Negative attributes
        $negativeAttributes = [
            'poor communication',
            'inadequate compensation',
            'limited growth opportunities',
            'outdated technology',
            'excessive workload',
        ];
        
        $cultureCons = [
            'toxic',
            'competitive in an unhealthy way',
            'lacking diversity',
            'resistant to change',
            'overly political',
        ];
        
        $managementCons = [
            'disconnected',
            'micromanaging',
            'inconsistent',
            'playing favorites',
            'lacking vision',
        ];
        
        $workLifeBalanceCons = [
            'poor',
            'non-existent',
            'not respected',
            'all talk but no action',
            'deteriorating',
        ];
        
        // For each company, create 3-8 reviews
        foreach ($companies as $company) {
            // Determine how many reviews to create (but not more than the number of users)
            $reviewCount = min(rand(3, 8), $users->count());
            
            // Get random users for reviews
            $reviewers = $users->random($reviewCount);
            
            foreach ($reviewers as $user) {
                // Check if user already reviewed this company
                if (CompanyReview::where('company_id', $company->id)
                    ->where('user_id', $user->id)
                    ->exists()) {
                    continue;
                }
                
                // Determine rating (1-5)
                $rating = rand(1, 5);
                
                // Set title and content based on rating
                if ($rating >= 4) {
                    $title = $positiveTitles[array_rand($positiveTitles)];
                    $content = sprintf(
                        $positiveContent,
                        $company->name,
                        $positiveAttributes[array_rand($positiveAttributes)],
                        $culturePros[array_rand($culturePros)],
                        $managementPros[array_rand($managementPros)],
                        $workLifeBalancePros[array_rand($workLifeBalancePros)]
                    );
                } elseif ($rating >= 3) {
                    $title = $neutralTitles[array_rand($neutralTitles)];
                    $content = sprintf(
                        $neutralContent,
                        $company->name,
                        $positiveAttributes[array_rand($positiveAttributes)],
                        $negativeAttributes[array_rand($negativeAttributes)],
                        $managementCons[array_rand($managementCons)],
                        $workLifeBalancePros[array_rand($workLifeBalancePros)]
                    );
                } else {
                    $title = $negativeTitles[array_rand($negativeTitles)];
                    $content = sprintf(
                        $negativeContent,
                        $company->name,
                        $negativeAttributes[array_rand($negativeAttributes)],
                        $cultureCons[array_rand($cultureCons)],
                        $managementCons[array_rand($managementCons)],
                        $workLifeBalanceCons[array_rand($workLifeBalanceCons)]
                    );
                }
                
                // Create the review
                CompanyReview::create([
                    'company_id' => $company->id,
                    'user_id' => $user->id,
                    'rating' => $rating,
                    'title' => $title,
                    'content' => $content,
                    'relationship' => $relationships[array_rand($relationships)],
                    'is_anonymous' => (bool)rand(0, 1),
                    'is_approved' => true, // All reviews are pre-approved for testing
                ]);
            }
            
            // Update company rating based on reviews
            $avgRating = CompanyReview::where('company_id', $company->id)->avg('rating');
            if ($avgRating) {
                $company->rating = round($avgRating, 2);
                $company->save();
            }
        }
    }
}
