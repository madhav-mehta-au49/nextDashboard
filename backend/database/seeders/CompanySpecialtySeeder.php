<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanySpecialty;
use Illuminate\Database\Seeder;

class CompanySpecialtySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = Company::all();

        $specialties = [
            'TechCorp Solutions' => [
                'Artificial Intelligence',
                'Cloud Computing',
                'Digital Transformation',
                'Enterprise Software',
                'Data Analytics',
            ],
            'HealthPlus Medical' => [
                'Telemedicine',
                'Healthcare IT',
                'Electronic Health Records',
                'Medical Devices',
                'Patient Engagement',
            ],
            'GreenEarth Sustainability' => [
                'Environmental Consulting',
                'Sustainability Planning',
                'Carbon Footprint Analysis',
                'Renewable Energy',
                'Green Building',
            ],
            'FinanceWise Advisors' => [
                'Financial Planning',
                'Investment Management',
                'Retirement Planning',
                'Estate Planning',
                'Tax Strategy',
            ],
            'EduTech Innovations' => [
                'E-Learning Platforms',
                'Educational Software',
                'Virtual Classrooms',
                'Learning Management Systems',
                'Educational Content Development',
            ],
        ];

        foreach ($companies as $company) {
            if (isset($specialties[$company->name])) {
                foreach ($specialties[$company->name] as $specialty) {
                    CompanySpecialty::create([
                        'company_id' => $company->id,
                        'specialty' => $specialty,
                    ]);
                }
            }
        }
    }
}
