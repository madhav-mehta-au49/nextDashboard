import React, { useState, useEffect } from 'react';
import { SearchIcon, FilterIcon, XIcon } from 'lucide-react';

export interface CompanyFilter {
  industry: string;
  size: string;
  location: string;
  searchTerm: string;
}

interface CompanyFiltersProps {
  filters: CompanyFilter;
  onFilterChange: (filters: CompanyFilter) => void;
  industries?: { id: string; name: string }[];
  sizes?: { id: string; name: string }[];
  locations?: { id: string; name: string }[];
}

export const CompanyFilters: React.FC<CompanyFiltersProps> = ({ 
  filters, 
  onFilterChange,
  industries = [],
  sizes = [],
  locations = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<CompanyFilter>(filters);
  
  // If no custom options are provided, use these defaults
  const defaultIndustries = industries.length > 0 ? industries : [
    { id: 'technology', name: 'Technology' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'finance', name: 'Finance' },
    { id: 'education', name: 'Education' },
    { id: 'retail', name: 'Retail' },
    { id: 'manufacturing', name: 'Manufacturing' }
  ];
  
  const defaultSizes = sizes.length > 0 ? sizes : [
    { id: '1-50', name: '1-50 employees' },
    { id: '51-200', name: '51-200 employees' },
    { id: '201-1000', name: '201-1000 employees' },
    { id: '1001+', name: '1000+ employees' }
  ];
  
  const defaultLocations = locations.length > 0 ? locations : [
    { id: 'remote', name: 'Remote' },
    { id: 'us', name: 'United States' },
    { id: 'europe', name: 'Europe' },
    { id: 'asia', name: 'Asia' }
  ];
  
  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

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
              {localFilters.searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalFilters(prev => ({ ...prev, searchTerm: '' }));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <button 
              type="button"
              className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 ${
                isExpanded 
                  ? 'bg-teal-50 text-teal-700 border-teal-200' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <FilterIcon className="w-5 h-5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="flex items-center justify-center w-5 h-5 bg-teal-600 text-white text-xs font-medium rounded-full">
                  {(filters.industry ? 1 : 0) + (filters.size ? 1 : 0) + (filters.location ? 1 : 0)}
                </span>
              )}
            </button>
            
            <button 
              type="submit"
              className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Search
            </button>
          </div>
          
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-200">
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={localFilters.industry}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">All Industries</option>
                  {defaultIndustries.map(industry => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size
                </label>
                <select
                  id="size"
                  name="size"
                  value={localFilters.size}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Any Size</option>
                  {defaultSizes.map(size => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={localFilters.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Any Location</option>
                  {defaultLocations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {hasActiveFilters && (
                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-sm text-teal-600 hover:text-teal-800"
                  >
                    Clear all filters
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
