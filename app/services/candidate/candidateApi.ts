// Candidate API service functions
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getCandidate = async (id) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}`);
  return res.data.data;
};

export const createCandidate = async (data) => {
  try {
    // Log the original data for debugging
    console.log('Original data to API:', JSON.stringify(data, null, 2));

    // Create properly formatted experience objects focusing only on the field names expected by the database schema
    const formattedExperiences = Array.isArray(data.experiences) ? data.experiences.map(exp => {
      // Only include fields that match the database schema exactly
      return {
        title: exp.job_title || exp.title || '',
        company: exp.company_name || exp.company || '',
        company_name: exp.company_name || exp.company || '', // Add company_name to match backend expectations
        location: exp.location || '',
        description: exp.description || '',
        start_date: exp.start_date || exp.startDate || '',
        end_date: exp.end_date || exp.endDate || null,
        is_current: exp.is_current !== undefined ? exp.is_current : (exp.current || false)
      };
    }) : [];

    // Create properly formatted education objects
    const formattedEducations = Array.isArray(data.educations) ? data.educations.map(edu => ({
      institution: edu.institution_name || edu.institution || '',
      degree: edu.degree || '',
      field_of_study: edu.field_of_study || edu.field || '',
      start_date: edu.start_date || edu.startDate || '',
      end_date: edu.end_date || edu.endDate || null,
      description: edu.description || ''
    })) : [];

    // Create properly formatted skills objects
    const formattedSkills = Array.isArray(data.skills) ? data.skills.map(skill => ({
      name: skill.name || ''
    })) : [];

    // Create properly formatted certifications objects
    const formattedCertifications = Array.isArray(data.certifications) ? data.certifications.map(cert => ({
      name: cert.name || '',
      issuing_organization: cert.issuing_organization || cert.issuer || '',
      issue_date: cert.issue_date || cert.issueDate || '',
      credential_id: cert.credential_id || cert.credentialId || ''
    })) : [];

    // Check if we need to use FormData for file uploads
    const hasFileUploads = data.resume_url instanceof File || 
                          data.profile_picture instanceof File || 
                          data.cover_image instanceof File;
    
    let apiData;
    let headers;
    let res;
    
    if (hasFileUploads) {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Add basic profile data
      Object.keys(data).forEach(key => {
        if (key !== 'experiences' && key !== 'educations' && key !== 'skills' && 
            key !== 'certifications' && key !== 'resume_url' && 
            key !== 'profile_picture' && key !== 'cover_image') {
          formData.append(key, data[key]);
        }
      });
      
      // Add resume file if present
      if (data.resume_url instanceof File) {
        formData.append('resume_url', data.resume_url);
      }
      
      // Add profile picture if present
      if (data.profile_picture instanceof File) {
        formData.append('profile_picture', data.profile_picture);
      }
      
      // Add cover image if present
      if (data.cover_image instanceof File) {
        formData.append('cover_image', data.cover_image);
      }
      
      // Add JSON data for complex objects
      formData.append('experiences', JSON.stringify(formattedExperiences));
      formData.append('educations', JSON.stringify(formattedEducations));
      formData.append('skills', JSON.stringify(formattedSkills));
      formData.append('certifications', JSON.stringify(formattedCertifications));
      
      headers = { 
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      };
      
      apiData = formData;
    } else {
      // Use JSON for regular data
      apiData = {
        ...data,
        user_id: data.user_id || 1,
        experiences: formattedExperiences,
        educations: formattedEducations,
        skills: formattedSkills,
        certifications: formattedCertifications
      };
      
      // Important: Remove empty resume_url object to prevent validation errors
      if (apiData.resume_url && Object.keys(apiData.resume_url).length === 0) {
        delete apiData.resume_url;
      }
      
      headers = { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json' 
      };
    }

    console.log('Sending formatted data to API:', hasFileUploads ? 'FormData with files' : apiData);
    
    // Send request with proper headers
    res = await axios.post(`${API_BASE}/candidates`, apiData, { headers });
    return res.data.data;
  } catch (error) {
    // Enhanced error logging
    if (error.response && error.response.data) {
      console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
      
      // Add special debugging for experiences-related errors
      if (error.response.data.error && error.response.data.error.includes('company_name')) {
        console.error('DATABASE SCHEMA MISMATCH DETECTED: The backend expects a "company_name" field, but the database schema only has a "company" field.');
      }
    }
    console.error('API Error:', error.message || error);
    throw error;
  }
};

export const updateCandidate = async (id, data) => {
  const res = await axios.put(`${API_BASE}/candidates/${id}`, data);
  return res.data.data;
};

export const getCandidateApplications = async (id) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}/applications`);
  return res.data.data;
};

export const getCandidateSkills = async (id) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}`);
  return res.data.data.skills;
};

export const addCandidateSkill = async (id, skillId, endorsements = 0) => {
  const res = await axios.post(`${API_BASE}/candidates/${id}/skills`, { skill_id: skillId, endorsements });
  return res.data;
};

export const removeCandidateSkill = async (id, skillId) => {
  const res = await axios.delete(`${API_BASE}/candidates/${id}/skills`, { data: { skill_id: skillId } });
  return res.data;
};

// Enhanced functions for the candidate module

/**
 * Get candidate dashboard data (all-in-one endpoint for dashboard page)
 */
export const getCandidateDashboard = async (id) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}/dashboard`);
  return res.data.data;
};

/**
 * Get candidate profile completion data
 */
export const getCandidateProfileCompletion = async (id) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}/profile-completion`);
  return res.data.data;
};

/**
 * Get candidate saved jobs
 */
export const getCandidateSavedJobs = async (id, params = {}) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}/saved-jobs`, { params });
  return res.data.data;
};

/**
 * Get job recommendations for candidate based on profile
 */
export const getCandidateRecommendations = async (id) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}/recommendations`);
  return res.data.data;
};

/**
 * Get candidate upcoming interviews
 */
export const getCandidateInterviews = async (id) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}/interviews`);
  return res.data.data;
};

/**
 * Get detailed candidate with tracking view count
 */
export const getCandidateWithTracking = async (id) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}`, {
    params: { track_view: true }
  });
  return res.data.data;
};

/**
 * Get candidate data by slug (name)
 */
export const getCandidateBySlug = async (slug: string) => {
  try {
    const res = await axios.get(`${API_BASE}/candidates/slug/${encodeURIComponent(slug)}`);
    return res.data.data;
  } catch (error: any) {
    console.error(`Error fetching candidate by slug "${slug}":`, 
      error.response?.data?.message || error.message);
    throw error;
  }
};