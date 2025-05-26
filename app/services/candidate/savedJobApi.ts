import axios from 'axios';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getCandidateSavedJobs = async (candidateId: string) => {
  const res = await axios.get(`${API_BASE}/candidates/${candidateId}/saved-jobs`);
  return res.data.data;
};

export const saveJobForCandidate = async (candidateId: string, data: any) => {
  const res = await axios.post(`${API_BASE}/candidates/${candidateId}/saved-jobs`, data);
  return res.data.data;
};

export const removeSavedJobForCandidate = async (candidateId: string, savedJobId: string) => {
  const res = await axios.delete(`${API_BASE}/candidates/${candidateId}/saved-jobs/${savedJobId}`);
  return res.data;
};