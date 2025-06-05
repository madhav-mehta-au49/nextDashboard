export interface JobListing {
  id: number;
  title: string;
  description: string;
  requirements: string;
  benefits?: string;
  location: string;
  location_type: 'remote' | 'hybrid' | 'onsite';
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  experience_level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  salary_range?: string;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  required_skills: string[];
  preferred_skills?: string[];
  application_deadline?: string;
  start_date?: string;
  is_remote_friendly: boolean;
  status: 'draft' | 'active' | 'published' | 'paused' | 'closed' | 'expired';
  featured: boolean;
  urgent: boolean;
  company_id: number;
  category_id?: number;
  applicants_count: number;
  views_count: number;
  is_saved?: boolean;
  has_applied?: boolean;
  match_score?: number;
  company: Company;
  category?: JobCategory;
  questions?: ApplicationQuestion[];
  created_at: string;
  updated_at: string;
  published_at?: string;
  expires_at?: string;
}

export interface Company {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  location?: string;
  industry?: string;
  size?: string;
  founded_year?: number;
  is_verified: boolean;
  rating?: number;
  total_jobs?: number;
}

export interface JobCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  icon?: string;
  color?: string;
  jobs_count?: number;
  parent?: JobCategory;
  children?: JobCategory[];
}

export interface JobApplication {
  id: number;
  job_listing_id: number;
  candidate_id: number;
  status: 'pending' | 'reviewing' | 'interviewed' | 'offered' | 'hired' | 'rejected';
  cover_letter?: string;
  resume_url?: string;
  salary_expectation?: number;
  availability_date?: string;
  notes?: string;
  match_score?: number;
  applied_at: string;
  candidate?: Candidate;
  job_listing?: JobListing;
  answers?: ApplicationAnswer[];
  interviews?: Interview[];
  created_at: string;
  updated_at: string;
  // Additional properties from backend
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  current_location?: string;
  current_job_title?: string;
  current_company?: string;
  total_experience?: number;
  status_updated_at?: string;
  cover_letter_file_url?: string;
}

export interface Candidate {
  id: number;
  user_id: number;
  name?: string;
  email?: string;
  phone?: string;
  experience_level?: string;
  skills?: string[];
  location?: string;
  profile_image?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ApplicationQuestion {
  id: number;
  job_listing_id: number;
  question_text: string;
  question_type: 'text' | 'textarea' | 'select' | 'multiselect' | 'boolean' | 'file';
  is_required: boolean;
  options?: string[];
  order: number;
}

export interface ApplicationAnswer {
  id: number;
  job_application_id: number;
  question_id: number;
  question_text?: string;
  question_type?: string;
  answer: string;
}

export interface Interview {
  id: number;
  scheduled_at: string;
  type: string;
  status: string;
  feedback?: string;
  rating?: number;
}

export interface JobSearchFilters {
  query?: string;
  location?: string;
  job_type?: string[];
  experience_level?: string[];
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  skills?: string[];
  company_id?: number;
  category_id?: number;
  location_type?: string[];
  is_remote_friendly?: boolean;
  featured?: boolean;
  sort?: 'relevance' | 'date' | 'salary' | 'title' | 'company';
  per_page?: number;
  page?: number;
}

export interface JobSearchResult {
  data: JobListing[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters_applied: JobSearchFilters;
  suggested_searches?: string[];
  location_suggestions?: string[];
  skill_suggestions?: string[];
}

export interface JobRecommendation {
  job: JobListing;
  match_score: number;
  match_reasons: string[];
  similar_skills: string[];
  missing_skills: string[];
}

export interface JobAnalytics {
  total_jobs: number;
  active_jobs: number;
  featured_jobs: number;
  jobs_by_type: Record<string, number>;
  jobs_by_level: Record<string, number>;
  jobs_by_location: Record<string, number>;
  average_salary: number;
  salary_trends: Array<{
    period: string;
    average: number;
    median: number;
  }>;
  top_skills: Array<{
    skill: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  top_companies: Array<{
    company: Company;
    jobs_count: number;
  }>;
}

export interface ApplicationAnalytics {
  total_applications: number;
  applications_by_status: Record<string, number>;
  applications_by_month: Array<{
    month: string;
    count: number;
  }>;
  response_rate: number;
  interview_rate: number;
  success_rate: number;
  average_response_time: number;
  top_applied_companies: Array<{
    company: Company;
    applications_count: number;
  }>;
}

export interface SavedJob {
  id: number;
  user_id: number;
  job_listing_id: number;
  job_listing: JobListing;
  saved_at: string;
}

export interface MatchingCandidate {
  candidate: Candidate;
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  experience_match: number;
  location_match: boolean;
  salary_match: boolean;
}
