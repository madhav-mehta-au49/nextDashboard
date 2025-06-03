import axios from 'axios';
import { 
  JobListing, 
  JobSearchFilters, 
  JobSearchResult, 
  JobRecommendation,
  JobAnalytics,
  SavedJob
} from '../user/types/jobs';

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

export class JobService {
  /**
   * Get all job listings with optional filters
   */
  static async getJobs(filters?: JobSearchFilters): Promise<JobSearchResult> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(`${key}[]`, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await api.get(`/job-listings?${params.toString()}`);
    return response.data;
  }

  /**
   * Search jobs with advanced filtering
   */
  static async searchJobs(filters: JobSearchFilters): Promise<JobSearchResult> {
    const response = await api.get('/job-listings/search', { params: filters });
    return response.data;
  }

  /**
   * Get a specific job listing by ID
   */
  static async getJob(id: number): Promise<JobListing> {
    const response = await api.get(`/job-listings/${id}`);
    return response.data.data;
  }

  /**
   * Get similar jobs for a specific job listing
   */
  static async getSimilarJobs(id: number, limit: number = 5): Promise<JobListing[]> {
    const response = await api.get(`/job-listings/${id}/similar`, {
      params: { limit }
    });
    return response.data.data;
  }

  /**
   * Get job recommendations for the current user
   */
  static async getRecommendations(limit: number = 10): Promise<JobRecommendation[]> {
    const response = await api.get('/job-listings/recommendations', {
      params: { limit }
    });
    return response.data.data;
  }

  /**
   * Create a new job listing
   */
  static async createJob(jobData: Partial<JobListing>): Promise<JobListing> {
    const response = await api.post('/job-listings', jobData);
    return response.data.data;
  }

  /**
   * Update an existing job listing
   */
  static async updateJob(id: number, jobData: Partial<JobListing>): Promise<JobListing> {
    const response = await api.put(`/job-listings/${id}`, jobData);
    return response.data.data;
  }

  /**
   * Delete a job listing
   */
  static async deleteJob(id: number): Promise<void> {
    await api.delete(`/job-listings/${id}`);
  }

  /**
   * Save a job for later viewing
   */
  static async saveJob(jobId: number): Promise<void> {
    await api.post(`/job-listings/${jobId}/save`);
  }

  /**
   * Remove a job from saved jobs
   */
  static async unsaveJob(jobId: number): Promise<void> {
    await api.delete(`/job-listings/${jobId}/save`);
  }

  /**
   * Get user's saved jobs
   */
  static async getSavedJobs(): Promise<SavedJob[]> {
    const response = await api.get('/candidates/saved-jobs');
    return response.data.data;
  }

  /**
   * Get job market analytics
   */
  static async getJobAnalytics(filters?: {
    location?: string;
    industry?: string;
    period?: 'week' | 'month' | 'quarter' | 'year';
  }): Promise<JobAnalytics> {
    const response = await api.get('/job-listings/analytics', { params: filters });
    return response.data.data;
  }

  /**
   * Get job categories
   */
  static async getCategories(): Promise<any[]> {
    const response = await api.get('/job-categories');
    return response.data.data;
  }

  /**
   * Get popular skills
   */
  static async getPopularSkills(limit: number = 20): Promise<string[]> {
    const response = await api.get('/skills', { params: { limit, popular: true } });
    return response.data.data.map((skill: any) => skill.name);
  }

  /**
   * Get location suggestions
   */
  static async getLocationSuggestions(query: string): Promise<string[]> {
    const response = await api.get('/locations/suggestions', { params: { query } });
    return response.data.data;
  }

  /**
   * Track job view
   */
  static async trackJobView(jobId: number): Promise<void> {
    await api.post(`/job-listings/${jobId}/view`);
  }

  /**
   * Get trending jobs
   */
  static async getTrendingJobs(limit: number = 10): Promise<JobListing[]> {
    const response = await api.get('/job-listings/trending', { params: { limit } });
    return response.data.data;
  }

  /**
   * Get featured jobs
   */
  static async getFeaturedJobs(limit: number = 10): Promise<JobListing[]> {
    const response = await api.get('/job-listings', { 
      params: { featured: true, limit } 
    });
    return response.data.data;
  }

  /**
   * Get urgent jobs
   */
  static async getUrgentJobs(limit: number = 10): Promise<JobListing[]> {
    const response = await api.get('/job-listings', { 
      params: { urgent: true, limit } 
    });
    return response.data.data;
  }

  /**
   * Get jobs by company
   */
  static async getJobsByCompany(companyId: number, filters?: JobSearchFilters): Promise<JobSearchResult> {
    const params = { ...filters, company_id: companyId };
    const response = await api.get('/job-listings', { params });
    return response.data;
  }

  /**
   * Get recent jobs
   */
  static async getRecentJobs(limit: number = 10): Promise<JobListing[]> {
    const response = await api.get('/job-listings', { 
      params: { sort: 'date', limit } 
    });
    return response.data.data;
  }

  /**
   * Search jobs by title or description
   */
  static async quickSearch(query: string): Promise<JobListing[]> {
    const response = await api.get('/job-listings/search', { 
      params: { query, limit: 10 } 
    });
    return response.data.data;
  }
}
