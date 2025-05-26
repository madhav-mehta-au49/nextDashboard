<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyLocation;
use Illuminate\Database\Seeder;

class CompanyLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = Company::all();

        $locations = [
            'TechCorp Solutions' => [
                ['city' => 'San Francisco', 'country' => 'United States', 'is_primary' => true],
                ['city' => 'New York', 'country' => 'United States', 'is_primary' => false],
                ['city' => 'London', 'country' => 'United Kingdom', 'is_primary' => false],
            ],
            'HealthPlus Medical' => [
                ['city' => 'Boston', 'country' => 'United States', 'is_primary' => true],
                ['city' => 'Chicago', 'country' => 'United States', 'is_primary' => false],
            ],
            'GreenEarth Sustainability' => [
                ['city' => 'Portland', 'country' => 'United States', 'is_primary' => true],
                ['city' => 'Seattle', 'country' => 'United States', 'is_primary' => false],
            ],
            'FinanceWise Advisors' => [
                ['city' => 'New York', 'country' => 'United States', 'is_primary' => true],
                ['city' => 'Chicago', 'country' => 'United States', 'is_primary' => false],
                ['city' => 'Toronto', 'country' => 'Canada', 'is_primary' => false],
            ],
            'EduTech Innovations' => [
                ['city' => 'Austin', 'country' => 'United States', 'is_primary' => true],
                ['city' => 'San Francisco', 'country' => 'United States', 'is_primary' => false],
            ],
        ];

        foreach ($companies as $company) {
            if (isset($locations[$company->name])) {
                foreach ($locations[$company->name] as $location) {
                    CompanyLocation::create([
                        'company_id' => $company->id,
                        'city' => $location['city'],
                        'country' => $location['country'],
                        'is_primary' => $location['is_primary'],
                    ]);
                }
            }
        }
    }
}
