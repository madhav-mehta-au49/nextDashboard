"use client";

import React, { useState, useEffect } from "react";
import Footer from '@/components/footer';
import SubHeader from '@/components/subheader';
import JobListingCard from "../components/jobs/jobCard";
import { JobFilterMenu } from "../components/jobs/JobFilterMenu";
import { JobSort } from "../components/jobs/JobSort";
import { RightSidebarCard } from '../components/jobs/SideCards';
import { FiSearch } from "react-icons/fi";
import Header from "@/app/web/components/header";
import EmployeeHeader from "@/components/EmployeeHeader";
import Link from "next/link";
import { useJobSearch } from "@/hooks/useJobs";
import { JobSearchFilters } from "@/app/services/jobs";

// Add this utility function for creating SEO-friendly URLs
const createJobUrl = (jobId: string, jobTitle: string): string => {
  const slug = jobTitle
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
  return `/user/jobs/${jobId}/${slug}`;
};

export default function JobsPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState<JobSearchFilters>({});

  const {
    jobs,
    loading,
    error,
    meta,
    searchJobs,
    loadMore,
    hasMore
  } = useJobSearch();

  // Load jobs on component mount
  useEffect(() => {
    searchJobs({});
  }, []);
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchJobs({ ...filters, keyword: searchKeyword });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: JobSearchFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    searchJobs(updatedFilters);
  };

  // Get featured jobs from loaded jobs (featured ones)
  const featuredJobs = jobs.filter(job => job.featured).slice(0, 3).map(job => ({
    id: job.id.toString(),
    title: job.title,
    company: job.company.name,
    skills: job.required_skills.slice(0, 2)
  }));

  // Mock data for sidebar sections (these would come from separate APIs)
  const upcomingEvents = [
    { id: "1", title: "Tech Networking Mixer", date: "May 30, 2025", link: "#" },
    { id: "2", title: "Career Fair 2025", date: "Jun 15, 2025", link: "#" },
  ];

  const careerResources = [
    { id: "1", title: "Resume Writing Tips", description: "Learn how to craft the perfect resume", link: "#" },
    { id: "2", title: "Interview Preparation", description: "Ace your next interview with these strategies", link: "#" },
  ];

  const trendingSkills = [
    { id: "1", title: "React", link: "#" },
    { id: "2", title: "Python", link: "#" },
    { id: "3", title: "AWS", link: "#" },
    { id: "4", title: "Machine Learning", link: "#" },
  ];

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <EmployeeHeader />
        <SubHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <EmployeeHeader />
        <SubHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error loading jobs: {error}</p>
            <button
              onClick={() => searchJobs({})}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <EmployeeHeader />
      <SubHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-teal-700 mb-4 md:mb-0">Find Your Dream Job</h1>
          <div className="flex gap-4">
            <JobFilterMenu onFiltersChange={handleFilterChange} currentFilters={filters} />
            <JobSort />
          </div>
        </div>{/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Search for jobs, companies, or keywords"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.location_type && (
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                {filters.location_type}
                <button
                  type="button"
                  onClick={() => handleFilterChange({ location_type: undefined })}
                  className="ml-1 inline-flex flex-shrink-0 h-4 w-4 rounded-full items-center justify-center text-teal-400 hover:bg-teal-200 hover:text-teal-500 focus:outline-none focus:bg-teal-500 focus:text-white"
                >
                  <span className="sr-only">Remove filter</span>
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            )}
            {filters.job_type && (
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {filters.job_type}
                <button
                  type="button"
                  onClick={() => handleFilterChange({ job_type: undefined })}
                  className="ml-1 inline-flex flex-shrink-0 h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                >
                  <span className="sr-only">Remove filter</span>
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </form>

        <div className="flex flex-col lg:flex-row gap-8">          {/* Job Listings */}
          <div className="w-full lg:w-2/3 space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="flex">
                <div className="flex-1">
                  {/* Wrap the JobListingCard with Link to the detail page */}
                  <Link href={createJobUrl(job.id.toString(), job.title)}>
                    <JobListingCard
                      id={job.id.toString()}
                      title={job.title}
                      company={job.company.name}
                      location={job.location}
                      logoUrl={job.company.logo || ''}
                      jobUrl={`/user/jobs/${job.id}`}
                      description={job.description}
                      jobType={job.job_type}
                      locationType={job.location_type}
                      experienceLevel={job.experience_level}
                      skills={job.required_skills}
                      featured={job.featured}
                      urgent={job.urgent}
                      salaryRange={job.salary_range}
                    />
                  </Link>
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center py-6">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Loading...' : 'Load More Jobs'}
                </button>
              </div>
            )}

            {/* Results Summary */}
            {meta && (
              <div className="bg-white px-4 py-3 flex items-center justify-center border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  Showing {jobs.length} of {meta.total} jobs
                  {meta.current_page > 1 && ` (Page ${meta.current_page} of ${meta.last_page})`}
                </p>
              </div>
            )}
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
