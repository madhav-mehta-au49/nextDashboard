import React from 'react';
import Image from 'next/image';
import { 
  MapPin, 
  Users, 
  Globe, 
  Heart, 
  Share2, 
  Bookmark 
} from 'lucide-react';
import { Company } from '../../types';

interface CompanyHeaderProps {
  company: Company;
  isFollowing: boolean;
  onToggleFollow: () => void;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ 
  company, 
  isFollowing, 
  onToggleFollow 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Company Info */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {company.name}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {company.industry}
            </p>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{company.headquarters}</span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4 mr-2" />
                <span>{company.employees.toLocaleString()} employees</span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Globe className="h-4 w-4 mr-2" />
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {company.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {company.size}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Founded {company.founded}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onToggleFollow}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isFollowing 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600'
                }`}
              >
                <Heart className={`mr-2 h-4 w-4 ${isFollowing ? 'fill-current' : ''}`} />
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              
              <button 
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                title="Share company profile"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </button>
              
              <button 
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                title="Save to your list"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </button>
            </div>
          </div>
          
          {/* Followers Stats */}
          <div className="hidden md:block">
            <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-700 p-5 rounded-lg min-w-[180px]">
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Followers</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {company.followers.toLocaleString()}
              </span>
              
              {/* Follower Growth Chart (Simplified) */}
              <div className="relative w-full h-[60px] mb-2">
                <div className="absolute bottom-0 left-0 right-0 h-[40px] bg-blue-100 dark:bg-blue-900 rounded-md overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-[70%] h-[60%] bg-blue-400 dark:bg-blue-600 rounded-md"></div>
                  <div className="absolute bottom-0 left-[70%] w-[30%] h-[40%] bg-blue-300 dark:bg-blue-500 rounded-md"></div>
                </div>
              </div>
              
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +12% growth this month
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
