import React from 'react';
import { 
  StarIcon, 
  MessageSquareIcon, 
  ShareIcon, 
  BookmarkIcon 
} from 'lucide-react';

export const CompanyActions: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <button 
        className="p-2 rounded-full text-gray-600 hover:text-yellow-500 hover:bg-yellow-50 transition-colors duration-200 group"
        aria-label="Add to favorites"
        title="Add to favorites"
      >
        <StarIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
      </button>
      
      <button 
        className="p-2 rounded-full text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-colors duration-200 group"
        aria-label="Message"
        title="Message"
      >
        <MessageSquareIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
      </button>
      
      <button 
        className="p-2 rounded-full text-gray-600 hover:text-green-500 hover:bg-green-50 transition-colors duration-200 group"
        aria-label="Share profile"
        title="Share profile"
      >
        <ShareIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
      </button>
      
      <button 
        className="p-2 rounded-full text-gray-600 hover:text-purple-500 hover:bg-purple-50 transition-colors duration-200 group"
        aria-label="Save profile"
        title="Save profile"
      >
        <BookmarkIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
      </button>
    </div>
  );
};
