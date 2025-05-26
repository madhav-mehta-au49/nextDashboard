// Points System Types for Job Portal

export type UserRole = 'candidate' | 'hr' | 'company';

export type SkillLevel = 'basic' | 'intermediate' | 'advanced' | 'expert';

export type ExperienceLevel = 'fresher' | 'junior' | 'mid' | 'senior' | 'expert';

// Core Points Wallet Interface
export interface PointsWallet {
  id: string;
  user_id: string;
  user_role: UserRole;
  current_points: number;
  total_earned: number;
  total_spent: number;
  last_updated: string;
  created_at: string;
}

// Points Transaction Interface
export interface PointsTransaction {
  id: string;
  user_id: string;
  type: 'earned' | 'spent' | 'purchased' | 'refunded';
  points: number;
  description: string;
  category: 'resume_access' | 'job_application' | 'profile_boost' | 'company_access' | 'purchase' | 'bonus' | 'refund';
  metadata?: {
    target_user_id?: string;
    target_user_experience?: ExperienceLevel;
    target_user_skills?: string[];
    job_id?: string;
    company_id?: string;
    package_id?: string;
    original_price?: number;
    discount_applied?: number;
  };
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

// User Profile for Points Calculation
export interface UserProfile {
  id: string;
  role: UserRole;
  experience_years: number;
  experience_level: ExperienceLevel;
  skills: string[];
  skill_levels: Record<string, SkillLevel>;
  has_ai_skills: boolean;
  has_portfolio: boolean;
  certifications_count: number;
  resume_quality_score: number; // 1-10 scale
  profile_completion: number; // 0-100%
}

// Points Pricing Configuration (Reduced to 50-100 max range)
export interface PointsPricing {
  resume_access: {
    fresher: number; // 0 points (free)
    junior: number;  // 3-5 points
    mid: number;     // 8-12 points
    senior: number;  // 15-20 points
    expert: number;  // 25-35 points
  };
  skill_multipliers: Record<string, number>; // 1.0 to 1.3
  quality_multipliers: {
    portfolio: number;
    certifications: number;
    ai_optimized: number;
  };
  job_applications: {
    startup: number;     // 2-3 points
    mid_company: number; // 5-8 points
    enterprise: number;  // 10-15 points
    premium: number;     // +30% of base
  };
  company_access: {
    basic_info: number;      // 0 points (free)
    detailed_profile: number; // 3-5 points
    employee_reviews: number; // 8-10 points
    salary_insights: number;  // 12-18 points
  };
  premium_features: {
    profile_boost_24h: number;    // 15-25 points
    priority_application: number; // 12-20 points
    direct_message: number;       // 8-15 points
    analytics_access: number;     // 5-12 points
  };
}

// Points Purchase Packages
export interface PointsPackage {
  id: string;
  name: string;
  points: number;
  price_usd: number;
  price_inr: number;
  target_roles: UserRole[];
  discount_percentage?: number;
  bonus_points?: number;
  is_popular?: boolean;
  features: string[];
  validity_days?: number; // null for permanent
}

// Initial Points Allocation (Reduced to 50-100 max range)
export interface InitialPointsAllocation {
  candidate: {
    fresher: number;    // 20 points
    junior: number;     // 30 points
    mid: number;        // 40 points
    senior: number;     // 50 points
    expert: number;     // 60 points
  };
  hr: {
    startup: number;    // 60 points
    corporate: number;  // 80 points
    premium: number;    // 100 points
  };
  company: {
    startup: number;    // 70 points
    mid_size: number;   // 85 points
    enterprise: number; // 100 points
  };
}

// Points Statistics
export interface PointsStats {
  user_id: string;
  current_month: {
    earned: number;
    spent: number;
    net_change: number;
  };
  last_month: {
    earned: number;
    spent: number;
    net_change: number;
  };
  all_time: {
    total_earned: number;
    total_spent: number;
    total_purchased: number;
    transactions_count: number;
  };
  spending_breakdown: {
    resume_access: number;
    job_applications: number;
    company_access: number;
    premium_features: number;
    other: number;
  };
  top_categories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

// Points Activity/Achievement
export interface PointsActivity {
  id: string;
  user_id: string;
  activity_type: 'profile_completion' | 'referral' | 'login_streak' | 'purchase' | 'bonus';
  points_earned: number;
  description: string;
  requirements_met?: Record<string, any>;
  created_at: string;
}

// API Response Types
export interface PointsWalletResponse {
  wallet: PointsWallet;
  recent_transactions: PointsTransaction[];
  stats: PointsStats;
  available_packages: PointsPackage[];
  pricing: PointsPricing;
}

export interface PointsTransactionResponse {
  data: PointsTransaction[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

// Utility Types
export interface PointsCalculationParams {
  target_profile: UserProfile;
  action_type: 'resume_access' | 'job_application' | 'company_access' | 'premium_feature';
  feature_specific?: {
    job_company_size?: 'startup' | 'mid_company' | 'enterprise';
    company_feature?: 'basic_info' | 'detailed_profile' | 'employee_reviews' | 'salary_insights';
    premium_feature?: 'profile_boost_24h' | 'priority_application' | 'direct_message' | 'analytics_access';
  };
}

export interface PointsValidationResult {
  can_afford: boolean;
  required_points: number;
  current_points: number;
  shortage: number;
  suggested_package?: PointsPackage;
}