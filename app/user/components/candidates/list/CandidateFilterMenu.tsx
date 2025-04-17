import { useState } from "react";
import { FiFilter, FiX } from "react-icons/fi";

export const CandidateFilterMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    availability: [] as string[],
    experience: [] as string[],
    skills: [] as string[]
  });

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter(item => item !== value);
      } else {
        newFilters[category] = [...newFilters[category], value];
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      availability: [],
      experience: [],
      skills: []
    });
  };

  const hasActiveFilters = Object.values(filters).some(category => category.length > 0);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
          hasActiveFilters 
            ? 'bg-blue-50 border-blue-300 text-blue-700' 
            : 'bg-white border-gray-300 text-gray-700'
        } hover:bg-gray-50 transition-colors`}
      >
        <FiFilter className="w-4 h-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">
            {Object.values(filters).flat().length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Filter Candidates</h3>
              {hasActiveFilters && (
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">Availability</h4>
            <div className="space-y-2">
              {['Actively looking', 'Open to opportunities', 'Not actively looking'].map((option) => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.availability.includes(option)}
                    onChange={() => toggleFilter('availability', option)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">Experience Level</h4>
            <div className="space-y-2">
              {[
                'Entry Level (0-2 years)',
                'Mid Level (3-5 years)',
                'Senior Level (6+ years)',
                'Executive (10+ years)'
              ].map((option) => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.experience.includes(option)}
                    onChange={() => toggleFilter('experience', option)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4">
            <h4 className="font-medium text-gray-700 mb-2">Skills</h4>
            <div className="space-y-2">
              {[
                'JavaScript',
                'Python',
                'React',
                'Product Management',
                'UI/UX Design'
              ].map((option) => (
                <label key={option} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.skills.includes(option)}
                    onChange={() => toggleFilter('skills', option)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-b-lg">
            <button 
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="absolute left-0 mt-2 flex flex-wrap gap-2 max-w-md">
          {Object.entries(filters).map(([category, values]) => 
            values.map(value => (
              <div 
                key={`${category}-${value}`} 
                className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                <span>{value}</span>
                <button 
                  onClick={() => toggleFilter(category as keyof typeof filters, value)}
                  className="ml-2 focus:outline-none"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
