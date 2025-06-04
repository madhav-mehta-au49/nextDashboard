"use client";   

import { useState } from "react";
import { FiBookmark, FiCheck, FiShare2, FiThumbsUp } from "react-icons/fi";

interface JobDescriptionProps {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  salary: string;
  employmentType: string;
  jobUrl: string;
  // New fields to match create job form
  experienceLevel?: string;
  locationType?: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  applicationDeadline?: string | null;
  startDate?: string | null;
  isRemoteFriendly?: boolean;
  isUrgent?: boolean;
  isFeatured?: boolean;
  questions?: Array<{
    question_text?: string;
    is_required?: boolean;
  }>;
}

const JobDescription = ({ 
  title, 
  company,
  location,
  description,
  requirements,
  benefits,
  postedDate,
  salary,
  employmentType,
  jobUrl,
  // New props
  experienceLevel,
  locationType,
  requiredSkills = [],
  preferredSkills = [],
  applicationDeadline,
  startDate,
  isRemoteFriendly,
  isUrgent,
  isFeatured,
  questions = []
}: JobDescriptionProps) => {
  const [likes, setLikes] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = () => {
    setLikes(prev => prev + 1);
    // Toast notification would go here
  };

  const handleBookmark = () => {
    setBookmarked(prev => !prev);
    // Toast notification would go here
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(jobUrl);
    // Toast notification would go here
  };

  // Debug logging to see what data we're receiving
  console.log('JobDescription - Requirements:', requirements);
  console.log('JobDescription - Benefits:', benefits);
  console.log('JobDescription - Required Skills:', requiredSkills);
  console.log('JobDescription - Experience Level:', experienceLevel);
  console.log('JobDescription - Location Type:', locationType);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Description Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{description}</p>
        </div>

        {/* Requirements Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
          <ul className="space-y-2">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-start">
                <FiCheck className="text-teal-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>        {/* Benefits Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits</h2>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <FiCheck className="text-teal-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Required Skills Section */}
        {requiredSkills.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Preferred Skills Section */}
        {preferredSkills.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Preferred Skills (Nice to Have)</h2>
            <div className="flex flex-wrap gap-2">
              {preferredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Application Questions Section */}
        {questions.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Application Questions</h2>
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 font-medium">
                    {question.question_text}
                    {question.is_required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </p>
                  {question.is_required && (
                    <p className="text-sm text-gray-600 mt-1">Required</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            <button
              className="flex-1 sm:flex-none px-6 py-2.5 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
            >
              Apply Now
            </button>
            
            <button
              onClick={handleLike}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <FiThumbsUp className={`mr-2 h-5 w-5 ${likes > 0 ? 'text-teal-500' : 'text-gray-400'}`} />
              {likes > 0 ? likes : 'Like'}
            </button>
            
            <button
                            onClick={handleBookmark}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                          >
                            <FiBookmark className={`mr-2 h-5 w-5 ${bookmarked ? 'text-teal-500 fill-teal-500' : 'text-gray-400'}`} />
                            {bookmarked ? 'Saved' : 'Save'}
                          </button>
                          
                          <button
                            onClick={handleCopyLink}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                          >
                            <FiShare2 className="mr-2 h-5 w-5 text-gray-400" />
                            Share
                          </button>
                        </div>
                      </div>
                        {/* Job Details Summary */}
              <div className="bg-gray-50 -mx-6 -mb-6 p-6 mt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Job Type</h4>
                    <p className="text-gray-900">{employmentType}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Salary Range</h4>
                    <p className="text-gray-900">{salary}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <p className="text-gray-900">{location}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Posted</h4>
                    <p className="text-gray-900">{postedDate}</p>
                  </div>
                  {experienceLevel && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Experience Level</h4>
                      <p className="text-gray-900 capitalize">{experienceLevel}</p>
                    </div>
                  )}
                  {locationType && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Work Type</h4>
                      <p className="text-gray-900 capitalize">{locationType}</p>
                    </div>
                  )}
                  {applicationDeadline && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Application Deadline</h4>
                      <p className="text-gray-900">{applicationDeadline}</p>
                    </div>
                  )}
                  {startDate && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
                      <p className="text-gray-900">{startDate}</p>
                    </div>
                  )}
                  {isRemoteFriendly && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Remote Work</h4>
                      <p className="text-gray-900">Remote-friendly</p>
                    </div>
                  )}
                </div>
                
                {/* Job Badges */}
                {(isUrgent || isFeatured) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {isUrgent && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Urgent Hiring
                        </span>
                      )}
                      {isFeatured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured Job
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
                    </div>
                  </div>
                );
              };
              
              export default JobDescription;

