"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiBookmark, FiShare2, FiThumbsUp, FiSend, FiMapPin } from "react-icons/fi";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  logoUrl: string;
  jobUrl: string;
  description: string;
  jobType?: string;
  locationType?: string;
  experienceLevel?: string;
  skills?: string[];
  featured?: boolean;
  urgent?: boolean;
  salaryRange?: string;
}

const JobListingCard = ({
  id,
  title,
  company,
  location,
  logoUrl,
  jobUrl,
  description,
  jobType = 'full-time',
  locationType = 'onsite',
  experienceLevel = 'mid',
  skills = [],
  featured = false,
  urgent = false,
  salaryRange
}: Job) => {
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 w-full h-full min-h-[280px] hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-100 transition-all duration-300 relative">      <div className="flex items-center mb-4">
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 mr-4">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${company} logo`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-700 font-bold">
            {company.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 line-clamp-2 flex items-center gap-2">
              {title}
              {featured && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
              {urgent && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Urgent
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-500">{company}</p>
          </div>
          {salaryRange && (
            <div className="text-right">
              <p className="text-sm font-medium text-teal-600">{salaryRange}</p>
            </div>
          )}
        </div>
      </div>
    </div>

      <p className="text-md text-gray-600 line-clamp-3 mb-4">
        {description}
      </p>

      <div className="flex items-center text-sm text-gray-500 mb-4">
        <FiMapPin className="mr-1 text-teal-500" />
        <span>{location}</span>
      </div>      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full capitalize">
          {jobType.replace('-', ' ')}
        </span>
        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full capitalize">
          {locationType}
        </span>        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full capitalize">
          {experienceLevel} Level
        </span>
        {skills && skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
            {skill}
          </span>
        ))}
        {skills && skills.length > 3 && (
          <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full">
            +{skills.length - 3} more
          </span>
        )}
      </div>

      <div className="flex justify-between items-center mt-auto">
        <div className="flex space-x-2">
          <button
            onClick={handleLike}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Like job"
          >
            <FiThumbsUp className={`h-5 w-5 ${likes > 0 ? 'text-teal-500' : 'text-gray-400'}`} />
            {likes > 0 && <span className="ml-1 text-xs text-gray-500">{likes}</span>}
          </button>
          <button
            onClick={handleBookmark}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Bookmark job"
          >
            <FiBookmark className={`h-5 w-5 ${bookmarked ? 'text-teal-500 fill-teal-500' : 'text-gray-400'}`} />
          </button>
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Share job"
          >
            <FiShare2 className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <Link
          href={`/jobs/${id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default JobListingCard;

