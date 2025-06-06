<?php

namespace Database\Seeders;

use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\Candidate;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Str;

class JobApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Using the exact data provided in the user prompt
        JobApplication::create([
            'job_listing_id' => 12,  // Using the exact job_listing_id from the data
            'candidate_id' => 5,     // Using the exact candidate_id from the data
            'first_name' => 'mehta',
            'last_name' => 'madhav',
            'email' => 'mehtamadhav2002@gmail.com',
            'phone' => '7041978181',
            'current_location' => 'bhavnagar',
            'linkedin_url' => 'https://www.linkedin.com/in/mehta-madhav-0b3a84359',
            'portfolio_url' => null,
            'current_job_title' => 'software engineer',
            'current_company' => 'tech company',
            'total_experience' => '1-3',
            'relevant_experience' => '1-3',
            'current_salary' => 25000.00,
            'work_type_preference' => 'onsite',
            'cover_letter' => null,
            'motivation_letter' => 'to gain experience',
            'key_strengths' => '["lerner"]',
            'resume_url' => '/storage/resumes/resume_5_1749051223.pdf',
            'cover_letter_file_url' => null,
            'additional_files_urls' => null,
            'expected_salary' => 35000.00,
            'salary_currency' => 'INR',
            'availability_date' => '2025-06-09',
            'notice_period' => 'immediate',
            'willing_to_relocate' => true,
            'visa_status' => null,
            'status' => 'interviewed',
            'applied_at' => '2025-06-04 15:33:44',
            'status_updated_at' => '2025-06-05 11:04:52',
            'status_notes' => null,
            'withdrawal_reason' => null,
            'additional_notes' => null,
            'referral_source' => null,
            'created_at' => '2025-06-04 15:33:44',
            'updated_at' => '2025-06-05 11:04:52',
        ]);

        $this->command->info('Created job application for Mehta Madhav.');
    }
}               'current_company' => $applicationData['current_company'],
                'total_experience' => $applicationData['total_experience'],
                'relevant_experience' => $applicationData['relevant_experience'],
                'current_salary' => $applicationData['current_salary'],
                'work_type_preference' => $applicationData['work_type_preference'],
                'cover_letter' => $applicationData['cover_letter'],
                'motivation_letter' => $applicationData['motivation_letter'],
                'key_strengths' => $applicationData['key_strengths'],
                'career_goals' => $applicationData['career_goals'],
                'resume_url' => $applicationData['resume_url'],
                'cover_letter_file_url' => $applicationData['cover_letter_file_url'],
                'additional_files_urls' => $applicationData['additional_files_urls'],
                'expected_salary' => $applicationData['expected_salary'],
                'salary_currency' => $applicationData['salary_currency'],
                'availability_date' => $applicationData['availability_date'],
                'notice_period' => $applicationData['notice_period'],
                'willing_to_relocate' => $applicationData['willing_to_relocate'],
                'visa_status' => $applicationData['visa_status'],
                'status' => $applicationData['status'],
                'applied_at' => $applicationData['applied_at'],
                'status_updated_at' => $applicationData['status_updated_at'],
                'status_notes' => $applicationData['status_notes'],
                'withdrawal_reason' => $applicationData['withdrawal_reason'],
                'additional_notes' => $applicationData['additional_notes'],
                'referral_source' => $applicationData['referral_source'],
                'created_at' => $applicationData['created_at'],
                'updated_at' => $applicationData['updated_at'],
            ]);
        }

        $this->command->info('Created ' . count($mockApplications) . ' job applications for DevOps Engineer position (Job ID: ' . $devOpsJob->id . ').');
    }