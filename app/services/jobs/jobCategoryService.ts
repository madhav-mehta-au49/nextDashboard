import axios from 'axios';
import { JobCategory } from '../user/types/jobs';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance with session-based auth
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export class JobCategoryService {
  /**
   * Get all job categories
   */
  static async getCategories(): Promise<JobCategory[]> {
    const response = await api.get('/job-categories');
    return response.data.data;
  }

  /**
   * Get a specific category by ID
   */
  static async getCategory(id: number): Promise<JobCategory> {
    const response = await api.get(`/job-categories/${id}`);
    return response.data.data;
  }

  /**
   * Get category by slug
   */
  static async getCategoryBySlug(slug: string): Promise<JobCategory> {
    const response = await api.get(`/job-categories/slug/${slug}`);
    return response.data.data;
  }

  /**
   * Get top-level categories (no parent)
   */
  static async getTopCategories(): Promise<JobCategory[]> {
    const response = await api.get('/job-categories', {
      params: { parent_id: null }
    });
    return response.data.data;
  }

  /**
   * Get subcategories for a parent category
   */
  static async getSubcategories(parentId: number): Promise<JobCategory[]> {
    const response = await api.get('/job-categories', {
      params: { parent_id: parentId }
    });
    return response.data.data;
  }

  /**
   * Get categories with job counts
   */
  static async getCategoriesWithCounts(): Promise<JobCategory[]> {
    const response = await api.get('/job-categories', {
      params: { include_counts: true }
    });
    return response.data.data;
  }

  /**
   * Search categories
   */
  static async searchCategories(query: string): Promise<JobCategory[]> {
    const response = await api.get('/job-categories/search', {
      params: { query }
    });
    return response.data.data;
  }

  /**
   * Get popular categories
   */
  static async getPopularCategories(limit: number = 10): Promise<JobCategory[]> {
    const response = await api.get('/job-categories/popular', {
      params: { limit }
    });
    return response.data.data;
  }

  /**
   * Create a new category (admin only)
   */
  static async createCategory(categoryData: Partial<JobCategory>): Promise<JobCategory> {
    const response = await api.post('/job-categories', categoryData);
    return response.data.data;
  }

  /**
   * Update a category (admin only)
   */
  static async updateCategory(id: number, categoryData: Partial<JobCategory>): Promise<JobCategory> {
    const response = await api.put(`/job-categories/${id}`, categoryData);
    return response.data.data;
  }

  /**
   * Delete a category (admin only)
   */
  static async deleteCategory(id: number): Promise<void> {
    await api.delete(`/job-categories/${id}`);
  }

  /**
   * Get category hierarchy (tree structure)
   */
  static async getCategoryHierarchy(): Promise<JobCategory[]> {
    const response = await api.get('/job-categories/hierarchy');
    return response.data.data;
  }
}

export class JobUtilityService {
  /**
   * Get all job types
   */
  static getJobTypes(): Array<{ value: string; label: string }> {
    return [
      { value: 'full-time', label: 'Full-time' },
      { value: 'part-time', label: 'Part-time' },
      { value: 'contract', label: 'Contract' },
      { value: 'internship', label: 'Internship' },
      { value: 'freelance', label: 'Freelance' },
    ];
  }

  /**
   * Get all experience levels
   */
  static getExperienceLevels(): Array<{ value: string; label: string }> {
    return [
      { value: 'entry', label: 'Entry Level' },
      { value: 'mid', label: 'Mid Level' },
      { value: 'senior', label: 'Senior Level' },
      { value: 'lead', label: 'Lead/Principal' },
      { value: 'executive', label: 'Executive' },
    ];
  }

  /**
   * Get all location types
   */
  static getLocationTypes(): Array<{ value: string; label: string }> {
    return [
      { value: 'remote', label: 'Remote' },
      { value: 'hybrid', label: 'Hybrid' },
      { value: 'onsite', label: 'On-site' },
    ];
  }

  /**
   * Get application statuses
   */
  static getApplicationStatuses(): Array<{ value: string; label: string; color: string }> {
    return [
      { value: 'pending', label: 'Pending', color: 'yellow' },
      { value: 'reviewing', label: 'Under Review', color: 'blue' },
      { value: 'interviewed', label: 'Interviewed', color: 'purple' },
      { value: 'offered', label: 'Offered', color: 'green' },
      { value: 'hired', label: 'Hired', color: 'green' },
      { value: 'rejected', label: 'Rejected', color: 'red' },
    ];
  }  /**
   * Get job listing statuses
   */
  static getJobStatuses(): Array<{ value: string; label: string; color: string }> {
    return [
      { value: 'draft', label: 'Draft', color: 'gray' },
      { value: 'active', label: 'Active', color: 'green' },
      { value: 'published', label: 'Published', color: 'blue' },
      { value: 'paused', label: 'Paused', color: 'yellow' },
      { value: 'closed', label: 'Closed', color: 'red' },
      { value: 'expired', label: 'Expired', color: 'orange' },
    ];
  }

  /**
   * Format salary range
   */
  static formatSalaryRange(min?: number, max?: number, currency: string = 'USD'): string {
    if (!min && !max) return 'Not specified';
    
    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(0)}K`;
      }
      return num.toString();
    };

    const currencySymbol = currency === 'USD' ? '$' : currency;
    
    if (min && max) {
      return `${currencySymbol}${formatNumber(min)} - ${currencySymbol}${formatNumber(max)}`;
    } else if (min) {
      return `${currencySymbol}${formatNumber(min)}+`;
    } else if (max) {
      return `Up to ${currencySymbol}${formatNumber(max)}`;
    }
    
    return 'Not specified';
  }

  /**
   * Calculate time ago from date
   */
  static timeAgo(date: string): string {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  }

  /**
   * Get match score color
   */
  static getMatchScoreColor(score: number): string {
    if (score >= 90) return 'green';
    if (score >= 70) return 'blue';
    if (score >= 50) return 'yellow';
    return 'red';
  }

  /**
   * Validate job application data
   */
  static validateApplicationData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.job_listing_id) {
      errors.push('Job listing ID is required');
    }

    if (data.salary_expectation && (isNaN(data.salary_expectation) || data.salary_expectation <= 0)) {
      errors.push('Salary expectation must be a positive number');
    }

    if (data.availability_date && new Date(data.availability_date) < new Date()) {
      errors.push('Availability date cannot be in the past');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate job share URL
   */
  static generateShareUrl(jobId: number, platform: 'linkedin' | 'twitter' | 'facebook' | 'email'): string {
    const baseUrl = window.location.origin;
    const jobUrl = `${baseUrl}/jobs/${jobId}`;
    const title = encodeURIComponent('Check out this job opportunity');
    
    switch (platform) {
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodeURIComponent(jobUrl)}&text=${title}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`;
      case 'email':
        return `mailto:?subject=${title}&body=${encodeURIComponent(jobUrl)}`;
      default:
        return jobUrl;
    }
  }

  /**
   * Parse skills from string
   */
  static parseSkills(skillsString: string): string[] {
    if (!skillsString) return [];
    return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  }

  /**
   * Generate slug from title
   */
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
