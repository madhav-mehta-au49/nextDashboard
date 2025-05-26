import axios from 'axios';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getCandidateEducations = async (candidateId: string) => {
  const res = await axios.get(`${API_BASE}/candidates/${candidateId}/educations`);
  return res.data.data;
};

export const createCandidateEducation = async (candidateId: string, data: any) => {
  const res = await axios.post(`${API_BASE}/candidates/${candidateId}/educations`, data);
  return res.data.data;
};

export const updateCandidateEducation = async (candidateId: string, educationId: string, data: any) => {
  const res = await axios.put(`${API_BASE}/candidates/${candidateId}/educations/${educationId}`, data);
  return res.data.data;
};

export const deleteCandidateEducation = async (candidateId: string, educationId: string) => {
  const res = await axios.delete(`${API_BASE}/candidates/${candidateId}/educations/${educationId}`);
  return res.data;
};