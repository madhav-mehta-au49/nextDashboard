<?php

namespace Database\Seeders;

use App\Models\JobCategory;
use Illuminate\Database\Seeder;

class JobCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Software Development',
                'description' => 'Software engineering, web development, mobile development, and programming roles',
                'slug' => 'software-development',
                'icon' => 'code-bracket',
                'color' => '#3B82F6',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Data Science & Analytics',
                'description' => 'Data analysis, machine learning, AI, and business intelligence roles',
                'slug' => 'data-science-analytics',
                'icon' => 'chart-bar',
                'color' => '#8B5CF6',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Design & Creative',
                'description' => 'UI/UX design, graphic design, product design, and creative roles',
                'slug' => 'design-creative',
                'icon' => 'paint-brush',
                'color' => '#EC4899',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Product Management',
                'description' => 'Product management, product ownership, and strategy roles',
                'slug' => 'product-management',
                'icon' => 'cube',
                'color' => '#F59E0B',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Marketing & Sales',
                'description' => 'Digital marketing, sales, business development, and growth roles',
                'slug' => 'marketing-sales',
                'icon' => 'megaphone',
                'color' => '#10B981',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Operations & Management',
                'description' => 'Operations, project management, and executive leadership roles',
                'slug' => 'operations-management',
                'icon' => 'cog-6-tooth',
                'color' => '#6B7280',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'DevOps & Infrastructure',
                'description' => 'DevOps, cloud engineering, system administration, and infrastructure roles',
                'slug' => 'devops-infrastructure',
                'icon' => 'server',
                'color' => '#EF4444',
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'name' => 'Quality Assurance',
                'description' => 'Software testing, QA engineering, and quality control roles',
                'slug' => 'quality-assurance',
                'icon' => 'shield-check',
                'color' => '#06B6D4',
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'name' => 'Customer Success',
                'description' => 'Customer support, customer success, and client relations roles',
                'slug' => 'customer-success',
                'icon' => 'face-smile',
                'color' => '#84CC16',
                'is_active' => true,
                'sort_order' => 9,
            ],
            [
                'name' => 'Finance & Accounting',
                'description' => 'Financial analysis, accounting, and business finance roles',
                'slug' => 'finance-accounting',
                'icon' => 'calculator',
                'color' => '#14B8A6',
                'is_active' => true,
                'sort_order' => 10,
            ],
            [
                'name' => 'Human Resources',
                'description' => 'HR, talent acquisition, and people operations roles',
                'slug' => 'human-resources',
                'icon' => 'users',
                'color' => '#F97316',
                'is_active' => true,
                'sort_order' => 11,
            ],
            [
                'name' => 'Legal & Compliance',
                'description' => 'Legal counsel, compliance, and regulatory affairs roles',
                'slug' => 'legal-compliance',
                'icon' => 'scale',
                'color' => '#8B5CF6',
                'is_active' => true,
                'sort_order' => 12,
            ],
        ];

        foreach ($categories as $category) {
            JobCategory::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}