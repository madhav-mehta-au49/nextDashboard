'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Info,
  Briefcase,
  MapPin,
  Users,
  Calendar,
  Globe,
  Heart,
  Share2,
  Bookmark,
  ChevronRight,
  Star,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Bell,
  Flag,
  CheckCircle
} from 'lucide-react';
import { useCompanyDetails } from '../hooks/useCompanyDetails';

// Sample images for now - these will be replaced with actual company data later
const SAMPLE_IMAGES = {
  covers: [
    '/images/company-cover-1.jpg',
    '/images/company-cover-2.jpg',
    '/images/company-cover-3.jpg',
    '/images/company-cover-4.jpg',
    '/images/company-cover-5.jpg',
  ],
  logos: [
    '/images/company-logo-1.gif',
    '/images/company-logo-2.png',
    '/images/company-logo-3.png',
    '/images/company-logo-4.png',
    '/images/company-logo-5.png',
  ]
};

export default function CompanyProfile() {
  const params = useParams();
  const companyId = params.companyId as string;
  const [activeTab, setActiveTab] = useState('about');
  const [scrolled, setScrolled] = useState(false);

  const {
    company,
    jobs,
    isLoading,
    error,
    isFollowing,
    toggleFollow
  } = useCompanyDetails(companyId);

  // For company ID "1", this will ensure it uses the first images in the arrays
  // Convert companyId to a number and use it as index (with fallback to 0)
  const idNumber = parseInt(companyId, 10) - 1;
  const coverIndex = !isNaN(idNumber) && idNumber >= 0 && idNumber < SAMPLE_IMAGES.covers.length
    ? idNumber
    : 0;
  const logoIndex = !isNaN(idNumber) && idNumber >= 0 && idNumber < SAMPLE_IMAGES.logos.length
    ? idNumber
    : 0;

  // Sample cover and logo images
  const sampleCoverImage = SAMPLE_IMAGES.covers[coverIndex];
  const sampleLogoImage = SAMPLE_IMAGES.logos[logoIndex];

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-200 dark:border-teal-900 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-teal-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-teal-600 dark:text-teal-400 font-semibold">
            Loading
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-6">
                <svg className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                Something went wrong
              </h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">
                {error || 'We couldn\'t find the company you\'re looking for.'}
              </p>
              <Link
                href="/companies"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
              >
                Back to Companies
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
      {/* Sticky Header - Appears on scroll */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ${scrolled ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                <Image
                  src={sampleLogoImage}
                  alt={company.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{company.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{company.industry}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleFollow}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${isFollowing
                  ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
              >
                <Heart className={`mr-1.5 h-4 w-4 ${isFollowing ? 'fill-current' : ''}`} />
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Scroll to top"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - With proper spacing to prevent overlap */}
<div className="relative bg-white dark:bg-gray-800">
  {/* Cover Background - Clean with no modifications */}
  <div className="relative h-[360px] w-full">
    <Image
      src={sampleCoverImage}
      alt="Cover"
      fill
      style={{
        objectFit: 'cover',
        objectPosition: 'center'
      }}
      priority
    />
  </div>
  
  {/* Space to ensure content is below cover image */}
  <div className="h-24"></div>
  
  {/* Company Info Section - Positioned below cover image */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:px-16 -mt-36 relative z-10">
    <div className="flex items-start gap-4">
      {/* Company Logo - Top portion overlaps with cover */}
      <div className=" mt-5 w-40 h-40 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-md">
        <Image
          src={sampleLogoImage}
          alt={company.name}
          width={160}
          height={160}
          className="rounded-xl"
        />
      </div>
      
      {/* Company Name & Details - Positioned to be below cover image */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{company.name}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{company.industry}</p>
        
        {/* These three items in the same line */}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-gray-600 dark:text-gray-400 text-sm">{company.size}</span>
          <span className="text-gray-600 dark:text-gray-400 text-sm">Founded {company.founded}</span>
          <span className="text-gray-600 dark:text-gray-400 text-sm">{company.headquarters}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          <CheckCircle className="text-teal-500 dark:text-teal-400 mr-1 w-4 h-4" />
          Verified employer
        </div>
      </div>
    </div>
    
    {/* Follow Section */}
    <div className="flex items-center mt-6 md:mt-24 gap-4">
      <p className="text-gray-500 dark:text-gray-400 text-sm">{company.followers.toLocaleString()} followers</p>
      <button 
        onClick={toggleFollow}
        className={`${
          isFollowing 
            ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 border border-teal-500 dark:border-teal-600' 
            : 'bg-teal-600 dark:bg-teal-500 text-white'
        } px-5 py-2 rounded-full text-sm font-medium shadow hover:bg-teal-700 dark:hover:bg-teal-600 transition`}
      >
        {isFollowing ? '✓ Following' : '+ Follow'}
      </button>
    </div>
  </div>
</div>


      {/* Main Content */}
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mb-10">
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex -mb-px">
                    <button
                      onClick={() => setActiveTab('about')}
                      className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${activeTab === 'about'
                        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      About
                    </button>
                    <button
                      onClick={() => setActiveTab('jobs')}
                      className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center ${activeTab === 'jobs'
                        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                      <Briefcase className="mr-2 h-4 w-4" />
                      Jobs ({jobs.length})
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'about' && (
                    <div className="space-y-6">
                      {/* About Section */}
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                          <Info className="mr-2 h-5 w-5 text-teal-500" />
                          About {company.name}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{company.description}</p>
                      </div>

                      <hr className="border-gray-200 dark:border-gray-700" />

                      {/* Company Details */}
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                          <Briefcase className="mr-2 h-5 w-5 text-teal-500" />
                          Company Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div>
                            <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
                              <Globe className="h-4 w-4 text-teal-500 mr-2" />
                              <span className="font-medium">Website</span>
                            </div>
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-600 dark:text-teal-400 hover:underline"
                            >
                              {company.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>

                          <div>
                            <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
                              <MapPin className="h-4 w-4 text-teal-500 mr-2" />
                              <span className="font-medium">Headquarters</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{company.headquarters}</p>
                          </div>

                          <div>
                            <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
                              <Calendar className="h-4 w-4 text-teal-500 mr-2" />
                              <span className="font-medium">Founded</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{company.founded}</p>
                          </div>

                          <div>
                            <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
                              <Users className="h-4 w-4 text-teal-500 mr-2" />
                              <span className="font-medium">Company Size</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{company.employees.toLocaleString()} employees</p>
                          </div>
                        </div>
                      </div>

                      <hr className="border-gray-200 dark:border-gray-700" />

                      {/* Specialties */}
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                          <Award className="mr-2 h-5 w-5 text-teal-500" />
                          Specialties
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {company.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <hr className="border-gray-200 dark:border-gray-700" />

                      {/* Locations */}
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                          <MapPin className="mr-2 h-5 w-5 text-teal-500" />
                          Locations
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {company.locations.map(location => (
                            <div
                              key={location.id}
                              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
                            >
                              <div className="flex items-center mb-2">
                                <MapPin className={`h-4 w-4 mr-2 ${location.isPrimary ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}`} />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {location.city}
                                  {location.isPrimary && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                      HQ
                                    </span>
                                  )}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{location.country}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Social Media */}
                      {(company.socialLinks.linkedin || company.socialLinks.twitter ||
                        company.socialLinks.facebook || company.socialLinks.instagram) && (
                          <>
                            <hr className="border-gray-200 dark:border-gray-700" />
                            <div>
                              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                <Globe className="mr-2 h-5 w-5 text-teal-500" />
                                Connect with {company.name}
                              </h3>
                              <div className="flex space-x-4">
                                {company.socialLinks.linkedin && (
                                  <a
                                    href={company.socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                                  >
                                    <Globe className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                  </a>
                                )}
                                {company.socialLinks.twitter && (
                                  <a
                                    href={company.socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                                  >
                                    <Globe className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                  </a>
                                )}
                                {company.socialLinks.facebook && (
                                  <a
                                    href={company.socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                                  >
                                    <Globe className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                  </a>
                                )}
                                {company.socialLinks.instagram && (
                                  <a
                                    href={company.socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                                  >
                                    <Globe className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                    </div>
                  )}

                  {activeTab === 'jobs' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Briefcase className="mr-2 h-5 w-5 text-teal-500" />
                        {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} at {company.name}
                      </h3>

                      {jobs.length === 0 ? (
                        <div className="text-center py-12 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No open positions</h3>
                          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            {company.name} doesn't have any active job postings at the moment. Check back later or follow the company to get updates.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {jobs.map(job => (
                            <div
                              key={job.id}
                              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-all duration-200 hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 hover:-translate-y-1"
                            >
                              <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                      {job.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {company.name}
                                    </p>
                                  </div>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.type === 'Full-time' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                      job.type === 'Part-time' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                        job.type === 'Contract' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                          job.type === 'Internship' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                            'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
                                      }`}
                                  >
                                    {job.type}
                                  </span>
                                </div>

                                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                  {job.description}
                                </p>

                                <div className="flex flex-wrap gap-4 mb-4">
                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <MapPin className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                                    {job.isRemote ? 'Remote' : job.location}
                                  </div>

                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <Clock className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                                    Posted {formatDate(job.postedDate)}
                                  </div>

                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <Users className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                                    {job.applicantsCount} applicants
                                  </div>

                                  {job.salary && (
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                      <DollarSign className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                                      {formatSalary(job.salary)}
                                    </div>
                                  )}
                                </div>
                                <hr className="my-4 border-gray-200 dark:border-gray-700" />

                                <div className="flex justify-between items-center">
                                  <div className="flex space-x-2">
                                    {job.isRemote && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                                        Remote
                                      </span>
                                    )}
                                    {job.applicationDeadline && (
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDeadlineSoon(job.applicationDeadline)
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                        }`}>
                                        {isDeadlineSoon(job.applicationDeadline)
                                          ? "Closing soon"
                                          : `Closes ${formatDate(job.applicationDeadline)}`}
                                      </span>
                                    )}
                                  </div>

                                  <Link
                                    href={`/jobs/${job.id}`}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 dark:bg-teal-900 dark:text-teal-100 dark:hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                                  >
                                    View Job
                                    <ArrowRight className="ml-1.5 h-4 w-4" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-[100px] space-y-6">
                {/* Company Actions Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Company Actions
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors">
                      <Star className="h-5 w-5 mr-3" />
                      Add to favorites
                    </button>
                    <button className="w-full flex items-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      <MessageSquare className="h-5 w-5 mr-3" />
                      Message company
                    </button>
                    <button className="w-full flex items-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 transition-colors">
                      <Share2 className="h-5 w-5 mr-3" />
                      Share profile
                    </button>
                    <button className="w-full flex items-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                      <Bookmark className="h-5 w-5 mr-3" />
                      Save profile
                    </button>
                  </div>

                  <hr className="my-4 border-gray-200 dark:border-gray-700" />

                  <div className="space-y-2">
                    <button className="w-full flex items-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
                      <Briefcase className="h-5 w-5 mr-3" />
                      View all jobs
                    </button>
                    <button className="w-full flex items-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
                      <Bell className="h-5 w-5 mr-3" />
                      Get job alerts
                    </button>
                  </div>

                  <hr className="my-4 border-gray-200 dark:border-gray-700" />

                  <button className="w-full flex items-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                    <Flag className="h-5 w-5 mr-3" />
                    Report company
                  </button>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {companyId}
                    </p>
                  </div>
                </div>

                {/* Similar Companies Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-teal-500" />
                    Similar Companies
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => {
                      // Use a different logo for each similar company
                      const similarLogoIndex = (logoIndex + i) % SAMPLE_IMAGES.logos.length;

                      return (
                        <div key={i} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                            <Image
                              src={SAMPLE_IMAGES.logos[similarLogoIndex]}
                              alt={`Similar Company ${i}`}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              Similar Company {i}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {company.industry} • {Math.floor(Math.random() * 5000) + 100} employees
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <button className="inline-flex items-center px-2.5 py-1.5 border border-teal-300 dark:border-teal-700 shadow-sm text-xs font-medium rounded-lg text-teal-700 dark:text-teal-300 bg-white dark:bg-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
                              View
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Company Insights Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-teal-500" />
                    Company Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Industry Rank</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">#12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Growth Rate</span>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">+24%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Job Openings</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{jobs.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Response Rate</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">87%</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full px-4 py-2 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-800 dark:text-teal-200 text-sm font-medium rounded-lg transition-colors">
                      View Full Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Helper functions
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

function formatSalary(salary: { min: number; max: number; currency: string }): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: salary.currency,
    maximumFractionDigits: 0,
  });

  return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
}

function isDeadlineSoon(dateString: string): boolean {
  const deadline = new Date(dateString);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= 3 && diffDays >= 0;
}


