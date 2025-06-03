<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */    public function run(): void
    {
        $skills = [
            // Programming Languages
            'JavaScript',
            'TypeScript',
            'Python',
            'Java',
            'C#',
            'PHP',
            'Go',
            'Rust',
            'Swift',
            'Kotlin',

            // Frontend Technologies
            'React',
            'Vue.js',
            'Angular',
            'Next.js',
            'Svelte',
            'HTML',
            'CSS',
            'SASS/SCSS',
            'Tailwind CSS',
            'Bootstrap',

            // Backend Technologies
            'Node.js',
            'Express.js',
            'Laravel',
            'Django',
            'FastAPI',
            'Spring Boot',
            'ASP.NET Core',
            'Ruby on Rails',

            // Databases
            'PostgreSQL',
            'MySQL',
            'MongoDB',
            'Redis',
            'SQLite',
            'Elasticsearch',

            // Cloud & DevOps
            'AWS',
            'Google Cloud',
            'Azure',
            'Docker',
            'Kubernetes',
            'Jenkins',
            'GitLab CI/CD',
            'Terraform',

            // Mobile Development
            'React Native',
            'Flutter',
            'iOS Development',
            'Android Development',

            // Data Science & AI
            'Machine Learning',
            'TensorFlow',
            'PyTorch',
            'Pandas',
            'NumPy',
            'Scikit-learn',

            // Design & UX
            'Figma',
            'Adobe Creative Suite',
            'Sketch',
            'UX Research',
            'UI Design',
            'Prototyping',

            // Tools & Platforms
            'Git',
            'GitHub',
            'Jira',
            'Confluence',
            'Slack',
            'Notion',

            // Soft Skills
            'Project Management',
            'Team Leadership',
            'Communication',
            'Problem Solving',
            'Agile/Scrum',
        ];

        foreach ($skills as $skillName) {
            Skill::firstOrCreate(['name' => $skillName]);
        }
    }
}