import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const companyService = {
  getCompanies: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/companies`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  getCompany: async (slug) => {
    try {
      const response = await axios.get(`${API_URL}/companies/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching company ${slug}:`, error);
      throw error;
    }
  },

  followCompany: async (companySlug, data = {}) => {
    try {
      const response = await axios.post(`${API_URL}/companies/${companySlug}/follow`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error following company ${companySlug}:`, error);
      throw error;
    }
  },

  unfollowCompany: async (companySlug) => {
    try {
      const response = await axios.delete(`${API_URL}/companies/${companySlug}/follow`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error unfollowing company ${companySlug}:`, error);
      throw error;
    }
  },

  saveCompany: async (companySlug, data = {}) => {
    try {
      const response = await axios.post(`${API_URL}/companies/${companySlug}/save`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error saving company ${companySlug}:`, error);
      throw error;
    }
  },

  unsaveCompany: async (companySlug) => {
    try {
      const response = await axios.delete(`${API_URL}/companies/${companySlug}/save`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error unsaving company ${companySlug}:`, error);
      throw error;
    }
  },

  shareCompany: async (companySlug, data = {}) => {
    try {
      const response = await axios.post(`${API_URL}/companies/${companySlug}/share`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error sharing company ${companySlug}:`, error);
      throw error;
    }
  },

  contactCompany: async (companySlug, data = {}) => {
    try {
      const response = await axios.post(`${API_URL}/companies/${companySlug}/contact`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error contacting company ${companySlug}:`, error);
      throw error;
    }
  }
};
