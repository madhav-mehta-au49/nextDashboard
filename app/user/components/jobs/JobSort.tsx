"use client";

import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export const JobSort = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Relevance");

  const sortOptions = [
    "Relevance",
    "Most Recent",
    "Salary: High to Low",
    "Salary: Low to High",
    "Company Name (A-Z)"
  ];

  const handleSelect = (option) => {
    setSortOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Sort: {sortOption}
        <FiChevronDown className="ml-2 h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option}
                className={`block px-4 py-2 text-sm w-full text-left ${
                  sortOption === option 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
