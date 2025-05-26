import axios from 'axios';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getCandidateExperiences = async (candidateId: string) => {
  const res = await axios.get(`${API_BASE}/candidates/${candidateId}/experiences`);
  return res.data.data;
};

export const createCandidateExperience = async (candidateId: string, data: any) => {
  const res = await axios.post(`${API_BASE}/candidates/${candidateId}/experiences`, data);
  return res.data.data;
};

export const updateCandidateExperience = async (candidateId: string, experienceId: string, data: any) => {
  const res = await axios.put(`${API_BASE}/candidates/${candidateId}/experiences/${experienceId}`, data);
  return res.data.data;
};

export const deleteCandidateExperience = async (candidateId: string, experienceId: string) => {
  const res = await axios.delete(`${API_BASE}/candidates/${candidateId}/experiences/${experienceId}`);
  return res.data;
};