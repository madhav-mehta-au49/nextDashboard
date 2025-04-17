import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from 'lucide-react';
import { CompanyFilter } from '../../types';

interface SideFilterProps {
  filters: CompanyFilter;
  onFilterChange: (filters: Partial<CompanyFilter>) => void;
}

interface FilterSection {
  id: string;
  title: string;
  options: { id: string; label: string }[];
}

export const SideFilter: React.FC<SideFilterProps> = ({ filters, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    industry: true,
    size: true,
    location: true
  });

  const filterSections: FilterSection[] = [
    {
      id: 'industry',
      title: 'Industry',
      options: [
        { id: 'Technology', label: 'Technology' },
        { id: 'Healthcare', label: 'Healthcare' },
        { id: 'Finance', label: 'Finance' },
        { id: 'Education', label: 'Education' },
        { id: 'Retail', label: 'Retail' },
        { id: 'Manufacturing', label: 'Manufacturing' }
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
        { id: '1001+', label: '1001+ employees' }
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
        { id: 'Australia', label: 'Australia' },
        { id: 'Africa', label: 'Africa' }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleFilterSelect = (sectionId: string, value: string) => {
    onFilterChange({ [sectionId]: value === filters[sectionId as keyof CompanyFilter] ? '' : value });
  };

  const clearAllFilters = () => {
    onFilterChange({
      industry: '',
      size: '',
      location: '',
      searchTerm: filters.searchTerm // Preserve search term
    });
  };

  const hasActiveFilters = Boolean(
    filters.industry || 
    filters.size || 
    filters.location
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className="text-sm text-teal-600 hover:text-teal-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filterSections.map(section => (
          <div key={section.id} className="border-b border-gray-200 pb-4 last:border-0">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex justify-between items-center w-full text-left font-medium text-gray-900 mb-2"
            >
              {section.title}
              {expandedSections[section.id] ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
            
            {expandedSections[section.id] && (
              <div className="space-y-2 mt-2">
                {section.options.map(option => {
                  const isSelected = filters[section.id as keyof CompanyFilter] === option.id;
                  return (
                    <label 
                      key={option.id}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <div 
                        className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                          isSelected 
                            ? 'bg-teal-600 border-teal-600' 
                            : 'border-gray-300 group-hover:border-gray-400'
                        }`}
                        onClick={() => handleFilterSelect(section.id, option.id)}
                      >
                        {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
