"use client";

import React from "react";
import Footer from '@/components/footer';
import SubHeader from '@/components/subheader';
import JobListingCard from "../components/jobs/jobCard";
import { JobFilterMenu } from "../components/jobs/JobFilterMenu";
import { JobSort } from "../components/jobs/JobSort";
import { RightSidebarCard } from '../components/jobs/SideCards';
import { FiSearch } from "react-icons/fi";
import Header from "@/app/web/components/header";
import EmployeeHeader from "@/components/EmployeeHeader";
import Link from "next/link"; // Add this import

// Add this utility function for creating SEO-friendly URLs
const createJobUrl = (jobId: string, jobTitle: string): string => {
  const slug = jobTitle
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
  return `/user/jobs/${jobId}/${slug}`;
};

export default function JobsPage() {
  const jobs = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA (Remote)",
      logoUrl: "/images/techcorp-logo.png",
      jobUrl: "https://example.com/job/1",
      description: "We are looking for a skilled Frontend Developer with 5+ years of experience in React and TypeScript to join our growing team. You'll be responsible for building responsive user interfaces and collaborating with backend developers.",
    },
    {
      id: "2",
      title: "Product Manager",
      company: "InnovateTech",
      location: "New York, NY",
      logoUrl: "/images/innovatetech-logo.png",
      jobUrl: "https://example.com/job/2",
      description: "Join our product team to lead the development of innovative SaaS solutions. You'll work closely with engineering, design, and marketing teams to define product strategy and roadmap.",
    },
    {
      id: "3",
      title: "UX/UI Designer",
      company: "DesignHub",
      location: "Remote",
      logoUrl: "/images/designhub-logo.png",
      jobUrl: "https://example.com/job/3",
      description: "We're seeking a creative UX/UI Designer to create beautiful, intuitive interfaces for our clients. You should have a strong portfolio showcasing your design process and final products.",
    },
  ];

  // Mock data for RightSidebarCard
  const featuredJobs = [
    { id: "1", title: "Data Scientist", company: "AI Solutions", skills: ["Python", "Machine Learning"] },
    { id: "2", title: "DevOps Engineer", company: "Cloud Systems", skills: ["AWS", "Kubernetes"] },
  ];

  const upcomingEvents = [
    { id: "1", title: "Tech Networking Mixer", date: "Nov 20, 2023", link: "https://techmixer.com" },
    { id: "2", title: "Career Fair 2023", date: "Dec 10, 2023", link: "https://careerfair.com" },
  ];

  const careerResources = [
    { id: "1", title: "Resume Writing Tips", description: "Learn how to craft the perfect resume", link: "https://example.com/resume-tips" },
    { id: "2", title: "Interview Preparation", description: "Ace your next interview with these strategies", link: "https://example.com/interview-prep" },
  ];

  const trendingSkills = [
    { id: "1", title: "Machine Learning", link: "https://example.com/machine-learning" },
    { id: "2", title: "React Native", link: "https://example.com/react-native" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <EmployeeHeader/>
      <SubHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-teal-700 mb-4 md:mb-0">Find Your Dream Job</h1>
          <div className="flex gap-4">
            <JobFilterMenu />
            <JobSort />
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Search for jobs, companies, or keywords"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
              Remote
              <button type="button" className="ml-1 inline-flex flex-shrink-0 h-4 w-4 rounded-full items-center justify-center text-teal-400 hover:bg-teal-200 hover:text-teal-500 focus:outline-none focus:bg-teal-500 focus:text-white">
                <span className="sr-only">Remove filter</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Full-time
              <button type="button" className="ml-1 inline-flex flex-shrink-0 h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white">
                <span className="sr-only">Remove filter</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Job Listings */}
          <div className="w-full lg:w-2/3 space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="flex">
                <div className="flex-1">
                  {/* Wrap the JobListingCard with Link to the detail page */}
                  <Link href={createJobUrl(job.id, job.title)}>
                    <JobListingCard
                      id={job.id}
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      logoUrl={job.logoUrl}
                      jobUrl={job.jobUrl}
                      description={job.description}
                    />
                  </Link>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border border-gray-200 rounded-lg sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </a>
                <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </a>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                    <span className="font-medium">97</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" aria-current="page" className="z-10 bg-teal-50 border-teal-500 text-teal-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      1
                    </a>
                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      2
                    </a>
                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      3
                    </a>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      10
                    </a>
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
            <RightSidebarCard
              featuredJobs={featuredJobs}
              upcomingEvents={upcomingEvents}
              careerResources={careerResources}
              trendingSkills={trendingSkills}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
