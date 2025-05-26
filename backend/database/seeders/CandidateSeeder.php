<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Candidate;
use App\Models\Experience;
use App\Models\Education;
use App\Models\Skill;
use App\Models\Certification;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CandidateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Create skills first since they're referenced in pivot table
        $skills = [
            'PHP', 'Laravel', 'JavaScript', 'React', 'Vue.js', 'Node.js', 
            'Python', 'Django', 'Java', 'Spring Boot', 'C#', '.NET',
            'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
            'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git',
            'HTML', 'CSS', 'Bootstrap', 'Tailwind CSS', 'TypeScript',
            'Express.js', 'REST API', 'GraphQL', 'Microservices'
        ];

        foreach ($skills as $skillName) {
            Skill::firstOrCreate(['name' => $skillName]);
        }

        $skillIds = Skill::pluck('id')->toArray();        // Sample candidate data
        $candidates = [
            [
                'name' => 'John Smith',
                'headline' => 'Senior Full Stack Developer',
                'location' => 'New York, NY',
                'about' => 'Full-stack developer with 5+ years of experience in web development. Passionate about creating scalable web applications using modern technologies like Laravel, React, and Node.js.',
                'email' => 'john.smith@example.com',
                'phone' => '+1234567890',
                'website' => 'https://johnsmith.dev',
                'profile_picture' => 'https://via.placeholder.com/300x300?text=JS',
                'resume_url' => 'https://example.com/resumes/john-smith.pdf',
                'skills' => array_slice($skillIds, 0, 8),                'experiences' => [
                    [
                        'title' => 'Senior Full Stack Developer',
                        'company' => 'Tech Solutions Inc',
                        'company_name' => 'Tech Solutions Inc',
                        'location' => 'New York, NY',
                        'start_date' => '2022-01-01',
                        'end_date' => null,
                        'is_current' => true,
                        'description' => 'Led development of multiple web applications using Laravel and React.'
                    ],
                    [
                        'title' => 'Full Stack Developer',
                        'company' => 'Digital Agency',
                        'company_name' => 'Digital Agency',
                        'location' => 'New York, NY',
                        'start_date' => '2019-06-01',
                        'end_date' => '2021-12-31',
                        'is_current' => false,
                        'description' => 'Developed and maintained client websites using various technologies.'
                    ]
                ],                'educations' => [
                    [
                        'degree' => 'Bachelor of Science',
                        'field_of_study' => 'Computer Science',
                        'institution' => 'University of Technology',
                        'start_date' => '2015-09-01',
                        'end_date' => '2019-05-01',
                    ]
                ],
                'certifications' => [
                    [
                        'name' => 'AWS Certified Developer',
                        'issuing_organization' => 'Amazon Web Services',
                        'issue_date' => '2023-03-15',
                        'expiration_date' => '2026-03-15',
                        'credential_id' => 'AWS-CD-12345'
                    ]
                ]
            ],            [
                'name' => 'Sarah Johnson',
                'headline' => 'Frontend Developer',
                'location' => 'San Francisco, CA',
                'about' => 'Frontend specialist with expertise in React and modern JavaScript frameworks. Passionate about creating beautiful, responsive user interfaces.',
                'email' => 'sarah.johnson@example.com',
                'phone' => '+1234567891',
                'website' => 'https://sarahjohnson.dev',
                'profile_picture' => 'https://via.placeholder.com/300x300?text=SJ',
                'resume_url' => 'https://example.com/resumes/sarah-johnson.pdf',
                'skills' => array_slice($skillIds, 2, 6),                'experiences' => [
                    [
                        'title' => 'Frontend Developer',
                        'company' => 'StartupXYZ',
                        'company_name' => 'StartupXYZ',
                        'location' => 'San Francisco, CA',
                        'start_date' => '2021-03-01',
                        'end_date' => null,
                        'is_current' => true,
                        'description' => 'Building responsive web applications with React and TypeScript.'
                    ]
                ],                'educations' => [
                    [
                        'degree' => 'Bachelor of Arts',
                        'field_of_study' => 'Web Design',
                        'institution' => 'Design Institute',
                        'start_date' => '2016-09-01',
                        'end_date' => '2020-05-01',
                    ]
                ],
                'certifications' => []
            ],[
                'name' => 'Michael Brown',
                'headline' => 'Backend Developer',
                'location' => 'Austin, TX',
                'about' => 'Backend developer specialized in API development and microservices architecture. Experienced in building scalable, secure systems.',
                'email' => 'michael.brown@example.com',
                'phone' => '+1234567892',
                'website' => 'https://michaelbrown.dev',
                'profile_picture' => 'https://via.placeholder.com/300x300?text=MB',
                'resume_url' => 'https://example.com/resumes/michael-brown.pdf',
                'skills' => array_slice($skillIds, 5, 10),                'experiences' => [
                    [
                        'title' => 'Senior Backend Developer',
                        'company' => 'Enterprise Corp',
                        'company_name' => 'Enterprise Corp',
                        'location' => 'Austin, TX',
                        'start_date' => '2020-01-01',
                        'end_date' => null,
                        'is_current' => true,
                        'description' => 'Architecting scalable backend systems and APIs for enterprise applications.'
                    ]
                ],                'educations' => [
                    [
                        'degree' => 'Master of Science',
                        'field_of_study' => 'Software Engineering',
                        'institution' => 'Tech University',
                        'start_date' => '2014-09-01',
                        'end_date' => '2016-05-01',
                    ]
                ],                'certifications' => [
                    [
                        'name' => 'Kubernetes Administrator',
                        'issuing_organization' => 'Cloud Native Computing Foundation',
                        'issue_date' => '2022-08-10',
                        'expiration_date' => '2025-08-10',
                        'credential_id' => 'CKA-67890'
                    ],
                    [
                        'name' => 'Docker Certified Associate',
                        'issuing_organization' => 'Docker Inc',
                        'issue_date' => '2023-01-15',
                        'expiration_date' => '2026-01-15',
                        'credential_id' => 'DCA-54321'
                    ]
                ]
            ]
        ];

        foreach ($candidates as $candidateData) {
            // Extract related data
            $skills = $candidateData['skills'];
            $experiences = $candidateData['experiences'];
            $educations = $candidateData['educations'];
            $certifications = $candidateData['certifications'];
            
            // Remove related data from main candidate data
            unset($candidateData['skills'], $candidateData['experiences'], $candidateData['educations'], $candidateData['certifications']);
            
            // Create candidate
            $candidate = Candidate::create($candidateData);
              // Attach skills
            foreach ($skills as $skillId) {
                $candidate->skills()->attach($skillId, [
                    'endorsements' => rand(0, 15)
                ]);
            }
            
            // Create experiences
            foreach ($experiences as $experienceData) {
                $candidate->experiences()->create($experienceData);
            }
            
            // Create educations
            foreach ($educations as $educationData) {
                $candidate->educations()->create($educationData);
            }
            
            // Create certifications
            foreach ($certifications as $certificationData) {
                $candidate->certifications()->create($certificationData);
            }
        }        $this->command->info('Candidate seeder completed successfully!');
        $this->command->info('Created ' . Candidate::count() . ' candidates with their related data.');
    }
}
