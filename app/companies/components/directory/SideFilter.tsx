import React, { useState } from 'react';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, XIcon } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
  expanded?: boolean;
}

interface SideFilterProps {
  sections: FilterSection[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (sectionId: string, optionId: string, isSelected: boolean) => void;
  onClearAll: () => void;
}

export const SideFilter: React.FC<SideFilterProps> = ({
  sections,
  selectedFilters,
  onFilterChange,
  onClearAll
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    sections.reduce((acc, section) => ({
      ...acc,
      [section.id]: section.expanded !== false
    }), {})
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const totalSelectedFilters = Object.values(selectedFilters).flat().length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {totalSelectedFilters > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-teal-600 hover:text-teal-800 font-medium flex items-center"
          >
            <XIcon className="w-4 h-4 mr-1" />
            Clear all
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {sections.map((section) => (
          <div key={section.id} className="p-4">
            <button
              className="w-full flex justify-between items-center text-left"
              onClick={() => toggleSection(section.id)}
            >
              <h4 className="font-medium text-gray-900">{section.title}</h4>
              {expandedSections[section.id] ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections[section.id] && (
              <div className="mt-2 space-y-1">
                {section.options.map((option) => {
                  const isSelected = selectedFilters[section.id]?.includes(option.id);
                  return (
                    <div key={option.id} className="flex items-center">
                      <button
                        className={`flex items-center w-full p-2 rounded-md text-left ${
                          isSelected 
                            ? 'bg-teal-50 text-teal-700' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                        onClick={() => onFilterChange(section.id, option.id, !isSelected)}
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                            isSelected 
                              ? 'bg-teal-600 border-teal-600' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                          </div>
                          <span className="flex-1">{option.label}</span>
                          {option.count !== undefined && (
                            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                              {option.count}
                            </span>
                          )}
                        </button>
                      </div>
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
  
                      
