import React, { useState } from 'react';
import { SearchIcon, FilterIcon, XIcon } from 'lucide-react';
import { CompanyFilter } from '../../types';

interface CompanyFiltersProps {
  filters: CompanyFilter;
  onFilterChange: (filters: Partial<CompanyFilter>) => void;
}

export const CompanyFilters: React.FC<CompanyFiltersProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<CompanyFilter>(filters);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    const emptyFilters = {
      industry: '',
      size: '',
      location: '',
      searchTerm: ''
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Boolean(
    filters.industry || 
    filters.size || 
    filters.location || 
    filters.searchTerm
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <input
                name="searchTerm"
                placeholder="Search companies..."
                value={localFilters.searchTerm || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon className="w-5 h-5" />
              </div>
            </div>
            
            <button 
              type="button"
              className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 ${
                isExpanded 
                  ? 'bg-teal-50 text-teal-700 border-teal-200' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              } transition-colors`}
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
            >
              <FilterIcon className="w-5 h-5" />
              <span>Filters</span>
            </button>
            
            <button 
              type="submit" 
              className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Search
            </button>
          </div>
          
          {isExpanded && (
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select 
                    name="industry"
                    value={localFilters.industry || ''}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">All Industries</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="Energy">Energy</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                  <select 
                    name="size"
                    value={localFilters.size || ''}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Any Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1001+">1001+ employees</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select 
                    name="location"
                    value={localFilters.location || ''}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Any Location</option>
                    <option value="Remote">Remote</option>
                    <option value="United States">United States</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="Australia">Australia</option>
                    <option value="Africa">Africa</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button 
                  type="button" 
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 mr-2"
                  onClick={handleClear}
                >
                  Clear All
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
          
          {hasActiveFilters && !isExpanded && (
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="text-sm font-medium text-gray-700">Active filters:</div>
              
              {filters.industry && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                  Industry: {filters.industry}
                  <button
                    type="button"
                    onClick={() => onFilterChange({ industry: '' })}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {filters.size && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700">
                  Size: {filters.size}
                  <button
                    type="button"
                    onClick={() => onFilterChange({ size: '' })}
                    className="ml-2 text-green-500 hover:text-green-700"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {filters.location && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-50 text-purple-700">
                  Location: {filters.location}
                  <button
                    type="button"
                    onClick={() => onFilterChange({ location: '' })}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {filters.searchTerm && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-50 text-orange-700">
                  Search: {filters.searchTerm}
                  <button
                    type="button"
                    onClick={() => onFilterChange({ searchTerm: '' })}
                    className="ml-2 text-orange-500 hover:text-orange-700"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
