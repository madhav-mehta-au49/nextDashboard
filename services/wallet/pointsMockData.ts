// Mock Data for Points System
import { 
  PointsWallet, 
  PointsTransaction, 
  PointsPackage, 
  PointsStats, 
  UserRole,
  PointsPricing,
  InitialPointsAllocation 
} from '../../app/user/types/points';

// Mock Points Packages with reduced values
export const mockPointsPackages: PointsPackage[] = [
  // Candidate packages
  {
    id: 'starter_pack',
    name: 'Starter Pack',
    points: 25,
    price_usd: 2.99,
    price_inr: 249,
    target_roles: ['candidate'],
    features: ['Access 5-8 mid-level resumes', 'Apply to 8-10 startup jobs'],
    is_popular: false
  },
  {
    id: 'professional_pack',
    name: 'Professional Pack',
    points: 50,
    price_usd: 4.99,
    price_inr: 399,
    target_roles: ['candidate'],
    discount_percentage: 10,
    features: ['Access 3-5 senior resumes', 'Apply to 4-6 enterprise jobs', '1 profile boost'],
    is_popular: true
  },
  {
    id: 'premium_pack',
    name: 'Premium Pack',
    points: 100,
    price_usd: 8.99,
    price_inr: 699,
    target_roles: ['candidate'],
    discount_percentage: 15,
    bonus_points: 10,
    features: ['Access expert resumes', 'Premium job applications', 'Analytics access', '2 profile boosts'],
    is_popular: false
  },

  // HR packages
  {
    id: 'hr_basic',
    name: 'HR Basic',
    points: 60,
    price_usd: 9.99,
    price_inr: 799,
    target_roles: ['hr'],
    features: ['Access 15-20 candidate resumes', 'Company insights', 'Basic analytics']
  },
  {
    id: 'hr_pro',
    name: 'HR Professional',
    points: 120,
    price_usd: 17.99,
    price_inr: 1399,
    target_roles: ['hr'],
    discount_percentage: 12,
    features: ['Access 40+ candidate resumes', 'Advanced analytics', 'Priority hiring'],
    is_popular: true
  },

  // Company packages
  {
    id: 'company_growth',
    name: 'Growth Plan',
    points: 150,
    price_usd: 24.99,
    price_inr: 1999,
    target_roles: ['company'],
    features: ['Bulk resume access', 'Company branding', 'Employee insights', 'Salary benchmarks']
  },
  {
    id: 'company_enterprise',
    name: 'Enterprise Plan',
    points: 300,
    price_usd: 49.99,
    price_inr: 3999,
    target_roles: ['company'],
    discount_percentage: 20,
    bonus_points: 50,
    features: ['Unlimited access', 'Custom analytics', 'Dedicated support', 'API access'],
    is_popular: true
  }
];

// Mock Wallets for different user types
export const mockCandidateWallet: PointsWallet = {
  id: 'wallet_candidate_1',
  user_id: 'user_candidate_1',
  user_role: 'candidate',
  current_points: 42,
  total_earned: 78,
  total_spent: 36,
  last_updated: new Date().toISOString(),
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
};

export const mockHRWallet: PointsWallet = {
  id: 'wallet_hr_1',
  user_id: 'user_hr_1',
  user_role: 'hr',
  current_points: 85,
  total_earned: 160,
  total_spent: 75,
  last_updated: new Date().toISOString(),
  created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
};

export const mockCompanyWallet: PointsWallet = {
  id: 'wallet_company_1',
  user_id: 'user_company_1',
  user_role: 'company',
  current_points: 120,
  total_earned: 250,
  total_spent: 130,
  last_updated: new Date().toISOString(),
  created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
};

// Mock Transactions for different user types
export const mockCandidateTransactions: PointsTransaction[] = [
  {
    id: 'trans_1',
    user_id: 'user_candidate_1',
    type: 'purchased',
    points: 50,
    description: 'Purchased Professional Pack',
    category: 'purchase',
    metadata: { package_id: 'professional_pack', original_price: 4.99 },
    status: 'completed',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trans_2',
    user_id: 'user_candidate_1',
    type: 'spent',
    points: 18,
    description: 'Accessed senior developer resume',
    category: 'resume_access',
    metadata: { 
      target_user_id: 'dev_senior_1',
      target_user_experience: 'senior',
      target_user_skills: ['React', 'Node.js', 'AWS']
    },
    status: 'completed',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trans_3',
    user_id: 'user_candidate_1',
    type: 'spent',
    points: 12,
    description: 'Applied to enterprise company',
    category: 'job_application',
    metadata: { 
      job_id: 'job_enterprise_1',
      company_id: 'company_tech_1'
    },
    status: 'completed',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trans_4',
    user_id: 'user_candidate_1',
    type: 'earned',
    points: 8,
    description: 'Profile completion bonus',
    category: 'bonus',
    status: 'completed',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const mockHRTransactions: PointsTransaction[] = [
  {
    id: 'trans_hr_1',
    user_id: 'user_hr_1',
    type: 'purchased',
    points: 120,
    description: 'Purchased HR Professional Pack',
    category: 'purchase',
    metadata: { package_id: 'hr_pro', original_price: 17.99 },
    status: 'completed',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trans_hr_2',
    user_id: 'user_hr_1',
    type: 'spent',
    points: 30,
    description: 'Accessed 3 expert developer resumes',
    category: 'resume_access',
    status: 'completed',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trans_hr_3',
    user_id: 'user_hr_1',
    type: 'spent',
    points: 15,
    description: 'Company salary insights access',
    category: 'company_access',
    status: 'completed',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

export const mockCompanyTransactions: PointsTransaction[] = [
  {
    id: 'trans_comp_1',
    user_id: 'user_company_1',
    type: 'purchased',
    points: 150,
    description: 'Purchased Growth Plan',
    category: 'purchase',
    metadata: { package_id: 'company_growth', original_price: 24.99 },
    status: 'completed',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trans_comp_2',
    user_id: 'user_company_1',
    type: 'spent',
    points: 45,
    description: 'Bulk resume access (5 senior developers)',
    category: 'resume_access',
    status: 'completed',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trans_comp_3',
    user_id: 'user_company_1',
    type: 'spent',
    points: 25,
    description: 'Employee market insights',
    category: 'company_access',
    status: 'completed',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
];

// Mock Statistics
export const mockCandidateStats: PointsStats = {
  user_id: 'user_candidate_1',
  current_month: {
    earned: 58,
    spent: 36,
    net_change: 22
  },
  last_month: {
    earned: 20,
    spent: 15,
    net_change: 5
  },
  all_time: {
    total_earned: 78,
    total_spent: 36,
    total_purchased: 50,
    transactions_count: 4
  },
  spending_breakdown: {
    resume_access: 18,
    job_applications: 12,
    company_access: 0,
    premium_features: 6,
    other: 0
  },
  top_categories: [
    { category: 'Resume Access', amount: 18, percentage: 50 },
    { category: 'Job Applications', amount: 12, percentage: 33.3 },
    { category: 'Premium Features', amount: 6, percentage: 16.7 }
  ]
};

export const mockHRStats: PointsStats = {
  user_id: 'user_hr_1',
  current_month: {
    earned: 120,
    spent: 75,
    net_change: 45
  },
  last_month: {
    earned: 40,
    spent: 30,
    net_change: 10
  },
  all_time: {
    total_earned: 160,
    total_spent: 75,
    total_purchased: 120,
    transactions_count: 3
  },
  spending_breakdown: {
    resume_access: 30,
    job_applications: 0,
    company_access: 15,
    premium_features: 30,
    other: 0
  },
  top_categories: [
    { category: 'Resume Access', amount: 30, percentage: 40 },
    { category: 'Premium Features', amount: 30, percentage: 40 },
    { category: 'Company Access', amount: 15, percentage: 20 }
  ]
};

export const mockCompanyStats: PointsStats = {
  user_id: 'user_company_1',
  current_month: {
    earned: 150,
    spent: 130,
    net_change: 20
  },
  last_month: {
    earned: 100,
    spent: 85,
    net_change: 15
  },
  all_time: {
    total_earned: 250,
    total_spent: 130,
    total_purchased: 150,
    transactions_count: 3
  },
  spending_breakdown: {
    resume_access: 45,
    job_applications: 0,
    company_access: 25,
    premium_features: 60,
    other: 0
  },
  top_categories: [
    { category: 'Premium Features', amount: 60, percentage: 46.2 },
    { category: 'Resume Access', amount: 45, percentage: 34.6 },
    { category: 'Company Access', amount: 25, percentage: 19.2 }
  ]
};

// Mock function to get wallet data by user role
export const getMockWalletData = (userRole: UserRole) => {
  switch (userRole) {
    case 'candidate':
      return {
        wallet: mockCandidateWallet,
        transactions: mockCandidateTransactions,
        stats: mockCandidateStats,
        packages: mockPointsPackages.filter(pkg => pkg.target_roles.includes('candidate'))
      };
    case 'hr':
      return {
        wallet: mockHRWallet,
        transactions: mockHRTransactions,
        stats: mockHRStats,
        packages: mockPointsPackages.filter(pkg => pkg.target_roles.includes('hr'))
      };
    case 'company':
      return {
        wallet: mockCompanyWallet,
        transactions: mockCompanyTransactions,
        stats: mockCompanyStats,
        packages: mockPointsPackages.filter(pkg => pkg.target_roles.includes('company'))
      };
    default:
      return {
        wallet: mockCandidateWallet,
        transactions: mockCandidateTransactions,        stats: mockCandidateStats,
        packages: mockPointsPackages.filter(pkg => pkg.target_roles.includes('candidate'))
      };
  }
};

// Export combined transactions data for history page
export const mockTransactionsData: PointsTransaction[] = [
  ...mockCandidateTransactions,
  ...mockHRTransactions,
  ...mockCompanyTransactions
];
