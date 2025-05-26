import axios from 'axios';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getCandidateCertifications = async (candidateId: string) => {
  const res = await axios.get(`${API_BASE}/candidates/${candidateId}/certifications`);
  return res.data.data;
};

export const createCandidateCertification = async (candidateId: string, data: any) => {
  const res = await axios.post(`${API_BASE}/candidates/${candidateId}/certifications`, data);
  return res.data.data;
};

export const updateCandidateCertification = async (candidateId: string, certificationId: string, data: any) => {
  const res = await axios.put(`${API_BASE}/candidates/${candidateId}/certifications/${certificationId}`, data);
  return res.data.data;
};

export const deleteCandidateCertification = async (candidateId: string, certificationId: string) => {
  const res = await axios.delete(`${API_BASE}/candidates/${candidateId}/certifications/${certificationId}`);
  return res.data;
};