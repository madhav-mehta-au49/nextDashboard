import React, { useState } from 'react';
import { FilterIcon, XIcon } from 'lucide-react';
import { CompanyFilter } from '@/services/api/companyService';

interface CompanyFilterMenuProps {
  onFilterChange: (filters: Partial<CompanyFilter>) => void;
}

export const CompanyFilterMenu: React.FC<CompanyFilterMenuProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    industry: [],
    size: [],
    location: []
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filterSections = [
    {
      id: 'industry',
      title: 'Industry',
      options: [
        { id: 'Technology', label: 'Technology' },
        { id: 'Healthcare', label: 'Healthcare' },
        { id: 'Finance', label: 'Finance' },
        { id: 'Education', label: 'Education' },
        { id: 'Retail', label: 'Retail' },
        { id: 'Manufacturing', label: 'Manufacturing' },
        { id: 'Media', label: 'Media & Entertainment' },
        { id: 'Hospitality', label: 'Hospitality & Tourism' }
      ]
    },
    {
      id: 'size',
      title: 'Company Size',
      options: [
        { id: '1-10', label: '1-10 employees' },
        { id: '11-50', label: '11-50 employees' },
        { id: '51-200', label: '51-200 employees' },
        { id: '201-500', label: '201-500 employees' },
        { id: '501-1000', label: '501-1000 employees' },
        { id: '1001-5000', label: '1001-5000 employees' },
        { id: '5001+', label: '5001+ employees' }
      ]
    },
    {
      id: 'location',
      title: 'Location',
      options: [
        { id: 'Remote', label: 'Remote' },
        { id: 'United States', label: 'United States' },
        { id: 'Europe', label: 'Europe' },
        { id: 'Asia', label: 'Asia' },
        { id: 'Canada', label: 'Canada' },
        { id: 'Australia', label: 'Australia' },
        { id: 'United Kingdom', label: 'United Kingdom' }
      ]
    }
  ];

  const toggleFilter = (sectionId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const currentSelection = [...(prev[sectionId] || [])];
      const index = currentSelection.indexOf(optionId);
      
      if (index >= 0) {
        currentSelection.splice(index, 1);
      } else {
        currentSelection.push(optionId);
      }
      
      return {
        ...prev,
        [sectionId]: currentSelection
      };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      industry: [],
      size: [],
      location: []
    });
    setSearchTerm('');
    onFilterChange({
      industry: undefined,
      size: undefined,
      location: undefined,
      search: undefined
    });
    setIsOpen(false);
  };

  const applyFilters = () => {
    const filters: Partial<CompanyFilter> = {};
    
    if (selectedFilters.industry.length > 0) {
      filters.industry = selectedFilters.industry.join(',');
    }
    
    if (selectedFilters.size.length > 0) {
      filters.size = selectedFilters.size.join(',');
    }
    
    if (selectedFilters.location.length > 0) {
      filters.location = selectedFilters.location.join(',');
    }
    
    if (searchTerm) {
      filters.search = searchTerm;
    }
    
    onFilterChange(filters);
    setIsOpen(false);
  };

  const totalSelectedFilters = Object.values(selectedFilters).flat().length + (searchTerm ? 1 : 0);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 ${
          totalSelectedFilters > 0 
            ? 'bg-teal-50 text-teal-700 border-teal-200' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        <FilterIcon className="h-4 w-4" />
        <span>Filters</span>
        {totalSelectedFilters > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
            {totalSelectedFilters}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900">Filters</h3>
              <button 
                onClick={clearFilters}
                className="text-sm text-teal-600 hover:text-teal-800"
              >
                Clear all
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filterSections.map((section) => (
              <div key={section.id} className="p-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">{section.title}</h4>
                <div className="space-y-2">
                  {section.options.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${section.id}-${option.id}`}
                        checked={selectedFilters[section.id]?.includes(option.id) || false}
                        onChange={() => toggleFilter(section.id, option.id)}
                        className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label 
                        htmlFor={`${section.id}-${option.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 flex justify-end gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
