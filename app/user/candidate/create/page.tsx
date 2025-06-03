'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheck } from 'react-icons/fa';
import BasicInfoForm from './components/BasicInfoForm';
import ExperienceForm from './components/ExperienceForm';
import EducationForm from './components/EducationForm';
import SkillsForm from './components/SkillsForm';
import CertificationsForm from './components/CertificationsForm';
import ReviewProfile from './components/ReviewProfile';
// Import commented out since we're not using auth for now
// import { useAuth } from '@/hooks/useAuth';
import {
  Experience,
  Education,
  Skill,
  Certification,
  ProfileData
} from './type'; // Fixed import path from ./types to ./type

export default function CreateCandidateProfile() {
  const router = useRouter();
  // Comment out auth for now
  // const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // Basic profile information
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    headline: '',
    location: '',
    about: '',
    email: '',
    phone: '',
    website: '',
    resume_url: null,
    desired_job_title: '',
    desired_salary: undefined,
    desired_location: '',
    work_type_preference: undefined
  });

  // Profile images and files
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Lists of items
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  // Navigation between steps
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // Final submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Prepare the candidate data for submission
      const candidateData = {
        ...profileData,
        user_id: 1, // Default user ID to satisfy backend requirement
        // Format the nested data according to backend expectations
        experiences: experiences.map(exp => ({
          ...exp,
          company_name: exp.company,
          job_title: exp.title,
          start_date: exp.startDate,
          end_date: exp.endDate,
          is_current: exp.current || false
        })),
        educations: educations.map(edu => ({
          ...edu,
          institution_name: edu.institution,
          degree: edu.degree,
          field_of_study: edu.field,
          start_date: edu.startDate,
          end_date: edu.endDate
        })),
        skills: skills.map(skill => ({
          name: skill.name
        })),
        certifications: certifications.map(cert => ({
          ...cert,
          name: cert.name,
          issuing_organization: cert.issuer,
          issue_date: cert.issueDate
        })),
        profile_picture: profilePicture,
        cover_image: coverImage,
        resume_url: resumeFile
      };      // Import and call the API
      const { createCandidate } = await import('@/app/services/candidate/candidateApi');
      const createdCandidate = await createCandidate(candidateData);

      console.log('Created candidate:', createdCandidate);
      setSuccessMessage('Profile created successfully!');

      // Redirect to the candidate profile using appropriate slug
      setTimeout(() => {
        // Check if the user object is nested inside the avatar property (based on the API response we saw)
        const userSlug = createdCandidate?.user?.slug ||
          (createdCandidate?.user?.avatar?.slug) ||
          null;

        // Use the user's slug from the API response if available
        if (userSlug) {
          console.log('Redirecting to profile using user slug:', userSlug);
          router.push(`/user/candidate/${userSlug}`);
        }
        // Create slug from the candidate's name as backup
        else if (profileData.name) {
          // Convert candidate name to a slug format
          const nameSlug = profileData.name.toLowerCase().replace(/\s+/g, '-');
          console.log('User slug not found, using generated slug:', nameSlug);
          router.push(`/user/candidate/${nameSlug}`);
        }
        // If name is not available (shouldn't happen), use ID as fallback
        else if (createdCandidate && createdCandidate.id) {
          console.log('No name found, using candidate ID as fallback:', createdCandidate.id);
          router.push(`/user/candidate/${createdCandidate.id}`);
        }
        // If all fails, go to dashboard
        else {
          console.warn('No identification available for redirection. Redirecting to dashboard instead.');
          router.push('/user/dashboard');
        }
      }, 2000);
    } catch (error) {
      console.error('Error creating candidate profile:', error);
      // Provide more detailed error message if available
      if (error.response && error.response.data) {
        setErrorMessage(`Failed to create profile: ${error.response.data.message || 'Server error'}`);
      } else {
        setErrorMessage('Failed to create profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render different steps based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoForm
            profileData={profileData}
            setProfileData={setProfileData}
            profilePicture={profilePicture}
            setProfilePicture={setProfilePicture}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
          />
        );
      case 2:
        return (
          <ExperienceForm
            experiences={experiences}
            setExperiences={setExperiences}
          />
        );
      case 3:
        return (
          <EducationForm
            educations={educations}
            setEducations={setEducations}
          />
        );
      case 4:
        return (
          <SkillsForm
            skills={skills}
            setSkills={setSkills}
          />
        );
      case 5:
        return (
          <CertificationsForm
            certifications={certifications}
            setCertifications={setCertifications}
          />
        );
      case 6:
        return (
          <ReviewProfile
            profileData={profileData}
            profilePicture={profilePicture}
            experiences={experiences}
            educations={educations}
            skills={skills}
            certifications={certifications}
            setCurrentStep={setCurrentStep}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            successMessage={successMessage}
            errorMessage={errorMessage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Your Professional Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete the following steps to create your professional profile
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`flex flex-col items-center ${step < currentStep
                  ? 'text-teal-600'
                  : step === currentStep
                    ? 'text-teal-600'
                    : 'text-gray-400'
                  }`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${step < currentStep
                    ? 'bg-teal-600 text-white'
                    : step === currentStep
                      ? 'border-2 border-teal-600 text-teal-600'
                      : 'border-2 border-gray-300 text-gray-400'
                    }`}
                >
                  {step < currentStep ? <FaCheck size={12} /> : step}
                </div>
                <span className="text-xs mt-1 hidden sm:block">
                  {step === 1 && 'Basics'}
                  {step === 2 && 'Experience'}
                  {step === 3 && 'Education'}
                  {step === 4 && 'Skills'}
                  {step === 5 && 'Certifications'}
                  {step === 6 && 'Review'}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 w-full"></div>
            <div
              className="absolute top-0 left-0 h-1 bg-teal-600 transition-all duration-300"
              style={{ width: `${(currentStep - 1) * 20}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            Previous
          </button>

          {currentStep < 6 && (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
