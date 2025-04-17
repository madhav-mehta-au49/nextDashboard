import React, { useState } from 'react';
import { FilterIcon, CheckIcon, XIcon } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
}

export const CompanyFilterMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    industry: [],
    size: [],
    location: []
  });

  const filterSections: FilterSection[] = [
    {
      id: 'industry',
      title: 'Industry',
      options: [
        { id: 'tech', label: 'Technology' },
        { id: 'health', label: 'Healthcare' },
        { id: 'finance', label: 'Finance' },
        { id: 'education', label: 'Education' },
        { id: 'retail', label: 'Retail' }
      ]
    },
    {
      id: 'size',
      title: 'Company Size',
      options: [
        { id: 'small', label: '1-50 employees' },
        { id: 'medium', label: '51-200 employees' },
        { id: 'large', label: '201-1000 employees' },
        { id: 'enterprise', label: '1000+ employees' }
      ]
    },
    {
      id: 'location',
      title: 'Location',
      options: [
        { id: 'remote', label: 'Remote' },
        { id: 'us', label: 'United States' },
        { id: 'europe', label: 'Europe' },
        { id: 'asia', label: 'Asia' }
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
  };

  const totalSelectedFilters = Object.values(selectedFilters).flat().length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
          totalSelectedFilters > 0 
            ? 'border-teal-300 bg-teal-50 text-teal-700' 
            : 'border-gray-300 text-gray-700 hover:border-gray-400'
        } transition-colors`}
      >
        <FilterIcon className="w-4 h-4" />
        <span>Filters</span>
        {totalSelectedFilters > 0 && (
          <span className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-teal-600 rounded-full">
            {totalSelectedFilters}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Filters</h3>
            {totalSelectedFilters > 0 && (
              <button 
                onClick={clearFilters}
                className="text-sm text-teal-600 hover:text-teal-700"
              >
                Clear all
              </button>
            )}
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filterSections.map(section => (
              <div key={section.id} className="p-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">{section.title}</h4>
                <div className="space-y-2">
                  {section.options.map(option => {
                    const isSelected = selectedFilters[section.id]?.includes(option.id);
                    return (
                      <label 
                        key={option.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div 
                          className={`w-5 h-5 flex items-center justify-center rounded border ${
                            isSelected 
                              ? 'bg-teal-600 border-teal-600' 
                              : 'border-gray-300'
                          }`}
                          onClick={() => toggleFilter(section.id, option.id)}
                        >
                          {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-gray-50 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
