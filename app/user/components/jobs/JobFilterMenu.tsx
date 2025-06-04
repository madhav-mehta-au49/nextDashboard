"use client";

import React, { useState } from "react";
import { FiFilter, FiChevronDown } from "react-icons/fi";
import { JobSearchFilters } from "@/app/services/jobs";
import { PRIORITY_CURRENCIES, CURRENCY_SYMBOLS } from "@/app/utils/currency";

interface JobFilterMenuProps {
  onFiltersChange?: (filters: JobSearchFilters) => void;
  currentFilters?: JobSearchFilters;
}

export const JobFilterMenu = ({ onFiltersChange, currentFilters = {} }: JobFilterMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<JobSearchFilters>(currentFilters); const toggleFilter = (category: string, value: string | null) => {
    setFilters((prev: JobSearchFilters) => {
      if (category === 'location_type') {
        const currentArray = prev.location_type || [];
        const newArray = currentArray.includes(value as string)
          ? currentArray.filter((v: string) => v !== value)
          : [...currentArray, value as string];
        return { ...prev, location_type: newArray.length > 0 ? newArray : undefined };
      }

      if (category === 'job_type') {
        const currentArray = prev.job_type || [];
        const newArray = currentArray.includes(value as string)
          ? currentArray.filter((v: string) => v !== value)
          : [...currentArray, value as string];
        return { ...prev, job_type: newArray.length > 0 ? newArray : undefined };
      }

      if (category === 'experience_level') {
        const currentArray = prev.experience_level || [];
        const newArray = currentArray.includes(value as string)
          ? currentArray.filter((v: string) => v !== value)
          : [...currentArray, value as string];
        return { ...prev, experience_level: newArray.length > 0 ? newArray : undefined };
      }

      return prev;
    });
  };

  const handleApplyFilters = () => {
    onFiltersChange?.(filters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange?.({});
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
      </button>      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1 divide-y divide-gray-200">
            {/* Job Type */}
            <div className="px-4 py-3">
              <h3 className="text-sm font-medium text-gray-900">Job Type</h3>
              <div className="mt-2 space-y-2">                {['full-time', 'part-time', 'contract', 'internship', 'freelance'].map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    id={`job-type-${type}`}
                    name={`job-type-${type}`}
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    checked={filters.job_type?.includes(type) || false}
                    onChange={() => toggleFilter('job_type', type)}
                  />
                  <label htmlFor={`job-type-${type}`} className="ml-2 text-sm text-gray-700 capitalize">
                    {type.replace('-', ' ')}
                  </label>
                </div>
              ))}
              </div>
            </div>

            {/* Location Type */}
            <div className="px-4 py-3">
              <h3 className="text-sm font-medium text-gray-900">Location Type</h3>
              <div className="mt-2 space-y-2">                {['remote', 'hybrid', 'onsite'].map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    id={`location-type-${type}`}
                    name={`location-type-${type}`}
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    checked={filters.location_type?.includes(type) || false}
                    onChange={() => toggleFilter('location_type', type)}
                  />
                  <label htmlFor={`location-type-${type}`} className="ml-2 text-sm text-gray-700 capitalize">
                    {type}
                  </label>
                </div>
              ))}
              </div>
            </div>            {/* Experience Level */}
            <div className="px-4 py-3">
              <h3 className="text-sm font-medium text-gray-900">Experience Level</h3>
              <div className="mt-2 space-y-2">                {['entry', 'mid', 'senior', 'lead', 'executive'].map((level) => (
                <div key={level} className="flex items-center">
                  <input
                    id={`experience-${level}`}
                    name={`experience-${level}`}
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    checked={filters.experience_level?.includes(level) || false}
                    onChange={() => toggleFilter('experience_level', level)}
                  />
                  <label htmlFor={`experience-${level}`} className="ml-2 text-sm text-gray-700 capitalize">
                    {level} Level
                  </label>
                </div>
              ))}
              </div>
            </div>

            {/* Salary Range */}
            <div className="px-4 py-3 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Salary Range</h3>
              <div className="mt-2 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Min Salary</label>
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 focus:border-teal-500"                      value={filters.salary_min || ''}
                      onChange={(e) => setFilters((prev: JobSearchFilters) => ({ 
                        ...prev, 
                        salary_min: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Max Salary</label>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                      value={filters.salary_max || ''}
                      onChange={(e) => setFilters((prev: JobSearchFilters) => ({ 
                        ...prev, 
                        salary_max: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Currency</label>
                  <select
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                    value={filters.currency || 'INR'}
                    onChange={(e) => setFilters((prev: JobSearchFilters) => ({ 
                      ...prev, 
                      currency: e.target.value 
                    }))}
                  >                    {PRIORITY_CURRENCIES.map((currency) => {
                      const currencyInfo = CURRENCY_SYMBOLS[currency];
                      if (!currencyInfo) return null;
                      return (
                        <option key={currency} value={currency}>
                          {currencyInfo.symbol} {currencyInfo.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="px-4 py-3 flex gap-2">
              <button
                type="button"
                className="flex-1 inline-flex justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                onClick={clearFilters}
              >
                Clear
              </button>
              <button
                type="button"
                className="flex-1 inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                onClick={handleApplyFilters}
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
