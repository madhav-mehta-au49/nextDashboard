"use client";

import React from "react";
import Footer from "../../../components/footer";
import SubHeader from "../../../components/subheader";
import { FiFilter, FiSearch, FiSliders, FiGrid, FiList } from "react-icons/fi";
import Header from "@/app/web/components/header";
import EmployeeHeader from "@/components/EmployeeHeader";

const filterSections = [
  {
    title: "Job Type",
    options: [
      { label: "Full-time", count: 234 },
      { label: "Part-time", count: 156 },
      { label: "Contract", count: 89 },
      { label: "Internship", count: 45 },
    ],
  },
  {
    title: "Experience Level",
    options: [
      { label: "Entry Level", count: 167 },
      { label: "Mid Level", count: 245 },
      { label: "Senior Level", count: 123 },
      { label: "Director", count: 34 },
    ],
  },
  {
    title: "Location",
    options: [
      { label: "Remote", count: 189 },
      { label: "Hybrid", count: 145 },
      { label: "On-site", count: 234 },
    ],
    showViewMore: true,
  },
  {
    title: "Salary Range",
    options: [
      { label: "$0-$50k", count: 123 },
      { label: "$50k-$100k", count: 234 },
      { label: "$100k-$150k", count: 167 },
      { label: "$150k+", count: 89 },
    ],
  },
];

// Mock job data
const jobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    logoUrl: "/images/company-logo-1.png",
    jobUrl: "/jobs/1",
    description: "We're looking for a senior software engineer to join our team.",
    salary: "$120k - $150k",
    postedDate: "2 days ago",
    type: "Full-time",
    isRemote: true,
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "Creative Studio",
    location: "New York, NY",
    logoUrl: "/images/company-logo-2.png",
    jobUrl: "/jobs/2",
    description: "Join our design team to create beautiful user experiences.",
    salary: "$90k - $110k",
    postedDate: "1 week ago",
    type: "Full-time",
    isRemote: false,
  },
  {
    id: "3",
    title: "Product Manager",
    company: "Product Pioneers",
    location: "Austin, TX",
    logoUrl: "/images/company-logo-3.png",
    jobUrl: "/jobs/3",
    description: "Lead product development for our growing startup.",
    salary: "$100k - $130k",
    postedDate: "3 days ago",
    type: "Full-time",
    isRemote: true,
  },
  {
    id: "4",
    title: "Marketing Specialist",
    company: "Growth Hackers",
    location: "Chicago, IL",
    logoUrl: "/images/company-logo-4.png",
    jobUrl: "/jobs/4",
    description: "Drive our marketing efforts and help us grow our audience.",
    salary: "$70k - $90k",
    postedDate: "5 days ago",
    type: "Contract",
    isRemote: false,
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <EmployeeHeader />
      <SubHeader />
      
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Find your next opportunity</p>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Search jobs, companies, or keywords"
                />
              </div>
              
              <div className="flex gap-2">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <FiFilter className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Filters
                </button>
                
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                  Search
                </button>
              </div>
            </div>
            
            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                Full-time
                <button className="ml-1 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
              
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                Remote
                <button className="ml-1 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sticky top-20">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h2>
                  <button className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">
                    Clear all
                  </button>
                </div>
                
                <div className="space-y-6">
                  {filterSections.map((section) => (
                    <div key={section.title} className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">{section.title}</h3>
                      <div className="space-y-2">
                        {section.options.map((option) => (
                          <div key={option.label} className="flex items-center">
                            <input
                              id={`filter-${section.title}-${option.label}`}
                              name={`filter-${section.title}`}
                              type="checkbox"
                              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`filter-${section.title}-${option.label}`}
                              className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex justify-between w-full"
                            >
                              {option.label}
                              <span className="text-gray-500 dark:text-gray-400">{option.count}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                      {section.showViewMore && (
                        <button className="mt-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">
                          View more
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Job Listings */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Job Listings</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Showing 1-10 of 256 jobs</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <label htmlFor="sort" className="sr-only">Sort by</label>
                      <select
                        id="sort"
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option>Most Relevant</option>
                        <option>Newest</option>
                        <option>Highest Salary</option>
                      </select>
                    </div>
                    
                    <div className="flex rounded-md shadow-sm">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <span className="sr-only">Grid view</span>
                        <FiGrid className="h-5 w-5" />
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
                        <span className="sr-only">List view</span>
                        <FiList className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                          {job.company.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {job.company} • {job.location}
                        </p>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {job.description}
                        </p>
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                            {job.type}
                          </span>
                          {job.isRemote && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              Remote
                            </span>
                          )}
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            {job.salary}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{job.postedDate}</span>
                        <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm font-medium transition-colors">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                      <span className="font-medium">256</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-teal-50 dark:bg-teal-900 text-sm font-medium text-teal-600 dark:text-teal-200">
                        2
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        3
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200">
                        ...
                      </span>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        8
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        9
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        10
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

