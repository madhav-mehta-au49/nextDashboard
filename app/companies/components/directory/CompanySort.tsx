import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface CompanySortProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

export const CompanySort: React.FC<CompanySortProps> = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'followers_desc', label: 'Most Followers' },
    { value: 'jobs_desc', label: 'Most Jobs' },
    { value: 'rating_desc', label: 'Highest Rating' },
    { value: 'newest', label: 'Newest' }
  ];

  return (
    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <div className="flex flex-col">
          <ArrowUpIcon className="w-3 h-3" />
          <ArrowDownIcon className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
