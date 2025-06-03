'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Header from '@/app/web/components/header';
import SubHeader from '@/components/subheader';
import Footer from '@/components/footer';
import { getCandidate, updateCandidate } from '@/app/services/candidate/candidateApi';
import BasicInfoForm from '@/app/user/candidate/create/components/BasicInfoForm';
import ExperienceForm from '@/app/user/candidate/create/components/ExperienceForm';
import EducationForm from '@/app/user/candidate/create/components/EducationForm';
import SkillsForm from '@/app/user/candidate/create/components/SkillsForm';
import CertificationsForm from '@/app/user/candidate/create/components/CertificationsForm';
import CareerPreferencesForm from '@/app/user/candidate/create/components/CareerPreferencesForm';
import ProfilePictureForm from '@/app/user/candidate/create/components/ProfilePictureForm';
import ResumeForm from '@/app/user/candidate/create/components/ResumeForm';

export default function EditCandidate() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [candidateData, setCandidateData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 'basic', label: 'Basic Information', component: BasicInfoForm },
    { id: 'profile', label: 'Profile & Resume', component: ProfilePictureForm },
    { id: 'experience', label: 'Experience', component: ExperienceForm },
    { id: 'education', label: 'Education', component: EducationForm },
    { id: 'skills', label: 'Skills', component: SkillsForm },
    { id: 'certifications', label: 'Certifications', component: CertificationsForm },
    { id: 'preferences', label: 'Career Preferences', component: CareerPreferencesForm },
  ];

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!candidateId) {
        setError('Invalid candidate ID');
        setIsLoading(false);
        return;
      }

      try {
        const data = await getCandidate(candidateId);
        console.log('Loaded candidate data for editing:', data);
        setCandidateData(data);
      } catch (err: any) {
        console.error('Error loading candidate:', err);
        setError('Failed to load candidate data');
        toast.error('Failed to load candidate data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidate();
  }, [candidateId]);

  const handleDataChange = (stepId: string, data: any) => {
    setCandidateData((prev: any) => ({
      ...prev,
      ...data
    }));
  };

  const handleSave = async () => {
    if (!candidateData) return;

    setIsSaving(true);
    try {
      console.log('Saving candidate data:', candidateData);
      await updateCandidate(candidateId, candidateData);
      toast.success('Profile updated successfully!');
      router.push(`/user/candidate/${candidateData.slug}`);
    } catch (error: any) {
      console.error('Error updating candidate:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Header />
        <SubHeader />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            <p className="mt-4 text-gray-600">Loading candidate data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !candidateData) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Header />
        <SubHeader />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
            <p className="text-red-700 mb-4">{error || 'Candidate not found'}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const CurrentStepComponent = steps[activeStep].component;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <SubHeader />

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your candidate profile information
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 cursor-pointer transition-colors ${index === activeStep
                      ? 'bg-teal-600 text-white'
                      : index < activeStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  onClick={() => setActiveStep(index)}
                >
                  {index + 1}
                </div>
                <span className="text-xs text-center text-gray-600 dark:text-gray-400 hidden sm:block">
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-full mt-4 ${index < activeStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {steps[activeStep].label}
          </h2>

          <CurrentStepComponent
            data={candidateData}
            onChange={(data: any) => handleDataChange(steps[activeStep].id, data)}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>

            {activeStep > 0 && (
              <button
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            {activeStep < steps.length - 1 ? (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Updating...' : 'Update Profile'}
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
