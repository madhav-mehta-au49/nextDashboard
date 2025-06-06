'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaEdit,
  FaExternalLinkAlt,
  FaChevronDown,
  FaChevronUp,
  FaBriefcase,
  FaSchool,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaUserFriends,
  FaEnvelope,
  FaLink,
  FaStar,
  FaCertificate,
  FaClock,
  FaEye,
  FaFileAlt,
  FaCalendarAlt,
  FaBell,
  FaHistory,
  FaTimesCircle,
  FaUserCheck
} from 'react-icons/fa';
import Header from '@/app/web/components/header';
import SubHeader from '@/components/subheader';
import Footer from '@/components/footer';
import { getCandidateBySlug } from '@/app/services/candidate/candidateApi';
import ApplicationStatusSection from '@/app/user/components/applications/ApplicationStatusSection';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export default function CandidateProfile() {
  const params = useParams();
  const slug = params.slug as string;
  const [isLoading, setIsLoading] = useState(true);
  const [candidateData, setCandidateData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) {
        setError('Invalid profile URL');
        setIsLoading(false);
        return;
      }

      try {
        // First, try to fetch by slug
        try {
          console.log(`Attempting to fetch candidate with slug: ${slug}`);
          const data = await getCandidateBySlug(slug);
          if (data) {
            console.log('Successfully loaded candidate by slug:', data.id);
            setCandidateData(data);
            setIsLoading(false);
            return;
          }
        } catch (slugError: any) {
          console.log(`Error fetching by slug "${slug}":`, slugError);
          // Check for specific error conditions
          if (slugError.response && slugError.response.status === 404) {
            console.warn('Candidate profile not found with slug:', slug);
          } else {
            console.error('Error fetching candidate by slug:',
              slugError.response?.data?.message || slugError.message);
          }
        }

        // If slug fetch fails, try to fetch by ID (in case the slug is actually an ID)
        try {
          // Import the getCandidate function
          const { getCandidate } = await import('@/app/services/candidate/candidateApi');

          // Check if slug is numeric (could be an ID)
          if (!isNaN(Number(slug))) {
            console.log(`Attempting to fetch candidate by ID: ${slug}`);
            const data = await getCandidate(Number(slug));
            if (data) {
              console.log('Successfully loaded candidate by ID');
              setCandidateData(data);
              setIsLoading(false);
              return;
            }
          }
        } catch (idError) {
          console.log(`Error fetching by ID "${slug}":`, idError);
        }

        // If both attempts fail, set error
        setError(`Candidate profile not found: ${slug}`);
      } catch (err) {
        console.error('Error loading candidate profile:', err);
        setError('Failed to load candidate profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Store candidate ID in localStorage for ApplicationStatusSection
  useEffect(() => {
    if (candidateData?.id) {
      localStorage.setItem('candidateId', candidateData.id.toString());
    }
  }, [candidateData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !candidateData) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-red-50 p-6 rounded-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
          <p>{error || 'Candidate profile not found'}</p>
          <button
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <SubHeader />

      {/* Cover Image */}
      <div className="relative h-[200px] md:h-[250px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${candidateData.cover_image || 'https://via.placeholder.com/1200x250?text=Cover+Image'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Candidate Header */}
        <div className="mt-[-50px] md:mt-[-70px] relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-full p-1 bg-white shadow-md">
                <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full overflow-hidden">
                  <Image
                    src={candidateData.profile_picture || 'https://via.placeholder.com/150x150?text=Profile'}
                    alt={candidateData.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{candidateData.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-md">
                  {candidateData.headline}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{candidateData.location}</span>
                  <span className="mx-2">•</span>
                  <FaUserFriends className="mr-1" />
                  <span>{candidateData.connections || 0}+ connections</span>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
                    Connect
                  </button>
                  <button className="px-4 py-2 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition-colors">
                    Message
                  </button>
                  <Link
                    href={`/user/candidate/${slug}/edit`}
                    className="p-2 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition-colors flex items-center justify-center"
                    title="Edit Profile"
                  >
                    <FaEdit />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 my-6">
          <div>
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                  <button
                    className={`px-6 py-3 text-sm font-medium ${activeTab === 'profile'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile
                  </button>
                  <button
                    className={`px-6 py-3 text-sm font-medium ${activeTab === 'activity'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('activity')}
                  >
                    Activity
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'profile' ? (
                  <div>
                    {/* About Section */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About</h3>
                        <Link
                          href={`/user/candidate/${slug}/edit`}
                          className="text-teal-600 hover:text-teal-800 text-sm flex items-center"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </Link>
                      </div>
                      <div className={`text-gray-700 dark:text-gray-300 ${!isAboutOpen && 'line-clamp-3'}`}>
                        {candidateData.about}
                      </div>
                      <button
                        className="mt-2 text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center"
                        onClick={() => setIsAboutOpen(!isAboutOpen)}
                      >
                        Show {isAboutOpen ? 'Less' : 'More'}
                        {isAboutOpen ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                      </button>
                    </div>

                    {/* Featured Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Featured</h3>                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.isArray(candidateData.featured) && candidateData.featured.length > 0 ? (
                          candidateData.featured.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-700"
                            >
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">{item.title}</h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{item.description}</p>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-teal-800 text-sm flex items-center"
                              >
                                View <FaExternalLinkAlt className="ml-1 text-xs" />
                              </a>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 dark:text-gray-400">No featured items.</div>
                        )}
                      </div>
                    </div>
                    {/* Experience Section */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <FaBriefcase className="text-teal-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h3>
                        </div>
                        <Link
                          href={`/user/candidate/${slug}/edit?step=2`}
                          className="text-teal-600 hover:text-teal-800 text-sm flex items-center"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </Link>
                      </div>
                      <hr className="mb-4 border-gray-200 dark:border-gray-700" />
                      <div className="space-y-6">
                        {Array.isArray(candidateData.experiences) && candidateData.experiences.length > 0 ? (
                          candidateData.experiences.map((exp: any, idx: number) => (
                            <div key={idx}>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">{exp.position}</h4>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {exp.company_name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'} • {exp.location}
                              </p>
                              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                {exp.description}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 dark:text-gray-400">No experience listed.</div>
                        )}
                      </div>
                    </div>
                    {/* Education Section */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <FaSchool className="text-teal-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h3>
                        </div>
                        <Link
                          href={`/user/candidate/${slug}/edit?step=3`}
                          className="text-teal-600 hover:text-teal-800 text-sm flex items-center"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </Link>
                      </div>
                      <hr className="mb-4 border-gray-200 dark:border-gray-700" />
                      <div className="space-y-6">
                        {Array.isArray(candidateData.educations) && candidateData.educations.length > 0 ? (
                          candidateData.educations.map((edu: any, idx: number) => (
                            <div key={idx}>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">{edu.institution}</h4>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {edu.degree} in {edu.field_of_study}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                              </p>
                              {edu.description && (
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                  {edu.description}
                                </p>
                              )}
                            </div>
                          ))) : (
                          <div className="text-gray-500 dark:text-gray-400">No education listed.</div>
                        )}
                      </div>
                    </div>
                    {/* Certifications Section */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <FaCertificate className="text-teal-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Certifications</h3>
                        </div>
                        <Link
                          href={`/user/candidate/${slug}/edit?step=5`}
                          className="text-teal-600 hover:text-teal-800 text-sm flex items-center"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </Link>
                      </div>
                      <hr className="mb-4 border-gray-200 dark:border-gray-700" />
                      <div className="space-y-6">
                        {Array.isArray(candidateData.certifications) && candidateData.certifications.length > 0 ? (
                          candidateData.certifications.map((cert: any, idx: number) => (
                            <div key={idx}>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">{cert.name}</h4>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {cert.issuing_organization}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Issued {new Date(cert.issue_date).getFullYear()}
                                {cert.expiration_date && ` • Expires ${new Date(cert.expiration_date).getFullYear()}`}
                              </p>
                              {cert.credential_id && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Credential ID: {cert.credential_id}
                                </p>
                              )}
                              {cert.credential_url && (
                                <a
                                  href={cert.credential_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-teal-600 hover:text-teal-800 text-sm flex items-center mt-1"
                                >
                                  Show credential <FaExternalLinkAlt className="ml-1 text-xs" />
                                </a>
                              )}
                              {cert.file_path && (
                                <a
                                  href={cert.file_path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-teal-600 hover:text-teal-800 text-sm flex items-center mt-1"
                                >
                                  View Certificate <FaExternalLinkAlt className="ml-1 text-xs" />
                                </a>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 dark:text-gray-400">No certifications listed.</div>
                        )}
                      </div>
                    </div>
                    {/* Career Preferences Section */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <FaBriefcase className="text-teal-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Career Preferences</h3>
                        </div>
                        <Link
                          href={`/user/candidate/${slug}/edit?step=1`}
                          className="text-teal-600 hover:text-teal-800 text-sm flex items-center"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </Link>
                      </div>
                      <hr className="mb-4 border-gray-200 dark:border-gray-700" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {candidateData.desired_job_title && (
                          <div>
                            <div className="flex items-center mb-2">
                              <FaBriefcase className="text-gray-400 mr-2 text-sm" />
                              <h4 className="font-medium text-gray-900 dark:text-white">Desired Job Title</h4>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{candidateData.desired_job_title}</p>
                          </div>
                        )}

                        {candidateData.desired_salary && (
                          <div>
                            <div className="flex items-center mb-2">
                              <FaStar className="text-gray-400 mr-2 text-sm" />
                              <h4 className="font-medium text-gray-900 dark:text-white">Desired Salary</h4>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">${candidateData.desired_salary}</p>
                          </div>
                        )}

                        {candidateData.desired_location && (
                          <div>
                            <div className="flex items-center mb-2">
                              <FaMapMarkerAlt className="text-gray-400 mr-2 text-sm" />
                              <h4 className="font-medium text-gray-900 dark:text-white">Preferred Location</h4>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{candidateData.desired_location}</p>
                          </div>
                        )}

                        {candidateData.work_type_preference && (
                          <div>
                            <div className="flex items-center mb-2">
                              <FaBriefcase className="text-gray-400 mr-2 text-sm" />
                              <h4 className="font-medium text-gray-900 dark:text-white">Work Type</h4>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 capitalize">{candidateData.work_type_preference}</p>
                          </div>
                        )}

                        {candidateData.availability && (
                          <div>
                            <div className="flex items-center mb-2">
                              <FaClock className="text-gray-400 mr-2 text-sm" />
                              <h4 className="font-medium text-gray-900 dark:text-white">Availability</h4>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 capitalize">{candidateData.availability}</p>
                          </div>
                        )}

                        {candidateData.portfolio_url && (
                          <div>
                            <div className="flex items-center mb-2">
                              <FaLink className="text-gray-400 mr-2 text-sm" />
                              <h4 className="font-medium text-gray-900 dark:text-white">Portfolio</h4>
                            </div>
                            <a
                              href={candidateData.portfolio_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:text-teal-800 flex items-center"
                            >
                              View Portfolio <FaExternalLinkAlt className="ml-1 text-xs" />
                            </a>
                          </div>
                        )}
                      </div>

                      {!candidateData.desired_job_title && !candidateData.desired_salary && !candidateData.desired_location && !candidateData.work_type_preference && !candidateData.availability && !candidateData.portfolio_url && (
                        <div className="text-gray-500 dark:text-gray-400">No career preferences set.</div>
                      )}
                    </div>

                    {/* Resume Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resume</h3>
                      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-700">
                        {candidateData.resume_url ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
                                  <path d="M6 8h8v1H6V8zm0 2h8v1H6v-1zm0 2h5v1H6v-1z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {candidateData.name}_Resume.pdf
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  PDF Document
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => window.open(candidateData.resume_url, '_blank')}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                              >
                                <FaExternalLinkAlt className="mr-1.5 h-3 w-3" />
                                View
                              </button>
                              <a
                                href={candidateData.resume_url}
                                download
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No resume uploaded</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload your resume to showcase your experience to potential employers.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Skills Section */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills & Endorsements</h3>
                        <Link
                          href={`/user/candidate/${slug}/edit?step=4`}
                          className="text-teal-600 hover:text-teal-800 text-sm flex items-center"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.isArray(candidateData.skills) && candidateData.skills.length > 0 ? (
                          candidateData.skills.map((skillItem: any, idx: number) => (
                            <div
                              key={idx}
                              className="border border-gray-200 dark:border-gray-700 rounded-md p-3 hover:border-blue-300 hover:shadow-sm transition-all"
                            >
                              <div className="flex justify-between items-center">
                                <p className="font-medium text-sm text-gray-900 dark:text-white">
                                  {skillItem.skill?.name || skillItem.name}
                                </p>
                                <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-teal-900 dark:text-teal-300">
                                  {skillItem.pivot?.endorsements || skillItem.endorsements || 0}
                                </span>
                              </div>
                              <div className="flex items-center mt-1">
                                <FaCheckCircle className="text-teal-500 text-xs mr-1" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {skillItem.pivot?.endorsements || skillItem.endorsements || 0} endorsements
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 dark:text-gray-400">No skills listed.</div>
                        )}
                      </div>
                    </div>

                    {/* Recommendations Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
                      <div className="space-y-4">
                        {Array.isArray(candidateData.recommendations) && candidateData.recommendations.length > 0 ? (
                          candidateData.recommendations.map((rec: any, idx: number) => (
                            <div
                              key={idx}
                              className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800"
                            >
                              <p className="font-bold text-gray-900 dark:text-white">
                                {rec.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {rec.relation}
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                "{rec.text}"
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 dark:text-gray-400">No recommendations listed.</div>
                        )}
                      </div>
                    </div>
                  </div>                ) : (
                  <div>
                    {/* Use the reusable ApplicationStatusSection component */}
                    <ApplicationStatusSection 
                      className=""
                      showSimilarJobs={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-[100px] space-y-6">
              {/* Candidate Actions */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden p-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Profile Actions
                </p>

                <div className="space-y-2">
                  <Link
                    href={`/user/candidate/${slug}/edit`}
                    className="w-full text-left text-sm px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </Link>
                  <Link
                    href={`/user/candidate/${slug}/edit?step=2`}
                    className="w-full text-left text-sm px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center"
                  >
                    <FaBriefcase className="mr-2" />
                    Add Experience
                  </Link>

                  <Link
                    href={`/user/candidate/${slug}/edit?step=3`}
                    className="w-full text-left text-sm px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center"
                  >
                    <FaSchool className="mr-2" />
                    Add Education
                  </Link>
                </div>

                <hr className="my-3 border-gray-200 dark:border-gray-700" />

                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Profile Visibility
                </p>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700 dark:text-gray-300">Public Profile</p>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="toggle"
                      id="toggle"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <label
                      htmlFor="toggle"
                      className="block h-6 rounded-full bg-gray-300 cursor-pointer peer-checked:bg-teal-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                    ></label>
                  </div>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden p-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Profile Completion
                </p>

                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                  <div className="w-[85%] h-full bg-teal-500 rounded-full"></div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                  Your profile is 85% complete
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-700 dark:text-gray-300">Add a profile photo</p>
                    <FaCheckCircle className="text-green-500 text-xs" />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-700 dark:text-gray-300">Add your experience</p>
                    <FaCheckCircle className="text-green-500 text-xs" />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-700 dark:text-gray-300">Add your education</p>
                    <FaCheckCircle className="text-green-500 text-xs" />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-700 dark:text-gray-300">Add your skills</p>
                    <FaCheckCircle className="text-green-500 text-xs" />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-700 dark:text-gray-300">Get recommendations</p>
                    <FaCheckCircle className="text-green-500 text-xs" />
                  </div>
                </div>
              </div>

              {/* People Also Viewed */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden p-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  People Also Viewed
                </p>

                <div className="space-y-4">
                  {[                    { name: "Alex Johnson", title: "Product Designer", image: "https://via.placeholder.com/40" },
                    { name: "Sarah Miller", title: "UX Researcher", image: "https://via.placeholder.com/40" },
                    { name: "David Chen", title: "UI Developer", image: "https://via.placeholder.com/40" }
                  ].map((person: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <Image
                          src={person.image}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{person.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{person.title}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full text-teal-600 hover:text-teal-800 text-sm font-medium mt-4">
                  View More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

