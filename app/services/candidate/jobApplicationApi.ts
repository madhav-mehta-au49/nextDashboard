import axios from 'axios';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getCandidateJobApplications = async (candidateId: string) => {
  const res = await axios.get(`${API_BASE}/candidates/${candidateId}/applications`);
  return res.data.data;
};

export const applyToJob = async (candidateId: string, data: any) => {
  const res = await axios.post(`${API_BASE}/job-applications`, { ...data, candidate_id: candidateId });
  return res.data.data;
};

export const updateJobApplication = async (applicationId: string, data: any) => {
  const res = await axios.put(`${API_BASE}/job-applications/${applicationId}`, data);
  return res.data.data;
};

export const deleteJobApplication = async (applicationId: string) => {
  const res = await axios.delete(`${API_BASE}/job-applications/${applicationId}`);
  return res.data;
};