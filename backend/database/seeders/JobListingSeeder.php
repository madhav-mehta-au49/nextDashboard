<?php

namespace Database\Seeders;

use App\Models\JobListing;
use App\Models\Company;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class JobListingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = Company::all();

        if ($companies->isEmpty()) {
            $this->command->error('Please run CompanySeeder first.');
            return;
        }

        $jobListings = [
            // TechCorp Solutions Jobs
            [
                'company_name' => 'TechCorp Solutions',
                'title' => 'Senior Full Stack Developer',
                'description' => 'We are seeking an experienced Full Stack Developer to join our growing engineering team. You will work on cutting-edge web applications using modern technologies and contribute to our product development lifecycle. The ideal candidate has strong experience with React, Node.js, and cloud technologies.',
                'location' => 'San Francisco, CA',
                'is_remote' => false,
                'type' => 'Full-time',
                'experience_level' => 'Senior',
                'salary_min' => 120000,                'salary_max' => 180000,
                'salary_currency' => 'USD',
                'posted_days_ago' => 2,
                'requirements' => [
                    '5+ years of experience in full-stack development',
                    'Proficiency in React.js and Node.js',
                    'Experience with TypeScript and modern JavaScript (ES6+)',
                    'Knowledge of cloud platforms (AWS, Azure, or GCP)',
                    'Experience with databases (PostgreSQL, MongoDB)',
                    'Familiarity with Docker and containerization',
                    'Strong understanding of RESTful APIs and GraphQL',
                    'Experience with version control (Git) and CI/CD pipelines'
                ],
                'benefits' => [
                    'Competitive salary with equity options',
                    'Comprehensive health, dental, and vision insurance',
                    'Flexible work hours and hybrid work options',
                    'Professional development budget ($2,000/year)',
                    'Free lunch and snacks in the office',
                    'State-of-the-art equipment and tools',
                    '401(k) with company matching',
                    'Unlimited PTO policy'
                ],
            ],
            [
                'company_name' => 'TechCorp Solutions',
                'title' => 'DevOps Engineer',
                'description' => 'Join our infrastructure team to build and maintain scalable cloud solutions. You will work with cutting-edge technologies to ensure our applications run smoothly and efficiently. Experience with Kubernetes, AWS, and CI/CD pipelines is essential.',
                'location' => 'San Francisco, CA',
                'is_remote' => true,
                'type' => 'Full-time',
                'experience_level' => 'Mid',
                'salary_min' => 100000,                'salary_max' => 150000,
                'salary_currency' => 'USD',
                'posted_days_ago' => 1,
                'requirements' => [
                    '3+ years of experience in DevOps or Site Reliability Engineering',
                    'Strong experience with AWS cloud services',
                    'Proficiency in Kubernetes and Docker',
                    'Experience with Infrastructure as Code (Terraform, CloudFormation)',
                    'Knowledge of CI/CD tools (Jenkins, GitLab CI, GitHub Actions)',
                    'Scripting skills in Python, Bash, or Go',
                    'Experience with monitoring tools (Prometheus, Grafana, ELK Stack)',
                    'Understanding of networking and security best practices'
                ],
                'benefits' => [
                    'Fully remote work with flexible hours',
                    'Competitive salary with performance bonuses',
                    'Health, dental, and vision insurance',
                    'Home office setup allowance ($1,500)',
                    'Professional certification reimbursement',
                    'Annual company retreat and team building events',
                    'Stock options and equity participation',
                    'Learning and development budget'
                ],
            ],
            [
                'company_name' => 'TechCorp Solutions',
                'title' => 'UX/UI Designer',
                'description' => 'We are looking for a talented UX/UI Designer to create amazing user experiences for our web and mobile applications. You will work closely with product managers and developers to design intuitive and beautiful interfaces.',
                'location' => 'San Francisco, CA',
                'is_remote' => false,
                'type' => 'Full-time',
                'experience_level' => 'Mid',
                'salary_min' => 90000,                'salary_max' => 130000,
                'salary_currency' => 'USD',
                'posted_days_ago' => 5,
                'requirements' => [
                    '3+ years of experience in UX/UI design',
                    'Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)',
                    'Strong portfolio demonstrating design process and outcomes',
                    'Experience with user research and usability testing',
                    'Knowledge of responsive design and mobile-first principles',
                    'Understanding of accessibility standards (WCAG)',
                    'Experience with design systems and component libraries',
                    'Basic understanding of HTML/CSS and frontend frameworks'
                ],
                'benefits' => [
                    'Creative workspace with latest design tools',
                    'Health and wellness benefits package',
                    'Flexible PTO and work-life balance',
                    'Design conference and workshop budget',
                    'Collaborative and innovative team environment',
                    'Professional development opportunities',
                    'Stock options and performance bonuses',
                    'Free gym membership and wellness programs'
                ],
            ],

            // HealthPlus Medical Jobs
            [
                'company_name' => 'HealthPlus Medical',
                'title' => 'Senior Python Developer',
                'description' => 'Join our healthcare technology team to build innovative digital health solutions. You will work on telemedicine platforms and patient management systems using Python, Django, and modern web technologies.',
                'location' => 'Boston, MA',
                'is_remote' => true,
                'type' => 'Full-time',
                'experience_level' => 'Senior',
                'salary_min' => 110000,                'salary_max' => 160000,
                'salary_currency' => 'USD',
                'posted_days_ago' => 3,
                'requirements' => [
                    '5+ years of Python development experience',
                    'Strong experience with Django or Flask frameworks',
                    'Knowledge of healthcare standards (HIPAA, HL7, FHIR)',
                    'Experience with databases (PostgreSQL, MySQL)',
                    'Familiarity with RESTful APIs and microservices',
                    'Understanding of security best practices',
                    'Experience with testing frameworks (pytest, unittest)',
                    'Knowledge of cloud platforms and containerization'
                ],
                'benefits' => [
                    'Comprehensive healthcare coverage',
                    'Remote work with flexible schedule',
                    'Mission-driven work improving patient care',
                    'Professional development and certification support',
                    'Competitive salary with annual reviews',
                    'Health and wellness stipend',
                    'Retirement savings plan with matching',
                    'Paid volunteer time for community service'
                ],
            ],
            [
                'company_name' => 'HealthPlus Medical',
                'title' => 'Data Scientist',
                'description' => 'Leverage healthcare data to improve patient outcomes through machine learning and analytics. You will work with clinical data, develop predictive models, and collaborate with medical professionals.',
                'location' => 'Boston, MA',
                'is_remote' => false,
                'type' => 'Full-time',
                'experience_level' => 'Mid',
                'salary_min' => 95000,                'salary_max' => 140000,
                'salary_currency' => 'USD',
                'posted_days_ago' => 4,
                'requirements' => [
                    '3+ years of experience in data science or analytics',
                    'Proficiency in Python, R, or similar statistical programming languages',
                    'Experience with machine learning frameworks (scikit-learn, TensorFlow)',
                    'Knowledge of SQL and database management',
                    'Experience with data visualization tools (Tableau, PowerBI)',
                    'Understanding of statistical methods and hypothesis testing',
                    'Familiarity with healthcare data and privacy regulations',
                    'Strong communication skills for presenting findings'
                ],
                'benefits' => [
                    'Opportunity to impact healthcare outcomes',
                    'Access to cutting-edge healthcare datasets',
                    'Conference attendance and continuous learning',
                    'Collaborative research environment',
                    'Comprehensive benefits package',
                    'Flexible work arrangements',
                    'Publication and patent opportunities',
                    'Mentorship and career growth programs'
                ],
            ],

            // GreenEarth Sustainability Jobs
            [
                'company_name' => 'GreenEarth Sustainability',
                'title' => 'Environmental Data Analyst',
                'description' => 'Analyze environmental data to help businesses reduce their carbon footprint. You will work with large datasets, create reports, and develop sustainability metrics for our clients.',
                'location' => 'Portland, OR',
                'is_remote' => true,
                'type' => 'Full-time',
                'experience_level' => 'Mid',
                'salary_min' => 70000,                'salary_max' => 100000,
                'salary_currency' => 'USD',
                'posted_days_ago' => 6,
                'requirements' => [
                    '2+ years of experience in environmental analysis or data science',
                    'Proficiency in Excel, R, Python, or similar analytical tools',
                    'Knowledge of environmental regulations and standards',
                    'Experience with sustainability reporting frameworks',
                    'Strong analytical and problem-solving skills',
                    'Ability to work with large datasets and databases',
                    'Excellent written and verbal communication skills',
                    'Bachelor\'s degree in Environmental Science, Engineering, or related field'
                ],
                'benefits' => [
                    'Meaningful work fighting climate change',
                    'Fully remote work environment',
                    'Professional development in sustainability',
                    'Flexible schedule and work-life balance',
                    'Health and dental insurance',
                    'Environmental impact bonus programs',
                    'Company-sponsored volunteer activities',
                    'Green transportation reimbursement'
                ],
            ],
            [
                'company_name' => 'GreenEarth Sustainability',
                'title' => 'Project Manager',
                'description' => 'Lead sustainability projects for corporate clients. You will manage project timelines, coordinate with stakeholders, and ensure successful implementation of environmental initiatives.',
                'location' => 'Portland, OR',
                'is_remote' => false,
                'type' => 'Full-time',
                'experience_level' => 'Senior',
                'salary_min' => 85000,                'salary_max' => 120000,
                'salary_currency' => 'USD',
                'posted_days_ago' => 7,
                'requirements' => [
                    '5+ years of project management experience',
                    'PMP or similar project management certification preferred',
                    'Experience in sustainability or environmental consulting',
                    'Strong client relationship management skills',
                    'Proficiency in project management tools (Asana, Monday, etc.)',
                    'Knowledge of environmental regulations and compliance',
                    'Excellent communication and presentation skills',
                    'Bachelor\'s degree in relevant field'
                ],
                'benefits' => [
                    'Lead impactful environmental projects',
                    'Collaborative and mission-driven team',
                    'Professional certification support',
                    'Health, dental, and vision coverage',
                    'Flexible PTO and sabbatical options',
                    'Client interaction and travel opportunities',
                    'Sustainability conference attendance',
                    'Performance-based bonuses'
                ],
            ],

            // FinanceWise Advisors Jobs
            [
                'company_name' => 'FinanceWise Advisors',
                'title' => 'Financial Analyst',
                'description' => 'Provide financial analysis and investment recommendations to our clients. You will research market trends, analyze financial data, and create comprehensive reports.',
                'location' => 'New York, NY',
                'is_remote' => false,
                'type' => 'Full-time',
                'experience_level' => 'Mid',
                'salary_min' => 80000,                'salary_max' => 120000,
                'salary_currency' => 'USD',
                'posted_days_ago' => 8,
                'requirements' => [
                    '2+ years of experience in financial analysis',
                    'CFA certification or progress toward CFA preferred',
                    'Proficiency in Excel, Bloomberg, and financial modeling',
                    'Strong understanding of financial markets and instruments',
                    'Experience with investment research and valuation methods',
                    'Excellent analytical and quantitative skills',
                    'Strong written and verbal communication abilities',
                    'Bachelor\'s degree in Finance, Economics, or related field'
                ],
                'benefits' => [
                    'Competitive base salary plus bonuses',
                    'CFA exam support and study time',
                    'Access to Bloomberg and premium financial tools',
                    'Professional development and training',
                    'Health, dental, and vision insurance',
                    'Retirement plan with company matching',
                    'Performance-based incentives',
                    'Downtown NYC office location'
                ],
            ],
            [
                'company_name' => 'FinanceWise Advisors',
                'title' => 'Senior Investment Advisor',
                'description' => 'Manage high-net-worth client portfolios and provide strategic investment advice. You will build relationships with clients and develop personalized financial strategies.',
                'location' => 'New York, NY',
                'is_remote' => false,
                'type' => 'Full-time',
                'experience_level' => 'Senior',
                'salary_min' => 120000,                'salary_max' => 180000,
                'salary_currency' => 'USD',
                'posted_days_ago' => 10,
                'requirements' => [
                    '7+ years of experience in wealth management or investment advisory',
                    'Series 7, 66, and other relevant licenses required',
                    'Proven track record of managing client relationships',
                    'Experience with portfolio management and asset allocation',
                    'Strong knowledge of tax planning and estate planning',
                    'Excellent interpersonal and communication skills',
                    'CFP or CFA designation strongly preferred',
                    'Existing book of business preferred'
                ],
                'benefits' => [
                    'High earning potential with commission structure',
                    'Comprehensive benefits package',
                    'Access to research and investment platforms',
                    'Client entertainment and travel budget',
                    'Professional development and continuing education',
                    'Prestigious downtown office environment',
                    'Equity participation opportunities',
                    'Flexible schedule for client meetings'
                ],
            ],

            // EduTech Innovations Jobs
            [
                'company_name' => 'EduTech Innovations',
                'title' => 'Frontend Developer',
                'description' => 'Build interactive educational platforms using React and modern JavaScript. You will create engaging user interfaces for students and educators, focusing on accessibility and usability.',
                'location' => 'Austin, TX',
                'is_remote' => true,
                'type' => 'Full-time',
                'experience_level' => 'Mid',
                'salary_min' => 85000,                'salary_max' => 125000,
                'salary_currency' => 'USD',
                'posted_days_ago' => 12,
                'requirements' => [
                    '3+ years of frontend development experience',
                    'Strong proficiency in React.js and modern JavaScript',
                    'Experience with HTML5, CSS3, and responsive design',
                    'Knowledge of state management (Redux, Context API)',
                    'Familiarity with testing frameworks (Jest, React Testing Library)',
                    'Understanding of accessibility standards and best practices',
                    'Experience with version control (Git) and agile development',
                    'Portfolio demonstrating web application development'
                ],
                'benefits' => [
                    'Impact education through technology',
                    'Fully remote work with flexible hours',
                    'Modern tech stack and development tools',
                    'Professional development budget',
                    'Health and wellness benefits',
                    'Company laptop and home office setup',
                    'Annual team retreats and conferences',
                    'Stock options and equity participation'
                ],
            ],
            [
                'company_name' => 'EduTech Innovations',
                'title' => 'Product Manager',
                'description' => 'Lead product development for our educational technology platform. You will work with engineering and design teams to define product requirements and strategy.',
                'location' => 'Austin, TX',
                'is_remote' => false,
                'type' => 'Full-time',
                'experience_level' => 'Senior',
                'salary_min' => 100000,                'salary_max' => 150000,
                'salary_currency' => 'USD',
                'posted_days_ago' => 14,
                'requirements' => [
                    '5+ years of product management experience',
                    'Experience in education technology or related field',
                    'Strong understanding of user experience and design thinking',
                    'Proficiency in product management tools (Jira, Confluence, etc.)',
                    'Experience with agile development methodologies',
                    'Strong analytical and data-driven decision making skills',
                    'Excellent communication and stakeholder management abilities',
                    'MBA or technical degree preferred'
                ],
                'benefits' => [
                    'Shape the future of education technology',
                    'Collaborative and innovative work environment',
                    'Competitive salary with equity upside',
                    'Comprehensive health and dental coverage',
                    'Professional development and conference attendance',
                    'Flexible PTO and work-life balance',
                    'Modern office in vibrant Austin location',
                    'Opportunity to work with educators and students'
                ],
            ],
        ];

        foreach ($jobListings as $jobData) {
            $company = $companies->where('name', $jobData['company_name'])->first();
            
            if ($company) {
                $postedDate = Carbon::now()->subDays($jobData['posted_days_ago']);
                  JobListing::create([
                    'company_id' => $company->id,
                    'title' => $jobData['title'],
                    'description' => $jobData['description'],
                    'location' => $jobData['location'],
                    'is_remote' => $jobData['is_remote'],
                    'type' => $jobData['type'],
                    'experience_level' => $jobData['experience_level'],
                    'salary_min' => $jobData['salary_min'],
                    'salary_max' => $jobData['salary_max'],
                    'salary_currency' => $jobData['salary_currency'],
                    'requirements' => $jobData['requirements'] ?? null,
'benefits' => $jobData['benefits'] ?? null,
                    'posted_date' => $postedDate,
                    'status' => 'published',
                ]);
            }
        }

        $this->command->info('Created ' . count($jobListings) . ' job listings.');
    }
}