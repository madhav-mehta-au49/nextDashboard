"use client";

import React from "react";
import Link from "next/link";
import { FiExternalLink, FiCalendar, FiBookmark, FiBriefcase } from "react-icons/fi";

interface FeaturedJob {
  id: string;
  title: string;
  company: string;
  skills: string[];
}

interface Event {
  id: string;
  title: string;
  date: string;
  link?: string;
}

interface CareerResource {
  id: string;
  title: string;
  description: string;
  link?: string;
}

interface TrendingSkill {
  id: string;
  title: string;
  link?: string;
}

interface RightSidebarCardProps {
  featuredJobs: FeaturedJob[];
  upcomingEvents: Event[];
  careerResources: CareerResource[];
  trendingSkills: TrendingSkill[];
}

export const RightSidebarCard: React.FC<RightSidebarCardProps> = ({
  featuredJobs,
  upcomingEvents,
  careerResources,
  trendingSkills,
}) => {
  return (
    <div className="space-y-6">
      {/* Featured Jobs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600">
          <h3 className="text-lg font-semibold text-white">Featured Jobs</h3>
        </div>
        <div className="p-6 space-y-4">
          {featuredJobs.map((job) => (
            <div key={job.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-start">
                <FiBriefcase className="text-teal-500 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">{job.title}</h4>
                  <p className="text-sm text-gray-500">{job.company}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-50 text-teal-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <Link 
                    href={`/jobs/${job.id}`}
                    className="mt-2 inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-500"
                  >
                    View Job <FiExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
          <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
        </div>
        <div className="p-6 space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-start">
                <FiCalendar className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500">{event.date}</p>
                  {event.link && (
                    <Link 
                      href={event.link}
                      className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Learn More <FiExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Resources */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600">
          <h3 className="text-lg font-semibold text-white">Career Resources</h3>
        </div>
        <div className="p-6 space-y-4">
          {careerResources.map((resource) => (
            <div key={resource.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-start">
                <FiBookmark className="text-teal-500 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">{resource.title}</h4>
                  <p className="text-sm text-gray-500">{resource.description}</p>
                  {resource.link && (
                    <Link 
                      href={resource.link}
                      className="mt-2 inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-500"
                    >
                      Read Article <FiExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Skills */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
          <h3 className="text-lg font-semibold text-white">Trending Skills</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {trendingSkills.map((skill) => (
              <Link 
                key={skill.id}
                href={skill.link || '#'}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                {skill.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Job Alert CTA */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Never Miss a Job Opportunity</h3>
          <p className="text-teal-100 mb-4">Get personalized job alerts delivered straight to your inbox</p>
          <button className="w-full bg-white text-teal-600 font-medium py-2 px-4 rounded-md hover:bg-teal-50 transition-colors">
            Create Job Alert
          </button>
        </div>
      </div>
    </div>
  );
};

