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

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface JobApplicationData {
  job_listing_id: number;
  
  // Personal Information
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  current_location: string;
  linkedin_url?: string;
  portfolio_url?: string;
  
  // Professional Information
  current_job_title: string;
  current_company: string;
  total_experience?: string;
  relevant_experience?: string;
  current_salary?: number;
  notice_period?: string;
  work_type_preference?: string;
  willing_to_relocate?: string;
  
  // Application Details
  cover_letter?: string;
  salary_expectation?: number;
  availability_date?: string;
  motivation_letter?: string;
  key_strengths?: string[];
  career_goals?: string;
  
  // Files
  resume_file?: File;
  cover_letter_file?: File;
  additional_files?: File[];
  
  // Company Questions
  answers?: Array<{
    question_id: number;
    answer: string;
  }>;
}

export interface ApplicationFilters {
  status?: string;
  job_id?: number;
  company_id?: number | null;
  per_page?: number;
  page?: number;
  search?: string;
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
    try {
      console.log('Submitting application with data:', {
        ...applicationData,
        resume_file: applicationData.resume_file ? {
          name: applicationData.resume_file.name,
          type: applicationData.resume_file.type,
          size: applicationData.resume_file.size
        } : null
      });

      // Create FormData instance
      const formData = new FormData();      // Add all non-file fields
      Object.entries(applicationData).forEach(([key, value]) => {
        if (!value) return; // Skip null/undefined values

        // Skip file fields - handle them separately
        if (key === 'resume_file' || key === 'cover_letter_file' || key === 'additional_files') {
          return;
        }        // Special handling for willing_to_relocate field to ensure Laravel compatibility
        if (key === 'willing_to_relocate') {
          const val = value?.toString().toLowerCase();
          if (val === 'yes') {
            formData.append('willing_to_relocate', '1');
          } else if (val === 'no') {
            formData.append('willing_to_relocate', '0');
          } else {
            formData.append('willing_to_relocate', '');
          }
          return;
        }

        // Special handling for key_strengths array
        if (key === 'key_strengths' && Array.isArray(value)) {
          // If it's empty, skip it
          if (value.length === 0) return;          // Send each value as a separate item in the array for proper FormData handling
          value.forEach((strength, index) => {
            formData.append(`key_strengths[${index}]`, String(strength));
          });
        }
        // Handle other arrays and objects by converting to JSON string
        else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      // Handle resume file
      if (applicationData.resume_file instanceof File) {
        console.log('Adding resume:', applicationData.resume_file.name, applicationData.resume_file.type);
        formData.append('resume_file', applicationData.resume_file, applicationData.resume_file.name);
      }

      // Handle cover letter file
      if (applicationData.cover_letter_file instanceof File) {
        console.log('Adding cover letter:', applicationData.cover_letter_file.name);
        formData.append('cover_letter_file', applicationData.cover_letter_file, applicationData.cover_letter_file.name);
      }

      // Handle additional files
      if (Array.isArray(applicationData.additional_files)) {
        applicationData.additional_files.forEach((file, index) => {
          if (file instanceof File) {
            console.log(`Adding additional file ${index}:`, file.name);
            formData.append(`additional_files[]`, file, file.name);
          }
        });
      }

      // Log FormData entries for debugging
      console.log('FormData entries:');
      for (const entry of formData.entries()) {
        const [key, value] = entry;
        console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      // Create a new axios instance for this request to avoid header conflicts
      const response = await axios.post(`${API_BASE}/job-applications`, formData, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
        }
      });

      console.log('Application submitted successfully:', response.data);
      return response.data.data;
    } catch (error: any) {
      const errorDetails = {
        message: error.message,
        response: {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        }
      };
      console.error('Job application submission failed:', errorDetails);
      
      // Throw a more descriptive error
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while submitting the application. Please try again.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Network error occurred. Please check your internet connection and try again.');
      } else {
        throw error;
      }
    }
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
