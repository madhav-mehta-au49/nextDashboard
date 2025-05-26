// Points Calculator Service - Reduced to 50-100 max range
import { 
  UserProfile, 
  PointsPricing, 
  PointsCalculationParams, 
  ExperienceLevel, 
  UserRole 
} from '../../app/user/types/points';

export class PointsCalculator {
  private static pricing: PointsPricing = {
    resume_access: {
      fresher: 0,  // Free for freshers
      junior: 4,   // 3-5 points
      mid: 10,     // 8-12 points
      senior: 18,  // 15-20 points
      expert: 30   // 25-35 points
    },
    skill_multipliers: {
      // High-demand skills get multipliers
      'ai/ml': 1.3,
      'machine learning': 1.3,
      'data science': 1.2,
      'cloud computing': 1.2,
      'aws': 1.2,
      'azure': 1.2,
      'react': 1.1,
      'angular': 1.1,
      'vue': 1.1,
      'node.js': 1.1,
      'python': 1.1,
      'java': 1.0,
      'javascript': 1.0,
      // Default multiplier for other skills
      'default': 1.0
    },
    quality_multipliers: {
      portfolio: 1.1,       // +10% for portfolio
      certifications: 1.15, // +15% for certifications
      ai_optimized: 1.2     // +20% for AI-optimized profiles
    },
    job_applications: {
      startup: 2,     // 2-3 points
      mid_company: 6, // 5-8 points
      enterprise: 12, // 10-15 points
      premium: 0.3    // +30% multiplier
    },
    company_access: {
      basic_info: 0,       // Free
      detailed_profile: 4, // 3-5 points
      employee_reviews: 9, // 8-10 points
      salary_insights: 15  // 12-18 points
    },
    premium_features: {
      profile_boost_24h: 20,    // 15-25 points
      priority_application: 16, // 12-20 points
      direct_message: 12,       // 8-15 points
      analytics_access: 8       // 5-12 points
    }
  };

  // Calculate points for resume access
  static calculateResumeAccessPoints(targetProfile: UserProfile): number {
    const baseCost = this.pricing.resume_access[targetProfile.experience_level];
    
    if (baseCost === 0) return 0; // Free for freshers
    
    let finalCost = baseCost;
    
    // Apply skill multipliers
    const skillMultiplier = this.getSkillMultiplier(targetProfile.skills);
    finalCost *= skillMultiplier;
    
    // Apply quality multipliers
    if (targetProfile.has_portfolio) {
      finalCost *= this.pricing.quality_multipliers.portfolio;
    }
    
    if (targetProfile.certifications_count > 0) {
      finalCost *= this.pricing.quality_multipliers.certifications;
    }
    
    if (targetProfile.resume_quality_score >= 8) {
      finalCost *= this.pricing.quality_multipliers.ai_optimized;
    }
    
    // Cap at 35 points maximum for resume access
    return Math.min(Math.round(finalCost), 35);
  }

  // Calculate points for job applications
  static calculateJobApplicationPoints(
    companySize: 'startup' | 'mid_company' | 'enterprise',
    isPremium: boolean = false
  ): number {
    let baseCost = this.pricing.job_applications[companySize];
    
    if (isPremium) {
      baseCost *= (1 + this.pricing.job_applications.premium);
    }
    
    // Cap at 20 points maximum for job applications
    return Math.min(Math.round(baseCost), 20);
  }

  // Calculate points for company access features
  static calculateCompanyAccessPoints(
    feature: 'basic_info' | 'detailed_profile' | 'employee_reviews' | 'salary_insights'
  ): number {
    return this.pricing.company_access[feature];
  }

  // Calculate points for premium features
  static calculatePremiumFeaturePoints(
    feature: 'profile_boost_24h' | 'priority_application' | 'direct_message' | 'analytics_access'
  ): number {
    return this.pricing.premium_features[feature];
  }

  // Get skill multiplier based on user's skills
  private static getSkillMultiplier(skills: string[]): number {
    let maxMultiplier = 1.0;
    
    for (const skill of skills) {
      const skillLower = skill.toLowerCase();
      const multiplier = this.pricing.skill_multipliers[skillLower] || 
                        this.pricing.skill_multipliers.default;
      maxMultiplier = Math.max(maxMultiplier, multiplier);
    }
    
    return maxMultiplier;
  }

  // Calculate initial points allocation for new users
  static calculateInitialPoints(userRole: UserRole, experienceLevel?: ExperienceLevel, companySize?: string): number {
    switch (userRole) {
      case 'candidate':
        const candidateAllocation = {
          fresher: 20,
          junior: 30,
          mid: 40,
          senior: 50,
          expert: 60
        };
        return candidateAllocation[experienceLevel || 'fresher'];
      
      case 'hr':
        const hrAllocation = {
          startup: 60,
          corporate: 80,
          premium: 100
        };
        return hrAllocation[companySize as keyof typeof hrAllocation] || 60;
      
      case 'company':
        const companyAllocation = {
          startup: 70,
          mid_size: 85,
          enterprise: 100
        };
        return companyAllocation[companySize as keyof typeof companyAllocation] || 70;
      
      default:
        return 20;
    }
  }

  // Comprehensive calculation method
  static calculatePoints(params: PointsCalculationParams): number {
    switch (params.action_type) {
      case 'resume_access':
        return this.calculateResumeAccessPoints(params.target_profile);
      
      case 'job_application':
        const companySize = params.feature_specific?.job_company_size || 'startup';
        return this.calculateJobApplicationPoints(companySize);
      
      case 'company_access':
        const feature = params.feature_specific?.company_feature || 'basic_info';
        return this.calculateCompanyAccessPoints(feature);
      
      case 'premium_feature':
        const premiumFeature = params.feature_specific?.premium_feature || 'analytics_access';
        return this.calculatePremiumFeaturePoints(premiumFeature);
      
      default:
        return 0;
    }
  }

  // Get pricing information
  static getPricing(): PointsPricing {
    return { ...this.pricing };
  }

  // Calculate discount for bulk actions
  static calculateBulkDiscount(quantity: number): number {
    if (quantity >= 10) return 0.2; // 20% discount for 10+ actions
    if (quantity >= 5) return 0.1;  // 10% discount for 5+ actions
    return 0;
  }

  // Validate if user can afford an action
  static canAfford(userPoints: number, requiredPoints: number): boolean {
    return userPoints >= requiredPoints;
  }

  // Calculate points after discount
  static applyDiscount(points: number, discountPercentage: number): number {
    return Math.round(points * (1 - discountPercentage));
  }

  // Get experience level from years of experience
  static getExperienceLevel(years: number): ExperienceLevel {
    if (years === 0) return 'fresher';
    if (years <= 2) return 'junior';
    if (years <= 5) return 'mid';
    if (years <= 10) return 'senior';
    return 'expert';
  }
}

export default PointsCalculator;