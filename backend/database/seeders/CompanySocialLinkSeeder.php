<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanySocialLink;
use Illuminate\Database\Seeder;

class CompanySocialLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = Company::all();

        foreach ($companies as $company) {
            $slug = $company->slug;
            
            CompanySocialLink::create([
                'company_id' => $company->id,
                'platform' => 'linkedin',
                'url' => "https://linkedin.com/company/{$slug}",
            ]);
            
            CompanySocialLink::create([
                'company_id' => $company->id,
                'platform' => 'twitter',
                'url' => "https://twitter.com/{$slug}",
            ]);
            
            CompanySocialLink::create([
                'company_id' => $company->id,
                'platform' => 'facebook',
                'url' => "https://facebook.com/{$slug}",
            ]);
            
            // Only some companies have Instagram
            if (in_array($company->name, ['TechCorp Solutions', 'GreenEarth Sustainability', 'EduTech Innovations'])) {
                CompanySocialLink::create([
                    'company_id' => $company->id,
                    'platform' => 'instagram',
                    'url' => "https://instagram.com/{$slug}",
                ]);
            }
        }
    }
}
