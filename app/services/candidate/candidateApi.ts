// Candidate API service functions
import axios from 'axios';

// Define types for better TypeScript support
interface CertificationData {
  name?: string;
  issuer?: string;
  issuing_organization?: string;
  issue_date?: string;
  issueDate?: string;
  expiration_date?: string;
  expirationDate?: string;
  credential_id?: string;
  credentialId?: string;
  credential_url?: string;
  credentialURL?: string;
  file?: File | null;
}

interface CandidateData {
  [key: string]: any;
  user_id?: number;
  experiences?: any[];
  educations?: any[];
  skills?: any[];
  certifications?: CertificationData[];
  resume_url?: File | string | null;
  profile_picture?: File | string | null;
  cover_image?: File | string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getCandidate = async (id: string | number) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}`);
  return res.data.data;
};

export const createCandidate = async (data: CandidateData) => {
  try {
    // Log the original data for debugging
    console.log('Original data to API:', JSON.stringify(data, null, 2));    // Create properly formatted experience objects focusing only on the field names expected by the database schema
    const formattedExperiences = Array.isArray(data.experiences) ? data.experiences.map((exp: any) => {
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
    const formattedEducations = Array.isArray(data.educations) ? data.educations.map((edu: any) => ({
      institution: edu.institution_name || edu.institution || '',
      degree: edu.degree || '',
      field_of_study: edu.field_of_study || edu.field || '',
      start_date: edu.start_date || edu.startDate || '',
      end_date: edu.end_date || edu.endDate || null,
      description: edu.description || ''
    })) : [];

    // Create properly formatted skills objects
    const formattedSkills = Array.isArray(data.skills) ? data.skills.map((skill: any) => ({
      name: skill.name || ''
    })) : [];    // Create properly formatted certifications objects
    const formattedCertifications = Array.isArray(data.certifications) ? data.certifications.map((cert: any) => {
      const formattedCert = {
        name: cert.name || '',
        issuing_organization: cert.issuer || cert.issuing_organization || '',
        issue_date: cert.issue_date || cert.issueDate || '',
        expiration_date: cert.expiration_date || cert.expirationDate || null,
        credential_id: cert.credential_id || cert.credentialId || '',
        credential_url: cert.credential_url || cert.credentialURL || '',
        file: cert.file || null
      };
      
      // Remove file field if it's an empty object
      if (formattedCert.file && typeof formattedCert.file === 'object' && Object.keys(formattedCert.file).length === 0) {
        formattedCert.file = null;
      }
      
      return formattedCert;
    }) : [];    // Check if we need to use FormData for file uploads
    const hasFileUploads = data.resume_url instanceof File || 
                          data.profile_picture instanceof File || 
                          data.cover_image instanceof File ||
                          formattedCertifications.some(cert => cert.file instanceof File);
    
    // Clean up empty objects before sending
    const cleanData = { ...data };
    
    // Remove empty objects for file fields
    if (cleanData.resume_url && typeof cleanData.resume_url === 'object' && !(cleanData.resume_url instanceof File) && Object.keys(cleanData.resume_url).length === 0) {
      cleanData.resume_url = null;
    }
    if (cleanData.profile_picture && typeof cleanData.profile_picture === 'object' && !(cleanData.profile_picture instanceof File) && Object.keys(cleanData.profile_picture).length === 0) {
      cleanData.profile_picture = null;
    }
    if (cleanData.cover_image && typeof cleanData.cover_image === 'object' && !(cleanData.cover_image instanceof File) && Object.keys(cleanData.cover_image).length === 0) {
      cleanData.cover_image = null;
    }
    
    let apiData;
    let headers;
    let res;
    
    if (hasFileUploads) {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Add basic profile data
      Object.keys(cleanData).forEach(key => {
        if (key !== 'experiences' && key !== 'educations' && key !== 'skills' && 
            key !== 'certifications' && key !== 'resume_url' && 
            key !== 'profile_picture' && key !== 'cover_image') {
          if (cleanData[key] !== null && cleanData[key] !== undefined) {
            formData.append(key, String(cleanData[key]));
          }
        }
      });
      
      // Add resume file if present
      if (cleanData.resume_url instanceof File) {
        formData.append('resume_url', cleanData.resume_url);
      }
      
      // Add profile picture if present
      if (cleanData.profile_picture instanceof File) {
        formData.append('profile_picture', cleanData.profile_picture);
      }
      
      // Add cover image if present
      if (cleanData.cover_image instanceof File) {
        formData.append('cover_image', cleanData.cover_image);
      }
      if (cleanData.cover_image instanceof File) {
        formData.append('cover_image', cleanData.cover_image);
      }
      
      // Handle certification files separately and add to FormData
      const certificationFiles: File[] = [];
      const certificationsWithoutFiles = formattedCertifications.map((cert, index) => {
        if (cert.file instanceof File) {
          certificationFiles.push(cert.file);
          formData.append(`certification_files[${index}]`, cert.file);
          return { ...cert, file: null }; // Remove file from JSON data
        }
        return cert;
      });
      
      // Add JSON data for complex objects (without files)
      formData.append('experiences', JSON.stringify(formattedExperiences));
      formData.append('educations', JSON.stringify(formattedEducations));
      formData.append('skills', JSON.stringify(formattedSkills));
      formData.append('certifications', JSON.stringify(certificationsWithoutFiles));
      
      headers = { 
        'Accept': 'application/json'
        // Don't set Content-Type for FormData, let axios handle it
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
        certifications: formattedCertifications.map(cert => ({ ...cert, file: null })) // Remove files from JSON
      };
        // Important: Remove empty objects and null values to prevent validation errors
      if (apiData.resume_url && (typeof apiData.resume_url === 'object' && Object.keys(apiData.resume_url).length === 0 || apiData.resume_url === null)) {
        delete apiData.resume_url;
      }
      if (apiData.profile_picture && (typeof apiData.profile_picture === 'object' && Object.keys(apiData.profile_picture).length === 0 || apiData.profile_picture === null)) {
        delete apiData.profile_picture;
      }
      if (apiData.cover_image && (typeof apiData.cover_image === 'object' && Object.keys(apiData.cover_image).length === 0 || apiData.cover_image === null)) {
        delete apiData.cover_image;
      }
      
      headers = { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json' 
      };
    }

    console.log('Sending formatted data to API:', hasFileUploads ? 'FormData with files' : apiData);
    
    // Send request with proper headers
    res = await axios.post(`${API_BASE}/candidates`, apiData, { headers });
    return res.data.data;  } catch (error: any) {
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

export const updateCandidate = async (id: string | number, data: CandidateData) => {
  try {
    console.log('Updating candidate with data:', JSON.stringify(data, null, 2));
    
    // Helper function to detect and clean empty objects
    const cleanEmptyObjects = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(cleanEmptyObjects).filter(item => 
          item !== null && item !== undefined && 
          !(typeof item === 'object' && Object.keys(item).length === 0)
        );
      }
      
      if (obj && typeof obj === 'object' && !(obj instanceof File)) {
        const cleaned = Object.entries(obj).reduce((acc, [key, value]) => {
          const cleanedValue = cleanEmptyObjects(value);
          if (cleanedValue !== null && cleanedValue !== undefined && 
              !(typeof cleanedValue === 'object' && !Array.isArray(cleanedValue) && Object.keys(cleanedValue).length === 0)) {
            acc[key] = cleanedValue;
          }
          return acc;
        }, {} as any);
        
        return Object.keys(cleaned).length > 0 ? cleaned : null;
      }
      
      return obj;
    };

    // Clean the data
    const cleanedData = cleanEmptyObjects(data);
    
    // Format experiences properly
    const formattedExperiences = Array.isArray(cleanedData.experiences) ? cleanedData.experiences.map((exp: any) => ({
      title: exp.job_title || exp.title || '',
      company: exp.company_name || exp.company || '',
      company_name: exp.company_name || exp.company || '',
      location: exp.location || '',
      description: exp.description || '',
      start_date: exp.start_date || exp.startDate || '',
      end_date: exp.end_date || exp.endDate || null,
      position: exp.job_title || exp.title || exp.position || '',
      is_current: exp.is_current || false
    })) : [];

    // Format educations properly
    const formattedEducations = Array.isArray(cleanedData.educations) ? cleanedData.educations.map((edu: any) => ({
      institution: edu.school || edu.institution || '',
      degree: edu.degree || '',
      field_of_study: edu.field || edu.field_of_study || '',
      start_date: edu.start_date || edu.startDate || '',
      end_date: edu.end_date || edu.endDate || null,
      description: edu.description || '',
      gpa: edu.gpa || null
    })) : [];

    // Format skills properly
    const formattedSkills = Array.isArray(cleanedData.skills) ? cleanedData.skills.map((skill: any) => ({
      name: typeof skill === 'string' ? skill : (skill.name || skill.skill_name || ''),
      proficiency_level: skill.proficiency_level || skill.level || 'beginner',
      years_of_experience: skill.years_of_experience || skill.years || 0
    })) : [];    // Format certifications properly
    const formattedCertifications = Array.isArray(cleanedData.certifications) ? cleanedData.certifications.map((cert: any) => ({
      name: cert.name || '',
      issuing_organization: cert.issuer || cert.issuing_organization || '',
      issue_date: cert.issue_date || cert.issueDate || '',
      expiration_date: cert.expiration_date || cert.expirationDate || null,
      credential_id: cert.credential_id || cert.credentialId || '',
      credential_url: cert.credential_url || cert.credentialURL || ''
    })) : [];    // Check if we need to use FormData for file uploads (same logic as createCandidate)
    const hasFileUploads = data.resume_url instanceof File || 
                          data.profile_picture instanceof File || 
                          data.cover_image instanceof File ||
                          (Array.isArray(data.certifications) && data.certifications.some((cert: any) => cert.file instanceof File));
    
    console.log('Has file uploads:', hasFileUploads);
    
    let apiData;
    let headers;
    
    if (hasFileUploads) {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Add basic profile data
      Object.keys(cleanedData).forEach(key => {
        if (key !== 'experiences' && key !== 'educations' && key !== 'skills' && 
            key !== 'certifications' && key !== 'resume_url' && 
            key !== 'profile_picture' && key !== 'cover_image') {
          if (cleanedData[key] !== null && cleanedData[key] !== undefined) {
            formData.append(key, String(cleanedData[key]));
          }
        }
      });
      
      // Add files
      if (cleanedData.resume_url instanceof File) {
        formData.append('resume_url', cleanedData.resume_url);
      }
      if (cleanedData.profile_picture instanceof File) {
        formData.append('profile_picture', cleanedData.profile_picture);
      }
      if (cleanedData.cover_image instanceof File) {
        formData.append('cover_image', cleanedData.cover_image);
      }      // Handle certification files
      const certificationsWithoutFiles = (Array.isArray(data.certifications) ? data.certifications : []).map((cert: any, index: number) => {
        if (cert.file instanceof File) {
          formData.append(`certification_files[${index}]`, cert.file);
          return { 
            ...cert, 
            name: cert.name || '',
            issuing_organization: cert.issuer || cert.issuing_organization || '',
            issue_date: cert.issue_date || cert.issueDate || '',
            expiration_date: cert.expiration_date || cert.expirationDate || null,
            credential_id: cert.credential_id || cert.credentialId || '',
            credential_url: cert.credential_url || cert.credentialURL || '',
            file: null 
          };
        }
        return {
          ...cert,
          name: cert.name || '',
          issuing_organization: cert.issuer || cert.issuing_organization || '',
          issue_date: cert.issue_date || cert.issueDate || '',
          expiration_date: cert.expiration_date || cert.expirationDate || null,
          credential_id: cert.credential_id || cert.credentialId || '',
          credential_url: cert.credential_url || cert.credentialURL || ''
        };
      });      // Add JSON data for arrays
      formData.append('experiences', JSON.stringify(formattedExperiences));
      formData.append('educations', JSON.stringify(formattedEducations));
      formData.append('skills', JSON.stringify(formattedSkills));
      formData.append('certifications', JSON.stringify(certificationsWithoutFiles));
      
      // Add method override for PUT request
      formData.append('_method', 'PUT');
      
      headers = { 
        'Accept': 'application/json'
      };
      
      apiData = formData;
    } else {      // Use JSON for regular data (no file uploads)
      apiData = {
        ...cleanedData,
        experiences: formattedExperiences,
        educations: formattedEducations,
        skills: formattedSkills,
        certifications: formattedCertifications.map((cert: any) => ({ 
          ...cert, 
          file: null,
          name: cert.name || '',
          issuing_organization: cert.issuer || cert.issuing_organization || '',
          issue_date: cert.issue_date || cert.issueDate || '',
          expiration_date: cert.expiration_date || cert.expirationDate || null,
          credential_id: cert.credential_id || cert.credentialId || '',
          credential_url: cert.credential_url || cert.credentialURL || ''
        }))
      };
      
      // Remove empty file fields
      if (apiData.resume_url && (typeof apiData.resume_url === 'object' && Object.keys(apiData.resume_url).length === 0 || apiData.resume_url === null)) {
        delete apiData.resume_url;
      }
      if (apiData.profile_picture && (typeof apiData.profile_picture === 'object' && Object.keys(apiData.profile_picture).length === 0 || apiData.profile_picture === null)) {
        delete apiData.profile_picture;
      }
      if (apiData.cover_image && (typeof apiData.cover_image === 'object' && Object.keys(apiData.cover_image).length === 0 || apiData.cover_image === null)) {
        delete apiData.cover_image;
      }
      
      headers = { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json' 
      };
    }    console.log('Sending update data:', hasFileUploads ? 'FormData with files' : apiData);
    
    // If using FormData, log the contents for debugging
    if (hasFileUploads && apiData instanceof FormData) {
      console.log('FormData contents:');
      for (let [key, value] of apiData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
    }
    
    // Use PUT method for updates when not using FormData
    const response = hasFileUploads 
      ? await axios.post(`${API_BASE}/candidates/${id}`, apiData, { headers })
      : await axios.put(`${API_BASE}/candidates/${id}`, apiData, { headers });console.log('Update response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating candidate:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get candidate dashboard data (all-in-one endpoint for dashboard page)
 */
export const getCandidateDashboard = async (id: string | number) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}/dashboard`);
  return res.data.data;
};

/**
 * Get candidate profile completion data
 */
export const getCandidateProfileCompletion = async (id: string | number) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}/profile-completion`);
  return res.data.data;
};

/**
 * Get candidate saved jobs
 */
export const getCandidateSavedJobs = async (id: string | number, params = {}) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}/saved-jobs`, { params });
  return res.data.data;
};

/**
 * Get job recommendations for candidate based on profile
 */
export const getCandidateRecommendations = async (id: string | number) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}/recommendations`);
  return res.data.data;
};

/**
 * Get candidate upcoming interviews
 */
export const getCandidateInterviews = async (id: string | number) => {
  const res = await axios.get(`${API_BASE}/candidates/${id}/interviews`);
  return res.data.data;
};

/**
 * Get detailed candidate with tracking view count
 */
export const getCandidateWithTracking = async (id: string | number) => {
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

export const getCurrentUserCandidateProfile = async () => {
  // Mock implementation for testing without authentication
  // Check if we have a mock candidate profile in localStorage for testing
  const mockProfile = localStorage.getItem('mockCandidateProfile');
  
  if (mockProfile) {
    return {
      candidate: JSON.parse(mockProfile)
    };
  }
  
  // Return null candidate to simulate no profile exists
  return {
    candidate: null
  };
  
  // Original implementation (commented out for now):
  // const res = await axios.get(`${API_BASE}/candidates/me`);
  // return res.data;
};

// Helper function for testing - simulate having a candidate profile
export const setMockCandidateProfile = (profile: any) => {
  localStorage.setItem('mockCandidateProfile', JSON.stringify(profile));
};

// Helper function for testing - clear mock candidate profile
export const clearMockCandidateProfile = () => {
  localStorage.removeItem('mockCandidateProfile');
};