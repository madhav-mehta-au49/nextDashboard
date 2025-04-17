import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export const CandidateSort = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Relevance");

  const sortOptions = [
    "Relevance",
    "Most Recent",
    "Connections (High to Low)",
    "Experience (High to Low)",
    "Name (A-Z)"
  ];

  const handleSelect = (option: string) => {
    setSortOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>Sort: {sortOption}</span>
        <FiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <ul className="py-2">
            {sortOptions.map((option) => (
              <li key={option}>
                <button
                  className={`w-full text-left px-4 py-2 text-sm ${
                    sortOption === option 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
