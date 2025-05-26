// Interview API service functions
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Get all interviews with pagination and filtering
 */
export const getInterviews = async (params = {}) => {
  const res = await axios.get(`${API_BASE}/interviews`, { params });
  return res.data.data;
};

/**
 * Get specific interview by ID
 */
export const getInterview = async (id) => {
  const res = await axios.get(`${API_BASE}/interviews/${id}`);
  return res.data.data;
};

/**
 * Create a new interview
 */
export const createInterview = async (data) => {
  const res = await axios.post(`${API_BASE}/interviews`, data);
  return res.data.data;
};

/**
 * Update an existing interview
 */
export const updateInterview = async (id, data) => {
  const res = await axios.put(`${API_BASE}/interviews/${id}`, data);
  return res.data.data;
};

/**
 * Delete an interview
 */
export const deleteInterview = async (id) => {
  const res = await axios.delete(`${API_BASE}/interviews/${id}`);
  return res.data;
};

/**
 * Add feedback to an interview
 */
export const addInterviewFeedback = async (id, data) => {
  const res = await axios.post(`${API_BASE}/interviews/${id}/feedback`, data);
  return res.data.data;
};

/**
 * Reschedule an interview
 */
export const rescheduleInterview = async (id, data) => {
  const res = await axios.post(`${API_BASE}/interviews/${id}/reschedule`, data);
  return res.data.data;
};

/**
 * Cancel an interview
 */
export const cancelInterview = async (id, data = {}) => {
  const res = await axios.post(`${API_BASE}/interviews/${id}/cancel`, data);
  return res.data.data;
};

/**
 * Get interviews for a calendar view
 */
export const getInterviewsCalendar = async (startDate, endDate) => {
  const res = await axios.get(`${API_BASE}/interviews-calendar`, {
    params: { start_date: startDate, end_date: endDate }
  });
  return res.data.data;
};