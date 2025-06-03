import axios from 'axios';
import { 
  JobApplication, 
  ApplicationAnalytics,
  MatchingCandidate 
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

export interface JobApplicationData {
  job_listing_id: number;
  cover_letter?: string;
  resume_url?: string;
  salary_expectation?: number;
  availability_date?: string;
  answers?: Array<{
    question_id: number;
    answer: string;
  }>;
  additional_files?: string[];
}

export interface ApplicationFilters {
  status?: string;
  job_id?: number;
  company_id?: number;
  per_page?: number;
  page?: number;
}

export interface BulkStatusUpdate {
  application_ids: number[];
  status: 'pending' | 'reviewing' | 'interviewed' | 'offered' | 'hired' | 'rejected';
}

export class JobApplicationService {
  /**
   * Get all job applications for the current user
   */
  static async getApplications(filters?: ApplicationFilters): Promise<{
    data: JobApplication[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    const response = await api.get('/job-applications', { params: filters });
    return response.data;
  }

  /**
   * Get a specific job application by ID
   */
  static async getApplication(id: number): Promise<JobApplication> {
    const response = await api.get(`/job-applications/${id}`);
    return response.data.data;
  }

  /**
   * Submit a job application
   */
  static async submitApplication(applicationData: JobApplicationData): Promise<JobApplication> {
    const response = await api.post('/job-applications', applicationData);
    return response.data.data;
  }

  /**
   * Update an existing job application
   */
  static async updateApplication(
    id: number, 
    applicationData: Partial<JobApplicationData>
  ): Promise<JobApplication> {
    const response = await api.put(`/job-applications/${id}`, applicationData);
    return response.data.data;
  }

  /**
   * Delete a job application
   */
  static async deleteApplication(id: number): Promise<void> {
    await api.delete(`/job-applications/${id}`);
  }

  /**
   * Withdraw a job application
   */
  static async withdrawApplication(id: number): Promise<JobApplication> {
    const response = await api.put(`/job-applications/${id}`, { 
      status: 'withdrawn' 
    });
    return response.data.data;
  }

  /**
   * Get application analytics for the current user
   */
  static async getApplicationAnalytics(): Promise<ApplicationAnalytics> {
    const response = await api.get('/job-applications/analytics');
    return response.data.data;
  }

  /**
   * Check if user has applied to a specific job
   */
  static async hasAppliedToJob(jobId: number): Promise<boolean> {
    try {
      const applications = await this.getApplications({ job_id: jobId });
      return applications.data.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get applications by status
   */
  static async getApplicationsByStatus(status: string): Promise<JobApplication[]> {
    const response = await this.getApplications({ status });
    return response.data;
  }

  /**
   * Get pending applications
   */
  static async getPendingApplications(): Promise<JobApplication[]> {
    return this.getApplicationsByStatus('pending');
  }

  /**
   * Get applications under review
   */
  static async getApplicationsUnderReview(): Promise<JobApplication[]> {
    return this.getApplicationsByStatus('reviewing');
  }

  /**
   * Get interviewed applications
   */
  static async getInterviewedApplications(): Promise<JobApplication[]> {
    return this.getApplicationsByStatus('interviewed');
  }

  /**
   * Get offered applications
   */
  static async getOfferedApplications(): Promise<JobApplication[]> {
    return this.getApplicationsByStatus('offered');
  }

  /**
   * Get hired applications
   */
  static async getHiredApplications(): Promise<JobApplication[]> {
    return this.getApplicationsByStatus('hired');
  }

  /**
   * Get rejected applications
   */
  static async getRejectedApplications(): Promise<JobApplication[]> {
    return this.getApplicationsByStatus('rejected');
  }

  /**
   * Get matching candidates for a job listing (for employers)
   */
  static async getMatchingCandidates(
    jobId: number, 
    options?: { limit?: number; min_score?: number }
  ): Promise<MatchingCandidate[]> {
    const response = await api.get(`/job-listings/${jobId}/matching-candidates`, {
      params: options
    });
    return response.data.data;
  }

  /**
   * Bulk update application statuses (for employers)
   */
  static async bulkUpdateStatus(bulkUpdate: BulkStatusUpdate): Promise<number> {
    const response = await api.post('/job-applications/bulk-status', bulkUpdate);
    return response.data.data.updated_count;
  }

  /**
   * Get applications for a specific job (for employers)
   */
  static async getJobApplications(jobId: number, filters?: ApplicationFilters): Promise<{
    data: JobApplication[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    const params = { ...filters, job_id: jobId };
    const response = await api.get('/job-applications', { params });
    return response.data;
  }

  /**
   * Update application status (for employers)
   */
  static async updateApplicationStatus(
    id: number, 
    status: string,
    notes?: string
  ): Promise<JobApplication> {
    const response = await api.put(`/job-applications/${id}`, { 
      status, 
      notes 
    });
    return response.data.data;
  }

  /**
   * Schedule interview for application
   */
  static async scheduleInterview(
    applicationId: number, 
    interviewData: {
      scheduled_at: string;
      type: string;
      notes?: string;
    }
  ): Promise<any> {
    const response = await api.post('/interviews', {
      job_application_id: applicationId,
      ...interviewData
    });
    return response.data.data;
  }

  /**
   * Get application history/timeline
   */
  static async getApplicationHistory(id: number): Promise<any[]> {
    const response = await api.get(`/job-applications/${id}/history`);
    return response.data.data;
  }

  /**
   * Export applications to CSV
   */
  static async exportApplications(filters?: ApplicationFilters): Promise<Blob> {
    const response = await api.get('/job-applications/export', {
      params: { ...filters, format: 'csv' },
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Upload resume for application
   */
  static async uploadResume(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post('/uploads/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.url;
  }

  /**
   * Upload cover letter file
   */
  static async uploadCoverLetter(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('cover_letter', file);
    
    const response = await api.post('/uploads/cover-letter', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.url;
  }

  /**
   * Get application statistics for a company (for employers)
   */
  static async getCompanyApplicationStats(companyId?: number): Promise<{
    total_applications: number;
    applications_by_status: Record<string, number>;
    applications_this_month: number;
    average_time_to_respond: number;
    top_performing_jobs: any[];
  }> {
    const params = companyId ? { company_id: companyId } : {};
    const response = await api.get('/job-applications/company-stats', { params });
    return response.data.data;
  }
}
