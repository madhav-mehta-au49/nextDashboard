import axios from 'axios';

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
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Interview {
  id: number;
  job_application_id: number;
  interview_type: 'phone' | 'video' | 'in-person' | 'panel';
  scheduled_at: string;
  duration_minutes: number;
  location?: string;
  meeting_link?: string;
  interviewer_ids?: number[];
  interview_notes?: string;
  candidate_notes?: string;
  internal_notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  timezone: string;
  reminded_at?: string;
  primary_interviewer?: {
    id: number;
    name: string;
    email: string;
  };
  job_application?: {
    id: number;
    status: string;
    candidate?: {
      id: number;
      name: string;
      email: string;
    };
    job_listing?: {
      id: number;
      title: string;
      company?: {
        id: number;
        name: string;
        logo?: string;
      };
    };
  };
  created_at: string;
  updated_at: string;
}

export interface InterviewData {
  job_application_id: number;
  interview_type: 'phone' | 'video' | 'in-person' | 'panel';
  scheduled_at: string;
  duration_minutes: number;
  location?: string;
  meeting_link?: string;
  interviewer_ids?: number[];
  interview_notes?: string;
  candidate_notes?: string;
  internal_notes?: string;
  timezone?: string;
}

export interface InterviewFilters {
  status?: string;
  type?: string;
  start_date?: string;
  end_date?: string;
  interviewer_id?: number;
  job_application_id?: number;
  sort?: 'recent' | 'upcoming' | 'past';
  per_page?: number;
  page?: number;
}

export class InterviewService {
  /**
   * Get all interviews with filtering and pagination
   */
  static async getInterviews(filters?: InterviewFilters): Promise<{
    data: Interview[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    const response = await api.get('/interviews', { params: filters });
    return response.data;
  }

  /**
   * Get a specific interview by ID
   */
  static async getInterview(id: number): Promise<Interview> {
    const response = await api.get(`/interviews/${id}`);
    return response.data.data;
  }

  /**
   * Create a new interview
   */
  static async createInterview(data: InterviewData): Promise<Interview> {
    const response = await api.post('/interviews', data);
    return response.data.data;
  }

  /**
   * Update an existing interview
   */
  static async updateInterview(id: number, data: Partial<InterviewData>): Promise<Interview> {
    const response = await api.put(`/interviews/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete an interview
   */
  static async deleteInterview(id: number): Promise<void> {
    await api.delete(`/interviews/${id}`);
  }
  /**
   * Get interviews for a specific candidate
   */
  static async getCandidateInterviews(candidateId: number): Promise<Interview[]> {
    const response = await api.get(`/candidates/${candidateId}/interviews`);
    return response.data.data;
  }

  /**
   * Get interviews for a specific job application
   */
  static async getApplicationInterviews(applicationId: number): Promise<Interview[]> {
    const response = await this.getInterviews({ 
      job_application_id: applicationId,
      sort: 'upcoming' 
    });
    return response.data;
  }

  /**
   * Add feedback to an interview
   */
  static async addFeedback(id: number, feedback: string, outcome: 'passed' | 'failed' | 'pending'): Promise<Interview> {
    const response = await api.post(`/interviews/${id}/feedback`, { feedback, outcome });
    return response.data.data;
  }

  /**
   * Reschedule an interview
   */
  static async rescheduleInterview(id: number, data: { scheduled_at: string; notes?: string }): Promise<Interview> {
    const response = await api.post(`/interviews/${id}/reschedule`, data);
    return response.data.data;
  }

  /**
   * Cancel an interview
   */
  static async cancelInterview(id: number, notes?: string): Promise<Interview> {
    const response = await api.post(`/interviews/${id}/cancel`, { notes });
    return response.data.data;
  }

  /**
   * Get interviews for calendar view
   */
  static async getCalendarInterviews(startDate: string, endDate: string): Promise<any[]> {
    const response = await api.get('/interviews-calendar', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data.data;
  }

  /**
   * Schedule interview for a job application
   */
  static async scheduleInterviewForApplication(
    applicationId: number,
    interviewData: Omit<InterviewData, 'job_application_id'>
  ): Promise<Interview> {
    const data: InterviewData = {
      job_application_id: applicationId,
      ...interviewData
    };
    return this.createInterview(data);
  }
}
