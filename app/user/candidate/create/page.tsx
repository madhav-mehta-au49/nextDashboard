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
import { 
  Experience, 
  Education, 
  Skill, 
  Certification, 
  ProfileData 
} from './types';

export default function CreateCandidateProfile() {
  const router = useRouter();
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
    website: ''
  });
  
  // Profile images
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('Profile created successfully!');
      
      // Redirect to the new candidate profile page after a delay
      setTimeout(() => {
        router.push('/user/candidate/1');
      }, 2000);
    } catch (error) {
      console.error('Error creating candidate profile:', error);
      setErrorMessage('Failed to create profile. Please try again.');
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
                className={`flex flex-col items-center ${
                  step < currentStep 
                    ? 'text-blue-600' 
                    : step === currentStep 
                    ? 'text-blue-600' 
                    : 'text-gray-400'
                }`}
              >
                <div 
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    step < currentStep 
                      ? 'bg-blue-600 text-white' 
                      : step === currentStep 
                      ? 'border-2 border-blue-600 text-blue-600' 
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
              className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300"
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
            className={`px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 ${
              currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Previous
          </button>
          
          {currentStep < 6 && (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
