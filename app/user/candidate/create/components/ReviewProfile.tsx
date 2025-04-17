import React from 'react';
import Image from 'next/image';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { ProfileData, Experience, Education, Skill, Certification } from '../type';

interface ReviewProfileProps {
  profileData: ProfileData;
  profilePicture: string | null;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  certifications: Certification[];
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleSubmit: () => void;
  isSubmitting: boolean;
  successMessage: string;
  errorMessage: string;
}

const ReviewProfile: React.FC<ReviewProfileProps> = ({
  profileData,
  profilePicture,
  experiences,
  educations,
  skills,
  certifications,
  setCurrentStep,
  handleSubmit,
  isSubmitting,
  successMessage,
  errorMessage
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Review Your Profile</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please review your information before submitting
        </p>
      </div>
      
      {/* Basic Information */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex justify-between items-center">
          <h3 className="font-medium text-gray-900 dark:text-white">Basic Information</h3>
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="text-teal-600 hover:text-teal-800 text-sm"
          >
            Edit
          </button>
        </div>
        <div className="p-4 flex flex-col md:flex-row gap-6">
          {profilePicture && (
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <Image 
                  src={profilePicture} 
                  alt="Profile" 
                  width={96} 
                  height={96} 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}
          <div className="flex-grow">
            <h4 className="font-medium text-lg text-gray-900 dark:text-white">{profileData.name}</h4>
            <p className="text-gray-700 dark:text-gray-300">{profileData.headline}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{profileData.location}</p>
            <div className="mt-2 space-y-1 text-sm">
              <p><span className="font-medium">Email:</span> {profileData.email}</p>
              {profileData.phone && <p><span className="font-medium">Phone:</span> {profileData.phone}</p>}
              {profileData.website && <p><span className="font-medium">Website:</span> {profileData.website}</p>}
            </div>
            {profileData.about && (
              <div className="mt-3">
                <h5 className="font-medium text-gray-900 dark:text-white text-sm">About</h5>
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{profileData.about}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Experience */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex justify-between items-center">
          <h3 className="font-medium text-gray-900 dark:text-white">Experience</h3>
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="text-teal-600 hover:text-teal-800 text-sm"
          >
            Edit
          </button>
        </div>
        <div className="p-4">
          {experiences.length > 0 ? (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-3 last:pb-0">
                  <h4 className="font-medium text-gray-900 dark:text-white">{exp.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300">{exp.company}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                  {exp.location && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{exp.location}</p>
                  )}
                  {exp.description && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No experience added</p>
          )}
        </div>
      </div>
      
      {/* Education */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex justify-between items-center">
          <h3 className="font-medium text-gray-900 dark:text-white">Education</h3>
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className="text-teal-600 hover:text-teal-800 text-sm"
          >
            Edit
          </button>
        </div>
        <div className="p-4">
          {educations.length > 0 ? (
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-3 last:pb-0">
                  <h4 className="font-medium text-gray-900 dark:text-white">{edu.institution}</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </p>
                  {edu.description && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No education added</p>
          )}
        </div>
      </div>
      
      {/* Skills */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex justify-between items-center">
          <h3 className="font-medium text-gray-900 dark:text-white">Skills</h3>
          <button
            type="button"
            onClick={() => setCurrentStep(4)}
            className="text-teal-600 hover:text-teal-800 text-sm"
          >
            Edit
          </button>
        </div>
        <div className="p-4">
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span 
                  key={skill.id} 
                  className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No skills added</p>
          )}
        </div>
      </div>
    
      {/* Certifications */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex justify-between items-center">
          <h3 className="font-medium text-gray-900 dark:text-white">Certifications</h3>
          <button
            type="button"
            onClick={() => setCurrentStep(5)}
            className="text-teal-600 hover:text-teal-800 text-sm"
          >
            Edit
          </button>
        </div>
        <div className="p-4">
          {certifications.length > 0 ? (
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-3 last:pb-0">
                  <h4 className="font-medium text-gray-900 dark:text-white">{cert.name}</h4>
                  <p className="text-gray-700 dark:text-gray-300">{cert.issuer}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Issued: {cert.issueDate}
                    {!cert.noExpiration && cert.expirationDate && ` • Expires: ${cert.expirationDate}`}
                    {cert.noExpiration && ' • No Expiration'}
                  </p>
                  {cert.credentialId && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Credential ID: {cert.credentialId}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No certifications added</p>
          )}
        </div>
      </div>
      
      {/* Submit Section */}
      <div className="mt-8 text-center">
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            <FaTimes className="inline-block mr-2" />
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            <FaCheck className="inline-block mr-2" />
            {successMessage}
          </div>
        )}
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="inline-block mr-2 animate-spin" />
              Creating Profile...
            </>
          ) : (
            'Create Profile'
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewProfile;
