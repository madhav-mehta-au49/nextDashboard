<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = [
            [
                'name' => 'TechCorp Solutions',
                'slug' => 'techcorp-solutions',
                'description' => 'Leading provider of innovative software solutions for enterprise businesses. Specializing in AI-driven analytics, cloud migration, and digital transformation. Our team of experts works closely with clients to deliver customized solutions that drive business growth and operational efficiency.',
                'industry' => 'Information Technology',
                'size' => '501-1000',
                'founded' => 2005,
                'website' => 'https://techcorp-solutions.example.com',
                'headquarters' => 'San Francisco, CA',
                'logo_url' => '/images/techcorp-logo.png',
                'cover_image_url' => '/images/company-cover-1.jpg',
                'employees' => 750,
                'followers' => 1250,
                'verified' => true,
                'rating' => 4.5,
            ],
            [
                'name' => 'HealthPlus Medical',
                'slug' => 'healthplus-medical',
                'description' => 'Revolutionary healthcare technology company focused on improving patient outcomes through digital health solutions and telemedicine platforms. We combine cutting-edge technology with medical expertise to create innovative solutions that enhance healthcare delivery and patient experience.',
                'industry' => 'Healthcare',
                'size' => '201-500',
                'founded' => 2010,
                'website' => 'https://healthplus-medical.example.com',
                'headquarters' => 'Boston, MA',
                'logo_url' => '/images/healthplus-logo.png',
                'cover_image_url' => '/images/company-cover-2.jpg',
                'employees' => 320,
                'followers' => 980,
                'verified' => true,
                'rating' => 4.2,
            ],
            [
                'name' => 'GreenEarth Sustainability',
                'slug' => 'greenearth-sustainability',
                'description' => 'Environmental consulting firm helping businesses reduce their carbon footprint and implement sustainable practices across their operations. Our team of environmental scientists and sustainability experts provides comprehensive solutions for businesses committed to environmental stewardship.',
                'industry' => 'Environmental Services',
                'size' => '51-200',
                'founded' => 2015,
                'website' => 'https://greenearth-sustainability.example.com',
                'headquarters' => 'Portland, OR',
                'logo_url' => '/images/greenearth-logo.png',
                'cover_image_url' => '/images/company-cover-3.jpg',
                'employees' => 120,
                'followers' => 560,
                'verified' => true,
                'rating' => 4.7,
            ],
            [
                'name' => 'FinanceWise Advisors',
                'slug' => 'financewise-advisors',
                'description' => 'Leading financial advisory firm providing comprehensive financial planning, investment management, and wealth preservation strategies for individuals and businesses. Our team of certified financial planners delivers personalized solutions to help clients achieve their financial goals.',
                'industry' => 'Financial Services',
                'size' => '201-500',
                'founded' => 2008,
                'website' => 'https://financewise-advisors.example.com',
                'headquarters' => 'New York, NY',
                'logo_url' => '/images/financewise-logo.png',
                'cover_image_url' => '/images/company-cover-4.jpg',
                'employees' => 280,
                'followers' => 720,
                'verified' => true,
                'rating' => 4.3,
            ],
            [
                'name' => 'EduTech Innovations',
                'slug' => 'edutech-innovations',
                'description' => 'Educational technology company revolutionizing learning through interactive digital platforms, AI-powered personalized learning, and immersive educational experiences. We partner with schools, universities, and corporate training programs to enhance learning outcomes and engagement.',
                'industry' => 'Education Technology',
                'size' => '51-200',
                'founded' => 2012,
                'website' => 'https://edutech-innovations.example.com',
                'headquarters' => 'Austin, TX',
                'logo_url' => '/images/edutech-logo.png',
                'cover_image_url' => '/images/company-cover-5.jpg',
                'employees' => 175,
                'followers' => 890,
                'verified' => true,
                'rating' => 4.6,
            ],
        ];

        foreach ($companies as $company) {
            Company::create($company);
        }
    }
}
