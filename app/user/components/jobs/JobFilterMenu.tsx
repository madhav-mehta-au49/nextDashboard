"use client";

import React, { useState } from "react";
import { FiFilter, FiChevronDown, FiCheck } from "react-icons/fi";

export const JobFilterMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    jobType: [],
    experience: [],
    salary: [],
    remote: false
  });

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      if (category === 'remote') {
        return { ...prev, remote: !prev.remote };
      }
      
      const categoryFilters = [...prev[category]];
      const index = categoryFilters.indexOf(value);
      
      if (index === -1) {
        categoryFilters.push(value);
      } else {
        categoryFilters.splice(index, 1);
      }
      
      return { ...prev, [category]: categoryFilters };
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
      >
        <FiFilter className="mr-2 h-4 w-4 text-gray-500" />
        Filters
        <FiChevronDown className="ml-2 h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1 divide-y divide-gray-200">
            {/* Job Type */}
            <div className="px-4 py-3">
              <h3 className="text-sm font-medium text-gray-900">Job Type</h3>
              <div className="mt-2 space-y-2">
                {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      id={`job-type-${type}`}
                      name={`job-type-${type}`}
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      checked={filters.jobType.includes(type)}
                      onChange={() => toggleFilter('jobType', type)}
                    />
                    <label htmlFor={`job-type-${type}`} className="ml-2 text-sm text-gray-700">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="px-4 py-3">
              <h3 className="text-sm font-medium text-gray-900">Experience Level</h3>
              <div className="mt-2 space-y-2">
                {['Entry Level', 'Mid Level', 'Senior Level', 'Director', 'Executive'].map((level) => (
                  <div key={level} className="flex items-center">
                    <input
                      id={`experience-${level}`}
                      name={`experience-${level}`}
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      checked={filters.experience.includes(level)}
                      onChange={() => toggleFilter('experience', level)}
                    />
                    <label htmlFor={`experience-${level}`} className="ml-2 text-sm text-gray-700">
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div className="px-4 py-3">
              <h3 className="text-sm font-medium text-gray-900">Salary Range</h3>
              <div className="mt-2 space-y-2">
                {['$0-$50K', '$50K-$100K', '$100K-$150K', '$150K+'].map((range) => (
                  <div key={range} className="flex items-center">
                    <input
                      id={`salary-${range}`}
                      name={`salary-${range}`}
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      checked={filters.salary.includes(range)}
                      onChange={() => toggleFilter('salary', range)}
                    />
                    <label htmlFor={`salary-${range}`} className="ml-2 text-sm text-gray-700">
                      {range}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Remote */}
            <div className="px-4 py-3">
              <div className="flex items-center">
                <input
                  id="remote"
                  name="remote"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  checked={filters.remote}
                  onChange={() => toggleFilter('remote', null)}
                />
                <label htmlFor="remote" className="ml-2 text-sm text-gray-700">
                  Remote Only
                </label>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="px-4 py-3">
              <button
                type="button"
                className="w-full inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                onClick={() => setIsOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
