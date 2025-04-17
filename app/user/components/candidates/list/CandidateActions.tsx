import React from 'react';
import { FiStar, FiMessageSquare, FiShare2, FiBookmark } from 'react-icons/fi';

export const CandidateActions: React.FC = () => {
  return (
    <div className="flex flex-row md:flex-col gap-2">
      <button 
        className="group p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-yellow-50 hover:border-yellow-200 transition-colors"
        title="Add to favorites"
      >
        <FiStar className="w-5 h-5 text-gray-600 group-hover:text-yellow-500" />
      </button>
      
      <button 
        className="group p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-colors"
        title="Message"
      >
        <FiMessageSquare className="w-5 h-5 text-gray-600 group-hover:text-blue-500" />
      </button>
      
      <button 
        className="group p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-green-50 hover:border-green-200 transition-colors"
        title="Share profile"
      >
        <FiShare2 className="w-5 h-5 text-gray-600 group-hover:text-green-500" />
      </button>
      
      <button 
        className="group p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-purple-50 hover:border-purple-200 transition-colors"
        title="Save profile"
      >
        <FiBookmark className="w-5 h-5 text-gray-600 group-hover:text-purple-500" />
      </button>
    </div>
  );
};
