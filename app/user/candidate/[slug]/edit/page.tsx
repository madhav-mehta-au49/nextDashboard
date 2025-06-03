'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/app/web/components/header';
import SubHeader from '@/components/subheader';
import Footer from '@/components/footer';
import { getCandidateBySlug, updateCandidate } from '@/app/services/candidate/candidateApi';
import BasicInfoForm from '../../create/components/BasicInfoForm';
import ExperienceForm from '../../create/components/ExperienceForm';
import EducationForm from '../../create/components/EducationForm';
import SkillsForm from '../../create/components/SkillsForm';
import CertificationsForm from '../../create/components/CertificationsForm';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import { Experience, Education, Skill, Certification } from '../../create/type';

interface CandidateData {
  id?: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  about: string;
  website: string;
  portfolio_url: string;
  desired_job_title?: string;
  desired_salary?: string;
  desired_location?: string;
  work_type_preference?: string;
  availability?: string;
  visibility?: string;
  profile_picture?: File | string | null;
  cover_image?: File | string | null;
  resume?: File | string | null;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  certifications: Certification[];
}

export default function EditCandidateProfile() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Additional state variables for BasicInfoForm compatibility
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Get step from URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const stepParam = urlParams.get('step');
      if (stepParam) {
        const step = parseInt(stepParam, 10);
        if (step >= 1 && step <= 5) {
          setCurrentStep(step);
        }
      }
    }
  }, []);
  const [candidateData, setCandidateData] = useState<CandidateData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    headline: '',
    about: '',
    website: '',
    portfolio_url: '',
    desired_job_title: '',
    desired_salary: '',
    desired_location: '',
    work_type_preference: '',
    availability: '',
    visibility: 'public',
    experiences: [],
    educations: [],
    skills: [],
    certifications: []
  });

  const steps = [
    { number: 1, title: 'Basic Information' },
    { number: 2, title: 'Experience' },
    { number: 3, title: 'Education' },
    { number: 4, title: 'Skills' },
    { number: 5, title: 'Certifications' }
  ];
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setIsLoading(true);
        const data = await getCandidateBySlug(slug);
        console.log('Raw API data received:', data);
        console.log('Certifications from API:', data?.certifications);
        console.log('Type of certifications:', typeof data?.certifications);
        console.log('Is certifications an array?', Array.isArray(data?.certifications));

        if (data) {
          const processedCertifications = data.certifications || [];
          console.log('Processed certifications:', processedCertifications);
          console.log('Is processed certifications an array?', Array.isArray(processedCertifications));          // Transform API data to match form component expectations
          const transformedExperiences = (data.experiences || []).map((exp: any) => ({
            id: exp.id?.toString() || '',
            title: exp.position || '',
            company: exp.company_name || '',
            location: exp.location || '',
            startDate: exp.start_date || '',
            endDate: exp.end_date || '',
            current: exp.is_current || false,
            description: exp.description || ''
          }));

          const transformedEducations = (data.educations || []).map((edu: any) => ({
            id: edu.id?.toString() || '',
            institution: edu.institution || '',
            degree: edu.degree || '',
            field: edu.field_of_study || '',
            startDate: edu.start_date || '',
            endDate: edu.end_date || '',
            current: edu.is_current || false,
            description: edu.description || ''
          }));

          const transformedSkills = (data.skills || []).map((skill: any) => ({
            id: skill.id?.toString() || '',
            name: skill.name || ''
          })); const transformedCertifications = processedCertifications.map((cert: any) => ({
            id: cert.id?.toString() || '',
            name: cert.name || '',
            issuer: cert.issuing_organization || '',
            issueDate: cert.issue_date ? cert.issue_date.split('T')[0] : '',
            expirationDate: cert.expiration_date ? cert.expiration_date.split('T')[0] : '',
            noExpiration: !cert.expiration_date,
            credentialId: cert.credential_id || '',
            credentialURL: cert.credential_url || '',
            file: null
          }));

          setCandidateData({
            id: data.id,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            headline: data.headline || '',
            about: data.about || '',
            website: data.website || '',
            portfolio_url: data.portfolio_url || '',
            desired_job_title: data.desired_job_title || '',
            desired_salary: data.desired_salary || '',
            desired_location: data.desired_location || '',
            work_type_preference: data.work_type_preference || '',
            availability: data.availability || '',
            visibility: data.visibility || 'public',
            profile_picture: data.profile_picture,
            cover_image: data.cover_image,
            resume: data.resume_url,
            experiences: transformedExperiences,
            educations: transformedEducations,
            skills: transformedSkills,
            certifications: transformedCertifications
          });

          // Initialize separate state variables for BasicInfoForm compatibility
          setProfilePicture(data.profile_picture || null);
          setCoverImage(data.cover_image || null);
          // Note: resume_url from API is typically a string URL, not a File object
          // For editing, we'll keep it as null unless it's actually a File object
        } else {
          setError('Candidate profile not found');
        }
      } catch (err) {
        console.error('Error fetching candidate data:', err);
        setError('Failed to load candidate profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCandidateData();
    }
  }, [slug]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }; const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      if (!candidateData.id) {
        throw new Error('Candidate ID not found');
      }

      // Debug logging
      console.log('handleSave - candidateData:', candidateData);
      console.log('handleSave - candidateData.certifications:', candidateData.certifications);
      console.log('handleSave - Type of candidateData.certifications:', typeof candidateData.certifications);
      console.log('handleSave - Is candidateData.certifications an array?', Array.isArray(candidateData.certifications));      // Ensure all arrays are safe
      const safeExperiences = Array.isArray(candidateData.experiences) ? candidateData.experiences : [];
      const safeEducations = Array.isArray(candidateData.educations) ? candidateData.educations : [];
      const safeSkills = Array.isArray(candidateData.skills) ? candidateData.skills : [];
      const safeCertifications = Array.isArray(candidateData.certifications) ? candidateData.certifications : [];      // Transform form data back to API format
      const apiData = {
        id: candidateData.id,
        name: candidateData.name,
        email: candidateData.email,
        phone: candidateData.phone,
        location: candidateData.location,
        headline: candidateData.headline,
        about: candidateData.about,
        website: candidateData.website,
        portfolio_url: candidateData.portfolio_url,
        desired_job_title: candidateData.desired_job_title,
        desired_salary: candidateData.desired_salary,
        desired_location: candidateData.desired_location,
        work_type_preference: candidateData.work_type_preference,
        availability: candidateData.availability,
        visibility: candidateData.visibility,
        profile_picture: candidateData.profile_picture,
        cover_image: candidateData.cover_image,
        resume: candidateData.resume, experiences: safeExperiences.map(exp => ({
          id: exp.id && exp.id !== '' ? parseInt(exp.id) : undefined,
          job_title: exp.title,
          company_name: exp.company,
          location: exp.location,
          start_date: exp.startDate,
          end_date: exp.endDate,
          is_current: exp.current,
          description: exp.description
        })),
        educations: safeEducations.map(edu => ({
          id: edu.id && edu.id !== '' ? parseInt(edu.id) : undefined,
          institution: edu.institution,
          degree: edu.degree,
          field_of_study: edu.field,
          start_date: edu.startDate,
          end_date: edu.endDate,
          is_current: edu.current,
          description: edu.description
        })),
        skills: safeSkills.map(skill => ({
          id: skill.id && skill.id !== '' ? parseInt(skill.id) : undefined,
          name: skill.name
        })), certifications: safeCertifications.map(cert => ({
          id: cert.id && cert.id !== '' ? parseInt(cert.id) : undefined,
          name: cert.name,
          issuing_organization: cert.issuer,
          issue_date: cert.issueDate,
          expiration_date: cert.noExpiration ? undefined : (cert.expirationDate || undefined),
          credential_id: cert.credentialId,
          credential_url: cert.credentialURL,
          file: cert.file
        }))
      };

      console.log('API Data being sent:', apiData);
      console.log('API Data experiences:', apiData.experiences);
      console.log('API Data educations:', apiData.educations);
      console.log('API Data skills:', apiData.skills);
      console.log('API Data certifications:', apiData.certifications);

      const response = await updateCandidate(candidateData.id, apiData);

      if (response) {
        // Redirect back to profile page
        router.push(`/user/candidate/${slug}`);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err: any) {
      console.error('Error updating candidate:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/user/candidate/${slug}`);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Header />
        <SubHeader />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            <p className="mt-4 text-gray-600">Loading profile for editing...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Header />
        <SubHeader />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-red-50 p-6 rounded-md text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
            <p>{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              onClick={() => router.push(`/user/candidate/${slug}`)}
            >
              Back to Profile
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <SubHeader />

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-teal-600 hover:text-teal-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Profile
          </button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Edit Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Update your professional information
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <FaSave className="mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${currentStep >= step.number
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                    }`}
                  onClick={() => setCurrentStep(step.number)}
                >
                  {step.number}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white hidden md:block">
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`ml-4 h-1 w-16 lg:w-24 ${currentStep > step.number ? 'bg-teal-600' : 'bg-gray-200'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">          {currentStep === 1 && (
          <BasicInfoForm
            profileData={{
              name: candidateData.name,
              headline: candidateData.headline,
              location: candidateData.location,
              about: candidateData.about,
              email: candidateData.email,
              phone: candidateData.phone,
              website: candidateData.website,
              resume_url: candidateData.resume,
              desired_job_title: candidateData.desired_job_title,
              desired_salary: candidateData.desired_salary ? Number(candidateData.desired_salary) : undefined,
              desired_location: candidateData.desired_location,
              work_type_preference: candidateData.work_type_preference as 'remote' | 'onsite' | 'hybrid' | 'flexible'
            }}
            setProfileData={(newProfileData) => {
              if (typeof newProfileData === 'function') {
                setCandidateData(prev => {
                  const updated = newProfileData({
                    name: prev.name,
                    headline: prev.headline,
                    location: prev.location,
                    about: prev.about,
                    email: prev.email,
                    phone: prev.phone,
                    website: prev.website,
                    resume_url: prev.resume,
                    desired_job_title: prev.desired_job_title,
                    desired_salary: prev.desired_salary ? Number(prev.desired_salary) : undefined,
                    desired_location: prev.desired_location,
                    work_type_preference: prev.work_type_preference as 'remote' | 'onsite' | 'hybrid' | 'flexible'
                  }); return {
                    ...prev,
                    name: updated.name,
                    headline: updated.headline,
                    location: updated.location,
                    about: updated.about,
                    email: updated.email,
                    phone: updated.phone,
                    website: updated.website,
                    resume: updated.resume_url,
                    desired_job_title: updated.desired_job_title || '',
                    desired_salary: updated.desired_salary?.toString() || '',
                    desired_location: updated.desired_location || '',
                    work_type_preference: updated.work_type_preference || ''
                  };
                });
              } else {
                setCandidateData(prev => ({
                  ...prev,
                  name: newProfileData.name,
                  headline: newProfileData.headline,
                  location: newProfileData.location,
                  about: newProfileData.about,
                  email: newProfileData.email,
                  phone: newProfileData.phone,
                  website: newProfileData.website,
                  resume: newProfileData.resume_url,
                  desired_job_title: newProfileData.desired_job_title || '',
                  desired_salary: newProfileData.desired_salary?.toString() || '',
                  desired_location: newProfileData.desired_location || '',
                  work_type_preference: newProfileData.work_type_preference || ''
                }));
              }
            }} profilePicture={profilePicture}
            setProfilePicture={(newPicture) => {
              const pictureValue = typeof newPicture === 'function' ? newPicture(profilePicture) : newPicture;
              setProfilePicture(pictureValue);
              setCandidateData(prev => ({ ...prev, profile_picture: pictureValue }));
            }}
            coverImage={coverImage}
            setCoverImage={(newCover) => {
              const coverValue = typeof newCover === 'function' ? newCover(coverImage) : newCover;
              setCoverImage(coverValue);
              setCandidateData(prev => ({ ...prev, cover_image: coverValue }));
            }}
            resumeFile={resumeFile}
            setResumeFile={(newResume) => {
              const resumeValue = typeof newResume === 'function' ? newResume(resumeFile) : newResume;
              setResumeFile(resumeValue);
              setCandidateData(prev => ({ ...prev, resume: resumeValue }));
            }}
          />
        )}          {currentStep === 2 && (
          <ExperienceForm
            experiences={candidateData.experiences}
            setExperiences={(newExperiences) => {
              if (typeof newExperiences === 'function') {
                setCandidateData(prev => ({ ...prev, experiences: newExperiences(prev.experiences) }));
              } else {
                setCandidateData(prev => ({ ...prev, experiences: newExperiences }));
              }
            }}
          />
        )}

          {currentStep === 3 && (
            <EducationForm
              educations={candidateData.educations}
              setEducations={(newEducations) => {
                if (typeof newEducations === 'function') {
                  setCandidateData(prev => ({ ...prev, educations: newEducations(prev.educations) }));
                } else {
                  setCandidateData(prev => ({ ...prev, educations: newEducations }));
                }
              }}
            />
          )}

          {currentStep === 4 && (
            <SkillsForm
              skills={candidateData.skills}
              setSkills={(newSkills) => {
                if (typeof newSkills === 'function') {
                  setCandidateData(prev => ({ ...prev, skills: newSkills(prev.skills) }));
                } else {
                  setCandidateData(prev => ({ ...prev, skills: newSkills }));
                }
              }}
            />
          )}

          {currentStep === 5 && (
            <CertificationsForm
              certifications={candidateData.certifications}
              setCertifications={(newCertifications) => {
                if (typeof newCertifications === 'function') {
                  setCandidateData(prev => ({ ...prev, certifications: newCertifications(prev.certifications) }));
                } else {
                  setCandidateData(prev => ({ ...prev, certifications: newCertifications }));
                }
              }}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>

            {currentStep < steps.length && (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}