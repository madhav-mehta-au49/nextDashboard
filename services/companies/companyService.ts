import axios from 'axios';
import { Company, CompanyFilter } from '../../app/companies/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const companyService = {
  // Get a list of companies with optional filtering
  async getCompanies(filters?: CompanyFilter) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params if they exist
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const response = await axios.get(`${API_URL}/companies?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  // Get a single company by ID or slug
  async getCompany(companyId: string) {
    try {
      const response = await axios.get(`${API_URL}/companies/${companyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching company ${companyId}:`, error);
      throw error;
    }
  },

  // Get company job listings
  async getCompanyJobs(companyId: string, page = 1, perPage = 10) {
    try {
      const response = await axios.get(
        `${API_URL}/companies/${companyId}/job-listings?page=${page}&per_page=${perPage}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching jobs for company ${companyId}:`, error);
      throw error;
    }
  },

  // Create a new company
  async createCompany(companyData: Partial<Company>) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(`${API_URL}/companies`, companyData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },

  // Update an existing company
  async updateCompany(companyId: string, companyData: Partial<Company>) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.put(`${API_URL}/companies/${companyId}`, companyData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating company ${companyId}:`, error);
      throw error;
    }
  },

  // Delete a company
  async deleteCompany(companyId: string) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.delete(`${API_URL}/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting company ${companyId}:`, error);
      throw error;
    }
  },

  // Follow a company
  async followCompany(companyId: string) {
    try {
      const token = localStorage.getItem('token');
      // For testing, we're allowing non-authenticated requests
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(`${API_URL}/companies/${companyId}/follow`, {}, { headers });
      console.log(`Successfully followed company ${companyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error following company ${companyId}:`, error);
      throw error;
    }
  },

  // Unfollow a company
  async unfollowCompany(companyId: string) {
    try {
      const token = localStorage.getItem('token');
      // For testing, we're allowing non-authenticated requests
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.delete(`${API_URL}/companies/${companyId}/follow`, { headers });
      console.log(`Successfully unfollowed company ${companyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error unfollowing company ${companyId}:`, error);
      throw error;
    }
  },

  // Save a company
  async saveCompany(companyId: string) {
    try {
      const token = localStorage.getItem('token');
      // For testing, we're allowing non-authenticated requests
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(`${API_URL}/companies/${companyId}/save`, {}, { headers });
      console.log(`Successfully saved company ${companyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error saving company ${companyId}:`, error);
      throw error;
    }
  },

  // Unsave a company
  async unsaveCompany(companyId: string) {
    try {
      const token = localStorage.getItem('token');
      // For testing, we're allowing non-authenticated requests
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.delete(`${API_URL}/companies/${companyId}/save`, { headers });
      console.log(`Successfully unsaved company ${companyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error unsaving company ${companyId}:`, error);
      throw error;
    }
  },

  // Get list of companies followed by the user
  async getFollowedCompanies() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_URL}/followed-companies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching followed companies:', error);
      throw error;
    }
  },

  // Get list of companies saved by the user
  async getSavedCompanies() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_URL}/saved-companies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching saved companies:', error);
      throw error;
    }
  }
};

export default companyService;
